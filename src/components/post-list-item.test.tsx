import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

vi.mock("@/sanity/image", () => ({
  urlFor: vi.fn(() => ({
    width: () => ({ height: () => ({ fit: () => ({ url: () => "https://cdn.sanity.io/cover.png" }) }) }),
  })),
}));
vi.mock("@vercel/analytics", () => ({ track: vi.fn() }));

const { PostListItem } = await import("./post-list-item");

afterEach(cleanup);

const post = {
  slug: "hmac-webhooks",
  title: "Verifying webhooks with HMAC",
  excerpt: "How to check a signature in constant time.",
  publishedAt: "2026-12-01",
};

const renderPost = (props: Partial<React.ComponentProps<typeof PostListItem>> = {}) =>
  render(
    <ul>
      <PostListItem {...post} {...props} />
    </ul>,
  );

describe("PostListItem", () => {
  it("opens the post from the title and stretches the link over the row", () => {
    renderPost();

    const link = screen.getByRole("link", { name: "Verifying webhooks with HMAC" });
    expect(link).toHaveAttribute("href", "/blog/hmac-webhooks");
    expect(link.className).toContain("after:absolute");
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("shows the date in full, with a machine readable value", () => {
    renderPost();

    const time = screen.getByText("December 1, 2026");
    expect(time.tagName).toBe("TIME");
    expect(time).toHaveAttribute("datetime", "2026-12-01");
  });

  it("shows the excerpt and separates tags with commas, never dots", () => {
    renderPost({ tags: ["Security", "Paystack"] });

    expect(screen.getByText("How to check a signature in constant time.")).toBeInTheDocument();
    expect(screen.getByText("Security, Paystack")).toBeInTheDocument();
    expect(document.body.textContent).not.toContain("·");
  });

  it("shows a cover image only when there is one", () => {
    const { unmount } = renderPost({ coverImage: { asset: {} as never, alt: "A padlock" } });
    expect(screen.getByAltText("A padlock")).toBeInTheDocument();
    unmount();

    renderPost();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
