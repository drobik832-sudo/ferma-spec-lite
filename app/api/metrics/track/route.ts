import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import { authenticateTelegram } from "../../../lib/api/withTelegramAuth";
import { noContent } from "../../../lib/api/responses";

export async function POST(req: Request) {
  const payload = await req.json().catch(() => ({}));
  const initData = typeof payload?.initData === "string" ? payload.initData : "";
  const event = typeof payload?.event === "string" ? payload.event : "";
  const data = payload?.data ?? null;

  if (!supabaseAdmin) {
    return noContent();
  }
  if (!initData || !event) {
    return noContent();
  }

  const auth = authenticateTelegram(initData);
  if (auth.error) {
    return noContent();
  }

  const { telegramId } = auth.user;
  const insert = await supabaseAdmin.from("events").insert([
    {
      telegram_id: telegramId,
      event,
      payload: data
    }
  ]);

  if (insert.error) {
    return noContent();
  }

  return NextResponse.json({ ok: true });
}
