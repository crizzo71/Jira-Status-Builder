# Board vs. Issues Selection - Design Document

## 1. Overview

The Jira reporting system needs to support two distinct data collection modes:
1. **Board-based queries** - Issues filtered by Kanban/Scrum board membership
2. **Issues-based queries** - Issues filtered by project-wide JQL criteria

This document defines the requirements and implementation approach for this selection workflow.

---

## 2. Current State Analysis

### 2.1 Current Behavior
```javascript
// Current logic in executeDirectApiQuery()
if (this.selectedBoards && this.selectedBoards.length > 0) {
    return await this.getIssuesFromMultipleBoards(jql);  // Board-based
} else {
    // Direct JQL query (Issues-based)
}
```

**Problem**: The choice between board vs. issues is implicit based on whether boards are selected, not an explicit user choice.

### 2.2 Current User Journey
```
1. User runs `npm run select`
2. User selects project (OCM, ROSA, etc.)
3. User selects boards (single, multiple, or none)
4. System automatically chooses mode based on board selection
```

---

## 3. Proposed Workflow Design

### 3.1 New User Journey
```
1. User runs `npm run select`
2. User selects project (OCM, ROSA, etc.)
3. *** NEW *** User chooses data source mode:
   a) "Work from Kanban Boards" → Board-based queries
   b) "Work from Issues List" → Issues-based queries
4a. IF Board mode: User selects specific boards
4b. IF Issues mode: User configures JQL filters
5. System saves selection and mode preference
```

### 3.2 Data Source Modes

#### Mode A: Kanban Board-Based Queries
**Use Case**: When you want to track work as organized by specific teams/boards
- **Data Source**: Jira Agile API (`/rest/agile/1.0/board/{boardId}/issue`)
- **Scope**: Issues assigned to specific boards
- **Filtering**: Board membership is primary filter, JQL is secondary
- **Benefits**: 
  - Reflects team organization
  - Matches sprint/iteration planning
  - Board-specific velocity calculations

#### Mode B: Issues List-Based Queries  
**Use Case**: When you want to track work by project-wide criteria
- **Data Source**: Jira Core API (`/rest/api/2/search`)
- **Scope**: Project-wide issue search
- **Filtering**: JQL is primary filter (component, status, etc.)
- **Benefits**:
  - Component-specific tracking
  - Cross-board issue analysis
  - Custom status/priority filtering

---

## 4. JQL Query Requirements

### 4.1 Board-Based Mode JQL Template
```jql
-- Applied to each selected board via Agile API
-- Base JQL for board context
project = {PROJECT_KEY} 
AND updated >= "{START_DATE}"
ORDER BY updated DESC
```

**Example for OCM project with OCM Deployment board:**
```jql
project = OCM AND updated >= "2025-08-04" ORDER BY updated DESC
-- Applied to: /rest/agile/1.0/board/20600/issue
```

### 4.2 Issues-Based Mode JQL Template
```jql
project = {PROJECT_KEY}
AND issuetype in ({ISSUE_TYPES})
AND status in ({STATUSES})
AND resolution = {RESOLUTION}
[AND component = {COMPONENT}]
AND updated >= "{START_DATE}" AND updated <= "{END_DATE}"
ORDER BY priority DESC, updated DESC
```

**Example for your use case:**
```jql
project = OCM 
AND issuetype in (Epic, Story) 
AND status in ("In Progress", "Code Review", "Review", "Closed") 
AND resolution = Unresolved 
AND component = "clusters-service-core-team"
AND updated >= "2025-08-04" AND updated <= "2025-08-11"
ORDER BY priority DESC, updated DESC
```

### 4.3 JQL Validation by Project

**Project-Specific Considerations:**
- **OCM**: Supports components like "clusters-service-core-team", "service-development-team"
- **ROSA**: Different component structure, may use different custom fields
- **HYPERSHIFT**: Different board organization and component naming

**Validation Requirements:**
1. Verify project exists and is accessible
2. Validate component names exist in selected project
3. Ensure status values are valid for project workflow
4. Check issue type availability in project

---

