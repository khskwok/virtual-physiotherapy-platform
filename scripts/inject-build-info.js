#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function injectBuildInfo() {
  const buildInfoPath = path.join(__dirname, '../build-info.json');
  const publicIndexPath = path.join(__dirname, '../client/public/index.html');
  
  try {
    // Read build info
    const buildInfo = JSON.parse(fs.readFileSync(buildInfoPath, 'utf8'));
    
    // Read index.html
    let indexHtml = fs.readFileSync(publicIndexPath, 'utf8');
    
    // Create build info script
    const buildInfoScript = `
    <script>
      window.__BUILD_INFO__ = ${JSON.stringify(buildInfo, null, 2)};
      console.log('🔧 Build Info:', window.__BUILD_INFO__);
    </script>`;
    
    // Remove existing build info script if present
    indexHtml = indexHtml.replace(/<script>\s*window\.__BUILD_INFO__[\s\S]*?<\/script>/g, '');
    
    // Inject new build info script before closing head tag
    indexHtml = indexHtml.replace('</head>', `${buildInfoScript}\n  </head>`);
    
    // Write updated index.html
    fs.writeFileSync(publicIndexPath, indexHtml);
    
    console.log('✅ Build info injected into client');
    console.log(`📦 Build #${buildInfo.buildNumber} (${buildInfo.gitCommit})`);
    
  } catch (error) {
    console.error('❌ Error injecting build info:', error.message);
  }
}

// Run if called directly
if (require.main === module) {
  injectBuildInfo();
}

module.exports = { injectBuildInfo };