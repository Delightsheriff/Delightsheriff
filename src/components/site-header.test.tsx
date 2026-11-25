import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";

const pathname = vi.hoisted(() => ({ value: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => pathname.value }));
vi.mock("@vercel/analytics", () => ({ track: vi.fn() }));

const { SiteHeader } = await import("./site-header");

beforeEach(() => {
  pathname.value = "/";
  // jsdom has no IntersectionObserver; the header uses one on the home page.
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      disconnect() {}
      unobserve() {}
    },
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const openMenu = () => fireEvent.click(screen.getByRole("button", { name: "Menu" }));
const menu = () => screen.getByRole("navigation", { name: "Menu" });

describe("SiteHeader mobile menu", () => {
  it("is closed until the button is pressed", () => {
    render(<SiteHeader name="Delight" />);

    const button = screen.getByRole("button", { name: "Menu" });
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("navigation", { name: "Menu" })).not.toBeInTheDocument();
  });

  it("opens with every section and turns the button into Close", () => {
    render(<SiteHeader name="Delight" />);
    openMenu();

    expect(screen.getByRole("button", { name: "Close" })).toHaveAttribute("aria-expanded", "true");
    for (const label of ["Projects", "Experience", "About", "Contact"]) {
      expect(within(menu()).getByRole("link", { name: label })).toBeInTheDocument();
    }
  });

  it("points the section links at the home page sections", () => {
    pathname.value = "/projects/smarthub";
    render(<SiteHeader name="Delight" />);
    openMenu();

    expect(within(menu()).getByRole("link", { name: "Experience" })).toHaveAttribute("href", "/#experience");
  });

  it("closes on Escape", () => {
    render(<SiteHeader name="Delight" />);
    openMenu();
    fireEvent.keyDown(window, { key: "Escape" });

    expect(screen.queryByRole("navigation", { name: "Menu" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Menu" })).toHaveFocus();
  });

  it("closes when any link in it is tapped", () => {
    render(<SiteHeader name="Delight" />);
    openMenu();
    fireEvent.click(within(menu()).getByRole("link", { name: "About" }));

    expect(screen.queryByRole("navigation", { name: "Menu" })).not.toBeInTheDocument();
  });

  it("includes Resume as an external link when there is one", () => {
    render(<SiteHeader name="Delight" resumeUrl="https://docs.example.com/resume" />);
    openMenu();

    const resume = within(menu()).getByRole("link", { name: /Resume/ });
    expect(resume).toHaveAttribute("href", "https://docs.example.com/resume");
    expect(resume).toHaveAttribute("target", "_blank");
  });
});

describe("SiteHeader blog link", () => {
  it("is nowhere, in the menu or the desktop nav, until a post is published", () => {
    render(<SiteHeader name="Delight" showBlog={false} />);
    openMenu();

    expect(screen.queryByRole("link", { name: "Blog" })).not.toBeInTheDocument();
  });

  it("is also hidden when the prop is left out", () => {
    render(<SiteHeader name="Delight" />);
    openMenu();

    expect(screen.queryByRole("link", { name: "Blog" })).not.toBeInTheDocument();
  });

  it("appears in both the desktop nav and the menu once a post exists", () => {
    render(<SiteHeader name="Delight" showBlog />);
    openMenu();

    expect(screen.getAllByRole("link", { name: "Blog" })).toHaveLength(2);
    expect(within(menu()).getByRole("link", { name: "Blog" })).toHaveAttribute("href", "/blog");
  });
});
