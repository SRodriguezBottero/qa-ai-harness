import { NextResponse } from "next/server";
import { loadHarnessConfig } from "@/lib/harness/load-config";
import { scaffoldFromTicket, type ScaffoldMode } from "@/lib/scaffold/from-ticket";

export async function POST(request: Request) {
  const config = loadHarnessConfig();
  const body = (await request.json()) as {
    id?: string;
    title?: string;
    body?: string;
    mode?: ScaffoldMode;
  };
  if (!body.title?.trim() || !body.body?.trim()) {
    return NextResponse.json({ error: "title and body are required" }, { status: 400 });
  }
  const result = scaffoldFromTicket({
    id: body.id,
    title: body.title,
    body: body.body,
    mode: body.mode,
  });
  return NextResponse.json({
    platform: config.platforms[0],
    issueTracker: config.issueTracker.type,
    ...result,
  });
}
