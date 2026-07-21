# Changelog

## [0.1.0] — 2026-07-21

### Added
- `.agent/` workspace standard structure: `identity.md`, `rules.md`, `workflow/init.md`, `workflow/general.md`
- `init.sh` — standalone bash script for one-command `.agent/` initialization
- `agents.md` — AAIF-standard bridge file referencing `.agent/` directory
- CLAUDE.md auto-bridge for Claude Code compatibility
- `packages/memory` — MCP server for persistent SQLite-backed agent memory (remember/recall/forget/update/memory-stats)
- `packages/create` — CLI for `--install` mode (npx @agent-workspace/create)
- Bilingual README (EN + KO), workshop/community funnel

### Changed
- Cross-platform init.sh rewrite (macOS/Linux/Windows WSL)
- README rewritten for non-developer clarity with progressive depth
- Session start protocol (MUST-order init steps with `remember()` provenance)
- Preference learning loop integrated into workflow
- Layer 0 governance rules inherited from opencode-drewgent (6-month battle-tested)

### Fixed
- Template placeholder substitution (`{{NAME}}`) in identity.md generation
- Framework detection ordering (opencode > claude-code > cursor)
