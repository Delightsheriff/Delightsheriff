import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { NavLink } from "./nav-link";

describe("NavLink", () => {
  it("renders the arrow before the label for a back link", () => {
    render(
      <NavLink href="/projects" direction="back">
        All projects
      </NavLink>,
    );

    const link = screen.getByRole("link", { name: /all projects/i });
    expect(link).toHaveAttribute("href", "/projects");
    expect(link.textContent).toBe("←All projects");
  });

  it("renders the arrow after the label for a forward link", () => {
    render(
      <NavLink href="/projects" direction="forward">
        View all
      </NavLink>,
    );

    const link = screen.getByRole("link", { name: /view all/i });
    expect(link.textContent).toBe("View all→");
  });
});
