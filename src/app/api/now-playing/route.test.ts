import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const getNowPlaying = vi.fn();
vi.mock("@/lib/spotify", () => ({ getNowPlaying: () => getNowPlaying() }));

const TRACK = { isPlaying: true, title: "Song", artist: "Artist", url: "https://open.spotify.com/track/1" };

describe("GET /api/now-playing", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers();
    getNowPlaying.mockReset();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("calls Spotify once a minute at most", async () => {
    getNowPlaying.mockResolvedValue(TRACK);
    const { GET } = await import("./route");

    expect(await (await GET()).json()).toEqual({ track: TRACK });
    await GET();
    expect(getNowPlaying).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(60_000);
    await GET();
    expect(getNowPlaying).toHaveBeenCalledTimes(2);
  });

  it("returns no track when Spotify fails", async () => {
    getNowPlaying.mockRejectedValue(new Error("offline"));
    const { GET } = await import("./route");

    const response = await GET();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ track: null });
  });
});
