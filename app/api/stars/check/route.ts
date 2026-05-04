import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import { verifyTelegramInitData } from "../../../lib/telegram/verifyInitData";

const botToken = process.env.TELEGRAM_BOT_TOKEN || "";
const defaultTrialStars = Number(process.env.DEFAULT_TRIAL_STARS || "5");

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

  const verified = verifyTelegramInitData(initData, botToken);
  if (!verified.ok) {
    const message = "message" in verified ? verified.message : "unauthorized";
    return NextResponse.json({ ok: false, message }, { status: 401 });
  }

  const telegramId = verified.user.id;
  const firstName = verified.user.first_name || null;
  const username = verified.user.username || null;

  let stars = 0;
  const { data: existingUser, error: selectError } = await supabaseAdmin
    .from("users")
    .select("telegram_id, stars")
    .eq("telegram_id", telegramId)
    .maybeSingle();

  if (selectError) {
    return NextResponse.json({ ok: false, message: selectError.message }, { status: 502 });
  }

  if (!existingUser) {
    const { data: createdUser, error: insertError } = await supabaseAdmin
      .from("users")
      .insert([{ telegram_id: telegramId, first_name: firstName, username, stars: defaultTrialStars }])
      .select("stars")
      .single();
    if (insertError) {
      return NextResponse.json({ ok: false, message: insertError.message }, { status: 502 });
    }
    stars = createdUser?.stars ?? defaultTrialStars;
    const txResult = await supabaseAdmin.from("transactions").insert([
      {
        telegram_id: telegramId,
        kind: "trial_grant",
        stars_delta: defaultTrialStars,
        status: "success",
        payload: { source: "auto_check" }
      }
    ]);
    void txResult;
  } else {
    stars = existingUser.stars ?? 0;
  }

  return NextResponse.json({ ok: true, allowed: stars >= amount, stars });
}
