# Getting started

1. Copy `harness.config.example.json` to `harness.config.json`.
2. Point `platforms[].testDir` and `pageObjectDir` at your Playwright tree.
3. Set `issueTracker.type` to `jira`, `linear`, or `github-issues`.
4. Set `testManagement.type` to `none` unless you have Tricentis, TestRail, or Xray.
5. Set `ciSource.type` to `playwright-json` until you wire Currents or GitHub Actions.
6. Optional: `TYPESAFE_API_KEY` for live Jev. Without it, guardrail and triage use the mock.

## Run this repo

```bash
npm install
npm run dev
```

Open the console (default `http://127.0.0.1:4477`):

- `/` overview
- `/scaffold` ticket → spec + matrix
- `/sync` spec → test-case tickets
- `/self-heal` CI → fix units
- `/guardrail` and `/triage` for Jev
- `/mesa/login` sample app under test (`qa@mesa.test` / `mesa-qa`)

```bash
npx playwright install chromium
npm test
```

## Agent install

Point Cursor (or any agent) at `skills/*/SKILL.md`. Always load `harness.config.json` before an adapter reference. Do not load every `references/` file at once.
