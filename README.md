# `.agent/` workspace

AI 에이전트를 쓰다 보면 이런 순간이 옵니다.

opencode로 6개월 동안 설정을 잘 쌓아왔는데, 어느 날 Claude Code를 써보고 싶어졌어요. 근데 갈아타는 순간, 내 에이전트는 저를 기억하지 못했습니다. 세션마다 identity부터 다시 설명해야 했고, MCP 설정은 또 다른 JSON 파일을 찾아서 다시 작성해야 했습니다.

"AGENTS.md 하나면 모든 도구에서 동작한다"고 했지만, AGENTS.md가 표준화한 건 명령어뿐이었어요. 정체성, 규칙, 워크플로, 메모리는 여전히 각 도구가 제각각이었습니다.

`.agent/`는 이 문제에 대한 HUMANERD의 제안입니다.

---

## 왜

AGENTS.md 확산은 정말 의미 있는 진전이었습니다. AAIF 덕분에 60,000개 이상의 프로젝트가 같은 진입점을 쓰게 되었고, opencode, Claude Code, Cursor, Codex 모두가 이 포맷을 지원합니다. 파일 하나로 이만큼 통일한 건 대단한 일이에요.

하지만 에이전트가 실제로 필요로 하는 것은 명령어만이 아닙니다.

대부분의 에이전트 설정은 AGENTS.md 바깥에 흩어져 있습니다. opencode를 위한 MCP 설정은 `opencode.jsonc`에, Claude Code를 위한 설정은 `.claude/settings.local.json`에, Cursor를 위한 설정은 `.cursor/mcp.json`에 저장됩니다. 메모리 데이터베이스는 또 다른 위치에 있고, 세션이 바뀌면 초기화됩니다.

프레임워크를 바꾸는 순간, 에이전트는 백지 상태가 됩니다.

이 글을 읽고 계신 분이 converter 프로젝트를 찾아보신 적이 있다면, 제 말이 무슨 뜻인지 아실 거예요. sno-ai/mda, bodyboard, microsoft/skills — 이 문제를 해결하려는 시도가 적어도 세 개는 독립적으로 생겨났습니다. converter가 생긴다는 건, 무언가가 표준화되지 않았다는 증거입니다.

저는 converter 접근보다 더 근본적인 해결책을 택했습니다. 변환하는 대신, 같은 구조를 보게 하자는 겁니다.

---

## 무엇을

```
.agent/                  # 루트 하나면 끝
├── identity.md          # 역할, 말투, 가치관 — 에이전트의 성격
├── rules.md             # 불변 규칙 (must / must not)
├── workflow/
│   ├── init.md          # 세션 시작 프로토콜
│   └── general.md       # 기본 작업 워크플로
└── memory/              # SQLite FTS5 영구 메모리

AGENTS.md                # AAIF 표준 브리지 (뭐가 있는지 참조)
```

핵심은 간단합니다. **AGENTS.md는 더 이상 모든 내용을 담는 파일이 아닙니다.** 표준 진입점 역할만 하고, 실제 설정은 `.agent/`로 위임합니다.

어떤 프레임워크를 쓰든 `.agent/` 한 곳만 관리하면 됩니다. opencode가 `.agent/identity.md`를 읽는 방식과 Claude Code가 읽는 방식이 다를 뿐, 파일 자체는 동일합니다. 프레임워크를 바꿔도 `.agent/`를 다시 작성할 필요가 없습니다.

---

## 어떻게

```bash
curl -fsSL https://raw.githubusercontent.com/humanerd-drew/agent-workspace/main/init.sh | bash
```

이 한 줄이 현재 프로젝트에서 쓰는 프레임워크를 자동으로 감지해서, `.agent/` 디렉토리를 만들고 MCP 설정까지 주입합니다.

### 수동으로도 가능합니다

템플릿 레포를 포크하거나 agent/ 디렉토리를 복사해서 `.agent/`로 이름만 바꾸면 됩니다. AGENTS.md에 한 줄만 추가하면 끝:

```markdown
Read .agent/identity.md, .agent/rules.md at session start.
```

### 메모리(MCP 서버)

메모리 기능이 필요하다면:

```bash
curl -fsSL https://raw.githubusercontent.com/humanerd-drew/agent-workspace/main/init.sh | bash -s -- --install
```

`--install`을 붙이면 MCP 서버를 로컬에 다운로드해서 설정합니다. 제공하는 기능은 이렇습니다:

| 도구 | 설명 |
|------|------|
| `agent-memory_remember(fact, type?)` | 저장 |
| `agent-memory_recall(query, limit?)` | FTS5 검색 |
| `agent-memory_forget(id)` | 삭제 |
| `agent-memory_update(id, fact?, type?)` | 수정 |
| `agent-memory_memory-stats()` | 통계 |

SQLite FTS5 기반이라 외부 API가 필요 없습니다. 데이터는 `.agent/memory/knowledge.db`에 저장됩니다.

---

## 구조

```
agent-workspace/
├── agent/                    # .agent/ 참고 구현 (복사해서 시작)
│   ├── identity.md
│   ├── rules.md
│   └── workflow/
│       ├── init.md
│       └── general.md
├── init.sh                   # curl | bash 설치 스크립트
├── packages/
│   ├── memory/               # MCP 서버 (node packages/memory/dist/index.js)
│   │   └── src/
│   │       ├── index.ts
│   │       └── storage/sqlite.ts
│   └── create/               # CLI init 명령어
│       └── src/
│           ├── index.ts
│           └── framework.ts
├── AGENTS.md                 # AAIF 표준 브리지
└── README.md
```

MCP 서버와 CLI는 전부 TypeScript로 작성되어 있고 `packages/` 아래에 있습니다. Node.js만 있으면 바로 실행됩니다.

---

## Reference: opencode-drewgent

이 표준은 실제 운영 환경에서 검증되었습니다. 17,942개의 지식 항목과 6개의 MCP 서버를 운영하는 제 개인 에이전트 시스템 [opencode-drewgent](https://github.com/humanerd-drew/opencode-drewgent)에서 `.agent/` 구조가 자연스럽게 추출되었습니다. 6개월 동안의 실제 사용 결과물입니다.

실제로 되는지 궁금하시다면 — 됩니다. ㅎ

---

## 라이선스와 기여

MIT 라이선스입니다. Fork해서 자유롭게 쓰세요. PR이나 이슈도 환영합니다.

다만 이건 어디까지나 제 개인적인 제안에 가깝습니다. "이런 접근도 있구나" 하고 읽어주시면 좋겠어요. 표준이라는 건 혼자 만드는 게 아니니까, 의견이 있으시면 편하게 얘기해주세요.
