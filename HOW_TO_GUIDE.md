# Jira Executive Report Generator - How-To Guide

## Table of Contents
1. [Quick Start](#quick-start)
2. [Minimal Report Generator (NEW)](#minimal-report-generator-new)
3. [First Time Setup](#first-time-setup)
4. [Enhanced CLI Features (NEW)](#enhanced-cli-features-new)
5. [Selecting Projects and Boards](#selecting-projects-and-boards)
6. [Advanced Board Selection](#advanced-board-selection)
7. [Generating Reports](#generating-reports)
8. [Security Vulnerability Tracking (NEW)](#security-vulnerability-tracking-new)
9. [Epic-Focused Reporting](#epic-focused-reporting)
10. [Enhanced Report Features](#enhanced-report-features)
11. [Shareable Formats](#shareable-formats-new)
12. [Adding Manual Input](#adding-manual-input)
13. [Understanding Reports](#understanding-reports)
14. [Troubleshooting](#troubleshooting)
15. [Advanced Usage](#advanced-usage)

---

## Quick Start

If you've already set up the app, here's the fastest way to generate a report:

```bash
# Navigate to the project directory
cd /path/to/Jira-Status-Builder

# Generate a report with current settings
npm start
```

---

## Minimal Report Generator (NEW)

**🚀 Get started immediately without npm dependencies!**

The minimal report generator works without any npm install requirements and provides instant executive reports. Perfect for first-time setup or when you have npm permission issues.

### Step 1: Basic Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your Red Hat Jira token
nano .env
```

Add your API token to `.env`:
```bash
JIRA_API_TOKEN=your_red_hat_jira_token_here
JIRA_PROJECT_KEYS=OCM
```

### Step 2: Test Your Connection

```bash
# Verify API connectivity
node setup-test.js
```

You should see:
```
✅ API connection successful
👤 Authenticated as: Your Name (your.email@redhat.com)
🎯 Ready to generate reports!
```

### Step 3: Generate Your First Report

```bash
# Generate immediate weekly report
node minimal-report.js
```

**What you get:**
- **📄 Markdown Report**: `reports/markdown/executive-report-OCM-2025-08-13.md`
- **📊 JSON Data**: `data/jira-export-OCM-2025-08-13.json`
- **📈 CSV Export**: `data/jira-export-OCM-2025-08-13.csv`

### Example Output

```
🚀 Jira Status Builder - Minimal Report Generator
================================================

📋 Fetching issues from OCM project...
📅 Date range: Aug 5, 2025 to Aug 12, 2025
✅ Found 100 issues

📊 Issue Categories:
   Completed: 17
   In Progress: 25
   To Do: 38

⚡ Team Velocity: 17 items per 1 week (High)

🎉 Report Generation Complete!
```

### Minimal Report Features

✅ **Zero Dependencies** - Works without npm install  
✅ **Instant Setup** - Just API token required  
✅ **Executive Format** - Professional weekly reports  
✅ **Team Velocity** - Automatic throughput calculation  
✅ **Issue Categorization** - Completed, in-progress, backlog  
✅ **Multiple Exports** - Markdown, JSON, CSV formats  
✅ **Issue Type Breakdown** - Stories, bugs, tasks analysis  
✅ **Team Distribution** - Assignee workload overview  
✅ **Clickable Links** - Direct links to Red Hat Jira issues  

### When to Use Minimal vs Full Version

**Use Minimal Reporter When:**
- First time setup or testing
- npm permission issues
- Quick one-off reports
- CI/CD automation scripts
- Lightweight environments

**Use Full Version When:**
- Need manual input collection
- Want HTML/Google Docs formats
- Multiple board selection required
- Enhanced CLI features needed
- Team collaboration workflows

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

## Enhanced CLI Features (NEW)

**🔧 Advanced Jira operations with jira-cli patterns**

The enhanced CLI provides powerful Jira management capabilities beyond basic reporting, integrating patterns from [claude-workflow jira-cli usage](https://github.com/ciaranRoche/claude-workflow/blob/main/.claude/context/jira-cli-usage.md).

### Quick Enhanced CLI Commands

```bash
# Show all enhanced commands
npm run enhanced help

# Generate reports with enhanced features
npm run enhanced report --format=all

# Security vulnerability tracking
npm run enhanced:security cve CVE-2023-1234 OCM

# Bulk issue management
npm run enhanced:assign "OCM-1,OCM-2" "john.doe"

# Multi-format export
npm run enhanced:export "project=OCM AND updated >= -7d" json,csv,plain
```

### Security Operations

#### CVE and Vulnerability Tracking
```bash
# Track specific CVE across projects
npm run enhanced:security cve CVE-2023-1234 OCM

# Track software vulnerabilities
npm run enhanced:security software "Apache" OCM

# List all security issues
npm run enhanced:security all OCM --raw
```

#### Security Team Workflow Example
```bash
# 1. Track CVE and export raw data
./enhanced-cli.js security cve CVE-2023-1234 OCM --raw > cve-report.json

# 2. Assign security issues to security team
./enhanced-cli.js query "project=OCM AND labels='SecurityTracking'" --plain | 
  cut -f1 | xargs -I{} ./enhanced-cli.js assign {} "security-team"

# 3. Add tracking comments
./enhanced-cli.js comment "OCM-SEC-1,OCM-SEC-2" "## Security Review\\n- CVE analyzed\\n- Patch available"
```

### Bulk Issue Management

#### Assignment Operations
```bash
# Assign multiple issues to user
npm run enhanced:assign "OCM-1,OCM-2,OCM-3" "john.doe"

# Unassign issues (jira-cli pattern: 'x' = unassign)
npm run enhanced:assign "OCM-1,OCM-2" x
```

#### Label and Component Management
```bash
# Add labels to issues
./enhanced-cli.js label "OCM-1,OCM-2" add "priority,security"

# Remove labels from issues
./enhanced-cli.js label "OCM-1,OCM-2" remove "old-label"
```

#### Comment Management
```bash
# Add markdown comment to multiple issues
./enhanced-cli.js comment "OCM-1,OCM-2" "## Update\\n- Progress made\\n- Next steps defined"

# Plain text comment
./enhanced-cli.js comment "OCM-1" "Simple status update" --plain
```

### Advanced Operations

#### Issue Linking
```bash
# Create relationships between issues
./enhanced-cli.js link OCM-1 "blocks" OCM-2
./enhanced-cli.js link OCM-100 "epic" OCM-1

# Available link types:
# blocks, is blocked by, clones, is cloned by, duplicates, is duplicated by,
# relates to, causes, is caused by, child-issue, parent-issue, epic
```

#### Workflow Transitions
```bash
# Move issues through workflow states
./enhanced-cli.js transition "OCM-1,OCM-2" "Done"

# Transition with resolution
./enhanced-cli.js transition "OCM-1" "Done" "Fixed"

# Available resolutions:
# Done, Fixed, Won't Fix, Duplicate, Incomplete, Cannot Reproduce,
# Won't Do, Rejected, Not a Bug, Obsolete
```

### Export and Query Operations

#### Multi-Format Export
```bash
# Export in multiple formats
npm run enhanced:export "project=OCM AND updated >= -7d" json,csv,plain

# Raw JSON export (equivalent to jira-cli --raw)
./enhanced-cli.js export "status='To Do'" raw

# Plain text export (equivalent to jira-cli --plain)
./enhanced-cli.js export "assignee=john.doe" plain
```

#### Custom JQL Queries
```bash
# Standard JSON output
npm run enhanced:query "project=OCM AND updated >= -7d"

# Raw JSON output (jira-cli --raw equivalent)
./enhanced-cli.js query "project=OCM" --raw

# Plain text output (jira-cli --plain equivalent)
./enhanced-cli.js query "project=OCM" --plain

# No interactive prompts (jira-cli --no-input equivalent)
./enhanced-cli.js query "project=OCM" --no-input
```

### CLI Flags and Options

The enhanced CLI supports jira-cli equivalent flags:

| Flag | Purpose | jira-cli Equivalent |
|------|---------|-------------------|
| `--raw` | Output raw JSON | `jira issue list --raw` |
| `--plain` | Output plain text | `jira issue list --plain` |
| `--no-input` | Disable interactive prompts | `jira issue edit --no-input` |
| `--format=<type>` | Multiple output formats | Combined functionality |

### Enhanced CLI Benefits

✅ **Security Focus** - CVE tracking and vulnerability management  
✅ **Bulk Operations** - Efficient multi-issue management  
✅ **Automation Ready** - Non-interactive modes for scripts  
✅ **jira-cli Compatible** - Familiar patterns and flags  
✅ **Multi-Format Export** - JSON, CSV, plain text, raw formats  
✅ **Issue Relationships** - Complete linking and workflow management  
✅ **Rate Limited** - Built-in API throttling for stability  

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

## Epic-Focused Reporting (NEW)

The reporting system now focuses on **Epic-level strategic work** for executive visibility while providing comprehensive **development activity trends** for operational insights.

### How Epic-Level Filtering Works

The report automatically categorizes all Jira issues into two groups:

**Epic-Level Items (Strategic Focus):**
- **Epic** - Major strategic initiatives
- **Initiative** - Cross-team strategic work  
- **Theme** - High-level organizational priorities

**Sub-Epic Items (Development Trends):**
- **Story** - User-facing features
- **Task** - Implementation work
- **Bug** - Defect resolution
- **Sub-task** - Breakdown of larger work items

### Report Structure

#### 1.0-3.0: Epic-Level Strategic Content
- **Team Performance Metrics** - Based on Epic completion
- **Key Epic-Level Accomplishments** - Only completed Epics/Initiatives
- **Upcoming Epic-Level Priorities** - Strategic work in progress

#### 4.0: Development Activity Trends (NEW)
- **Sub-Epic Work Item Analysis** - Comprehensive development metrics
- **Activity Breakdown** - Performance by issue type
- **Current Activity** - Development team status
- **Weekly Throughput** - Operational velocity trends

#### 5.0: Detailed Metrics
- **Epic vs Sub-Epic breakdown** - Strategic vs operational split
- **Attention Items** - Only Epic-level issues requiring focus

### Example Epic-Focused Output

**Strategic Section (Epics Only):**
```markdown
### 1.2 Key Epic-Level Accomplishments

**Completed Epics and Major Initiatives:**
- OCM-17467 - ROSA CLI Support for AutoNode Private Preview
  - Epic: 25% complete (2/8 issues)
- OCM-16478 - Multi-cluster Security Framework Initiative  
  - Epic: 75% complete (6/8 issues)
```

**Development Trends Section (Sub-Epic Items):**
```markdown
### 4.1 Sub-Epic Work Item Analysis

**Summary:** 150 stories, tasks, and sub-tasks completed or in progress
**Completion Rate:** 68% of development items completed this period

**Activity Breakdown:**
- Task: 70 items (74% complete)
- Story: 36 items (56% complete)  
- Bug: 30 items (60% complete)

**Current Activity:**
- Active Items: 21 stories/tasks in progress
- New This Week: 5 new development items
- Needs Attention: 42 items requiring review
```

### Benefits of Epic-Focused Reporting

**For Executives:**
- **Clear Strategic View** - Only see high-level initiatives and themes
- **Reduced Noise** - No tactical development tasks cluttering the report
- **Strategic Progress** - Epic completion percentages and major milestones
- **Forward-Looking** - Focus on major initiatives rather than individual tasks

**For Development Teams:**
- **Comprehensive Metrics** - Full visibility into development productivity
- **Trend Analysis** - Track completion rates by issue type
- **Operational Insights** - Weekly throughput and activity patterns
- **Attention Management** - Clear view of items requiring focus

### Issue Type Examples

**Epic-Level (Main Report):**
- ✅ `Epic: Implement Multi-Cluster Authentication Framework`
- ✅ `Initiative: Modernize CI/CD Pipeline Architecture`
- ✅ `Theme: Security Compliance and Governance`

**Sub-Epic Level (Trends Section):**
- 📊 `Story: Add user login validation`
- 📊 `Task: Update authentication middleware`
- 📊 `Bug: Fix memory leak in API handler`
- 📊 `Sub-task: Implement JWT token refresh`

---

## Security Vulnerability Tracking (NEW)

**🔒 Specialized security operations for vulnerability management**

The enhanced CLI provides dedicated commands for tracking CVEs, security vulnerabilities, and security-related work across Red Hat Jira projects.

### CVE Tracking

Track specific Common Vulnerabilities and Exposures (CVEs) across projects:

```bash
# Track specific CVE
npm run enhanced:security cve CVE-2023-1234 OCM

# Export CVE tracking data
./enhanced-cli.js security cve CVE-2023-1234 OCM --raw > cve-tracking.json
```

**JQL Pattern Used:**
```sql
project=OCM AND (issuetype="Vulnerability" OR (issuetype="Bug" and labels="SecurityTracking")) 
AND (summary~"CVE-2023-1234" OR summary~"2023-1234")
```

### Software Vulnerability Tracking

Track vulnerabilities for specific software components:

```bash
# Track Apache vulnerabilities
npm run enhanced:security software "Apache" OCM

# Track Kubernetes security issues
npm run enhanced:security software "Kubernetes" OCM --plain
```

**JQL Pattern Used:**
```sql
project=OCM AND (issuetype="Vulnerability" OR (issuetype="Bug" and labels="SecurityTracking")) 
AND summary~"Apache"
```

### General Security Issue Tracking

List all security-related issues in a project:

```bash
# List all security issues
npm run enhanced:security all OCM

# Export all security issues as CSV
./enhanced-cli.js security all OCM --format=csv
```

### Security Team Workflows

#### Daily Security Monitoring
```bash
#!/bin/bash
# daily-security-check.sh

PROJECT="OCM"
DATE=$(date +%Y-%m-%d)

echo "🔒 Daily Security Check for $PROJECT - $DATE"
echo "============================================="

# Check for new security issues
./enhanced-cli.js security all $PROJECT --format=json > security-report-$DATE.json

# Count critical issues
CRITICAL_COUNT=$(./enhanced-cli.js query "project=$PROJECT AND priority=Critical AND labels='SecurityTracking'" --raw | jq '.total')

echo "📊 Critical Security Issues: $CRITICAL_COUNT"

# Alert if critical issues found
if [ "$CRITICAL_COUNT" -gt "0" ]; then
  echo "⚠️  ALERT: $CRITICAL_COUNT critical security issues require attention"
  ./enhanced-cli.js query "project=$PROJECT AND priority=Critical AND labels='SecurityTracking'" --plain
fi
```

#### CVE Response Workflow
```bash
# 1. Create tracking issue for CVE
CVE_ID="CVE-2023-1234"
./enhanced-cli.js security cve $CVE_ID OCM

# 2. Assign to security team
SECURITY_ISSUES=$(./enhanced-cli.js security cve $CVE_ID OCM --plain | cut -f1 | grep OCM)
for issue in $SECURITY_ISSUES; do
  ./enhanced-cli.js assign $issue "security-team"
done

# 3. Add analysis comment
./enhanced-cli.js comment "$SECURITY_ISSUES" "## CVE Analysis Started\\n- Severity: TBD\\n- Impact: Under review\\n- Timeline: 48h assessment"

# 4. Link related issues
./enhanced-cli.js link OCM-SEC-1 "relates to" OCM-PATCH-1
```

#### Security Metrics and Reporting
```bash
# Weekly security metrics
./enhanced-cli.js export "project=OCM AND labels='SecurityTracking' AND resolved >= -7d" json,csv

# Security issue aging report
./enhanced-cli.js query "project=OCM AND labels='SecurityTracking' AND status != Done ORDER BY created ASC" --plain

# Critical security backlog
./enhanced-cli.js query "project=OCM AND priority=Critical AND labels='SecurityTracking' AND status = 'To Do'" --format=csv
```

### Security Labels and Categories

The security tracking uses these Jira patterns:

**Issue Types:**
- `Vulnerability` - Dedicated vulnerability issues
- `Bug` with `SecurityTracking` label - Security-related bugs

**Priority Levels:**
- `Critical` - Immediate attention required
- `High` - Address within sprint
- `Medium` - Address within release cycle
- `Low` - Address when convenient

**Common Labels:**
- `SecurityTracking` - General security work
- `CVE-2023-XXXX` - Specific CVE tracking
- `SecurityReview` - Requires security team review
- `PatchRequired` - Needs security patch

### Security Query Examples

#### Find Unpatched CVEs
```bash
./enhanced-cli.js query "project=OCM AND summary~'CVE-' AND status != Done AND labels='SecurityTracking'" --plain
```

#### High Priority Security Backlog
```bash
./enhanced-cli.js query "project=OCM AND priority in (Critical, High) AND labels='SecurityTracking' AND status = 'To Do'" --format=json
```

#### Security Work This Sprint
```bash
./enhanced-cli.js query "project=OCM AND labels='SecurityTracking' AND updated >= -14d" --format=csv
```

### Integration with Security Tools

The security tracking integrates with common security workflows:

**Vulnerability Scanners:**
- Export issue data for vulnerability management tools
- Track remediation status in Jira
- Link scanner findings to Jira issues

**Security Dashboards:**
- JSON/CSV export for dashboard integration
- Real-time status via API queries
- Automated metrics collection

**Compliance Reporting:**
- Detailed audit trails via issue history
- Status reporting for compliance frameworks
- Evidence collection for security assessments

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

#### Epic-Level Issues (Main Report Sections)

**Completed Epics:**
- Type: Epic, Initiative, Theme
- Status: Done, Resolved, Closed
- Time frame: Last 7 days
- **Strategic focus** with completion metrics
- **Includes clickable links** to Red Hat Jira

**Epics In Progress:**
- Type: Epic, Initiative, Theme  
- Status: In Progress, In Review, Testing, Code Review
- Sorted by priority and update date
- **Epic progress tracking** with visual indicators
- **Strategic initiative context**

**Epics Requiring Attention:**
- Epic-level items with no updates in 3+ days
- Not resolved strategic initiatives
- Potential blockers to major initiatives
- **Executive-level attention items only**

#### Sub-Epic Development Trends (Section 4.0)

**Development Activity Analysis:**
- Types: Story, Task, Bug, Sub-task
- **Completion rate tracking** by issue type  
- **Weekly throughput metrics** for operational velocity
- **Current activity status** (active, new, attention needed)
- **Trend analysis** showing development team productivity

**Activity Breakdown Example:**
- Task: 70 items (74% complete)
- Story: 36 items (56% complete)
- Bug: 30 items (60% complete)

### Report Quality Indicators

**Excellent Epic-Focused Report:**
- ✅ Epic-level strategic items present
- ✅ Sub-Epic development trends showing healthy activity
- ✅ Velocity data available for both Epic and sub-Epic levels
- ✅ Manual input completed for strategic context
- ✅ Epic progress data populated with completion percentages
- ✅ Development activity breakdown by issue type
- ✅ Team name correctly displayed from board selection

**Good Operational Report:**
- ✅ 10+ sub-Epic development items found
- ✅ Development trends showing completion rates
- ✅ Weekly throughput data available
- ✅ Clear activity breakdown (Tasks, Stories, Bugs)

**Needs Strategic Attention:**
- ⚠️ No Epic-level work in progress or completed
- ⚠️ All activity is tactical/operational only
- ⚠️ Missing strategic initiatives and themes

**Needs Operational Attention:**
- ⚠️ Very few development items found
- ⚠️ Low completion rates across issue types
- ⚠️ Many stale sub-Epic items requiring attention

---

## Troubleshooting

### Quick Setup Issues

**🚀 Use Minimal Report Generator First**

If you're having any setup issues, start with the minimal report generator:

```bash
# 1. Basic setup test
node setup-test.js

# 2. Generate report without dependencies
node minimal-report.js
```

This bypasses npm dependency issues and validates your basic setup.

### Common Issues

**"Missing required environment variables"**
```bash
# Check your .env file exists and has JIRA_API_TOKEN
cat .env

# Verify API token is set (not the default value)
grep JIRA_API_TOKEN .env
```

**"npm permission errors" or "EACCES"**
```bash
# Use minimal report generator instead
node minimal-report.js

# Or fix npm permissions
sudo chown -R $(whoami) ~/.npm
npm install
```

**"403 Forbidden" or "401 Unauthorized" errors**
```bash
# Test your API connection
node setup-test.js

# Your token may be expired, generate a new one at:
# https://issues.redhat.com/secure/ViewProfile.jspa?selectedTab=com.atlassian.pats.pats-plugin:jira-user-personal-access-tokens
```

**"No issues found"**
- Check project key is correct (default: OCM)
- Verify you have access to the project
- Try a different time period in .env: `REPORT_WEEKS_BACK=2`
- Test with minimal reporter: `node minimal-report.js`

**"Command not found" or "Module not found"**
```bash
# Make sure you're in the right directory
cd /path/to/Jira-Status-Builder

# For minimal reporter (no dependencies needed)
node minimal-report.js

# For full features, install dependencies
npm install
```

### Enhanced CLI Issues

**"Enhanced CLI commands not working"**
```bash
# Check if enhanced CLI is executable
chmod +x enhanced-cli.js

# Test enhanced CLI
./enhanced-cli.js help

# Use npm scripts instead
npm run enhanced help
```

**"Security tracking returns no results"**
```bash
# Verify security labels exist in your project
./enhanced-cli.js query "project=OCM AND labels='SecurityTracking'" --plain

# Try broader security query
./enhanced-cli.js query "project=OCM AND issuetype='Vulnerability'" --plain
```

**"Bulk operations failing"**
```bash
# Test with single issue first
./enhanced-cli.js assign OCM-1 "john.doe"

# Check issue keys are valid
./enhanced-cli.js query "key in (OCM-1,OCM-2)" --plain
```

### Debug Mode

**Basic Diagnostics:**
```bash
# Test API connectivity
node setup-test.js

# View current configuration
cat .env

# Check for saved selections
ls -la project-selection.json manual-input.json

# View generated files
ls -la reports/ data/
```

**Enhanced CLI Diagnostics:**
```bash
# Test enhanced CLI connection
./enhanced-cli.js init

# Debug specific commands
DEBUG=1 ./enhanced-cli.js security all OCM
DEBUG=1 ./enhanced-cli.js query "project=OCM" --raw
```

**Network and Permissions:**
```bash
# Test direct API access
curl -H "Authorization: Bearer $JIRA_API_TOKEN" "https://issues.redhat.com/rest/api/2/myself"

# Check project access
curl -H "Authorization: Bearer $JIRA_API_TOKEN" "https://issues.redhat.com/rest/api/2/project/OCM"

# Verify API token from .env
source .env && echo "Token: ${JIRA_API_TOKEN:0:10}..."
```

### Getting Help

**Environment Validation:**
```bash
# Complete setup test
node setup-test.js

# Manual API test
curl -H "Authorization: Bearer YOUR_TOKEN" "https://issues.redhat.com/rest/api/2/myself"
```

**File Structure Check:**
```bash
# Verify all required files exist
ls -la *.js .env* templates/ package.json

# Check file permissions
ls -la enhanced-cli.js minimal-report.js setup-test.js
```

**Reset to Clean State:**
```bash
# Clean generated files
rm -rf reports/ data/ project-selection.json manual-input.json

# Reset environment (keep your token!)
cp .env.example .env.backup
# Edit .env with your token again

# Test minimal setup
node setup-test.js
node minimal-report.js
```

### Performance Issues

**Large Projects or Slow Queries:**
```bash
# Use smaller time windows
# Edit .env: REPORT_WEEKS_BACK=1

# Use specific boards instead of project-wide
npm run select
# Choose specific board IDs

# Export in chunks for analysis
./enhanced-cli.js export "project=OCM AND updated >= -7d" json
./enhanced-cli.js export "project=OCM AND updated >= -14d AND updated < -7d" json
```

**Rate Limiting:**
```bash
# The tools include built-in rate limiting (250ms delays)
# If you hit rate limits, increase delay in jira-enhanced-client.js
# Change: this.requestDelay = 250; to this.requestDelay = 500;
```

### Common Workflows

**First Time Setup Validation:**
```bash
# 1. Basic setup
cp .env.example .env
# Edit .env with your token

# 2. Test connection
node setup-test.js

# 3. Generate first report
node minimal-report.js

# 4. Install full features (optional)
npm install
npm run select
npm start
```

**Troubleshooting Workflow:**
```bash
# 1. Diagnose issue
node setup-test.js

# 2. Try minimal approach
node minimal-report.js

# 3. Check specific component
./enhanced-cli.js init
./enhanced-cli.js query "project=OCM LIMIT 1" --plain

# 4. Reset if needed
rm -rf reports/ data/
node minimal-report.js
```

**Check Project Access:**
```bash
npm run select  # Browse available projects
```

---

## Advanced Usage

### Working with Epic-Focused Reports

**Optimizing for Strategic Visibility:**
```bash
# Focus on boards with Epic-level work
npm run select
# Choose boards that contain Epics, Initiatives, and Themes
# Examples: "Product Planning Board", "Strategic Initiatives Board"
```

**Understanding Report Output:**
```bash
# If main sections show "No Epic-level work"
# This is normal for development-focused boards
# Check section 4.0 "Development Activity Trends" for comprehensive metrics

# Example board types:
# - Planning boards: Usually contain Epics and Initiatives  
# - Development boards: Usually contain Stories, Tasks, Bugs
# - Mixed boards: Contain both Epic and sub-Epic items
```

**Best Practices:**
- **Executive Reports**: Use boards with strategic Epics and Initiatives
- **Team Reports**: Use development boards and focus on section 4.0 trends
- **Comprehensive Reports**: Use multiple boards covering both strategic and operational work
- **Board Selection**: Choose board IDs manually for precise Epic/sub-Epic targeting

**Strategic vs Operational Board Examples:**
```bash
# Strategic focus (Epic-heavy boards):
npm run select
# Enter board IDs: 20600,20782  # Planning and initiative boards

# Operational focus (sub-Epic heavy boards):  
npm run select
# Enter board IDs: 17975,17291  # Development and engineering boards

# Balanced view (mixed boards):
npm run select  
# Enter board IDs: 20600,17975,17291,20782  # All board types
```

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