import { groupFixes } from "./fix-group";
import { matchFailureBucket } from "./patterns";

export const SAMPLE_PLAYWRIGHT_REPORT = {
  suites: [
    {
      title: "_tests/web/login.spec.ts",
      specs: [
        {
          title: "Verify that the QA profile can open Inbox",
          ok: false,
          tests: [
            {
              results: [
                {
                  status: "timedOut",
                  error: { message: "Timeout 10000ms exceeded. waiting for getByRole('heading', { name: 'Inbox' })" },
                  retry: 0,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "_tests/web/resolve-ticket.spec.ts",
      specs: [
        {
          title: "Verify that a ticket can be marked resolved",
          ok: false,
          tests: [
            {
              results: [
                {
                  status: "failed",
                  error: {
                    message:
                      "strict mode violation: getByRole('button', { name: 'Save' }) resolved to 2 elements",
                  },
                  retry: 0,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "_tests/web/filter.spec.ts",
      specs: [
        {
          title: "Verify that status filter hides resolved tickets",
          ok: false,
          tests: [
            {
              results: [
                {
                  status: "failed",
                  error: { message: "Expected 'Pending' received 'pending' — passed on retry" },
                  retry: 1,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "_tests/web/payouts.spec.ts",
      specs: [
        {
          title: "Verify payouts board loads",
          ok: false,
          tests: [
            {
              results: [
                {
                  status: "failed",
                  error: { message: "Application error 500 from /api/payouts — not a test bug" },
                  retry: 0,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export function flattenPlaywrightJson(report: typeof SAMPLE_PLAYWRIGHT_REPORT) {
  const failures: { id: string; title: string; file: string; error: string; retries: number }[] = [];
  for (const suite of report.suites) {
    for (const spec of suite.specs) {
      if (spec.ok) continue;
      const result = spec.tests[0]?.results.at(-1);
      if (!result) continue;
      failures.push({
        id: `${suite.title}::${spec.title}`,
        title: spec.title,
        file: suite.title,
        error: result.error.message,
        retries: result.retry,
      });
    }
  }
  return failures.map((failure) => ({
    ...failure,
    bucket: matchFailureBucket(failure.error, failure.retries),
  }));
}

export function planSelfHeal(report = SAMPLE_PLAYWRIGHT_REPORT) {
  const failures = flattenPlaywrightJson(report);
  const grouped = groupFixes(failures);
  return { failures, ...grouped };
}
