import { NextResponse } from "next/server";
import { loadHarnessConfig } from "@/lib/harness/load-config";
import { evaluateGuardrail } from "@/lib/jev/guardrail";

export async function POST(request: Request) {
  const config = loadHarnessConfig();
  const body = (await request.json()) as {
    action?: string;
    target?: string;
    environment?: string;
    notes?: string;
  };
  if (!body.action?.trim()) {
    return NextResponse.json({ error: "action is required" }, { status: 400 });
  }
  const result = await evaluateGuardrail(
    {
      action: body.action,
      target: body.target,
      environment: body.environment,
      notes: body.notes,
    },
    config,
  );
  return NextResponse.json(result);
}
