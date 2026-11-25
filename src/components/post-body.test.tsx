import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import type { PortableTextBlock } from "@portabletext/react";

vi.mock("@/sanity/image", () => ({
  urlFor: vi.fn(() => ({ width: () => ({ url: () => "https://cdn.sanity.io/figure.png" }) })),
}));

const { PostBody } = await import("./post-body");

afterEach(cleanup);

const span = (text: string, marks: string[] = []) => ({ _type: "span", _key: text, text, marks });
const block = (
  children: ReturnType<typeof span>[],
  extra: Record<string, unknown> = {},
): PortableTextBlock =>
  ({ _type: "block", _key: String(children[0].text), style: "normal", markDefs: [], children, ...extra }) as unknown as PortableTextBlock;

describe("PostBody", () => {
  it("renders headings and paragraphs", () => {
    render(<PostBody value={[block([span("Why it matters")], { style: "h2" }), block([span("Some text.")])]} />);

    expect(screen.getByRole("heading", { level: 2, name: "Why it matters" })).toBeInTheDocument();
    expect(screen.getByText("Some text.")).toBeInTheDocument();
  });

  it("opens outside links in a new tab and keeps links to this site in the same tab", () => {
    render(
      <PostBody
        value={[
          block([span("an outside link", ["a"]), span(" and "), span("my own page", ["b"])], {
            markDefs: [
              { _type: "link", _key: "a", href: "https://example.com/post" },
              { _type: "link", _key: "b", href: "https://www.delightsheriff.com/projects/osan" },
            ],
          }),
        ]}
      />,
    );

    const outside = screen.getByRole("link", { name: "an outside link" });
    expect(outside).toHaveAttribute("target", "_blank");
    expect(outside).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByRole("link", { name: "my own page" })).not.toHaveAttribute("target");
  });

  it("styles inline code", () => {
    render(<PostBody value={[block([span("Call "), span("timingSafeEqual", ["code"])])]} />);

    expect(screen.getByText("timingSafeEqual").tagName).toBe("CODE");
  });

  it("makes bullet lists with dash markers and no dot characters", () => {
    render(
      <PostBody
        value={[
          block([span("First")], { listItem: "bullet", level: 1 }),
          block([span("Second")], { listItem: "bullet", level: 1 }),
        ]}
      />,
    );

    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByRole("list").tagName).toBe("UL");
    expect(document.body.textContent).not.toMatch(/[·•]/);
  });

  it("numbers ordered lists with a counter", () => {
    render(
      <PostBody
        value={[block([span("One")], { listItem: "number", level: 1 }), block([span("Two")], { listItem: "number", level: 1 })]}
      />,
    );

    expect(screen.getByRole("list").tagName).toBe("OL");
    expect(screen.getAllByRole("listitem")[0].className).toContain("counter(item)");
  });

  it("renders a quote", () => {
    const { container } = render(<PostBody value={[block([span("Measure first.")], { style: "blockquote" })]} />);

    expect(container.querySelector("blockquote")).toHaveTextContent("Measure first.");
  });

  it("renders an image with its caption and alt text", () => {
    render(
      <PostBody
        value={[{ _type: "image", _key: "i", asset: { _ref: "x" }, alt: "A diagram", caption: "How it fits" } as unknown as PortableTextBlock]}
      />,
    );

    expect(screen.getByAltText("A diagram")).toBeInTheDocument();
    expect(screen.getByText("How it fits")).toBeInTheDocument();
  });
});
