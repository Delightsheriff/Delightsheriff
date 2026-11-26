import { getNowPlaying, type NowPlaying } from "@/lib/spotify";

// The one live value on an otherwise static site.
export const dynamic = "force-dynamic";

const TTL_MS = 60_000;

// Held in memory so repeat visits don't each call Spotify. It is per Worker instance,
// which is enough here and needs no storage.
let cached: { track: NowPlaying | null; expires: number } | undefined;

export async function GET() {
  if (!cached || cached.expires <= Date.now()) {
    const track = await getNowPlaying().catch(() => null);
    cached = { track, expires: Date.now() + TTL_MS };
  }

  return Response.json({ track: cached.track }, { headers: { "Cache-Control": "public, max-age=60" } });
}
