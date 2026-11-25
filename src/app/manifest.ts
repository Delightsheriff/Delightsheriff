import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Delight Amadi Sheriff — Full-Stack Software Engineer",
    short_name: "Delight Sheriff",
    description:
      "Full-stack and mobile software engineer based in Nigeria, building chat, payments, and encrypted systems, shipped in production.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0b0e",
    theme_color: "#0a0b0e",
    icons: [{ src: "/icon", sizes: "32x32", type: "image/png" }],
  };
}
