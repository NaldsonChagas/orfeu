# Skill: confluence-sync

**When to load:** Feature delivered, architectural change, or any task mentioning `atlassian.net/wiki`, ADR, ORFEU, rules, architecture, or internal documentation. In plan or implementation stages

**What it does:** Routes Confluence queries through MCP (never webfetch), reads pages by ID or search, and documents delivered features.

## Critical Rules

### Routing

- **NEVER** use `webfetch` for any URL pointing to `atlassian.net/wiki` — it will fail due to login wall.
- **ALWAYS** use `atlassian_confluence_*` tools via MCP.

### Reading Protocol

1. **If a Confluence link is provided:** Extract `page_id` from the URL → call `atlassian_confluence_get_page` with that ID.
2. **If no link, but a known document title:** Call `atlassian_confluence_search` for the title in the `ORFEU` space → use returned `page_id` to fetch the page.

### Writing Protocol

- Only update Confluence documentation after a feature is fully implemented, tested, and delivered. Never during development.

## Document Hierarchy (Query Priority)

When consulting docs for a task, follow this order:

1. ADRs (Architecture Decision Records)
2. Project Rules
3. Module-specific documentation (3.1, 3.2, 3.3)

### Task-Specific Mapping

| Task Type | Docs to Consult |
|---|---|
| Backend / New Module | ADR-001, 2.2 Module Structure, Rules Backend |
| Frontend / Component | 5.1 Prototype Breakdown, 5.2 Allowed Modifications |
| Streaming | ADR-005 |
| Cache | ADR-006, 4.2 Cache Strategy |
| Planning | 6.1 Milestones, 6.3 Definition of Done |

## Confluence Space

- **Name:** ORFEU
- **URL:** https://naldsonbc-orfeu.atlassian.net/wiki/spaces/ORFEU