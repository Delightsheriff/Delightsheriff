import { llmsResponse } from "@/lib/llms-response";

export const dynamic = "force-static";

// A short, plain-text profile for AI assistants. See also /llms-full.txt.
export async function GET() {
  return llmsResponse(false);
}
