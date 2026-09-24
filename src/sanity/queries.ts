import type { PortableTextBlock } from "@portabletext/react";
import type { SanityImageSource } from "@sanity/image-url";
import { cache } from "react";
import { client } from "./client";

export type SanityProject = {
  slug: string;
  name: string;
  category: string;
  year: number;
  description: string;
  challenge?: string;
  contribution?: string;
  outcome?: string;
  role?: string;
  impact?: string;
  highlights?: string[];
  thumbnail?: { asset: SanityImageSource; alt?: string };
  tags: string[];
  links: { source?: string; live?: string; appStore?: string; playStore?: string };
  order: number;
};

export type SanityProjectDetail = SanityProject & {
  body: PortableTextBlock[];
  screenshots: { asset: SanityImageSource; caption?: string; _key: string }[];
};

const PROJECT_FIELDS = /* groq */ `
  "slug": slug.current,
  name,
  category,
  year,
  description,
  challenge,
  contribution,
  outcome,
  role,
  impact,
  highlights,
  thumbnail,
  tags,
  links,
  order
`;

const FEATURED_PROJECTS_QUERY = /* groq */ `
  *[_type == "project" && featured == true] | order(order asc) { ${PROJECT_FIELDS} }
`;

const ALL_PROJECTS_QUERY = /* groq */ `
  *[_type == "project"] | order(category asc, order asc) { ${PROJECT_FIELDS} }
`;

const PROJECT_BY_SLUG_QUERY = /* groq */ `
  *[_type == "project" && slug.current == $slug][0] {
    ${PROJECT_FIELDS},
    body,
    screenshots
  }
`;

export async function getFeaturedProjects(): Promise<SanityProject[]> {
  return client.fetch(FEATURED_PROJECTS_QUERY, {}, { next: { revalidate: 60 } });
}

export async function getAllProjects(): Promise<SanityProject[]> {
  return client.fetch(ALL_PROJECTS_QUERY, {}, { next: { revalidate: 60 } });
}

export async function getProjectBySlug(slug: string): Promise<SanityProjectDetail | null> {
  return client.fetch(PROJECT_BY_SLUG_QUERY, { slug }, { next: { revalidate: 60 } });
}

export async function getProjectNavigation(slug: string): Promise<{
  previous: SanityProject | null;
  next: SanityProject | null;
}> {
  const projects = await getAllProjects();
  const index = projects.findIndex((project) => project.slug === slug);

  return {
    previous: index > 0 ? projects[index - 1] : null,
    next: index >= 0 && index < projects.length - 1 ? projects[index + 1] : null,
  };
}

export type SanityWorkEntry = {
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate?: string;
  present: boolean;
  bio: string;
  achievements?: string[];
};

const WORK_ENTRIES_QUERY = /* groq */ `
  *[_type == "workEntry"] | order(order asc) {
    company, role, location, startDate, endDate, present, bio, achievements
  }
`;

export async function getWorkEntries(): Promise<SanityWorkEntry[]> {
  return client.fetch(WORK_ENTRIES_QUERY, {}, { next: { revalidate: 60 } });
}

export type SkillGroup = { label: string; items: string[] };

export type SiteSettings = {
  heroName: string;
  heroTitle: string;
  openToWorkLabel: string;
  tagline: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  bio: string[];
  skillGroups: SkillGroup[];
  footerLine: string;
  resumeUrl?: string;
  showAvatar?: boolean;
  avatar?: { asset: SanityImageSource; alt?: string };
};

const SITE_SETTINGS_QUERY = /* groq */ `
  *[_type == "siteSettings"][0] {
    heroName, heroTitle, openToWorkLabel, tagline, email, githubUrl, linkedinUrl,
    bio, skillGroups, footerLine, resumeUrl, showAvatar, avatar
  }
`;

export const getSiteSettings = cache(async (): Promise<SiteSettings | null> => {
  return client.fetch(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 60 } });
});

export type SanityPost = {
  slug: string;
  title: string;
  publishedAt: string;
  excerpt: string;
  coverImage?: { asset: SanityImageSource; alt?: string };
  tags?: string[];
};

export type SanityPostDetail = SanityPost & {
  body: PortableTextBlock[];
};

const POST_FIELDS = /* groq */ `
  "slug": slug.current,
  title,
  publishedAt,
  excerpt,
  coverImage,
  tags
`;

const ALL_POSTS_QUERY = /* groq */ `
  *[_type == "post"] | order(publishedAt desc) { ${POST_FIELDS} }
`;

const POST_BY_SLUG_QUERY = /* groq */ `
  *[_type == "post" && slug.current == $slug][0] {
    ${POST_FIELDS},
    body
  }
`;

export async function getAllPosts(): Promise<SanityPost[]> {
  return client.fetch(ALL_POSTS_QUERY, {}, { next: { revalidate: 60 } });
}

export async function getPostBySlug(slug: string): Promise<SanityPostDetail | null> {
  return client.fetch(POST_BY_SLUG_QUERY, { slug }, { next: { revalidate: 60 } });
}
