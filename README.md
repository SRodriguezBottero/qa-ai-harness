# QA AI Harness

A generic AI-assisted QA harness for teams that already use Playwright. It separates **workflow** (publishable skills) from **adapter** (Jira, Linear, GitHub Issues, CI, test-case manager).

Cursor generates and repairs specs. Playwright runs them. **Jev** (TypeSafe System One) makes cheap decisions: a guardrail before a risky action, triage after a fail. Without `TYPESAFE_API_KEY` those decisions run a local mock.

## What this slice includes

- Skills: `scaffold-tests-from-ticket`, `sync-tests-to-tracker`, `self-heal-regression`, `jev-decisions`
- `harness.config.json` + documented adapters
- A Next.js console to run the three pipelines
- **Mesa**, a minimal support inbox as the app under test
- Page objects and a sample Playwright spec

## How to run it

```bash
npm install
npx playwright install chromium
npm run dev
```

The console is at [http://127.0.0.1:4477](http://127.0.0.1:4477).

Mesa profile: `qa@mesa.test` / `mesa-qa`.

```bash
npm test
```

Live Jev (optional):

```bash
cp .env.example .env.local
# TYPESAFE_API_KEY=...
```

## Config

Copy `harness.config.example.json`. Skills read `issueTracker.type`, `testManagement.type`, `ciSource.type` and load a single file under `references/`. How to add a provider: `docs/writing-an-adapter.md`.

## Selector hierarchy

`role` → `label` → `text` → `testId` → `CSS`. Specs do not carry inline selectors.
