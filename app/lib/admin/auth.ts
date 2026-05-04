import { cookies } from "next/headers";

export async function isAdminRequest() {
  const token = process.env.ADMIN_TOKEN || "";
  if (!token) return false;
  const store = await cookies();
  const cookieToken = store.get("ferma_admin")?.value || "";
  return cookieToken === token;
}
