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
  role?: string;
  impact?: string;
  highlights?: string[];
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
  role,
  impact,
  highlights,
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

export type SanityWorkEntry = {
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate?: string;
  present: boolean;
  bio: string;
};

const WORK_ENTRIES_QUERY = /* groq */ `
  *[_type == "workEntry"] | order(order asc) {
    company, role, location, startDate, endDate, present, bio
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
};

const SITE_SETTINGS_QUERY = /* groq */ `
  *[_type == "siteSettings"][0] {
    heroName, heroTitle, openToWorkLabel, tagline, email, githubUrl, linkedinUrl,
    bio, skillGroups, footerLine, resumeUrl
  }
`;

export const getSiteSettings = cache(async (): Promise<SiteSettings | null> => {
  return client.fetch(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 60 } });
});
