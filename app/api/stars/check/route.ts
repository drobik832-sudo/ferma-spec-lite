import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import { authenticateTelegram } from "../../../lib/api/withTelegramAuth";
import { getOrCreateUser } from "../../../lib/stars/getOrCreateUser";

export async function POST(req: Request) {
  const payload = await req.json().catch(() => ({}));
  const initData = typeof payload?.initData === "string" ? payload.initData : "";
  const amount = Number(payload?.amount || 0);

  if (!Number.isFinite(amount) || amount < 0) {
    return NextResponse.json({ ok: false, message: "invalid amount" }, { status: 400 });
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ ok: true, allowed: true, stars: null });
  }
  if (!initData) {
    return NextResponse.json({ ok: true, allowed: true, stars: null });
  }

  const auth = authenticateTelegram(initData);
  if (auth.error) return auth.error;

  const { telegramId, firstName, username } = auth.user;
  const result = await getOrCreateUser({ telegramId, firstName, username, source: "auto_check" });
  if (result instanceof NextResponse) return result;

  const { stars } = result;
  return NextResponse.json({ ok: true, allowed: stars >= amount, stars });
}
