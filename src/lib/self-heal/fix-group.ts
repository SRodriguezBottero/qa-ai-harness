import { matchFailureBucket, FAILURE_BUCKETS, type FailureBucket } from "./patterns";

export type FixUnit = {
  files: string[];
  failures: string[];
  bucket: FailureBucket;
  standardFix: string;
  maskBlocker: false;
};

export function groupFixes(
  failures: { id: string; file: string; error: string; retries?: number }[],
): { units: FixUnit[]; blockers: string[] } {
  const blockers: string[] = [];
  const byFile = new Map<string, FixUnit>();

  for (const failure of failures) {
    const bucket = matchFailureBucket(failure.error, failure.retries);
    if (bucket === "blocker") {
      blockers.push(failure.id);
      continue;
    }
    const current = byFile.get(failure.file);
    const standardFix = FAILURE_BUCKETS.find((b) => b.id === bucket)?.standardFix ?? "";
    if (!current) {
      byFile.set(failure.file, {
        files: [failure.file],
        failures: [failure.id],
        bucket,
        standardFix,
        maskBlocker: false,
      });
    } else {
      current.failures.push(failure.id);
    }
  }

  return { units: [...byFile.values()], blockers };
}
