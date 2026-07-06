import { NextResponse } from "next/server";

export function jsonOk(data: Record<string, unknown> = {}) {
  return NextResponse.json({ ok: true, ...data });
}

export function jsonError(message: string, status: number) {
  return NextResponse.json({ ok: false, message }, { status });
}

export function noContent() {
  return new NextResponse(null, { status: 204 });
}
