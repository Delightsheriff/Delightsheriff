import type { SanityPost, SanityProject, SanityWorkEntry, SiteSettings } from "@/sanity/queries";
import { formatDateRange, formatLongDate } from "@/lib/format";
import { categoryLabel } from "@/lib/project-categories";
import { ALTERNATE_NAMES, SITE_NAME, SITE_URL, X_URL, postUrl, projectUrl } from "@/lib/seo";

type LlmsData = {
  settings: SiteSettings;
  work: SanityWorkEntry[];
  projects: SanityProject[];
  // Published posts, newest first. Optional: the section only appears when there are some.
  posts?: SanityPost[];
};

// A plain-text profile for AI assistants and answer engines (the llms.txt convention).
// It is built from the same CMS content as the site, so it never drifts out of date.
// `full` adds the detail: every achievement, highlight and skill.
export function buildLlms({ settings, work, projects, posts = [] }: LlmsData, full: boolean): string {
  const lines: string[] = [];
  const push = (...items: string[]) => lines.push(...items);

  push(`# ${SITE_NAME}`, "");
  push(`> ${settings.heroTitle}. ${settings.tagline} Open to remote roles worldwide, and open to relocation. Based in Nigeria.`, "");
  push(
    `${SITE_NAME} (also written ${ALTERNATE_NAMES.join(", ")}) is a full-stack and mobile software engineer open to remote roles worldwide. Delight builds secure payment, real-time and CRM systems that run in production, using React, Next.js, Node.js and React Native.`,
    "",
  );

  push("## Key facts", "");
  push(`- Name: ${SITE_NAME}`);
  push(`- Role: ${settings.heroTitle}`);
  push("- Availability: open to remote roles worldwide, and open to relocation");
  push("- Location: Nigeria");
  push(`- Website: ${SITE_URL}`);
  push(`- GitHub: ${settings.githubUrl}`);
  push(`- LinkedIn: ${settings.linkedinUrl}`);
  push(`- X: ${X_URL}`);
  push(`- Email: ${settings.email}`, "");

  push("## Projects", "");
  for (const project of projects) {
    const impact = project.impact ? ` ${project.impact}.` : "";
    push(`- [${project.name}](${projectUrl(project.slug)}): ${categoryLabel(project.category)} project. ${project.description}${impact}`);
    if (full) {
      push(`  - Role: ${project.role ?? "Engineer"}; stack: ${project.tags.join(", ")}`);
      for (const highlight of project.highlights ?? []) push(`  - ${highlight}`);
      const destinations = [
        project.links?.live && `live ${project.links.live}`,
        project.links?.source && `source ${project.links.source}`,
        project.links?.download && `download ${project.links.download}`,
      ].filter(Boolean);
      if (destinations.length > 0) push(`  - Links: ${destinations.join("; ")}`);
    }
  }
  push("");

  if (posts.length > 0) {
    push("## Writing", "");
    for (const post of posts) push(`- [${post.title}](${postUrl(post.slug)}) (${formatLongDate(post.publishedAt)}): ${post.excerpt}`);
    push("");
  }

  push("## Experience", "");
  for (const entry of work) {
    const dates = formatDateRange(entry.startDate, entry.present ? "Present" : (entry.endDate ?? ""));
    push(`- ${entry.role}, ${entry.company} (${dates}): ${entry.bio}`);
    if (full) for (const achievement of entry.achievements ?? []) push(`  - ${achievement}`);
  }
  push("");

  push("## Skills", "");
  for (const group of settings.skillGroups) push(`- ${group.label}: ${group.items.join(", ")}`);
  push("");

  push("## About", "");
  for (const paragraph of settings.bio) push(paragraph, "");

  push("## Contact", "");
  push(`${settings.footerLine}`, "");
  push(`Email ${settings.email}, or see ${SITE_URL} for links to GitHub and LinkedIn.`, "");

  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
}
