# Agent @test-guard

**Purpose:** Generate unit tests for uncovered business rules.

**Invocation:** After creating or editing service/domain.

**Model:** deepseek-chat

## Behavior

1. Identify functions/methods in service/ or domain/ without corresponding tests
2. Load skill `unit-test-coverage`
3. Generate test cases following the project's pattern
4. Ensure minimum 80% coverage on business rules