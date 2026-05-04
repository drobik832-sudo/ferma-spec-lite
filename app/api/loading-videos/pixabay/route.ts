import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const apiKey = process.env.PIXABAY_API_KEY || "";
  console.log(`[Pixabay API] Request received. API Key exists: ${Boolean(apiKey)}`);
  
  if (!apiKey) {
    console.warn("[Pixabay API] PIXABAY_API_KEY is not set in environment variables.");
    return NextResponse.json({ videos: [] }, { status: 200 });
  }

  const query = req.nextUrl.searchParams.get("q") || "ai videos";
  const perPageRaw = req.nextUrl.searchParams.get("perPage") || "20";
  const perPage = Math.max(3, Math.min(50, Number(perPageRaw) || 20));

  const url = new URL("https://pixabay.com/api/videos/");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("q", query);
  url.searchParams.set("per_page", String(perPage));
  url.searchParams.set("safesearch", "true");

  console.log(`[Pixabay API] Fetching from Pixabay with query: "${query}", perPage: ${perPage}`);

  const response = await fetch(url.toString(), {
    headers: {
      accept: "application/json"
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    console.error(`[Pixabay API] Pixabay returned error ${response.status}: ${text}`);
    return NextResponse.json({ videos: [], message: text || `Pixabay error: ${response.status}` }, { status: 502 });
  }

  const data: any = await response.json().catch(() => null);
  const hits = Array.isArray(data?.hits) ? data.hits : [];
  console.log(`[Pixabay API] Pixabay returned ${hits.length} hits.`);
  
  const videos = hits
    .map((hit: any) => hit?.videos)
    .map((v: any) => v?.medium?.url || v?.small?.url || v?.tiny?.url || v?.large?.url)
    .filter((u: any): u is string => typeof u === "string" && u.startsWith("http"));

  console.log(`[Pixabay API] Successfully extracted ${videos.length} valid video URLs.`);

  return new NextResponse(JSON.stringify({ videos }), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "cache-control": "public, max-age=600"
    }
  });
}

