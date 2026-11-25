import type { SanityProject, SanityWorkEntry, SiteSettings } from "@/sanity/queries";
import { categoryLabel } from "@/lib/project-categories";

// One place for everything search engines and AI assistants should agree on.

export const SITE_URL = "https://www.delightsheriff.com";
export const SITE_NAME = "Delight Amadi Sheriff";
export const X_URL = "https://x.com/delightsheriff";

// Every page points AI assistants at the plain-text profile.
export const LLMS_TYPES = { "text/markdown": "/llms.txt" };

// Stable ids let separate JSON-LD blocks on different pages point at the same entities.
export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const PROFILE_ID = `${SITE_URL}/#profile`;

// People search for names written in different ways. These are all genuinely used.
export const ALTERNATE_NAMES = ["Delight Sheriff", "Delight Amadi-Sheriff", "Amadi-Sheriff Delight"];

export const HOME_TITLE = "Delight Amadi Sheriff | Full-Stack & React Native Developer";
export const HOME_DESCRIPTION =
  "Full-stack and mobile developer open to remote roles worldwide. React, Next.js, Node.js, React Native. Secure payments, real-time and CRM systems in production.";

// Search phrases a hiring manager would use, in the order that matters most.
export const SEO_KEYWORDS = [
  "Delight Amadi Sheriff",
  "Delight Sheriff",
  "full-stack developer",
  "React Native developer",
  "Next.js developer",
  "Node.js developer",
  "TypeScript developer",
  "remote software engineer",
  "hire full-stack developer",
  "hire React Native developer",
  "software engineer Nigeria",
  "Next.js developer Nigeria",
  "mobile app developer",
  "payments integration developer",
  "Paystack developer",
];

// From the resume. Education is not in the CMS, so it lives here.
const UNIVERSITY = "University of Port Harcourt";
const CREDENTIALS = [
  { name: "B.Sc. Computer Science", category: "degree", by: UNIVERSITY, type: "CollegeOrUniversity" },
  { name: "ALX Software Engineering", category: "certificate", by: "ALX", type: "Organization" },
  { name: "ALX Professional Foundations", category: "certificate", by: "ALX", type: "Organization" },
  { name: "NIIT Python Programming", category: "certificate", by: "NIIT", type: "Organization" },
];

// Safe to put inside a <script> tag.
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}

type SiteData = {
  settings: SiteSettings | null;
  work: SanityWorkEntry[];
};

// The entities every page can refer to: the website and the person behind it.
export function buildSiteGraph({ settings, work }: SiteData) {
  const current = work.find((entry) => entry.present && entry.company !== "Freelance");
  const skills = unique(settings?.skillGroups.flatMap((group) => group.items) ?? []).filter((item) => item.length <= 40);
  const sameAs = [settings?.githubUrl, settings?.linkedinUrl, X_URL].filter((url): url is string => Boolean(url));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: SITE_NAME,
        description: HOME_DESCRIPTION,
        inLanguage: "en",
        publisher: { "@id": PERSON_ID },
        about: { "@id": PERSON_ID },
      },
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: SITE_NAME,
        alternateName: ALTERNATE_NAMES,
        url: SITE_URL,
        mainEntityOfPage: { "@id": PROFILE_ID },
        jobTitle: settings?.heroTitle ?? "Full-Stack Software Engineer",
        description: HOME_DESCRIPTION,
        ...(settings?.email && { email: settings.email }),
        sameAs,
        knowsAbout: unique([
          "Full-stack development",
          "Mobile app development",
          "Payments integration",
          "Real-time systems",
          "Application security",
          ...skills,
        ]),
        knowsLanguage: "en",
        nationality: { "@type": "Country", name: "Nigeria" },
        homeLocation: {
          "@type": "Place",
          name: "Nigeria",
          address: { "@type": "PostalAddress", addressCountry: "NG" },
        },
        alumniOf: { "@type": "CollegeOrUniversity", name: UNIVERSITY },
        hasCredential: CREDENTIALS.map((credential) => ({
          "@type": "EducationalOccupationalCredential",
          name: credential.name,
          credentialCategory: credential.category,
          recognizedBy: { "@type": credential.type, name: credential.by },
        })),
        hasOccupation: {
          "@type": "Occupation",
          name: "Software Engineer",
          skills: skills.join(", "),
        },
        ...(current && { worksFor: { "@type": "Organization", name: current.company } }),
      },
    ],
  };
}

// The home page is a profile page about the person, and a list of their work.
export function buildHomeGraph(projects: SanityProject[], modified?: Date) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": PROFILE_ID,
        url: SITE_URL,
        name: HOME_TITLE,
        description: HOME_DESCRIPTION,
        inLanguage: "en",
        isPartOf: { "@id": WEBSITE_ID },
        mainEntity: { "@id": PERSON_ID },
        ...(modified && { dateModified: modified.toISOString() }),
      },
      {
        "@type": "ItemList",
        name: "Projects by Delight Amadi Sheriff",
        itemListElement: projects.map((project, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${SITE_URL}/projects/${project.slug}`,
          name: project.name,
        })),
      },
    ],
  };
}

export function projectUrl(slug: string): string {
  return `${SITE_URL}/projects/${slug}`;
}

// A project is creative work with source code behind it. Kept deliberately plain so it describes
// what the project is without claiming rich-result features (ratings, offers) it does not have.
export function buildProjectGraph(project: SanityProject, image?: string) {
  const url = projectUrl(project.slug);
  const sameAs = [project.links?.live, project.links?.appStore, project.links?.playStore, project.links?.source].filter(
    (link): link is string => Boolean(link),
  );

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": project.links?.source ? ["CreativeWork", "SoftwareSourceCode"] : "CreativeWork",
        "@id": `${url}#project`,
        url,
        name: project.name,
        description: project.description,
        genre: categoryLabel(project.category),
        datePublished: String(project.year),
        keywords: project.tags.join(", "),
        inLanguage: "en",
        author: { "@id": PERSON_ID },
        creator: { "@id": PERSON_ID },
        isPartOf: { "@id": WEBSITE_ID },
        ...(project.role && { contributor: { "@type": "Role", roleName: project.role, contributor: { "@id": PERSON_ID } } }),
        ...(image && { image }),
        ...(sameAs.length > 0 && { sameAs }),
        ...(project.links?.source && { codeRepository: project.links.source }),
        ...(project.links?.source && project.tags.length > 0 && { programmingLanguage: project.tags }),
        ...(project.impact && { abstract: project.impact }),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: project.name, item: url },
        ],
      },
    ],
  };
}

// Search snippets cut off around 155 characters, so lead with what matters.
export function projectDescription(project: Pick<SanityProject, "name" | "description" | "impact">): string {
  const text = project.impact ? `${project.description} ${project.impact}.` : project.description;
  if (text.length <= 160) return text;
  const cut = text.slice(0, 157);
  return `${cut.slice(0, cut.lastIndexOf(" "))}...`;
}
