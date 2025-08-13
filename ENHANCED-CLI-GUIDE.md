# Enhanced Jira CLI Integration Guide

This guide covers the enhanced Jira CLI functionality integrated from [claude-workflow jira-cli-usage patterns](https://github.com/ciaranRoche/claude-workflow/blob/main/.claude/context/jira-cli-usage.md).

## 🚀 Quick Start

### Using Enhanced CLI
```bash
# Check enhanced CLI help
npm run enhanced help

# Generate report with enhanced features
npm run enhanced report --format=all

# Track security vulnerabilities
npm run enhanced:security cve CVE-2023-1234 OCM

# Bulk assign issues
npm run enhanced:assign "OCM-1,OCM-2" "john.doe"

# Export with multiple formats
npm run enhanced:export "project=OCM AND status='To Do'" json,csv,plain
```

### Direct CLI Usage
```bash
# Make enhanced-cli executable
chmod +x enhanced-cli.js

# Run directly
./enhanced-cli.js security cve CVE-2023-1234 --raw
./enhanced-cli.js query "project=OCM" --plain
```

## 📚 Enhanced Features

### 1. Security Vulnerability Tracking

Track CVEs and security issues with specialized queries:

```bash
# Track specific CVE
npm run enhanced:security cve CVE-2023-1234 OCM

# Track software vulnerabilities
npm run enhanced:security software "Apache" OCM

# List all security issues
npm run enhanced:security all OCM --raw
```

**JQL Patterns Used:**
- CVE tracking: `project=OCM AND (issuetype="Vulnerability" OR (issuetype="Bug" and labels="SecurityTracking")) AND (summary~"CVE-2023-1234")`
- Software vulns: `project=OCM AND (issuetype="Vulnerability" OR (issuetype="Bug" and labels="SecurityTracking")) AND summary~"Apache"`

### 2. Bulk Issue Operations

#### Assignment Management
```bash
# Assign multiple issues
npm run enhanced:assign "OCM-1,OCM-2,OCM-3" "john.doe"

# Unassign issues (jira-cli pattern: 'x' = unassign)
npm run enhanced:assign "OCM-1,OCM-2" x
```

#### Label & Component Management
```bash
# Add labels to issues
./enhanced-cli.js label "OCM-1,OCM-2" add "priority,security"

# Remove labels from issues
./enhanced-cli.js label "OCM-1,OCM-2" remove "old-label"
```

### 3. Enhanced Commenting

Support for markdown and multiline comments:

```bash
# Add markdown comment to multiple issues
./enhanced-cli.js comment "OCM-1,OCM-2" "## Update\\n- Progress made\\n- Next steps defined"

# Plain text comment
./enhanced-cli.js comment "OCM-1" "Simple status update" --plain
```

### 4. Issue Linking

Create relationships between issues using 12 available link types:

```bash
# Block relationship
./enhanced-cli.js link OCM-1 "blocks" OCM-2

# Epic relationship
./enhanced-cli.js link OCM-100 "epic" OCM-1

# Available link types:
# blocks, is blocked by, clones, is cloned by, duplicates, is duplicated by, 
# relates to, causes, is caused by, child-issue, parent-issue, epic
```

### 5. Workflow Transitions

Move issues through workflow states with resolutions:

```bash
# Simple transition
./enhanced-cli.js transition "OCM-1,OCM-2" "Done"

# Transition with resolution
./enhanced-cli.js transition "OCM-1" "Done" "Fixed"

# Available resolutions:
# Done, Fixed, Won't Fix, Duplicate, Incomplete, Cannot Reproduce, 
# Won't Do, Rejected, Not a Bug, Obsolete
```

### 6. Advanced Export Options

Export issues in multiple formats with jira-cli patterns:

```bash
# Export in multiple formats
npm run enhanced:export "project=OCM" json,csv,plain

# Raw JSON export (equivalent to --raw)
./enhanced-cli.js export "status='To Do'" raw

# Plain text export (equivalent to --plain)
./enhanced-cli.js export "assignee=john.doe" plain
```

### 7. Custom Query Execution

Execute JQL with different output modes:

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

## 🔧 Configuration

### Environment Setup
```bash
# Required environment variables
JIRA_API_TOKEN=your_red_hat_jira_token
JIRA_PROJECT_KEYS=OCM  # Default project

# Optional settings
REPORT_WEEKS_BACK=1
VELOCITY_SPRINTS_COUNT=6
```

### CLI Flags

The enhanced CLI supports jira-cli equivalent flags:

| Flag | Purpose | jira-cli Equivalent |
|------|---------|-------------------|
| `--raw` | Output raw JSON | `jira issue list --raw` |
| `--plain` | Output plain text | `jira issue list --plain` |
| `--no-input` | Disable interactive prompts | `jira issue edit --no-input` |
| `--format=<type>` | Multiple output formats | Combined functionality |

## 📊 Integration with Existing Features

### Report Generation
Enhanced CLI maintains full compatibility with existing report generation:

```bash
# Original functionality still works
npm start
npm run report:all

# Enhanced functionality adds capabilities
npm run enhanced report --format=all
npm run enhanced report --raw
```

### Project Selection
```bash
# Enhanced project selection with security focus
npm run enhanced select

# Original selection still available
npm run select
```

### Manual Input Collection
```bash
# Enhanced input collection
npm run enhanced input --no-input  # Skip interactive prompts

# Original input collection
npm run input
```

## 🔍 Examples

### Security Team Workflow
```bash
# 1. Track specific CVE across projects
./enhanced-cli.js security cve CVE-2023-1234 OCM --raw > cve-report.json

# 2. Assign security issues to security team
./enhanced-cli.js query "project=OCM AND labels='SecurityTracking'" --plain | 
  cut -f1 | xargs -I{} ./enhanced-cli.js assign {} "security-team"

# 3. Add tracking comments
./enhanced-cli.js comment "OCM-SEC-1,OCM-SEC-2" "## Security Review\\n- CVE analyzed\\n- Patch available"
```

### Project Management Workflow
```bash
# 1. Export weekly progress
./enhanced-cli.js export "project=OCM AND updated >= -7d" csv,json

# 2. Bulk transition completed work
./enhanced-cli.js query "project=OCM AND status='In Review'" --plain |
  cut -f1 | xargs -I{} ./enhanced-cli.js transition {} "Done" "Fixed"

# 3. Link related issues
./enhanced-cli.js link OCM-EPIC-1 "epic" OCM-STORY-1
./enhanced-cli.js link OCM-STORY-1 "blocks" OCM-STORY-2
```

### Executive Reporting Workflow
```bash
# 1. Generate comprehensive reports
npm run enhanced report --format=all

# 2. Export supporting data
./enhanced-cli.js export "project=OCM AND updated >= -7d" json,csv

# 3. Track velocity metrics
./enhanced-cli.js query "project=OCM AND resolved >= -30d" --raw | 
  jq '.issues | length'  # Count completed items
```

## 🛠️ Troubleshooting

### Common Issues

1. **CLI not executable**
   ```bash
   chmod +x enhanced-cli.js
   ```

2. **API Token Issues**
   ```bash
   # Test connectivity
   ./enhanced-cli.js init
   ```

3. **Permission Errors**
   ```bash
   # Check token permissions
   curl -H "Authorization: Bearer $JIRA_API_TOKEN" \
        "https://issues.redhat.com/rest/api/2/myself"
   ```

### Debug Mode
```bash
# Enable debug output
DEBUG=1 ./enhanced-cli.js query "project=OCM"

# Test specific functionality
./enhanced-cli.js init  # Test API connection
./enhanced-cli.js help  # Show all commands
```

## 📈 Performance Considerations

### Rate Limiting
- Built-in 250ms delay between API requests
- Bulk operations process items sequentially
- Export operations use pagination for large datasets

### Optimization Tips
```bash
# Use specific fields for faster queries
./enhanced-cli.js query "project=OCM" --fields="key,summary,status"

# Export in chunks for large datasets
./enhanced-cli.js export "project=OCM AND created >= -30d" json
./enhanced-cli.js export "project=OCM AND created >= -60d AND created < -30d" json
```

## 🔒 Security Best Practices

1. **Token Management**
   - Use Personal Access Tokens, not passwords
   - Rotate tokens regularly
   - Store tokens in `.env` files (never commit)

2. **Query Safety**
   - Validate JQL queries before bulk operations
   - Test with small datasets first
   - Use `--no-input` flag for automation

3. **Data Handling**
   - Export files contain sensitive project data
   - Use appropriate file permissions
   - Clean up temporary export files

## 📚 Additional Resources

- [Original jira-cli documentation](https://github.com/ciaranRoche/claude-workflow/blob/main/.claude/context/jira-cli-usage.md)
- [Red Hat Jira API Documentation](https://issues.redhat.com/rest/api/2/)
- [Jira REST API Reference](https://developer.atlassian.com/cloud/jira/platform/rest/v2/)

---

*Enhanced Jira CLI Integration - Combining executive reporting with comprehensive issue management* 🚀