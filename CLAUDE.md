# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with the Jira Executive Report Generator.

## Project Overview

The Jira Executive Report Generator is a Node.js application that creates comprehensive executive weekly reports from Red Hat Jira data. It combines automated Jira metrics with manual team input, specifically designed for Red Hat's Multi-Cluster Management Engineering team requirements.

## Key Information

- **Language**: Node.js (ES Modules)
- **Version**: 2.0.0
- **Node Version**: >=16.0.0
- **Author**: Christina Rizzo <christina.rizzo@redhat.com>
- **License**: MIT

## Development Commands

### Setup
```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env
# Edit .env to add your JIRA_API_TOKEN
```

### Main Commands
```bash
# Interactive project and board selection
npm run select

# Generate standard markdown report
npm start
# or
npm run report

# Generate all formats (Markdown, HTML, Plain Text)
npm run report:all

# Generate specific formats
npm run report:html    # HTML for Google Docs
npm run report:text    # Plain text format

# Collect manual qualitative data
npm run input

# Initialize Jira CLI (if needed)
npm run init
```

### Development
```bash
# Development mode (same as npm start)
npm run dev

# Quick report generation
npm run quick
```

## Architecture

### Core Files
- **index.js**: Main application entry point and command router
- **jira-cli-client.js**: Jira API client with direct REST API calls
- **project-selector.js**: Interactive project and board selection
- **report-generator.js**: Executive report generation engine
- **manual-input.js**: Manual data collection for qualitative input
- **config.js**: Configuration management

### Templates
- **templates/weekly-summary.hbs**: Handlebars template for executive reports
- **templates/google-docs.hbs**: HTML template optimized for Google Docs
- **templates/plain-text.hbs**: Clean text template for copy-paste

### Data Structure
```
├── data/                    # Raw exports
│   ├── jira-export-*.json   # Full Jira API responses
│   └── jira-issues-*.csv    # Processed issue data
├── reports/                 # Generated reports
│   ├── markdown/            # Standard markdown reports
│   ├── google-docs/         # HTML reports for Google Docs
│   └── plain-text/          # Plain text reports
├── manual-input.json        # Saved manual team input
└── project-selection.json   # Saved project/board selection
```

## Key Features

### Multi-Board Support
- Single board selection
- Multiple board selection with ranges (e.g., "1,3,5-7")
- Manual board ID input (e.g., "20600,17975,17291")
- Project-wide queries across all boards

### Report Formats
- **Markdown**: Standard format with links and formatting
- **HTML**: Google Docs compatible with professional styling
- **Plain Text**: Clean format for copy-paste operations

### Data Collection
- Direct REST API calls to Red Hat Jira
- JQL queries across selected projects/boards
- 6-period velocity calculation using throughput method
- Issue categorization (completed, in-progress, needs attention)

### Advanced Features
- Epic progress tracking with progress bars
- Parent issue linking for sub-tasks
- Pretty links to Red Hat Jira issues
- Data deduplication across multiple boards
- Board-specific velocity calculations

## Configuration

### Environment Variables (.env)
```bash
JIRA_API_TOKEN=your_personal_access_token_here
JIRA_PROJECT_KEYS=OCM  # Default project
REPORT_WEEKS_BACK=1    # Data collection period
VELOCITY_SPRINTS_COUNT=6  # Velocity calculation periods
```

### Runtime Configuration
- **project-selection.json**: Stores selected project and board configuration
- **manual-input.json**: Stores team morale, celebrations, and priorities

## Authentication

Uses Red Hat Jira Personal Access Tokens (PAT):
1. Visit https://issues.redhat.com
2. Go to Account Settings → Security → API Tokens
3. Create new token and add to .env file

## Common Workflows

### First-Time Setup
```bash
# 1. Install and configure
npm install
cp .env.example .env
# Edit .env with your JIRA_API_TOKEN

# 2. Select project and board(s)
npm run select

# 3. Generate first report
npm start
```

### Weekly Report Generation
```bash
# 1. Add team context
npm run input

# 2. Generate all formats
npm run report:all

# 3. Share HTML version
# Copy from reports/google-docs/ to Google Docs
```

### Board ID Workflow
```bash
# Select specific boards by ID
npm run select
# Choose "Enter board ID(s) manually"
# Enter: 20600,17975,17291

# Generate targeted reports
npm run report:all
```

## File Naming Conventions

Reports are automatically named based on selection:
- Single Board: `executive-report-OCM-18212-2025-08-06.md`
- Multiple Boards: `executive-report-OCM-multi-5boards-2025-08-06.md`
- Project-Wide: `executive-report-OCM-2025-08-06.md`

## Development Guidelines

### Code Style
- ES Modules (type: "module" in package.json)
- Async/await patterns for API calls
- Error handling with try-catch blocks
- Console logging for user feedback

### API Integration
- Direct REST API calls to bypass jira-cli limitations
- Bearer token authentication
- Proper error handling for API failures
- Rate limiting considerations

### Template System
- Handlebars templates for consistent formatting
- Separate templates for different output formats
- Template helpers for data formatting
- Reusable components for common elements

## Testing and Validation

### Manual Testing
```bash
# Test API connectivity
curl -H "Authorization: Bearer YOUR_TOKEN" "https://issues.redhat.com/rest/api/2/myself"

# Validate configuration
cat .env
cat project-selection.json
```

### Common Issues
- **Token expired**: Generate new PAT in Red Hat Jira
- **No projects found**: Check token permissions
- **No issues found**: Verify project access and JQL queries
- **Empty reports**: Check date ranges and board selections

## Integration with Red Hat Systems

### Jira Integration
- Works with Red Hat's Jira instance (issues.redhat.com)
- Supports Red Hat SSO through Personal Access Tokens
- Compatible with Red Hat project structures and permissions

### Executive Reporting
- Matches Red Hat's executive reporting template
- Supports Multi-Cluster Management Engineering team requirements
- Integrates with existing Red Hat workflows

## Dependencies

### Core Dependencies
- **dotenv**: Environment variable management
- **handlebars**: Template engine for report generation

### No External CLI Dependencies
- Uses direct REST API calls instead of jira-cli
- Reduces external dependencies and permission issues
- More reliable authentication handling

## Performance Considerations

- API calls are batched where possible
- Data is cached during report generation
- Large projects may require pagination handling
- Board-specific queries optimize data retrieval

## Security

- Never commit .env files or tokens
- Use Personal Access Tokens instead of passwords
- API tokens should have minimal required permissions
- Regular token rotation recommended