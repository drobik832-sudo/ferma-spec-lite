import { NextResponse } from "next/server";
import { verifyTelegramInitData } from "../../../../lib/telegram/verifyInitData";
import { telegramBotApi } from "../../../../lib/telegram/botApi";

const botToken = process.env.TELEGRAM_BOT_TOKEN || "";

const PACKAGES: Array<{ id: string; stars: number; title: string }> = [
  { id: "pack_50", stars: 50, title: "50 ⭐" },
  { id: "pack_150", stars: 150, title: "150 ⭐" },
  { id: "pack_500", stars: 500, title: "500 ⭐" }
];

export async function POST(req: Request) {
  const payload = await req.json().catch(() => ({}));
  const initData = typeof payload?.initData === "string" ? payload.initData : "";
  const packageId = typeof payload?.packageId === "string" ? payload.packageId : "";

  if (!initData || !packageId) {
    return NextResponse.json({ ok: false, message: "initData and packageId required" }, { status: 400 });
  }

  const verified = verifyTelegramInitData(initData, botToken);
  if (!verified.ok) {
    const message = "message" in verified ? verified.message : "unauthorized";
    return NextResponse.json({ ok: false, message }, { status: 401 });
  }

  const pack = PACKAGES.find(p => p.id === packageId);
  if (!pack) {
    return NextResponse.json({ ok: false, message: "unknown packageId" }, { status: 400 });
  }

  const telegramId = verified.user.id;
  const nonce = Math.random().toString(36).slice(2);
  const invoicePayload = `buy_stars:${telegramId}:${pack.id}:${nonce}`;

  const result = await telegramBotApi("createInvoiceLink", {
    title: `Ferma Design · ${pack.title}`,
    description: "Пополнение баланса звёзд для генераций",
    payload: invoicePayload,
    currency: "XTR",
    prices: [{ label: pack.title, amount: pack.stars }]
  });

  if (!result?.ok) {
    const message = result?.description || result?.error?.message || "createInvoiceLink failed";
    return NextResponse.json({ ok: false, message }, { status: 502 });
  }

  return NextResponse.json({
    ok: true,
    invoiceLink: result.result,
    stars: pack.stars
  });
}

