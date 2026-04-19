import { beforeEach, describe, expect, it, vi } from "vitest";
import { preloadImages } from "../../src/lib/preloadAssets";

class FakeImage {
  onload: null | (() => void) = null;
  onerror: null | (() => void) = null;

  set src(value: string) {
    queueMicrotask(() => {
      if (value.includes("missing")) {
        this.onerror?.();
      } else {
        this.onload?.();
      }
    });
  }
}

describe("preloadImages", () => {
  beforeEach(() => {
    vi.stubGlobal("Image", FakeImage);
  });

  it("returns skipped items for missing images without throwing", async () => {
    const result = await preloadImages([
      "/photos/memory-01.jpg",
      "/photos/missing.jpg",
    ]);

    expect(result.loaded).toEqual(["/photos/memory-01.jpg"]);
    expect(result.skipped).toEqual(["/photos/missing.jpg"]);
  });
});
