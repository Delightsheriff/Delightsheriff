import { llmsResponse } from "@/lib/llms-response";

export const revalidate = 3600;

// The same profile with every achievement, highlight and link.
export async function GET() {
  return llmsResponse(true);
}
