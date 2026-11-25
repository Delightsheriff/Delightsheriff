import { describe, expect, it } from "vitest";
import type { SanityProject, SanityWorkEntry, SiteSettings } from "@/sanity/queries";
import {
  HOME_DESCRIPTION,
  HOME_TITLE,
  PERSON_ID,
  PROFILE_ID,
  SITE_URL,
  WEBSITE_ID,
  buildHomeGraph,
  buildProjectGraph,
  buildSiteGraph,
  jsonLd,
  projectDescription,
} from "./seo";

const settings: SiteSettings = {
  heroName: "Delight Amadi Sheriff",
  heroTitle: "Full-Stack Software Engineer",
  openToWorkLabel: "Open to work",
  tagline: "I build production systems.",
  email: "hello@example.com",
  githubUrl: "https://github.com/delightsheriff",
  linkedinUrl: "https://linkedin.com/in/delightsheriff",
  bio: [],
  skillGroups: [
    { label: "Web", items: ["React", "Next.js"] },
    { label: "Backend", items: ["Node.js", "React"] },
  ],
  footerLine: "Open to roles.",
};

const work: SanityWorkEntry[] = [
  { company: "Freelance", role: "Engineer", startDate: "2023-01", present: true, bio: "x" },
  { company: "SmartTech Global", role: "Software Engineer", startDate: "2025-03", present: true, bio: "x" },
  { company: "Old Co", role: "Dev", startDate: "2020-01", endDate: "2021-01", present: false, bio: "x" },
];

const project: SanityProject = {
  slug: "smarthub",
  name: "SmartHub",
  category: "web",
  featured: true,
  year: 2026,
  description: "A learning platform.",
  tags: ["Next.js", "Node.js"],
  links: { live: "https://smart-hub.academy", source: "https://github.com/x/smarthub" },
  order: 1,
  hasDemo: false,
  role: "Core team",
  impact: "700+ registered users",
};

type Node = Record<string, unknown>;
const nodes = (graph: { "@graph": Node[] }) => graph["@graph"];
const byType = (graph: { "@graph": Node[] }, type: string) => nodes(graph).find((n) => n["@type"] === type)!;

describe("buildSiteGraph", () => {
  const graph = buildSiteGraph({ settings, work });

  it("describes the website and the person with stable ids", () => {
    expect(byType(graph, "WebSite")["@id"]).toBe(WEBSITE_ID);
    expect(byType(graph, "Person")["@id"]).toBe(PERSON_ID);
  });

  it("links the person to every profile, including X", () => {
    expect(byType(graph, "Person").sameAs).toEqual([
      "https://github.com/delightsheriff",
      "https://linkedin.com/in/delightsheriff",
      "https://x.com/delightsheriff",
    ]);
  });

  it("lists name variants people actually search for", () => {
    expect(byType(graph, "Person").alternateName).toEqual(expect.arrayContaining(["Delight Sheriff", "Delight Amadi-Sheriff"]));
  });

  it("names the current employer, not Freelance or past roles", () => {
    expect(byType(graph, "Person").worksFor).toEqual({ "@type": "Organization", name: "SmartTech Global" });
  });

  it("dedupes skills and includes them as knowsAbout", () => {
    const known = byType(graph, "Person").knowsAbout as string[];
    expect(known.filter((k) => k === "React")).toHaveLength(1);
    expect(known).toEqual(expect.arrayContaining(["Next.js", "Node.js", "Full-stack development"]));
  });

  it("places the person in Nigeria and includes education", () => {
    const person = byType(graph, "Person");
    expect(person.nationality).toEqual({ "@type": "Country", name: "Nigeria" });
    expect(person.alumniOf).toEqual({ "@type": "CollegeOrUniversity", name: "University of Port Harcourt" });
  });

  it("still produces a valid graph when the CMS is unavailable", () => {
    const empty = buildSiteGraph({ settings: null, work: [] });
    expect(byType(empty, "Person").jobTitle).toBe("Full-Stack Software Engineer");
    expect(byType(empty, "Person")).not.toHaveProperty("email");
  });
});

describe("buildHomeGraph", () => {
  it("makes the home page a profile page about the person", () => {
    const graph = buildHomeGraph([project], new Date("2026-11-01T00:00:00Z"));
    const page = byType(graph, "ProfilePage");
    expect(page["@id"]).toBe(PROFILE_ID);
    expect(page.mainEntity).toEqual({ "@id": PERSON_ID });
    expect(page.dateModified).toBe("2026-11-01T00:00:00.000Z");
    expect(page.name).toBe(HOME_TITLE);
  });

  it("lists every project with its case study url in order", () => {
    const list = byType(buildHomeGraph([project, { ...project, slug: "osan", name: "Osan" }]), "ItemList");
    expect(list.itemListElement).toEqual([
      { "@type": "ListItem", position: 1, url: `${SITE_URL}/projects/smarthub`, name: "SmartHub" },
      { "@type": "ListItem", position: 2, url: `${SITE_URL}/projects/osan`, name: "Osan" },
    ]);
  });
});

describe("buildProjectGraph", () => {
  it("credits the person as author and links the live site and source", () => {
    const graph = buildProjectGraph(project, "https://cdn.example.com/a.png");
    const node = nodes(graph)[0];
    expect(node["@type"]).toEqual(["CreativeWork", "SoftwareSourceCode"]);
    expect(node.author).toEqual({ "@id": PERSON_ID });
    expect(node.sameAs).toEqual(["https://smart-hub.academy", "https://github.com/x/smarthub"]);
    expect(node.codeRepository).toBe("https://github.com/x/smarthub");
    expect(node.image).toBe("https://cdn.example.com/a.png");
  });

  it("is plain creative work when there is no source code", () => {
    const node = nodes(buildProjectGraph({ ...project, links: { live: "https://smart-hub.academy" } }))[0];
    expect(node["@type"]).toBe("CreativeWork");
    expect(node).not.toHaveProperty("codeRepository");
  });

  it("adds a breadcrumb back to the home page", () => {
    const crumbs = byType(buildProjectGraph(project), "BreadcrumbList");
    expect(crumbs.itemListElement).toEqual([
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "SmartHub", item: `${SITE_URL}/projects/smarthub` },
    ]);
  });
});

describe("projectDescription", () => {
  it("adds the impact line", () => {
    expect(projectDescription(project)).toBe("A learning platform. 700+ registered users.");
  });

  it("trims long text at a word boundary within 160 characters", () => {
    const long = projectDescription({ ...project, description: "word ".repeat(60), impact: undefined });
    expect(long.length).toBeLessThanOrEqual(160);
    expect(long.endsWith("...")).toBe(true);
    expect(long.endsWith("wo...")).toBe(false);
  });
});

describe("jsonLd", () => {
  it("cannot be broken out of a script tag", () => {
    expect(jsonLd({ name: "</script><script>alert(1)</script>" })).not.toContain("</script>");
  });

  it("keeps the home description inside search snippet length", () => {
    expect(HOME_DESCRIPTION.length).toBeLessThanOrEqual(160);
    expect(HOME_TITLE.length).toBeLessThanOrEqual(60);
  });
});
