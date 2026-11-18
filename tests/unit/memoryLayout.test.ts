import { describe, expect, it } from "vitest";
import { createMemoryLayout, getPhotoDimensions } from "../../src/memory/createMemoryLayout";
import { findHeartSpaces } from "../../src/memory/createMemoryHearts";

const photos = Array.from({ length: 8 }, (_, i) => `/photos/memory-0${i + 1}.jpg`);
const aspects = [16 / 9, 1, 4 / 3, 3 / 2, 4 / 3, 3 / 2, 4 / 3, 3 / 2];

describe("memory photo framing", () => {
  it.each([16 / 9, 1, 4 / 3, 3 / 2, 2 / 3])("preserves a %s image aspect without stretching", (aspect) => {
    const { width, height } = getPhotoDimensions(aspect);
    expect(width / height).toBeCloseTo(aspect);
    expect(width).toBeLessThanOrEqual(2.6);
    expect(height).toBeLessThanOrEqual(1.9);
  });

  it.each([1440 / 900, 844 / 390, 390 / 844, 320 / 568])("keeps all projected photos visible and separated at viewport aspect %s", (aspectRatio) => {
    const layout = createMemoryLayout(photos, { aspectRatio, photoAspects: aspects });
    const placements = [layout.hero, ...layout.supporting];
    expect(placements.map(item => item.photoUrl)).toEqual(photos);
    expect(layout.supporting.every(item => item.z < layout.hero.z)).toBe(true);
    expect(layout.gatherTargets).toHaveLength(photos.length);
    const boxes = placements.map((item, index) => {
      const viewHeight = 2 * Math.tan(21 * Math.PI / 180) * (5.2 - item.z);
      const viewWidth = viewHeight * aspectRatio;
      const size = getPhotoDimensions(aspects[index]);
      const w = size.width * item.scale / viewWidth;
      const h = size.height * item.scale / viewHeight;
      const x = .5 + item.x / viewWidth;
      const y = .5 - item.y / viewHeight;
      return { left: x-w/2, right: x+w/2, top: y-h/2, bottom: y+h/2 };
    });
    for (const box of boxes) {
      expect(box.left).toBeGreaterThan(.02);
      expect(box.right).toBeLessThan(.98);
      expect(box.top).toBeGreaterThan(.17);
      expect(box.bottom).toBeLessThan(.97);
    }
    for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i], b = boxes[j];
      expect(a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top).toBe(true);
    }
    const width = aspectRatio * 800;
    const photoPixels = boxes.map(box => ({ left: box.left * width, right: box.right * width, top: box.top * 800, bottom: box.bottom * 800 }));
    const hearts = findHeartSpaces(width, 800, photoPixels);
    expect(hearts).toHaveLength(2);
    hearts.forEach((heart, i) => {
      expect(heart.top).toBeGreaterThanOrEqual(160);
      expect(heart.bottom).toBeLessThan(800);
      expect(heart.left).toBeGreaterThan(0);
      expect(heart.right).toBeLessThan(width);
      for (const box of [...photoPixels, ...hearts.slice(0, i)]) {
        expect(heart.right <= box.left || box.right <= heart.left || heart.bottom <= box.top || box.bottom <= heart.top).toBe(true);
      }
    });
  });
  it("omits hearts when the photo fills all available space", () => {
    expect(findHeartSpaces(390, 844, [{ left: 0, right: 390, top: 0, bottom: 844 }])).toEqual([]);
  });
});
