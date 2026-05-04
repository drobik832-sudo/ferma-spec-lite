import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import { verifyTelegramInitData } from "../../../lib/telegram/verifyInitData";

const botToken = process.env.TELEGRAM_BOT_TOKEN || "";

export async function POST(req: Request) {
  const payload = await req.json().catch(() => ({}));
  const initData = typeof payload?.initData === "string" ? payload.initData : "";
  const event = typeof payload?.event === "string" ? payload.event : "";
  const data = payload?.data ?? null;

  if (!supabaseAdmin) {
    return new NextResponse(null, { status: 204 });
  }
  if (!initData || !event) {
    return new NextResponse(null, { status: 204 });
  }

  const verified = verifyTelegramInitData(initData, botToken);
  if (!verified.ok) {
    return new NextResponse(null, { status: 204 });
  }

  const telegramId = verified.user.id;
  const insert = await supabaseAdmin.from("events").insert([
    {
      telegram_id: telegramId,
      event,
      payload: data
    }
  ]);

  if (insert.error) {
    return new NextResponse(null, { status: 204 });
  }

  return NextResponse.json({ ok: true });
}

