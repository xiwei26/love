import type { MemoryPhotoPlacement, MemorySceneLayout } from "./types";

export function getPhotoDimensions(aspect: number) {
  const safeAspect = Number.isFinite(aspect) && aspect > 0 ? aspect : 1;
  const width = Math.min(2.6, 1.9 * safeAspect);
  return { width, height: width / safeAspect };
}

interface LayoutOptions {
  aspectRatio?: number;
  photoAspects?: number[];
}

// Viewport-relative slots reserve the top for subtitles and account for perspective.
export function createMemoryLayout(
  photoUrls: string[],
  { aspectRatio = 16 / 10, photoAspects = [] }: LayoutOptions = {},
): MemorySceneLayout {
  const portrait = aspectRatio < 1;
  const supportSlots = portrait
    ? [[.26, .53], [.74, .53], [.26, .65], [.74, .65], [.26, .77], [.74, .77], [.5, .89]]
    : [[.15, .29], [.85, .29], [.15, .52], [.85, .52], [.2, .76], [.5, .84], [.8, .76]];

  const placements = photoUrls.map((photoUrl, index): MemoryPhotoPlacement => {
    const hero = index === 0;
    const slot = hero ? [0.5, portrait ? .31 : .46] : supportSlots[(index - 1) % supportSlots.length];
    const z = hero ? -.4 : -1.4 - (index - 1) * .65;
    const viewHeight = 2 * Math.tan(21 * Math.PI / 180) * (5.2 - z);
    const viewWidth = viewHeight * aspectRatio;
    const bounds = hero
      ? { width: portrait ? .84 : .36, height: portrait ? .25 : .43 }
      : { width: portrait ? .39 : .21, height: portrait ? .1 : .18 };
    const size = getPhotoDimensions(photoAspects[index] ?? 4 / 3);

    return {
      photoUrl,
      x: (slot[0] - .5) * viewWidth,
      y: (.5 - slot[1]) * viewHeight,
      z,
      rotationY: hero ? 0 : (slot[0] < .5 ? .025 : -.025),
      scale: Math.min(bounds.width * viewWidth / size.width, bounds.height * viewHeight / size.height),
    };
  });

  return {
    hero: placements[0],
    supporting: placements.slice(1),
    gatherTargets: placements.map((item) => ({ x: item.x * .8, y: item.y * .8, z: item.z - 1 })),
  };
}
