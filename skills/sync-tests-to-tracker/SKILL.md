---
name: sync-tests-to-tracker
description: Create one test-case ticket per new Playwright test, link it to the parent ticket, place it in the test-management folder taxonomy, and write the id back into the spec. Never delete existing tickets.
---

# Sync tests to tracker

## 0. Config

1. Load `harness.config.json`.
2. Open `references/test-mgmt-{{config.testManagement.type}}.md`.
3. Open the issue-tracker adapter used by scaffold (`issueTracker.type`).

## 1. Discover new tests

Scan `config.platforms[].testDir` for specs added or changed. Each `test('…')` is one case. Title must start with `Verify that`.

## 2. Create, never destroy

For each test without an existing tracker id:

1. Create a test-case ticket titled exactly as the test.
2. Link it to the parent requirement ticket.
3. Place it using the test-management adapter (or skip placement if type is `none`).
4. Write the new id into the spec (comment or `test.info().annotations`).

Do **not** delete, close, or move tickets that already exist. Co-locate only variants of the same subject (base + RBAC), not tests that merely share a file.

## 3. Idempotency

If a test title already maps to a ticket, skip it and report it under `skipped`.
