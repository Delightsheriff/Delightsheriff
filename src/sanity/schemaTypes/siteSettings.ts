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
