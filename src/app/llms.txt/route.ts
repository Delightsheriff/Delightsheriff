import { llmsResponse } from "@/lib/llms-response";

export const revalidate = 3600;

// A short, plain-text profile for AI assistants. See also /llms-full.txt.
export async function GET() {
  return llmsResponse(false);
}
