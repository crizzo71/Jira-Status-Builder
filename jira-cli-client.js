import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { config } from './config.js';

// Fallback to direct REST API since jira-cli has permission issues
const USE_DIRECT_API = true;

export class JiraCliClient {
  constructor() {
    this.checkJiraCliInstalled();
    this.selectedProject = null;
    this.selectedBoard = null;
    this.requestDelay = 250; // 250ms delay between requests to avoid rate limiting
  }

  async delay(ms = this.requestDelay) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  extractEpicInfo(fields) {
    // Try different fields that might contain Epic information
    const epicLink = fields.customfield_12311140; // Epic Link custom field
    const issueLinks = fields.issuelinks || [];
    
    // Check Epic Link custom field first
    if (epicLink) {
      return {
        key: epicLink,
        summary: 'Epic',
        url: `${config.jira.baseUrl}/browse/${epicLink}`
      };
    }
    
    // Look for Epic in issue links
    for (const link of issueLinks) {
      if (link.type?.name === 'Epic-Story Link' || link.type?.inward === 'is epic of') {
        const epic = link.inwardIssue || link.outwardIssue;
        if (epic && epic.fields?.issuetype?.name === 'Epic') {
          return {
            key: epic.key,
            summary: epic.fields.summary || 'Epic',
            url: `${config.jira.baseUrl}/browse/${epic.key}`
          };
        }
      }
    }
    
    return null;
  }

