#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Paths
const buildInfoPath = path.join(__dirname, '../build-info.json');
const packageJsonPath = path.join(__dirname, '../package.json');
const clientPackageJsonPath = path.join(__dirname, '../client/package.json');

function getCurrentGitCommit() {
  try {
    return execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
  } catch (error) {
    return 'unknown';
  }
}

function getCurrentGitBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
  } catch (error) {
    return 'unknown';
  }
}

function incrementBuildNumber() {
  console.log('🔧 Incrementing build number...');
  
  // Read current build info
  let buildInfo;
  try {
    buildInfo = JSON.parse(fs.readFileSync(buildInfoPath, 'utf8'));
  } catch (error) {
    console.log('📝 Creating new build-info.json...');
    buildInfo = {
      buildNumber: 0,
      version: "1.0.0",
      lastBuild: new Date().toISOString(),
      gitCommit: "",
      buildType: "development"
    };
  }

  // Increment build number
  buildInfo.buildNumber += 1;
  buildInfo.lastBuild = new Date().toISOString();
  buildInfo.gitCommit = getCurrentGitCommit();
  buildInfo.gitBranch = getCurrentGitBranch();
  buildInfo.buildType = process.env.NODE_ENV === 'production' ? 'production' : 'development';

  // Update version with build number (semantic versioning + build)
  const [major, minor, patch] = buildInfo.version.split('.');
  const newVersion = `${major}.${minor}.${patch}+${buildInfo.buildNumber}`;

  // Write updated build info
  fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2));

  // Update package.json files
  updatePackageJson(packageJsonPath, newVersion, buildInfo);
  updatePackageJson(clientPackageJsonPath, newVersion, buildInfo);

  console.log(`✅ Build number incremented to: ${buildInfo.buildNumber}`);
  console.log(`📦 Version updated to: ${newVersion}`);
  console.log(`🌿 Git branch: ${buildInfo.gitBranch}`);
  console.log(`🔗 Git commit: ${buildInfo.gitCommit}`);
  console.log(`⏰ Build time: ${buildInfo.lastBuild}`);

  return buildInfo;
}

function updatePackageJson(packagePath, newVersion, buildInfo) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    packageJson.version = newVersion;
    
    // Add build metadata
    packageJson.buildInfo = {
      buildNumber: buildInfo.buildNumber,
      buildDate: buildInfo.lastBuild,
      gitCommit: buildInfo.gitCommit,
      gitBranch: buildInfo.gitBranch,
      buildType: buildInfo.buildType
    };

    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
    console.log(`📝 Updated ${path.basename(packagePath)}`);
  } catch (error) {
    console.error(`❌ Error updating ${packagePath}:`, error.message);
  }
}

// Run if called directly
if (require.main === module) {
  incrementBuildNumber();
}

module.exports = { incrementBuildNumber };