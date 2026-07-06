import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";
import { telegramBotApi } from "../../../../lib/telegram/botApi";
import { recordTransaction } from "../../../../lib/stars/recordTransaction";

export async function POST(req: Request, ctx: { params: Promise<{ secret: string }> }) {
  const secret = (await ctx.params).secret;
  const expected = process.env.TELEGRAM_WEBHOOK_SECRET || "";
  if (!expected || secret !== expected) {
    return new NextResponse(null, { status: 404 });
  }

  const update = await req.json().catch(() => null);
  if (!update) return NextResponse.json({ ok: true });

  const msg = update?.message;
  const messageText = typeof msg?.text === "string" ? msg.text : "";
  const telegramId = msg?.from?.id;
  const chatId = msg?.chat?.id;
  const defaultTrialStars = Number(process.env.DEFAULT_TRIAL_STARS || "5");

  if (telegramId && chatId && messageText.startsWith("/start") && supabaseAdmin) {
    const userResult = await supabaseAdmin
      .from("users")
      .select("telegram_id, stars")
      .eq("telegram_id", telegramId)
      .maybeSingle();

    const hasUser = Boolean(userResult.data?.telegram_id);
    const stars = typeof userResult.data?.stars === "number" ? userResult.data.stars : 0;

    if (!hasUser) {
      await supabaseAdmin
        .from("users")
        .insert([{ telegram_id: telegramId, stars: defaultTrialStars, chat_id: chatId }]);
      await recordTransaction({
        telegramId,
        kind: "trial_grant",
        starsDelta: defaultTrialStars,
        payload: { source: "bot_start" }
      });
    } else {
      await supabaseAdmin
        .from("users")
        .update({ chat_id: chatId })
        .eq("telegram_id", telegramId);
    }

    await telegramBotApi("sendMessage", {
      chat_id: String(chatId),
      text: `\u041b\u0438\u0447\u043d\u044b\u0439 \u043a\u0430\u0431\u0438\u043d\u0435\u0442 Ferma Design\n\n\u0411\u0430\u043b\u0430\u043d\u0441: ${hasUser ? stars : defaultTrialStars} \u2b50\n\n\u0421\u044e\u0434\u0430 \u0431\u0443\u0434\u0443\u0442 \u043f\u0440\u0438\u0445\u043e\u0434\u0438\u0442\u044c \u0432\u0430\u0448\u0438 \u0433\u0435\u043d\u0435\u0440\u0430\u0446\u0438\u0438 \u0438 \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f \u043f\u043e \u0437\u0432\u0451\u0437\u0434\u0430\u043c.`
    });
  }

  const preCheckout = update?.pre_checkout_query;
  if (preCheckout?.id) {
    const answer = await telegramBotApi("answerPreCheckoutQuery", {
      pre_checkout_query_id: preCheckout.id,
      ok: true
    });
    return NextResponse.json(answer || { ok: true });
  }

  const successful = msg?.successful_payment;
  if (!successful) return NextResponse.json({ ok: true });

  if (!telegramId || !supabaseAdmin) return NextResponse.json({ ok: true });

  const currency = successful.currency;
  const amountRaw = successful.total_amount;
  const totalAmount = typeof amountRaw === "number" ? amountRaw : Number(amountRaw);
  if (!Number.isFinite(totalAmount) || totalAmount <= 0) return NextResponse.json({ ok: true });

  const stars = currency === "XTR" ? Math.floor(totalAmount) : 0;
  if (stars <= 0) return NextResponse.json({ ok: true });

  const payload = successful.invoice_payload || "";
  const providerRef = successful.telegram_payment_charge_id || null;

  const userResult = await supabaseAdmin
    .from("users")
    .select("telegram_id, stars")
    .eq("telegram_id", telegramId)
    .maybeSingle();

  const currentStars = userResult.data?.stars ?? 0;
  const nextStars = currentStars + stars;

  const upsertResult = await supabaseAdmin
    .from("users")
    .upsert([{ telegram_id: telegramId, stars: nextStars, chat_id: chatId || undefined }], { onConflict: "telegram_id" })
    .select("stars")
    .single();

  void upsertResult;

  await recordTransaction({
    telegramId,
    kind: "purchase",
    starsDelta: stars,
    provider: "telegram",
    providerRef,
    currency,
    amount: totalAmount,
    payload: payload ? { invoice_payload: payload } : null
  });

  return NextResponse.json({ ok: true });
}