  async fetchEpicProgress(epicKey) {
    try {
      // Fetch all issues linked to this Epic
      const jql = `"Epic Link" = ${epicKey} OR parent = ${epicKey}`;
      const url = `${config.jira.baseUrl}/rest/api/2/search`;
      const params = new URLSearchParams({
        jql: jql,
        fields: 'key,status,issuetype',
        maxResults: '100'
      });
      
      await this.delay(); // Rate limiting
      
      const response = await fetch(`${url}?${params}`, {
        headers: {
          'Authorization': `Bearer ${config.jira.apiToken}`,
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        console.warn(`Could not fetch Epic progress for ${epicKey}`);
        return { total: 0, completed: 0, percentage: 0 };
      }
      
      const data = await response.json();
      const issues = data.issues;
      
      const total = issues.length;
      const completed = issues.filter(issue => 
        ['Done', 'Resolved', 'Closed'].includes(issue.fields.status.name)
      ).length;
      
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      
      return { total, completed, percentage };
      
    } catch (error) {
      console.warn(`Error fetching Epic progress for ${epicKey}: ${error.message}`);
      return { total: 0, completed: 0, percentage: 0 };
    }
  }

  async enrichIssuesWithEpicProgress(issues) {
    const epicKeys = new Set();
    const epicProgressCache = new Map();
    
    // Collect all unique Epic keys
    issues.forEach(issue => {
      if (issue.epic && issue.epic.key) {
        epicKeys.add(issue.epic.key);
      }
    });
    
    // Fetch progress for each Epic
    console.log(`Fetching progress for ${epicKeys.size} unique Epics...`);
    for (const epicKey of epicKeys) {
      const progress = await this.fetchEpicProgress(epicKey);
      epicProgressCache.set(epicKey, progress);
    }
    
    // Enrich issues with Epic progress
    return issues.map(issue => {
      if (issue.epic && issue.epic.key) {
        const progress = epicProgressCache.get(issue.epic.key);
        if (progress) {
          issue.epic.progress = progress;
        }
      }
      return issue;
    });
  }

  setProjectAndBoard(project, boards = []) {
    this.selectedProject = project;
    this.selectedBoards = Array.isArray(boards) ? boards : (boards ? [boards] : []);
    
    if (this.selectedBoards.length === 0) {
      console.log(`🎯 JiraClient configured for project: ${project.key}`);
    } else if (this.selectedBoards.length === 1) {
      console.log(`🎯 JiraClient configured for project: ${project.key}, board: ${this.selectedBoards[0].name}`);
    } else {
      console.log(`🎯 JiraClient configured for project: ${project.key}, ${this.selectedBoards.length} boards: ${this.selectedBoards.map(b => b.name).join(', ')}`);
    }
    
    // For backward compatibility
    this.selectedBoard = this.selectedBoards.length > 0 ? this.selectedBoards[0] : null;
  }

  checkJiraCliInstalled() {
    try {
      execSync('jira version', { stdio: 'pipe' });
    } catch (error) {
      throw new Error('jira-cli is not installed. Please install it from: https://github.com/ankitpokhrel/jira-cli');
    }
  }

  async initializeJira() {
    console.log('🔧 Initializing Jira CLI configuration...');
    
    if (!config.jira.apiToken) {
      throw new Error('JIRA_API_TOKEN environment variable is required');
    }

    try {
      const initCommand = `jira init --server=${config.jira.baseUrl} --auth-type=${config.jira.authType}`;
      console.log(`Running: ${initCommand}`);
      console.log('Please follow the prompts to complete authentication setup.');
      
      execSync(initCommand, { stdio: 'inherit' });
      console.log('✅ Jira CLI initialized successfully');
    } catch (error) {
      throw new Error(`Failed to initialize Jira CLI: ${error.message}`);
    }
  }

  buildJQLQuery(options = {}) {
    const {
      projectKeys = this.selectedProject ? [this.selectedProject.key] : config.jira.projectKeys,
      weeksBack = config.report.weeksBack,
      status = null,
      orderBy = 'updated DESC'
    } = options;

    let jql = '';
    
    // Use selected project if available, otherwise fall back to config
    const projects = projectKeys && projectKeys.length > 0 ? projectKeys : ['OCM'];
    jql += `project in (${projects.join(',')})`;
    
    // Note: Board filtering is handled separately via the Agile API
    // JQL doesn't support "board = id" syntax directly

    if (weeksBack) {
      const weeksAgo = new Date();
      weeksAgo.setDate(weeksAgo.getDate() - (weeksBack * 7));
      const dateString = weeksAgo.toISOString().split('T')[0];
      
      if (jql) jql += ' AND ';
      jql += `updated >= "${dateString}"`;
    }

    if (status) {
      if (jql) jql += ' AND ';
      if (Array.isArray(status)) {
        jql += `status in (${status.join(',')})`;
      } else {
        jql += `status = "${status}"`;
      }
    }

    if (orderBy) {
      jql += ` ORDER BY ${orderBy}`;
    }

    return jql;
  }

  async executeQuery(jql, format = 'json') {
    if (USE_DIRECT_API) {
      return this.executeDirectApiQuery(jql);
    }
    
    try {
      const command = `jira issue list --jql="${jql}" --plain --no-headers --columns=key,summary,status,assignee,updated,created,priority,resolution --no-truncate`;
      console.log(`Executing JQL: ${jql}`);
      
      const result = execSync(command, { 
        encoding: 'utf8',
        maxBuffer: 1024 * 1024 * 10, // 10MB buffer
        env: {
          ...process.env,
          JIRA_API_TOKEN: config.jira.apiToken
        }
      });
      
      if (format === 'json') {
        // Parse the tab-separated output into JSON
        return this.parseTableOutput(result);
      }
      return result;
    } catch (error) {
      console.error('Error executing Jira query:', error.message);
      throw error;
    }
  }

  async executeDirectApiQuery(jql) {
    try {
      console.log(`Executing JQL via REST API: ${jql}`);
      
      // If boards are selected, get issues from all selected boards
      if (this.selectedBoards && this.selectedBoards.length > 0 && this.selectedBoards[0] && this.selectedBoards[0].id) {
        return await this.getIssuesFromMultipleBoards(jql);
      }
      
      const url = `${config.jira.baseUrl}/rest/api/2/search`;
      const params = new URLSearchParams({
        jql: jql,
        fields: 'key,summary,status,assignee,updated,created,priority,resolution,issuetype,issuelinks,parent,customfield_12311140,epic',
        maxResults: '100'
      });
      
      const response = await fetch(`${url}?${params}`, {
        headers: {
          'Authorization': `Bearer ${config.jira.apiToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Convert Jira API response to our expected format
      return data.issues.map(issue => ({
        key: issue.key,
        summary: issue.fields.summary,
        status: issue.fields.status.name,
        assignee: issue.fields.assignee ? issue.fields.assignee.displayName : null,
        updated: issue.fields.updated,
        created: issue.fields.created,
        priority: issue.fields.priority ? issue.fields.priority.name : 'None',
        resolution: issue.fields.resolution ? issue.fields.resolution.name : null,
        issuetype: issue.fields.issuetype.name,
        url: `${config.jira.baseUrl}/browse/${issue.key}`,
        epic: this.extractEpicInfo(issue.fields),
        parent: issue.fields.parent ? {
          key: issue.fields.parent.key,
          summary: issue.fields.parent.fields?.summary || 'Unknown',
          url: `${config.jira.baseUrl}/browse/${issue.fields.parent.key}`
        } : null
      }));
      
    } catch (error) {
      console.error('Error executing direct API query:', error.message);
      throw error;
    }
  }

  parseTableOutput(output) {
    const lines = output.trim().split('\n').filter(line => line.trim());
    const issues = [];
    
    for (const line of lines) {
      const columns = line.split('\t').map(col => col.trim());
      if (columns.length >= 7) {
        issues.push({
          key: columns[0],
          summary: columns[1],
          status: columns[2],
          assignee: columns[3] || null,
          updated: columns[4],
          created: columns[5],
          priority: columns[6],
          resolution: columns[7] || null,
          issuetype: 'Story' // Default, since we can't get this from the columns
        });
      }
    }
    
    return issues;
  }

  async getIssuesUpdatedInPeriod(weeksBack = config.report.weeksBack) {
    const jql = this.buildJQLQuery({ weeksBack });
    const issues = await this.executeQuery(jql);
    return await this.enrichIssuesWithEpicProgress(issues);
  }

  async getCompletedIssues(weeksBack = config.report.weeksBack) {
    const completedStatuses = ['Done', 'Resolved', 'Closed'];
    const jql = this.buildJQLQuery({ 
      weeksBack, 
      status: completedStatuses.map(s => `"${s}"`),
      orderBy: 'resolutiondate DESC'
    });
    const issues = await this.executeQuery(jql);
    return await this.enrichIssuesWithEpicProgress(issues);
  }

  async getInProgressIssues() {
    const inProgressStatuses = ['In Progress', 'In Review', 'Testing', 'Code Review'];
    const jql = this.buildJQLQuery({ 
      status: inProgressStatuses.map(s => `"${s}"`),
      weeksBack: null,
      orderBy: 'priority DESC, updated DESC'
    });
    const issues = await this.executeQuery(jql);
    return await this.enrichIssuesWithEpicProgress(issues);
  }

  async getVelocityData(sprintCount = config.report.velocitySprintsCount) {
    try {
      console.warn('Sprint data not available, using throughput calculation');
      return await this.getThroughputData();
    } catch (error) {
      console.warn('Could not retrieve velocity data, returning empty array');
      return [];
    }
  }

  async getThroughputData(weeksBack = config.report.velocitySprintsCount) {
    const throughputData = [];
    
    for (let week = 0; week < weeksBack; week++) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (week * 7) - 7);
      const weekEnd = new Date();
      weekEnd.setDate(weekEnd.getDate() - (week * 7));
      
      const jql = this.buildJQLQuery({
        weeksBack: null,
        status: ['"Done"', '"Resolved"', '"Closed"'],
        orderBy: null
      }) + ` AND resolutiondate >= "${weekStart.toISOString().split('T')[0]}" AND resolutiondate <= "${weekEnd.toISOString().split('T')[0]}"`;
      
      const completedIssues = await this.executeQuery(jql);
      
      throughputData.push({
        weekEnding: weekEnd.toISOString().split('T')[0],
        completedCount: completedIssues.length,
        storyPoints: this.calculateStoryPoints(completedIssues)
      });
    }
    
    return throughputData.reverse(); // Most recent first
  }

  calculateStoryPoints(issues) {
    return issues.reduce((total, issue) => {
      const storyPoints = issue.storyPoints || issue['Story Points'] || 0;
      return total + (parseFloat(storyPoints) || 0);
    }, 0);
  }

  async exportToCSV(jql, filename) {
    try {
      // Get data and convert to CSV manually since --output=csv isn't supported
      const issues = this.executeQuery(jql);
      const csvHeaders = 'Key,Summary,Status,Assignee,Updated,Created,Priority,Resolution\n';
      const csvRows = issues.map(issue => 
        `"${issue.key}","${issue.summary}","${issue.status}","${issue.assignee || ''}","${issue.updated}","${issue.created}","${issue.priority}","${issue.resolution || ''}"`
      ).join('\n');
      
      writeFileSync(filename, csvHeaders + csvRows);
      console.log(`✅ Data exported to ${filename}`);
      return filename;
    } catch (error) {
      throw new Error(`Failed to export to CSV: ${error.message}`);
    }
  }

  async getIssuesFromBoard(baseJql) {
    try {
      console.log(`Getting issues from board ${this.selectedBoard.id}`);
      
      const url = `${config.jira.baseUrl}/rest/agile/1.0/board/${this.selectedBoard.id}/issue`;
      const params = new URLSearchParams({
        jql: baseJql,
        fields: 'key,summary,status,assignee,updated,created,priority,resolution,issuetype,issuelinks,parent,customfield_12311140,epic',
        maxResults: '100'
      });
      
      const response = await fetch(`${url}?${params}`, {
        headers: {
          'Authorization': `Bearer ${config.jira.apiToken}`,
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        console.warn(`Could not get issues from board ${this.selectedBoard.id}, falling back to project-wide search`);
        // Fall back to regular project search
        return await this.executeProjectQuery(baseJql);
      }
      
      const data = await response.json();
      
      // Convert Agile API response to our format
      return data.issues.map(issue => ({
        key: issue.key,
        summary: issue.fields.summary,
        status: issue.fields.status.name,
        assignee: issue.fields.assignee ? issue.fields.assignee.displayName : null,
        updated: issue.fields.updated,
        created: issue.fields.created,
        priority: issue.fields.priority ? issue.fields.priority.name : 'None',
        resolution: issue.fields.resolution ? issue.fields.resolution.name : null,
        issuetype: issue.fields.issuetype.name,
        url: `${config.jira.baseUrl}/browse/${issue.key}`,
        epic: this.extractEpicInfo(issue.fields),
        parent: issue.fields.parent ? {
          key: issue.fields.parent.key,
          summary: issue.fields.parent.fields?.summary || 'Unknown',
          url: `${config.jira.baseUrl}/browse/${issue.fields.parent.key}`
        } : null
      }));
      
    } catch (error) {
      console.warn(`Error getting issues from board: ${error.message}, falling back to project search`);
      // Fall back to regular project search
      return await this.executeProjectQuery(baseJql);
    }
  }

  async getIssuesFromMultipleBoards(baseJql) {
    try {
      console.log(`Getting issues from ${this.selectedBoards.length} boards`);
      
      const allIssues = [];
      const issueKeys = new Set(); // To avoid duplicates
      
      for (const board of this.selectedBoards) {
        try {
          console.log(`  - Fetching from board: ${board.name}`);
          
          // Add delay to avoid rate limiting
          await this.delay();
          
          const url = `${config.jira.baseUrl}/rest/agile/1.0/board/${board.id}/issue`;
          const params = new URLSearchParams({
            jql: baseJql,
            fields: 'key,summary,status,assignee,updated,created,priority,resolution,issuetype,issuelinks,parent,customfield_12311140,epic',
            maxResults: '100'
          });
          
          const response = await fetch(`${url}?${params}`, {
            headers: {
              'Authorization': `Bearer ${config.jira.apiToken}`,
              'Accept': 'application/json'
            }
          });
          
          if (!response.ok) {
            console.warn(`Could not get issues from board ${board.name}, skipping`);
            continue;
          }
          
          const data = await response.json();
          
          // Convert and deduplicate issues with full data transformation
          const boardIssues = data.issues.map(issue => ({
            key: issue.key,
            summary: issue.fields.summary,
            status: issue.fields.status.name,
            assignee: issue.fields.assignee ? issue.fields.assignee.displayName : null,
            updated: issue.fields.updated,
            created: issue.fields.created,
            priority: issue.fields.priority ? issue.fields.priority.name : 'None',
            resolution: issue.fields.resolution ? issue.fields.resolution.name : null,
            issuetype: issue.fields.issuetype.name,
            url: `${config.jira.baseUrl}/browse/${issue.key}`,
            epic: this.extractEpicInfo(issue.fields),
            parent: issue.fields.parent ? {
              key: issue.fields.parent.key,
              summary: issue.fields.parent.fields?.summary || 'Unknown',
              url: `${config.jira.baseUrl}/browse/${issue.fields.parent.key}`
            } : null,
            boardName: board.name // Add board source for tracking
          }));
          
          // Add unique issues only
          boardIssues.forEach(issue => {
            if (!issueKeys.has(issue.key)) {
              issueKeys.add(issue.key);
              allIssues.push(issue);
            }
          });
          
          console.log(`    ✅ Found ${boardIssues.length} issues (${allIssues.length} total unique)`);
          
        } catch (boardError) {
          console.warn(`Error fetching from board ${board.name}: ${boardError.message}`);
          continue;
        }
      }
      
      if (allIssues.length === 0) {
        console.warn('No issues found from any boards, falling back to project-wide search');
        return await this.executeProjectQuery(baseJql);
      }
      
      return allIssues;
      
    } catch (error) {
      console.warn(`Error getting issues from multiple boards: ${error.message}, falling back to project search`);
      return await this.executeProjectQuery(baseJql);
    }
  }

  async executeProjectQuery(jql) {
    // This is the original direct API query logic without board filtering
    const url = `${config.jira.baseUrl}/rest/api/2/search`;
    const params = new URLSearchParams({
      jql: jql,
      fields: 'key,summary,status,assignee,updated,created,priority,resolution,issuetype,issuelinks,parent,customfield_12311140,epic',
      maxResults: '100'
    });
    
    const response = await fetch(`${url}?${params}`, {
      headers: {
        'Authorization': `Bearer ${config.jira.apiToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return data.issues.map(issue => ({
      key: issue.key,
      summary: issue.fields.summary,
      status: issue.fields.status.name,
      assignee: issue.fields.assignee ? issue.fields.assignee.displayName : null,
      updated: issue.fields.updated,
      created: issue.fields.created,
      priority: issue.fields.priority ? issue.fields.priority.name : 'None',
      resolution: issue.fields.resolution ? issue.fields.resolution.name : null,
      issuetype: issue.fields.issuetype.name,
      url: `${config.jira.baseUrl}/browse/${issue.key}`,
      epic: this.extractEpicInfo(issue.fields),
      parent: issue.fields.parent ? {
        key: issue.fields.parent.key,
        summary: issue.fields.parent.fields?.summary || 'Unknown',
        url: `${config.jira.baseUrl}/browse/${issue.fields.parent.key}`
      } : null
    }));
  }
}