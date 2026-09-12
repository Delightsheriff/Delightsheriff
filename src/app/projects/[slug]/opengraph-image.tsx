import { ImageResponse } from "next/og";
import { getProjectBySlug } from "@/sanity/queries";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

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
          {project && (
            <div style={{ display: "flex", fontSize: 24, color: "#9a9aa0" }}>
              {project.category} · {project.year}
            </div>
          )}
          <div style={{ display: "flex", fontSize: 64, fontWeight: 700, color: "#eff6ff" }}>
            {project?.name ?? "Project"}
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#c5c5ca", maxWidth: 900 }}>
            {project?.description ?? ""}
          </div>
          {project?.tags && project.tags.length > 0 && (
            <div style={{ display: "flex", fontSize: 20, color: "#7a7a80", marginTop: 8 }}>
              {project.tags.join(" · ")}
            </div>
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
