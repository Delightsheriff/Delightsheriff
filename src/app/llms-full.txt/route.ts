import { llmsResponse } from "@/lib/llms-response";

export const dynamic = "force-static";

// The same profile with every achievement, highlight and link.
export async function GET() {
  return llmsResponse(true);
}
