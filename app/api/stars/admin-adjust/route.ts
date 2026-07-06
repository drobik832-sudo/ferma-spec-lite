import { NextResponse } from "next/server";
import { jsonError } from "../../../lib/api/responses";
import { adjustStars } from "../../../lib/stars/adjustStars";

const adminToken = process.env.ADMIN_TOKEN || "";

export async function POST(req: Request) {
  if (!adminToken) {
    return jsonError("ADMIN_TOKEN missing", 500);
  }
  const headerToken = req.headers.get("x-admin-token") || "";
  if (headerToken !== adminToken) {
    return jsonError("unauthorized", 401);
  }

  const payload = await req.json().catch(() => ({}));
  const telegramId = Number(payload?.telegramId || 0);
  const delta = Number(payload?.delta || 0);
  if (!Number.isFinite(telegramId) || telegramId <= 0) {
    return jsonError("invalid telegramId", 400);
  }
  if (!Number.isFinite(delta) || delta === 0) {
    return jsonError("invalid delta", 400);
  }

  const result = await adjustStars({ telegramId, delta });
  if (result instanceof NextResponse) return result;

  return NextResponse.json({ ok: true, stars: result.stars });
}
