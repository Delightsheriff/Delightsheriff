import { describe, expect, it } from "vitest";
import loader from "./sanity-image-loader";

const SRC = "https://cdn.sanity.io/images/abc/production/hash-1600x960.jpg?rect=32,0,1536,960&w=1200&h=750&fit=crop";

describe("sanityImageLoader", () => {
  it("sets the requested width and keeps the shape of the crop", () => {
    const url = new URL(loader({ src: SRC, width: 640 }));
    expect(url.searchParams.get("w")).toBe("640");
    expect(url.searchParams.get("h")).toBe("400");
  });

  it("keeps the crop rectangle and fit so the image is framed the same", () => {
    const url = new URL(loader({ src: SRC, width: 750 }));
    expect(url.searchParams.get("rect")).toBe("32,0,1536,960");
    expect(url.searchParams.get("fit")).toBe("crop");
  });

  it("asks Sanity for the best format and the requested quality", () => {
    const url = new URL(loader({ src: SRC, width: 640, quality: 60 }));
    expect(url.searchParams.get("auto")).toBe("format");
    expect(url.searchParams.get("q")).toBe("60");
    expect(new URL(loader({ src: SRC, width: 640 })).searchParams.get("q")).toBe("75");
  });

  it("only sets a width when the source has no height", () => {
    const url = new URL(loader({ src: "https://cdn.sanity.io/images/abc/production/x-800x600.jpg", width: 400 }));
    expect(url.searchParams.get("w")).toBe("400");
    expect(url.searchParams.has("h")).toBe(false);
  });

  it("leaves images from other hosts and local paths alone", () => {
    expect(loader({ src: "https://example.com/a.png", width: 640 })).toBe("https://example.com/a.png");
    expect(loader({ src: "/local.png", width: 640 })).toBe("/local.png");
  });
});
