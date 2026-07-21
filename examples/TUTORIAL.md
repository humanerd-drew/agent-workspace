# Tutorial: Writing Your .agent/ Files

## 1. Start with a template

```bash
curl -fsSL https://raw.githubusercontent.com/humanerd-drew/agent-workspace/main/init.sh | bash
```

This creates the standard `.agent/` structure. Now make it yours.

## 2. Define identity.md

Think of `identity.md` as your agent's personality. It answers: *Who is this agent? How should it behave?*

**Start with role and domain:**

```markdown
## Role

- **Name**: my-ai-coder
- **Role**: full-stack development agent
- **Primary domain**: TypeScript / Next.js / Postgres
```

**Then define communication style:**

```markdown
## Voice

- **Answer-first**: Give the conclusion, then details if asked
- **Tone**: Direct, no jargon unless necessary
- **Language**: Korean (technical terms in English)
```

**Finally, add behavioral guardrails:**

```markdown
## Behavioral Constraints

- Never modify package.json without asking
- Always check for existing tests before writing new ones
```

See `examples/` for role-specific templates:
- `identity-frontend-dev.md` — React/TypeScript focused
- `identity-data-scientist.md` — ML/statistics focused
- `identity-devops.md` — SRE/Cloudflare focused

## 3. Define rules.md

Rules are **non-negotiable**. These run every session, every task.

**Layer 0 (always on):**

```markdown
1. Never read or expose secret/credential files
2. Never commit without review
3. Verify all changes: lint → typecheck → test
```

**Must (always do):**

```markdown
1. Read files before modifying them
2. Save every decision with remember()
3. Ask when uncertain
```

**Must Not (never do):**

```markdown
1. rm -rf / or destructive bulk ops without confirmation
2. Hardcode API keys or tokens
3. Add dependencies without reason
```

## 4. Define workflow

`workflow/init.md` — what happens at session start:

```markdown
1. recall("recent context") — restore last session
2. recall("user preference") — check corrections history
3. read .agent/identity.md + rules.md
4. remember(type="fact", "Session started: {date}")
```

`workflow/general.md` — default task flow:

```markdown
1. Understand → 2. Plan → 3. Execute → 4. Verify → 5. Save
```

## 5. Connect memory

```bash
curl -fsSL https://raw.githubusercontent.com/humanerd-drew/agent-workspace/main/init.sh | bash -s -- --install
```

This sets up the memory MCP server. Your agent can now:

- `remember("user prefers tabs over spaces", "preference")`
- `recall("user preference")` — at every session start
- `recall("similar problem")` — when stuck

## Scenario Examples

### Scenario A: First session with a new project

1. Run `init.sh`
2. Edit `identity.md`: set your name, role, domain
3. Add one custom rule to `rules.md`
4. Start working — the agent already knows your baseline preferences

### Scenario B: Switching from Cursor to opencode

1. `git clone` your project in the new tool
2. `.agent/` is already there
3. Add `@agents.md` to the new tool's config file
4. Done — the agent reads `identity.md` and `rules.md` as if nothing changed

### Scenario C: Team onboarding

1. Commit `.agent/` to the team repo
2. Every developer runs `init.sh` once for local memory setup
3. Shared rules (e.g., "never commit secrets", "always add tests") are enforced for everyone
4. Each developer can override `identity.md` locally without affecting teammates
