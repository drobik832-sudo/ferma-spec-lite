import { NextResponse } from "next/server";
import { isAdminRequest } from "../admin/auth";
import { supabaseAdmin } from "../supabaseAdmin";

/**
 * Returns an error response if not admin, or null if authorized.
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ ok: false, message: "unauthorized" }, { status: 401 });
  }
  return null;
}

/**
 * Returns a NextResponse error if not admin or supabase not configured,
 * or the supabase client on success.
 */
export async function requireAdminWithSupabase(): Promise<NextResponse | NonNullable<typeof supabaseAdmin>> {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ ok: false, message: "unauthorized" }, { status: 401 });
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ ok: false, message: "supabase not configured" }, { status: 500 });
  }
  return supabaseAdmin;
}
