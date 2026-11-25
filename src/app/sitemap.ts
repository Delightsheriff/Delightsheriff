import type { MetadataRoute } from "next";
import { getAllProjects, getAllPosts } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import { SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts] = await Promise.all([getAllProjects(), getAllPosts()]);

  // The home page changes whenever any project does.
  const latest = projects
    .map((project) => (project.updatedAt ? new Date(project.updatedAt) : undefined))
    .filter((date): date is Date => Boolean(date))
    .sort((a, b) => b.getTime() - a.getTime())[0];

  return [
    { url: SITE_URL, ...(latest && { lastModified: latest }), changeFrequency: "weekly", priority: 1 },
    ...(posts.length > 0 ? [{ url: `${SITE_URL}/blog`, changeFrequency: "weekly" as const, priority: 0.7 }] : []),
    ...projects.map((project) => ({
      url: `${SITE_URL}/projects/${project.slug}`,
      ...(project.updatedAt && { lastModified: new Date(project.updatedAt) }),
      changeFrequency: "monthly" as const,
      priority: project.featured ? 0.8 : 0.6,
      ...(project.thumbnail && { images: [urlFor(project.thumbnail.asset).width(1200).url()] }),
    })),
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt ?? post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
