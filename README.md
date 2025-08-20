# Jira Executive Report Generator

A powerful Node.js application that generates executive weekly reports from Red Hat Jira data with **Epic-first hierarchy** and advanced workflow automation. Creates comprehensive reports combining automated Jira metrics with manual team input, designed specifically for Red Hat's Multi-Cluster Management Engineering team requirements.

**✨ NEW: Claude Workflow Integration** - Advanced workspace management with activity tracking, multi-agent coordination, and workflow automation commands.

## 🚀 Quick Start

```bash
# First time setup
cp .env.example .env
# Add your JIRA_API_TOKEN to .env
npm install

# Select your project and board
npm run select

# Generate your first report
npm start
```

## ✨ Key Features

### 📊 **Epic-First Hierarchy Reports**
- **🎯 Epic-Focused Structure** - Reports organized by Epics with Stories/Tasks grouped below
- **📈 Epic Progress Tracking** - Visual progress bars with completion percentages
- **🔗 Issue Relationships** - Clear parent-child relationships and Epic associations
- **📋 Comprehensive Metadata** - Status, priority, assignee, and update dates for all issues

### 🔄 **Advanced Workflow Management** 
- **🤖 Claude Workflow Integration** - Multi-agent coordination and activity tracking
- **📊 Workspace Analytics** - Comprehensive activity logging and performance metrics
- **⚡ Workflow Commands** - `/jira-prime`, `/jira-status`, `/jira-health`, `/jira-sync`
- **🔍 Health Monitoring** - Automated workspace health checks and recommendations

### 🎯 **Project & Data Management**
- **🎯 Interactive Project Selection** - Choose from 920+ Red Hat Jira projects
- **📊 Advanced Board Selection** - Single boards, multiple boards, manual board IDs, or project-wide queries
- **🆔 Manual Board ID Input** - Enter specific board IDs for precise board targeting
- **🔄 Data Deduplication** - Automatically removes duplicate issues across multiple boards

### 📄 **Multi-Format Reports & Export**
- **📄 Shareable Formats** - Generate reports in Markdown, HTML (Google Docs), and Plain Text
- **⚡ Smart Velocity Calculation** - Board-focused automated throughput metrics over 6 periods
- **💾 Multiple Export Formats** - JSON, CSV, Markdown, HTML, and Plain Text reports
- **🎭 Manual Input Integration** - Collect team morale, celebrations, and milestones

### 🔐 **Enterprise Features**
- **🔐 Secure PAT Authentication** - Uses Personal Access Tokens for Red Hat SSO
- **📝 Executive Report Format** - Matches Red Hat's executive reporting template
- **🌐 Web UI Interface** - React TypeScript web interface for non-technical users
- **📡 Real-time Updates** - WebSocket integration for live progress tracking

## 📋 Requirements Met

✅ **REQ-AUTH-01-03**: PAT authentication with bearer token  
✅ **REQ-DATA-01-02**: Multi-project JQL queries with CSV/JSON export  
✅ **REQ-VELO-01-02**: Team velocity calculation (sprint/throughput)  
✅ **REQ-INPUT-01**: Manual input for qualitative data  
✅ **Executive Template**: Matches "Multi-Cluster Management Engineering" format  
✅ **Multi-Board Selection**: Generate reports from multiple boards in one go  
✅ **Shareable Documents**: Google Docs compatible HTML and plain text formats  

## 🆕 Enhanced CLI (NEW)

**Advanced Jira operations with jira-cli patterns:**
- 🔒 **Security vulnerability tracking** with CVE and software-specific queries
- 👥 **Bulk issue management** (assign, comment, label, transition)
- 🔗 **Issue linking** with 12 relationship types
- 📤 **Multi-format export** (JSON, CSV, plain text, raw)
- ⚡ **Custom JQL execution** with output formatting options

```bash
# Quick start with enhanced features
npm run enhanced help
npm run enhanced:security cve CVE-2023-1234 OCM
npm run enhanced:assign "OCM-1,OCM-2" "john.doe"
npm run enhanced:export "project=OCM" json,csv,plain
```

**📚 See [ENHANCED-CLI-GUIDE.md](ENHANCED-CLI-GUIDE.md) for complete documentation**

## 🔧 Setup

