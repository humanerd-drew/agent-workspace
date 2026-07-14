import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { homedir } from "os";
import { join } from "path";

export type Framework = "opencode" | "claude-code" | "cursor" | "generic";

export interface DetectionResult {
  framework: Framework;
  confidence: number;
}

export function detectFramework(cwd: string): DetectionResult {
  if (existsSync(join(cwd, "opencode.jsonc")) || existsSync(join(cwd, ".opencode"))) {
    return { framework: "opencode", confidence: 0.9 };
  }
  if (existsSync(join(cwd, "CLAUDE.md")) || existsSync(join(cwd, ".claude"))) {
    return { framework: "claude-code", confidence: 0.9 };
  }
  if (existsSync(join(cwd, ".cursorrules")) || existsSync(join(cwd, ".cursor"))) {
    return { framework: "cursor", confidence: 0.8 };
  }
  return { framework: "generic", confidence: 0.5 };
}

export interface McpServerConfig {
  command: string;
  args: string[];
}

export function getMcpServerConfig(cwd: string, install: boolean, global: boolean): McpServerConfig {
  const dbPath = global
    ? join(homedir(), ".agent", "memory", "knowledge.db")
    : ".agent/memory/knowledge.db";

  if (install) {
    return {
      command: "node",
      args: [
        "node_modules/@agent-workspace/memory/dist/index.js",
        "--db", dbPath,
      ],
    };
  }
  return {
    command: "npx",
    args: ["--yes", "@agent-workspace/memory", "--db", dbPath],
  };
}

export function injectMcpConfig(framework: Framework, cwd: string, config: McpServerConfig): boolean {
  switch (framework) {
    case "opencode":
      return injectOpencodeConfig(cwd, config);
    case "claude-code":
      return injectClaudeCodeConfig(cwd, config);
    case "cursor":
      return injectCursorConfig(cwd, config);
    case "generic":
      return false;
  }
}

function stripJsonc(text: string): string {
  let result = "";
  let i = 0;
  let inString = false;
  let stringChar = "";
  while (i < text.length) {
    const ch = text[i];
    const next = text[i + 1];

    if (inString) {
      if (ch === "\\") {
        result += ch + (next || "");
        i += 2;
        continue;
      }
      if (ch === stringChar) {
        inString = false;
      }
      result += ch;
      i++;
      continue;
    }

    if (ch === '"' || ch === "'") {
      inString = true;
      stringChar = ch;
      result += ch;
      i++;
      continue;
    }

    if (ch === "/" && next === "/") {
      i += 2;
      while (i < text.length && text[i] !== "\n") i++;
      continue;
    }
    if (ch === "/" && next === "*") {
      i += 2;
      while (i < text.length && !(text[i] === "*" && text[i + 1] === "/")) i++;
      i += 2;
      continue;
    }
    result += ch;
    i++;
  }
  return result;
}

function parseJsonc<T>(text: string): T {
  return JSON.parse(stripJsonc(text));
}

function toOpencodeFormat(config: McpServerConfig) {
  return {
    type: "local",
    command: [config.command, ...config.args],
  };
}

function injectMcpEntry(
  configPath: string,
  serverName: string,
  entry: unknown,
): boolean {
  if (!existsSync(configPath)) return false;

  const raw = readFileSync(configPath, "utf-8").trim();
  if (!raw) return false;

  const parsed = parseJsonc<Record<string, unknown>>(raw);
  if (!parsed.mcp) parsed.mcp = {};
  const mcp = parsed.mcp as Record<string, unknown>;
  if (mcp[serverName]) return true;

  mcp[serverName] = entry;

  writeFileSync(configPath, JSON.stringify(parsed, null, 2) + "\n");
  return true;
}

function injectOpencodeConfig(cwd: string, config: McpServerConfig): boolean {
  return injectMcpEntry(
    join(cwd, "opencode.jsonc"),
    "agent-memory",
    toOpencodeFormat(config),
  );
}

function injectClaudeCodeConfig(cwd: string, config: McpServerConfig): boolean {
  const configPath = join(cwd, ".claude", "settings.local.json");

  if (existsSync(configPath)) {
    const raw = readFileSync(configPath, "utf-8").trim();
    if (raw) {
      const parsed = parseJsonc<{ mcpServers?: Record<string, unknown> }>(raw);
      if (!parsed.mcpServers) parsed.mcpServers = {};
      if (parsed.mcpServers["agent-memory"]) return true;
      parsed.mcpServers["agent-memory"] = {
        command: config.command,
        args: config.args,
      };
      writeFileSync(configPath, JSON.stringify(parsed, null, 2) + "\n");
      return true;
    }
  }

  mkdirSync(join(cwd, ".claude"), { recursive: true });
  const content = JSON.stringify(
    {
      mcpServers: {
        "agent-memory": {
          command: config.command,
          args: config.args,
        },
      },
    },
    null,
    2,
  ) + "\n";
  writeFileSync(configPath, content);
  return true;
}

function injectCursorConfig(cwd: string, config: McpServerConfig): boolean {
  const configPath = join(cwd, ".cursor", "mcp.json");

  if (existsSync(configPath)) {
    const raw = readFileSync(configPath, "utf-8").trim();
    if (raw) {
      const parsed = parseJsonc<{ mcpServers?: Record<string, unknown> }>(raw);
      if (!parsed.mcpServers) parsed.mcpServers = {};
      if (parsed.mcpServers["agent-memory"]) return true;
      parsed.mcpServers["agent-memory"] = {
        command: config.command,
        args: config.args,
      };
      writeFileSync(configPath, JSON.stringify(parsed, null, 2) + "\n");
      return true;
    }
  }

  mkdirSync(join(cwd, ".cursor"), { recursive: true });
  const content = JSON.stringify(
    {
      mcpServers: {
        "agent-memory": {
          command: config.command,
          args: config.args,
        },
      },
    },
    null,
    2,
  ) + "\n";
  writeFileSync(configPath, content);
  return true;
}

export function getAgentsMdPath(cwd: string): string | null {
  const candidates = ["AGENTS.md", "CLAUDE.md", ".cursorrules", ".windsurfrules"];
  for (const c of candidates) {
    if (existsSync(join(cwd, c))) return join(cwd, c);
  }
  return null;
}
