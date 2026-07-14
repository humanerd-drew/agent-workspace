# `.agent/` workspace

[🇰🇷 한국어](README.ko.md)

A portable settings directory that keeps your AI agent's personality, rules, and memory consistent across opencode, Claude Code, Cursor, and other compatible tools.

```bash
curl -fsSL https://raw.githubusercontent.com/humanerd-drew/agent-workspace/main/init.sh | bash
```

---

## What is this

Every AI coding agent stores its settings differently. Switch from one to another and you start from scratch — your identity, rules, and past conversations don't carry over.

The `.agent/` directory is a shared settings folder that multiple tools can read. Change tools, keep your agent.

## What's inside

```
.agent/
├── identity.md       # Who you are — your agent's personality and voice
├── rules.md          # What never to do — immutable rules
├── workflow/
│   ├── init.md       # How to start a session
│   └── general.md    # How to handle tasks
└── memory/           # Past conversations and decisions
```

Plain text files, read directly by the agent.

## Getting started

### One-liner

Auto-detects your current tool and configures everything:

```bash
curl -fsSL https://raw.githubusercontent.com/humanerd-drew/agent-workspace/main/init.sh | bash
```

### Manual setup

Copy the `agent/` folder and rename it to `.agent/`. Add one line to `AGENTS.md`:

```markdown
Read .agent/identity.md, .agent/rules.md at session start.
```

### Persistent memory (optional)

Add `--install` to enable cross-session memory.

## Reference

This standard was extracted from [opencode-drewgent](https://github.com/humanerd-drew/opencode-drewgent), a personal agent system running in production for 6 months.

## License

MIT.
