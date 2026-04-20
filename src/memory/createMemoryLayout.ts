import type { MemoryPhotoPlacement, MemorySceneLayout } from "./types";

const supportingLayoutPresets = [
  { x: -3.4, y: 1.55, z: -1.9, rotationY: -0.24, scale: 0.62 },
  { x: -1.75, y: -0.55, z: -2.45, rotationY: 0.16, scale: 0.66 },
  { x: 1.9, y: 1.25, z: -3.0, rotationY: -0.14, scale: 0.7 },
  { x: 3.65, y: 0.05, z: -3.55, rotationY: 0.2, scale: 0.64 },
  { x: -2.95, y: -1.75, z: -4.2, rotationY: -0.18, scale: 0.6 },
  { x: 0.2, y: -1.35, z: -4.75, rotationY: 0.1, scale: 0.62 },
  { x: 2.85, y: 1.9, z: -5.3, rotationY: 0.24, scale: 0.58 },
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
    x: direction * (3.25 + ring * 0.7),
    y: ring % 2 === 0 ? 1.8 : -1.65,
    z: -5.7 - mirroredIndex * 0.45,
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
