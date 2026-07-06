import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import { authenticateTelegram } from "../../../lib/api/withTelegramAuth";
import { jsonError } from "../../../lib/api/responses";
import { recordTransaction } from "../../../lib/stars/recordTransaction";

export async function POST(req: Request) {
  const payload = await req.json().catch(() => ({}));
  const initData = typeof payload?.initData === "string" ? payload.initData : "";
  const amount = Number(payload?.amount || 0);

  if (!Number.isFinite(amount) || amount <= 0) {
    return jsonError("invalid amount", 400);
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ ok: true, stars: null });
  }
  if (!initData) {
    return NextResponse.json({ ok: true, stars: null });
  }

  const auth = authenticateTelegram(initData);
  if (auth.error) return auth.error;

  const { telegramId } = auth.user;

  const { data, error } = await supabaseAdmin.rpc("spend_stars", {
    p_telegram_id: telegramId,
    p_amount: amount
  });

  if (error) {
    const message = error.message || "spend_stars failed";
    const status = message.toLowerCase().includes("insufficient") ? 402 : 502;
    return jsonError(message, status);
  }

  await recordTransaction({
    telegramId,
    kind: "generation_spend",
    starsDelta: -Math.floor(amount)
  });

  return NextResponse.json({ ok: true, stars: Number(data || 0) });
}
