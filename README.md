# `.agent/` workspace

**You know what your AI agent should be. It should know it too — everywhere.**

[🇰🇷 한국어](README.ko.md)

---

If you use AI coding tools, you've probably felt this: you spend hours teaching your agent your preferences, your rules, your workflow. Then you switch to a different tool — and it all resets. You're back to square one. The agent that knew you so well becomes a stranger.

This project is a one-time fix for that frustration.

## The idea

A single folder you put in your project — `.agent/` — that any AI tool can read. Your agent's personality, rules, and memory live *in that folder*, not locked inside Claude Code or Cursor or opencode.

```
.agent/
├── identity.md       # Who the agent is — role, voice, values
├── rules.md          # Rules that never bend — always on
├── workflow/
│   ├── init.md       # What to do at session start
│   └── general.md    # How to approach everyday work
└── memory/           # What it learned from past sessions
```

Switch tools? Your agent stays the same. Your rules, your voice, your accumulated wisdom — all there, because they never left the folder.

```bash
curl -fsSL https://raw.githubusercontent.com/humanerd-drew/agent-workspace/main/init.sh | bash
```

One line. It detects what tool you use, writes the identity and rules files, and connects a memory system. You're done in seconds.

---

## Why this matters

AI coding tools are getting better at a dizzying pace. Every month there's a new one worth trying. But trying a new tool costs you everything your current agent knows about you.

Converter tools exist — they translate configs from one format to another. But that's like translating a book every time you switch languages, instead of writing in a language everyone speaks. The real fix isn't translation. **The real fix is a portable layer.** A lingua franca for agent configuration.

That's what `.agent/` is. A directory any tool can read. Plain text. No lock-in. Your agent's soul, in a folder.

## What you get

| File | What it does | How it helps |
|------|-------------|-------------|
| `identity.md` | Your agent's role, voice, values | Every session starts with the right tone |
| `rules.md` | Non-negotiable constraints | Safety rails that never disappear |
| `workflow/init.md` | Session start protocol | No more "set the mood" every time |
| `workflow/general.md` | Default task workflow | Consistent approach, session after session |
| `memory/` | Cross-session persistence | Yesterday's lessons are today's starting point |

## Quick start

**Try it now** — one command, works everywhere:

```bash
curl -fsSL https://raw.githubusercontent.com/humanerd-drew/agent-workspace/main/init.sh | bash
```

That's it. The script checks what tool you're using (opencode, Claude Code, Cursor, or something else), writes the template files, connects memory. You'll see `.agent/` appear in your project.

**With memory that lasts** — remembers what it learned across sessions:

```bash
curl -fsSL https://raw.githubusercontent.com/humanerd-drew/agent-workspace/main/init.sh | bash -s -- --install
```

**On any system** — macOS, Linux, Windows (WSL or Git Bash). The script was rewritten to work everywhere, handling differences between operating systems so you don't have to.

**By hand** — if you prefer no magic, copy the `agent/` folder manually:

```markdown
Read .agent/identity.md, .agent/rules.md at session start.
```

Add that to `agents.md` (or `CLAUDE.md` for Claude Code) and you're set.

## How init.sh works

Behind the simple one-liner is a careful dance with your tools:

| What it does | Why it matters |
|-------------|---------------|
| **Detects your tool** | Finds opencode.jsonc, CLAUDE.md, .cursorrules — no flags needed |
| **Creates identity + rules** | Writes template files with your agent's name |
| **Bridges agents.md → CLAUDE.md** | Claude Code reads CLAUDE.md, not agents.md. The script creates the bridge automatically |
| **Wires up memory** | Configures the MCP server for your specific tool |
| **Tucks you in** | Adds `.gitignore` so the memory database stays local |

All without assumptions about your operating system. macOS, Linux, or Windows — the script adapts.

## Packages

Two small packages in `packages/` that make the memory layer work:

### `@agent-workspace/memory`

An MCP server for persistent memory. SQLite under the hood, zero network calls, zero native dependencies. Just a file on disk.

```bash
npx @agent-workspace/memory --db .agent/memory/knowledge.db
```

| Tool | What it does |
|------|-------------|
| `remember(fact, type?)` | Save something to remember later |
| `recall(query, limit?)` | Search past memories |
| `forget(id)` | Delete a memory |
| `update(id, fact?, type?)` | Update what was saved |
| `memory-stats()` | See how much memory your agent has |

### `@agent-workspace/create`

A CLI that does what init.sh does, but as a proper npm command.

```bash
npx @agent-workspace/create init
```

Supports `--name`, `--role`, `--domain`, `--global`, `--install`, `--framework`.

## Where this comes from

This isn't a design-from-scratch project. The `.agent/` structure and conventions grew out of [opencode-drewgent](https://github.com/humanerd-drew/opencode-drewgent) — a personal agent system that has been running daily for over six months. 17,942 knowledge entries. Six connected MCP servers. Thousands of corrections and iterations.

Every rule in `agent/` was shaped by real use: the moment you say "don't do that" for the third time, something needs to change. Those changes became the templates you see here. The preference learning loop, the Layer 0 governance, the decision framework — all of it was written in blood (figuratively) during late-night sessions where the agent kept doing the wrong thing.

This is not a toy template. It's a distillation of what actually works when you share your life with an AI coding agent.

## What it's not

This is a personal proposal, not a formal standard. It might not fit your workflow, your language, or your style. That's fine. Fork it, adapt it, throw away what doesn't work.

The goal isn't to have everyone use the same template. **The goal is to have a common place to put the thing that matters — your agent's identity — so it survives tool changes, OS upgrades, and bad decisions.**

## License

MIT. Use it, share it, improve it. PRs and issues are genuinely welcome.

---

*"Every time you switch tools, your agent should remember who it is — because you put that somewhere the tool can't touch."*
