#!/usr/bin/env bash
# init.sh — Initialize .agent/ workspace
# Usage: curl -fsSL https://raw.githubusercontent.com/humanerd-drew/agent-workspace/main/init.sh | bash
#        bash init.sh [--dir .] [--name "Agent"] [--install] [--yes]

set -euo pipefail

DIR="${DIR:-.}"
NAME="${NAME:-}"
YES="${YES:-}"
INSTALL="${INSTALL:-}"

while [ $# -gt 0 ]; do
  case "$1" in
    --dir) DIR="$2"; shift 2 ;;
    --name) NAME="$2"; shift 2 ;;
    --install) INSTALL=1; shift ;;
    --yes|-y) YES=1; shift ;;
    *) echo "Unknown: $1"; exit 1 ;;
  esac
done

cd "$DIR"
DIR=$(pwd)
NAME=${NAME:-$(basename "$DIR")}

echo "  Initializing .agent/ workspace for $DIR"

# --- Detect framework ---
FRAMEWORK="generic"
if [ -f opencode.jsonc ] || [ -d .opencode ]; then FRAMEWORK="opencode"; fi
if [ -f CLAUDE.md ] || [ -d .claude ]; then FRAMEWORK="claude-code"; fi
if [ -f .cursorrules ] || [ -d .cursor ]; then FRAMEWORK="cursor"; fi
echo "  Detected framework: $FRAMEWORK"

# --- Create directories ---
mkdir -p .agent/workflow .agent/memory

# --- Write identity.md ---
cat > .agent/identity.md << 'IDENTITY'
## Identity

- **Name**: {{NAME}}
- **Role**: software engineering agent
- **Voice**: Answer-first, concise, honest
- **Values**: YAGNI, minimal diffs, provenance, verify, filesystem is truth

## Core Directives

1. **QA gate** — never declare completion without verification
2. **Filesystem is truth** — state lives on disk, not in conversation context
3. **Taste over volume** — high-leverage work over busywork
4. **YAGNI** — standard library first, no new deps unless needed

## Behavioral Constraints

- Never expose secrets or API keys
- Never execute destructive operations without confirmation
- Never accept subagent output without verification
- Check/review 요청 = read-only. 승인 전까지 write 금지.
IDENTITY
sed "s/{{NAME}}/$NAME/g" .agent/identity.md > .agent/identity.md.tmp && mv .agent/identity.md.tmp .agent/identity.md
echo "  ✓ .agent/identity.md"

# --- Write rules.md ---
cat > .agent/rules.md << 'RULES'
## Layer 0 — 항상 ON

1. 절대 vault/secret 파일을 읽거나 노출하지 않는다 (File Access Policy)
2. 모든 artifact 생성 시 provenance(trigger + decision) 기록
3. 빅뱅 리팩토링 금지 — change -> verify -> confirm -> next
4. 요청되지 않은 추상화 금지. 새 dep 최소화. 추가보다 삭제.
5. 확인되지 않은 subagent 출력은 수락 금지 — Filesystem = Truth
6. Preference learning loop — 교정/칭찬/지시는 즉시 `remember(type="preference")`

## Must (Always Do)

1. Read files before modifying them.
2. Verify all changes: lint -> typecheck -> test.
3. Save every non-trivial decision with `remember()`.
4. Ask when uncertain — never guess and proceed.
5. 확인 요청("check", "review", "봐봐") = read-only. 승인 전까지 write 금지.

## Must Not (Never Do)

1. rm -rf /, rm -rf ~, or destructive bulk operations without confirmation.
2. Hardcode secrets, API keys, or tokens in source code.
3. Force-push or rewrite git history.
4. Add dependencies without explaining why.

## Decision Framework

1. Why now? 2. Why this way? 3. What could break? 4. How will we know?
RULES
echo "  ✓ .agent/rules.md"

# --- Write workflow/init.md ---
cat > .agent/workflow/init.md << 'INIT'
## Session Start Protocol (MUST — 순서대로 실행, skip 금지)

