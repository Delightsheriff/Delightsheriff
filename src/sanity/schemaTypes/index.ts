import { type SchemaTypeDefinition } from "sanity";
import { project } from "./project";
import { workEntry } from "./workEntry";
import { siteSettings } from "./siteSettings";
import { post } from "./post";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [project, workEntry, siteSettings, post],
};
