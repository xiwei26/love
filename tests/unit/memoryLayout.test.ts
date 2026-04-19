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
});