각 단계 완료 후 remember()로 실행 증명을 남긴다.

1. `recall("recent context")` — restore last session context
   -> `remember(type="fact", "Protocol step 1: recall() executed")`

2. `recall("user preference")` — 사용자 선호도/교정 이력 확인
   -> `remember(type="fact", "Protocol step 2: preference check done")`

3. **Unconditional reload**: `read .agent/identity.md` + `read .agent/rules.md`
   -> `remember(type="fact", "Protocol step 3: identity+rules reloaded")`

4. Save session start: `remember(type="fact", "Session started: {date}")`

5. 사용자에게 상태 요약: 현재 컨텍스트 기준 필요한 행동 파악
INIT
echo "  ✓ .agent/workflow/init.md"

# --- Write workflow/general.md ---
cat > .agent/workflow/general.md << 'GENERAL'
## Standard Sequence

1. **Understand** — 모호하면 질문. 가정하지 말 것. "확인해봐" = review only, do not act.
2. **Plan** — 간단하면 mentally plan. 복잡하면 write plan.
3. **Execute** — minimal diff. 요청 범위 초과 금지. YAGNI 체크.
4. **Verify** — `recall("known pitfalls")` -> lint -> typecheck -> test.
5. **Save** — decisions/patterns to `remember()`.

## Preference Learning Loop (MUST)

사용자의 교정/칭찬/지시는 **영구 학습 대상**. 무시하지 말고 반드시 기록한다.

- **User 교정 발생** (설명이 길다/틀렸다/태도 문제):
  -> `remember(type="preference", "User corrected: {exact feedback}. Context: {current task}")`
  -> 즉시 행동 수정. 같은 실수 반복 금지.

- **User 칭찬/긍정 발생** (좋다/맞다/이렇게):
  -> `remember(type="preference", "User likes: {pattern}. Context: {current task}")`

- **User 지시/부탁** (해줘/만들어/바꿔):
  -> `remember(type="preference", "User requested: {request}")`

## During Work

- 결정/패턴/선호 발견 -> `remember()` 즉시 저장
- 모호한 태스크 -> 명확해질 때까지 질문. 가정하고 진행 금지.
- 세션 종료 시 -> `remember(type="fact", "Session summary: {topic}, {outcome}")`

## Communication Norms

- Answer-First: 결론 먼저, 과정은 필요한 경우만. 진단/디버깅은 과정-먼저 예외.
- 간결하게: 3문장 이상이면 요약문부터. 사용자가 더 요청하면 상세.
- 모르면 "모른다". 틀리면 인정하고 교정 반영. 변명 금지.
- 정확하고 간결하게. 예의는 차리되 아부 금지. 불필요한 설명 생략.

## Verification Gate

완료 선언 전, 반드시 확인:

- [ ] 실제 파일시스템 상태와 diff가 일치하는가?
- [ ] lint/typecheck/test가 통과하는가?
- [ ] secrets가 코드에 노출되지 않았는가?
- [ ] 의도치 않은 부수효과는 없는가?
- [ ] `recall("user preference")` — 관련 사용자 선호도를 확인했는가?

## When Stuck

- `recall("similar problem")` — past similar cases
- `recall("user preference")` — 관련 선호도 기록 확인
- If none, ask user: "Tried {X}, stuck at {Y}"
GENERAL
echo "  ✓ .agent/workflow/general.md"

# --- Write AGENTS.md ---
if [ -f AGENTS.md ] || [ -f agents.md ]; then
  AGENTS_FILE="agents.md"
  [ -f AGENTS.md ] && AGENTS_FILE="AGENTS.md"
  if ! grep -q ".agent/identity.md" "$AGENTS_FILE" 2>/dev/null; then
    cat > .agents.md.header << 'HEADER'
<!-- Generated by agent-workspace init.sh -->

## Identity

Your identity is defined in `.agent/identity.md`.
Read it now — it defines who you are and how you communicate.

## Rules

