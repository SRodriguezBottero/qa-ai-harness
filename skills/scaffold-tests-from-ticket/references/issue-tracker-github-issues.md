# GitHub Issues adapter

MCP: GitHub (`search_issues`, `issue_read`, `issue_write`).

Return `{ title, type, acceptanceCriteria[] }`.

- `title`: issue title
- `type`: `bug` if labels include bug, else `story`
- `acceptanceCriteria`: bullet lines under a heading matching the names in `config/issue-fields.json` (`acceptanceCriteria`), otherwise every markdown list item in the body

Field mapping file: `{{config.issueTracker.fieldMapping}}`.

Do not hardcode org/repo names. Read them from the consumer environment (`GITHUB_REPOSITORY` or the user).
