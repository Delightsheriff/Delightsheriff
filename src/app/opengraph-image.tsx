import { ImageResponse } from "next/og";
import { getSiteSettings } from "@/sanity/queries";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const settings = await getSiteSettings();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#090b0c",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 48,
            height: 48,
            borderRadius: 10,
            background: "#193cb8",
            color: "#eff6ff",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            fontWeight: 700,
          }}
        >
          DS
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", fontSize: 64, fontWeight: 700, color: "#eff6ff" }}>
            {settings?.heroName ?? "Delight Amadi Sheriff"}
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#9a9aa0" }}>
            {settings?.heroTitle ?? "Software Engineer"}
          </div>
          <div style={{ display: "flex", fontSize: 22, color: "#c5c5ca", maxWidth: 900 }}>
            {settings?.tagline ??
              "Full-stack and mobile engineer. I build production systems, not demos."}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
