# `.agent/` workspace

[🇺🇸 English](README.md)

AI 에이전트(챗봇/코딩 도우미)가 어떤 프로그램을 쓰든 같은 성격, 같은 규칙, 같은 기억을 유지하게 해주는 설정 폴더입니다.

```bash
curl -fsSL https://raw.githubusercontent.com/humanerd-drew/agent-workspace/main/init.sh | bash
```

---

## 이게 뭔가요

AI 에이전트(예: opencode, Claude Code, Cursor)는 각자 설정을 저장하는 방식이 다릅니다. A라는 프로그램에서 설정해도 B로 옮기면 처음부터 다시 해야 해요.

`.agent/` 폴더는 모든 프로그램이 공통으로 읽는 설정 파일들을 담고 있습니다. 프로그램이 바뀌어도 이 폴더만 있으면 에이전트가 같은 방식으로 동작합니다.

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

각 파일은 일반 텍스트로 작성되며, 내용은 에이전트가 직접 읽습니다.

## 어떻게 시작하나요

### 자동 설치

터미널에서 이 명령어를 실행하면 현재 사용 중인 프로그램을 감지해서 자동으로 설정합니다:

```bash
curl -fsSL https://raw.githubusercontent.com/humanerd-drew/agent-workspace/main/init.sh | bash
```

### 직접 설정

1. 이 저장소의 `agent/` 폴더를 복사해서 `.agent/`로 이름을 바꿉니다
2. `AGENTS.md` 파일에 아래 내용을 추가합니다:

```markdown
Read .agent/identity.md, .agent/rules.md at session start.
```

### 기억 저장소 (선택사항)

위 명령어에 `--install`을 붙이면 지난 세션의 대화와 결정을 기억하는 저장소도 함께 설치됩니다. 에이전트가 전에 했던 대화를 기억하고 활용할 수 있게 됩니다.

## 누가 사용하나요

이 표준은 제 개인 프로젝트인 [opencode-drewgent](https://github.com/humanerd-drew/opencode-drewgent)에서 6개월간 실제로 사용되며 검증되었습니다.

## 라이선스

MIT 라이선스입니다. 자유롭게 사용하고 공유하세요.