## 5. Implementation Requirements

### 5.1 User Interface Updates

#### REQ-UI-01: Mode Selection Prompt
```
After project selection, add new prompt:

🎯 DATA SOURCE SELECTION
========================
How would you like to collect issues for this project?

1. 📋 Work from Kanban Boards
   → Issues organized by team boards (Board API)
   → Good for: Sprint planning, team velocity, board-specific reports

2. 📝 Work from Issues List  
   → Issues filtered by project criteria (Search API)
   → Good for: Component tracking, custom status filters, cross-board analysis

Choose your data source (1-2):
```

#### REQ-UI-02: Board Selection (Mode A)
```
If user selects "Kanban Boards":

📋 BOARD SELECTION
==================
Available boards for OCM:
1. OCM Deployment (Scrum)
2. OCM Reliability (Scrum)
3. OCM Service Development (Kanban)
[... more boards ...]

Select boards:
• Single board: Enter number (e.g., 1)
• Multiple boards: Enter range/list (e.g., 1,3,5-7)  
• Manual board IDs: Enter IDs (e.g., 20600,20782)

Your selection:
```

#### REQ-UI-03: Issues Filter Configuration (Mode B)
```
If user selects "Issues List":

📝 ISSUES FILTER CONFIGURATION
===============================
Project: OCM

Issue Types (default: Epic,Story): 
Statuses (default: "In Progress","Code Review","Review","Closed"):
Resolution (default: Unresolved):
Component (optional):
Date Range (default: last 7 days):

Configure filters or press Enter for defaults:
```

### 5.2 Data Storage Updates

#### REQ-DATA-01: Enhanced Selection Storage
```json
// Updated project-selection.json format
{
  "project": {
    "key": "OCM",
    "name": "Open Cluster Management",
    "id": "12335720"
  },
  "dataSourceMode": "boards|issues",
  "boards": [...],           // Only if mode = "boards"
  "issuesFilter": {          // Only if mode = "issues"
    "issueTypes": ["Epic", "Story"],
    "statuses": ["In Progress", "Code Review", "Review", "Closed"],
    "resolution": "Unresolved", 
    "component": "clusters-service-core-team",
    "dateRange": 7
  },
  "selectedAt": "2025-08-11T20:40:51.488Z"
}
```

### 5.3 Query Engine Updates

#### REQ-ENGINE-01: Mode-Aware Query Execution
```javascript
async executeQuery(jql) {
  const selection = this.loadSelection();
  
  if (selection.dataSourceMode === 'boards') {
    return await this.executeBoardBasedQuery(jql, selection.boards);
  } else if (selection.dataSourceMode === 'issues') {
    return await this.executeIssuesBasedQuery(selection.issuesFilter);
  }
}
```

#### REQ-ENGINE-02: Issues-Based Query Builder
```javascript
buildIssuesBasedJQL(filter, project) {
  let jql = `project = ${project.key}`;
  
  if (filter.issueTypes) {
    jql += ` AND issuetype in (${filter.issueTypes.join(',')})`;
  }
  
  if (filter.statuses) {
    jql += ` AND status in (${filter.statuses.map(s => `"${s}"`).join(',')})`;
  }
  
  if (filter.resolution) {
    jql += ` AND resolution = ${filter.resolution}`;
  }
  
  if (filter.component) {
    jql += ` AND component = "${filter.component}"`;
  }
  
  // Date range based on filter.dateRange (days)
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - filter.dateRange * 24 * 60 * 60 * 1000)
    .toISOString().split('T')[0];
  
  jql += ` AND updated >= "${startDate}" AND updated <= "${endDate}"`;
  jql += ` ORDER BY priority DESC, updated DESC`;
  
  return jql;
}
```

---

## 6. Command Interface Updates

### 6.1 New Commands

#### Component Query Enhancement
```bash
# Current
npm run component -- --component="clusters-service-core-team" --days=7

# Enhanced with mode selection
npm run component -- --component="clusters-service-core-team" --mode=issues --days=7
npm run component -- --board=20600 --mode=boards --days=7
```

