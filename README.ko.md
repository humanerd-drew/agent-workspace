# `.agent/` workspace

[🇺🇸 English](README.md)

AI 에이전트가 opencode, Claude Code, Cursor 등 어떤 도구에서든 동일한 설정과 메모리를 유지하게 해주는 워크스페이스 표준입니다.

```bash
curl -fsSL https://raw.githubusercontent.com/humanerd-drew/agent-workspace/main/init.sh | bash
```

---

## 왜 만들었나

AGENTS.md는 에이전트 명령어를 표준화했지만, **identity, rules, workflow, MCP 설정, 메모리는 여전히 각 도구가 제각각**입니다. opencode에서 Claude Code로 갈아타면 모든 설정이 리셋됩니다.

이 문제를 해결하려는 converter 프로젝트가 sno-ai/mda, bodyboard, microsoft/skills 등 최소 3개가 독립적으로 생겨났습니다. converter가 생긴다는 건, 무언가 표준화되지 않았다는 뜻입니다.

저는 변환 대신 **같은 구조를 모든 도구가 읽게 하자**는 접근을 택했습니다.

## 구조

```
.agent/
├── identity.md       # 역할, 말투, 가치관 — 에이전트의 성격
├── rules.md          # 불변 규칙 (must / must not)
├── workflow/
│   ├── init.md       # 세션 시작 프로토콜
│   └── general.md    # 일반 작업 워크플로
└── memory/           # SQLite FTS5 영구 메모리

AGENTS.md             # AAIF 표준 브리지 (".agent/를 읽어라")
```

AGENTS.md는 더 이상 모든 내용을 담는 파일이 아닙니다. 표준 진입점 역할만 하고, 실제 설정은 `.agent/`로 위임합니다. **도구를 바꿔도 `.agent/`는 그대로입니다.**

## 어떻게 쓰나

### curl | bash 한 줄 설치

```bash
curl -fsSL https://raw.githubusercontent.com/humanerd-drew/agent-workspace/main/init.sh | bash
```

프레임워크를 자동 감지(opencode, Claude Code, Cursor)해서 `.agent/`를 생성하고 MCP 설정까지 주입합니다.

### 수동 복사

템플릿 레포의 `agent/` 디렉토리를 `.agent/`로 복사하고, AGENTS.md에 한 줄 추가:

```markdown
Read .agent/identity.md, .agent/rules.md at session start.
```

### 메모리 (MCP 서버, 옵션)

```bash
curl -fsSL https://raw.githubusercontent.com/humanerd-drew/agent-workspace/main/init.sh | bash -s -- --install
```

| 기능 | 설명 |
|------|------|
| `agent-memory_remember` | 저장 |
| `agent-memory_recall` | FTS5 검색 |
| `agent-memory_forget` | 삭제 |
| `agent-memory_update` | 수정 |
| `agent-memory_memory-stats` | 통계 |

SQLite FTS5 기반. 외부 API 불필요.

## 레포 구조

```
agent-workspace/
├── agent/                # .agent/ 참고 템플릿
├── init.sh               # curl | bash 설치 스크립트
├── packages/memory/      # MCP 서버 (TypeScript)
├── packages/create/      # CLI init 명령어 (TypeScript)
└── AGENTS.md             # AAIF 브리지
```

MCP 서버와 CLI는 `packages/` 아래에 있습니다. Node.js만 있으면 실행됩니다.

## Reference: opencode-drewgent

이 표준은 17,942개 지식 항목, 6개 MCP 서버를 운영 중인 [opencode-drewgent](https://github.com/humanerd-drew/opencode-drewgent)에서 6개월간 검증되었습니다.

실제로 되는지 궁금하시다면 — 됩니다. ㅎ

## 라이선스

MIT. Fork해서 자유롭게 쓰세요. PR/이슈 환영합니다.

표준은 혼자 만드는 게 아니니까, 의견 있으면 편하게 얘기해주세요.
