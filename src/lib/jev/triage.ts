import type { HarnessConfig } from "@/lib/harness/types";
import { evaluateWithJev, type JevResponse } from "./client";
import { FAILURE_BUCKETS, matchFailureBucket, type FailureBucket } from "@/lib/self-heal/patterns";

export type FailureRecord = {
  id: string;
  title: string;
  error: string;
  retries?: number;
  file?: string;
};

export type TriageRow = {
  id: string;
  title: string;
  bucket: FailureBucket;
  action: "fix" | "stabilize-flaky" | "blocker" | "review";
  urgent: number;
  flaky: number;
  blocker: number;
  heuristic: FailureBucket;
};

export async function triageFailures(failures: FailureRecord[], config: HarnessConfig) {
  const rows: TriageRow[] = [];
  let lastJev: JevResponse | undefined;

  for (const failure of failures) {
    const heuristic = matchFailureBucket(failure.error, failure.retries ?? 0);
    const jev = await evaluateWithJev(
      {
        state: failure,
        questions: {
          bucket: {
            type: "choice",
            instructions: "Which root-cause bucket best describes this Playwright failure?",
            criteria: Object.fromEntries(
              FAILURE_BUCKETS.map((bucket) => [bucket.id, bucket.summary]),
            ),
          },
          flaky: {
            type: "noul",
            instructions: "Is this an intermittent / retry-pass flake rather than a hard fail?",
          },
          blocker: {
            type: "noul",
            instructions:
              "Is the root cause the application or environment, not the test? Never mask a blocker.",
          },
          urgent: {
            type: "noul",
            instructions: "Should this be reported to the issue tracker immediately?",
          },
        },
      },
      {
        apiKey: process.env.TYPESAFE_API_KEY,
        apiUrl: process.env.TYPESAFE_API_URL,
        mode: config.jev.mode,
        model: config.jev.model,
      },
    );
    lastJev = jev;
    const choice = jev.answers.bucket?.type === "choice" ? jev.answers.bucket.choice : heuristic;
    const bucket = (FAILURE_BUCKETS.some((b) => b.id === choice) ? choice : heuristic) as FailureBucket;
    const flaky = jev.answers.flaky?.type === "noul" ? jev.answers.flaky.noul : 0;
    const blocker = jev.answers.blocker?.type === "noul" ? jev.answers.blocker.noul : 0;
    const urgent = jev.answers.urgent?.type === "noul" ? jev.answers.urgent.noul : 0;
    const confidence =
      jev.answers.bucket?.type === "choice" ? jev.answers.bucket.confidence : 0.4;

    let action: TriageRow["action"] = "fix";
    if (bucket === "blocker" || blocker >= 0.75) action = "blocker";
    else if (bucket === "flaky" || flaky >= 0.7) action = "stabilize-flaky";
    else if (confidence < config.jev.triageConfidenceFloor) action = "review";

    rows.push({
      id: failure.id,
      title: failure.title,
      bucket,
      action,
      urgent,
      flaky,
      blocker,
      heuristic,
    });
  }

  return { rows, jev: lastJev };
}
