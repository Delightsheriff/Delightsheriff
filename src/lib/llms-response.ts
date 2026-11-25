import { getAllPosts, getHomeProjects, getSiteSettings, getWorkEntries } from "@/sanity/queries";
import { buildLlms } from "@/lib/llms";

// Shared by /llms.txt and /llms-full.txt.
export async function llmsResponse(full: boolean): Promise<Response> {
  const [settings, work, { featured, more }, posts] = await Promise.all([
    getSiteSettings(),
    getWorkEntries(),
    getHomeProjects(),
    getAllPosts(),
  ]);

  if (!settings) {
    return new Response("Profile temporarily unavailable.\n", { status: 503, headers: { "Retry-After": "300" } });
  }

  return new Response(buildLlms({ settings, work, projects: [...featured, ...more], posts }, full), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
