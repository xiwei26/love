import "./styles/global.css";
import "./styles/stage.css";
import { createMusicController } from "./audio/musicController";
import { createApp } from "./app/createApp";
import { renderStage } from "./app/renderStage";
import { assetManifest } from "./content/assets";
import { sceneCopy, sceneSubtitleCues } from "./content/copy";
import { createMemoryScene } from "./memory/createMemoryScene";
import { storyScenes } from "./content/storyConfig";
import { createStoryEngine } from "./engine/storyEngine";
import type { SceneId } from "./engine/types";
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
const subtitle = document.querySelector<HTMLElement>('[data-role="subtitle"]');
const memoryHost = document.querySelector<HTMLElement>('[data-role="memory-host"]');
const viewportNote = document.querySelector<HTMLElement>('[data-role="viewport-note"]');
const bgm = document.querySelector<HTMLAudioElement>('[data-role="bgm"]');

if (
  !appRoot ||
  !chestTrigger ||
  !startOverlay ||
  !subtitle ||
  !memoryHost ||
  !viewportNote ||
  !bgm
) {
  throw new Error("Critical app nodes are missing");
}

const stageRoot = appRoot;
const subtitleElement = subtitle;
const memoryScene = createMemoryScene();

bgm.src = assetManifest.music;
viewportNote.hidden = window.innerWidth >= 1024;
memoryScene.mount(memoryHost);

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

const stageImageAssets = [
  ...Object.values(assetManifest.sprites),
  ...Object.values(assetManifest.backgrounds),
  ...assetManifest.photos,
];
let subtitleTimers: number[] = [];

function syncViewportHeight() {
  document.documentElement.style.setProperty("--app-height", `${window.innerHeight}px`);
}

function syncMemorySize() {
  const rect = stageRoot.getBoundingClientRect();
  memoryScene.resize(rect.width, rect.height);
}

function clearSubtitleCues() {
  subtitleTimers.forEach((timer) => window.clearTimeout(timer));
  subtitleTimers = [];
}

function applySubtitle(text: string) {
  subtitleElement.textContent = text;
}

function scheduleSubtitleCues(sceneId: SceneId) {
  clearSubtitleCues();

  const cues = sceneSubtitleCues[sceneId];

  if (!cues?.length) {
    return;
  }

  subtitleTimers = cues.map((cue) =>
    window.setTimeout(() => {
      applySubtitle(cue.text);
    }, Math.max(40, Math.round(cue.atMs * speedFactor))),
  );
}

function renderScene(sceneId: keyof typeof copyByScene) {
  renderStage(stageRoot, {
    sceneId,
    subtitle: copyByScene[sceneId],
    photos: [],
    showPrompt: sceneId === "chest",
    proposalLine: "",
  });

  if (sceneId === "memory") {
    void memoryScene.start([...assetManifest.photos]);
  } else {
    memoryScene.stop();
  }

  scheduleSubtitleCues(sceneId);
}

function syncViewportLayout() {
  syncViewportHeight();
  syncMemorySize();
}

syncViewportLayout();
window.addEventListener("resize", syncViewportLayout);
window.visualViewport?.addEventListener("resize", syncViewportLayout);

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
  clearSubtitleCues();
  engine.revealProposal();
});
