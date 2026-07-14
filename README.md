# `.agent/` workspace

**One folder to rule your AI agents.** Cross-framework identity, rules, and memory — portable across every major AI coding tool.

[🇰🇷 한국어](README.ko.md)

```bash
curl -fsSL https://raw.githubusercontent.com/humanerd-drew/agent-workspace/main/init.sh | bash
```

---

## The problem

Every AI coding tool — opencode, Claude Code, Cursor, Windsurf, Copilot — has its own config format. Your agent's personality, rules, and memory are locked into one tool. Switch tools? Everything resets.

There are converter projects (sno-ai/mda, bodyboard, microsoft/skills) that translate between formats. But that's a symptom, not a fix. The root cause: **there's no portable layer for agent configuration.**

## The solution

`.agent/` is a plain-text directory that any tool can read:

```
.agent/
├── identity.md       # Who the agent is — role, voice, values
├── rules.md          # Immutable rules — always on
├── workflow/
│   ├── init.md       # Session start routine
│   └── general.md    # Default task workflow
└── memory/           # Persistent cross-session memory
```

Point `agents.md` (the AAIF standard file) at `.agent/`, and your agent configuration follows you everywhere.

## Quick start

**One-liner** — auto-detects your tool, sets up everything:

```bash
curl -fsSL https://raw.githubusercontent.com/humanerd-drew/agent-workspace/main/init.sh | bash
```

**With persistent memory** — remembers past sessions:

```bash
curl -fsSL https://raw.githubusercontent.com/humanerd-drew/agent-workspace/main/init.sh | bash -s -- --install
```

**Manual** — copy the `agent/` folder to `.agent/`, add this to `agents.md`:

```markdown
Read .agent/identity.md, .agent/rules.md at session start.
```

## Inside `init.sh`

| Feature | Detail |
|---------|--------|
| **Framework detection** | Detects opencode, Claude Code, Cursor, generic |
| **Template generation** | Creates identity, rules, workflow files |
| **MCP wiring** | Configures the memory server for your tool |
| **`--install`** | Clones & builds the [@agent-workspace/memory](#agent-workspacememory) server locally |
| **`--name`** | Custom agent name (default: directory name) |

## Packages

Two npm packages live in `packages/`:

### `@agent-workspace/memory`

MCP server for persistent cross-session memory. SQLite + FTS5, zero external API calls, zero native dependencies.

```bash
npx @agent-workspace/memory --db .agent/memory/knowledge.db
```

| Tool | Description |
|------|-------------|
| `remember(fact, type?)` | Save a memory entry |
| `recall(query, limit?)` | Full-text search across memories |
| `forget(id)` | Delete by ID |
| `update(id, fact?, type?)` | Update content/type |
| `memory-stats()` | Entry count, type breakdown, DB size |

### `@agent-workspace/create`

CLI to initialize `.agent/` workspace with framework auto-detection.

```bash
npx @agent-workspace/create init
```

Supports `--name`, `--role`, `--domain`, `--global`, `--install`, `--framework` flags.

## Real-world provenance

The `.agent/` structure and its conventions are adapted from [opencode-drewgent](https://github.com/humanerd-drew/opencode-drewgent) — a personal agent system operating for 6+ months with 17,942 knowledge entries across 6 MCP servers. The rules, workflows, and patterns in this template are distilled from what actually worked in production: preference learning loops, Layer 0 governance, proven decision frameworks, and the raw feedback of daily use.

This is not a toy template. Every line in `agent/` has been shaped by real corrections and real use.

## License

MIT. Fork, use, share. PRs and issues welcome.

This is a personal proposal, not a formal standard. Take what works, leave what doesn't.
