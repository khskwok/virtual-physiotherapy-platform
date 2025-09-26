#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { incrementBuildNumber } = require('./increment-build');

// Debounce function to prevent multiple rapid increments
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Directories to watch for changes
const watchDirs = [
  path.join(__dirname, '../client/src'),
  path.join(__dirname, '../server'),
  path.join(__dirname, '../client/public')
];

// File extensions to watch
const watchExtensions = ['.js', '.jsx', '.ts', '.tsx', '.json', '.css', '.scss', '.html'];

// Debounced increment function (wait 2 seconds after last change)
const debouncedIncrement = debounce(() => {
  console.log('\n📁 File changes detected, incrementing build number...');
  incrementBuildNumber();
}, 2000);

function shouldWatchFile(filename) {
  const ext = path.extname(filename);
  return watchExtensions.includes(ext);
}

function watchDirectory(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`⚠️  Directory ${dir} does not exist, skipping...`);
    return;
  }

  console.log(`👀 Watching directory: ${dir}`);
  
  fs.watch(dir, { recursive: true }, (eventType, filename) => {
    if (filename && shouldWatchFile(filename)) {
      console.log(`📝 File changed: ${filename}`);
      debouncedIncrement();
    }
  });
}

function startWatching() {
  console.log('🚀 Starting file watcher for auto build increment...');
  console.log('📋 Watching for changes in:');
  
  watchDirs.forEach(dir => {
    console.log(`   - ${path.relative(process.cwd(), dir)}`);
    watchDirectory(dir);
  });
  
  console.log('\n✅ File watcher started. Build number will increment on file changes.');
  console.log('🛑 Press Ctrl+C to stop watching\n');
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping file watcher...');
  process.exit(0);
});

// Run if called directly
if (require.main === module) {
  startWatching();
}

module.exports = { startWatching };