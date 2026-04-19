import { describe, expect, it } from "vitest";
import { assetManifest } from "../../src/content/assets";
import {
  finalProposalLine,
  sceneCopy,
  sceneSubtitleCues,
} from "../../src/content/copy";
import { storyScenes } from "../../src/content/storyConfig";

describe("story content contracts", () => {
  it("keeps the autoplay timeline in the 60-90 second target", () => {
    const autoplayDuration = storyScenes
      .filter((scene) => scene.autoAdvance)
      .reduce((total, scene) => total + scene.durationMs, 0);

    expect(autoplayDuration).toBeGreaterThanOrEqual(60000);
    expect(autoplayDuration).toBeLessThanOrEqual(90000);
  });

  it("defines the required scene order and Chinese copy", () => {
    expect(storyScenes.map((scene) => scene.id)).toEqual([
      "opening",
      "dragon",
      "rescue",
      "memory",
      "chest",
      "proposal",
    ]);
    expect(sceneCopy.opening).toContain("秘密");
    expect(sceneCopy.chestPrompt).toContain("终章");
    expect(finalProposalLine).toBe("你愿意嫁给我吗？");
  });

  it("adds follow-up subtitle cues for the dragon and rescue scenes", () => {
    expect(sceneSubtitleCues.dragon?.map((cue) => cue.text)).toEqual(
      expect.arrayContaining([
        "勇士奚为踏入龙穴，一路过关斩将。",
      ]),
    );
    expect(sceneSubtitleCues.rescue?.map((cue) => cue.text)).toEqual(
      expect.arrayContaining([
        "可奚为没有后退，终于打败了巨龙。",
      ]),
    );
  });

  it("pins the production photo set to eight ordered images", () => {
    expect(assetManifest.photos).toEqual([
      "/photos/memory-01.jpg",
      "/photos/memory-02.jpg",
      "/photos/memory-03.jpg",
      "/photos/memory-04.jpg",
      "/photos/memory-05.jpg",
      "/photos/memory-06.jpg",
      "/photos/memory-07.jpg",
      "/photos/memory-08.jpg",
    ]);
  });
});
