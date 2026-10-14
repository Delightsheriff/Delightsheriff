import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { SanityProjectDemo } from "@/sanity/queries";
import { ProjectDemo } from "./project-demo";

const demo: SanityProjectDemo = {
  url: "https://cdn.sanity.io/files/p/d/demo.mp4",
  mimeType: "video/mp4",
  size: 1_437_171,
  posterUrl: "https://cdn.sanity.io/images/p/d/poster-900x1500.jpg",
  width: 900,
  height: 1500,
  frame: "none",
};

let intersect: (isIntersecting: boolean) => void;
let reducedMotion = false;
const play = vi.fn();
const pause = vi.fn();

beforeEach(() => {
  reducedMotion = false;
  play.mockReset().mockImplementation(function (this: HTMLVideoElement) {
    this.dispatchEvent(new Event("play"));
    return Promise.resolve();
  });
  pause.mockReset().mockImplementation(function (this: HTMLVideoElement) {
    this.dispatchEvent(new Event("pause"));
  });
  vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(play);
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(pause);

  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: IntersectionObserverCallback) {
        intersect = (isIntersecting) =>
          act(() => callback([{ isIntersecting } as IntersectionObserverEntry], this as never));
      }
      observe() {}
      disconnect() {}
    },
  );
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: query.includes("reduced-motion") && reducedMotion,
    addEventListener() {},
    removeEventListener() {},
  }));
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("ProjectDemo", () => {
  it("reserves the recording's aspect ratio before it loads", () => {
    const { container } = render(<ProjectDemo demo={demo} title="BookShelf" />);
    const video = container.querySelector("video")!;

    expect(video.parentElement).toHaveStyle({ aspectRatio: "900 / 1500" });
    expect(video).toHaveAttribute("preload", "none");
    expect(video.muted).toBe(true);
    expect(video.loop).toBe(true);
    expect(video).toHaveAttribute("playsinline");
  });

  it("plays only while in view", () => {
    render(<ProjectDemo demo={demo} title="BookShelf" />);
    expect(play).not.toHaveBeenCalled();

    intersect(true);
    expect(play).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: /pause bookshelf demo/i })).toBeInTheDocument();

    intersect(false);
    expect(pause).toHaveBeenCalled();
  });

  it("stays paused after the visitor pauses it", () => {
    render(<ProjectDemo demo={demo} title="BookShelf" />);
    intersect(true);

    fireEvent.click(screen.getByRole("button", { name: /pause/i }));
    intersect(false);
    intersect(true);

    expect(play).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: /play bookshelf demo/i })).toBeInTheDocument();
  });

  it("shows the poster with a play button when reduced motion is preferred", () => {
    reducedMotion = true;
    render(<ProjectDemo demo={demo} title="BookShelf" />);
    intersect(true);

    expect(play).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: /play bookshelf demo/i }));
    expect(play).toHaveBeenCalledTimes(1);
  });

  it("renders a pre-framed recording without adding a frame", () => {
    const { container } = render(<ProjectDemo demo={demo} title="BookShelf" />);
    const frame = container.querySelector("[data-frame]")!;

    expect(frame).toHaveAttribute("data-frame", "none");
    expect(frame.className).not.toMatch(/bg-neutral-950|border-border/);
  });
});
