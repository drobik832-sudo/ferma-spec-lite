import { NextResponse } from "next/server";
import { safeTokenEqual } from "../../../lib/admin/auth";

export async function POST(req: Request) {
  const adminToken = process.env.ADMIN_TOKEN || "";
  if (!adminToken) {
    return NextResponse.json({ ok: false, message: "ADMIN_TOKEN missing" }, { status: 500 });
  }
  const payload = await req.json().catch(() => ({}));
  const token = typeof payload?.token === "string" ? payload.token : "";
  if (!token || !safeTokenEqual(token, adminToken)) {
    return NextResponse.json({ ok: false, message: "unauthorized" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("ferma_admin", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });
  return res;
}

