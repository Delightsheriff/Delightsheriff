import { getAllProjects } from "@/sanity/queries";
import { buildArdManifest } from "@/lib/ard";

export const revalidate = 3600;

// Tells AI agents and registries what this domain publishes. See lib/ard.ts.
export async function GET() {
  const projects = await getAllProjects();
  const latest = projects
    .map((project) => (project.updatedAt ? new Date(project.updatedAt) : undefined))
    .filter((date): date is Date => Boolean(date))
    .sort((a, b) => b.getTime() - a.getTime())[0];

  return new Response(JSON.stringify(buildArdManifest(latest), null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
