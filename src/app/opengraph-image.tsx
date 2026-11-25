import { ImageResponse } from "next/og";
import { getSiteSettings } from "@/sanity/queries";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Delight Amadi Sheriff, full-stack and React Native developer";

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
          backgroundColor: "#0a0b0e",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 48,
            height: 48,
            borderRadius: 10,
             background: "#ecedf0",
            color: "#0a0b0e",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            fontWeight: 700,
          }}
        >
          DS
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", fontSize: 64, fontWeight: 700, color: "#ecedf0" }}>
            {settings?.heroName ?? "Delight Amadi Sheriff"}
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#959aa6" }}>
            {settings?.heroTitle ?? "Software Engineer"}
          </div>
          <div style={{ display: "flex", fontSize: 22, color: "#ecedf0", maxWidth: 900 }}>
            {settings?.tagline ??
              "Full-stack and mobile engineer. I build production systems, not demos."}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