#### Mode-Specific Report Generation
```bash
# Generate report using saved mode
npm start

# Override mode for this execution
npm start -- --mode=boards
npm start -- --mode=issues
```

### 6.2 Configuration Commands

#### Quick Mode Setup
```bash
# Quick setup for issues mode
npm run config:issues -- --component="clusters-service-core-team"

# Quick setup for boards mode  
npm run config:boards -- --boards="20600,20782"
```

---

## 7. Validation and Error Handling

### 7.1 JQL Validation Requirements

#### REQ-VAL-01: Project Compatibility Check
```javascript
async validateJQLForProject(jql, projectKey) {
  // Test the JQL with maxResults=1 to check validity
  const testUrl = `${baseUrl}/rest/api/2/search?jql=${encodeURIComponent(jql)}&maxResults=1`;
  
  try {
    const response = await fetch(testUrl, headers);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`JQL Invalid: ${error.errorMessages.join(', ')}`);
    }
    return true;
  } catch (error) {
    console.error(`JQL validation failed for project ${projectKey}: ${error.message}`);
    return false;
  }
}
```

#### REQ-VAL-02: Component Existence Check
```javascript
async validateComponent(projectKey, componentName) {
  const url = `${baseUrl}/rest/api/2/project/${projectKey}/components`;
  const response = await fetch(url, headers);
  const components = await response.json();
  
  const exists = components.some(c => c.name === componentName);
  if (!exists) {
    console.warn(`Component "${componentName}" not found in project ${projectKey}`);
    console.log(`Available components: ${components.map(c => c.name).join(', ')}`);
  }
  return exists;
}
```

### 7.2 Graceful Degradation

#### REQ-FALLBACK-01: Board Mode Fallback
```
IF board-based query fails:
1. Log warning about board access
2. Automatically fallback to issues-based query
3. Use project-wide filter with same criteria
4. Notify user of fallback mode
```

#### REQ-FALLBACK-02: Issues Mode Fallback  
```
IF component/status filters fail:
1. Remove failing filter criteria one by one
2. Start with: component → custom statuses → resolution
3. Keep: project, date range, issue types
4. Notify user of applied filters
```

---

## 8. Migration Strategy

### 8.1 Backward Compatibility

**For existing installations:**
1. Detect old `project-selection.json` format
2. Auto-migrate to new format with `dataSourceMode: "boards"`
3. Preserve existing board selections
4. Add migration timestamp

### 8.2 Default Behavior

**For new installations:**
1. Default to issues-based mode for flexibility
2. Provide guided setup wizard
3. Include mode selection in initial configuration

---

## 9. Testing Requirements

### 9.1 Test Cases

#### TC-01: Mode Selection Workflow
- User can choose between boards and issues mode
- Selection is persisted correctly
- Mode affects query execution path

#### TC-02: JQL Generation and Validation
- Issues mode generates valid JQL for each project
- Board mode applies JQL to board API correctly
- Invalid filters are caught and reported

#### TC-03: Fallback Scenarios
- Board access failure triggers issues mode fallback
- Invalid JQL components are gracefully removed
- User receives clear feedback on applied filters

#### TC-04: Cross-Project Compatibility
- Same workflow works for OCM, ROSA, HYPERSHIFT
- Project-specific components are validated
- Status values are project-appropriate

---

## 10. Implementation Timeline

### Phase 1: Core Mode Selection (Week 1)
- ✅ Design documentation (this document)
- 🔄 Update project selector with mode choice
- 🔄 Implement selection persistence
- 🔄 Basic mode-aware query routing

### Phase 2: Issues Mode Implementation (Week 1-2)
- 🔄 Issues filter configuration UI
- 🔄 JQL builder for issues mode
- 🔄 Validation and error handling
- 🔄 Component verification

### Phase 3: Enhancement and Testing (Week 2)
- 🔄 Command interface updates
- 🔄 Backward compatibility migration
- 🔄 Comprehensive testing
- 🔄 Documentation updates

---

*This design provides a clear separation between board-based and issues-based workflows while maintaining backward compatibility and adding powerful new filtering capabilities.*