import { describe, expect, it } from "vitest";
import type { PortableTextBlock } from "@portabletext/react";
import { plainText, readingMinutes, wordCount } from "./reading-time";

const block = (text: string): PortableTextBlock => ({ _type: "block", _key: text, children: [{ _type: "span", text }] });
const image = { _type: "image", _key: "img", asset: { _ref: "x" } } as unknown as PortableTextBlock;

describe("reading time", () => {
  it("joins the text of written blocks and ignores images", () => {
    expect(plainText([block("One two"), image, block("three")])).toBe("One two\nthree");
  });

  it("counts words across blocks", () => {
    expect(wordCount([block("one two three"), block("four five")])).toBe(5);
    expect(wordCount([])).toBe(0);
  });

  it("rounds up and is never less than one minute", () => {
    expect(readingMinutes([block("short")])).toBe(1);
    expect(readingMinutes([block("word ".repeat(200))])).toBe(1);
    expect(readingMinutes([block("word ".repeat(201))])).toBe(2);
    expect(readingMinutes([block("word ".repeat(1000))])).toBe(5);
  });

  it("handles a block with no children", () => {
    expect(wordCount([{ _type: "block", _key: "e" } as unknown as PortableTextBlock])).toBe(0);
  });
});
