import Handlebars from 'handlebars';
// Using native Date instead of moment for now
const moment = (date) => {
  const d = date ? new Date(date) : new Date();
  return {
    format: (fmt) => {
      if (fmt === 'YYYY-MM-DD') return d.toISOString().split('T')[0];
      if (fmt === 'YYYY-MM-DD HH:mm:ss') return d.toISOString().replace('T', ' ').split('.')[0];
      if (fmt === 'MMM DD') return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (fmt === 'MMM DD, YYYY') return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      return d.toISOString();
    },
    subtract: (num, unit) => {
      const newD = new Date(d);
      if (unit === 'weeks') newD.setDate(newD.getDate() - (num * 7));
      if (unit === 'days') newD.setDate(newD.getDate() - num);
      return moment(newD);
    },
    isAfter: (other) => {
      const otherD = other.d || other;
      return d > otherD;
    },
    diff: (other, unit) => {
      const otherD = other.d || other;
      const diffMs = d - otherD;
      if (unit === 'days') return Math.floor(diffMs / (1000 * 60 * 60 * 24));
      return diffMs;
    },
    toISOString: () => d.toISOString(),
    d: d
  };
};
import fs from 'fs/promises';
import path from 'path';

export class ReportGenerator {
  constructor() {
    this.templateCache = new Map();
  }

  async loadTemplate(templateName) {
    if (this.templateCache.has(templateName)) {
      return this.templateCache.get(templateName);
    }

    const templatePath = path.join(process.cwd(), 'templates', `${templateName}.hbs`);
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    const compiledTemplate = Handlebars.compile(templateContent);
    
    this.templateCache.set(templateName, compiledTemplate);
    return compiledTemplate;
  }

  categorizeJiraCliIssues(issues) {
    const now = moment();
    const oneWeekAgo = moment().subtract(7, 'days');
    
    const categorized = {
      completed: [],
      inProgress: [],
      newIssues: [],
      needsAttention: []
    };

    issues.forEach(issue => {
      const created = moment(issue.created);
      const updated = moment(issue.updated);
      const status = (issue.status || '').toLowerCase();
      
      // Normalize issue data from jira-cli format
      const normalizedIssue = {
        key: issue.key,
        summary: issue.summary,
        status: issue.status,
        assignee: issue.assignee,
        priority: issue.priority,
        issuetype: issue.issuetype || issue.type,
        created: issue.created,
        updated: issue.updated,
        resolution: issue.resolution,
        url: issue.url,
        epic: issue.epic,
        parent: issue.parent
      };
      
      // Check if issue was created this week
      if (created.isAfter(oneWeekAgo)) {
        categorized.newIssues.push(normalizedIssue);
      }
      
      // Check completion status
      if (issue.resolution && 
          ['done', 'resolved', 'closed', 'fixed'].some(s => status.includes(s))) {
        categorized.completed.push(normalizedIssue);
      }
      
      // Check in progress
      else if (['in progress', 'in review', 'testing', 'code review'].some(s => status.includes(s))) {
        categorized.inProgress.push(normalizedIssue);
      }
      
      // Check for issues needing attention (stale, blocked, etc.)
      const daysSinceUpdate = now.diff(updated, 'days');
      if (daysSinceUpdate > 3 && !issue.resolution) {
        categorized.needsAttention.push({
          ...normalizedIssue,
          lastUpdated: updated.format('YYYY-MM-DD'),
          reason: daysSinceUpdate > 7 ? 'Stale (no updates for over a week)' : 'No recent updates'
        });
      }
    });

    // Also provide aliases for template compatibility
    return {
      ...categorized,
      completedIssues: categorized.completed,
      inProgressIssues: categorized.inProgress,
      issuesNeedingAttention: categorized.needsAttention
    };
  }

  calculateVelocityMetrics(velocityData) {
    if (!velocityData || velocityData.length === 0) {
      return {
        average: 0,
        unit: 'items',
        trend: 'No data available',
        data: []
      };
    }

    // Determine if we're using story points or throughput
    const hasStoryPoints = velocityData.some(item => item.storyPoints && item.storyPoints > 0);
    const unit = hasStoryPoints ? 'story points' : 'items';
    
    // Calculate averages
    const values = velocityData.map(item => 
      hasStoryPoints ? item.storyPoints : item.completedCount
    );
    
    const average = Math.round(values.reduce((sum, val) => sum + val, 0) / values.length * 10) / 10;
    
    // Determine trend
    let trend = 'Stable';
    if (values.length >= 2) {
      const recent = values.slice(-2);
      const older = values.slice(0, -2);
      
      if (recent.length >= 2 && older.length >= 1) {
        const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
        const olderAvg = older.reduce((sum, val) => sum + val, 0) / older.length;
        
        if (recentAvg > olderAvg * 1.1) trend = 'Increasing';
        else if (recentAvg < olderAvg * 0.9) trend = 'Decreasing';
      }
    }

    // Format data for template
    const formattedData = velocityData.map(item => ({
      period: item.sprint || item.weekEnding || 'Period',
      value: hasStoryPoints ? item.storyPoints : item.completedCount
    }));

    return {
      average,
      unit,
      trend,
      data: formattedData
    };
  }

