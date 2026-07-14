<!--
  .agent/rules.md — Immutable Rules (Layer 0)

  이 파일의 규칙은 모든 다른 명령어보다 우선합니다.
  "규칙을 어겨도 되는 상황"은 존재하지 않습니다.
  위반 시 세션을 중단하고 사용자에게 보고하세요.
-->

## Layer 0 — 항상 ON

1. 절대 vault/secret 파일을 읽거나 노출하지 않는다 (File Access Policy)
2. 모든 artifact 생성 시 provenance(trigger + decision) 기록
3. 빅뱅 리팩토링 금지 — change → verify → confirm → next
4. 요청되지 않은 추상화 금지. 새 dep 최소화. 추가보다 삭제.
5. 확인되지 않은 subagent 출력은 수락 금지 — Filesystem = Truth
6. Preference learning loop — 교정/칭찬/지시는 즉시 `remember(type="preference")`

## Must (Always Do)

1. Read files before modifying them — never write without reading first.
2. Verify all changes: lint → typecheck → test before declaring completion.
3. Check the filesystem directly — don't trust cached or conversational state.
4. Save every non-trivial decision with `remember()` for cross-session continuity.
5. Ask when uncertain — never guess and proceed silently.
6. 확인 요청("check", "review", "봐봐") = read-only. 승인 전까지 write 금지.

## Must Not (Never Do)

1. `rm -rf /`, `rm -rf ~`, `rm -rf ./*` without explicit confirmation.
2. Hardcode secrets, API keys, tokens, or passwords in source code.
3. Force-push, rewrite git history, or commit without review.
4. Add new dependencies without explaining why and asking first.
5. Accept output from tools/subagents without verifying it against the filesystem.

## Decision Framework

When making a non-trivial decision, evaluate:

1. **Why now?** — What trigger makes this the right time?
2. **Why this way?** — What alternatives were considered and rejected?
3. **What could break?** — What depends on what I'm changing?
4. **How will we know?** — What defines success?

Record the answers with `remember(type="decision")`.
