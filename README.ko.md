# `.agent/` workspace

**에이전트의 성격은, 도구가 정하는 게 아닙니다.**

[🇺🇸 English](README.md)

---

AI 코딩 도우미를 써보신 분은 공감하실 거예요. 에이전트한테 내 취향과 규칙을 가르치는 데 한참 투자하고 나면 어느새 둘도 없는 파트너가 되어 있죠. 그런데 다른 도구로 갈아타는 순간, 방금까지 내 에이전트였던 녀석이 모르는 사람이 돼버립니다. 모든 설정이 리셋. 처음부터 다시 키워야 해요.

이 프로젝트는 그 문제를 단번에 해결하려고 만들었습니다.

## 아이디어

프로젝트에 `.agent/` 폴더 하나를 두면, AI 도구라면 뭐든 읽을 수 있어요. 에이전트의 성격과 규칙, 기억이 **그 폴더 안에** 살게 됩니다. Claude Code에 종속되지 않고, Cursor에 묶이지 않고요.

```
.agent/
├── identity.md       # 에이전트 정체성 — 역할, 말투, 가치관
├── rules.md          # 절대 안 꺾이는 규칙 — 항상 ON
├── workflow/
│   ├── init.md       # 세션 시작할 때 루틴
│   └── general.md    # 평소 작업 방식
└── memory/           # 지난 세션에서 배운 것들
```

도구를 바꿔도 에이전트는 그대로입니다. 내 규칙과 목소리, 쌓아온 지식 — 다 남아 있어요. 폴더를 떠난 적이 없으니까요.

```bash
curl -fsSL https://raw.githubusercontent.com/humanerd-drew/agent-workspace/main/init.sh | bash
```

딱 한 줄이면 됩니다. 도구를 탐지하고, 정체성 파일을 만들고, 기억 시스템을 연결합니다. 3초면 끝이에요.

---

## 왜 중요한가요

AI 코딩 도구가 엄청나게 빠르게 나오고 있어요. 매달 새로운 도구가 쏟아지고, 다 써볼 만한 가치가 있죠. 하지만 새 도구를 쓰려면 현재 에이전트가 나에 대해 아는 모든 걸 포기해야 합니다.

변환 도구라는 게 있긴 해요 — 한 포맷을 다른 포맷으로 옮겨주는 도구들. 근데 그건 언어가 바뀔 때마다 책을 다시 번역하는 것과 같아요. 번역이 해결책이 아닙니다. **진짜 해결책은 공용어입니다.**

그게 바로 `.agent/`입니다. 어떤 도구든 읽을 수 있는 디렉토리. 평문. 종속 없음. 에이전트의 영혼이 담긴 폴더.

## 구성 보기

| 파일 | 하는 일 | 왜 좋은가 |
|------|--------|---------|
| `identity.md` | 에이전트 역할, 말투, 가치관 | 매 세션 같은 분위기로 시작 |
| `rules.md` | 절대 양보 없는 제약 | 안전장치가 사라지지 않음 |
| `workflow/init.md` | 세션 시작 규칙 | 매번 분위기 잡을 필요 없음 |
| `workflow/general.md` | 기본 작업 흐름 | 세션이 바뀌어도 일관되게 |
| `memory/` | 세션 간 기억 유지 | 어제 배운 게 오늘의 출발점 |

## 시작하기

**지금 당장 해보세요** — 한 줄이면 모든 환경에서 동작합니다:

```bash
curl -fsSL https://raw.githubusercontent.com/humanerd-drew/agent-workspace/main/init.sh | bash
```

이게 전부입니다. 스크립트가 알아서 도구를 찾고(opencode, Claude Code, Cursor, 무엇이든), 템플릿을 만들고, 기억을 연결합니다. 프로젝트에 `.agent/` 폴더가 생긴 걸 보실 수 있을 거예요.

**기억 기능까지** — 배운 내용을 세션 간에 기억시키려면:

```bash
curl -fsSL https://raw.githubusercontent.com/humanerd-drew/agent-workspace/main/init.sh | bash -s -- --install
```

**어느 OS든** — macOS, Linux, Windows(WSL, Git Bash). 운영체제 차이는 스크립트가 알아서 처리하게 다시 작성했습니다.

**직접 설정하고 싶다면** — 마법보단 손이 빠르죠:

```markdown
Read .agent/identity.md, .agent/rules.md at session start.
```

이 한 줄을 `agents.md`(Claude Code를 쓴다면 `CLAUDE.md`)에 추가하면 끝입니다.

---

