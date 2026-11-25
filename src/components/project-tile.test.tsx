import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

vi.mock("@/sanity/image", () => ({
  urlFor: vi.fn(() => ({
    width: () => ({ height: () => ({ fit: () => ({ url: () => "https://cdn.sanity.io/test.png" }) }) }),
  })),
}));
vi.mock("@/lib/analytics", () => ({ track: vi.fn() }));

const { ProjectTile } = await import("./project-tile");

afterEach(cleanup);

const tile = {
  name: "IFEM Education",
  description: "The website for IFEM Education.",
  tags: ["Next.js", "Sanity"],
  href: "/projects/ifem-education",
};

describe("ProjectTile", () => {
  it("links the tile to the case study", () => {
    render(<ProjectTile {...tile} />);

    expect(screen.getByRole("link", { name: "IFEM Education" })).toHaveAttribute("href", "/projects/ifem-education");
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("adds a separate live-site link that opens in a new tab", () => {
    render(<ProjectTile {...tile} liveUrl="https://www.ifemeducation.com" />);

    const live = screen.getByRole("link", { name: /visit site.*ifem education/i });
    expect(live).toHaveAttribute("href", "https://www.ifemeducation.com");
    expect(live).toHaveAttribute("target", "_blank");
    expect(live).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByRole("link", { name: "IFEM Education" })).not.toContainElement(live);
  });

  it("separates role and stack without dots", () => {
    render(<ProjectTile {...tile} role="Designer and developer" />);

    expect(screen.getByText("Designer and developer / Next.js, Sanity")).toBeInTheDocument();
  });

  it("shows the thumbnail when there is one and a text fallback when there is not", () => {
    const { rerender } = render(<ProjectTile {...tile} thumbnail={{ asset: {} as never, alt: "Home page" }} />);
    expect(screen.getByAltText("Home page")).toBeInTheDocument();

    rerender(<ProjectTile {...tile} />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("flags projects that have a demo", () => {
    render(<ProjectTile {...tile} hasDemo />);

    expect(screen.getByText("Demo")).toBeInTheDocument();
  });
});
