import "./styles/global.css";
import "./styles/stage.css";
import { createMusicController } from "./audio/musicController";
import { createApp } from "./app/createApp";
import { renderStage } from "./app/renderStage";
import { assetManifest } from "./content/assets";
import { sceneCopy } from "./content/copy";
import { storyScenes } from "./content/storyConfig";
import { createStoryEngine } from "./engine/storyEngine";
import { preloadImages } from "./lib/preloadAssets";

const root = document.querySelector<HTMLElement>("#app");

if (!root) {
  throw new Error("#app root not found");
}

createApp(root);

const appRoot = document.querySelector<HTMLElement>('[data-role="app-root"]');
const chestTrigger = document.querySelector<HTMLButtonElement>(
  '[data-role="chest-trigger"]',
);
const startOverlay = document.querySelector<HTMLButtonElement>(
  '[data-role="start-overlay"]',
);
const viewportNote = document.querySelector<HTMLElement>('[data-role="viewport-note"]');
const bgm = document.querySelector<HTMLAudioElement>('[data-role="bgm"]');

if (!appRoot || !chestTrigger || !startOverlay || !viewportNote || !bgm) {
  throw new Error("Critical app nodes are missing");
}

const stageRoot = appRoot;

bgm.src = assetManifest.music;
viewportNote.hidden = window.innerWidth >= 1024;

const speedFactor = new URLSearchParams(window.location.search).has("testMode")
  ? 0.01
  : 1;
const tunedScenes = storyScenes.map((scene) =>
  scene.autoAdvance
    ? { ...scene, durationMs: Math.max(40, Math.round(scene.durationMs * speedFactor)) }
    : scene,
);

const copyByScene = {
  opening: sceneCopy.opening,
  dragon: sceneCopy.dragon,
  rescue: "",
  memory: sceneCopy.memory,
  chest: sceneCopy.chestPrompt,
  proposal: "",
} as const;

const stageImageAssets = [...Object.values(assetManifest.sprites), ...assetManifest.photos];

function renderScene(sceneId: keyof typeof copyByScene) {
  renderStage(stageRoot, {
    sceneId,
    subtitle: copyByScene[sceneId],
    photos: sceneId === "memory" ? [...assetManifest.photos] : [],
    showPrompt: sceneId === "chest",
    proposalLine: "",
  });
}

renderScene("opening");

const engine = createStoryEngine(tunedScenes, {
  onSceneChange(sceneId) {
    renderScene(sceneId);
  },
});

const music = createMusicController(bgm);
let hasStarted = false;

startOverlay.addEventListener("click", async () => {
  if (hasStarted) {
    return;
  }

  hasStarted = true;
  startOverlay.hidden = true;

  await Promise.allSettled([preloadImages(stageImageAssets), music.start()]);

  engine.start();
});

chestTrigger.addEventListener("click", () => {
  engine.revealProposal();
});
