import { describe, expect, it } from "vitest";
import { createMemoryLayout } from "../../src/memory/createMemoryLayout";

function distance2d(first: { x: number; y: number }, second: { x: number; y: number }) {
  const dx = first.x - second.x;
  const dy = first.y - second.y;
  return Math.sqrt(dx * dx + dy * dy);
}

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

  it("preserves a balanced framing while avoiding the hero card", () => {
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

    expect((supportingByPhoto["/photos/memory-02.jpg"]?.x ?? 0) < -4).toBe(true);
    expect((supportingByPhoto["/photos/memory-04.jpg"]?.y ?? 0) > 1.5).toBe(true);
    expect((supportingByPhoto["/photos/memory-07.jpg"]?.y ?? 0) < -1.4).toBe(true);
    expect(
      layout.supporting.every(
        (item) =>
          Math.abs(item.x) > 2.3 ||
          Math.abs(item.y - layout.hero.y) > 1.6 ||
          Math.abs(item.z - layout.hero.z) > 2.4,
      ),
    ).toBe(true);
  });

  it("pushes nearby cards apart when they start too close", () => {
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

    for (let index = 0; index < layout.supporting.length; index += 1) {
      for (let compareIndex = index + 1; compareIndex < layout.supporting.length; compareIndex += 1) {
        const current = layout.supporting[index];
        const next = layout.supporting[compareIndex];

        if (Math.abs(current.z - next.z) < 1.9) {
          expect(distance2d(current, next)).toBeGreaterThan(1.2);
        }
      }
    }
  });
});
