import { describe, expect, it, vi } from "vitest";
import { storyScenes } from "../../src/content/storyConfig";
import { createStoryEngine } from "../../src/engine/storyEngine";

describe("createStoryEngine", () => {
  it("autoplays to the chest scene and then pauses", () => {
    vi.useFakeTimers();
    const seen: string[] = [];

    const engine = createStoryEngine(storyScenes, {
      onSceneChange(sceneId) {
        seen.push(sceneId);
      },
    });

    engine.start();
    vi.advanceTimersByTime(60000);

    expect(seen).toEqual(["opening", "dragon", "rescue", "memory", "chest"]);
    expect(engine.getState().sceneId).toBe("chest");
    expect(engine.getState().isPaused).toBe(true);
  });

  it("reveals the proposal only after the chest scene is reached", () => {
    vi.useFakeTimers();
    const seen: string[] = [];

    const engine = createStoryEngine(storyScenes, {
      onSceneChange(sceneId) {
        seen.push(sceneId);
      },
    });

    engine.start();
    engine.revealProposal();
    expect(seen).toEqual(["opening"]);

    vi.advanceTimersByTime(60000);
    engine.revealProposal();

    expect(seen.at(-1)).toBe("proposal");
    expect(engine.getState().sceneId).toBe("proposal");
  });
});
