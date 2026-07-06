import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";
import { telegramBotApi } from "../../../../lib/telegram/botApi";

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
      const insertUserResult = await supabaseAdmin
        .from("users")
        .insert([{ telegram_id: telegramId, stars: defaultTrialStars, chat_id: chatId }]);
      if (insertUserResult.error) {
        console.error(`[telegram/webhook] Failed to create user telegram_id=${telegramId} on /start:`, insertUserResult.error.message);
      }
      const trialTxResult = await supabaseAdmin.from("transactions").insert([
        {
          telegram_id: telegramId,
          kind: "trial_grant",
          stars_delta: defaultTrialStars,
          status: "success",
          payload: { source: "bot_start" }
        }
      ]);
      if (trialTxResult.error) {
        console.error(`[telegram/webhook] Failed to record trial_grant transaction for telegram_id=${telegramId}:`, trialTxResult.error.message);
      }
    } else {
      const updateChatResult = await supabaseAdmin
        .from("users")
        .update({ chat_id: chatId })
        .eq("telegram_id", telegramId);
      if (updateChatResult.error) {
        console.error(`[telegram/webhook] Failed to update chat_id for telegram_id=${telegramId}:`, updateChatResult.error.message);
      }
    }

    await telegramBotApi("sendMessage", {
      chat_id: String(chatId),
      text: `Личный кабинет Ferma Design\n\nБаланс: ${hasUser ? stars : defaultTrialStars} ⭐\n\nСюда будут приходить ваши генерации и информация по звёздам.`
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

  if (userResult.error) {
    // Do not proceed: defaulting to 0 here would overwrite the user's real
    // balance. Surface a 5xx so Telegram retries delivery of this payment.
    console.error(`[telegram/webhook] Failed to read balance before crediting purchase for telegram_id=${telegramId}:`, userResult.error.message);
    return NextResponse.json({ ok: false, message: "failed to read balance" }, { status: 502 });
  }

  const currentStars = userResult.data?.stars ?? 0;
  const nextStars = currentStars + stars;

  const upsertResult = await supabaseAdmin
    .from("users")
    .upsert([{ telegram_id: telegramId, stars: nextStars, chat_id: chatId || undefined }], { onConflict: "telegram_id" })
    .select("stars")
    .single();

  if (upsertResult.error) {
    // Payment succeeded but crediting failed. Surface a 5xx so Telegram retries
    // rather than silently losing the purchased stars.
    console.error(`[telegram/webhook] Failed to credit ${stars} stars to telegram_id=${telegramId} after payment:`, upsertResult.error.message);
    return NextResponse.json({ ok: false, message: "failed to credit stars" }, { status: 502 });
  }

  const txResult = await supabaseAdmin.from("transactions").insert([
    {
      telegram_id: telegramId,
      kind: "purchase",
      stars_delta: stars,
      provider: "telegram",
      provider_ref: providerRef,
      currency,
      amount: totalAmount,
      status: "success",
      payload: payload ? { invoice_payload: payload } : null
    }
  ]);
  if (txResult.error) {
    // Stars are already credited above; log the missing ledger entry but return
    // 200 so Telegram does not retry and double-credit the purchase.
    console.error(`[telegram/webhook] Failed to record purchase transaction for telegram_id=${telegramId} (stars already credited):`, txResult.error.message);
  }

  return NextResponse.json({ ok: true });
}
