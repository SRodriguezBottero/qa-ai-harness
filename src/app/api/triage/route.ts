import { NextResponse } from "next/server";
import { loadHarnessConfig } from "@/lib/harness/load-config";
import { triageFailures, type FailureRecord } from "@/lib/jev/triage";
import { flattenPlaywrightJson, SAMPLE_PLAYWRIGHT_REPORT } from "@/lib/self-heal/sample-report";

export async function POST(request: Request) {
  const config = loadHarnessConfig();
  const body = (await request.json().catch(() => ({}))) as { failures?: FailureRecord[] };
  const failures =
    body.failures && body.failures.length > 0
      ? body.failures
      : flattenPlaywrightJson(SAMPLE_PLAYWRIGHT_REPORT);
  const result = await triageFailures(failures, config);
  return NextResponse.json({
    ciSource: config.ciSource.type,
    jevEnabled: config.jev.enabled,
    ...result,
  });
}
