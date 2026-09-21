# Playwright JSON reporter

Expected file: `playwright-report/results.json` from the json reporter configured in `playwright.config.ts`.

Walk `suites[].specs[]`. A spec with `ok: false` is a failure. `retries` is the last result's `retry` field. `error` is `results[-1].error.message`.

This is the default `ciSource` for the Mesa sample app.
