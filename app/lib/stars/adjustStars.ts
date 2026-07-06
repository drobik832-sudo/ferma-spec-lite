import { NextResponse } from "next/server";
import { supabaseAdmin } from "../supabaseAdmin";
import { recordTransaction } from "./recordTransaction";

/**
 * Adjusts stars for a user. Returns a NextResponse on error, or { stars } on success.
 */
export async function adjustStars(opts: {
  telegramId: number;
  delta: number;
  reason?: string | null;
}): Promise<NextResponse | { stars: number }> {
  if (!supabaseAdmin) {
    return NextResponse.json({ ok: false, message: "supabase not configured" }, { status: 500 });
  }

  const { data: user, error: selectError } = await supabaseAdmin
    .from("users")
    .select("telegram_id, stars")
    .eq("telegram_id", opts.telegramId)
    .maybeSingle();

  if (selectError) {
    return NextResponse.json({ ok: false, message: selectError.message }, { status: 502 });
  }
  if (!user) {
    return NextResponse.json({ ok: false, message: "user not found" }, { status: 404 });
  }

  const nextStars = (user.stars ?? 0) + opts.delta;
  if (nextStars < 0) {
    return NextResponse.json({ ok: false, message: "resulting stars < 0" }, { status: 400 });
  }

  const { data: updated, error: updateError } = await supabaseAdmin
    .from("users")
    .update({ stars: nextStars })
    .eq("telegram_id", opts.telegramId)
    .select("stars")
    .single();

  if (updateError) {
    return NextResponse.json({ ok: false, message: updateError.message }, { status: 502 });
  }

  await recordTransaction({
    telegramId: opts.telegramId,
    kind: "admin_adjust",
    starsDelta: opts.delta,
    payload: opts.reason ? { reason: opts.reason } : null
  });

  return { stars: updated.stars ?? nextStars };
}
