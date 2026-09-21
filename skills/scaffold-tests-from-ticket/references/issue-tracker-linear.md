# Linear adapter

MCP: Linear (or GraphQL API).

Return `{ title, type, acceptanceCriteria[] }`.

- `title`: issue title
- `type`: `bug` if the team marks it as bug, else `story`
- `acceptanceCriteria`: checklist items in the description

Team ids and API keys belong in the consumer env, not in this adapter.
