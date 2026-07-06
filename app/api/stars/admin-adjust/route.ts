import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import { safeTokenEqual } from "../../../lib/admin/auth";

const adminToken = process.env.ADMIN_TOKEN || "";

export async function POST(req: Request) {
  if (!adminToken) {
    return NextResponse.json({ ok: false, message: "ADMIN_TOKEN missing" }, { status: 500 });
  }
  const headerToken = req.headers.get("x-admin-token") || "";
  if (!safeTokenEqual(headerToken, adminToken)) {
    return NextResponse.json({ ok: false, message: "unauthorized" }, { status: 401 });
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ ok: false, message: "supabase not configured" }, { status: 500 });
  }

  const payload = await req.json().catch(() => ({}));
  const telegramId = Number(payload?.telegramId || 0);
  const delta = Number(payload?.delta || 0);
  if (!Number.isFinite(telegramId) || telegramId <= 0) {
    return NextResponse.json({ ok: false, message: "invalid telegramId" }, { status: 400 });
  }
  if (!Number.isFinite(delta) || delta === 0) {
    return NextResponse.json({ ok: false, message: "invalid delta" }, { status: 400 });
  }

  const { data: user, error: selectError } = await supabaseAdmin
    .from("users")
    .select("telegram_id, stars")
    .eq("telegram_id", telegramId)
    .maybeSingle();

  if (selectError) {
    return NextResponse.json({ ok: false, message: selectError.message }, { status: 502 });
  }
  if (!user) {
    return NextResponse.json({ ok: false, message: "user not found" }, { status: 404 });
  }

  const nextStars = (user.stars ?? 0) + delta;
  if (nextStars < 0) {
    return NextResponse.json({ ok: false, message: "resulting stars < 0" }, { status: 400 });
  }

  const { data: updated, error: updateError } = await supabaseAdmin
    .from("users")
    .update({ stars: nextStars })
    .eq("telegram_id", telegramId)
    .select("stars")
    .single();

  if (updateError) {
    return NextResponse.json({ ok: false, message: updateError.message }, { status: 502 });
  }

  return NextResponse.json({ ok: true, stars: updated.stars ?? nextStars });
}

