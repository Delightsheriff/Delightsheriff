import { describe, expect, it } from "vitest";
import { resolveRevalidatePaths } from "./resolve-revalidate-paths";

describe("resolveRevalidatePaths", () => {
  it("always revalidates the homepage", () => {
    expect(resolveRevalidatePaths({ _type: "siteSettings" })).toEqual(["/"]);
  });

  it("also revalidates the projects list for a project change", () => {
    expect(resolveRevalidatePaths({ _type: "project" })).toEqual(["/", "/projects"]);
  });

  it("also revalidates the specific project page when a slug is present", () => {
    expect(resolveRevalidatePaths({ _type: "project", slug: { current: "smarthub" } })).toEqual([
      "/",
      "/projects",
      "/projects/smarthub",
    ]);
  });

  it("ignores a project payload with no slug", () => {
    expect(resolveRevalidatePaths({ _type: "project", slug: {} })).toEqual(["/", "/projects"]);
  });

  it("only revalidates the homepage for an unrecognized document type", () => {
    expect(resolveRevalidatePaths({ _type: "someFutureSchema" })).toEqual(["/"]);
  });

  it("also revalidates the blog list for a post change", () => {
    expect(resolveRevalidatePaths({ _type: "post" })).toEqual(["/", "/blog"]);
  });

  it("also revalidates the specific post page when a slug is present", () => {
    expect(resolveRevalidatePaths({ _type: "post", slug: { current: "hello-world" } })).toEqual([
      "/",
      "/blog",
      "/blog/hello-world",
    ]);
  });
});
