# Jira Status Builder - Web UI

A modern React TypeScript web interface for the Jira Status Builder CLI tool, providing an intuitive way to generate executive reports from Red Hat Jira data without requiring terminal knowledge.

## 🚀 Features

### ✅ Completed Core Features

- **Authentication Setup Wizard**: Step-by-step PAT token configuration with validation
- **Project & Board Selection**: Interactive interface for browsing 920+ Red Hat projects
- **Report Generation Wizard**: Guided workflow with real-time progress tracking
- **Report Management**: View, download, and organize generated reports
- **Manual Input Interface**: Forms for qualitative data entry (team morale, celebrations, etc.)
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Material-UI Components**: Professional, accessible interface
- **Real-time Updates**: WebSocket integration for live progress feedback

### 🎯 Key UI Components

1. **Dashboard**: Central hub with quick actions and recent reports
2. **Configuration**: Authentication and settings management
3. **Project Selection**: Multi-modal project and board selection
4. **Report Generation**: Step-by-step report creation wizard
5. **Report Management**: Grid and list views with search and filtering
6. **Manual Input**: Rich forms for qualitative data collection

## 🏗️ Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Material-UI (MUI)** for components
- **React Router** for navigation
- **React Hook Form** for form management
- **Socket.IO Client** for real-time updates
- **Vite** for build tooling

### Backend Integration
- **Express.js API** layer interfacing with existing CLI code
- **WebSocket** server for real-time progress updates
- **RESTful endpoints** for all major operations

## 📁 Project Structure

```
ui/
├── src/
│   ├── components/          # Reusable UI components
│   │   └── Layout.tsx       # Main app layout with navigation
│   ├── pages/               # Page components
│   │   ├── Configuration.tsx     # Auth setup wizard
│   │   ├── Dashboard.tsx         # Main dashboard
│   │   ├── ProjectSelection.tsx  # Project/board selection
│   │   ├── ReportGeneration.tsx  # Report creation wizard
│   │   ├── ReportManagement.tsx  # Report viewing/management
│   │   └── ManualInput.tsx       # Qualitative data forms
│   ├── services/            # API and service layer
│   │   └── auth.ts          # Authentication service
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts         # All app types
│   ├── App.tsx              # Main app component
│   └── main.tsx             # App entry point
├── package.json             # Dependencies and scripts
├── vite.config.ts           # Vite configuration
└── tsconfig.json            # TypeScript configuration
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 16.0.0+
- npm 8.0.0+
- Existing Jira Status Builder CLI installation

### Installation Steps

1. **Install UI dependencies**:
   ```bash
   cd ui
   npm install
   ```

2. **Install server dependencies** (from project root):
   ```bash
   npm install
   ```

3. **Configure environment** (from project root):
   ```bash
   cp .env.example .env
   # Add your JIRA_API_TOKEN
   ```

## 🚀 Running the Application

### Development Mode

From the project root, run both the server and UI:

```bash
npm run dev
```

This starts:
- **Backend server** on `http://localhost:3001`
- **React UI** on `http://localhost:3000`

### Individual Services

**Start backend only**:
```bash
npm run server
```

**Start UI only**:
```bash
npm run ui
```

### Production Build

```bash
npm run build
```

## 🔧 Configuration

### Environment Variables

```bash
# .env file (project root)
JIRA_API_TOKEN=your_personal_access_token
PORT=3001
```

### UI Configuration

The UI automatically connects to the backend API and uses the same configuration as the CLI tool:

- **API Base URL**: Configurable in UI (defaults to Red Hat Jira)
- **Authentication**: PAT tokens stored securely in browser
- **Project Selection**: Saved locally and synced with CLI

## 📱 User Workflows

### 1. First-Time Setup
1. Open `http://localhost:3000`
2. Complete authentication setup wizard
3. Generate and enter PAT token
4. Verify connection to Jira

### 2. Project Selection
1. Navigate to Project Selection
2. Search and select your project (OCM, ROSA, etc.)
3. Choose board selection mode:
   - Single board
   - Multiple boards
   - Manual board IDs
   - All project boards
4. Save selection

### 3. Report Generation
1. Go to Generate Report
2. Configure parameters:
   - Date range
   - Velocity periods
   - Output formats
   - Manual input inclusion