> **3초면 에이전트가 태어납니다. 이제 당신의 에이전트로 키우세요.**
> 
> [워크샵 참여하기 →](https://github.com/humanerd-drew/opencode-drewgent)
> 서브에이전트 프로필, 영구 메모리 MCP, 칸반 파이프라인까지 갖춘
> 맞춤형 에이전트를 직접 만들어보는 3시간 실습입니다.

## init.sh의 속사정

겉보기엔 한 줄짜리지만, 안에서는 이런 일들이 일어납니다:

| 하는 일 | 왜 필요한가 |
|---------|-----------|
| **도구 탐지** | opencode.jsonc, CLAUDE.md, .cursorrules — 플래그 필요 없음 |
| **정체성 + 규칙 생성** | 에이전트 이름이 담긴 템플릿 파일 생성 |
| **agents.md → CLAUDE.md 브릿지** | Claude Code는 agents.md를 읽지 않아요. 스크립트가 연결 다리를 만들어줌 |
| **메모리 연결** | 사용 중인 도구에 맞게 MCP 서버 설정 |
| **.gitignore 처리** | 기억 데이터베이스가 로컬에만 남도록 보호 |

운영체제에 대해 아무 가정도 하지 않습니다. macOS, Linux, Windows — 스크립트가 알아서 적응해요.

## 패키지

`packages/` 아래 두 개 패키지가 기억 시스템을 움직입니다:

### `@agent-workspace/memory`

기억을 저장하는 MCP 서버. SQLite 기반, 외부 API 호출 없음, 네이티브 의존성 없음. 그저 디스크의 파일 하나입니다.

```bash
npx @agent-workspace/memory --db .agent/memory/knowledge.db
```

| 기능 | 설명 |
|------|------|
| `remember(fact, type?)` | 나중에 쓸 내용 저장 |
| `recall(query, limit?)` | 과거 기억 검색 |
| `forget(id)` | 기억 삭제 |
| `update(id, fact?, type?)` | 저장된 내용 수정 |
| `memory-stats()` | 에이전트의 기억량 확인 |

### `@agent-workspace/create`

init.sh가 하는 일을 npm 커맨드로 제공하는 CLI입니다.

```bash
npx @agent-workspace/create init
```

`--name`, `--role`, `--domain`, `--global`, `--install`, `--framework`를 지원합니다.

## 이 프로젝트의 뿌리

설계도부터 그린 프로젝트가 아닙니다. `.agent/` 구조는 [opencode-drewgent](https://github.com/humanerd-drew/opencode-drewgent)라는 개인 에이전트 시스템에서 자라났어요. 6개월 넘게 매일 굴리면서 쌓인 17,942건의 지식. 여섯 개의 MCP 서버. 수천 번의 사용자 교정과 반복.

`agent/`의 모든 규칙은 실제 부딪히면서 만들어졌습니다. "그거 하지 마"를 세 번째 말하는 순간, 뭔가 바뀌어야 해요. 그 변화들이 지금의 템플릿이 되었습니다. 선호 학습 루프, Layer 0 거버넌스, 의사결정 프레임워크 — 모두 에이전트가 자꾸 삽질할 때 쓰이며 다듬어졌어요.

장난감 템플릿이 아닙니다. AI 코딩 에이전트와 함께 생활할 때 실제로 통했던 것들의 정수입니다.

### 더 깊게 커스터마이징하고 싶나요?

`.agent/`는 에이전트에 이식 가능한 정체성을 줍니다. 하지만 진짜 개인 에이전트는 서브에이전트 프로필, 영구 메모리, 커스텀 스킬, 크론 자동화, 칸반 파이프라인이 필요합니다.

[opencode-drewgent](https://github.com/humanerd-drew/opencode-drewgent)가 그 역할을 합니다: `.agent/` 기반 위에 구축된 풀스택 에이전트 스타터 키트입니다. 2분이면 fork해서 시작할 수 있고, 3시간 워크샵을 통해 guided build도 가능합니다.

| | 직접 시작하기 | 워크샵 참여 |
|---|---|---|
| 시간 | 2분 (clone + setup) | 3시간 (guided build) |
| 대상 | 개발자 누구나 | 맞춤형 에이전트를 원하는 분 |
| 가격 | 무료 (MIT) | 유료 (16만원) |
| 시작 → | [`opencode-drewgent`](https://github.com/humanerd-drew/opencode-drewgent) | [다음 워크샵 신청](https://discord.gg/vWzDeKwpbB) |

워크샵은 라이브 세션으로 진행됩니다. 참가자는 자신만의 규칙, 스킬, 서브에이전트를 가진 에이전트를 완성해서 가져갑니다. [Discord 커뮤니티](https://discord.gg/vWzDeKwpbB)에서 다음 일정을 확인하세요.

## 이것은 무엇이 아닌가

이것은 개인적인 제안이지, 공식 표준이 아닙니다. 여러분의 워크플로나 언어, 스타일에 맞지 않을 수 있어요. 괜찮습니다. Fork하고, 뜯어고치고, 필요 없는 건 버리세요.

목표는 모두가 같은 템플릿을 쓰는 것이 아닙니다. **목표는 중요한 것 — 내 에이전트의 정체성 — 이 도구 교체와 OS 업그레이드, 온갖 삽질 속에서도 살아남을 공통 장소를 만드는 것입니다.**

## 라이선스

MIT. 사용하고, 공유하고, 개선해주세요. PR과 이슈는 언제나 환영입니다.

---

*"도구를 바꿀 때마다 내 에이전트는 자신이 누군지 기억해야 합니다. 내가 그걸 도구가 건드릴 수 없는 곳에 두었으니까요."*

---

**커뮤니티** — [Discord](https://discord.gg/vWzDeKwpbB) | 질문, 공유, 워크샵 공지. 한국어/English.

**opencode-drewgent** — [GitHub](https://github.com/humanerd-drew/opencode-drewgent) | 이 `.agent/` 표준이 자라난 풀스택 에이전트 스타터 키트.
