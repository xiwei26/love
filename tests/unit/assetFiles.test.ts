declare global {
  interface Array<T> {
    at(index: number): T | undefined;
  }
}

import { describe, expect, it } from "vitest";

const requiredFiles = [
  "public/audio/proposal-theme.mp3",
  "public/photos/memory-01.jpg",
  "public/photos/memory-02.jpg",
  "public/photos/memory-03.jpg",
  "public/photos/memory-04.jpg",
  "public/photos/memory-05.jpg",
  "public/photos/memory-06.jpg",
  "public/photos/memory-07.jpg",
  "public/photos/memory-08.jpg",
  "public/backgrounds/stage-opening.png",
  "public/backgrounds/stage-dragon.png",
  "public/backgrounds/stage-rescue.png",
  "public/backgrounds/stage-chest.png",
  "public/backgrounds/stage-proposal.png",
  "public/sprites/hero-girl-idle.png",
  "public/sprites/hero-girl-rescued.png",
  "public/sprites/hero-boy-run.png",
  "public/sprites/hero-boy-kneel.png",
  "public/sprites/dragon.png",
  "public/sprites/chest-closed.png",
  "public/sprites/chest-open.png",
  "public/sprites/heart.png",
  "public/sprites/ring.png",
];

describe("production assets", () => {
  it("contains every required media file", () => {
    const availableFiles = new Set(Object.keys(import.meta.glob("/public/**/*")));

    requiredFiles.forEach((file) => {
      expect(availableFiles.has(`/${file}`), `${file} should exist`).toBe(true);
    });
  });
});
