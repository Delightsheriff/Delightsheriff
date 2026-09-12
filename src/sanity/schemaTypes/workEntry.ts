import { defineField, defineType } from "sanity";

export const workEntry = defineType({
  name: "workEntry",
  title: "Work Entry",
  type: "document",
  fields: [
    defineField({ name: "company", title: "Company", type: "string", validation: (r) => r.required() }),
    defineField({ name: "role", title: "Role", type: "string", validation: (r) => r.required() }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({
      name: "startDate",
      title: "Start date",
      type: "string",
      description: "Format: YYYY-MM",
      validation: (r) => r.required().regex(/^\d{4}-\d{2}$/, { name: "YYYY-MM" }),
    }),
    defineField({
      name: "endDate",
      title: "End date",
      type: "string",
      description: 'Format: YYYY-MM, or leave empty and check "Present" below',
    }),
    defineField({ name: "present", title: "Present (ongoing)", type: "boolean", initialValue: false }),
    defineField({
      name: "bio",
      title: "Bio (prose, not bullets)",
      type: "text",
      rows: 6,
      validation: (r) => r.required(),
    }),
    defineField({ name: "order", title: "Order", type: "number", initialValue: 0 }),
  ],
  preview: {
    select: { title: "role", subtitle: "company" },
  },
});
