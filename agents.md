# Orfeu Project Agents and Skills

Lightweight index of agents and skills. Heavy content is loaded on demand via tool call.

## Token Economy Strategy

- AGENTS.md contains only a lightweight index with "when to use" each skill
- Heavy skill content is loaded via tool call only when relevant
- Verification agents use cheap models; implementation agents use heavy models
- Confluence queries via MCP replace LLM questions about business rules
- @review only at the end of a complete task, not per file

## File Structure

```
project/
├── AGENTS.md ← lightweight index + inline rules
├── .opencode/
│   └── agents/
│       ├── review.md ← code review + validate-rules
│       ├── test-guard.md ← test coverage
│       ├── confluence-doc.md ← consult and update docs
│       └── trello-sync.md ← card management
└── skills/
    ├── commit-lint/SKILL.md
    ├── unit-test-coverage/SKILL.md
    ├── validate-rules/SKILL.md
    ├── frontend-standards/SKILL.md
    ├── backend-standards/SKILL.md
    ├── trello-workflow/SKILL.md
    └── confluence-sync/SKILL.md
```

## Agents and Responsibilities

| Agent | Invocation | Model | Responsibility |
| --- | --- | --- | --- |
| `@review` | At the end of each task | gemini-flash-2.5 | Checks all rules, lists violations with file and line |
| `@test-guard` | After creating/editing service or domain | deepseek-chat | Generates unit tests for uncovered business rules |
| `@confluence-doc` | Before implementing something new or when delivering a feature | gemini-flash-2.5 | Queries or updates Confluence pages via MCP |
| `@trello-sync` | When starting and finishing a task | gemini-flash-2.5 | Moves cards, adds comments, links PRs via MCP |

## Skills and Triggers

| Skill | When to Load | What It Does |
| --- | --- | --- |
| `commit-lint` | When writing a commit message | Validates Conventional Commits format, suggests corrections |
| `validate-rules` | During PR review | Full checklist of all project rules |
| `unit-test-coverage` | New domain function created | Identifies untested rules, generates test cases |
| `frontend-standards` | New component created | Checks typescript, a11y, size, styles |
| `backend-standards` | New endpoint or service created | Checks DTOs, controllers, errors, logger |
| `trello-workflow` | Trello card mentioned | Card movement, comments, and PR linking patterns |
| `confluence-sync` | Feature delivered, architectural change, or any task mentioning Confluence/ADR/ORFEU/rules | Routes Confluence queries through MCP (never webfetch), reads pages by ID or search, and documents delivered features | In plan or implement stage

## Models per Agent (OpenRouter)

| Usage | Suggested Model | Reason |
| --- | --- | --- |
| Feature implementation | claude-sonnet-4-5 or deepseek-r1 | Maximum capability for code generation |
| Review and rule validation | gemini-flash-2.5 | Fast, cheap, excellent for checklists |
| Test generation | deepseek-chat | Very cheap, excellent at test code |
| Trello and Confluence (I/O) | gemini-flash-2.5 | Simple read and write tasks |
| Planning and architecture | deepseek-r1 | Great reasoning, medium cost |