  async generateExecutiveReport(issues, velocityData, manualInput, project = null, boards = []) {
    const template = await this.loadTemplate('weekly-summary');
    const categorized = this.categorizeJiraCliIssues(issues);
    const velocity = this.calculateVelocityMetrics(velocityData);
    
    const startDate = moment().subtract(1, 'weeks').format('MMM DD');
    const endDate = moment().format('MMM DD, YYYY');
    
    const projectInfo = project ? `${project.key} - ${project.name}` : 'Multi-Cluster Management Engineering';
    
    // Generate team name from boards
    let teamName = 'Multi-Cluster Management Engineering';
    if (boards && boards.length > 0) {
      if (boards.length === 1) {
        teamName = boards[0].name;
      } else {
        teamName = `${projectInfo} (${boards.length} teams)`;
      }
    } else if (project) {
      teamName = projectInfo;
    }
    
    // Generate board info for display
    let boardInfo = '';
    if (boards && boards.length > 0) {
      if (boards.length === 1) {
        boardInfo = boards[0].name;
      } else {
        boardInfo = `${boards.length} boards: ${boards.map(b => b.name).join(', ')}`;
      }
    }
    
    const data = {
      dateRange: `${startDate} - ${endDate}`,
      totalIssues: issues.length,
      generatedOn: moment().format('YYYY-MM-DD HH:mm:ss'),
      projectInfo: projectInfo,
      teamName: teamName,
      boardInfo: boardInfo,
      velocity,
      manualInput: manualInput || {},
      boards: boards || [],
      multiBoard: boards && boards.length > 1,
      ...categorized
    };

    return template(data);
  }

  async saveReport(content, filename, format = 'markdown') {
    const reportsDir = path.join(process.cwd(), 'reports');
    let subDir;
    
    switch (format) {
      case 'html':
      case 'google-docs':
        subDir = 'google-docs';
        break;
      case 'text':
      case 'plain-text':
        subDir = 'plain-text';
        break;
      case 'markdown':
      default:
        subDir = 'markdown';
        break;
    }
    
    const formatDir = path.join(reportsDir, subDir);
    
    try {
      await fs.access(formatDir);
    } catch {
      await fs.mkdir(formatDir, { recursive: true });
    }

    const filepath = path.join(formatDir, filename);
    await fs.writeFile(filepath, content, 'utf-8');
    return filepath;
  }

  async generateAllFormats(issues, velocityData, manualInput, project = null, boards = []) {
    console.log('📝 Generating multiple report formats...');
    
    const results = {};
    
    // Generate Markdown (original)
    results.markdown = await this.generateExecutiveReport(issues, velocityData, manualInput, project, boards);
    
    // Generate HTML for Google Docs
    results.html = await this.generateGoogleDocsReport(issues, velocityData, manualInput, project, boards);
    
    // Generate Plain Text
    results.text = await this.generatePlainTextReport(issues, velocityData, manualInput, project, boards);
    
    return results;
  }

  async generateGoogleDocsReport(issues, velocityData, manualInput, project = null, boards = []) {
    const template = await this.loadTemplate('google-docs');
    const categorized = this.categorizeJiraCliIssues(issues);
    const velocity = this.calculateVelocityMetrics(velocityData);
    
    const startDate = moment().subtract(1, 'weeks').format('MMM DD');
    const endDate = moment().format('MMM DD, YYYY');
    
    const projectInfo = project ? `${project.key} - ${project.name}` : 'Multi-Cluster Management Engineering';
    
    // Generate team name from boards
    let teamName = 'Multi-Cluster Management Engineering';
    if (boards && boards.length > 0) {
      if (boards.length === 1) {
        teamName = boards[0].name;
      } else {
        teamName = `${projectInfo} (${boards.length} teams)`;
      }
    } else if (project) {
      teamName = projectInfo;
    }
    
    // Generate board info for display
    let boardInfo = '';
    if (boards && boards.length > 0) {
      if (boards.length === 1) {
        boardInfo = boards[0].name;
      } else {
        boardInfo = `${boards.length} boards: ${boards.map(b => b.name).join(', ')}`;
      }
    }
    
    const data = {
      dateRange: `${startDate} - ${endDate}`,
      totalIssues: issues.length,
      generatedOn: moment().format('YYYY-MM-DD HH:mm:ss'),
      projectInfo: projectInfo,
      teamName: teamName,
      boardInfo: boardInfo,
      velocity,
      manualInput: manualInput || {},
      boards: boards || [],
      multiBoard: boards && boards.length > 1,
      workBreakdown: this.calculateWorkBreakdown(categorized),
      ...categorized
    };

    return template(data);
  }

