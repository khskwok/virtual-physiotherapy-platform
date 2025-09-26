# 🔧 Build Automation System

This project includes an automated build numbering system that tracks changes and increments build numbers automatically.

## 📋 Features

- **Automatic Build Increment**: Build numbers increment on every change
- **Git Integration**: Auto-increment on git commits via pre-commit hooks
- **File Watching**: Monitor file changes during development
- **Build Info Display**: Show build information in the UI
- **Version Management**: Semantic versioning with build metadata
- **Multi-trigger Support**: Manual, git hooks, and file watching

## 🚀 Quick Start

### Initialize Build System
```bash
npm run setup:hooks
```

### Development Commands
```bash
# Start development with build increment
npm run dev

# Start development with file watching (auto-increment on changes)
npm run dev:watch

# Watch files for changes (separate process)
npm run watch:build
```

### Build Commands
```bash
# Production build with increment
npm run build

# Manual build increment
npm run build:increment

# Inject build info into client
npm run build:inject
```

## 📁 File Structure

```
scripts/
├── increment-build.js      # Core build increment logic
├── inject-build-info.js    # Inject build info into client
├── setup-git-hooks.js      # Setup git pre-commit hooks
├── watch-and-increment.js  # File watcher for auto-increment
└── build-automation.js     # Main automation script

build-info.json            # Build metadata (tracked in git)
client/src/components/BuildInfo.tsx  # UI component for build info
```

## 🔄 How It Works

### 1. Build Number Tracking
- `build-info.json` stores current build number and metadata
- Build number increments on each change
- Git commit hash and branch are tracked
- Build timestamp is recorded

### 2. Automatic Triggers
- **Git Commits**: Pre-commit hook auto-increments
- **File Changes**: File watcher detects changes in development
- **Manual Builds**: Explicit build commands

### 3. Version Format
```
1.0.0+123
│ │ │  └── Build number
│ │ └──── Patch version
│ └────── Minor version
└──────── Major version
```

### 4. Build Info Display
- Shows in bottom-right corner of UI
- Click to view detailed build information
- Different colors for development vs production
- Displays build number, git branch, and commit

## ⚙️ Configuration

### Watched Directories
```javascript
const watchDirs = [
  'client/src',
  'server',
  'client/public'
];
```

### Watched File Extensions
```javascript
const watchExtensions = ['.js', '.jsx', '.ts', '.tsx', '.json', '.css', '.scss', '.html'];
```

### Build Info Structure
```json
{
  "buildNumber": 123,
  "version": "1.0.0",
  "lastBuild": "2024-01-15T10:30:00.000Z",
  "gitCommit": "abc1234",
  "gitBranch": "main",
  "buildType": "development"
}
```

## 🎯 Usage Examples

### Manual Build Increment
```bash
node scripts/increment-build.js
```

### Setup Git Hooks
```bash
node scripts/setup-git-hooks.js
```

### Start File Watcher
```bash
node scripts/watch-and-increment.js
```

### Full Build Process
```bash
node scripts/build-automation.js full-build
```

## 🔍 Build Info Component

The `BuildInfo` component displays build information in the UI:

```tsx
<BuildInfo 
  show={true} 
  position="bottom-right" 
/>
```

### Props
- `show`: Boolean to show/hide component
- `position`: Corner position ('top-left', 'top-right', 'bottom-left', 'bottom-right')

## 🐛 Troubleshooting

### Git Hooks Not Working
```bash
# Re-run setup
npm run setup:hooks

# Check if .git/hooks/pre-commit exists and is executable
ls -la .git/hooks/pre-commit
```

### File Watcher Issues
```bash
# Check if directories exist
ls -la client/src server client/public

# Restart file watcher
npm run watch:build
```

### Build Info Not Showing
```bash
# Ensure build info is injected
npm run build:inject

# Check browser console for build info
# Should see: "🔧 Build Info: {...}"
```

## 📊 Build Metrics

The system tracks:
- Total build count
- Build frequency
- Git commit correlation
- Development vs production builds
- Build duration (can be extended)

## 🔒 Security Notes

- `build-info.json` is tracked in git for build history
- No sensitive information is stored in build metadata
- Git commit hashes are shortened for security
- Build info is only displayed in development by default

## 🚀 Production Deployment

For production builds:
```bash
NODE_ENV=production npm run build
```

This will:
1. Increment build number
2. Set build type to 'production'
3. Inject build info
4. Create optimized client build
5. Hide detailed build info in UI (production mode)

## 📈 Future Enhancements

- Build duration tracking
- Build size metrics
- Automated changelog generation
- Integration with CI/CD pipelines
- Build notification system
- Performance metrics tracking