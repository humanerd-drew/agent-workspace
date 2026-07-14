# `.agent/` workspace

**내 AI 에이전트, 나만의 성격을 갖게 하자. 어디서든.**

[🇺🇸 English](README.md)

---

AI 코딩 도우미 써본 사람은 다 안다. 에이전트한테 내 취향이랑 규칙 가르치는 데 한참 투자하고 나면 어느새 둘도 없는 파트너가 되어있지. 근데 다른 도구로 갈아타는 순간, 방금까지 내 에이전트였던 놈이 모르는 사람이 된다. 모든 설정이 리셋. 처음부터 다시 키워야 함.

이 프로젝트는 그 문제를 한 번에 박살내려고 만들었다.

## 아이디어

프로젝트에 `.agent/` 폴더 하나 박아두면, AI 도구라면 뭐든 읽을 수 있다. 에이전트의 성격과 규칙, 기억이 **그 폴더 안에** 사는 거다. Claude Code에 종속되지 않고, Cursor에 묶이지 않고.

```
.agent/
├── identity.md       # 에이전트 정체성 — 역할, 말투, 가치관
├── rules.md          # 절대 안 꺾이는 규칙 — 항상 ON
├── workflow/
│   ├── init.md       # 세션 시작할 때 루틴
│   └── general.md    # 평소 작업 방식
└── memory/           # 지난 세션에서 배운 것들
```

도구가 바뀌어도 에이전트는 그대로다. 네 규칙, 네 목소리, 쌓아온 지식 — 다 남아 있음. 폴더를 떠난 적이 없으니까.

```bash
curl -fsSL https://raw.githubusercontent.com/humanerd-drew/agent-workspace/main/init.sh | bash
```

딱 한 줄. 도구 탐지하고, 정체성 파일 만들고, 기억 시스템 연결한다. 3초면 끝.

---

## 그래서 왜 중요한데

AI 코딩 도구가 미친 듯이 빠르게 나오고 있다. 매달 새로운 도구가 나오고, 다 써볼 만하다. 근데 새 도구 쓰려고 하면 현재 에이전트가 나에 대해 아는 모든 걸 포기해야 함.

변환 도구라고 있긴 하다 — 한 포맷을 다른 포맷으로 옮겨주는. 근데 그건 언어 바뀔 때마다 책을 다시 번역하는 꼴. 번역이 해결책이 아니다. **진짜 해결책은 공용어다.**

그게 `.agent/`다. 어떤 도구든 읽을 수 있는 디렉토리. 평문. 종속 없음. 에이전트의 영혼이 담긴 폴더.

## 구성 보기

| 파일 | 하는 일 | 왜 좋은데 |
|------|--------|---------|
| `identity.md` | 에이전트 역할, 말투, 가치관 | 매 세션 같은 분위기로 시작 |
| `rules.md` | 절대 양보 없는 제약 | 안전장치가 증발 안 함 |
| `workflow/init.md` | 세션 시작 규칙 | 매번 "분위기 잡기" 안 해도 됨 |
| `workflow/general.md` | 기본 작업 흐름 | 세션 바뀌어도 일관되게 |
| `memory/` | 세션 간 기억 유지 | 어제 배운 게 오늘 출발점 |

## 시작하기

**지금 당장** — 한 줄. 모든 환경에서 돌아감:

```bash
curl -fsSL https://raw.githubusercontent.com/humanerd-drew/agent-workspace/main/init.sh | bash
```

이게 끝이다. 스크립트가 알아서 도구 찾고(opencode, Claude Code, Cursor, 뭐든), 템플릿 만들고, 기억 연결한다. 프로젝트에 `.agent/` 폴더가 생긴 걸 보게 될 거다.

**기억 기능까지** — 배운 내용을 세션 간에 기억시키려면:

```bash
curl -fsSL https://raw.githubusercontent.com/humanerd-drew/agent-workspace/main/init.sh | bash -s -- --install
```

