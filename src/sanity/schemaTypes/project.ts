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
      options: { list: ["web", "mobile", "api", "macos"] },
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
      name: "demo",
      title: "Demo recording",
      type: "object",
      description: "A short silent loop shown at the top of the case study. Keep it under ~5 MB.",
      fields: [
        defineField({
          name: "video",
          title: "Video",
          type: "file",
          options: { accept: "video/mp4,video/webm" },
        }),
        defineField({
          name: "poster",
          title: "Poster",
          type: "image",
          description: "A frame from the recording, at the same size. Its dimensions set the player's aspect ratio.",
          validation: (rule) =>
            rule.custom((poster, context) => {
              const demo = context.parent as { video?: { asset?: unknown } } | undefined;
              return demo?.video?.asset && !poster ? "Add a poster so the player can reserve its size" : true;
            }),
        }),
        defineField({
          name: "caption",
          title: "Caption",
          type: "string",
        }),
        defineField({
          name: "frame",
          title: "Frame",
          type: "string",
          description: "Use None when the recording already includes a device frame.",
          options: {
            list: [
              { title: "None", value: "none" },
              { title: "Phone", value: "phone" },
              { title: "Browser", value: "browser" },
            ],
            layout: "radio",
          },
          initialValue: "none",
        }),
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
