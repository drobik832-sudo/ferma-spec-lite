import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import { verifyTelegramInitData } from "../../../lib/telegram/verifyInitData";

const botToken = process.env.TELEGRAM_BOT_TOKEN || "";

export async function POST(req: Request) {
  const payload = await req.json().catch(() => ({}));
  const initData = typeof payload?.initData === "string" ? payload.initData : "";
  const amount = Number(payload?.amount || 0);

  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ ok: false, message: "invalid amount" }, { status: 400 });
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ ok: true, stars: null });
  }
  if (!initData) {
    return NextResponse.json({ ok: true, stars: null });
  }

  const verified = verifyTelegramInitData(initData, botToken);
  if (!verified.ok) {
    const message = "message" in verified ? verified.message : "unauthorized";
    return NextResponse.json({ ok: false, message }, { status: 401 });
  }

  const telegramId = verified.user.id;

  const { data, error } = await supabaseAdmin.rpc("spend_stars", {
    p_telegram_id: telegramId,
    p_amount: amount
  });

  if (error) {
    const message = error.message || "spend_stars failed";
    const status = message.toLowerCase().includes("insufficient") ? 402 : 502;
    return NextResponse.json({ ok: false, message }, { status });
  }

  const txResult = await supabaseAdmin.from("transactions").insert([
    {
      telegram_id: telegramId,
      kind: "generation_spend",
      stars_delta: -Math.floor(amount),
      status: "success"
    }
  ]);
  if (txResult.error) {
    console.error(`[stars/spend] Failed to record transaction for telegram_id=${telegramId}:`, txResult.error.message);
  }

  return NextResponse.json({ ok: true, stars: Number(data || 0) });
}
