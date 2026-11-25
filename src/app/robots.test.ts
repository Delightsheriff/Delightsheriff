import { describe, expect, it } from "vitest";
import robots from "./robots";

type Rule = { userAgent?: string | string[]; allow?: string | string[]; disallow?: string | string[] };

describe("robots", () => {
  const result = robots();
  const rules = (Array.isArray(result.rules) ? result.rules : [result.rules]) as Rule[];
  const agents = rules.flatMap((rule) => (Array.isArray(rule.userAgent) ? rule.userAgent : [rule.userAgent]));

  it("welcomes everyone to the public site and keeps Studio and the API private", () => {
    const everyone = rules.find((rule) => rule.userAgent === "*")!;
    expect(everyone.allow).toBe("/");
    expect(everyone.disallow).toEqual(["/studio", "/api/"]);
  });

  it("names the search engines and the main AI assistants", () => {
    for (const bot of ["Googlebot", "Bingbot", "Google-Extended", "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Applebot-Extended"]) {
      expect(agents).toContain(bot);
    }
  });

  it("repeats the private paths for named crawlers, since they ignore the * group", () => {
    const named = rules.find((rule) => Array.isArray(rule.userAgent))!;
    expect(named.disallow).toEqual(["/studio", "/api/"]);
  });

  it("points at the sitemap", () => {
    expect(result.sitemap).toBe("https://www.delightsheriff.com/sitemap.xml");
  });
});
