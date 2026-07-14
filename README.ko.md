# `.agent/` workspace

[🇺🇸 English](README.md)

AI 에이전트(예: opencode, Claude Code, Cursor)가 어떤 프로그램을 쓰든 같은 성격, 같은 규칙, 같은 기억을 유지하게 해주는 설정 폴더입니다.

```bash
curl -fsSL https://raw.githubusercontent.com/humanerd-drew/agent-workspace/main/init.sh | bash
```

---

## 왜 만들었나

요즘 AI 코딩 도우미는 여러 가지가 있습니다. 어떤 사람은 opencode를 쓰고, 어떤 사람은 Claude Code나 Cursor를 씁니다. 문제는 도구마다 설정 방식이 달라서, 하나에서 익숙해져도 다른 걸 쓰면 처음부터 다시 해야 한다는 점이었어요.

AGENTS.md라는 파일 포맷이 있어서 명령어를 적는 방식은 통일되었습니다. 하지만 에이전트의 성격, 일하는 방식, 과거 기억은 여전히 각 프로그램이 제각각 저장하고 있어서, 프로그램을 바꾸면 모든 설정이 초기화됩니다.

이 문제를 해결하려는 시도가 sno-ai/mda, bodyboard, microsoft/skills 등 여러 프로젝트에서 독립적으로 생겨났습니다. 비슷한 고민을 하는 사람이 많다는 증거였어요. 저는 그 접근과는 조금 다르게, **프로그램마다 변환하는 대신 모든 프로그램이 같은 폴더를 읽게 하자**는 방향을 택했습니다.

## 무엇이 들어있나요

```
.agent/
├── identity.md       # "당신은 누구인가" — 에이전트의 성격과 말투
├── rules.md          # "절대 하지 말아야 할 것" — 불변 규칙
├── workflow/
│   ├── init.md       # 작업을 시작할 때의 루틴
│   └── general.md    # 일반적인 작업 방식
└── memory/           # 지난 대화와 결정을 기억하는 저장소
```

각 파일은 일반 텍스트로 작성되며, `.agent/` 폴더 하나만 관리하면 모든 프로그램에서 동일하게 적용됩니다.

## 시작하는 방법

### 자동 설치 (추천)

```bash
curl -fsSL https://raw.githubusercontent.com/humanerd-drew/agent-workspace/main/init.sh | bash
```

터미널에서 이 명령어를 실행하면 현재 사용 중인 프로그램을 자동으로 감지해서 `.agent/` 폴더를 만들고 설정을 마쳐줍니다.

### 직접 설정

이 저장소의 `agent/` 폴더를 복사해서 `.agent/`로 이름을 바꾸고, 프로젝트의 `AGENTS.md` 파일에 아래 한 줄을 추가하면 됩니다:

```markdown
Read .agent/identity.md, .agent/rules.md at session start.
```

## 기억 저장소 (선택 사항)

```bash
curl -fsSL https://raw.githubusercontent.com/humanerd-drew/agent-workspace/main/init.sh | bash -s -- --install
```

`--install`을 붙이면 지난 세션의 대화와 결정을 기억하는 저장소가 함께 설치됩니다. 에이전트가 전에 했던 대화를 바탕으로 더 나은 답변을 할 수 있게 됩니다.

| 기능 | 설명 |
|------|------|
| 기억하기 | 새 정보를 저장합니다 |
| 떠올리기 | 저장된 정보를 찾습니다 |
| 잊기 | 저장된 정보를 삭제합니다 |
| 고치기 | 저장된 정보를 수정합니다 |
| 통계보기 | 저장된 정보의 양을 확인합니다 |

## 프로젝트 구조

```
agent-workspace/
├── agent/                # .agent/ 참고 템플릿
├── init.sh               # 설치 스크립트
├── packages/
│   ├── memory/           # 기억 저장소 프로그램
│   └── create/           # 설정 생성 프로그램
└── AGENTS.md             # AAIF 표준 파일
```

## 실제 사용 사례

이 표준은 제 개인 프로젝트인 [opencode-drewgent](https://github.com/humanerd-drew/opencode-drewgent)에서 6개월간 검증되었습니다. 17,942건의 지식과 6개의 도구를 연결하는 시스템이 실제로 운영 중이고, `.agent/` 구조는 이 과정에서 자연스럽게 추출된 결과물입니다.

## 라이선스와 기여

MIT 라이선스입니다. Fork해서 자유롭게 쓰세요. PR이나 이슈도 환영합니다.

이건 어디까지나 제 개인적인 제안에 가깝습니다. "이런 접근도 있구나" 하고 읽어주시면 좋겠어요. 표준이라는 건 혼자 만드는 게 아니니까, 의견이 있으시면 편하게 얘기해주세요.
