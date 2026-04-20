import { describe, expect, it } from "vitest";
import { createMemoryLayout } from "../../src/memory/createMemoryLayout";

describe("createMemoryLayout", () => {
  it("creates one hero photo and supporting photos in depth layers", () => {
    const layout = createMemoryLayout([
      "/photos/memory-01.jpg",
      "/photos/memory-02.jpg",
      "/photos/memory-03.jpg",
      "/photos/memory-04.jpg",
    ]);

    expect(layout.hero.photoUrl).toBe("/photos/memory-01.jpg");
    expect(layout.supporting).toHaveLength(3);
    expect(layout.supporting.every((item) => item.z < layout.hero.z)).toBe(true);
  });

  it("creates gather-back targets for every photo", () => {
    const layout = createMemoryLayout([
      "/photos/memory-01.jpg",
      "/photos/memory-02.jpg",
      "/photos/memory-03.jpg",
    ]);

    expect(layout.gatherTargets).toHaveLength(3);
  });

  it("spreads supporting photos across a wider field to avoid overlap", () => {
    const layout = createMemoryLayout([
      "/photos/memory-01.jpg",
      "/photos/memory-02.jpg",
      "/photos/memory-03.jpg",
      "/photos/memory-04.jpg",
      "/photos/memory-05.jpg",
      "/photos/memory-06.jpg",
      "/photos/memory-07.jpg",
      "/photos/memory-08.jpg",
    ]);

    const xs = layout.supporting.map((item) => item.x);
    const zs = layout.supporting.map((item) => item.z);

    expect(Math.max(...xs) - Math.min(...xs)).toBeGreaterThan(9);
    expect(Math.max(...zs) - Math.min(...zs)).toBeGreaterThan(5);
    expect(layout.supporting.every((item) => item.scale <= 0.7)).toBe(true);
  });

  it("tunes selected real-photo positions for better framing", () => {
    const layout = createMemoryLayout([
      "/photos/memory-01.jpg",
      "/photos/memory-02.jpg",
      "/photos/memory-03.jpg",
      "/photos/memory-04.jpg",
      "/photos/memory-05.jpg",
      "/photos/memory-06.jpg",
      "/photos/memory-07.jpg",
      "/photos/memory-08.jpg",
    ]);

    const supportingByPhoto = Object.fromEntries(
      layout.supporting.map((item) => [item.photoUrl, item]),
    );

    expect(supportingByPhoto["/photos/memory-02.jpg"]?.x).toBe(-3.1);
    expect(supportingByPhoto["/photos/memory-04.jpg"]?.y).toBe(1.8);
    expect(supportingByPhoto["/photos/memory-07.jpg"]?.y).toBe(-1.8);
  });
});