  async generatePlainTextReport(issues, velocityData, manualInput, project = null, boards = []) {
    const template = await this.loadTemplate('plain-text');
    const categorized = this.categorizeJiraCliIssues(issues);
    const velocity = this.calculateVelocityMetrics(velocityData);
    
    const startDate = moment().subtract(1, 'weeks').format('MMM DD');
    const endDate = moment().format('MMM DD, YYYY');
    
    const projectInfo = project ? `${project.key} - ${project.name}` : 'Multi-Cluster Management Engineering';
    
    // Generate team name from boards
    let teamName = 'Multi-Cluster Management Engineering';
    if (boards && boards.length > 0) {
      if (boards.length === 1) {
        teamName = boards[0].name;
      } else {
        teamName = `${projectInfo} (${boards.length} teams)`;
      }
    } else if (project) {
      teamName = projectInfo;
    }
    
    // Generate board info for display
    let boardInfo = '';
    if (boards && boards.length > 0) {
      if (boards.length === 1) {
        boardInfo = boards[0].name;
      } else {
        boardInfo = `${boards.length} boards: ${boards.map(b => b.name).join(', ')}`;
      }
    }
    
    const data = {
      dateRange: `${startDate} - ${endDate}`,
      totalIssues: issues.length,
      generatedOn: moment().format('YYYY-MM-DD HH:mm:ss'),
      projectInfo: projectInfo,
      teamName: teamName,
      boardInfo: boardInfo,
      velocity,
      manualInput: manualInput || {},
      boards: boards || [],
      multiBoard: boards && boards.length > 1,
      workBreakdown: this.calculateWorkBreakdown(categorized),
      ...categorized
    };

    return template(data);
  }

  calculateWorkBreakdown(categorized) {
    const total = categorized.completedIssues.length + categorized.inProgressIssues.length + categorized.issuesNeedingAttention.length;
    
    if (total === 0) {
      return { completedPercentage: 0, inProgressPercentage: 0, attentionPercentage: 0 };
    }
    
    return {
      completedPercentage: Math.round((categorized.completedIssues.length / total) * 100),
      inProgressPercentage: Math.round((categorized.inProgressIssues.length / total) * 100),
      attentionPercentage: Math.round((categorized.issuesNeedingAttention.length / total) * 100)
    };
  }

  async exportData(issues, velocityData, format = 'json', projectSuffix = '') {
    const dataDir = path.join(process.cwd(), 'data');
    
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }

    const timestamp = moment().format('YYYY-MM-DD');
    const suffix = projectSuffix ? `-${projectSuffix}` : '';
    
    if (format === 'json') {
      const data = {
        exportDate: moment().toISOString(),
        issues,
        velocityData,
        summary: {
          totalIssues: issues.length,
          averageVelocity: this.calculateVelocityMetrics(velocityData).average
        }
      };
      
      const filepath = path.join(dataDir, `jira-export${suffix}-${timestamp}.json`);
      await fs.writeFile(filepath, JSON.stringify(data, null, 2));
      return filepath;
    }
    
    // CSV export for issues
    if (format === 'csv') {
      const csvHeaders = 'Key,Summary,Status,Assignee,Priority,Type,Created,Updated,Resolution\n';
      const csvRows = issues.map(issue => 
        `"${issue.key}","${issue.summary}","${issue.status}","${issue.assignee || ''}","${issue.priority}","${issue.issuetype || ''}","${issue.created}","${issue.updated}","${issue.resolution || ''}"`
      ).join('\n');
      
      const filepath = path.join(dataDir, `jira-issues${suffix}-${timestamp}.csv`);
      await fs.writeFile(filepath, csvHeaders + csvRows);
      return filepath;
    }
  }
}