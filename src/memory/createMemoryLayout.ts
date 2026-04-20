import type { MemoryPhotoPlacement, MemorySceneLayout } from "./types";

const supportingLayoutPresets = [
  { x: -3.1, y: 1.55, z: -1.6, rotationY: -0.24, scale: 0.62 },
  { x: -2.7, y: 1.55, z: -2.45, rotationY: 0.16, scale: 0.7 },
  { x: 0.1, y: 1.8, z: -3.3, rotationY: -0.14, scale: 0.68 },
  { x: 3.2, y: 0.05, z: -4.2, rotationY: 0.2, scale: 0.7 },
  { x: -3.9, y: -1.75, z: -5.15, rotationY: -0.18, scale: 0.6 },
  { x: -0.9, y: -1.8, z: -6.0, rotationY: 0.1, scale: 0.6 },
  { x: 5.3, y: 1.9, z: -6.95, rotationY: 0.24, scale: 0.6 },
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
    x: direction * (4.4 + ring * 0.8),
    y: ring % 2 === 0 ? 1.9 : -1.75,
    z: -7.45 - mirroredIndex * 0.55,
    rotationY: direction * 0.2,
    scale: 0.56,
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
