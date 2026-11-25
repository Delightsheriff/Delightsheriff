import { defineCliConfig } from "sanity/cli";
import { dataset, projectId } from "./src/sanity/env";

// Used by `pnpm studio:dev` and `pnpm studio:deploy`. The Studio is hosted by Sanity, not by the site.
export default defineCliConfig({
  api: { projectId, dataset },
  studioHost: "delightsheriff",
});
