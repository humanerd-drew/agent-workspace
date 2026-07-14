# `.agent/` workspace

**AI 에이전트 설정, 폴더 하나로 통일하세요.** 프레임워크를 넘나드는 정체성, 규칙, 기억 체계 — opencode, Claude Code, Cursor 등 모든 도구에서 동일하게 작동합니다.

[🇺🇸 English](README.md)

```bash
curl -fsSL https://raw.githubusercontent.com/humanerd-drew/agent-workspace/main/init.sh | bash
```

---

## 문제

AI 코딩 도우미마다 설정 방식이 다릅니다. opencode, Claude Code, Cursor, Windsurf, Copilot — 각자 제각각의 포맷으로 에이전트의 성격과 규칙을 저장합니다. 그래서 도구를 바꾸면 모든 설정이 초기화됩니다.

이 문제를 해결하려는 시도(sno-ai/mda, bodyboard, microsoft/skills)는 대부분 "변환"에 초점을 맞췄습니다. 하지만 이는 증상만 치료하는 겁니다. 근본 원인은 **에이전트 설정을 위한 이식 가능한 계층이 없다는 것**입니다.

## 해결책

`.agent/`는 어떤 도구든 읽을 수 있는 평문 디렉토리입니다:

```
.agent/
├── identity.md       # 에이전트 정체성 — 역할, 말투, 가치관
├── rules.md          # 불변 규칙 — 항상 적용
├── workflow/
│   ├── init.md       # 세션 시작 루틴
│   └── general.md    # 기본 작업 방식
└── memory/           # 세션을 넘나드는 기억 저장소
```

`agents.md`(AAIF 표준 파일)가 `.agent/`를 참조하게 하면 끝입니다. 에이전트 설정이 당신을 따라다닙니다.

## 시작하기

**자동 설치** — 현재 도구를 감지해서 모든 설정을 완료:

```bash
curl -fsSL https://raw.githubusercontent.com/humanerd-drew/agent-workspace/main/init.sh | bash
```

**기억 저장소 포함** — 과거 세션을 기억합니다:

```bash
curl -fsSL https://raw.githubusercontent.com/humanerd-drew/agent-workspace/main/init.sh | bash -s -- --install
```

**직접 설정** — `agent/` 폴더를 `.agent/`로 복사하고 `agents.md`에 아래 한 줄 추가:

```markdown
Read .agent/identity.md, .agent/rules.md at session start.
```

## `init.sh` 기능

| 기능 | 설명 |
|------|------|
| **프레임워크 감지** | opencode, Claude Code, Cursor, generic 자동 감지 |
| **템플릿 생성** | identity, rules, workflow 파일 자동 생성 |
| **MCP 연결** | 메모리 서버를 도구에 맞게 자동 설정 |
| **`--install`** | [@agent-workspace/memory](#agent-workspacememory) 서버 로컬 설치 및 빌드 |
| **`--name`** | 에이전트 이름 지정 (기본값: 디렉토리명) |

## 패키지

`packages/` 디렉토리에 두 개의 npm 패키지가 있습니다.

### `@agent-workspace/memory`

영속적 세션 간 기억을 위한 MCP 서버. SQLite + FTS5 기반, 외부 API 호출 불필요, 네이티브 의존성 없음.

```bash
npx @agent-workspace/memory --db .agent/memory/knowledge.db
```

| 기능 | 설명 |
|------|------|
| `remember(fact, type?)` | 기억 저장 |
| `recall(query, limit?)` | 기억 검색 |
| `forget(id)` | 기억 삭제 |
| `update(id, fact?, type?)` | 기억 수정 |
| `memory-stats()` | 통계 확인 |

### `@agent-workspace/create`

프레임워크 자동 감지로 `.agent/` 워크스페이스를 초기화하는 CLI.

```bash
npx @agent-workspace/create init
```

`--name`, `--role`, `--domain`, `--global`, `--install`, `--framework` 플래그 지원.

## 실제 검증

`.agent/` 구조와 규칙은 [opencode-drewgent](https://github.com/humanerd-drew/opencode-drewgent)에서 6개월 이상 운영 중인 시스템을 기반으로 합니다. 17,942건의 지식 항목, 6개의 MCP 서버, 그리고 수많은 사용자 교정을 통해 실제로 검증된 패턴들입니다.

이 템플릿의 규칙, 워크플로, 의사결정 프레임워크는 장난감이 아닙니다. 매일매일의 사용과 피드백으로 만들어진 결과물입니다.

## 라이선스

MIT. Fork해서 자유롭게 사용하세요. PR과 이슈도 환영합니다.

개인적인 제안에 가깝습니다. "이런 접근도 있구나" 하고 읽어주시면 좋겠어요.
