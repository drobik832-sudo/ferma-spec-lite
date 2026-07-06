import { NextResponse } from "next/server";
import { verifyTelegramInitData } from "../telegram/verifyInitData";

const botToken = process.env.TELEGRAM_BOT_TOKEN || "";

export interface TelegramAuthPayload {
  telegramId: number;
  firstName: string | null;
  username: string | null;
}

/**
 * Verifies Telegram initData. Returns either the authenticated user payload
 * or an error NextResponse.
 */
export function authenticateTelegram(initData: string): { user: TelegramAuthPayload; error: null } | { user: null; error: NextResponse } {
  if (!initData) {
    return {
      user: null,
      error: NextResponse.json({ ok: false, message: "initData required" }, { status: 400 })
    };
  }

  const verified = verifyTelegramInitData(initData, botToken);
  if (!verified.ok) {
    const message = "message" in verified ? verified.message : "unauthorized";
    return {
      user: null,
      error: NextResponse.json({ ok: false, message }, { status: 401 })
    };
  }

  return {
    user: {
      telegramId: verified.user.id,
      firstName: verified.user.first_name || null,
      username: verified.user.username || null
    },
    error: null
  };
}
