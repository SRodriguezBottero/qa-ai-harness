# Jira adapter

MCP: Atlassian / Jira.

Return `{ title, type, acceptanceCriteria[] }`.

- Read `cloudId` from `harness.config.json` (`issueTracker.cloudId`). Never bake a cloud id into this file.
- Custom fields live in `{{config.issueTracker.fieldMapping}}`.
- `type` is the issue type name (Story, Bug, Task).
- Acceptance criteria: the custom field mapped as `acceptanceCriteria`, falling back to a body section with that heading.

Abstract calls the generic skill expects:

1. `getIssue(key)` → raw issue
2. `mapIssue(raw)` → `{ title, type, acceptanceCriteria[] }`
