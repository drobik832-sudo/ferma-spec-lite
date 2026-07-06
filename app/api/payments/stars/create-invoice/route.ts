import { NextResponse } from "next/server";
import { authenticateTelegram } from "../../../../lib/api/withTelegramAuth";
import { jsonError } from "../../../../lib/api/responses";
import { telegramBotApi } from "../../../../lib/telegram/botApi";

const PACKAGES: Array<{ id: string; stars: number; title: string }> = [
  { id: "pack_50", stars: 50, title: "50 \u2b50" },
  { id: "pack_150", stars: 150, title: "150 \u2b50" },
  { id: "pack_500", stars: 500, title: "500 \u2b50" }
];

export async function POST(req: Request) {
  const payload = await req.json().catch(() => ({}));
  const initData = typeof payload?.initData === "string" ? payload.initData : "";
  const packageId = typeof payload?.packageId === "string" ? payload.packageId : "";

  if (!initData || !packageId) {
    return jsonError("initData and packageId required", 400);
  }

  const auth = authenticateTelegram(initData);
  if (auth.error) return auth.error;

  const pack = PACKAGES.find(p => p.id === packageId);
  if (!pack) {
    return jsonError("unknown packageId", 400);
  }

  const { telegramId } = auth.user;
  const nonce = Math.random().toString(36).slice(2);
  const invoicePayload = `buy_stars:${telegramId}:${pack.id}:${nonce}`;

  const result = await telegramBotApi("createInvoiceLink", {
    title: `Ferma Design \u00b7 ${pack.title}`,
    description: "\u041f\u043e\u043f\u043e\u043b\u043d\u0435\u043d\u0438\u0435 \u0431\u0430\u043b\u0430\u043d\u0441\u0430 \u0437\u0432\u0451\u0437\u0434 \u0434\u043b\u044f \u0433\u0435\u043d\u0435\u0440\u0430\u0446\u0438\u0439",
    payload: invoicePayload,
    currency: "XTR",
    prices: [{ label: pack.title, amount: pack.stars }]
  });

  if (!result?.ok) {
    const message = result?.description || result?.error?.message || "createInvoiceLink failed";
    return jsonError(message, 502);
  }

  return NextResponse.json({
    ok: true,
    invoiceLink: result.result,
    stars: pack.stars
  });
}
