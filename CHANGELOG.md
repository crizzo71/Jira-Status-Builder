# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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