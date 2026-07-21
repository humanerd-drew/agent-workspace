#!/usr/bin/env bash
# Manual integration tests for init.sh
# Usage: bash tests/test_init.sh

set -euo pipefail
PASS=0
FAIL=0
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

pass() { PASS=$((PASS + 1)); echo "  PASS"; }
fail() { FAIL=$((FAIL + 1)); echo "  FAIL: $1"; }

echo "=== init.sh integration tests ==="

# Test 1: basic initialization
echo "Test 1: basic init --name TestAgent"
TMPDIR=$(mktemp -d)
bash "$SCRIPT_DIR/init.sh" --dir "$TMPDIR" --name "TestAgent" --yes
[ -f "$TMPDIR/.agent/identity.md" ] && [ -f "$TMPDIR/.agent/rules.md" ] && [ -f "$TMPDIR/.agent/workflow/init.md" ] && [ -f "$TMPDIR/.agent/workflow/general.md" ] && [ -f "$TMPDIR/agents.md" ] && pass || fail "files missing"
grep -q "TestAgent" "$TMPDIR/.agent/identity.md" && pass || fail "name not substituted"
rm -rf "$TMPDIR"

# Test 2: custom directory with --dir
echo "Test 2: --dir flag"
TMPDIR=$(mktemp -d)
bash "$SCRIPT_DIR/init.sh" --dir "$TMPDIR" --name "CustomDir" --yes
[ -f "$TMPDIR/.agent/identity.md" ] && pass || fail ".agent/ not created in custom dir"
rm -rf "$TMPDIR"

# Test 3: opencode.jsonc detection
echo "Test 3: opencode framework detection"
TMPDIR=$(mktemp -d)
touch "$TMPDIR/opencode.jsonc"
bash "$SCRIPT_DIR/init.sh" --dir "$TMPDIR" --name "OpenCodeTest" --yes
[ -f "$TMPDIR/.agent/identity.md" ] && pass || fail "opencode init failed"
rm -rf "$TMPDIR"

# Test 4: .gitignore update
echo "Test 4: .gitignore knowledge.db entry"
TMPDIR=$(mktemp -d)
touch "$TMPDIR/.gitignore"
bash "$SCRIPT_DIR/init.sh" --dir "$TMPDIR" --name "GitTest" --yes
grep -q "knowledge.db" "$TMPDIR/.gitignore" && pass || fail "knowledge.db not in .gitignore"
rm -rf "$TMPDIR"

echo ""
echo "=== Results: $PASS passed, $FAIL failed ==="
[ "$FAIL" -eq 0 ] || exit 1
