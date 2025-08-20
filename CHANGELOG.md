# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2025-08-20

### Added - Claude Workflow Integration 🚀
- **Multi-Agent Coordination**: Comprehensive workspace management with unique agent IDs and activity tracking
- **Workflow Commands**: New commands (`/jira-prime`, `/jira-status`, `/jira-health`, `/jira-sync`) for advanced workspace automation
- **Activity Tracking System**: Persistent activity logging with `workspace-activity.json` for analytics and health monitoring
- **Workspace Configuration**: Multi-project workspace support with `jira-workspace-config.json`
- **Performance Analytics**: Comprehensive workspace health checks and recommendations
- **Real-time Activity Monitoring**: Live tracking of API calls, report generation, and project sync activities

### Added - Epic-First Hierarchy Structure ✨
- **Epic-Focused Reports**: New `epic-focused.hbs` template that organizes reports by Epics with Stories/Tasks grouped below
- **Epic Progress Visualization**: Enhanced progress bars with completion percentages for each Epic
- **Hierarchical Issue Relationships**: Clear parent-child relationships and Epic associations
- **Strategic Context Mapping**: Links between Epics, Initiatives, and Outcomes for strategic alignment
- **Comprehensive Epic Metadata**: Status, priority, assignee, and progress tracking for all Epics

### Technical Improvements
- **Native fetch() Implementation**: Replaced axios dependency with native Node.js fetch API for zero external dependencies
- **Enhanced Error Handling**: Improved API error handling and user feedback
- **Module System Improvements**: Fixed import/export issues with ES modules
- **Dependency Cleanup**: Removed external dependencies to improve security and reduce bundle size
- **Port Management**: Resolved port conflicts with dedicated backend (3001) and frontend (3000) ports

### New Commands & Scripts
- `npm run prime` - Initialize/refresh workspace configuration
- `npm run status` - Comprehensive workspace status report  
- `npm run health` - Workspace health check and recommendations
- `npm run sync` - Sync project configurations
- `npm run workspace` - Alias for status command

### Bug Fixes
- Fixed axios dependency issues by migrating to native fetch API
- Resolved import errors in server.js for ManualInputCollector and ProjectSelector
- Fixed missing helper functions for project selection loading/saving
- Corrected port conflict issues between services

## [2.0.0] - 2025-08-06

### Added
- **Manual Board ID Input**: Enter specific board IDs directly for precise board targeting
- **Enhanced Board Selection**: Four different board selection methods (single, multiple, board IDs, project-wide)
- **Pretty Links**: All Jira issues now have clickable links to Red Hat Jira
- **Epic Progress Tracking**: Real-time Epic completion percentages with visual progress bars
- **Parent Issue Links**: Sub-tasks display their parent issue relationships
- **Board-Focused Velocity**: Throughput calculations based only on selected boards
- **Team Name Display**: Automatic team name detection from board selections
- **Weekly Timeframe**: Changed from 4-week to 1-week reporting periods
- **Enhanced HTML Reports**: Professional Google Docs compatible styling
- **Data Deduplication**: Automatic removal of duplicate issues across multiple boards

### Changed
- Renamed package from `jira_summary` to `jira-executive-reports`
- Updated default reporting period from 4 weeks to 1 week
- Enhanced report templates with Epic progress and pretty links
- Improved board selection interface with more options
- Updated documentation with comprehensive board ID examples

### Technical Improvements
- Board-specific issue filtering using Jira Agile API
- Rate limiting protection for API calls
- Enhanced error handling for board validation
- Improved data transformation with Epic and parent information
- Updated project structure for GitHub publication

### Documentation
- Updated README.md with new features and examples
- Enhanced HOW_TO_GUIDE.md with board ID instructions
- Added LICENSE file (MIT License)
- Created comprehensive .gitignore for GitHub
- Added CHANGELOG.md for version tracking

## [1.0.0] - 2025-07-30

### Added
- Initial release with basic Jira reporting functionality
- Project and board selection
- Multi-board support
- Velocity calculation
- Manual input integration
- Multiple export formats (Markdown, HTML, Plain Text, JSON, CSV)
- Red Hat PAT authentication
- Executive report templates