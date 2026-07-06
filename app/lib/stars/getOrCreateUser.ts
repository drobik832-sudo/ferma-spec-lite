import { NextResponse } from "next/server";
import { supabaseAdmin } from "../supabaseAdmin";
import { recordTransaction } from "./recordTransaction";

const defaultTrialStars = Number(process.env.DEFAULT_TRIAL_STARS || "5");

export interface UserRecord {
  telegramId: number;
  stars: number;
  isNew: boolean;
}

/**
 * Retrieves an existing user or creates one with trial stars.
 * Returns a NextResponse on error, or the UserRecord on success.
 */
export async function getOrCreateUser(opts: {
  telegramId: number;
  firstName?: string | null;
  username?: string | null;
  source: string;
}): Promise<NextResponse | UserRecord> {
  if (!supabaseAdmin) {
    return NextResponse.json({ ok: false, message: "supabase not configured" }, { status: 500 });
  }

  const { data: existingUser, error: selectError } = await supabaseAdmin
    .from("users")
    .select("telegram_id, stars")
    .eq("telegram_id", opts.telegramId)
    .maybeSingle();

  if (selectError) {
    return NextResponse.json({ ok: false, message: selectError.message }, { status: 502 });
  }

  if (existingUser) {
    return { telegramId: opts.telegramId, stars: existingUser.stars ?? 0, isNew: false };
  }

  const { data: createdUser, error: insertError } = await supabaseAdmin
    .from("users")
    .insert([{
      telegram_id: opts.telegramId,
      first_name: opts.firstName ?? null,
      username: opts.username ?? null,
      stars: defaultTrialStars
    }])
    .select("stars")
    .single();

  if (insertError) {
    return NextResponse.json({ ok: false, message: insertError.message }, { status: 502 });
  }

  await recordTransaction({
    telegramId: opts.telegramId,
    kind: "trial_grant",
    starsDelta: defaultTrialStars,
    payload: { source: opts.source }
  });

  return { telegramId: opts.telegramId, stars: createdUser?.stars ?? defaultTrialStars, isNew: true };
}
