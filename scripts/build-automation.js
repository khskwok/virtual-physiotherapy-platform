#!/usr/bin/env node

const { incrementBuildNumber } = require('./increment-build');
const { injectBuildInfo } = require('./inject-build-info');
const { setupGitHooks } = require('./setup-git-hooks');
const { startWatching } = require('./watch-and-increment');

const command = process.argv[2];

switch (command) {
  case 'increment':
    incrementBuildNumber();
    break;
    
  case 'inject':
    injectBuildInfo();
    break;
    
  case 'setup-hooks':
    setupGitHooks();
    break;
    
  case 'watch':
    startWatching();
    break;
    
  case 'review':
    console.log('🔍 Running Q Developer code review...');
    const { exec } = require('child_process');
    exec('q review --diff', (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Review failed:', error.message);
        process.exit(1);
      }
      console.log(stdout);
      if (stderr) console.warn(stderr);
    });
    break;
    
  case 'generate-tests':
    console.log('🧪 Generating tests with Q Developer...');
    exec('q generate tests', (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Test generation failed:', error.message);
        return;
      }
      console.log(stdout);
      if (stderr) console.warn(stderr);
    });
    break;
    
  case 'full-build':
    console.log('🚀 Running full build automation...');
    incrementBuildNumber();
    injectBuildInfo();
    console.log('✅ Full build automation complete!');
    break;
    
  case 'init':
    console.log('🔧 Initializing build automation...');
    setupGitHooks();
    incrementBuildNumber();
    injectBuildInfo();
    console.log('✅ Build automation initialized!');
    console.log('');
    console.log('Available commands:');
    console.log('  npm run dev          - Start development with build increment');
    console.log('  npm run dev:watch    - Start development with file watching');
    console.log('  npm run build        - Production build with increment');
    console.log('  npm run watch:build  - Watch files and auto-increment');
    break;
    
  default:
    console.log('🔧 Build Automation Tool');
    console.log('');
    console.log('Usage: node scripts/build-automation.js <command>');
    console.log('');
    console.log('Commands:');
    console.log('  increment     - Increment build number');
    console.log('  inject        - Inject build info into client');
    console.log('  setup-hooks   - Setup git hooks');
    console.log('  watch         - Watch files for changes');
    console.log('  review        - Run Q Developer code review');
    console.log('  generate-tests- Generate tests with Q Developer');
    console.log('  full-build    - Run complete build process');
    console.log('  init          - Initialize build automation');
    break;
}

module.exports = {
  incrementBuildNumber,
  injectBuildInfo,
  setupGitHooks,
  startWatching
};