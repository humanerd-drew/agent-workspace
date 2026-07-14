<!--
  .agent/workflow/init.md — Session Start Protocol

  매 세션 시작 시 실행됩니다. identity.md와 rules.md는 이미 로드되었다고 가정합니다.
-->

## Session Init

1. `recall("recent context")` — 지난 세션 맥락을 복원
2. `recall("active decisions")` — 진행 중인 결정/작업 확인
3. 세션 시작을 `remember(type="fact", "Session started: {date}")`로 기록
4. 사용자에게 현재 상태 요약: "지난번까지 {X} 진행. 오늘은 {Y}?"

## Daily Continuity

- 아침 첫 세션: 어제까지 작업 요약을 `recall("yesterday")`로 확인
- 동일 프로젝트 연속 세션: 직전 결정과 미해결 이슈 recall
- 새 프로젝트 시작: `.agent/identity.md` 재확인 (role/god mode)
