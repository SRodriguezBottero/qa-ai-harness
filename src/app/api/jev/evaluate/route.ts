import { NextResponse } from "next/server";
import { loadHarnessConfig } from "@/lib/harness/load-config";
import { evaluateWithJev, type JevQuestion } from "@/lib/jev/client";

export async function POST(request: Request) {
  const config = loadHarnessConfig();
  const body = (await request.json()) as {
    state: unknown;
    questions: Record<string, JevQuestion>;
  };
  if (!body?.questions || typeof body.questions !== "object") {
    return NextResponse.json({ error: "questions is required" }, { status: 400 });
  }
  try {
    const result = await evaluateWithJev(
      { state: body.state ?? "", questions: body.questions },
      {
        apiKey: process.env.TYPESAFE_API_KEY,
        apiUrl: process.env.TYPESAFE_API_URL,
        mode: config.jev.mode,
        model: config.jev.model,
      },
    );
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Jev call failed" },
      { status: 502 },
    );
  }
}
