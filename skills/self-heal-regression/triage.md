# Triage

Input: normalized CI failures.

For each failure:

1. Heuristic bucket from `failure-patterns.md`.
2. If Jev is enabled, ask in one request:
   - Choice `bucket` over the seven starter buckets
   - Noul `flaky`
   - Noul `blocker`
   - Noul `urgent` (should this hit the issue tracker now?)
3. Decision in **code**, not in a prompt:
   - `blocker` or noul blocker ≥ 0.75 → do not patch the test
   - `flaky` or noul flaky ≥ 0.7 → stabilize, do not “fix” as a regression
   - choice confidence < `jev.triageConfidenceFloor` → human review
   - else apply the standard fix for that bucket

Always keep the raw noul/choice payload next to the decision so a human can override.
