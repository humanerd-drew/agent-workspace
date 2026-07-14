#!/usr/bin/env node

import { existsSync, mkdirSync, writeFileSync, readFileSync, cpSync } from "fs";
import { execSync } from "child_process";
import { homedir } from "os";
import { join, resolve } from "path";
import { fileURLToPath } from "url";
import {
  detectFramework,
  getMcpServerConfig,
  injectMcpConfig,
  getAgentsMdPath,
} from "./framework.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const TEMPLATES_DIR = join(__dirname, "..", "..", "..", "templates");

interface InitOptions {
  dir: string;
  name: string;
  role: string;
  domain: string;
  yes: boolean;
  framework: string;
  install: boolean;
  global: boolean;
}

function parseArgs(): InitOptions {
  const args = process.argv.slice(2);
  const opts: InitOptions = {
    dir: ".",
    name: "",
    role: "",
    domain: "",
    yes: false,
    framework: "auto",
    install: false,
    global: false,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--dir":
        opts.dir = args[++i] || ".";
        break;
      case "--name":
        opts.name = args[++i] || "";
        break;
      case "--role":
        opts.role = args[++i] || "";
        break;
      case "--domain":
        opts.domain = args[++i] || "";
        break;
      case "--yes":
      case "-y":
        opts.yes = true;
        break;
      case "--framework":
        opts.framework = args[++i] || "auto";
        break;
      case "--install":
        opts.install = true;
        break;
      case "--global":
        opts.global = true;
        break;
      case "--help":
      case "-h":
        printHelp();
        process.exit(0);
    }
  }

  return opts;
}

function printHelp(): void {
  console.log(`
  @agent-workspace/create — Initialize .agent/ workspace

  Usage:
    npx @agent-workspace/create init [options]

  Options:
    --dir <path>        Target directory (default: .)
    --name <name>       Agent name (default: prompted)
    --role <role>       Agent role (default: prompted)
    --domain <domain>   Primary domain (default: prompted)
    --yes, -y           Skip all prompts
    --framework <type>  Force framework: opencode, claude-code, cursor, generic (default: auto-detect)
    --install           Install @agent-workspace/memory locally and use direct node path (faster startup)
    --global            Use a global memory DB at ~/.agent/memory/ (shared across projects)
    --help, -h          Show this help
  `);
}

function resolveTemplatesDir(): string {
  const devDir = join(__dirname, "..", "..", "..", "templates", "agent");
  if (existsSync(devDir)) return devDir;

  const pkgDir = join(__dirname, "..", "templates", "agent");
  if (existsSync(pkgDir)) return pkgDir;

  const agentDir = join(TEMPLATES_DIR, "agent");
  if (existsSync(agentDir)) return agentDir;

  console.error("Error: templates not found");
  process.exit(1);
}

function renderTemplate(content: string, vars: Record<string, string>): string {
  let result = content;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replaceAll(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
  }
  return result;
}

function readAndRender(filePath: string, vars: Record<string, string>): string {
  const content = readFileSync(filePath, "utf-8");
  return renderTemplate(content, vars);
}

function createAgentDir(cwd: string): string {
  const agentDir = join(cwd, ".agent");
  mkdirSync(agentDir, { recursive: true });
  mkdirSync(join(agentDir, "workflow"), { recursive: true });
  mkdirSync(join(agentDir, "memory"), { recursive: true });
  return agentDir;
}

function writeAgentFiles(agentDir: string, vars: Record<string, string>): void {
  const tmplDir = resolveTemplatesDir();

  const files = [
    ["identity.md", "identity.md"],
    ["rules.md", "rules.md"],
    ["workflow/init.md", "workflow/init.md"],
    ["workflow/general.md", "workflow/general.md"],
  ];

  for (const [src, dest] of files) {
    const srcPath = join(tmplDir, src);
    const destPath = join(agentDir, dest);
    const rendered = readAndRender(srcPath, vars);
    writeFileSync(destPath, rendered);
    console.log(`  ✓ .agent/${dest}`);
  }
}

function generateAgentsMd(vars: Record<string, string>): string {
  const agentsMdPath = join(TEMPLATES_DIR, "agents.md");
  if (existsSync(agentsMdPath)) {
    return readAndRender(agentsMdPath, vars);
  }

  return `# ${vars.AGENT_NAME}

See .agent/ for identity, rules, and workflow.
`;
}

