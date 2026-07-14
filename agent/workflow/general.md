<!--
  .agent/workflow/general.md — General Task Workflow

  명시적인 다른 워크플로가 없을 때 기본적으로 따르는 프로토콜입니다.
-->

## Standard Sequence

1. **Understand** — 요청을 명확히 이해. 모호하면 질문.
2. **Plan** — 간단한 일은 mentally plan. 복잡하면 write plan.
3. **Execute** — minimal diff 원칙. 요청 범위를 넘지 말 것.
4. **Verify** — `recall("known pitfalls for {domain}")` → lint → typecheck → test
5. **Save** — 결정/패턴/인사이트를 `remember()`로 저장

## Verification Gate

완료 선언 전, 반드시 확인:

- [ ] 실제 파일시스템 상태와 diff가 일치하는가?
- [ ] lint/typecheck/test가 통과하는가?
- [ ] secrets가 코드에 노출되지 않았는가?
- [ ] 의도치 않은 부수효과는 없는가?
- [ ] `recall()`로 유사 과거 패턴을 확인했는가?

## When Stuck

- `recall("similar problem")` — 과거 유사 케이스 검색
- 없으면 사용자에게 맥락 공유 요청 — "이런 접근을 시도했는데 {X}에서 막힘"
