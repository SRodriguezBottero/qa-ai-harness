# QA AI Harness

An AI-assisted QA harness for teams that already run **Playwright**. Cursor skills drive the workflows. Playwright runs the specs. **Jev** (TypeSafe System One) makes cheap, typed decisions: a guardrail before a risky action, triage after a fail.

It is not a new test runner and not a replacement for your tracker. Workflow stays generic in publishable skills. Team-specific pieces (Jira, Linear, GitHub Issues, TestRail, Tricentis, Xray, Currents, GitHub Actions) live in adapters plus `harness.config.json`.

Without `TYPESAFE_API_KEY`, Jev uses a local mock so the console still works.

## Who it is for

QA and automation engineers who write Playwright against a real product, keep cases in an issue tracker or test-management tool, and want an agent to:

- turn a ticket into specs without inventing acceptance criteria
- create one tracker case per test without deleting existing tickets
- classify CI failures without masking product bugs
- ask Jev allow / review / block before touching production or destroying data

If you do not use Playwright yet, this slice will not help you get there.

## What this repo includes

- Skills: `scaffold-tests-from-ticket`, `sync-tests-to-tracker`, `self-heal-regression`, `jev-decisions`
- `harness.config.json` plus documented adapters under `skills/*/references/`
- A Next.js console to run the pipelines without wiring a live tracker
- **Mesa**, a sample support inbox used as the app under test
- Page objects and a sample Playwright spec (`_tests/web/resolve-inbox-ticket.spec.ts`)

## The loops

### Scaffold — ticket → spec

Reads a ticket (`title`, `type`, `acceptanceCriteria[]`) from the issue-tracker adapter, or a pasted body in the console. Splits each criterion into atomic clauses, tags them (`ui-firm`, `ui-optional`, `non-ui`, `manual`), and generates a Playwright spec that imports page objects. Specs never carry inline CSS selectors.

Selector hierarchy: **role → label → text → testId → CSS**.

Default mode is **adversarial**: a firm UI clause that the app does not implement becomes a failing assertion tagged `@divergence`. **Conformance** skips the red test and still records the matrix row. Coverage layers: `PLAYWRIGHT | DIVERGENCE | MANUAL-QA | NON-UI | NOT COVERED`.

Console: `/scaffold`.

### Sync — spec → tracker

Each `test('…')` is one case. Titles start with `Verify that`. For tests without a tracker id, the skill creates a ticket, links it to the parent requirement, places it via the test-management adapter (or skips placement when `testManagement.type` is `none`), and writes the id back into the spec.

It never deletes, closes, or moves existing tickets. Duplicate titles are skipped.

Console: `/sync`.

### Self-heal — CI → fix or block

Ingests a CI report (this slice defaults to Playwright JSON). Splits **hard fails** from **flakes** (retries or passed-on-retry). Classifies against `failure-patterns.md`. If Jev is enabled, triage goes through Jev instead of a full LLM; below `jev.triageConfidenceFloor` the action is `review`.

A **blocker** (app or environment) is never patched to make the test green. File or update a product bug and stop that unit.

Fixes group by disjoint files so units can run in parallel. A diff is not enough: re-run the affected spec in a real browser before persisting a pattern.

Console: `/self-heal`.

### Jev — guardrail + triage

Jev is not a chat model. You send `state` plus typed questions (`noul`, `choice`, `score`) and get probabilities.

- **Guardrail** (before a tool call): is the action destructive? production-bound? Decision: `allow | review | block`. If either noul score is at or above `guardrailThreshold`, `allow` promotes to `review` and `review` to `block`. Low confidence cannot stay `allow`.
- **Triage** (after CI): one request per failure, composed in TypeScript (`src/lib/jev`).

`jev.mode`: `auto` (live API if a key exists, otherwise mock), `mock`, or `live`.

Console: `/guardrail` and `/triage`.

## How to run

```bash
npm install
npx playwright install chromium
npm run dev
```

Console: [http://127.0.0.1:4477](http://127.0.0.1:4477)

| Route | Purpose |
| --- | --- |
| `/` | Overview |
| `/scaffold` | Ticket → spec + coverage matrix |
| `/sync` | Spec → test-case tickets |
| `/self-heal` | CI → fix units |
| `/guardrail` | Jev before a risky action |
| `/triage` | Jev after a fail |
| `/mesa/login` | Sample app under test |

Mesa QA login: `qa@mesa.test` / `mesa-qa`.

```bash
npm test
```

Optional live Jev (never commit the key):

```bash
cp .env.example .env.local
# set TYPESAFE_API_KEY in .env.local
```

## Config

Copy `harness.config.example.json` to `harness.config.json` for a new checkout. This repo already has a Mesa-oriented config.

Skills always load `harness.config.json` first, then a **single** adapter file:

- `issueTracker.type`: `jira` | `linear` | `github-issues`
- `testManagement.type`: `none` | `testrail` | `tricentis` | `xray`
- `ciSource.type`: `playwright-json` | `github-actions` | `currents`

How to add a provider: `docs/writing-an-adapter.md`. Getting started: `docs/getting-started.md`.

Point Cursor (or another agent) at `skills/*/SKILL.md`. Do not load every `references/` file at once. Do not put vendor ids in the skill files; those belong in config.

## Mesa

Mesa is a **sample** support inbox (login, ticket list, ticket detail, resolve). It exists so Playwright and the console have a stable UI. It is not a customer product. Seed tickets include `MESA-104` (used by the sample spec).
