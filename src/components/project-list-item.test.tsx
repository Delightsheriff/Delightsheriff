import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

vi.mock("@/sanity/image", () => ({
  urlFor: vi.fn(() => ({
    width: () => ({ height: () => ({ fit: () => ({ url: () => "https://cdn.sanity.io/test.png" }) }) }),
  })),
}));
vi.mock("@vercel/analytics", () => ({ track: vi.fn() }));

const { ProjectListItem } = await import("./project-list-item");

afterEach(cleanup);

const item = {
  name: "Soundfork",
  category: "macos",
  description: "A macOS menu-bar app.",
  tags: ["Swift", "SwiftUI"],
  href: "/projects/soundfork",
};

function renderItem(props: Partial<React.ComponentProps<typeof ProjectListItem>> = {}) {
  return render(
    <ul>
      <ProjectListItem {...item} links={{}} {...props} />
    </ul>,
  );
}

describe("ProjectListItem", () => {
  it("shows the category label, impact and stack", () => {
    renderItem({ impact: "Per-app audio routing" });

    expect(screen.getByText("macOS", { selector: "span.font-mono" })).toBeInTheDocument();
    expect(screen.getByText((_, el) => el?.tagName === "P" && /Per-app audio routing\./.test(el.textContent ?? ""))).toBeInTheDocument();
    expect(screen.getByText("Swift, SwiftUI")).toBeInTheDocument();
  });

  it("opens the case study from the project name", () => {
    renderItem();

    expect(screen.getByRole("link", { name: /^\s*Soundfork\s*$/ })).toHaveAttribute("href", "/projects/soundfork");
    // The case study is the only link when there are no destinations.
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("stretches the case-study link over the row so the image opens it too", () => {
    renderItem();

    expect(screen.getByRole("link", { name: /^\s*Soundfork\s*$/ }).className).toContain("after:absolute");
    expect(screen.getByRole("link", { name: /^\s*Soundfork\s*$/ }).className).toContain("after:inset-0");
  });

  it("keeps destination links separate, opening in a new tab", () => {
    renderItem({ links: { download: "https://example.com/dl", source: "https://example.com/src" } });

    const download = screen.getByRole("link", { name: /download/i });
    expect(download).toHaveAttribute("href", "https://example.com/dl");
    expect(download).toHaveAttribute("target", "_blank");
    expect(download).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByRole("link", { name: /source/i })).toHaveAttribute("href", "https://example.com/src");
    expect(screen.queryByRole("link", { name: /live/i })).not.toBeInTheDocument();
    // Not nested inside the case-study link.
    expect(screen.getByRole("link", { name: /^\s*Soundfork\s*$/ })).not.toContainElement(download);
    expect(screen.getAllByRole("link")).toHaveLength(3);
  });

  it("shows the thumbnail when there is one and no image when there is not", () => {
    const { unmount } = renderItem({ thumbnail: { asset: {} as never, alt: "Soundfork menu bar" } });
    expect(screen.getByAltText("Soundfork menu bar")).toBeInTheDocument();
    unmount();

    renderItem();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
