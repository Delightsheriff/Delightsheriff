import { afterEach, describe, expect, it, vi } from "vitest";
import { setAnalyticsProvider, track } from "./analytics";

afterEach(() => setAnalyticsProvider(null));

describe("analytics", () => {
  it("does nothing until a provider is registered", () => {
    expect(() => track("project_open", { project: "SmartHub" })).not.toThrow();
  });

  it("passes events and data to the registered provider", () => {
    const send = vi.fn();
    setAnalyticsProvider(send);
    track("project_open", { project: "SmartHub" });
    expect(send).toHaveBeenCalledWith("project_open", { project: "SmartHub" });
  });

  it("can be switched to another provider, or turned off", () => {
    const a = vi.fn();
    const b = vi.fn();
    setAnalyticsProvider(a);
    setAnalyticsProvider(b);
    track("x");
    expect(a).not.toHaveBeenCalled();
    expect(b).toHaveBeenCalledTimes(1);

    setAnalyticsProvider(null);
    track("y");
    expect(b).toHaveBeenCalledTimes(1);
  });

  it("never lets a failing provider break the page", () => {
    setAnalyticsProvider(() => {
      throw new Error("boom");
    });
    expect(() => track("x")).not.toThrow();
  });
});
