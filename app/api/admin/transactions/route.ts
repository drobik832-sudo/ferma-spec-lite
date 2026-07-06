import { NextResponse } from "next/server";
import { requireAdminWithSupabase } from "../../../lib/api/withAdminAuth";
import { jsonOk, jsonError } from "../../../lib/api/responses";

export async function GET(req: Request) {
  const supabaseOrError = await requireAdminWithSupabase();
  if (supabaseOrError instanceof NextResponse) return supabaseOrError;

  const supabase = supabaseOrError;
  const url = new URL(req.url);
  const telegramIdRaw = url.searchParams.get("telegramId");
  const kind = url.searchParams.get("kind");
  const limitRaw = url.searchParams.get("limit") || "100";
  const limit = Math.max(1, Math.min(500, Number(limitRaw) || 100));

  let query = supabase
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
    return jsonError(result.error.message, 502);
  }

  return jsonOk({ items: result.data || [] });
}
