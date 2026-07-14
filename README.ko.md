# `.agent/` workspace

**당신의 AI 에이전트는 어떤 사람이어야 하는지 압니다. 그걸 어디서나 알게 하세요.**

[🇺🇸 English](README.md)

---

AI 코딩 도우미를 써보신 분이라면 이런 경험 있으실 거예요. 에이전트한테 당신의 취향과 규칙을 가르치는 데 한참을 투자했는데, 다른 도구로 갈아타는 순간 모든 게 초기화되는. 당신을 그렇게 잘 알던 에이전트가 순식간에 낯선 사람이 되어버려요.

이 프로젝트는 그 좌절감을 단번에 해결하기 위해 만들어졌습니다.

## 아이디어

프로젝트에 `.agent/` 폴더 하나를 두면, 어떤 AI 도구든 읽을 수 있습니다. 에이전트의 성격, 규칙, 기억이 **그 폴더 안에** 존재하기 때문에, Claude Code에 갇히거나 Cursor에 종속되지 않습니다.

```
.agent/
├── identity.md       # 에이전트의 정체성 — 역할, 말투, 가치관
├── rules.md          # 절대 굽혀지지 않는 규칙 — 항상 켜져 있음
├── workflow/
│   ├── init.md       # 세션 시작할 때 할 일
│   └── general.md    # 일상적인 작업 방식
└── memory/           # 과거 세션에서 배운 내용
```

도구를 바꿔도 에이전트는 그대로입니다. 당신의 규칙과 목소리, 쌓아온 지식이 모두 남아 있어요. 폴더를 떠난 적이 없으니까요.

```bash
curl -fsSL https://raw.githubusercontent.com/humanerd-drew/agent-workspace/main/init.sh | bash
```

딱 한 줄이면 끝입니다. 어떤 도구를 쓰는지 감지하고, 정체성과 규칙 파일을 만들고, 기억 시스템을 연결해드려요.

---

## 왜 중요한가

AI 코딩 도구는 어지러울 정도로 빠르게 발전하고 있습니다. 매달 새로운 도구가 나오고, 써볼 만한 가치가 있어 보여요. 하지만 새 도구를 시도한다는 건 현재 에이전트가 당신에 대해 알고 있는 모든 것을 포기하는 일이기도 합니다.

설정 변환 도구들이 있긴 합니다 — 한 포맷에서 다른 포맷으로 옮겨주죠. 하지만 그건 언어가 바뀔 때마다 책을 다시 번역하는 것과 같아요. 진짜 해결책은 번역이 아닙니다. **진짜 해결책은 모두가 읽을 수 있는 공용어입니다.**

그게 바로 `.agent/`입니다. 어떤 도구든 읽을 수 있는 디렉토리. 평문. 종속 없음. 당신 에이전트의 영혼이 담긴 폴더.

## 구성

| 파일 | 역할 | 효과 |
|------|------|------|
| `identity.md` | 에이전트의 역할, 말투, 가치관 | 매 세션이 같은 분위기에서 시작 |
| `rules.md` | 절대 양보할 수 없는 제약 | 안전장치가 절대 사라지지 않음 |
| `workflow/init.md` | 세션 시작 규칙 | 매번 "분위기 설정"할 필요 없음 |
| `workflow/general.md` | 기본 작업 방식 | 일관된 접근, 세션이 바뀌어도 |
| `memory/` | 세션 간 기억 유지 | 어제 배운 게 오늘의 출발점 |

## 시작하기

**지금 당장** — 한 줄이면 모든 환경에서 작동:

```bash
curl -fsSL https://raw.githubusercontent.com/humanerd-drew/agent-workspace/main/init.sh | bash
```

끝입니다. 이 스크립트가 어떤 도구를 쓰는지 확인하고(opencode, Claude Code, Cursor, 또는 다른 것), 템플릿 파일을 만들고, 기억 시스템을 연결합니다. 프로젝트에 `.agent/` 폴더가 생긴 걸 보실 수 있을 거예요.

**기억을 영속적으로** — 배운 내용을 세션 간에 기억:

```bash
curl -fsSL https://raw.githubusercontent.com/humanerd-drew/agent-workspace/main/init.sh | bash -s -- --install
```

**어느 시스템에서든** — macOS, Linux, Windows (WSL 또는 Git Bash). 운영체제 간 차이를 알아서 처리하도록 다시 작성되었습니다.

