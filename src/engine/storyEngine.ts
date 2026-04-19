import type { SceneDefinition, SceneId, StoryEngineState } from "./types";

interface StoryEngineOptions {
  onSceneChange: (sceneId: SceneId) => void;
}

interface StoryEngine {
  start: () => void;
  getState: () => StoryEngineState;
  stop: () => void;
}

export function createStoryEngine(
  scenes: SceneDefinition[],
  options: StoryEngineOptions,
): StoryEngine {
  let index = 0;
  let timer: number | undefined;
  let state: StoryEngineState = {
    sceneId: scenes[0].id,
    isPaused: false,
  };

  function clearScheduledAdvance() {
    if (timer === undefined) {
      return;
    }

    window.clearTimeout(timer);
    timer = undefined;
  }

  function advanceTo(nextIndex: number) {
    clearScheduledAdvance();

    index = nextIndex;
    const scene = scenes[index];

    state = {
      sceneId: scene.id,
      isPaused: !scene.autoAdvance,
    };

    options.onSceneChange(scene.id);

    if (!scene.autoAdvance || nextIndex >= scenes.length - 1) {
      return;
    }

    timer = window.setTimeout(() => {
      advanceTo(nextIndex + 1);
    }, scene.durationMs);
  }

  return {
    start() {
      advanceTo(0);
    },
    getState() {
      return state;
    },
    stop() {
      clearScheduledAdvance();
    },
  };
}