**어느 OS든** — macOS, Linux, Windows(WSL, Git Bash). 운영체제 차이를 스크립트가 알아서 처리하게 다시 짰다.

**직접 하고 싶으면** — 마법보다 손이 먼저다:

```markdown
Read .agent/identity.md, .agent/rules.md at session start.
```

이거 한 줄을 `agents.md`(Claude Code 쓰면 `CLAUDE.md`)에 추가.

## init.sh의 속사정

겉보기엔 한 줄짜리지만 안에서는 이러고 있다:

| 하는 일 | 왜 필요하냐면 |
|---------|-------------|
| **도구 탐지** | opencode.jsonc, CLAUDE.md, .cursorrules — 플래그 필요 없음 |
| **정체성 + 규칙 생성** | 에이전트 이름 박힌 템플릿 파일 생성 |
| **agents.md → CLAUDE.md 브릿지** | Claude Code는 agents.md 안 읽음. 스크립트가 연결 다리 만들어줌 |
| **메모리 연결** | 네 도구에 맞게 MCP 서버 설정 |
| **.gitignore 처리** | 기억 데이터베이스가 로컬에만 남게 보호 |

운영체제에 대해 아무 가정도 안 한다. macOS, Linux, Windows — 스크립트가 알아서 적응.

## 패키지

`packages/` 아래 두 개 패키지가 기억 시스템을 움직인다:

### `@agent-workspace/memory`

기억을 저장하는 MCP 서버. SQLite 기반, 외부 API 호출 제로, 네이티브 의존성 제로. 그냥 디스크의 파일 하나.

```bash
npx @agent-workspace/memory --db .agent/memory/knowledge.db
```

| 기능 | 설명 |
|------|------|
| `remember(fact, type?)` | 나중에 쓸 내용 저장 |
| `recall(query, limit?)` | 과거 기억 검색 |
| `forget(id)` | 기억 삭제 |
| `update(id, fact?, type?)` | 저장된 내용 수정 |
| `memory-stats()` | 에이전트 기억량 확인 |

### `@agent-workspace/create`

init.sh가 하는 일을 npm 커맨드로 만든 CLI.

```bash
npx @agent-workspace/create init
```

`--name`, `--role`, `--domain`, `--global`, `--install`, `--framework` 지원.

## 이거 어디서 나왔나

설계도부터 그린 프로젝트가 아니다. `.agent/` 구조는 [opencode-drewgent](https://github.com/humanerd-drew/opencode-drewgent)라는 개인 에이전트 시스템에서 자라났다. 6개월 넘게 매일 굴리면서 쌓인 17,942건의 지식. 여섯 개 MCP 서버. 수천 번의 사용자 교정과 반복.

`agent/`의 모든 규칙은 실제 부딪히면서 만들어졌다. "그거 하지 마"를 세 번째 말하는 순간, 뭔가 바뀌어야 한다. 그 변화들이 지금의 템플릿이 되었다. 선호 학습 루프, Layer 0 거버넌스, 의사결정 프레임워크 — 다 에이전트가 자꾸 삽질할 때 (말 그대로 참고) 쓰였다.

장난감 템플릿이 아니다. AI 코딩 에이전트랑 함께 살아갈 때 실제로 통한 것들의 정수.

## 이게 아닌 것

이건 개인 제안이다. 공식 표준이 아니다. 네 워크플로, 네 언어, 네 스타일에 안 맞을 수 있다. 괜찮다. Fork하고, 뜯어고치고, 필요 없는 건 버려라.

목표는 모두가 같은 템플릿을 쓰는 게 아니다. **목표는 중요한 것 — 네 에이전트의 정체성 — 이 도구 교체, OS 업그레이드, 삽질 속에서도 살아남을 공통 장소를 만드는 거다.**

## 라이선스

MIT. 쓰고, 공유하고, 고쳐라. PR과 이슈는 환영이다.

---

*"도구를 바꿀 때마다 네 에이전트는 자기 정체성을 기억해야 한다. 네가 그걸 도구가 건드릴 수 없는 곳에 뒀으니까."*
