import { describe, expect, it } from "vitest";
import { buildArdManifest } from "./ard";

const MEDIA_TYPE = /^[a-z0-9][a-z0-9!#$&^_.+-]*\/[a-z0-9][a-z0-9!#$&^_.+-]*$/i;

describe("buildArdManifest", () => {
  const manifest = buildArdManifest(new Date("2026-11-25T12:00:00Z"));

  it("is an entries array, as the spec requires", () => {
    expect(Array.isArray(manifest.entries)).toBe(true);
    expect(manifest.entries.length).toBeGreaterThan(0);
  });

  it("gives every entry the fields the spec says it must carry", () => {
    for (const entry of manifest.entries) {
      expect(entry.identifier).toMatch(/^urn:air:delightsheriff\.com:[a-z0-9:-]+$/);
      expect(entry.displayName.length).toBeGreaterThan(0);
      expect(entry.type).toMatch(MEDIA_TYPE);
      expect(entry.url).toMatch(/^https:\/\/www\.delightsheriff\.com\//);
      // Exactly one of url or data.
      expect(entry).not.toHaveProperty("data");
    }
  });

  it("gives each entry 2 to 5 sample queries, which is what a registry searches on", () => {
    for (const entry of manifest.entries) {
      expect(entry.representativeQueries.length).toBeGreaterThanOrEqual(2);
      expect(entry.representativeQueries.length).toBeLessThanOrEqual(5);
    }
  });

  it("uses unique identifiers", () => {
    const ids = manifest.entries.map((entry) => entry.identifier);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("points at the real profile files", () => {
    expect(manifest.entries.map((entry) => entry.url)).toEqual([
      "https://www.delightsheriff.com/llms.txt",
      "https://www.delightsheriff.com/llms-full.txt",
    ]);
  });

  it("stamps the update time, and leaves it out when unknown", () => {
    expect(manifest.entries[0].updatedAt).toBe("2026-11-25T12:00:00.000Z");
    expect(buildArdManifest().entries[0]).not.toHaveProperty("updatedAt");
  });
});
