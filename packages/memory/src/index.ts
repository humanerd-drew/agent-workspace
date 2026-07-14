#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { KnowledgeDB } from "./storage/sqlite.js";

function resolveDbPath(): string {
  const cliFlag = process.argv.findIndex((a) => a === "--db");
  if (cliFlag !== -1 && process.argv[cliFlag + 1]) {
    return process.argv[cliFlag + 1];
  }
  const envVar = process.env.AGENT_MEMORY_DB;
  if (envVar) return envVar;
  return ".agent/memory/knowledge.db";
}

const dbPath = resolveDbPath();
const db = new KnowledgeDB(dbPath);

const server = new Server(
  { name: "agent-memory", version: "0.1.0" },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "remember",
      description:
        "Store a fact, decision, pattern, or incident into persistent memory for cross-session recall",
      inputSchema: {
        type: "object",
        properties: {
          fact: {
            type: "string",
            description:
              "The content to remember — should be a complete, self-contained statement",
          },
          type: {
            type: "string",
            enum: ["fact", "decision", "pattern", "incident"],
            description: "Category of memory entry",
            default: "fact",
          },
        },
        required: ["fact"],
      },
    },
    {
      name: "recall",
      description:
        "Search persistent memory across all past sessions using full-text search. Returns most relevant entries first.",
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description:
              "Search query. Empty string returns most recent entries.",
          },
          limit: {
            type: "number",
            description: "Maximum results to return (default: 10, max: 50)",
            default: 10,
          },
        },
      },
    },
    {
      name: "forget",
      description:
        "Delete a memory entry by its ID. Returns whether the deletion was successful.",
      inputSchema: {
        type: "object",
        properties: {
          id: {
            type: "number",
            description: "The ID of the memory entry to delete",
          },
        },
        required: ["id"],
      },
    },
    {
      name: "update",
      description:
        "Update a memory entry's fact and/or type by ID. Returns the updated entry.",
      inputSchema: {
        type: "object",
        properties: {
          id: {
            type: "number",
            description: "The ID of the memory entry to update",
          },
          fact: {
            type: "string",
            description: "New content (omit to keep existing)",
          },
          type: {
            type: "string",
            enum: ["fact", "decision", "pattern", "incident"],
            description: "New type (omit to keep existing)",
          },
        },
        required: ["id"],
      },
    },
    {
      name: "memory-stats",
      description:
        "Show memory database statistics: total entries, breakdown by type, database size",
      inputSchema: {
        type: "object",
        properties: {},
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "remember": {
      const fact = String(args?.fact ?? "");
      const type = String(args?.type ?? "fact");
      if (!fact) throw new Error("fact is required");
      const entry = await db.remember(fact, type);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(entry, null, 2),
          },
        ],
      };
    }

    case "recall": {
      const query = String(args?.query ?? "");
      const limit = Math.min(Number(args?.limit ?? 10), 50);
      const results = await db.recall(query, limit);
      return {
        content: [
          {
            type: "text",
            text:
              results.length === 0
                ? "No results found."
                : JSON.stringify(results, null, 2),
          },
        ],
      };
    }

    case "forget": {
      const id = Number(args?.id);
      if (!id) throw new Error("id is required");
      const deleted = await db.forget(id);
      return {
        content: [
          {
            type: "text",
            text: deleted
              ? JSON.stringify({ success: true, id })
              : JSON.stringify({ success: false, id, reason: "not found" }),
          },
        ],
      };
    }

    case "update": {
      const id = Number(args?.id);
      if (!id) throw new Error("id is required");
      const fact = String(args?.fact ?? "");
      const type = String(args?.type ?? "");
      const entry = await db.update(id, fact, type);
      if (!entry) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ success: false, id, reason: "not found" }),
            },
          ],
        };
      }
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(entry, null, 2),
          },
        ],
      };
    }

    case "memory-stats": {
      const stats = await db.stats();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(stats, null, 2),
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

async function main() {
  await db.init();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("agent-memory fatal:", err);
  process.exit(1);
});
