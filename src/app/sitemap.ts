import type { MetadataRoute } from "next";
import { getAllProjects } from "@/sanity/queries";

const BASE_URL = "https://www.delightsheriff.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getAllProjects();

  return [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/projects`, changeFrequency: "weekly", priority: 0.8 },
    ...projects.map((p) => ({
      url: `${BASE_URL}/projects/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
