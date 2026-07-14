<!--
  .agent/workflow/init.md — Session Start Protocol (MUST)

  매 세션 시작 시 순서대로 실행. skip 금지.
  각 단계 완료 후 remember()로 실행 증명을 남긴다.
  → 다음 recall()에서 "이전 세션에 실행했는지" 검증 가능.
-->

## Session Start Protocol (MUST)

1. **Router classify** — domain classify (writing/engineering/research/devops/ui)
   → `remember(type="fact", "Protocol step 1: domain={domain}")`

2. **recall("recent context")** — restore last session's context
   → `remember(type="fact", "Protocol step 2: recall() executed")`

3. **recall("user preference")** — 사용자 선호도/교정 이력 확인
   → `remember(type="fact", "Protocol step 3: preference check done")`

4. **Unconditional reload**:
   - `read .agent/identity.md` — tone, voice, core directives
   - `read .agent/rules.md` — immutable rules
   → `remember(type="fact", "Protocol step 4: identity+rules reloaded")`

5. 세션 시작을 `remember(type="fact", "Session started: {date}, domain: {domain}")`로 기록

6. 사용자에게 상태 요약: 현재 컨텍스트 기준 필요한 행동 파악

## Daily Continuity

- 아침 첫 세션: 어제까지 작업 요약을 `recall("yesterday")`로 확인
- 동일 프로젝트 연속 세션: 직전 결정과 미해결 이슈 recall
- 새 프로젝트 시작: `.agent/identity.md` 재확인 (role)