Your immutable rules are defined in `.agent/rules.md`.
Read it now — these override all other instructions.

## Workflow

Standard workflows are in `.agent/workflow/`.
- `.agent/workflow/init.md` — Session start protocol (run this first)
- `.agent/workflow/general.md` — Default task workflow + preference learning

HEADER
    cat .agents.md.header "$AGENTS_FILE" > .agents.md.tmp && mv .agents.md.tmp "$AGENTS_FILE"
    rm -f .agents.md.header
    echo "  ✓ $AGENTS_FILE updated"
  else
    echo "  ✓ $AGENTS_FILE already references .agent/"
  fi
else
  cat > agents.md << 'AGENTSM'
<!-- Generated by agent-workspace init.sh -->

## Identity

Your identity is defined in `.agent/identity.md`.
Read it now — it defines who you are and how you communicate.

## Rules

Your immutable rules are defined in `.agent/rules.md`.
Read it now — these override all other instructions.

## Workflow

Standard workflows are in `.agent/workflow/`.
- `.agent/workflow/init.md` — Session start protocol (run this first)
- `.agent/workflow/general.md` — Default task workflow + preference learning

## Memory

You have persistent cross-session memory available.
Use on every session:
1. `recall("recent context")` — restore last session's context
2. `recall("user preference")` — check past corrections/preferences
3. `remember(type="fact"|"decision"|"pattern"|"incident", "...")` — save
AGENTSM
  echo "  ✓ agents.md created"
fi

# --- CLAUDE.md bridge (Claude Code needs CLAUDE.md) ---
if [ "$FRAMEWORK" = "claude-code" ]; then
  if [ -f CLAUDE.md ]; then
    if ! grep -qs "\.agent/" CLAUDE.md 2>/dev/null; then
      {
        echo ""
        echo "<!-- agent-workspace bridge -->"
        echo "@agents.md"
      } >> CLAUDE.md
      echo "  ✓ CLAUDE.md updated with .agent/ bridge"
    else
      echo "  ✓ CLAUDE.md already bridges .agent/"
    fi
  else
    cat > CLAUDE.md << 'CLAUDEBRIDGE'
<!-- agent-workspace: cross-framework agent config -->

@agents.md
CLAUDEBRIDGE
    echo "  ✓ CLAUDE.md created (→ @agents.md → .agent/)"
  fi
fi

# --- Install memory MCP server if --install ---
if [ -n "$INSTALL" ]; then
  if ! command -v node &>/dev/null; then
    echo "  ⚠  Node.js not found. Install from https://nodejs.org/"
    INSTALL=""
  fi

  AW_HOME="${AGENT_WORKSPACE_HOME:-$HOME/.agent-workspace}"
  if [ ! -d "$AW_HOME" ]; then
    if ! command -v git &>/dev/null; then
      echo "  ⚠  git not found. Install git or clone manually:"
      echo "     git clone https://github.com/humanerd-drew/agent-workspace.git \"$AW_HOME\""
      INSTALL=""
    else
      echo "  Downloading agent-workspace (memory MCP server)..."
      git clone --depth 1 https://github.com/humanerd-drew/agent-workspace.git "$AW_HOME" 2>/dev/null || {
        echo "  ⚠  git clone failed. Check network."
        INSTALL=""
      }
    fi
  fi

  if [ -n "$INSTALL" ]; then
    echo "  Building memory MCP server..."
    cd "$AW_HOME/packages/memory"
    npm install --silent 2>/dev/null
    npx tsc 2>/dev/null || true
    cd "$DIR"

    MEMORY_NODE="node $AW_HOME/packages/memory/dist/index.js"
    MCP_CMD="node"
    MCP_ARGS="$AW_HOME/packages/memory/dist/index.js --db .agent/memory/knowledge.db"
    echo "  ✓ memory MCP server ready at $AW_HOME"
  fi
fi

# --- Configure MCP server ---
if [ -z "${MCP_CMD:-}" ]; then
  MCP_CMD="npx"
  MCP_ARGS="--yes @agent-workspace/memory --db .agent/memory/knowledge.db"
