# Diffusion post — QA AI Harness

English copy for LinkedIn / X. Same story as the README. No client names, no API keys.

## Short (X / reply / comment)

Playwright teams do not need another runner. They need loops that do not invent tests or hide bugs.

QA AI Harness: Cursor skills + Playwright + Jev (TypeSafe).

- Scaffold: ticket → spec + coverage matrix (adversarial by default)
- Sync: one test = one tracker case. Never delete existing tickets
- Self-heal: classify CI fails; never patch a product blocker
- Jev: cheap typed decisions — guardrail before a risky action, triage after a fail

Mesa is the sample support inbox for live Playwright. Workflow in skills; Jira/Linear/GitHub/TestRail/etc. in adapters + config.

## LinkedIn / longer

Most “AI QA” demos generate a spec from a title and call it done. That is how you get tests no one owns, tickets that get deleted, and flakes that paper over real bugs.

QA AI Harness is a slice for teams that already use Playwright.

Cursor skills own the workflow. Playwright owns the run. Jev (TypeSafe System One) owns cheap decisions — not a chat, a typed allow / review / block.

Four loops:

1. **Scaffold.** Read the ticket (or paste acceptance criteria). Split each clause. Generate a spec that uses page objects, not inline CSS. Default is adversarial: if the product does not implement a firm UI requirement, the test fails on purpose (`@divergence`). You get a coverage matrix: Playwright, divergence, manual, non-UI, not covered.

2. **Sync.** One `test()` = one case. Create tracker tickets, link them to the parent, write the id back into the spec. Never delete, close, or move what already exists.

3. **Self-heal.** Ingest CI. Split hard fails from flakes. Group fixes by disjoint files. Re-run in a real browser before keeping a pattern. If it is a product or environment blocker, stop. Do not green the test.

4. **Jev guardrail + triage.** Before an agent clicks production or wipes data, ask: destructive? production? After a fail: regression, flake, or blocker? Without a TypeSafe key, a local mock still runs the playground.

The sample app under test is **Mesa**, a tiny support inbox. Your tracker, CI, and folder taxonomy stay in `harness.config.json` and adapters — not in the skill files.

If you already have Playwright and an agent in the loop, this is the harness that keeps the agent honest.
