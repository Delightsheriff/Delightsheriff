import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const revalidatePath = vi.fn();
vi.mock("next/cache", () => ({ revalidatePath: (path: string) => revalidatePath(path) }));

const isValidSignature = vi.fn();
vi.mock("@sanity/webhook", () => ({
  SIGNATURE_HEADER_NAME: "sanity-webhook-signature",
  isValidSignature: (...args: unknown[]) => isValidSignature(...args),
}));

function makeRequest(body: string, headers: Record<string, string> = {}) {
  return new NextRequest("https://www.delightsheriff.com/api/revalidate", {
    method: "POST",
    body,
    headers,
  });
}

describe("POST /api/revalidate", () => {
  const originalSecret = process.env.SANITY_REVALIDATE_SECRET;

  beforeEach(() => {
    process.env.SANITY_REVALIDATE_SECRET = "test-secret";
    revalidatePath.mockReset();
    isValidSignature.mockReset();
  });

  afterEach(() => {
    process.env.SANITY_REVALIDATE_SECRET = originalSecret;
  });

  it("rejects with 500 when the server has no configured secret", async () => {
    delete process.env.SANITY_REVALIDATE_SECRET;
    const { POST } = await import("./route");

    const res = await POST(makeRequest("{}"));

    expect(res.status).toBe(500);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("rejects a request with no signature header", async () => {
    const { POST } = await import("./route");

    const res = await POST(makeRequest("{}"));

    expect(res.status).toBe(401);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("rejects a request whose signature doesn't verify", async () => {
    isValidSignature.mockResolvedValue(false);
    const { POST } = await import("./route");

    const res = await POST(makeRequest("{}", { "sanity-webhook-signature": "bad" }));

    expect(res.status).toBe(401);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("revalidates the resolved paths for a validly signed project update", async () => {
    isValidSignature.mockResolvedValue(true);
    const { POST } = await import("./route");

    const body = JSON.stringify({ _type: "project", slug: { current: "smarthub" } });
    const res = await POST(makeRequest(body, { "sanity-webhook-signature": "good" }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.paths).toEqual(["/", "/projects", "/projects/smarthub"]);
    expect(revalidatePath).toHaveBeenCalledWith("/");
    expect(revalidatePath).toHaveBeenCalledWith("/projects");
    expect(revalidatePath).toHaveBeenCalledWith("/projects/smarthub");
  });
});
