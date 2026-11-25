import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Only for the Docker build, which runs the site as a plain Node server.
  ...(process.env.BUILD_STANDALONE ? { output: "standalone" as const } : {}),
  images: {
    loader: "custom",
    loaderFile: "./src/lib/sanity-image-loader.ts",
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
    // AVIF is much smaller than WebP for screenshots. Project images never change under the same URL.
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  // The home page lists every project, so the old index page now points there.
  async redirects() {
    return [{ source: "/projects", destination: "/#projects", permanent: true }];
  },
};

export default nextConfig;