**직접 설정** — 마법을 원하지 않는다면 `agent/` 폴더를 직접 복사:

```markdown
Read .agent/identity.md, .agent/rules.md at session start.
```

이 한 줄을 `agents.md`(Claude Code는 `CLAUDE.md`)에 추가하면 끝입니다.

## init.sh 동작 방식

단순한 한 줄 뒤에는 도구와의 세밀한 협업이 있습니다:

| 하는 일 | 왜 중요한가 |
|---------|-----------|
| **도구 감지** | opencode.jsonc, CLAUDE.md, .cursorrules 등 자동 탐지 |
| **정체성 + 규칙 생성** | 에이전트 이름이 포함된 템플릿 파일 작성 |
| **agents.md → CLAUDE.md 브릿지** | Claude Code는 CLAUDE.md를 읽습니다. 이 스크립트가 자동으로 연결 |
| **메모리 연결** | 사용 중인 도구에 맞게 MCP 서버 설정 |
| **.gitignore 정리** | 기억 데이터베이스가 로컬에만 남도록 보호 |

운영체제에 대한 어떤 가정도 하지 않습니다. macOS, Linux, Windows — 스크립트가 알아서 적응합니다.

## 패키지

`packages/` 디렉토리에 있는 두 개의 작은 패키지가 메모리 계층을 동작하게 합니다:

### `@agent-workspace/memory`

영속적 기억을 위한 MCP 서버. SQLite 기반, 외부 네트워크 호출 없음, 네이티브 의존성 없음. 그저 디스크의 파일 하나일 뿐입니다.

```bash
npx @agent-workspace/memory --db .agent/memory/knowledge.db
```

| 기능 | 설명 |
|------|------|
| `remember(fact, type?)` | 나중에 기억할 내용 저장 |
| `recall(query, limit?)` | 과거 기억 검색 |
| `forget(id)` | 기억 삭제 |
| `update(id, fact?, type?)` | 저장된 내용 수정 |
| `memory-stats()` | 에이전트의 기억량 확인 |

### `@agent-workspace/create`

init.sh가 하는 일을 npm 명령어로 제공하는 CLI.

```bash
npx @agent-workspace/create init
```

`--name`, `--role`, `--domain`, `--global`, `--install`, `--framework` 플래그를 지원합니다.

## 이 프로젝트의 뿌리

이것은 설계도부터 만든 프로젝트가 아닙니다. `.agent/` 구조와 규칙은 [opencode-drewgent](https://github.com/humanerd-drew/opencode-drewgent)라는 개인 에이전트 시스템에서 성장했습니다. 6개월 넘게 매일 운영되면서 쌓인 17,942건의 지식 항목. 여섯 개의 연결된 MCP 서버. 수천 번의 사용자 교정과 반복.

`agent/`의 모든 규칙은 실제 사용에서 형성되었습니다. "그렇게 하지 마"를 세 번째 말하는 순간, 무언가 바뀌어야 합니다. 그 변화들이 지금 여러분이 보는 템플릿이 되었습니다. 선호 학습 루프, Layer 0 거버넌스, 의사결정 프레임워크 — 이 모든 것은 에이전트가 계속 잘못된 일을 하던 늦은 밤 세션에서 (비유적으로) 피를 흘리며 쓰였습니다.

이것은 장난감 템플릿이 아닙니다. AI 코딩 에이전트와 삶을 공유할 때 실제로 통했던 것들의 정수입니다.

## 이것은 무엇이 아닌가

이것은 개인적인 제안이지, 공식 표준이 아닙니다. 당신의 워크플로우나 언어, 스타일에 맞지 않을 수 있습니다. 괜찮습니다. Fork하고, 적응시키고, 필요 없는 건 버리세요.

목표는 모두가 같은 템플릿을 쓰는 것이 아닙니다. **목표는 중요한 것 — 당신 에이전트의 정체성 — 이 도구 교체와 OS 업그레이드, 나쁜 결정에서 살아남을 수 있는 공통된 장소를 만드는 것입니다.**

## 라이선스

MIT. 사용하고, 공유하고, 개선하세요. PR과 이슈는 진심으로 환영합니다.

---

*"도구를 바꿀 때마다 당신의 에이전트는 자신이 누군지 기억해야 합니다. 당신이 그걸 도구가 건드릴 수 없는 곳에 두었으니까."*