function writeOrUpdateAgentsMd(cwd: string, vars: Record<string, string>, framework: string): void {
  const existingPath = getAgentsMdPath(cwd);
  const content = generateAgentsMd(vars);

  if (existingPath) {
    const existing = readFileSync(existingPath, "utf-8");
    if (existing.includes(".agent/identity.md")) {
      console.log(`  ✓ ${existingPath} already references .agent/`);
      return;
    }
    const backupPath = existingPath + ".bak";
    writeFileSync(backupPath, existing);
    writeFileSync(existingPath, content + "\n\n" + existing);
    console.log(`  ✓ ${existingPath} updated (backup: ${backupPath})`);
  } else {
    writeFileSync(join(cwd, "AGENTS.md"), content);
    console.log("  ✓ AGENTS.md created");
  }
}

function printSummary(agentDir: string, framework: string, configInjected: boolean, installed: boolean, isGlobal: boolean): void {
  console.log(`
  ┌─────────────────────────────────────┐
  │  .agent/ workspace initialized!     │
  └─────────────────────────────────────┘

  Directory: ${agentDir}
  Framework: ${framework}

  Files created:
    .agent/identity.md     — Who you are
    .agent/rules.md        — Immutable rules
    .agent/workflow/       — Task workflows
    .agent/memory/         — Persistent memory

  ${isGlobal ? "  🌐 Global memory: ~/.agent/memory/knowledge.db" : "  📁 Project memory: .agent/memory/knowledge.db"}
  ${configInjected ? (installed ? "  ✓ MCP memory server installed + configured (direct node path)" : "  ✓ MCP memory server configured (via npx)") : "  ⚠  Manual MCP setup required — see README"}
  `);
}

async function prompt(label: string, defaultValue: string): Promise<string> {
  if (defaultValue) {
    const response = process.stdout.write(`${label} [${defaultValue}]: `);
    return new Promise((resolve) => {
      process.stdin.once("data", (data) => {
        const input = data.toString().trim();
        resolve(input || defaultValue);
      });
    });
  }

  return defaultValue;
}

async function main(): Promise<void> {
  const opts = parseArgs();
  const cwd = resolve(opts.dir);

  if (!existsSync(cwd)) {
    console.error(`Error: directory does not exist: ${cwd}`);
    process.exit(1);
  }

  const detection = opts.framework === "auto"
    ? detectFramework(cwd)
    : { framework: opts.framework as any, confidence: 1 };

  const name = opts.name || cwd.split("/").pop() || "agent";
  const role = opts.role || "software engineering agent";
  const domain = opts.domain || "software development";

  const vars: Record<string, string> = {
    AGENT_NAME: name,
    AGENT_ROLE: role,
    DOMAIN: domain,
    TONE: "Direct and precise",
  };

  console.log(`\n  Initializing .agent/ workspace for "${cwd}"`);
  console.log(`  Detected framework: ${detection.framework}\n`);

  const agentDir = createAgentDir(cwd);
  writeAgentFiles(agentDir, vars);

  if (opts.global) {
    const home = homedir();
    const globalDir = join(home, ".agent");
    mkdirSync(join(globalDir, "memory"), { recursive: true });
    console.log("  ✓ Global agent directory: ~/.agent/");
  }

  if (opts.install) {
    console.log("  Installing @agent-workspace/memory...");
    execSync("npm install --save-dev @agent-workspace/memory", {
      cwd,
      stdio: "inherit",
    });
  }

  const mcpConfig = getMcpServerConfig(cwd, opts.install, opts.global);
  const configInjected = injectMcpConfig(detection.framework, cwd, mcpConfig);

  writeOrUpdateAgentsMd(cwd, vars, detection.framework);

  const gitignorePath = join(cwd, ".gitignore");
  if (existsSync(gitignorePath)) {
    const gitignore = readFileSync(gitignorePath, "utf-8");
    if (!gitignore.includes(".agent/memory/knowledge.db")) {
      writeFileSync(gitignorePath, gitignore + "\n.agent/memory/knowledge.db\n");
    }
  }

  printSummary(agentDir, detection.framework, configInjected, opts.install, opts.global);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
