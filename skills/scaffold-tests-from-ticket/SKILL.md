---
name: scaffold-tests-from-ticket
description: Turn an issue-tracker ticket into Playwright specs with page objects, an adversarial/conformance split, and a coverage matrix. Use when a user pastes a ticket, asks to generate tests, or mentions acceptance criteria.
---

# Scaffold tests from a ticket

## 0. Read config first

1. Load `harness.config.json`.
2. Open only `references/issue-tracker-{{config.issueTracker.type}}.md`.
3. Use `config.platforms[]` for testDir, pageObjectDir, and auth profile. Do not invent extra platforms.

## 1. Resolve the ticket

Use the issue-tracker adapter. Required shape:

```
{ title, type, acceptanceCriteria[] }
```

If the adapter cannot fetch, ask for the ticket body. Never guess acceptance criteria from the title alone.

## 2. Read the real UI

Before writing locators:

1. Prefer a live Playwright snapshot of the running app (`config.platforms[].baseUrl`).
2. If the app is down, read page objects under `pageObjectDir` and existing specs under `testDir`.
3. Selector hierarchy: **role → label → text → testId → CSS**. No inline CSS in specs.

## 3. Split each AC into atomic clauses

One clause = one observable outcome. Tag each clause:

- `ui-firm` — the product must do this in the UI
- `ui-optional` — nice-to-have
- `non-ui` — email, batch jobs, backend-only
- `manual` — needs a human

Then classify implementation:

- covered by an existing page-object method → `PLAYWRIGHT`
- firm UI missing in the app → `DIVERGENCE` in adversarial mode, `NOT COVERED` in conformance
- optional missing → `NOT COVERED`
- non-ui / manual → `NON-UI` / `MANUAL-QA`

## 4. Generate specs

- One spec file per ticket (or per AC if the ticket is huge).
- Import page objects. Specs never contain raw selectors.
- Auth goes through the fixture named in `authProfilesFile` / `defaultProfile`.
- Adversarial default: a firm unimplemented clause becomes a failing assertion tagged `@divergence`.
- Conformance: skip the red test, keep the matrix row.

## 5. Traceability

Print a table: clause id, text, layer, note. Layers: `PLAYWRIGHT | DIVERGENCE | MANUAL-QA | NON-UI | NOT COVERED`.

The local playground (`/scaffold`) implements this pipeline against the Mesa sample app.
