import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";
import { telegramBotApi } from "../../../../lib/telegram/botApi";
import { authenticateTelegram } from "../../../../lib/api/withTelegramAuth";
import { jsonError } from "../../../../lib/api/responses";

const botUsername = process.env.TELEGRAM_BOT_USERNAME || process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "";

export async function POST(req: Request) {
  const payload = await req.json().catch(() => ({}));
  const initData = typeof payload?.initData === "string" ? payload.initData : "";
  const imageUrl = typeof payload?.imageUrl === "string" ? payload.imageUrl : "";
  const caption = typeof payload?.caption === "string" ? payload.caption : "";
  const message = typeof payload?.message === "string" ? payload.message : "";

  if (!supabaseAdmin) return jsonError("supabase not configured", 500);
  if (!initData) return jsonError("initData required", 400);

  const auth = authenticateTelegram(initData);
  if (auth.error) return auth.error;

  const { telegramId } = auth.user;
  const userResult = await supabaseAdmin
    .from("users")
    .select("telegram_id, chat_id, stars")
    .eq("telegram_id", telegramId)
    .maybeSingle();

  const chatId = (userResult.data as any)?.chat_id;
  if (!chatId) {
    const url = botUsername ? `https://t.me/${botUsername}` : "";
    return NextResponse.json({ ok: false, needsStart: true, botUrl: url }, { status: 409 });
  }

  if (imageUrl) {
    const res = await telegramBotApi("sendPhoto", {
      chat_id: String(chatId),
      photo: imageUrl,
      caption: caption ? caption.slice(0, 1024) : undefined
    });
    if (!res?.ok) {
      return jsonError(res?.description || "sendPhoto failed", 502);
    }
    return NextResponse.json({ ok: true });
  }

  if (message) {
    const stars = typeof (userResult.data as any)?.stars === "number" ? (userResult.data as any).stars : 0;
    const finalMessage = message.replaceAll("{stars}", String(stars));
    const res = await telegramBotApi("sendMessage", {
      chat_id: String(chatId),
      text: finalMessage.slice(0, 4096)
    });
    if (!res?.ok) {
      return jsonError(res?.description || "sendMessage failed", 502);
    }
    return NextResponse.json({ ok: true });
  }

  return jsonError("imageUrl or message required", 400);
}
