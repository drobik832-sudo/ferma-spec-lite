import { NextResponse } from "next/server";
import { requireAdmin } from "../../../lib/api/withAdminAuth";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  if (!supabaseAdmin) {
    return NextResponse.json({
      ok: true,
      users: [],
      events: [],
      transactions: [],
      totals: { users: 0, stars: 0, generationStarts: 0, generationSuccess: 0, generationErrors: 0, avgDurationSec: null }
    });
  }

  const usersCountResult = await supabaseAdmin
    .from("users")
    .select("telegram_id", { count: "exact", head: true });

  const usersResult = await supabaseAdmin
    .from("users")
    .select("telegram_id, first_name, username, stars, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  const users = usersResult.data || [];
  const totalUsers = usersCountResult.count ?? 0;
  const totalStars = users.reduce((sum, user) => sum + (user.stars ?? 0), 0);

  const eventsResult = await supabaseAdmin
    .from("events")
    .select("id, created_at, telegram_id, event, payload")
    .order("created_at", { ascending: false })
    .limit(100);

  const events = eventsResult.error ? [] : (eventsResult.data || []);
  const generationStarts = events.filter(row => row.event === "generation_start").length;
  const generationSuccess = events.filter(row => row.event === "generation_success").length;
  const generationErrors = events.filter(row => row.event === "generation_error").length;
  const durations = events
    .filter(row => row.event === "generation_success")
    .map(row => (row as any)?.payload?.durationSec)
    .filter((value: any) => typeof value === "number" && Number.isFinite(value) && value > 0) as number[];
  const avgDurationSec = durations.length ? durations.reduce((a, b) => a + b, 0) / durations.length : null;

  const transactionsResult = await supabaseAdmin
    .from("transactions")
    .select("id, created_at, telegram_id, kind, stars_delta, amount, currency, provider, provider_ref, status, payload")
    .order("created_at", { ascending: false })
    .limit(50);

  const transactions = transactionsResult.error ? [] : (transactionsResult.data || []);

  return NextResponse.json({
    ok: true,
    users,
    events,
    transactions,
    totals: {
      users: totalUsers,
      stars: totalStars,
      generationStarts,
      generationSuccess,
      generationErrors,
      avgDurationSec
    }
  });
}
