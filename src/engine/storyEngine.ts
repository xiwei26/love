import type { SceneDefinition, SceneId, StoryEngineState } from "./types";

interface StoryEngineOptions {
  onSceneChange: (sceneId: SceneId) => void;
}

interface StoryEngine {
  start: () => void;
  revealProposal: () => void;
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

  function publish(sceneIndex: number) {
    index = sceneIndex;
    const scene = scenes[index];

    state = {
      sceneId: scene.id,
      isPaused: !scene.autoAdvance,
    };

    options.onSceneChange(scene.id);
  }

  function queueAdvance(sceneIndex: number) {
    clearScheduledAdvance();

    const scene = scenes[sceneIndex];

    if (!scene.autoAdvance || sceneIndex >= scenes.length - 1) {
      return;
    }

    timer = window.setTimeout(() => {
      publish(sceneIndex + 1);
      queueAdvance(sceneIndex + 1);
    }, scene.durationMs);
  }

  return {
    start() {
      publish(0);
      queueAdvance(0);
    },
    revealProposal() {
      if (state.sceneId !== "chest") {
        return;
      }

      clearScheduledAdvance();

      const proposalIndex = scenes.findIndex((scene) => scene.id === "proposal");

      if (proposalIndex === -1) {
        throw new Error("Proposal scene is missing");
      }

      publish(proposalIndex);
    },
    getState() {
      return state;
    },
    stop() {
      clearScheduledAdvance();
    },
  };
}
