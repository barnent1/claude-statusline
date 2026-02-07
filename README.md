# claude-statusline

Custom two-line status bar for [Claude Code](https://claude.ai/claude-code) CLI.

Displays project path, git branch, model name, version, and a color-coded context window usage bar — all rendered in under 50ms with zero network calls.

## Install

```bash
npx github:barnent1/claude-statusline install
```

This copies the status line script to `~/.claude/` and configures `settings.json` automatically. Restart Claude Code to see it.

## Uninstall

```bash
npx github:barnent1/claude-statusline uninstall
```

Removes the script and cleans up `settings.json`.

## What It Shows

**Line 1:** `project-path   git-branch   model-name          version`

**Line 2:** Color-coded context window bar with percentage and threshold warnings:

| Usage | Color | Indicator |
|-------|-------|-----------|
| < 50% | Green | — |
| 50-59% | Amber | compact soon |
| 60-74% | Orange | compacting |
| 75-89% | Deep Orange | consider new session |
| 90%+ | Red | new session recommended |

## Requirements

- Claude Code CLI
- `jq` (for JSON parsing in the shell script)
- `git` (for branch detection)
- Terminal with true-color (24-bit) support

## License

MIT
