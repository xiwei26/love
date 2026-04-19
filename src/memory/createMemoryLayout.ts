import type { MemoryPhotoPlacement, MemorySceneLayout } from "./types";

function createSupportingPlacement(photoUrl: string, index: number): MemoryPhotoPlacement {
  const columns = [-1.6, -0.7, 0.7, 1.6];
  const rows = [0.85, -0.05, -1.0];
  const x = columns[index % columns.length] ?? 0;
  const y = rows[index % rows.length] ?? 0;
  const z = -1.4 - index * 0.35;

  return {
    photoUrl,
    x,
    y,
    z,
    rotationY: (index % 2 === 0 ? -1 : 1) * 0.14,
    scale: 0.78,
  };
}

export function createMemoryLayout(photoUrls: string[]): MemorySceneLayout {
  const [heroUrl, ...supportingUrls] = photoUrls;

  return {
    hero: {
      photoUrl: heroUrl,
      x: 0,
      y: 0.08,
      z: -0.4,
      rotationY: 0,
      scale: 1,
    },
    supporting: supportingUrls.map(createSupportingPlacement),
    gatherTargets: photoUrls.map((_, index) => ({
      x: 0,
      y: 0,
      z: -2.2 - index * 0.1,
    })),
  };
}
