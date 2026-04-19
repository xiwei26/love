import "./styles/global.css";
import "./styles/stage.css";
import { createApp } from "./app/createApp";
import { renderStage } from "./app/renderStage";
import { sceneCopy } from "./content/copy";
import { storyScenes } from "./content/storyConfig";
import { createStoryEngine } from "./engine/storyEngine";

const root = document.querySelector<HTMLElement>("#app");

if (!root) {
  throw new Error("#app root not found");
}

createApp(root);

const appRoot = document.querySelector<HTMLElement>('[data-role="app-root"]');

if (!appRoot) {
  throw new Error("App root not rendered");
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
      photos: [],
      showPrompt: sceneId === "chest",
      proposalLine: "",
    });
  },
});

engine.start();
