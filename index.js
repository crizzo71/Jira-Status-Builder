import { JiraCliClient } from './jira-cli-client.js';
import { ReportGenerator } from './report-generator.js';
import { ManualInputCollector } from './manual-input.js';
import { ProjectSelector } from './project-selector.js';
import { config } from './config.js';
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
      return moment(newD);
    }
  };
};

async function generateExecutiveReport(selectedProject = null, selectedBoard = null, format = 'markdown') {
  try {
    console.log('🚀 Jira CLI Executive Report Generator');
    console.log('======================================\n');
    
    const jiraClient = new JiraCliClient();
    const reportGenerator = new ReportGenerator();
    const inputCollector = new ManualInputCollector();
    const projectSelector = new ProjectSelector(jiraClient);
    
    // Project and board selection
    let project, boards;
    if (selectedProject) {
      project = selectedProject;
      boards = Array.isArray(selectedBoard) ? selectedBoard : (selectedBoard ? [selectedBoard] : []);
      console.log(`📋 Using specified project: ${project.key}`);
      if (boards.length > 0) {
        if (boards.length === 1) {
          console.log(`🎯 Using specified board: ${boards[0].name}`);
        } else {
          console.log(`🎯 Using specified boards: ${boards.map(b => b.name).join(', ')}`);
        }
      }
    } else {
      // Try quick config selection first
      const quickSelection = await projectSelector.quickSelectFromConfig();
      if (quickSelection) {
        project = quickSelection.project;
        boards = quickSelection.boards;
      } else {
        // Interactive selection
        const selection = await projectSelector.selectProjectAndBoard();
        project = selection.project;
        boards = selection.boards;
      }
    }
    
    // Update jiraClient with selected project/boards
    jiraClient.setProjectAndBoard(project, boards);
    
    // Get issues data
    console.log('📊 Fetching issues from Jira...');
    const issues = await jiraClient.getIssuesUpdatedInPeriod(config.report.weeksBack);
    console.log(`✅ Found ${issues.length} issues updated in the last ${config.report.weeksBack} week${config.report.weeksBack === 1 ? '' : 's'}`);
    
    // Get velocity data
    console.log('📈 Calculating team velocity...');
    const velocityData = await jiraClient.getVelocityData();
    console.log(`✅ Retrieved velocity data for ${velocityData.length} periods`);
    
    // Get completed and in-progress issues for detailed sections
    console.log('🔍 Getting detailed issue breakdowns...');
    const completedIssues = await jiraClient.getCompletedIssues(config.report.weeksBack);
    const inProgressIssues = await jiraClient.getInProgressIssues();
    
    // Collect manual input
    console.log('📝 Loading manual input data...');
    const manualInput = await inputCollector.getInputData();
    
    // Generate report(s)
    const allIssues = [...completedIssues, ...inProgressIssues, ...issues];
    let projectSuffix = project.key;
    if (boards.length > 0) {
      if (boards.length === 1) {
        projectSuffix = `${project.key}-${boards[0].id}`;
      } else {
        projectSuffix = `${project.key}-multi-${boards.length}boards`;
      }
    }
    
    let filepath, reportContent;
    
    if (format === 'all') {
      console.log('🎯 Generating executive reports in all formats...');
      const reports = await reportGenerator.generateAllFormats(allIssues, velocityData, manualInput, project, boards);
      
      const markdownFile = `executive-report-${projectSuffix}-${moment().format('YYYY-MM-DD')}.md`;
      const htmlFile = `executive-report-${projectSuffix}-${moment().format('YYYY-MM-DD')}.html`;
      const textFile = `executive-report-${projectSuffix}-${moment().format('YYYY-MM-DD')}.txt`;
      
      const markdownPath = await reportGenerator.saveReport(reports.markdown, markdownFile, 'markdown');
      const htmlPath = await reportGenerator.saveReport(reports.html, htmlFile, 'html');
      const textPath = await reportGenerator.saveReport(reports.text, textFile, 'text');
      
      console.log(`\n🎉 Executive reports generated successfully!`);
      console.log(`📁 Markdown: ${markdownPath}`);
      console.log(`📁 Google Docs HTML: ${htmlPath}`);
      console.log(`📁 Plain Text: ${textPath}`);
      
      reportContent = reports.markdown; // Use markdown for preview
      
    } else {
      console.log(`🎯 Generating executive report (${format} format)...`);
      
      let extension, formatType;
      switch (format) {
        case 'html':
        case 'google-docs':
          reportContent = await reportGenerator.generateGoogleDocsReport(allIssues, velocityData, manualInput, project, boards);
          extension = 'html';
          formatType = 'html';
          break;
        case 'text':
        case 'plain-text':
          reportContent = await reportGenerator.generatePlainTextReport(allIssues, velocityData, manualInput, project, boards);
          extension = 'txt';
          formatType = 'text';
          break;
        case 'markdown':
        default:
          reportContent = await reportGenerator.generateExecutiveReport(allIssues, velocityData, manualInput, project, boards);
          extension = 'md';
          formatType = 'markdown';
          break;
      }
      
      const filename = `executive-report-${projectSuffix}-${moment().format('YYYY-MM-DD')}.${extension}`;
      filepath = await reportGenerator.saveReport(reportContent, filename, formatType);
      
      console.log(`\n🎉 Executive report generated successfully!`);
      console.log(`📁 Report saved to: ${filepath}`);
    }
    
    // Export raw data
    console.log('💾 Exporting raw data...');
    await reportGenerator.exportData(allIssues, velocityData, 'json', projectSuffix);
    await reportGenerator.exportData(allIssues, velocityData, 'csv', projectSuffix);
    
    if (format !== 'all') {
      console.log(`📊 Data exported to: data/ directory`);
      let boardsText = '';
      if (boards.length === 1) {
        boardsText = ` | Board: ${boards[0].name}`;
      } else if (boards.length > 1) {
        boardsText = ` | Boards: ${boards.map(b => b.name).join(', ')}`;
      } else {
        boardsText = ' | Project-wide';
      }
      console.log(`🎯 Project: ${project.key}${boardsText}`);
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('EXECUTIVE REPORT PREVIEW:');
    console.log('='.repeat(60));
    console.log(reportContent.substring(0, 800) + '...\n');
    
    console.log('💡 To update manual input, run: npm run input');
    console.log('💡 To select different project/board, run: npm run select');
    
  } catch (error) {
    console.error('❌ Error generating report:', error.message);
    
    if (error.message.includes('jira-cli is not installed')) {
      console.log('\n💡 Please install jira-cli:');
      console.log('   curl -sSL https://github.com/ankitpokhrel/jira-cli/releases/latest/download/install.sh | sh');
      console.log('   Or visit: https://github.com/ankitpokhrel/jira-cli');
    } else if (error.message.includes('JIRA_API_TOKEN')) {
      console.log('\n💡 Please configure your environment:');
      console.log('   1. Copy .env.example to .env');
      console.log('   2. Add your JIRA_API_TOKEN and project configuration');
      console.log('   3. Run: npm run init');
    }
  }
}

async function initializeJira() {
  try {
    const jiraClient = new JiraCliClient();
    await jiraClient.initializeJira();
  } catch (error) {
    console.error('❌ Initialization failed:', error.message);
  }
}

async function collectManualInput() {
  try {
    const inputCollector = new ManualInputCollector();
    await inputCollector.collectAndSave();
    console.log('✅ Manual input collection completed!');
  } catch (error) {
    console.error('❌ Manual input collection failed:', error.message);
  }
}

async function selectProjectAndBoard() {
  try {
    const jiraClient = new JiraCliClient();
    const projectSelector = new ProjectSelector(jiraClient);
    
    const selection = await projectSelector.selectProjectAndBoard();
    
    // Save selection to config for future use
    await saveSelectionToConfig(selection);
    
    console.log('\n✅ Project and board selection completed!');
    let selectionText = `📋 Selected: ${selection.project.key}`;
    if (selection.boards.length === 1) {
      selectionText += ` | ${selection.boards[0].name}`;
    } else if (selection.boards.length > 1) {
      selectionText += ` | ${selection.boards.length} boards: ${selection.boards.map(b => b.name).join(', ')}`;
    }
    console.log(selectionText);
    console.log('💡 Run "npm start" to generate a report with this selection');
    
  } catch (error) {
    console.error('❌ Project selection failed:', error.message);
  }
}

async function saveSelectionToConfig(selection) {
  try {
    const fs = await import('fs/promises');
    const configPath = './project-selection.json';
    
    const config = {
      project: selection.project,
      boards: selection.boards,
      selectedAt: new Date().toISOString()
    };
    
    await fs.writeFile(configPath, JSON.stringify(config, null, 2));
    console.log(`💾 Selection saved to ${configPath}`);
    
  } catch (error) {
    console.warn('Could not save selection to config:', error.message);
  }
}

async function loadSelectionFromConfig() {
  try {
    const fs = await import('fs/promises');
    const configPath = './project-selection.json';
    
    const data = await fs.readFile(configPath, 'utf-8');
    const config = JSON.parse(data);
    
    // Handle both old and new format
    const boards = config.boards || (config.board ? [config.board] : []);
    let selectionText = `📋 Loaded saved selection: ${config.project.key}`;
    if (boards.length === 1 && boards[0] && boards[0].name) {
      selectionText += ` | ${boards[0].name}`;
    } else if (boards.length > 1) {
      selectionText += ` | ${boards.length} boards`;
    }
    console.log(selectionText);
    
    return {
      project: config.project,
      boards: boards.filter(board => board && board.id && board.name) // Filter out invalid boards
    };
    
  } catch (error) {
    return null; // No saved selection
  }
}

// Check if required environment variables are set
function checkConfiguration() {
  const required = ['JIRA_API_TOKEN'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.log('\n💡 Please create a .env file based on .env.example');
    return false;
  }
  
  if (config.jira.projectKeys.length === 0) {
    console.warn('⚠️  No project keys configured. Please set JIRA_PROJECT_KEYS in .env');
  }
  
  return true;
}

// Command line argument handling
const command = process.argv[2];

// Check for format arguments (--format=html, --format=all, etc.)
let reportFormat = 'markdown';
const formatArg = process.argv.find(arg => arg.startsWith('--format='));
if (formatArg) {
  reportFormat = formatArg.split('=')[1];
}

// Get project argument (skip format arguments)
const projectArg = process.argv.slice(3).find(arg => !arg.startsWith('--'));

switch (command) {
  case 'init':
    initializeJira();
    break;
  case 'input':
    collectManualInput();
    break;
  case 'select':
    if (checkConfiguration()) {
      selectProjectAndBoard();
    }
    break;
  case 'quick':
    if (checkConfiguration()) {
      // Quick start with OCM
      const quickProject = { key: 'OCM', name: 'Open Cluster Management', id: 'quick' };
      generateExecutiveReport(quickProject, [], reportFormat);
    }
    break;
  case 'report':
  default:
    if (checkConfiguration()) {
      // Check for project argument (e.g., npm start OCM, npm start ROSA)
      if (projectArg) {
        const argProject = { 
          key: projectArg.toUpperCase(), 
          name: `Project ${projectArg.toUpperCase()}`, 
          id: 'argument' 
        };
        generateExecutiveReport(argProject, [], reportFormat);
      } else {
        // Try to load saved selection first
        loadSelectionFromConfig().then(savedSelection => {
          if (savedSelection) {
            generateExecutiveReport(savedSelection.project, savedSelection.boards, reportFormat);
          } else {
            generateExecutiveReport(null, null, reportFormat);
          }
        });
      }
    }
    break;
}