# Agent @trello-sync

**Purpose:** Move cards, add comments, and link PRs via MCP.

**Invocation:** When starting and finishing a task.

**Model:** gemini-flash-2.5

## Behavior

1. On task start: move card to "In Progress", add comment with branch name
2. On task completion: move card to "Review", add PR link in comment
3. Load skill `trello-workflow` for detailed patterns