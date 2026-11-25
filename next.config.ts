import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  // The home page lists every project, so the old index page now points there.
  async redirects() {
    return [{ source: "/projects", destination: "/#projects", permanent: true }];
  },
};

export default nextConfig;
