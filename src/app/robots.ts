import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Search engines and AI assistants are welcome everywhere public. A crawler with its own group
// ignores the "*" group, so the private paths are repeated for every group.
const PRIVATE_PATHS = ["/studio", "/api/"];

const SEARCH_AND_AI_CRAWLERS = [
  // Search
  "Googlebot",
  "Bingbot",
  "DuckDuckBot",
  "Applebot",
  // Google AI features and Gemini
  "Google-Extended",
  // OpenAI (ChatGPT search, browsing and training)
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  // Anthropic (Claude)
  "Claude-SearchBot",
  "Claude-User",
  "ClaudeBot",
  "anthropic-ai",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Apple Intelligence, Microsoft, Amazon, DuckDuckGo AI, Meta, Mistral, You.com, Common Crawl
  "Applebot-Extended",
  "Amazonbot",
  "DuckAssistBot",
  "Meta-ExternalAgent",
  "MistralAI-User",
  "YouBot",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE_PATHS },
      { userAgent: SEARCH_AND_AI_CRAWLERS, allow: "/", disallow: PRIVATE_PATHS },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
