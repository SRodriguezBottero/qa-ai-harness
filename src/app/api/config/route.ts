import { NextResponse } from "next/server";
import { adapterHint, loadHarnessConfig } from "@/lib/harness/load-config";

export async function GET() {
  const config = loadHarnessConfig();
  return NextResponse.json({ config, adapters: adapterHint(config) });
}
