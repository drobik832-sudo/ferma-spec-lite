import { NextResponse } from "next/server";
import { requireAdminWithSupabase } from "../../../../lib/api/withAdminAuth";
import { jsonError } from "../../../../lib/api/responses";
import { adjustStars } from "../../../../lib/stars/adjustStars";

export async function POST(req: Request) {
  const supabaseOrError = await requireAdminWithSupabase();
  if (supabaseOrError instanceof NextResponse) return supabaseOrError;

  const payload = await req.json().catch(() => ({}));
  const telegramId = Number(payload?.telegramId || 0);
  const delta = Number(payload?.delta || 0);
  const reason = typeof payload?.reason === "string" ? payload.reason : null;

  if (!Number.isFinite(telegramId) || telegramId <= 0) {
    return jsonError("invalid telegramId", 400);
  }
  if (!Number.isFinite(delta) || delta === 0) {
    return jsonError("invalid delta", 400);
  }

  const result = await adjustStars({ telegramId, delta, reason });
  if (result instanceof NextResponse) return result;

  return NextResponse.json({ ok: true, stars: result.stars });
}