### 1. Get Your Red Hat Jira Token
1. Visit https://issues.redhat.com
2. Go to **Account Settings** → **Security** → **API Tokens**
3. Create new token and copy it

### 2. Configure Environment
```bash
cp .env.example .env
```
Edit `.env`:
```bash
JIRA_API_TOKEN=your_personal_access_token_here
JIRA_PROJECT_KEYS=OCM  # Default project
```

### 3. Install Dependencies
```bash
npm install
```

## 🎯 Usage

### Select Project and Board(s)
```bash
npm run select
```
**Enhanced Board Selection Options:**
- **Single Board**: Choose one specific board from list
- **Multiple Boards**: Select multiple boards using comma-separated lists or ranges
  - Examples: `1,3,5` or `1-3,7,9-12`
- **Manual Board IDs**: Enter specific board IDs directly
  - Examples: `20600,17975,17291`
  - Get IDs from Jira URLs or API endpoints
- **Project-Wide**: Use all boards within a project
- Browse 920+ available Red Hat projects
- Saves selection for future reports

### Generate Executive Reports

**Standard Markdown Report:**
```bash
npm start
```

**Generate All Formats (NEW):**
```bash
npm run report:all
```
Creates 3 files: Markdown, HTML (Google Docs), and Plain Text

**Google Docs Sharing (NEW):**
```bash
npm run share
```
Generates HTML format optimized for copying into Google Docs

**Specific Formats:**
```bash
npm run report:html    # HTML format only
npm run report:text    # Plain text format only
```

All commands:
- Use your saved project/board selection(s)
- Fetch issues updated within the last 7 days
- Calculate 6-period velocity
- Generate executive-format reports

### Add Manual Input
```bash
npm run input
```
Interactive prompts for:
- Team morale assessment
- Celebrations and achievements
- Milestones and releases
- Forward-looking priorities
- Velocity context

### Query Issues by Component
```bash
npm run component -- --component="clusters-service-core-team" --days=7 --project=OCM
```
Query specific component issues with:
- **Component filtering**: Target specific team/component
- **Status filtering**: In Progress, Code Review, Review, Closed
- **Issue types**: Epic and Story only
- **Resolution**: Unresolved issues only
- **Timeframe**: Customizable (default 7 days)
- **Auto-export**: Results saved to CSV file

**Parameters:**
- `--component="component-name"` (required): Component to query
- `--days=7` (optional): Number of days to look back (default: 7)
- `--project=OCM` (optional): Project key (default: OCM)

**Example output:**
- Issues grouped by status
- Epic progress tracking
- Assignee and priority information
- Automatic CSV export to `data/` directory

## 📊 Generated Reports

### Report Formats & File Structure

**Organized by Format:**
```
reports/
├── markdown/                    # Original markdown format
│   └── executive-report-OCM-2025-08-06.md
├── google-docs/                 # HTML format for Google Docs
│   └── executive-report-OCM-2025-08-06.html
└── plain-text/                  # Clean text for copy-paste
    └── executive-report-OCM-2025-08-06.txt
```

**Multi-Board File Naming:**
```
Single Board:    executive-report-OCM-18212-2025-08-06.md
Multiple Boards: executive-report-OCM-multi-5boards-2025-08-06.md
Project-Wide:    executive-report-OCM-2025-08-06.md
```

### Report Content - Epic-First Hierarchy ✨

**All formats include Epic-focused structure:**
```markdown
# Weekly Team Report: Aug 13 - Aug 20, 2025

## 1.0 Epic Progress Overview
### 1.1 Team Velocity
Average Velocity: 8.7 items
Velocity Trend: Decreasing

## 2.0 Epics and Related Work

### 2.0.1 Epic: [OCM-17803](https://issues.redhat.com/browse/OCM-17803) - API Rate Limiting Enhancement

**Epic Status:** In Progress | **Priority:** High | **Assignee:** Team Lead
**Progress:** 55% complete (6/11 issues)
```
Progress: [=====----] 55%
```

**Related Issues:**
- **[OCM-17809](https://issues.redhat.com/browse/OCM-17809)** - CI Integration for Rate Limiting
  - Status: Closed | Priority: Normal | Type: Story
  - Assignee: Developer A | Updated: 2025-08-20
  
- **[OCM-14654](https://issues.redhat.com/browse/OCM-14654)** - Rate limit machine_pools endpoints  
  - Status: In Progress | Priority: Normal | Type: Story
  - Assignee: Developer B | Updated: 2025-08-20

### 2.1.1 Epic: [OCM-17673](https://issues.redhat.com/browse/OCM-17673) - Access Transparency Service

**Epic Status:** Completed | **Priority:** High | **Assignee:** Team Lead
**Progress:** 100% complete (11/11 issues)
```
Progress: [==========] 100%
```

**Related Issues:**
- **[OCM-17680](https://issues.redhat.com/browse/OCM-17680)** - Konflux Onboarding
  - Status: Closed | Priority: Major | Type: Story
  - Assignee: Developer C | Updated: 2025-08-20

## 3.0 Team Morale and Culture
### 3.1 Associate Morale
[Manual input from npm run input]

## 4.0 Forward-Looking Items
### 4.1 Upcoming Priorities
[Strategic priorities and next period focus]
```

