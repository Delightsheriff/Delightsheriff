import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

vi.mock("@vercel/analytics", () => ({ track: vi.fn() }));

const { ProjectListItem } = await import("./project-list-item");

afterEach(cleanup);

const item = {
  name: "Soundfork",
  category: "macos",
  description: "A macOS menu-bar app.",
  tags: ["Swift", "SwiftUI"],
};

describe("ProjectListItem", () => {
  it("shows the category label, impact and stack", () => {
    render(
      <ul>
        <ProjectListItem {...item} impact="Per-app audio routing" links={{}} />
      </ul>,
    );

    expect(screen.getByText("macOS")).toBeInTheDocument();
    expect(screen.getByText(/Per-app audio routing\./)).toBeInTheDocument();
    expect(screen.getByText("Swift, SwiftUI")).toBeInTheDocument();
  });

  it("links only the destinations that exist, opening in a new tab", () => {
    render(
      <ul>
        <ProjectListItem {...item} links={{ download: "https://example.com/dl", source: "https://example.com/src" }} />
      </ul>,
    );

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(screen.getByRole("link", { name: /download/i })).toHaveAttribute("href", "https://example.com/dl");
    expect(screen.getByRole("link", { name: /source/i })).toHaveAttribute("target", "_blank");
    expect(screen.queryByRole("link", { name: /live/i })).not.toBeInTheDocument();
  });

  it("renders no links when there are none", () => {
    render(
      <ul>
        <ProjectListItem {...item} links={{}} />
      </ul>,
    );

    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });
});
