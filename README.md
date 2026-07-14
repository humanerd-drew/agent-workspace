# `.agent/` workspace

[🇰🇷 한국어](README.ko.md)

A portable settings folder that keeps your AI agent's personality, rules, and memory consistent across opencode, Claude Code, Cursor, and other compatible tools.

```bash
curl -fsSL https://raw.githubusercontent.com/humanerd-drew/agent-workspace/main/init.sh | bash
```

---

## Why

AGENTS.md standardized the instruction file format — a much-needed step. But your agent's identity, workflow, and memory are still stored differently by each tool. Switch tools and all of that resets.

Multiple independent projects (sno-ai/mda, bodyboard, microsoft/skills) emerged to convert configurations between tools. That's a sign something fundamental isn't standardized.

This project takes a different approach: instead of converting between formats, use the same directory structure that all tools can read.

## What's inside

```
.agent/
├── identity.md       # Your agent's personality, role, and voice
├── rules.md          # Immutable rules and constraints
├── workflow/
│   ├── init.md       # Session start routine
│   └── general.md    # Default task workflow
└── memory/           # Cross-session memory (auto-created)
```

Plain text files. Manage one folder, and your agent stays the same across tools.

## Quick start

### One-liner (recommended)

```bash
curl -fsSL https://raw.githubusercontent.com/humanerd-drew/agent-workspace/main/init.sh | bash
```

Auto-detects your current tool and creates `.agent/` with everything configured.

### Manual

Copy the `agent/` folder to `.agent/` and add this to `AGENTS.md`:

```markdown
Read .agent/identity.md, .agent/rules.md at session start.
```

### Persistent memory (optional)

```bash
curl -fsSL https://raw.githubusercontent.com/humanerd-drew/agent-workspace/main/init.sh | bash -s -- --install
```

Enables cross-session memory: remember past decisions, search them, edit or delete them.

| Tool | Description |
|------|-------------|
| remember | Save new information |
| recall | Search saved information |
| forget | Delete information |
| update | Edit information |
| memory-stats | Show statistics |

## Repository

```
agent-workspace/
├── agent/                # Reference .agent/ template
├── init.sh               # Setup script
├── packages/
│   ├── memory/           # Memory server (requires Node.js)
│   └── create/           # Setup CLI (requires Node.js)
└── AGENTS.md             # AAIF standard file
```

## Reference

This standard was extracted from [opencode-drewgent](https://github.com/humanerd-drew/opencode-drewgent) — a personal agent system running 17,942 knowledge entries across 6 MCP servers for 6 months.

## License & contribution

MIT. Fork, use, share. PRs and issues welcome.

This is a personal proposal, not a formal standard. Take what works, leave what doesn't.
