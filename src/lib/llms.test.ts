import { describe, expect, it } from "vitest";
import type { SanityProject, SanityWorkEntry, SiteSettings } from "@/sanity/queries";
import { buildLlms } from "./llms";

const settings: SiteSettings = {
  heroName: "Delight Amadi Sheriff",
  heroTitle: "Full-Stack Software Engineer",
  openToWorkLabel: "Open to work",
  tagline: "I build production systems.",
  email: "hello@example.com",
  githubUrl: "https://github.com/delightsheriff",
  linkedinUrl: "https://linkedin.com/in/delightsheriff",
  bio: ["I like things that work."],
  skillGroups: [{ label: "Web", items: ["React", "Next.js"] }],
  footerLine: "Open to full-stack roles.",
};

const work: SanityWorkEntry[] = [
  {
    company: "SmartTech Global",
    role: "Software Engineer",
    startDate: "2025-03",
    present: true,
    bio: "Core team.",
    achievements: ["Designed the referral system."],
  },
];

const projects: SanityProject[] = [
  {
    slug: "smarthub",
    name: "SmartHub",
    category: "web",
    featured: true,
    year: 2026,
    description: "A learning platform.",
    impact: "700+ users",
    highlights: ["Paystack payments"],
    tags: ["Next.js"],
    links: { live: "https://smart-hub.academy" },
    order: 1,
    hasDemo: false,
  },
];

describe("buildLlms", () => {
  const short = buildLlms({ settings, work, projects }, false);
  const full = buildLlms({ settings, work, projects }, true);

  it("follows the llms.txt shape: a title, then a summary quote, then sections", () => {
    expect(short.startsWith("# Delight Amadi Sheriff\n\n> ")).toBe(true);
    expect(short).toContain("## Key facts");
    expect(short).toContain("## Projects");
    expect(short).toContain("## Experience");
    expect(short).toContain("## Skills");
    expect(short).toContain("## Contact");
  });

  it("states availability and location plainly", () => {
    expect(short).toContain("open to remote roles worldwide");
    expect(short).toContain("Location: Nigeria");
  });

  it("links each project to its case study", () => {
    expect(short).toContain("[SmartHub](https://www.delightsheriff.com/projects/smarthub)");
    expect(short).toContain("700+ users.");
  });

  it("dates each role", () => {
    expect(short).toContain("Software Engineer, SmartTech Global (Mar 2025 – Present)");
  });

  it("only the full version carries achievements and highlights", () => {
    expect(short).not.toContain("Designed the referral system.");
    expect(short).not.toContain("Paystack payments");
    expect(full).toContain("Designed the referral system.");
    expect(full).toContain("Paystack payments");
    expect(full).toContain("live https://smart-hub.academy");
  });

  it("ends with a single newline and no runs of blank lines", () => {
    expect(full.endsWith("\n")).toBe(true);
    expect(full.endsWith("\n\n")).toBe(false);
    expect(full).not.toMatch(/\n{3,}/);
  });

  it("has no Writing section until there are posts", () => {
    expect(short).not.toContain("## Writing");
    expect(buildLlms({ settings, work, projects, posts: [] }, false)).not.toContain("## Writing");
  });

  it("lists published posts with their dates once there are some", () => {
    const text = buildLlms(
      {
        settings,
        work,
        projects,
        posts: [{ slug: "hmac", title: "Verifying webhooks", publishedAt: "2026-12-01", excerpt: "Constant time.", tags: [] }],
      },
      false,
    );
    expect(text).toContain("## Writing");
    expect(text).toContain("[Verifying webhooks](https://www.delightsheriff.com/blog/hmac) (December 1, 2026): Constant time.");
    expect(text.indexOf("## Writing")).toBeLessThan(text.indexOf("## Experience"));
  });
});
