# Skill: validate-rules

**When to load:** During PR review.

**What it does:** Full checklist of all project rules.

## Behavior

1. Load `opencode.json` with all rules
2. Check each rule against the code changed in the PR
3. List violations with file, line, and severity
4. Block merge if there are critical violations