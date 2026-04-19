import "./styles/global.css";
import "./styles/stage.css";
import { createApp } from "./app/createApp";
import { renderStage } from "./app/renderStage";
import { assetManifest } from "./content/assets";
import { sceneCopy } from "./content/copy";
import { storyScenes } from "./content/storyConfig";
import { createStoryEngine } from "./engine/storyEngine";

const root = document.querySelector<HTMLElement>("#app");

if (!root) {
  throw new Error("#app root not found");
}

createApp(root);

const appRoot = document.querySelector<HTMLElement>('[data-role="app-root"]');
const chestTrigger = document.querySelector<HTMLButtonElement>(
  '[data-role="chest-trigger"]',
);

if (!appRoot || !chestTrigger) {
  throw new Error("Critical app nodes are missing");
}

const copyByScene = {
  opening: sceneCopy.opening,
  dragon: sceneCopy.dragon,
  rescue: "",
  memory: sceneCopy.memory,
  chest: sceneCopy.chestPrompt,
  proposal: "",
} as const;

const engine = createStoryEngine(storyScenes, {
  onSceneChange(sceneId) {
    renderStage(appRoot, {
      sceneId,
      subtitle: copyByScene[sceneId],
      photos: sceneId === "memory" ? [...assetManifest.photos] : [],
      showPrompt: sceneId === "chest",
      proposalLine: "",
    });
  },
});

chestTrigger.addEventListener("click", () => {
  engine.revealProposal();
});

engine.start();
