import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#193cb8",
          borderRadius: 6,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 16,
            fontWeight: 700,
            color: "#eff6ff",
            letterSpacing: "-0.02em",
          }}
        >
          DS
        </div>
      </div>
    ),
    { ...size }
  );
}
