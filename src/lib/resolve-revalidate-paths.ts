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

  return [...paths];
}
