# .agent/ workspace standard

> AI 에이전트를 위한 휴대용 워크스페이스 — `.agent/` 디렉토리 표준
> Portable agent workspace — the `.agent/` directory standard

---

AI 에이전트를 쓰다 보면 이런 순간이 옵니다. opencode에서 Claude Code로 갈아탔는데, 내 에이전트가 나를 기억하지 못합니다. 세션마다 다시 설명해야 하고, 쌓아둔 규칙은 리셋되고, MCP 설정은 또 다른 JSON을 편집해야 합니다. "AGENTS.md 하나면 된다"고 했는데, 알고 보니 그건 시작일 뿐이었어요.

이 레포는 그 문제에 대한 HUMANERD의 답입니다.

---

## 한국어

### `.agent/` — 하나의 폴더로 통일하자

AGENTS.md는 AAIF 덕분에 파일 포맷을 표준화했습니다. 60,000개 이상의 프로젝트가 쓰고 있고, 모든 주요 도구가 지원합니다. 대단한 성과였어요.

하지만 에이전트가 실제로 필요로 하는 것은 명령어뿐만이 아닙니다. 정체성, 불변 규칙, 작업 워크플로, 세션 간 유지되는 메모리, MCP 서버 설정 — 이것들은 AGENTS.md 하나로 해결되지 않았고, 지금도 각 도구가 제각각 관리하고 있습니다.

`.agent/`는 이 간극을 메우는 최소한의 표준 제안입니다.

```
.agent/
├── identity.md       # 역할, 말투, 가치관 — 에이전트의 성격
├── rules.md          # 불변 규칙 (must / must not)
├── workflow/
│   ├── init.md       # 세션 시작 프로토콜
│   └── general.md    # 기본 작업 워크플로
└── memory/           # SQLite FTS5 영구 메모리 (자동 생성)

AGENTS.md             # AAIF 표준 브리지
```

**도구를 바꿔도 `.agent/`는 그대로입니다.** 이 폴더를 git에 올리면 팀 전체가 같은 에이전트 설정을 공유할 수 있고, opencode에서 Claude Code로, 다시 Cursor로 갈아타도 내 에이전트는 나를 기억합니다.

### 어떻게 쓰나

```bash
curl -fsSL https://raw.githubusercontent.com/humanerd-drew/agent-workspace/main/init.sh | bash
```

한 줄이면 끝납니다. 프레임워크를 자동 감지해서 `.agent/`를 만들고 MCP 설정까지 주입합니다.

```bash
curl -fsSL https://raw.githubusercontent.com/humanerd-drew/agent-workspace/main/init.sh | bash -s -- --install
```

`--install`을 붙이면 memory MCP 서버도 자동으로 다운로드해서 설정합니다. SQLite FTS5 기반으로 `remember()` / `recall()` / `forget()` / `update()` / `memory-stats()`를 쓸 수 있습니다.

### 구조

| 파트 | 위치 | 설명 |
|------|------|------|
| 표준 템플릿 | `agent/` | `.agent/` 디렉토리 참고 구현 |
| 설치 스크립트 | `init.sh` | curl \| bash 한 줄 설치 |
| Memory MCP | `packages/memory` | 영구 메모리 MCP 서버 (`node packages/memory/dist/index.js`) |
| CLI | `packages/create` | init 명령어 (`node packages/create/dist/index.js`) |

표준 자체는 `.agent/` 디렉토리 하나로 완성됩니다. MCP 서버와 CLI는 옵션입니다. SQLite를 직접 읽어도 되고, 다른 메모리 백엔드를 써도 됩니다.

### Drewgent — 첫 번째 reference implementation

이 표준은 제 개인 에이전트 시스템인 [opencode-drewgent](https://github.com/humanerd-drew/opencode-drewgent)에서 6개월간 검증되었습니다. 17,942개의 지식 항목, 6개의 MCP 서버가 실제로 운영 중이고, `.agent/` 구조는 이 과정에서 자연스럽게 추출된 결과물입니다.

실제로 되는지 궁금하시다면 — 됩니다. ㅎ

---

## English

### The problem

`AGENTS.md` standardized the file format — that was a huge step. But an agent needs more than instructions: identity, rules, workflow, persistent memory, and MCP configuration. These are still managed differently by each tool.

The `.agent/` directory fills this gap.

### Quick start

```bash
curl -fsSL https://raw.githubusercontent.com/humanerd-drew/agent-workspace/main/init.sh | bash
```

Auto-detects your framework (opencode, Claude Code, Cursor), creates `.agent/`, and configures MCP memory server.

```bash
curl -fsSL https://raw.githubusercontent.com/humanerd-drew/agent-workspace/main/init.sh | bash -s -- --install
```

With `--install`, it downloads and builds the memory MCP server locally.

### Structure

```
.agent/
├── identity.md       # Role, voice, values
├── rules.md          # Immutable rules
├── workflow/
│   ├── init.md       # Session start protocol
│   └── general.md    # Task workflow
└── memory/           # SQLite FTS5 (auto-created)

AGENTS.md             # AAIF bridge
```

### Principles

- **Portable**: Switch tools, keep your agent's identity and memory
- **Minimal**: Just a directory — no package manager required
- **Optional runtime**: The MCP server is useful but not required. SQLite is just SQLite.

### Reference

The first implementation is my personal agent system, [opencode-drewgent](https://github.com/humanerd-drew/opencode-drewgent), running 17,942 knowledge entries across 6 MCP servers. The `.agent/` structure was extracted from 6 months of real usage.

---

## License

MIT. Fork it, use it, share it. PRs and issues welcome — but this is a personal proposal more than a formal standard. Take what works, leave what doesn't.

표준은 혼자 만드는 게 아니니까, 의견이 있으시면 편하게 얘기해주세요.
