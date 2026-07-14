# agent-workspace

AI 에이전트를 쓰다 보면 이런 순간이 옵니다.

opencode에서 Claude Code로 갈아탔다. 그런데 내 에이전트가 나를 기억하지 못한다. 세션마다 다시 설명해야 하고, 쌓아둔 규칙은 리셋되고, MCP 설정은 또 다른 JSON을 편집해야 한다. "AGENTS.md 하나면 된다"고 했는데, 알고 보니 그건 시작일 뿐이었다.

이 레포는 그 문제에 대한 제 나름의 답입니다.

---

## `.agent/` — 하나의 폴더로 통일하자

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

AGENTS.md             # AAIF 표준 브리지 — ".agent/를 읽어라"
```

AGENTS.md는 더 이상 모든 것을 담는 단일 파일이 아닙니다. 표준 진입점 역할만 하고, 실제 설정은 `.agent/`로 위임합니다.

**도구를 바꿔도 `.agent/`는 그대로입니다.** 이 폴더를 git에 올리면 팀 전체가 같은 에이전트 설정을 공유할 수 있고, opencode에서 Claude Code로, 다시 Cursor로 갈아타도 내 에이전트는 나를 기억합니다.

---

## 어떻게 쓰나

### curl | bash (초간단)

```bash
curl -fsSL https://raw.githubusercontent.com/humanerd-drew/agent-workspace/main/init.sh | bash
```

이 한 줄이:
1. 현재 프로젝트에서 쓰는 도구를 자동 감지합니다 (opencode, Claude Code, Cursor 등)
2. `.agent/` 디렉토리를 생성하고 identity, rules, workflow 템플릿을 넣습니다
3. `AGENTS.md`가 `.agent/`를 참조하도록 설정합니다
4. 각 도구의 설정 파일에 memory MCP 서버를 자동 등록합니다

### memory MCP 서버까지 자동 설치

```bash
curl -fsSL https://raw.githubusercontent.com/humanerd-drew/agent-workspace/main/init.sh | bash -s -- --install
```

`--install`을 붙이면 memory MCP 서버도 함께 다운로드해서 설정합니다. SQLite FTS5 기반으로, `remember()` / `recall()` / `forget()` / `update()` / `memory-stats()`를 지원합니다.

---

## 구조

`agent-workspace`는 세 부분으로 나뉩니다:

| 파트 | 위치 | 설명 |
|------|------|------|
| **표준 템플릿** | `agent/` | `.agent/` 디렉토리의 참고 구현. fork하거나 복사해서 시작하세요 |
| **init.sh** | 루트 | curl \| bash 한 줄 설치 스크립트 |
| **MCP 서버** | `packages/memory` | @agent-workspace/memory — 영구 메모리 MCP 서버 |
| **CLI** | `packages/create` | @agent-workspace/create — init 명령어 (npm publish 보류) |

표준 자체는 `.agent/` 디렉토리 하나로 완성됩니다. MCP 서버는 옵션입니다. SQLite를 직접 읽어도 되고, 다른 메모리 백엔드를 써도 됩니다. `.agent/`는 그 선택을 제약하지 않습니다.

---

## 왜 npm이 아닌 GitHub인가

`@agent-workspace/memory`는 npm에 올리려다가 보류했습니다. npm 2FA 인증 문제도 있었지만, 더 근본적인 이유가 있습니다.

**이 프로젝트의 본질은 패키지가 아니라 구조입니다.**

`npx @agent-workspace/memory`를 설치하는 것보다 `curl | bash`로 시작하고 GitHub 템플릿을 포크하는 편이 이 프로젝트의 성격에 더 맞습니다. `.agent/` 디렉토리 자체가 진짜 산출물이니까요.

npm publish는 인증이 해결되면 추가할 예정입니다.

---

## Drewgent — 첫 번째 reference implementation

이 표준의 첫 번째 실제 사용 사례는 제 개인 에이전트 시스템인 [Drewgent](https://github.com/humanerd-drew/opencode-drewgent)입니다. 17,942개의 지식 항목, 6개의 MCP 서버, 40개 이상의 스킬을 운영하며 `.agent/` 구조를 6개월간 검증했습니다.

실제로 되는지 궁금하시다면 — 됩니다. ㅎ

---

## 라이선스와 기여

MIT 라이선스입니다. Fork해서 자유롭게 쓰세요. PR이나 이슈도 환영하지만, 이 프로젝트는 어디까지나 제 개인적인 제안에 가깝습니다. "이런 접근도 있구나" 정도로 봐주시면 좋겠어요.

표준이라는 건 혼자 만드는 게 아니니까, 의견이 있으시면 편하게 얘기해주세요.
