import type { StructureResolver } from "sanity/structure";

// Custom structure: Site Settings is a singleton (edit the one document
// directly, no list/create-new UI for it), everything else lists normally.
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !["siteSettings"].includes(item.getId() ?? "")
      ),
    ]);