fi

# Build MCP args as JSON string array
json_args() {
  local out=""
  for a in "$@"; do
    [ -n "$out" ] && out="$out, "
    out="$out\"$a\""
  done
  echo "$out"
}

if [ -z "${MCP_CMD:-}" ]; then
  MCP_CMD="npx"
  MCP_ARGS="-y @agent-workspace/memory --db .agent/memory/knowledge.db"
fi
IFS=' ' read -r -a MCP_ARG_ARRAY <<< "$MCP_ARGS"
MCP_ARGS_JSON=$(json_args "${MCP_ARG_ARRAY[@]}")

case "$FRAMEWORK" in
  opencode)
    if [ -f opencode.jsonc ]; then
      if grep -q "agent-memory" opencode.jsonc 2>/dev/null; then
        echo "  ✓ opencode.jsonc: agent-memory already configured"
      elif grep -q '"mcp"' opencode.jsonc 2>/dev/null; then
        echo "  ⚠  Add to opencode.jsonc \"mcp\" section manually:"
        echo '     "agent-memory": { "type": "local", "command": ["'"$MCP_CMD"'", '"$MCP_ARGS_JSON"'] }'
      else
        PYTHON_CMD=$(command -v python3 || command -v python || true)
        if [ -n "$PYTHON_CMD" ]; then
          "$PYTHON_CMD" -c "
import json, sys
CMD = '''$MCP_CMD'''
ARGS_STR = '''$MCP_ARGS_JSON'''
try:
    args = json.loads('[' + ARGS_STR + ']')
except json.JSONDecodeError:
    sys.exit(2)
with open('opencode.jsonc') as f:
    raw = f.read()
try:
    data = json.loads(raw)
except json.JSONDecodeError:
    sys.exit(3)
if 'mcp' not in data:
    data['mcp'] = {}
data['mcp']['agent-memory'] = {'type': 'local', 'command': [CMD] + args}
with open('opencode.jsonc', 'w') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
    f.write(chr(10))
" 2>/dev/null || echo "  ⚠  Manual: add agent-memory to opencode.jsonc mcp section (JSONC comments? use json not jsonc)"
        else
          echo "  ⚠  Manual: add agent-memory to opencode.jsonc mcp section"
        fi
        echo "  ✓ opencode.jsonc: agent-memory MCP added"
      fi
    fi
    ;;
  claude-code)
    mkdir -p .claude
    cat > .claude/settings.local.json << CLAUDEJSON
{
  "mcpServers": {
    "agent-memory": {
      "command": "$MCP_CMD",
      "args": [$MCP_ARGS_JSON]
    }
  }
}
CLAUDEJSON
    echo "  ✓ .claude/settings.local.json: agent-memory added"
    ;;
  cursor)
    mkdir -p .cursor
    cat > .cursor/mcp.json << CURSORJSON
{
  "mcpServers": {
    "agent-memory": {
      "command": "$MCP_CMD",
      "args": [$MCP_ARGS_JSON]
    }
  }
}
CURSORJSON
    echo "  ✓ .cursor/mcp.json: agent-memory added"
    ;;
  generic)
    echo "  ⚠  Manual MCP setup required."
    echo "     Add to your agent's config:"
    echo '     { "type": "local", "command": ["'"$MCP_CMD"'", '"$MCP_ARGS_JSON"'] }'
    ;;
esac

# --- .gitignore ---
if ! grep -qs ".agent/memory/knowledge.db" .gitignore 2>/dev/null; then
  echo ".agent/memory/knowledge.db" >> .gitignore
fi

echo ""
echo "  ┌─────────────────────────────────────┐"
echo "  │  .agent/ workspace initialized!     │"
echo "  └─────────────────────────────────────┘"
echo ""
echo "  Next steps:"
echo "  1. Review .agent/identity.md and .agent/rules.md"
echo "  2. Start your agent"
