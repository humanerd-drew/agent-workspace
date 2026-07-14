# agent-workspace

Cross-framework agent workspace — `.agent/` directory standard.

```bash
npx @agent-workspace/create init
```

Creates a portable `.agent/` directory with identity, rules, workflow, and persistent memory — works with opencode, Claude Code, Cursor, Codex, and any MCP-compatible agent.

## Structure

```
.agent/
├── identity.md       # Who you are (role, voice, values)
├── rules.md          # Immutable rules (must/must not)
├── workflow/
│   ├── init.md       # Session start protocol
│   └── general.md    # Default task workflow
└── memory/           # Persistent memory (SQLite DB, auto-created)

AGENTS.md             # AAIF standard, references .agent/
```

## Packages

| Package | Description |
|---------|-------------|
| `@agent-workspace/memory` | MCP server — persistent memory with full-text search |
| `@agent-workspace/create` | CLI — initialize `.agent/` workspace |

## Why?

Switch between opencode, Claude Code, Cursor, or Codex — your agent's identity, rules, and memory follow you.
