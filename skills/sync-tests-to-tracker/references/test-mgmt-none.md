# No external test-management tool

When `testManagement.type` is `none`:

- Still create one issue-tracker ticket per test.
- Skip folder taxonomy / qTest / TestRail / Xray calls.
- Folder string in reports can be `{{platform.name}} / web`.

The local playground (`/sync`) uses this adapter.
