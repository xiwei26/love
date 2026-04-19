import type { SceneDefinition } from "../engine/types";

export const storyScenes: SceneDefinition[] = [
  { id: "opening", durationMs: 8000, autoAdvance: true },
  { id: "dragon", durationMs: 11000, autoAdvance: true },
  { id: "rescue", durationMs: 16000, autoAdvance: true },
  { id: "memory", durationMs: 25000, autoAdvance: true },
  { id: "chest", durationMs: 0, autoAdvance: false },
  { id: "proposal", durationMs: 0, autoAdvance: false },
];
