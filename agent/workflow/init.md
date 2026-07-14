<!--
  .agent/workflow/init.md — Session Start Protocol (MUST)

  매 세션 시작 시 순서대로 실행. skip 금지.
  각 단계 완료 후 remember()로 실행 증명을 남긴다.
  → 다음 recall()에서 "이전 세션에 실행했는지" 검증 가능.
-->

## Session Start Protocol (MUST)

1. `recall("recent context")` — 지난 세션 맥락 복원
   → `remember(type="fact", "Protocol step 1: recall() executed")`

2. `recall("user preference")` — 사용자 선호도/교정 이력 확인
   → `remember(type="fact", "Protocol step 2: preference check done")`

3. `recall("active decisions")` — 진행 중인 결정/작업 확인
   → `remember(type="fact", "Protocol step 3: active decisions loaded")`

4. **Unconditional reload**: `read .agent/identity.md` + `read .agent/rules.md`
   → `remember(type="fact", "Protocol step 4: identity+rules reloaded")`

5. 세션 시작을 `remember(type="fact", "Session started: {date}, domain: {domain}")`로 기록

6. 사용자에게 현재 상태 요약: "지난번까지 {X} 진행. 오늘은 {Y}?"

## Daily Continuity

- 아침 첫 세션: 어제까지 작업 요약을 `recall("yesterday")`로 확인
- 동일 프로젝트 연속 세션: 직전 결정과 미해결 이슈 recall
- 새 프로젝트 시작: `.agent/identity.md` 재확인 (role/god mode)
