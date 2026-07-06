const botToken = process.env.TELEGRAM_BOT_TOKEN || "";

export async function telegramBotApi(method: string, body: Record<string, any>) {
  if (!botToken) {
    return { ok: false, error: { message: "TELEGRAM_BOT_TOKEN missing" } };
  }
  const res = await fetch(`https://api.telegram.org/bot${botToken}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  const json = await res.json().catch(() => null);
  if (!json) {
    // Non-JSON response (e.g. a gateway error page). Surface the HTTP status
    // instead of returning a bare null that erases the failure reason.
    const message = `Telegram API ${method} failed with status ${res.status}`;
    console.error(`[telegram/botApi] ${message}`);
    return { ok: false, error: { message }, description: message };
  }
  return json;
}