### Google Docs Format
The HTML format includes:
- Professional styling with Google's color scheme
- Clean tables and formatted sections
- Optimized for copy-paste into Google Docs
- Executive-ready presentation

### Data Exports
- **JSON**: `data/jira-export-OCM-2025-08-06.json`
- **CSV**: `data/jira-issues-OCM-2025-08-06.csv`

## 🎛️ Commands

### 📊 **Report Generation**
| Command | Purpose |
|---------|---------|
| `npm start` | Generate Epic-focused markdown report |
| `npm run report:all` | Generate all formats (MD, HTML, TXT) |
| `npm run share` | Generate HTML format for Google Docs |
| `npm run report:html` | Generate HTML format only |
| `npm run report:text` | Generate plain text format only |

### 🔄 **Workflow Management** ✨ NEW
| Command | Purpose |
|---------|---------|
| `npm run prime` | Initialize/refresh workspace configuration |
| `npm run status` | Comprehensive workspace status report |
| `npm run health` | Workspace health check and recommendations |
| `npm run sync` | Sync project configurations |
| `npm run workspace` | Alias for status command |

### ⚙️ **Configuration & Setup**
| Command | Purpose |
|---------|---------|
| `npm run select` | Interactive project/multi-board selection |
| `npm run input` | Collect manual qualitative data |
| `npm run component` | Query issues by component with specific criteria |
| `npm run init` | Initialize Jira CLI (if needed) |

### Format Options
- `--format=all` - Generate all formats
- `--format=html` - HTML for Google Docs
- `--format=text` - Plain text format
- `--format=markdown` - Standard markdown (default)

## 📁 Project Structure

```
jira_reeport/
├── 📄 HOW_TO_GUIDE.md             # Detailed usage guide
├── 📄 README.md                   # This file
├── 📄 UI_README.md                # Web UI documentation
├── 📄 .env.example                # Environment template
├── 📄 package.json                # Dependencies and scripts
├── 🏗️ config.js                   # Configuration management
├── 🔌 jira-cli-client.js          # Enhanced Jira API client (fetch-based)
├── 📝 project-selector.js         # Interactive project selection
├── 🎨 report-generator.js         # Epic-focused report generation
├── 💬 manual-input.js             # Manual data collection
├── 🚀 index.js                    # Main application with workflow commands
├── 🌐 server.js                   # Express server for web UI
├── 🔄 activity-tracker.js         # Workspace activity tracking ✨ NEW
├── ⚡ workflow-commands.js        # Claude Workflow integration ✨ NEW
├── 📄 workspace-activity.json     # Activity tracking data ✨ NEW
├── 📄 jira-workspace-config.json  # Workspace configuration ✨ NEW
├── 📁 templates/
│   ├── epic-focused.hbs           # Epic-first hierarchy template ✨ NEW
│   ├── weekly-summary.hbs         # Traditional executive template
│   └── google-docs.hbs            # HTML format template
├── 📁 ui/                         # React TypeScript web interface
│   ├── src/                       # React components and services
│   └── package.json               # UI dependencies
├── 📁 reports/                    # Generated reports by format
│   ├── markdown/                  # Markdown reports
│   ├── google-docs/               # HTML reports for sharing
│   └── plain-text/                # Plain text reports
├── 📁 data/                       # Raw data exports (JSON/CSV)
├── 📄 manual-input.json           # Saved manual input
└── 📄 project-selection.json      # Saved project selection
```

## 🔍 How It Works

