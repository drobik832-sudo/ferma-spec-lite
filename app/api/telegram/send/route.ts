import { NextResponse } from "next/server";

const botToken = process.env.TELEGRAM_BOT_TOKEN || "";
const chatId = process.env.TELEGRAM_CHAT_ID || "";

export async function POST(req: Request) {
  if (!botToken || !chatId) {
    return new NextResponse(null, { status: 204 });
  }
  const payload = await req.json().catch(() => ({}));
  const imageUrl = typeof payload?.imageUrl === "string" ? payload.imageUrl : "";
  const caption = typeof payload?.caption === "string" ? payload.caption : "";
  const targetChatId = typeof payload?.chatId === "string" ? payload.chatId : chatId;

  if (!imageUrl) {
    return NextResponse.json({ message: "imageUrl required" }, { status: 400 });
  }
  if (!targetChatId) {
    return NextResponse.json({ message: "chatId required" }, { status: 400 });
  }

  const body = new URLSearchParams();
  body.set("chat_id", targetChatId);
  body.set("photo", imageUrl);
  if (caption) {
    body.set("caption", caption.slice(0, 1024));
  }
  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
    method: "POST",
    body
  });
  if (!response.ok) {
    const text = await response.text();
    return NextResponse.json({ message: text }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
