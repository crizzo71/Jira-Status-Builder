# Jira Executive Report Generator - How-To Guide

## Table of Contents
1. [Quick Start](#quick-start)
2. [First Time Setup](#first-time-setup)
3. [Selecting Projects and Boards](#selecting-projects-and-boards)
4. [Advanced Board Selection (NEW)](#advanced-board-selection-new)
5. [Generating Reports](#generating-reports)
6. [Enhanced Report Features (NEW)](#enhanced-report-features-new)
7. [Shareable Formats (NEW)](#shareable-formats-new)
8. [Adding Manual Input](#adding-manual-input)
9. [Understanding Reports](#understanding-reports)
10. [Troubleshooting](#troubleshooting)
11. [Advanced Usage](#advanced-usage)

---

## Quick Start

If you've already set up the app, here's the fastest way to generate a report:

```bash
# Navigate to the project directory
cd /Users/christinerizzo/Claude/Jira_summary

# Generate a report with current settings
npm start
```

---

## First Time Setup

### Step 1: Get Your Red Hat Jira Personal Access Token

1. **Visit Red Hat Jira:** https://issues.redhat.com
2. **Log in** with your Red Hat credentials
3. **Go to Account Settings** → **Security** → **API Tokens**
4. **Create a new token**:
   - Click "Create API token"
   - Give it a name like "Executive Reports"
   - Copy the generated token (you'll need this in Step 3)

### Step 2: Configure Environment

```bash
# Copy the environment template
cp .env.example .env

# Edit the .env file with your token
nano .env
```

**Update these values in `.env`:**
```bash
JIRA_API_TOKEN=your_personal_access_token_here
JIRA_PROJECT_KEYS=OCM  # You can change this later
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Test Your Setup

```bash
npm start
```

If successful, you'll see a report generated for the OCM project.

---

## Selecting Projects and Boards

### Interactive Project Selection

```bash
npm run select
```

This will show you:
1. **920+ Available Projects** - All Red Hat Jira projects you can access
2. **Project Selection Menu** - Choose by number or enter custom project key
3. **Board Selection** - If available, choose specific Kanban boards
4. **Saved Configuration** - Your selection is saved for future use

### Example Selection Process

```
📋 AVAILABLE PROJECTS
=====================
1. OCM - Open Cluster Management
2. ROSA - Red Hat OpenShift Service on AWS
3. HYPERSHIFT - HyperShift
...
929. OCM - Open Cluster Management

Select a project (1-930): 929

🎯 AVAILABLE BOARDS FOR OCM
==============================
1. OCM Kanban Board (kanban)
2. OCM Sprint Board (scrum)
3. Use project-wide queries (all boards)

Select a board (1-3): 1

✅ Selection saved to project-selection.json
```

### Project Selection Options

- **Single Project**: Focus reports on one specific project
- **Multiple Projects**: Use comma-separated project keys in `.env`
- **Specific Board**: Filter to particular Kanban/Scrum boards
- **Project-Wide**: Include all boards within a project

---

## Advanced Board Selection (NEW)

The system now supports multiple advanced board selection methods for precise targeting and comprehensive reporting.

### How Advanced Board Selection Works

When you run `npm run select`, you'll see enhanced options:

```
🎯 BOARD SELECTION FOR OCM
====================================
1. Select single board
2. Select multiple boards
3. Enter board ID(s) manually
4. Use project-wide queries (all boards)
```

### Option 1: Single Board
- Choose one specific board (original functionality)
- Best for focused team reports
- Example: "OCM Kanban Board"

### Option 2: Multiple Boards (NEW)
- Select multiple boards using flexible input methods
- **Comma-separated lists**: `1,3,5` (boards 1, 3, and 5)
- **Ranges**: `1-3` (boards 1, 2, and 3)
- **Combined**: `1,3,5-7,9` (boards 1, 3, 5, 6, 7, and 9)

**Example Multi-Board Selection:**
```
📋 AVAILABLE BOARDS (Multiple Selection)
========================================
1. OCM Kanban Board (kanban)
2. ROSA Sprint Board (scrum)
3. HyperShift Planning (kanban)
4. ACM Development (scrum)
5. CS Core Team (kanban)

Select boards: 1,3,5
✅ Selected 3 boards:
   - OCM Kanban Board (kanban)
   - HyperShift Planning (kanban)
   - CS Core Team (kanban)
```

### Option 3: Manual Board ID Input (NEW)
- Enter specific board IDs directly
- **Most precise control** over board selection
- Useful when you know exact board IDs
- Perfect for automated workflows or scripting

**How to find Board IDs:**
- **Jira Board URL**: Look for `rapidView=20600` in the URL
  - Example: `https://issues.redhat.com/secure/RapidBoard.jspa?rapidView=20600`
  - Board ID: `20600`
- **API Endpoint**: `/rest/agile/1.0/board` (for developers)
- **Previous selections**: Board IDs are shown in selection confirmations

**Example Board ID Selection:**
```
🎯 MANUAL BOARD ID SELECTION
============================
💡 Enter board ID(s) separated by commas (e.g., 20600,17975,17291)
💡 You can get board IDs from:
   - Jira board URL: .../secure/RapidBoard.jspa?rapidView=20600
   - API endpoint: /rest/agile/1.0/board
   - Or from previous board listings

Enter board ID(s): 20600,17975,17291

✅ Found board: OCM Deployment (scrum)
✅ Found board: OCM Clusters Service (kanban)  
✅ Found board: OCM Core Management (kanban)

✅ Successfully configured 3 board(s):
   - ID: 20600 | OCM Deployment (scrum)
   - ID: 17975 | OCM Clusters Service (kanban)
   - ID: 17291 | OCM Core Management (kanban)
```

**Common OCM Board IDs:**
- `20600` - OCM Deployment (Scrum)
- `17975` - OCM Clusters Service (Kanban)
- `17291` - OCM Core Management (Kanban)
- `20782` - OCM Reliability (Scrum)

### Option 4: Project-Wide
- Uses all boards within the project
- Comprehensive coverage
- Good for organization-wide reports

### Advanced Board Selection Benefits
- **Unified Reporting**: Single report from multiple team boards
- **Precise Targeting**: Board ID input allows exact board selection
- **Data Deduplication**: Automatically removes duplicate issues
- **Board Source Tracking**: See which board each issue came from
- **Board-Focused Velocity**: Metrics calculated only from selected boards
- **Automation Ready**: Board IDs perfect for scripted workflows
- **Cross-Team Collaboration**: Combine boards from different teams

---

## Generating Reports

### Standard Report Generation

```bash
npm start
```

**What happens:**
1. Uses your saved project/board selection
2. Fetches issues updated within the last 7 days
3. Calculates team velocity (6 periods)
4. Loads any manual input data
5. Generates executive report
6. Exports raw data (JSON/CSV)

### Report Output

Generated files:
- **Report:** `reports/executive-report-OCM-2025-08-06.md`
- **Raw Data:** `data/jira-export-OCM-2025-08-06.json`
- **CSV Data:** `data/jira-issues-OCM-2025-08-06.csv`

### Report Contents

Your executive report includes:

**1.0 Team Performance Metrics**
- Team velocity (automated from Jira)
- Key activities and accomplishments
- Completed work breakdown with **clickable issue links**
- **Epic progress tracking** with percentage completion
- **Parent-child issue relationships** for sub-tasks

**2.0 Team Morale and Culture**
- Associate morale (manual input)
- Celebrations and achievements (manual input)

**3.0 Roadmap and Forward-Looking**
- Upcoming priorities (from in-progress issues)
- Potential blockers (manual input)
- **Epic progress visualization** with progress bars

**4.0 Detailed Metrics**
- Work breakdown statistics
- Issues requiring attention
- **Team name display** from selected Kanban boards

---

## Enhanced Report Features (NEW)

### Pretty Links & Navigation
- **All Issues**: Every Jira issue key is now a clickable link to Red Hat Jira
- **Epic Links**: Parent Epic information with direct links and progress tracking
- **Parent Links**: Sub-task parent issues with clickable references
- **Easy Navigation**: Click any issue key to open directly in Jira

### Epic Progress Tracking
- **Progress Percentages**: Shows completion status (e.g., "25% (2/8 issues)")
- **Visual Progress Bars**: HTML reports include colored progress indicators
- **Epic Hierarchies**: Clear parent-child Epic relationships
- **Completion Tracking**: Real-time Epic progress across all selected boards

### Team Name Display
- **Board-Based Team Names**: Automatically shows team names from Kanban board selection
- **Multi-Board Teams**: Displays consolidated team information (e.g., "OCM - Open Cluster Management (2 teams)")
- **Single Board Teams**: Shows specific board name as team identifier
- **Board ID Teams**: When using manual board IDs, shows selected board names
- **Project-Wide**: Falls back to project name for comprehensive queries

### Board-Focused Reporting (NEW)
- **Precise Issue Filtering**: Reports include only issues from selected boards
- **Board-Specific Velocity**: Throughput calculated exclusively from chosen boards
- **Accurate Team Metrics**: Performance data reflects actual team scope
- **Clean Data**: No cross-contamination from unrelated project boards
- **Targeted Insights**: Focus on specific team or area performance

### Enhanced Issue Context
- **Parent-Child Relationships**: Sub-tasks show their parent issue links
- **Epic Associations**: All issues display their Epic membership with progress
- **Issue Types**: Clear identification of tasks, stories, bugs, epics
- **Priority Indicators**: Visual priority levels for better triage

### Example Enhanced Display

**Markdown Format:**
```markdown
- **[OCM-17469](https://issues.redhat.com/browse/OCM-17469)** - Feature toggle maintenance
  - Epic: **[OCM-17467](https://issues.redhat.com/browse/OCM-17467)** - Epic (25% complete - 2/8 issues)
  - Parent: **[OCM-17468](https://issues.redhat.com/browse/OCM-17468)** - Reliability epic
```

**HTML Format:**
- Visual progress bars with colors
- Professional styling for executive sharing
- Click-to-navigate issue links
- Team name prominently displayed in report header

---

## Shareable Formats (NEW)

The system now generates reports in multiple formats optimized for different sharing scenarios.

### Available Formats

**1. Markdown Format** (Original)
- File: `reports/markdown/executive-report-OCM-2025-08-06.md`
- Best for: Technical teams, GitHub, documentation systems
- Command: `npm start` or `npm run report`

**2. Google Docs HTML Format** (NEW)
- File: `reports/google-docs/executive-report-OCM-2025-08-06.html`
- Best for: Executive sharing, Google Docs, presentations
- Command: `npm run share` or `npm run report:html`

**3. Plain Text Format** (NEW)
- File: `reports/plain-text/executive-report-OCM-2025-08-06.txt`
- Best for: Email, Slack, simple copy-paste
- Command: `npm run report:text`

### Generate All Formats

**One Command for All:**
```bash
npm run report:all
```

**Creates 3 files:**
- `reports/markdown/executive-report-OCM-2025-08-06.md`
- `reports/google-docs/executive-report-OCM-2025-08-06.html`
- `reports/plain-text/executive-report-OCM-2025-08-06.txt`

### Google Docs Sharing Workflow

**Step 1: Generate HTML Format**
```bash
npm run share
```

**Step 2: Open and Copy**
```bash
open reports/google-docs/executive-report-OCM-2025-08-06.html
# Copy the entire content from the browser
```

**Step 3: Paste into Google Docs**
- Create new Google Doc
- Paste the HTML content
- Formatting, colors, and tables are preserved
- Ready for executive distribution

### Format-Specific Features

**Google Docs HTML:**
- Professional styling with Google's color scheme
- Clean tables and formatted sections
- Executive-ready presentation
- Optimized for copy-paste into Google Docs
- **Visual Epic progress bars** with color-coded completion
- **Clickable issue links** that work in Google Docs
- **Team name display** in professional header format

**Plain Text:**
- Clean formatting for email/Slack
- ASCII tables and bullet points
- No special characters or formatting
- Universal compatibility

**Markdown:**
- Original technical format
- GitHub/documentation friendly
- Version control compatible
- Technical team preferred

### Multi-Board Filename Conventions

**Single Board:**
```
executive-report-OCM-18212-2025-08-06.html
```

**Multiple Boards:**
```
executive-report-OCM-multi-5boards-2025-08-06.html
```

**Project-Wide:**
```
executive-report-OCM-2025-08-06.html
```

---

## Adding Manual Input

### Collect Qualitative Data

```bash
npm run input
```

**Interactive prompts cover:**

**Team Morale:**
- Team sentiment assessment
- Current challenges
- Support needed from leadership

**Celebrations:**
- Team celebrations or positive feedback
- Individual kudos and shoutouts
- Noteworthy achievements

**Milestones:**
- Major project milestones reached
- Releases or deliverables completed

**Forward-Looking:**
- Upcoming priorities for next period
- Potential blockers or risks

**Velocity Context:**
- Notable trends in team velocity
- Explanations for velocity anomalies

### Manual Input Storage

- **File:** `manual-input.json`
- **Persistent:** Data saved between sessions
- **Editable:** Can update individual sections
- **Optional:** Reports work without manual input

---

## Understanding Reports

### Velocity Metrics

**How it's calculated:**
- **Throughput Method**: Issues completed per week over 6 periods
- **Average Velocity**: Mean completion rate
- **Trend Analysis**: Comparing recent vs. older periods

**Example Output:**
```
Average Velocity: 15 items
Velocity Trend: Increasing
Recent Performance:
- Week ending 2025-08-06: 18 items
- Week ending 2025-07-30: 16 items
- Week ending 2025-07-23: 12 items
```

### Issue Categorization

**Completed Issues:**
- Status: Done, Resolved, Closed
- Time frame: Last 7 days
- Sorted by resolution date
- **Includes clickable links** to Red Hat Jira
- **Shows Epic progress** and parent relationships

**In Progress Issues:**
- Status: In Progress, In Review, Testing, Code Review
- Sorted by priority and update date
- **Epic progress tracking** with visual indicators
- **Parent-child relationships** clearly displayed

**Issues Requiring Attention:**
- No updates in 3+ days
- Not resolved
- Potential blockers
- **Epic context** to understand impact
- **Direct navigation links** for quick action

### Report Quality Indicators

**Good Report:**
- ✅ 10+ issues found
- ✅ Velocity data available
- ✅ Manual input completed
- ✅ Recent activity
- ✅ Epic progress data populated
- ✅ Team name correctly displayed

**Needs Attention:**
- ⚠️ Very few issues found
- ⚠️ No completed work
- ⚠️ Many stale issues

---

## Troubleshooting

### Common Issues

**"Missing required environment variables"**
```bash
# Check your .env file exists and has JIRA_API_TOKEN
cat .env
```

**"403 Forbidden" errors**
```bash
# Your token may be expired, generate a new one
# Update JIRA_API_TOKEN in .env file
```

**"No issues found"**
- Check project key is correct
- Verify you have access to the project
- Try a different time period

**"Command not found"**
```bash
# Make sure you're in the right directory
cd /Users/christinerizzo/Claude/Jira_summary

# Check if dependencies are installed
npm install
```

### Debug Mode

Check what's happening:
```bash
# View current configuration
cat .env

# Check saved project selection
cat project-selection.json

# View generated reports
ls -la reports/
```

### Getting Help

**Test API Access:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" "https://issues.redhat.com/rest/api/2/myself"
```

**Check Project Access:**
```bash
npm run select  # Browse available projects
```

---

## Advanced Usage

### Multiple Projects

Edit `.env` for multiple projects:
```bash
JIRA_PROJECT_KEYS=OCM,ROSA,HYPERSHIFT
```

### Custom Time Periods

Edit `.env`:
```bash
REPORT_WEEKS_BACK=2        # Look back 2 weeks instead of 1
VELOCITY_SPRINTS_COUNT=10  # Use 10 periods for velocity
```

### Automation

**Daily Reports:**
```bash
# Add to cron job
0 9 * * * cd /path/to/Jira_summary && npm start
```

**Weekly Team Email:**
```bash
#!/bin/bash
cd /path/to/Jira_summary
npm start
# Email the generated report
cat reports/executive-report-OCM-$(date +%Y-%m-%d).md | mail -s "Weekly Team Report" team@company.com
```

### Custom Templates

Edit `templates/weekly-summary.hbs` to modify report format:
```handlebars
# Add custom sections
## 5.0 Custom Metrics
{{#if customData}}
{{customData}}
{{/if}}
```

### Data Analysis

**Export for Excel:**
```bash
# CSV files in data/ directory can be opened in Excel
open data/jira-issues-OCM-2025-08-06.csv
```

**JSON Processing:**
```bash
# Use jq for JSON analysis
cat data/jira-export-OCM-2025-08-06.json | jq '.summary'
```

---

## Command Reference

### Report Generation Commands

| Command | Purpose | Output Format |
|---------|---------|---------------|
| `npm start` | Generate standard report | Markdown |
| `npm run report:all` | Generate all formats | MD + HTML + TXT |
| `npm run share` | Generate for Google Docs | HTML |
| `npm run report:html` | Generate HTML only | HTML |
| `npm run report:text` | Generate plain text only | Plain Text |

### Configuration Commands

| Command | Purpose |
|---------|---------|
| `npm run select` | Multi-board selection interface |
| `npm run input` | Add manual qualitative data |
| `npm run init` | Initialize Jira CLI (rarely needed) |

### Format Options

Use with any report command:
- `--format=all` - Generate all formats
- `--format=html` - HTML for Google Docs
- `--format=text` - Plain text format
- `--format=markdown` - Standard markdown (default)

**Examples:**
```bash
npm start --format=html
npm run report --format=all
```

## File Structure

```
Jira_summary/
├── reports/                          # Generated reports (organized by format)
│   ├── markdown/                     # Standard markdown reports
│   │   └── executive-report-OCM-2025-08-06.md
│   ├── google-docs/                  # HTML reports for Google Docs
│   │   └── executive-report-OCM-2025-08-06.html
│   └── plain-text/                   # Plain text reports
│       └── executive-report-OCM-2025-08-06.txt
├── data/                            # Exported data (JSON/CSV)
│   ├── jira-export-OCM-2025-08-06.json
│   └── jira-issues-OCM-2025-08-06.csv
├── templates/                       # Report templates
│   ├── weekly-summary.hbs           # Markdown template
│   ├── google-docs.hbs              # HTML template
│   └── plain-text.hbs               # Plain text template
├── manual-input.json               # Saved manual input
├── project-selection.json          # Saved project/board selection
├── .env                            # Your configuration
└── package.json                    # App configuration
```

---

## Tips for Best Results

1. **Run weekly** for consistent velocity tracking
2. **Update manual input** before generating reports
3. **Select specific boards** for focused team reports
4. **Review stale issues** flagged in reports
5. **Save different selections** for different teams
6. **Archive old reports** for historical tracking
7. **Use Epic progress tracking** to monitor feature development
8. **Click issue links** for quick navigation to Jira
9. **Share HTML format** with executives for professional presentation
10. **Leverage team names** from board selection for accurate reporting

---

*Happy reporting! 🎉*