export type SceneId =
  | "opening"
  | "dragon"
  | "rescue"
  | "memory"
  | "chest"
  | "proposal";

export interface SceneDefinition {
  id: SceneId;
  durationMs: number;
  autoAdvance: boolean;
}

export interface StoryEngineState {
  sceneId: SceneId;
  isPaused: boolean;
}
