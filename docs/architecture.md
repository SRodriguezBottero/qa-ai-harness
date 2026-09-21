# Architecture

See the original design in the conversation that spawned this repo: workflow vs adapter, three pipelines (scaffold, sync, self-heal), and Jev as a decision layer.

Shipped in this slice:

- Generic skills + adapter stubs
- `harness.config.json` as the only place for team-specific values
- Mesa sample app + Playwright page objects
- Jev HTTP client with mock fallback
- A console so the pipelines are runnable without wiring Jira
