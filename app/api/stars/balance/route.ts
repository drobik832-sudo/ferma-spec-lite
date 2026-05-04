import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import { verifyTelegramInitData } from "../../../lib/telegram/verifyInitData";

const botToken = process.env.TELEGRAM_BOT_TOKEN || "";
const defaultTrialStars = Number(process.env.DEFAULT_TRIAL_STARS || "5");

export async function POST(req: Request) {
  const payload = await req.json().catch(() => ({}));
  const initData = typeof payload?.initData === "string" ? payload.initData : "";

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
  const firstName = verified.user.first_name || null;
  const username = verified.user.username || null;

  const { data: existingUser } = await supabaseAdmin
    .from("users")
    .select("telegram_id, stars")
    .eq("telegram_id", telegramId)
    .maybeSingle();

  if (existingUser) {
    return NextResponse.json({ ok: true, stars: existingUser.stars ?? 0 });
  }

  const { data: createdUser, error: insertError } = await supabaseAdmin
    .from("users")
    .insert([{ telegram_id: telegramId, first_name: firstName, username, stars: defaultTrialStars }])
    .select("stars")
    .single();

  if (insertError) {
    return NextResponse.json({ ok: false, message: insertError.message }, { status: 502 });
  }

  const txResult = await supabaseAdmin.from("transactions").insert([
    {
      telegram_id: telegramId,
      kind: "trial_grant",
      stars_delta: defaultTrialStars,
      status: "success",
      payload: { source: "auto_create" }
    }
  ]);
  void txResult;

  return NextResponse.json({ ok: true, stars: createdUser?.stars ?? defaultTrialStars });
}
