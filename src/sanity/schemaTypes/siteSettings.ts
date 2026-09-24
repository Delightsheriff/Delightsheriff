import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  // Singleton — only one document of this type should ever exist.
  fields: [
    defineField({ name: "heroName", title: "Hero — Name", type: "string" }),
    defineField({ name: "heroTitle", title: "Hero — Title", type: "string" }),
    defineField({ name: "openToWorkLabel", title: "Hero — Status label", type: "string" }),
    defineField({ name: "tagline", title: "Hero — Tagline / positioning line", type: "text", rows: 3 }),
    defineField({ name: "email", title: "Contact — Email", type: "string" }),
    defineField({ name: "githubUrl", title: "Contact — GitHub URL", type: "url" }),
    defineField({ name: "linkedinUrl", title: "Contact — LinkedIn URL", type: "url" }),
    defineField({
      name: "resumeUrl",
      title: "Resume — Google Docs preview link",
      type: "url",
      description:
        "Use the doc's live preview URL (docs.google.com/document/d/FILE_ID/preview) so it opens " +
        "as a page instead of downloading — the export URL forces a download even in a new tab. " +
        "The doc must stay shared as \"Anyone with the link: Viewer\". Editing the doc updates the " +
        "resume everywhere automatically.",
    }),
    defineField({
      name: "showAvatar",
      title: "Hero — Show avatar",
      type: "boolean",
      initialValue: false,
      description: "Toggle the hero photo on or off anytime without removing it.",
    }),
    defineField({
      name: "avatar",
      title: "Hero — Avatar photo",
      type: "image",
      options: { hotspot: true },
      description:
        "Set the crop/focal point here (drag the hotspot circle onto your face) — the site renders " +
        "this as a small circle, so frame tightly.",
      fields: [{ name: "alt", title: "Alt text", type: "string" }],
    }),
    defineField({
      name: "bio",
      title: "Bio paragraphs",
      type: "array",
      of: [{ type: "text", rows: 4 }],
      description: "Each item is one paragraph, rendered in order.",
    }),
    defineField({
      name: "skillGroups",
      title: "Skill groups",
      type: "array",
      of: [
        {
          type: "object",
          name: "skillGroup",
          fields: [
            { name: "label", title: "Label", type: "string" },
            { name: "items", title: "Items", type: "array", of: [{ type: "string" }] },
          ],
          preview: { select: { title: "label" } },
        },
      ],
    }),
    defineField({ name: "footerLine", title: "Footer — closing line", type: "text", rows: 2 }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
