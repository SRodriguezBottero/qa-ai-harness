# Fix groups

A fix unit is a set of files that does not share any path with another unit. That is the only parallelism primitive.

Algorithm:

1. Drop blocker failures from the fix list.
2. Group remaining failures by `file`.
3. If two buckets hit the same file, keep them in one unit (same checkout).
4. Emit `{ files, failures, bucket, standardFix, maskBlocker: false }`.
5. After code changes, live-verify each unit before merging.

Never combine two units that share a page object **and** a spec if both will be edited — put them in the same unit instead.
