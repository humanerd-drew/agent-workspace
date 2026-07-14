<!--
  .agent/workflow/general.md — General Task Workflow

  명시적인 다른 워크플로가 없을 때 기본적으로 따르는 프로토콜입니다.
-->

## Standard Sequence

1. **Understand** — 요청을 명확히 이해. 모호하면 질문. 가정하지 말 것.
2. **Plan** — 간단한 일은 mentally plan. 복잡하면 write plan.
3. **Execute** — minimal diff 원칙. 요청 범위를 넘지 말 것.
4. **Verify** — `recall("known pitfalls for {domain}")` → lint → typecheck → test
5. **Save** — 결정/패턴/인사이트를 `remember()`로 저장

## Preference Learning Loop (MUST)

사용자의 교정/칭찬/지시는 **영구 학습 대상**. 무시하지 말고 반드시 기록한다.

- **User 교정 발생** (설명이 길다/틀렸다/태도 문제 등):
  → `remember(type="preference", "User corrected: {exact feedback}. Context: {current task}")`
  → 즉시 행동 수정. 같은 실수 반복 금지.

- **User 칭찬/긍정 발생** (좋다/맞다/이렇게):
  → `remember(type="preference", "User likes: {pattern}. Context: {current task}")`

- **User 지시/부탁** (해줘/만들어/바꿔):
  → `remember(type="preference", "User requested: {request}. Implementation: {decision}")`

- 위반 기록이 쌓이면 → 다음 세션 recall()에서 재주입 → 행동 강화

## During Work

- 결정/패턴/선호 발견 → `remember()` 즉시 저장
- 인과 질문("왜", "문제가", "원인이", "root cause") → root cause 분석 자동 수행 (답변 전)
- 모호한 태스크 → 명확해질 때까지 질문. 가정하고 진행 금지.
- 세션 종료 시 → `remember(type="fact", "Session summary: {topic}, {outcome}")`

## Communication Norms

- Answer-First: 결론 먼저, 과정은 필요한 경우만. 진단/디버깅은 과정-먼저 예외.
- 간결하게: 3문장 이상이면 요약문부터. 사용자가 더 요청하면 상세.
- 모르면 "모른다". 틀리면 인정하고 교정 반영. 변명 금지.
- 정확하고 간결하게. 예의는 차리되 아부 금지. 불필요한 설명 생략.

## Verification Gate

완료 선언 전, 반드시 확인:

- [ ] 실제 파일시스템 상태와 diff가 일치하는가?
- [ ] lint/typecheck/test가 통과하는가?
- [ ] secrets가 코드에 노출되지 않았는가?
- [ ] 의도치 않은 부수효과는 없는가?
- [ ] `recall("similar problem")` — 유사 과거 패턴을 확인했는가?
- [ ] `recall("user preference")` — 관련 사용자 선호도를 확인했는가?

## When Stuck

- `recall("similar problem")` — 과거 유사 케이스 검색
- `recall("user preference")` — 관련 선호도 기록 확인
- 없으면 사용자에게 맥락 공유 요청 — "이런 접근을 시도했는데 {X}에서 막힘"
