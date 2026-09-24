export type WebhookPayload = {
  _type: string;
  slug?: { current?: string };
};

export function resolveRevalidatePaths(payload: WebhookPayload): string[] {
  const paths = new Set<string>(["/"]);

  if (payload._type === "project") {
    paths.add("/projects");
    if (payload.slug?.current) {
      paths.add(`/projects/${payload.slug.current}`);
    }
  }

  if (payload._type === "post") {
    paths.add("/blog");
    if (payload.slug?.current) {
      paths.add(`/blog/${payload.slug.current}`);
    }
  }

  return [...paths];
}
