import { revalidatePath } from "next/cache";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { type NextRequest, NextResponse } from "next/server";

type WebhookPayload = {
  _type: string;
  slug?: { current?: string };
};

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ message: "Missing SANITY_REVALIDATE_SECRET" }, { status: 500 });
  }

  const body = await req.text();
  const signature = req.headers.get(SIGNATURE_HEADER_NAME);

  if (!signature || !(await isValidSignature(body, signature, secret))) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  const payload: WebhookPayload = JSON.parse(body);

  const paths = new Set<string>(["/"]);

  if (payload._type === "project") {
    paths.add("/projects");
    if (payload.slug?.current) {
      paths.add(`/projects/${payload.slug.current}`);
    }
  }

  if (payload._type === "workEntry" || payload._type === "siteSettings") {
    paths.add("/");
  }

  for (const path of paths) {
    revalidatePath(path);
  }

  return NextResponse.json({ revalidated: true, paths: [...paths], now: Date.now() });
}