### Data Collection
1. **Direct REST API** calls to Red Hat Jira (bypasses jira-cli permission issues)
2. **JQL Queries** across selected projects/boards
3. **Velocity Calculation** using throughput method (items/week)
4. **Issue Categorization** (completed, in-progress, needs attention)

### Report Generation
1. **Handlebars Templates** for consistent formatting
2. **Executive Format** matching Red Hat requirements
3. **Manual Input Integration** for qualitative data
4. **Multi-format Export** (Markdown, JSON, CSV)

## 🎯 Example Workflows

### Single Board Workflow
```bash
# 1. First time: Select your project and board
npm run select
# Choose "OCM - Open Cluster Management"
# Choose "1. Select single board"
# Choose "OCM Kanban Board"

# 2. Generate standard report
npm start
# Creates: reports/markdown/executive-report-OCM-18212-2025-08-06.md
```

### Board ID Workflow (NEW)
```bash
# 1. Select boards by ID
npm run select
# Choose "OCM - Open Cluster Management" 
# Choose "3. Enter board ID(s) manually"
# Enter: 20600,17975,17291  (specific board IDs)

# 2. Generate focused reports
npm run report:all
# Creates board-specific reports:
# - reports/markdown/executive-report-OCM-multi-3boards-2025-08-06.md
# - reports/google-docs/executive-report-OCM-multi-3boards-2025-08-06.html
# - reports/plain-text/executive-report-OCM-multi-3boards-2025-08-06.txt

# 3. Share with precise board focus
# Reports include only issues from specified boards
# Velocity calculated from selected boards only
```

### Multi-Board Selection Workflow
```bash
# 1. Select multiple boards from list
npm run select
# Choose "OCM - Open Cluster Management" 
# Choose "2. Select multiple boards"
# Enter: 1,3,5-7  (selects boards 1, 3, 5, 6, 7)

# 2. Generate all formats for sharing
npm run report:all
# Creates comprehensive multi-board reports
```

### Weekly Workflow with Manual Input
```bash
# 1. Add team context (weekly)
npm run input
# Answer prompts about morale, celebrations, etc.

# 2. Generate shareable report
npm run share
# Creates HTML format perfect for Google Docs

# 3. Quick sharing
open reports/google-docs/executive-report-OCM-2025-08-06.html
# Copy and paste into Google Docs for distribution
```

## 📈 Sample Output

**Velocity Metrics:**
- Average: 15 items/week
- Trend: Increasing
- Recent performance tracking

**Issue Breakdown:**
- 23 completed issues
- 8 in-progress issues
- 2 issues needing attention

**Manual Context:**
- Team morale: High
- Celebrations: Successful release
- Blockers: Dependency on upstream team

## 🛠️ Configuration Options

### Time Periods
```bash
REPORT_WEEKS_BACK=1        # Data collection period (weekly reports)
VELOCITY_SPRINTS_COUNT=6   # Velocity calculation periods
```

### Board Selection
```bash
# Find board IDs from:
# - Jira board URL: .../secure/RapidBoard.jspa?rapidView=20600
# - API endpoint: /rest/agile/1.0/board
# - Board listings in npm run select
```

### Multi-Project Support
```bash
JIRA_PROJECT_KEYS=OCM,ROSA,HYPERSHIFT  # Comma-separated
```

## 🔧 Troubleshooting

**Common Issues:**
- Token expired: Generate new PAT in Red Hat Jira
- No projects found: Check token permissions
- No issues found: Verify project access

**Debug:**
```bash
# Test API access
curl -H "Authorization: Bearer YOUR_TOKEN" "https://issues.redhat.com/rest/api/2/myself"

# Check configuration
cat .env
cat project-selection.json
```

## 📚 Documentation

- **[HOW_TO_GUIDE.md](HOW_TO_GUIDE.md)** - Detailed step-by-step instructions with board ID examples
- **[.env.example](.env.example)** - Configuration template
- **[templates/weekly-summary.hbs](templates/weekly-summary.hbs)** - Enhanced report template with Epic progress and pretty links

## 🤝 Support

For questions or issues:
1. Check the **HOW_TO_GUIDE.md** for detailed instructions
2. Verify your Red Hat Jira token and permissions
3. Test with a small project first (like OCM)

---

*Built for Red Hat's Multi-Cluster Management Engineering team. 🎉*