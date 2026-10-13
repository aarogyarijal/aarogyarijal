import { NextResponse } from "next/server";
import { getGitHubOverview } from "../../lib/github";

// Rendered per request so a failed GitHub call is never frozen into a static snapshot.
// Upstream responses are still cached for an hour via fetch `next.revalidate` in lib/github,
// and successful responses are cached at the CDN below.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const overview = await getGitHubOverview();
    return NextResponse.json(overview, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    });
  } catch (error) {
    console.error("GitHub overview error:", error);
    return NextResponse.json({ error: "Failed to load GitHub activity" },
      { status: 502, headers: { "Cache-Control": "no-store" } });
  }
}
