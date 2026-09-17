import { defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: { list: ["web", "mobile", "api"] },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description (short — homepage/catalog)",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(220),
    }),
    defineField({
      name: "challenge",
      title: "Challenge",
      type: "text",
      rows: 4,
      description: "What problem, need, or constraint did the project address?",
    }),
    defineField({
      name: "contribution",
      title: "Contribution",
      type: "text",
      rows: 4,
      description: "What did you own or build?",
    }),
    defineField({
      name: "outcome",
      title: "Outcome",
      type: "text",
      rows: 4,
      description: "What changed as a result? Include evidence where possible.",
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      description: "Your contribution, for example: Product engineer",
    }),
    defineField({
      name: "impact",
      title: "Impact",
      type: "string",
      description: "The clearest result or outcome of the work",
    }),
    defineField({
      name: "highlights",
      title: "Highlights",
      type: "array",
      of: [{ type: "string" }],
      description: "Two or three concise achievements for the detail page",
    }),
    defineField({
      name: "thumbnail",
      title: "Thumbnail",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Alt text", type: "string" }],
    }),
    defineField({
      name: "body",
      title: "Body (detail page — flowing prose)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "links",
      title: "Links",
      type: "object",
      fields: [
        { name: "source", title: "Source (GitHub)", type: "url" },
        { name: "live", title: "Live", type: "url" },
        { name: "appStore", title: "App Store", type: "url" },
        { name: "playStore", title: "Play Store", type: "url" },
      ],
    }),
    defineField({
      name: "screenshots",
      title: "Screenshots",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [{ name: "caption", title: "Caption", type: "string" }],
        },
      ],
    }),
    defineField({
      name: "featured",
      title: "Featured (shows on homepage top 3)",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "category" },
  },
});
