import { defineCliConfig } from "sanity/cli";
import { dataset, projectId } from "./src/sanity/env";

// Used by `pnpm studio:build`, which writes the Studio into public/studio so the site can serve
// it as static files. Keeping it out of the Next.js app keeps it out of the Worker script.
export default defineCliConfig({
  api: { projectId, dataset },
  project: { basePath: "/studio" },
  // The Studio build only passes SANITY_STUDIO_* variables to the browser, but the schema code
  // shares src/sanity/env.ts with the site. Both values are public.
  vite: (config) => ({
    ...config,
    define: {
      ...config.define,
      "process.env.NEXT_PUBLIC_SANITY_PROJECT_ID": JSON.stringify(projectId),
      "process.env.NEXT_PUBLIC_SANITY_DATASET": JSON.stringify(dataset),
    },
  }),
});
