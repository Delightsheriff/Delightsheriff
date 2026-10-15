import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

vi.mock("@/sanity/image", () => ({ urlFor: vi.fn() }));
vi.mock("@vercel/analytics", () => ({ track: vi.fn() }));

const { ProjectRow } = await import("./project-row");

afterEach(cleanup);

const row = {
  index: 1,
  name: "IFEM Education",
  description: "The website for IFEM Education.",
  tags: ["Next.js", "Sanity"],
  href: "/projects/ifem-education",
};

describe("ProjectRow", () => {
  it("links the row to the case study", () => {
    render(<ProjectRow {...row} />);

    expect(screen.getByRole("link", { name: "IFEM Education" })).toHaveAttribute("href", "/projects/ifem-education");
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("adds a separate live-site link that opens in a new tab", () => {
    render(<ProjectRow {...row} liveUrl="https://www.ifemeducation.com" />);

    const live = screen.getByRole("link", { name: /visit site.*ifem education/i });
    expect(live).toHaveAttribute("href", "https://www.ifemeducation.com");
    expect(live).toHaveAttribute("target", "_blank");
    expect(live).toHaveAttribute("rel", "noopener noreferrer");
    // Not nested inside the case-study link.
    expect(screen.getByRole("link", { name: "IFEM Education" })).not.toContainElement(live);
  });
});
