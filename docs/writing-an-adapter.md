# Writing an adapter

An adapter is a markdown file plus, optionally, TypeScript that satisfies a contract. The generic `SKILL.md` never names a vendor.

## Issue tracker

File: `skills/scaffold-tests-from-ticket/references/issue-tracker-<type>.md`  
Register `<type>` on `issueTracker.type`.

Must document how to return `{ title, type, acceptanceCriteria[] }`.

## Test management

File: `skills/sync-tests-to-tracker/references/test-mgmt-<type>.md`  
Must document create/place. `none` is a valid adapter.

## CI source

File: `skills/self-heal-regression/references/ci-source-<type>.md`  
Must normalize to `{ id, title, file, error, retries }[]`.

## Rules

- No cloud ids, project ids, or folder taxonomies in the adapter markdown.
- Those values belong in `harness.config.json` or `config/*.json`.
- Keep MCP/API function names here so the skill can call them abstractly.