3. Start generation
4. Monitor real-time progress
5. Download completed reports

### 4. Manual Input (Optional)
1. Navigate to Manual Input
2. Fill out forms:
   - Team morale assessment
   - Celebrations & achievements
   - Milestones & releases
   - Blockers & issues
   - Forward-looking priorities
3. Save data for report inclusion

## 🎨 UI Features

### Responsive Design
- **Desktop**: Full sidebar navigation, multi-column layouts
- **Tablet**: Collapsible sidebar, adapted forms
- **Mobile**: Bottom navigation, stacked layouts

### Accessibility
- **WCAG 2.1 AA** compliant
- **Keyboard navigation** for all features
- **Screen reader** compatible
- **High contrast** support
- **Focus indicators** throughout

### Real-time Features
- **Progress tracking** during report generation
- **WebSocket updates** for long-running operations
- **Status indicators** for all async operations

## 🔌 API Integration

### Authentication Endpoints
```typescript
POST /api/auth/validate     // Validate PAT token
```

### Project Endpoints
```typescript
GET  /api/projects          // List all projects
GET  /api/projects/:key/boards  // Get boards for project
```

### Selection Endpoints
```typescript
GET  /api/selection         // Get saved project selection
POST /api/selection         // Save project selection
```

### Report Endpoints
```typescript
POST /api/reports/generate  // Start report generation
GET  /api/reports/:id/status // Get generation status
GET  /api/reports           // List all reports
```

### Manual Input Endpoints
```typescript
GET  /api/manual-input      // Get saved manual input
POST /api/manual-input      // Save manual input
```

## 🔧 Customization

### Theme Customization

Edit `src/main.tsx` to customize the Material-UI theme:

```typescript
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' }
  }
  // Add your customizations
})
```

### Adding New Pages

1. Create component in `src/pages/`
2. Add route in `App.tsx`
3. Update navigation in `Layout.tsx`
4. Add any new types to `src/types/index.ts`

## 🧪 Development

### Code Style
- **TypeScript** for type safety
- **React Hooks** for state management
- **Material-UI** for consistent styling
- **React Hook Form** for form handling

### Key Libraries
- `@mui/material` - UI components
- `react-router-dom` - Client-side routing
- `socket.io-client` - Real-time communication
- `react-hook-form` - Form management
- `date-fns` - Date manipulation

## 🚧 Future Enhancements

### Planned Features
- **Data Visualization**: Charts for velocity trends and issue analytics
- **Advanced Filtering**: Enhanced search and filter capabilities
- **Template Management**: Custom report templates
- **Collaboration**: Multi-user support and sharing
- **Mobile App**: Native mobile applications
- **Integrations**: Slack, Teams, email notifications

### Performance Optimizations
- **Code splitting** for faster initial loads
- **Virtual scrolling** for large data sets
- **Caching strategies** for API responses
- **PWA features** for offline support

## 🔍 Troubleshooting

### Common Issues

**UI won't start**:
```bash
# Clear node_modules and reinstall
rm -rf ui/node_modules
cd ui && npm install
```

**API connection errors**:
- Check that backend server is running on port 3001
- Verify JIRA_API_TOKEN in .env file
- Check browser console for CORS errors

**Authentication fails**:
- Verify PAT token is valid
- Check token permissions in Red Hat Jira
- Ensure network access to Jira instance

**Reports not generating**:
- Check project selection is saved
- Verify board access permissions
- Monitor browser network tab for API errors

## 📊 Performance Metrics

### Target Performance
- **Initial load**: < 3 seconds
- **Page transitions**: < 200ms
- **Search responses**: < 500ms
- **Report generation start**: < 1 second

### Optimization Features
- Code splitting and lazy loading
- Virtual scrolling for large lists
- Debounced search inputs
- Cached API responses
- Optimistic UI updates

## 🤝 Contributing

### Development Workflow
1. Create feature branch
2. Implement changes
3. Test thoroughly
4. Update documentation
5. Submit pull request

### Code Standards
- Use TypeScript for all new code
- Follow Material-UI design patterns
- Implement proper error handling
- Add comprehensive prop types
- Include accessibility features

---

This UI transforms the powerful CLI tool into an intuitive web application, making Jira reporting accessible to non-technical users while maintaining all the advanced features of the original system.