#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

// Support both compiled dist/runner.js and direct invocation
const distRunner = path.join(__dirname, '..', 'dist', 'runner.js');

if (!fs.existsSync(distRunner)) {
  console.error('Error: expo-release-guard has not been built yet. Run npm run build.');
  process.exit(1);
}

const { runReleaseGuard } = require(distRunner);

const args = process.argv.slice(2);
const isJson = args.includes('--json');
const targetDir = args.find(a => !a.startsWith('--')) || process.cwd();

const exitCode = runReleaseGuard(path.resolve(targetDir), { json: isJson });
process.exit(exitCode);
