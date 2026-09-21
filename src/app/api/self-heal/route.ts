import { NextResponse } from "next/server";
import { loadHarnessConfig } from "@/lib/harness/load-config";
import { planSelfHeal } from "@/lib/self-heal/sample-report";

export async function POST() {
  const config = loadHarnessConfig();
  return NextResponse.json({
    ciSource: config.ciSource.type,
    liveVerifyRequired: true,
    maskBlocker: false,
    ...planSelfHeal(),
  });
}
