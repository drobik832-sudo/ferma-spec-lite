import { NextResponse } from "next/server";
import { isAdminRequest } from "../../../lib/admin/auth";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export async function GET(req: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ ok: false, message: "unauthorized" }, { status: 401 });
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ ok: true, items: [] });
  }

  const url = new URL(req.url);
  const telegramIdRaw = url.searchParams.get("telegramId");
  const kind = url.searchParams.get("kind");
  const limitRaw = url.searchParams.get("limit") || "100";
  const limit = Math.max(1, Math.min(500, Number(limitRaw) || 100));

  let query = supabaseAdmin
    .from("transactions")
    .select("id, created_at, telegram_id, kind, stars_delta, amount, currency, provider, provider_ref, status, payload")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (telegramIdRaw) {
    const telegramId = Number(telegramIdRaw);
    if (Number.isFinite(telegramId) && telegramId > 0) {
      query = query.eq("telegram_id", telegramId);
    }
  }
  if (kind) {
    query = query.eq("kind", kind);
  }

  const result = await query;
  if (result.error) {
    return NextResponse.json({ ok: false, message: result.error.message }, { status: 502 });
  }

  return NextResponse.json({ ok: true, items: result.data || [] });
}

