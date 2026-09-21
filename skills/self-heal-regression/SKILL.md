---
name: self-heal-regression
description: Classify Playwright CI failures, refuse to mask product blockers, group file-disjoint fixes, verify in a real browser, and persist new failure patterns.
---

# Self-heal regression

## 0. Config

1. Load `harness.config.json`.
2. Open `references/ci-source-{{config.ciSource.type}}.md` (playwright-json uses `ci-source-playwright-json-reporter.md`).
3. Read `failure-patterns.md`, `triage.md`, `fix-group.md`.
4. If `jev.enabled`, also read `skills/jev-decisions/SKILL.md` and run triage through Jev instead of a full LLM.

## 1. Ingest CI

Normalize to `{ id, title, file, error, retries }[]`. Split **hard fails** vs **flaky** (retries > 0 or passed on retry) into two lanes.

## 2. Classify

Assign a bucket from `failure-patterns.md`. If Jev is on, ask a Choice over those buckets plus Noul `flaky` / `blocker`. If confidence < `jev.triageConfidenceFloor`, action = `review`.

## 3. Blockers are sacred

If the bucket is `blocker` (app/environment), **do not change the test to make it pass**. File or update a product bug and stop that unit.

## 4. Fix groups

Follow `fix-group.md`: one unit = set of files with no overlap, so units can run in parallel.

## 5. Live verify

A diff is not enough. Re-run the affected spec against a real browser (Playwright MCP or `npx playwright test <file>`). Only then persist:

- new rows in `failure-patterns.md` (generic, no customer names)
- a short log of what changed

Extend the pattern table with what this team learns. Keep precedents out of the public package.
