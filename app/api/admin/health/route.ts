import { NextResponse } from "next/server";
import { requireAdmin } from "../../../lib/api/withAdminAuth";

const comfyApiUrl = process.env.NEXT_PUBLIC_COMFY_API_URL || "http://127.0.0.1:8188";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);
  try {
    const statsRes = await fetch(`${comfyApiUrl}/system_stats`, { signal: controller.signal });
    const statsJson = await statsRes.json().catch(() => null);

    const queueRes = await fetch(`${comfyApiUrl}/queue`, { signal: controller.signal });
    const queueJson = await queueRes.json().catch(() => null);

    return NextResponse.json({
      ok: true,
      comfy: {
        url: comfyApiUrl,
        stats: {
          status: statsRes.status,
          body: statsJson,
        },
        queue: {
          status: queueRes.status,
          body: queueJson,
        },
      }
    });
  } catch (e: any) {
    return NextResponse.json({
      ok: true,
      comfy: {
        url: comfyApiUrl,
        status: 0,
        error: e?.message || "failed"
      }
    });
  } finally {
    clearTimeout(timeout);
  }
}
