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

const heroAvoidRadius = { x: 2.35, y: 2.6, z: 2.8 } as const;
const supportingAvoidRadius = { x: 2.1, y: 1.75, z: 1.75 } as const;
const maxSupportX = 5.1;
const maxSupportY = 2.4;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function createBaseSupportingPlacement(photoUrl: string, index: number): MemoryPhotoPlacement {
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

function pushAwayFromHero(item: MemoryPhotoPlacement) {
  const dx = item.x;
  const dy = item.y - 0.08;
  const dz = item.z + 0.4;

  const overlapX = heroAvoidRadius.x - Math.abs(dx);
  const overlapY = heroAvoidRadius.y - Math.abs(dy);
  const overlapZ = heroAvoidRadius.z - Math.abs(dz);

  if (overlapX <= 0 || overlapY <= 0 || overlapZ <= 0) {
    return item;
  }

  if (overlapX <= overlapY) {
    item.x += (dx === 0 ? Math.sign(item.rotationY || 1) : Math.sign(dx)) * (overlapX + 0.32);
  } else {
    item.y += (dy === 0 ? (item.y >= 0 ? 1 : -1) : Math.sign(dy)) * (overlapY + 0.38);
  }

  item.z -= overlapZ * 0.2;
  return item;
}

function relaxSupportingCollisions(placements: MemoryPhotoPlacement[]) {
  for (let pass = 0; pass < 18; pass += 1) {
    let moved = false;

    for (let index = 0; index < placements.length; index += 1) {
      const current = placements[index];

      for (let compareIndex = index + 1; compareIndex < placements.length; compareIndex += 1) {
        const next = placements[compareIndex];
        const dx = next.x - current.x;
        const dy = next.y - current.y;
        const dz = next.z - current.z;

        const overlapX = supportingAvoidRadius.x - Math.abs(dx);
        const overlapY = supportingAvoidRadius.y - Math.abs(dy);
        const overlapZ = supportingAvoidRadius.z - Math.abs(dz);

        if (overlapX <= 0 || overlapY <= 0 || overlapZ <= 0) {
          continue;
        }

        moved = true;

        if (overlapX >= overlapY) {
          const pushY = (overlapY / 2 + 0.08) * (dy === 0 ? (index % 2 === 0 ? -1 : 1) : Math.sign(dy));
          current.y -= pushY;
          next.y += pushY;
        } else {
          const pushX = (overlapX / 2 + 0.12) * (dx === 0 ? (index % 2 === 0 ? -1 : 1) : Math.sign(dx));
          current.x -= pushX;
          next.x += pushX;
        }

        const depthPush = overlapZ / 2 + 0.1;
        current.z += depthPush * 0.35;
        next.z -= depthPush * 0.65;
      }

      current.x = clamp(current.x, -maxSupportX, maxSupportX);
      current.y = clamp(current.y, -maxSupportY, maxSupportY);
    }

    placements.forEach((item) => {
      pushAwayFromHero(item);
      item.x = clamp(item.x, -maxSupportX, maxSupportX);
      item.y = clamp(item.y, -maxSupportY, maxSupportY);
    });

    if (!moved) {
      break;
    }
  }

  placements.forEach((item) => {
    item.rotationY = clamp(item.x / 18, -0.28, 0.28);
    item.scale = clamp(item.scale, 0.56, 0.7);
  });
}

function applyPhotoSpecificTuning(placements: MemoryPhotoPlacement[]) {
  placements.forEach((item) => {
    if (item.photoUrl.endsWith("memory-02.jpg")) {
      item.x = clamp(item.x + 0.55, -maxSupportX, maxSupportX);
      item.rotationY = clamp(item.x / 18, -0.28, 0.28);
    }

    if (item.photoUrl.endsWith("memory-06.jpg")) {
      item.scale = clamp(item.scale + 0.08, 0.56, 0.72);
    }

    if (item.photoUrl.endsWith("memory-08.jpg")) {
      item.scale = clamp(item.scale + 0.1, 0.56, 0.72);
    }
  });
}

function createSupportingPlacement(photoUrl: string, index: number): MemoryPhotoPlacement {
  return createBaseSupportingPlacement(photoUrl, index);
}

export function createMemoryLayout(photoUrls: string[]): MemorySceneLayout {
  const [heroUrl, ...supportingUrls] = photoUrls;
  const supporting = supportingUrls.map(createSupportingPlacement);
  relaxSupportingCollisions(supporting);
  applyPhotoSpecificTuning(supporting);

  return {
    hero: {
      photoUrl: heroUrl,
      x: 0,
      y: 0.08,
      z: -0.4,
      rotationY: 0,
      scale: 1,
    },
    supporting,
    gatherTargets: photoUrls.map((_, index) => ({
      x: 0,
      y: 0,
      z: -2.2 - index * 0.1,
    })),
  };
}
