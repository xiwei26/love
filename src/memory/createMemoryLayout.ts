import type { MemoryPhotoPlacement, MemorySceneLayout } from "./types";

const supportingLayoutPresets = [
  { x: -2.55, y: 1.1, z: -1.7, rotationY: -0.2, scale: 0.68 },
  { x: -1.15, y: -0.25, z: -2.1, rotationY: 0.12, scale: 0.72 },
  { x: 1.25, y: 0.95, z: -2.45, rotationY: -0.1, scale: 0.74 },
  { x: 2.7, y: -0.05, z: -2.85, rotationY: 0.16, scale: 0.69 },
  { x: -2.15, y: -1.35, z: -3.2, rotationY: -0.14, scale: 0.66 },
  { x: 0.15, y: -1.05, z: -3.55, rotationY: 0.08, scale: 0.68 },
  { x: 2.25, y: 1.45, z: -3.85, rotationY: 0.2, scale: 0.64 },
] as const;

function createSupportingPlacement(photoUrl: string, index: number): MemoryPhotoPlacement {
  const preset = supportingLayoutPresets[index];

  if (preset) {
    return {
      photoUrl,
      x: preset.x,
      y: preset.y,
      z: preset.z,
      rotationY: preset.rotationY,
      scale: preset.scale,
    };
  }

  const mirroredIndex = index - supportingLayoutPresets.length;
  const direction = mirroredIndex % 2 === 0 ? -1 : 1;
  const ring = Math.floor(mirroredIndex / 2) + 1;

  return {
    photoUrl,
    x: direction * (2.5 + ring * 0.55),
    y: ring % 2 === 0 ? 1.2 : -1.2,
    z: -4.15 - mirroredIndex * 0.35,
    rotationY: direction * 0.16,
    scale: 0.62,
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
