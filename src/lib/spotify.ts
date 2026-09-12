export type NowPlaying = {
  isPlaying: boolean;
  title: string;
  artist: string;
  url: string;
};

async function getAccessToken(): Promise<string | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) return null;

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken }),
    cache: "no-store",
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data.access_token ?? null;
}

export async function getNowPlaying(): Promise<NowPlaying | null> {
  const token = await getAccessToken();
  if (!token) return null;

  try {
    const currentRes = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    // 204 = authenticated fine, nothing currently playing
    if (currentRes.status === 200) {
      const data = await currentRes.json();
      if (data?.is_playing && data?.item) {
        return {
          isPlaying: true,
          title: data.item.name,
          artist: data.item.artists.map((a: { name: string }) => a.name).join(", "),
          url: data.item.external_urls.spotify,
        };
      }
    }

    // Fall back to most recently played track.
    const recentRes = await fetch(
      "https://api.spotify.com/v1/me/player/recently-played?limit=1",
      { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }
    );
    if (!recentRes.ok) return null;
    const recentData = await recentRes.json();
    const track = recentData?.items?.[0]?.track;
    if (!track) return null;

    return {
      isPlaying: false,
      title: track.name,
      artist: track.artists.map((a: { name: string }) => a.name).join(", "),
      url: track.external_urls.spotify,
    };
  } catch {
    return null;
  }
}
