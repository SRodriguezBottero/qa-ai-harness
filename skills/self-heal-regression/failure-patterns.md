# Failure patterns (starter set)

Extend this table with what your suite actually learns. Do not publish customer-specific bug ids here.

| Bucket | Signal | Standard fix |
| --- | --- | --- |
| selector-drift | locator not found / strict-mode | Rebuild from a live snapshot: role → label → text → testId → CSS |
| timeout-loading | timeout on navigation/load | Wait on a stable UI role; if the app never settles, it is a blocker |
| hardcoded-data | assertion on a business value the env does not guarantee | Seed data or assert structure, not live names/amounts |
| network-assertion | brittle GraphQL/REST match | Assert the user-visible outcome; match only stable operation fields |
| rbac-gating | permission-gated node asserted unconditionally | Split base vs RBAC specs or gate on the auth profile |
| blocker | app/environment is wrong | Never mask. File a product bug. |
| flaky | passed on retry | Stabilize isolation/waits. Do not treat as a functional fix. |
