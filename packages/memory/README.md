# @agent-workspace/memory

MCP server for persistent cross-session agent memory. Works with **opencode**, **Claude Code**, **Cursor**, and any MCP-compatible agent.

## Install

```bash
npx @agent-workspace/memory --db .agent/memory/knowledge.db
```

Or add to `opencode.jsonc`:

```json
{
  "mcp": {
    "agent-memory": {
      "type": "local",
      "command": ["npx", "--yes", "@agent-workspace/memory", "--db", ".agent/memory/knowledge.db"]
    }
  }
}
```

## Tools

| Tool | Description |
|------|-------------|
| `remember(fact, type?)` | Save a memory entry. Type: `fact`, `decision`, `pattern`, `incident` |
| `recall(query, limit?)` | Full-text search across all memories |
| `forget(id)` | Delete a memory by ID |
| `update(id, fact?, type?)` | Update a memory's content and/or type |
| `memory-stats()` | Show entry count, type breakdown, DB size |

## Storage

- SQLite with FTS5 full-text search (WASM, no native deps)
- Zero external API calls — embeddings optional, not required
- Database auto-created at the `--db` path
