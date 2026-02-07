#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

// --- ANSI colors (no dependencies) ---
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;

// --- Paths ---
const home = os.homedir();
const claudeDir = path.join(home, '.claude');
const settingsPath = path.join(claudeDir, 'settings.json');
const destScript = path.join(claudeDir, 'statusline-command.sh');
const srcScript = path.join(__dirname, '..', 'statusline-command.sh');

// --- Helpers ---
function readSettings() {
  try {
    const raw = fs.readFileSync(settingsPath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function writeSettings(obj) {
  fs.writeFileSync(settingsPath, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

// --- Commands ---
function install() {
  console.log(bold('claude-statusline install\n'));

  // 1. Ensure ~/.claude/ exists
  if (!fs.existsSync(claudeDir)) {
    fs.mkdirSync(claudeDir, { recursive: true });
    console.log(green('  Created'), claudeDir);
  }

  // 2. Copy statusline-command.sh
  fs.copyFileSync(srcScript, destScript);
  fs.chmodSync(destScript, 0o755);
  console.log(green('  Copied'), `statusline-command.sh -> ${destScript}`);

  // 3. Update settings.json
  const settings = readSettings();
  settings.statusLine = {
    type: 'command',
    command: `bash ${destScript}`,
  };
  writeSettings(settings);
  console.log(green('  Updated'), settingsPath);

  console.log(bold('\nDone!'), 'Restart Claude Code to see the status line.');
}

function uninstall() {
  console.log(bold('claude-statusline uninstall\n'));

  // 1. Remove script
  if (fs.existsSync(destScript)) {
    fs.unlinkSync(destScript);
    console.log(green('  Removed'), destScript);
  } else {
    console.log(dim('  Already removed'), destScript);
  }

  // 2. Remove statusLine key from settings
  if (fs.existsSync(settingsPath)) {
    const settings = readSettings();
    if ('statusLine' in settings) {
      delete settings.statusLine;
      writeSettings(settings);
      console.log(green('  Removed'), 'statusLine from settings.json');
    } else {
      console.log(dim('  No statusLine key'), 'in settings.json');
    }
  }

  console.log(bold('\nDone!'), 'Status line has been removed.');
}

function usage() {
  console.log(`
${bold('claude-statusline')} - Custom status line for Claude Code

${bold('Usage:')}
  npx claude-statusline install     Install the status line
  npx claude-statusline uninstall   Remove the status line

${bold('What it does:')}
  Adds a two-line status bar to Claude Code showing:
  - Project path, git branch, model name, version
  - Context window usage bar with color-coded thresholds
`);
}

// --- Main ---
const command = process.argv[2];

switch (command) {
  case 'install':
    install();
    break;
  case 'uninstall':
    uninstall();
    break;
  default:
    usage();
    process.exit(command ? 1 : 0);
}
