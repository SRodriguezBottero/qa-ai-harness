import { NextResponse } from "next/server";
import { loadHarnessConfig } from "@/lib/harness/load-config";
import { syncSpecsToTracker } from "@/lib/sync/from-specs";

export async function POST(request: Request) {
  const config = loadHarnessConfig();
  const body = (await request.json()) as {
    parent?: string;
    specs?: { file: string; titles: string[] }[];
  };
  if (!body.specs?.length) {
    return NextResponse.json({ error: "specs are required" }, { status: 400 });
  }
  const result = syncSpecsToTracker({
    parent: body.parent,
    folder: "Mesa / Web / Inbox",
    specs: body.specs,
  });
  return NextResponse.json({
    testManagement: config.testManagement.type,
    issueTracker: config.issueTracker.type,
    ...result,
  });
}
