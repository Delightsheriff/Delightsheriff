import { ImageResponse } from "next/og";
import { getAllProjects, getProjectBySlug } from "@/sanity/queries";
import { categoryLabel } from "@/lib/project-categories";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Case study by Delight Amadi Sheriff";

// Built at deploy time, one share card per case study.
export const dynamicParams = false;

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map(({ slug }) => ({ slug }));
}

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
          {project && (
            <div style={{ display: "flex", fontSize: 24, color: "#959aa6" }}>
              {categoryLabel(project.category)} / {project.year}
            </div>
          )}
          <div style={{ display: "flex", fontSize: 64, fontWeight: 700, color: "#ecedf0" }}>
            {project?.name ?? "Project"}
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#ecedf0", maxWidth: 900 }}>
            {project?.description ?? ""}
          </div>
          {project?.tags && project.tags.length > 0 && (
            <div style={{ display: "flex", fontSize: 20, color: "#959aa6", marginTop: 8 }}>
              {project.tags.join(", ")}
            </div>
          )}
          {project?.impact && (
            <div style={{ display: "flex", fontSize: 20, color: "#ecedf0", marginTop: 8 }}>
              {project.impact}
            </div>
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
