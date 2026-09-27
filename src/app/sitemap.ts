import type { MetadataRoute } from "next";
import { getAllProjects, getAllPosts } from "@/sanity/queries";

const BASE_URL = "https://www.delightsheriff.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts] = await Promise.all([getAllProjects(), getAllPosts()]);

  return [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/projects`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/blog`, changeFrequency: "weekly", priority: 0.7 },
    ...projects.map((p) => ({
      url: `${BASE_URL}/projects/${p.slug}`,
      ...(p.updatedAt && { lastModified: new Date(p.updatedAt) }),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...posts.map((p) => ({
      url: `${BASE_URL}/blog/${p.slug}`,
      lastModified: new Date(p.updatedAt ?? p.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
