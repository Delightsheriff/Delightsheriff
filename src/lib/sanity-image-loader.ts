// Image loader for next/image that uses Sanity's own image CDN to resize and convert images.
//
// Why: it works the same on any host (Cloudflare, Vercel, Docker, a static host), costs nothing
// on the host, and needs no image-resizing service. Sanity serves the right size and format.
//
// The URLs we pass in are built by @sanity/image-url, so they already carry the crop (rect), a
// base width and height, and fit. Next asks for several widths; for each one we set the width,
// scale the height to keep the same shape, and ask for the best format the browser supports.

const SANITY_CDN = "cdn.sanity.io";

export default function sanityImageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  let url: URL;
  try {
    url = new URL(src);
  } catch {
    // A local path: nothing to resize here.
    return src;
  }
  if (url.hostname !== SANITY_CDN) return src;

  const baseWidth = Number(url.searchParams.get("w"));
  const baseHeight = Number(url.searchParams.get("h"));

  url.searchParams.set("w", String(width));
  if (baseWidth > 0 && baseHeight > 0) {
    url.searchParams.set("h", String(Math.round((width * baseHeight) / baseWidth)));
  }
  url.searchParams.set("q", String(quality ?? 75));
  url.searchParams.set("auto", "format");
  return url.toString();
}
