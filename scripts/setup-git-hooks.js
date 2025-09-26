#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const preCommitHook = `#!/bin/sh
# Auto-increment build number on commit
echo "🔧 Auto-incrementing build number..."
node scripts/increment-build.js

# Add updated files to commit
git add build-info.json package.json client/package.json

echo "✅ Build number updated and added to commit"
`;

const gitHooksDir = path.join(__dirname, '../.git/hooks');
const preCommitPath = path.join(gitHooksDir, 'pre-commit');

function setupGitHooks() {
  try {
    // Check if .git directory exists
    if (!fs.existsSync(gitHooksDir)) {
      console.log('❌ Git repository not found. Initialize git first with: git init');
      return;
    }

    // Write pre-commit hook
    fs.writeFileSync(preCommitPath, preCommitHook);
    
    // Make it executable (Unix/Linux/Mac)
    if (process.platform !== 'win32') {
      fs.chmodSync(preCommitPath, '755');
    }

    console.log('✅ Git pre-commit hook installed successfully!');
    console.log('🔧 Build number will auto-increment on every git commit');
  } catch (error) {
    console.error('❌ Error setting up git hooks:', error.message);
  }
}

// Run if called directly
if (require.main === module) {
  setupGitHooks();
}

module.exports = { setupGitHooks };