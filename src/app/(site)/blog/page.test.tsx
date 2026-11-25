import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const getAllPosts = vi.fn();
vi.mock("@/sanity/queries", () => ({ getAllPosts: () => getAllPosts() }));
vi.mock("@/components/nav-link", () => ({ NavLink: ({ children }: { children: React.ReactNode }) => <a>{children}</a> }));
vi.mock("@/components/post-list-item", () => ({
  PostListItem: ({ title }: { title: string }) => <li>{title}</li>,
}));

import BlogPage, { generateMetadata } from "./page";

beforeEach(() => getAllPosts.mockReset());
afterEach(cleanup);

describe("blog page", () => {
  it("shows an empty state instead of a not-found page when there are no posts", async () => {
    getAllPosts.mockResolvedValue([]);
    render(await BlogPage());
    expect(screen.getByRole("heading", { name: "Blog" })).toBeInTheDocument();
    expect(screen.getByText("No posts yet")).toBeInTheDocument();
  });

  it("keeps the empty page out of search results", async () => {
    getAllPosts.mockResolvedValue([]);
    expect((await generateMetadata()).robots).toEqual({ index: false, follow: true });
  });

  it("lists posts and allows indexing once there are some", async () => {
    getAllPosts.mockResolvedValue([
      { slug: "a", title: "First post", excerpt: "x", publishedAt: "2026-01-01", tags: [] },
    ]);
    render(await BlogPage());
    expect(screen.getByText("First post")).toBeInTheDocument();
    expect(screen.queryByText("No posts yet")).not.toBeInTheDocument();
    expect((await generateMetadata()).robots).toBeUndefined();
  });
});
