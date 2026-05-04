import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";
import { telegramBotApi } from "../../../../lib/telegram/botApi";
import { verifyTelegramInitData } from "../../../../lib/telegram/verifyInitData";

const botToken = process.env.TELEGRAM_BOT_TOKEN || "";
const botUsername = process.env.TELEGRAM_BOT_USERNAME || process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "";

export async function POST(req: Request) {
  const payload = await req.json().catch(() => ({}));
  const initData = typeof payload?.initData === "string" ? payload.initData : "";
  const imageUrl = typeof payload?.imageUrl === "string" ? payload.imageUrl : "";
  const caption = typeof payload?.caption === "string" ? payload.caption : "";
  const message = typeof payload?.message === "string" ? payload.message : "";

  if (!supabaseAdmin) return NextResponse.json({ ok: false, message: "supabase not configured" }, { status: 500 });
  if (!initData) return NextResponse.json({ ok: false, message: "initData required" }, { status: 400 });

  const verified = verifyTelegramInitData(initData, botToken);
  if (!verified.ok) {
    const err = "message" in verified ? verified.message : "unauthorized";
    return NextResponse.json({ ok: false, message: err }, { status: 401 });
  }

  const telegramId = verified.user.id;
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
      return NextResponse.json({ ok: false, message: res?.description || "sendPhoto failed" }, { status: 502 });
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
      return NextResponse.json({ ok: false, message: res?.description || "sendMessage failed" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, message: "imageUrl or message required" }, { status: 400 });
}

