// app/api/process/route.ts
import { NextRequest, NextResponse } from "next/server";

type ProcessBody = Record<string, unknown>;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ProcessBody;

    const base = (process.env.BACKEND_BASE || "http://localhost:8000").replace(/\/$/, "");

    const r = await fetch(`${base}/api/process`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    let data: unknown = {};
    try {
      data = await r.json();
    } catch {
      // keep data as {}
    }

    return NextResponse.json(data, { status: r.status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Proxy error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
