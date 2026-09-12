import { type SchemaTypeDefinition } from "sanity";
import { project } from "./project";
import { workEntry } from "./workEntry";
import { siteSettings } from "./siteSettings";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [project, workEntry, siteSettings],
};
