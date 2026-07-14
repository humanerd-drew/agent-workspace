# `.agent/` workspace

[🇰🇷 한국어](README.ko.md)

A portable workspace that keeps your agent's identity, rules, workflows, and memory consistent across opencode, Claude Code, Cursor, and any MCP-compatible tool.

```bash
curl -fsSL https://raw.githubusercontent.com/humanerd-drew/agent-workspace/main/init.sh | bash
```

---

## Why

AGENTS.md standardized the instruction file format — a big step. But identity, rules, workflow, MCP config, and memory are still managed differently by each tool. Switch from opencode to Claude Code and your agent starts from zero.

At least three independent converter projects (sno-ai/mda, bodyboard, microsoft/skills) exist to bridge this gap. Converters exist because something isn't standardized.

This project takes a different approach: instead of converting between formats, use the same directory structure everywhere.

## Structure

```
.agent/
├── identity.md       # Role, voice, values
├── rules.md          # Immutable rules (must / must not)
├── workflow/
│   ├── init.md       # Session start protocol
│   └── general.md    # Default task workflow
└── memory/           # SQLite FTS5 (auto-created)

AGENTS.md             # AAIF bridge — references .agent/
```

AGENTS.md is no longer a monolithic file. It's an entry point that delegates to `.agent/`. **Switch tools, keep your agent.**

## Quick start

### One-liner

```bash
curl -fsSL https://raw.githubusercontent.com/humanerd-drew/agent-workspace/main/init.sh | bash
```

Auto-detects your framework, creates `.agent/`, and configures MCP memory.

### Manual

Copy the `agent/` directory to `.agent/` and add this to AGENTS.md:

```markdown
Read .agent/identity.md, .agent/rules.md at session start.
```

### Memory (MCP server, optional)

```bash
curl -fsSL https://raw.githubusercontent.com/humanerd-drew/agent-workspace/main/init.sh | bash -s -- --install
```

| Tool | Description |
|------|-------------|
| `agent-memory_remember` | Store |
| `agent-memory_recall` | FTS5 search |
| `agent-memory_forget` | Delete |
| `agent-memory_update` | Update |
| `agent-memory_memory-stats` | Statistics |

SQLite FTS5. No external APIs.

## Repository

```
agent-workspace/
├── agent/                # Reference .agent/ template
├── init.sh               # One-liner setup
├── packages/memory/      # MCP server (TypeScript)
├── packages/create/      # CLI init command (TypeScript)
└── AGENTS.md             # AAIF bridge
```

Requires Node.js for the MCP server.

## Reference

This standard was extracted from [opencode-drewgent](https://github.com/humanerd-drew/opencode-drewgent) — a personal agent system with 17,942 knowledge entries and 6 MCP servers, running for 6 months.

It works. ㅎ

## License

MIT. Fork, use, share. PRs and issues welcome.
