# Skill: backend-standards

**When to load:** New endpoint or service created.

**What it does:** Checks DTOs, controllers, errors, logger.

## Rules checked

- `unit-tests-for-business-rules` — tests for business rules
- `no-business-logic-in-controller` — logic in services/domain
- `dto-validation` — validation with explicit schemas
- `error-handling-standard` — exceptions with standard class
- `no-raw-sql` — ORM/query builder required
- `no-console-log` — structured project logger
- `api-versioning` — versioned endpoints (/api/v1/)