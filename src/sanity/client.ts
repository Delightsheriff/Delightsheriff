import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "./env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Pages are built once per deploy, often seconds after a publish, so read the live API.
  // The CDN could still be serving the old content at that moment.
  useCdn: false,
});
