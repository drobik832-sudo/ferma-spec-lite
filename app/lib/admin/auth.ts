import { cookies } from "next/headers";
import { timingSafeEqual } from "crypto";

export function safeTokenEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length === 0 || bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export async function isAdminRequest() {
  const token = process.env.ADMIN_TOKEN || "";
  if (!token) return false;
  const store = await cookies();
  const cookieToken = store.get("ferma_admin")?.value || "";
  return safeTokenEqual(cookieToken, token);
}
