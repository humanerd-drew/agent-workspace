# `.agent/` workspace

[🇰🇷 한국어](README.ko.md)

If you've ever switched AI coding agents, you know this feeling.

You spent months building your setup on opencode — identity, rules, MCP servers, a growing knowledge base. Then you try Claude Code. The agent doesn't remember you. Identity needs re-explaining. MCP config is a different JSON format in a different directory. Your memory is gone.

AGENTS.md standardized the file format — that was huge. But an agent needs more than instructions.

---

## Why

AGENTS.md solved one problem: "where do I put my instructions?" It did it well, with AAIF backing and 60,000+ projects adopting it. Every major tool supports it.

But everything else an agent needs is still scattered. MCP configs live in tool-specific files. Memory databases are in different locations. Rules and workflows are embedded in AGENTS.md itself, making it hard to share or version.

Switch tools, and your agent starts from zero.

If you've searched for converter projects (sno-ai/mda, bodyboard, microsoft/skills), you know this pain. Three independent projects trying to bridge the same gap. Converters exist because something isn't standardized.

This project takes a different approach. Instead of converting between formats, use the same structure everywhere.

---

## What

```
.agent/
├── identity.md          # Role, voice, values
├── rules.md             # Immutable rules (must / must not)
├── workflow/
│   ├── init.md          # Session start protocol
│   └── general.md       # Default task workflow
└── memory/              # SQLite FTS5 (auto-created)

AGENTS.md                # AAIF bridge — references .agent/
```

AGENTS.md is no longer a monolithic file. It's an entry point that delegates to `.agent/`. The actual configuration lives in the directory.

One directory to manage, regardless of framework. opencode reads it, Claude Code reads it, Cursor reads it — same files, different readers.

---

## How

```bash
curl -fsSL https://raw.githubusercontent.com/humanerd-drew/agent-workspace/main/init.sh | bash
```

Auto-detects your framework, creates `.agent/`, configures MCP.

### Manual setup is just as simple

Fork the template repo, or copy the `agent/` directory and rename it to `.agent/`. Add one line to AGENTS.md:

```markdown
Read .agent/identity.md, .agent/rules.md at session start.
```

### Memory (MCP server)

```bash
curl -fsSL https://raw.githubusercontent.com/humanerd-drew/agent-workspace/main/init.sh | bash -s -- --install
```

| Tool | Description |
|------|-------------|
| `agent-memory_remember(fact, type?)` | Store |
| `agent-memory_recall(query, limit?)` | FTS5 search |
| `agent-memory_forget(id)` | Delete |
| `agent-memory_update(id, fact?, type?)` | Update |
| `agent-memory_memory-stats()` | Statistics |

SQLite FTS5. No external APIs. Data lives in `.agent/memory/knowledge.db`.

---

## Structure

```
agent-workspace/
├── agent/                    # Reference .agent/ implementation
│   ├── identity.md
│   ├── rules.md
│   └── workflow/
│       ├── init.md
│       └── general.md
├── init.sh                   # One-liner setup
├── packages/
│   ├── memory/               # MCP server
│   │   └── src/
│   │       ├── index.ts
│   │       └── storage/sqlite.ts
│   └── create/               # CLI init command
│       └── src/
│           ├── index.ts
│           └── framework.ts
├── AGENTS.md
└── README.md
```

TypeScript. Node.js required for MCP server.

---

## Reference: opencode-drewgent

This standard was extracted from 6 months of real usage in [opencode-drewgent](https://github.com/humanerd-drew/opencode-drewgent) — a personal agent system running 17,942 knowledge entries across 6 MCP servers.

It works. ㅎ

---

## License & contribution

MIT. Fork it, use it, share it. PRs and issues welcome.

This is a personal proposal, not a formal standard. Take what works, leave what doesn't. Standards aren't built alone — if you have thoughts, I'd love to hear them.
