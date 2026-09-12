import { getNowPlaying } from "@/lib/spotify";

export async function NowPlaying() {
  const track = await getNowPlaying();
  if (!track) return null;

  return (
    <a
      href={track.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
    >
      <span className="tabular-nums">{track.isPlaying ? "Now playing" : "Last played"}:</span>
      <span className="text-foreground/80 group-hover:text-foreground">
        {track.title} — {track.artist}
      </span>
    </a>
  );
}
