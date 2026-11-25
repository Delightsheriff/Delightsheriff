import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";

const pathname = vi.hoisted(() => ({ value: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => pathname.value }));
vi.mock("@/lib/analytics", () => ({ track: vi.fn() }));

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

const openMenu = () => fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
const menu = () => screen.getByRole("navigation", { name: "Menu" });

describe("SiteHeader mobile menu", () => {
  it("is closed until the button is pressed", () => {
    render(<SiteHeader name="Delight" />);

    const button = screen.getByRole("button", { name: "Open menu" });
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("navigation", { name: "Menu" })).not.toBeInTheDocument();
  });

  it("opens with every section and turns the button into Close menu", () => {
    render(<SiteHeader name="Delight" />);
    openMenu();

    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
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
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveFocus();
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

describe("SiteHeader menu animation", () => {
  const panel = () => document.getElementById("mobile-menu")!;

  it("stays in the page so it can animate, but is hidden and unreachable while closed", () => {
    render(<SiteHeader name="Delight" />);

    expect(panel()).toHaveAttribute("aria-hidden", "true");
    expect(panel()).toHaveAttribute("inert");
    expect(panel().className).toContain("grid-rows-[0fr]");
    expect(panel().className).toContain("invisible");
  });

  it("becomes reachable and grows when opened", () => {
    render(<SiteHeader name="Delight" />);
    openMenu();

    expect(panel()).toHaveAttribute("aria-hidden", "false");
    expect(panel()).not.toHaveAttribute("inert");
    expect(panel().className).toContain("grid-rows-[1fr]");
  });

  it("brings the links in one after another when opening", () => {
    render(<SiteHeader name="Delight" showBlog resumeUrl="https://docs.example.com/r" />);
    openMenu();

    const delays = within(menu())
      .getAllByRole("link")
      .map((link) => Number.parseInt((link.parentElement as HTMLElement).style.transitionDelay, 10));
    expect(delays).toHaveLength(6);
    for (let i = 1; i < delays.length; i++) expect(delays[i]).toBeGreaterThan(delays[i - 1]);
  });

  it("drops the delays when closing so it closes quickly", () => {
    render(<SiteHeader name="Delight" />);
    openMenu();
    fireEvent.keyDown(window, { key: "Escape" });

    const links = panel().querySelectorAll("nav a");
    expect(links.length).toBeGreaterThan(0);
    for (const link of links) expect((link.parentElement as HTMLElement).style.transitionDelay).toBe("0ms");
    expect(panel().className).toContain("duration-[240ms]");
  });

  it("keeps the page still behind the open menu and releases it after", () => {
    render(<SiteHeader name="Delight" />);
    openMenu();
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.keyDown(window, { key: "Escape" });
    expect(document.body.style.overflow).toBe("");
  });

  it("closes when the dimmed page behind it is tapped", () => {
    const { container } = render(<SiteHeader name="Delight" />);
    openMenu();
    const dim = container.querySelector('div[aria-hidden="true"].fixed') as HTMLElement;
    fireEvent.click(dim);

    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
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
