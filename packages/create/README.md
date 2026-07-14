# @agent-workspace/create

Initialize `.agent/` workspace — a portable, cross-framework agent configuration directory.

```
npx @agent-workspace/create init
```

## What it creates

```
.agent/
├── identity.md       # Who you are (role, voice, values)
├── rules.md          # Immutable rules (must/must not)
├── workflow/
│   ├── init.md       # Session start protocol
│   └── general.md    # Default task workflow
└── memory/           # Persistent memory (SQLite DB)

AGENTS.md             # AAIF standard, references .agent/
```

## Framework auto-detection

Detects and configures MCP memory server for:

| Framework | Config file |
|-----------|-------------|
| opencode | `opencode.jsonc` — `mcp.agent-memory` |
| Claude Code | `.claude/settings.local.json` — `mcpServers.agent-memory` |
| Cursor | `.cursor/mcp.json` — `mcpServers.agent-memory` |
| Generic | Creates `.agent/` only, prints manual setup guide |

## Options

| Flag | Description |
|------|-------------|
| `--name "My Agent"` | Agent name (default: directory name) |
| `--role "role"` | Agent role (default: "software engineering agent") |
| `--domain "domain"` | Primary domain (default: "software development") |
| `--yes` | Skip prompts |
| `--install` | Install `@agent-workspace/memory` locally (faster startup) |
| `--global` | Use global memory at `~/.agent/memory/` (shared across projects) |
| `--framework` | Force framework: `opencode`, `claude-code`, `cursor`, `generic` |

## Why `.agent/`?

`.agent/` decouples your agent's identity, rules, and memory from any specific tool. Switch between opencode, Claude Code, Cursor, or Codex — your agent setup follows you.

See [agent-workspace/starter](https://github.com/agent-workspace/starter) for the full template.
