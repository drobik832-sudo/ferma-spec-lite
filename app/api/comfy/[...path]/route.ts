import { NextRequest, NextResponse } from "next/server";

const comfyApiUrl = process.env.NEXT_PUBLIC_COMFY_API_URL || "http://127.0.0.1:8188";

async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname.replace(/^\/api\/comfy/, "");
  const targetUrl = `${comfyApiUrl}${path}${req.nextUrl.search}`;
  const headers = new Headers();
  req.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();
    if (lowerKey !== "host" && lowerKey !== "origin") {
      headers.set(key, value);
    }
  });
  headers.set("Bypass-Tunnel-Reminder", "true");
  headers.set("ngrok-skip-browser-warning", "true");
  const init: RequestInit = {
    method: req.method,
    headers
  };
  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = await req.arrayBuffer();
  }
  try {
    const response = await fetch(targetUrl, init);
    const contentType = response.headers.get("content-type") || "application/json";
    const body = await response.arrayBuffer();
    return new NextResponse(body, {
      status: response.status,
      headers: {
        "content-type": contentType
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "ComfyUI недоступен";
    return NextResponse.json({ message, targetUrl }, { status: 502 });
  }
}

export async function GET(req: NextRequest) {
  return proxy(req);
}

export async function POST(req: NextRequest) {
  return proxy(req);
}

export async function generateStaticParams() {
  return [
    { path: [] },
    { path: ["prompt"] },
    { path: ["upload", "image"] },
    { path: ["history"] },
    { path: ["queue"] },
    { path: ["system_stats"] },
    { path: ["view"] },
    { path: ["interrupt"] },
    { path: ["free"] },
    { path: ["object_info"] }
  ];
}
