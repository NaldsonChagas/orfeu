# Skill: frontend-standards

**When to load:** New component created.

**What it does:** Checks TypeScript, a11y, size, styles.

## Rules checked

- `no-any-typescript` — no use of `any`
- `no-inline-styles` — styles via classes/Tailwind
- `component-size-limit` — max 200 lines
- `accessibility-a11y` — aria-label, alt, HTML semantics
- `no-hardcoded-strings` — text via i18n
- `state-management-pattern` — global state per project pattern
- `responsive-required` — works on 375px and 1280px+