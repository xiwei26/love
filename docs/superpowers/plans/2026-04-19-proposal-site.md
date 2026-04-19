# Proposal Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page proposal website that plays a pixel fairytale rescue sequence, transitions into a shared-photo memory montage, pauses at a glowing chest, and reveals a final kneeling proposal when the chest is clicked.

**Architecture:** Use Vite + TypeScript to render one DOM-based stage with layered CSS animation and a small scene engine that advances through timed states. Keep subtitles, scene timing, photo order, and asset paths in configuration modules so the story can be tuned without rewriting the whole app.

**Tech Stack:** Vite, TypeScript, vanilla DOM APIs, CSS animations, Vitest, Playwright

---

## Planned File Structure

- `package.json` - npm scripts for dev, build, unit tests, and e2e tests
- `vitest.config.ts` - jsdom unit-test configuration
- `playwright.config.ts` - browser smoke-test configuration
- `index.html` - single app root for Vite
- `src/main.ts` - bootstraps the app
- `src/app/createApp.ts` - wires preload, audio gate, story engine, and click handling
- `src/app/renderStage.ts` - owns DOM updates for scene, subtitle, prompt, and photo montage
- `src/content/copy.ts` - Chinese subtitle and proposal copy
- `src/content/assets.ts` - ordered photo list, sprite paths, and music path
- `src/content/storyConfig.ts` - scene ordering, durations, and prompt metadata
- `src/engine/types.ts` - typed scene and app-state definitions
- `src/engine/storyEngine.ts` - autoplay scene engine plus final reveal trigger
- `src/lib/preloadAssets.ts` - preload images/audio and skip missing photos safely
- `src/audio/musicController.ts` - autoplay handling and graceful click-to-start fallback
- `src/styles/global.css` - app-wide reset and typography
- `src/styles/stage.css` - stage layout, scene look, subtitle, chest prompt, and final tableau
- `tests/unit/createApp.test.ts` - app-shell rendering test
- `tests/unit/storyConfig.test.ts` - scene timing and copy contract test
- `tests/unit/renderStage.test.ts` - renderer behavior test
- `tests/unit/preloadAssets.test.ts` - preload resilience test
- `tests/unit/storyEngine.test.ts` - scene-engine timing and proposal trigger test
- `tests/unit/assetFiles.test.ts` - production asset presence test
- `tests/e2e/proposal-flow.spec.ts` - browser-level happy-path verification
- `public/photos/*` - ordered relationship photos used in the memory montage
- `public/sprites/*` - character, dragon, chest, heart, and ring sprites
- `public/audio/proposal-theme.mp3` - background music

### Task 1: Bootstrap The Project And Render The App Shell

**Files:**
- Create: `package.json`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `index.html`
- Create: `src/main.ts`
- Create: `src/app/createApp.ts`
- Create: `src/styles/global.css`
- Test: `tests/unit/createApp.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { createApp } from "../../src/app/createApp";

describe("createApp", () => {
  it("renders the stage shell and app root controls", () => {
    document.body.innerHTML = '<div id="app"></div>';

    createApp(document.querySelector<HTMLElement>("#app")!);

    expect(document.querySelector(".proposal-app")).not.toBeNull();
    expect(document.querySelector('[data-role="subtitle"]')?.textContent).toBe("");
    expect(document.querySelector('[data-role="start-overlay"]')).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
npx vitest run tests/unit/createApp.test.ts
```

Expected: FAIL with `Cannot find module '../../src/app/createApp'` or a missing Vite/Vitest configuration error.

- [ ] **Step 3: Write minimal implementation**

Run:

```powershell
npm create vite@latest . -- --template vanilla-ts
npm install
npm install -D vitest jsdom @playwright/test
if (-not (Test-Path .git)) { git init; git branch -M main }
New-Item -ItemType Directory -Force src\app,src\styles,tests\unit,tests\e2e | Out-Null
```

Replace the `scripts` section in `package.json` with:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  }
}
```

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["tests/unit/**/*.test.ts"]
  }
});
```

Create `playwright.config.ts`:

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  use: {
    baseURL: "http://127.0.0.1:4173"
  },
  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 4173",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: true
  }
});
```

Replace `index.html` with:

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>像素童话求婚</title>
    <meta
      name="description"
      content="A pixel fairytale proposal website with a rescue story, memory montage, and final ring reveal."
    />
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

Create `src/app/createApp.ts`:

```ts
export function createApp(root: HTMLElement) {
  root.innerHTML = `
    <main class="proposal-app" data-scene="opening">
      <div class="stage" data-role="stage">
        <div class="stage__backdrop"></div>
        <div class="stage__actors"></div>
        <div class="stage__effects"></div>
        <div class="stage__photos" data-role="photo-strip"></div>
        <p class="stage__subtitle" data-role="subtitle"></p>
        <button class="stage__prompt" data-role="chest-trigger" type="button" hidden>
          打开终章
        </button>
      </div>
      <button class="start-overlay" data-role="start-overlay" type="button">
        进入童话
      </button>
    </main>
  `;
}
```

Create `src/main.ts`:

```ts
import "./styles/global.css";
import { createApp } from "./app/createApp";

const root = document.querySelector<HTMLElement>("#app");

if (!root) {
  throw new Error("#app root not found");
}

createApp(root);
```

Create `src/styles/global.css`:

```css
:root {
  color: #fff7f8;
  background: #08111f;
  font-family: "Microsoft YaHei", "PingFang SC", sans-serif;
}

* {
  box-sizing: border-box;
}

html,
body,
#app {
  margin: 0;
  min-height: 100%;
}

body {
  min-height: 100vh;
}

button {
  font: inherit;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```powershell
npx vitest run tests/unit/createApp.test.ts
```

Expected: PASS with `1 passed`.

- [ ] **Step 5: Commit**

```powershell
git add package.json vitest.config.ts playwright.config.ts index.html src/main.ts src/app/createApp.ts src/styles/global.css tests/unit/createApp.test.ts
git commit -m "chore: bootstrap proposal site shell"
```

### Task 2: Define Story Copy, Scene Timing, And Asset Contracts

**Files:**
- Create: `src/engine/types.ts`
- Create: `src/content/copy.ts`
- Create: `src/content/assets.ts`
- Create: `src/content/storyConfig.ts`
- Test: `tests/unit/storyConfig.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { assetManifest } from "../../src/content/assets";
import { finalProposalLine, sceneCopy } from "../../src/content/copy";
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
      "proposal"
    ]);
    expect(sceneCopy.opening).toContain("秘密");
    expect(sceneCopy.chestPrompt).toContain("终章");
    expect(finalProposalLine).toBe("你愿意嫁给我吗？");
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
      "/photos/memory-08.jpg"
    ]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
npx vitest run tests/unit/storyConfig.test.ts
```

Expected: FAIL with missing module errors for `storyConfig`, `copy`, or `assets`.

- [ ] **Step 3: Write minimal implementation**

Create `src/engine/types.ts`:

```ts
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
```

Create `src/content/copy.ts`:

```ts
export const sceneCopy = {
  opening: "在一个藏着秘密与宝藏的世界里……",
  dragon: "她不小心闯进了龙守护的秘境。",
  memory: "原来最珍贵的宝藏，一直都是我们一起走过的时光。",
  chestPrompt: "点一下，打开属于我们的终章。"
} as const;

export const finalProposalLine = "你愿意嫁给我吗？";
```

Create `src/content/assets.ts`:

```ts
export const assetManifest = {
  music: "/audio/proposal-theme.mp3",
  sprites: {
    girlIdle: "/sprites/hero-girl-idle.png",
    girlRescued: "/sprites/hero-girl-rescued.png",
    boyRun: "/sprites/hero-boy-run.png",
    boyKneel: "/sprites/hero-boy-kneel.png",
    dragon: "/sprites/dragon.png",
    chestClosed: "/sprites/chest-closed.png",
    chestOpen: "/sprites/chest-open.png",
    heart: "/sprites/heart.png",
    ring: "/sprites/ring.png"
  },
  photos: [
    "/photos/memory-01.jpg",
    "/photos/memory-02.jpg",
    "/photos/memory-03.jpg",
    "/photos/memory-04.jpg",
    "/photos/memory-05.jpg",
    "/photos/memory-06.jpg",
    "/photos/memory-07.jpg",
    "/photos/memory-08.jpg"
  ]
} as const;
```

Create `src/content/storyConfig.ts`:

```ts
import type { SceneDefinition } from "../engine/types";

export const storyScenes: SceneDefinition[] = [
  { id: "opening", durationMs: 8000, autoAdvance: true },
  { id: "dragon", durationMs: 11000, autoAdvance: true },
  { id: "rescue", durationMs: 16000, autoAdvance: true },
  { id: "memory", durationMs: 25000, autoAdvance: true },
  { id: "chest", durationMs: 0, autoAdvance: false },
  { id: "proposal", durationMs: 0, autoAdvance: false }
];
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```powershell
npx vitest run tests/unit/storyConfig.test.ts
```

Expected: PASS with `3 passed`.

- [ ] **Step 5: Commit**

```powershell
git add src/engine/types.ts src/content/copy.ts src/content/assets.ts src/content/storyConfig.ts tests/unit/storyConfig.test.ts
git commit -m "feat: add story timing and content contracts"
```

### Task 3: Build The Renderer And Base Stage Presentation

**Files:**
- Create: `src/app/renderStage.ts`
- Create: `src/styles/stage.css`
- Modify: `src/app/createApp.ts`
- Modify: `src/main.ts`
- Test: `tests/unit/renderStage.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { sceneCopy } from "../../src/content/copy";
import { renderStage } from "../../src/app/renderStage";

describe("renderStage", () => {
  it("updates the scene, subtitle, and chest prompt visibility", () => {
    document.body.innerHTML = `
      <main class="proposal-app" data-scene="opening">
        <div data-role="stage"></div>
        <div data-role="photo-strip"></div>
        <p data-role="subtitle"></p>
        <button data-role="chest-trigger" hidden></button>
        <p data-role="proposal-line"></p>
      </main>
    `;

    renderStage(document.querySelector(".proposal-app") as HTMLElement, {
      sceneId: "chest",
      subtitle: sceneCopy.chestPrompt,
      photos: [],
      showPrompt: true,
      proposalLine: ""
    });

    expect(document.querySelector(".proposal-app")?.dataset.scene).toBe("chest");
    expect(document.querySelector('[data-role="subtitle"]')?.textContent).toBe(sceneCopy.chestPrompt);
    expect((document.querySelector('[data-role="chest-trigger"]') as HTMLButtonElement).hidden).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
npx vitest run tests/unit/renderStage.test.ts
```

Expected: FAIL with `Cannot find module '../../src/app/renderStage'`.

- [ ] **Step 3: Write minimal implementation**

Replace `src/app/createApp.ts` with:

```ts
export function createApp(root: HTMLElement) {
  root.innerHTML = `
    <main class="proposal-app" data-scene="opening">
      <div class="stage" data-role="stage">
        <div class="stage__backdrop"></div>
        <div class="stage__actors"></div>
        <div class="stage__effects"></div>
        <div class="stage__photos" data-role="photo-strip"></div>
        <p class="stage__subtitle" data-role="subtitle"></p>
        <p class="stage__proposal-line" data-role="proposal-line"></p>
        <button class="stage__prompt" data-role="chest-trigger" type="button" hidden>
          打开终章
        </button>
        <p class="stage__viewport-note" data-role="viewport-note" hidden>
          推荐使用电脑横屏观看这段童话。
        </p>
      </div>
      <button class="start-overlay" data-role="start-overlay" type="button">
        进入童话
      </button>
    </main>
  `;
}
```

Create `src/app/renderStage.ts`:

```ts
import type { SceneId } from "../engine/types";

interface RenderStageOptions {
  sceneId: SceneId;
  subtitle: string;
  photos: string[];
  showPrompt: boolean;
  proposalLine: string;
}

export function renderStage(root: HTMLElement, options: RenderStageOptions) {
  root.dataset.scene = options.sceneId;

  const subtitle = root.querySelector<HTMLElement>('[data-role="subtitle"]');
  const photoStrip = root.querySelector<HTMLElement>('[data-role="photo-strip"]');
  const chestTrigger = root.querySelector<HTMLButtonElement>('[data-role="chest-trigger"]');
  const proposalLine = root.querySelector<HTMLElement>('[data-role="proposal-line"]');

  if (!subtitle || !photoStrip || !chestTrigger || !proposalLine) {
    throw new Error("Stage nodes are missing");
  }

  subtitle.textContent = options.subtitle;
  proposalLine.textContent = options.proposalLine;
  chestTrigger.hidden = !options.showPrompt;
  photoStrip.innerHTML = options.photos
    .map(
      (photo, index) => `
        <figure class="memory-card" style="--memory-index:${index}">
          <img src="${photo}" alt="回忆照片 ${index + 1}" />
        </figure>
      `
    )
    .join("");
}
```

Create `src/styles/stage.css`:

```css
.proposal-app {
  min-height: 100vh;
  background:
    radial-gradient(circle at top, rgba(255, 231, 214, 0.15), transparent 40%),
    linear-gradient(180deg, #09182c 0%, #122744 48%, #2d1839 100%);
}

.stage {
  position: relative;
  width: min(1200px, 100vw);
  min-height: 100vh;
  margin: 0 auto;
  overflow: hidden;
}

.stage__subtitle,
.stage__proposal-line,
.stage__prompt,
.stage__viewport-note {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 4;
}

.stage__subtitle {
  top: 72px;
  letter-spacing: 0.08em;
}

.stage__proposal-line {
  bottom: 160px;
  font-size: 40px;
  font-weight: 700;
}

.stage__prompt {
  bottom: 90px;
}

.stage__photos {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  gap: 16px;
  z-index: 3;
}

.memory-card img {
  width: min(34vw, 360px);
  border-radius: 20px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
}
```

Update `src/main.ts`:

```ts
import "./styles/global.css";
import "./styles/stage.css";
import { createApp } from "./app/createApp";
import { renderStage } from "./app/renderStage";

const root = document.querySelector<HTMLElement>("#app");

if (!root) {
  throw new Error("#app root not found");
}

createApp(root);

renderStage(document.querySelector(".proposal-app") as HTMLElement, {
  sceneId: "opening",
  subtitle: "",
  photos: [],
  showPrompt: false,
  proposalLine: ""
});
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```powershell
npx vitest run tests/unit/renderStage.test.ts
```

Expected: PASS with `1 passed`.

- [ ] **Step 5: Commit**

```powershell
git add src/app/createApp.ts src/app/renderStage.ts src/main.ts src/styles/stage.css tests/unit/renderStage.test.ts
git commit -m "feat: render stage shell and base scene presentation"
```

### Task 4: Preload Media And Add Graceful Audio Start Handling

**Files:**
- Create: `src/lib/preloadAssets.ts`
- Create: `src/audio/musicController.ts`
- Modify: `src/app/createApp.ts`
- Test: `tests/unit/preloadAssets.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { beforeEach, describe, expect, it, vi } from "vitest";
import { preloadImages } from "../../src/lib/preloadAssets";

class FakeImage {
  onload: null | (() => void) = null;
  onerror: null | (() => void) = null;

  set src(value: string) {
    queueMicrotask(() => {
      if (value.includes("missing")) {
        this.onerror?.();
      } else {
        this.onload?.();
      }
    });
  }
}

describe("preloadImages", () => {
  beforeEach(() => {
    vi.stubGlobal("Image", FakeImage);
  });

  it("returns skipped items for missing images without throwing", async () => {
    const result = await preloadImages([
      "/photos/memory-01.jpg",
      "/photos/missing.jpg"
    ]);

    expect(result.loaded).toEqual(["/photos/memory-01.jpg"]);
    expect(result.skipped).toEqual(["/photos/missing.jpg"]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
npx vitest run tests/unit/preloadAssets.test.ts
```

Expected: FAIL with `Cannot find module '../../src/lib/preloadAssets'`.

- [ ] **Step 3: Write minimal implementation**

Create `src/lib/preloadAssets.ts`:

```ts
export async function preloadImages(paths: string[]) {
  const loaded: string[] = [];
  const skipped: string[] = [];

  await Promise.all(
    paths.map(
      (path) =>
        new Promise<void>((resolve) => {
          const image = new Image();
          image.onload = () => {
            loaded.push(path);
            resolve();
          };
          image.onerror = () => {
            skipped.push(path);
            resolve();
          };
          image.src = path;
        })
    )
  );

  return { loaded, skipped };
}
```

Create `src/audio/musicController.ts`:

```ts
export function createMusicController(audio: HTMLAudioElement) {
  audio.loop = true;
  audio.volume = 0.58;

  return {
    async start() {
      try {
        await audio.play();
        return true;
      } catch {
        return false;
      }
    },
    stop() {
      audio.pause();
      audio.currentTime = 0;
    }
  };
}
```

Update `src/app/createApp.ts` to include the overlay copy needed for graceful audio fallback:

```ts
export function createApp(root: HTMLElement) {
  root.innerHTML = `
    <main class="proposal-app" data-scene="opening">
      <div class="stage" data-role="stage">
        <div class="stage__backdrop"></div>
        <div class="stage__actors"></div>
        <div class="stage__effects"></div>
        <div class="stage__photos" data-role="photo-strip"></div>
        <p class="stage__subtitle" data-role="subtitle"></p>
        <p class="stage__proposal-line" data-role="proposal-line"></p>
        <button class="stage__prompt" data-role="chest-trigger" type="button" hidden>
          打开终章
        </button>
        <p class="stage__viewport-note" data-role="viewport-note" hidden>
          推荐使用电脑横屏观看这段童话。
        </p>
      </div>
      <button class="start-overlay" data-role="start-overlay" type="button">
        点击开启音乐与童话
      </button>
      <audio data-role="bgm" preload="auto"></audio>
    </main>
  `;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```powershell
npx vitest run tests/unit/preloadAssets.test.ts
```

Expected: PASS with `1 passed`.

- [ ] **Step 5: Commit**

```powershell
git add src/lib/preloadAssets.ts src/audio/musicController.ts src/app/createApp.ts tests/unit/preloadAssets.test.ts
git commit -m "feat: add resilient preload and music controller"
```

### Task 5: Implement The Scene Engine For Autoplay Through The Chest Pause

**Files:**
- Create: `src/engine/storyEngine.ts`
- Modify: `src/app/createApp.ts`
- Modify: `src/main.ts`
- Test: `tests/unit/storyEngine.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
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
      }
    });

    engine.start();
    vi.advanceTimersByTime(60000);

    expect(seen).toEqual(["opening", "dragon", "rescue", "memory", "chest"]);
    expect(engine.getState().sceneId).toBe("chest");
    expect(engine.getState().isPaused).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
npx vitest run tests/unit/storyEngine.test.ts
```

Expected: FAIL with `Cannot find module '../../src/engine/storyEngine'`.

- [ ] **Step 3: Write minimal implementation**

Create `src/engine/storyEngine.ts`:

```ts
import type { SceneDefinition, SceneId } from "./types";

interface StoryEngineOptions {
  onSceneChange: (sceneId: SceneId) => void;
}

export function createStoryEngine(
  scenes: SceneDefinition[],
  options: StoryEngineOptions
) {
  let index = 0;
  let timer: number | undefined;
  let state = {
    sceneId: scenes[0].id,
    isPaused: false
  };

  function advanceTo(nextIndex: number) {
    index = nextIndex;
    const scene = scenes[index];
    state = {
      sceneId: scene.id,
      isPaused: !scene.autoAdvance
    };
    options.onSceneChange(scene.id);

    if (!scene.autoAdvance) {
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
      if (timer !== undefined) {
        window.clearTimeout(timer);
      }
    }
  };
}
```

Update `src/app/createApp.ts` to label the app root for runtime access:

```ts
export function createApp(root: HTMLElement) {
  root.innerHTML = `
    <main class="proposal-app" data-role="app-root" data-scene="opening">
      <div class="stage" data-role="stage">
        <div class="stage__backdrop"></div>
        <div class="stage__actors"></div>
        <div class="stage__effects"></div>
        <div class="stage__photos" data-role="photo-strip"></div>
        <p class="stage__subtitle" data-role="subtitle"></p>
        <p class="stage__proposal-line" data-role="proposal-line"></p>
        <button class="stage__prompt" data-role="chest-trigger" type="button" hidden>
          打开终章
        </button>
        <p class="stage__viewport-note" data-role="viewport-note" hidden>
          推荐使用电脑横屏观看这段童话。
        </p>
      </div>
      <button class="start-overlay" data-role="start-overlay" type="button">
        点击开启音乐与童话
      </button>
      <audio data-role="bgm" preload="auto"></audio>
    </main>
  `;
}
```

Replace `src/main.ts` with:

```ts
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
  proposal: ""
} as const;

const engine = createStoryEngine(storyScenes, {
  onSceneChange(sceneId) {
    renderStage(appRoot, {
      sceneId,
      subtitle: copyByScene[sceneId],
      photos: [],
      showPrompt: sceneId === "chest",
      proposalLine: ""
    });
  }
});

engine.start();
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```powershell
npx vitest run tests/unit/storyEngine.test.ts
```

Expected: PASS with `1 passed`.

- [ ] **Step 5: Commit**

```powershell
git add src/engine/storyEngine.ts src/app/createApp.ts src/main.ts tests/unit/storyEngine.test.ts
git commit -m "feat: add autoplay scene engine"
```

### Task 6: Add Photo Montage Rendering And Final Chest Reveal Interaction

**Files:**
- Modify: `src/engine/storyEngine.ts`
- Modify: `src/app/renderStage.ts`
- Modify: `src/main.ts`
- Test: `tests/unit/storyEngine.test.ts`

- [ ] **Step 1: Extend the failing test**

Append this test to `tests/unit/storyEngine.test.ts`:

```ts
it("reveals the proposal only after the chest scene is reached", () => {
  vi.useFakeTimers();
  const seen: string[] = [];

  const engine = createStoryEngine(storyScenes, {
    onSceneChange(sceneId) {
      seen.push(sceneId);
    }
  });

  engine.start();
  engine.revealProposal();
  expect(seen).toEqual(["opening"]);

  vi.advanceTimersByTime(60000);
  engine.revealProposal();

  expect(seen.at(-1)).toBe("proposal");
  expect(engine.getState().sceneId).toBe("proposal");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
npx vitest run tests/unit/storyEngine.test.ts
```

Expected: FAIL with `engine.revealProposal is not a function`.

- [ ] **Step 3: Write minimal implementation**

Update `src/engine/storyEngine.ts`:

```ts
import type { SceneDefinition, SceneId } from "./types";

interface StoryEngineOptions {
  onSceneChange: (sceneId: SceneId) => void;
}

export function createStoryEngine(
  scenes: SceneDefinition[],
  options: StoryEngineOptions
) {
  let index = 0;
  let timer: number | undefined;
  let state = {
    sceneId: scenes[0].id,
    isPaused: false
  };

  function publish(sceneIndex: number) {
    index = sceneIndex;
    const scene = scenes[index];
    state = {
      sceneId: scene.id,
      isPaused: !scene.autoAdvance
    };
    options.onSceneChange(scene.id);
  }

  function queueAdvance(sceneIndex: number) {
    const scene = scenes[sceneIndex];

    if (!scene.autoAdvance) {
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

      if (timer !== undefined) {
        window.clearTimeout(timer);
      }

      const proposalIndex = scenes.findIndex((scene) => scene.id === "proposal");
      publish(proposalIndex);
    },
    getState() {
      return state;
    },
    stop() {
      if (timer !== undefined) {
        window.clearTimeout(timer);
      }
    }
  };
}
```

Update `src/app/renderStage.ts`:

```ts
import type { SceneId } from "../engine/types";
import { finalProposalLine } from "../content/copy";

interface RenderStageOptions {
  sceneId: SceneId;
  subtitle: string;
  photos: string[];
  showPrompt: boolean;
  proposalLine: string;
}

export function renderStage(root: HTMLElement, options: RenderStageOptions) {
  root.dataset.scene = options.sceneId;

  const subtitle = root.querySelector<HTMLElement>('[data-role="subtitle"]');
  const photoStrip = root.querySelector<HTMLElement>('[data-role="photo-strip"]');
  const chestTrigger = root.querySelector<HTMLButtonElement>('[data-role="chest-trigger"]');
  const proposalLine = root.querySelector<HTMLElement>('[data-role="proposal-line"]');

  if (!subtitle || !photoStrip || !chestTrigger || !proposalLine) {
    throw new Error("Stage nodes are missing");
  }

  subtitle.textContent = options.subtitle;
  proposalLine.textContent =
    options.sceneId === "proposal" ? finalProposalLine : options.proposalLine;
  chestTrigger.hidden = !options.showPrompt;
  photoStrip.innerHTML =
    options.sceneId === "memory"
      ? options.photos
          .map(
            (photo, index) => `
              <figure class="memory-card" style="--memory-index:${index}">
                <img src="${photo}" alt="回忆照片 ${index + 1}" />
              </figure>
            `
          )
          .join("")
      : "";
}
```

Replace `src/main.ts` with:

```ts
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
const chestTrigger = document.querySelector<HTMLButtonElement>('[data-role="chest-trigger"]');

if (!appRoot || !chestTrigger) {
  throw new Error("Critical app nodes are missing");
}

const copyByScene = {
  opening: sceneCopy.opening,
  dragon: sceneCopy.dragon,
  rescue: "",
  memory: sceneCopy.memory,
  chest: sceneCopy.chestPrompt,
  proposal: ""
} as const;

const engine = createStoryEngine(storyScenes, {
  onSceneChange(sceneId) {
    renderStage(appRoot, {
      sceneId,
      subtitle: copyByScene[sceneId],
      photos: sceneId === "memory" ? assetManifest.photos : [],
      showPrompt: sceneId === "chest",
      proposalLine: ""
    });
  }
});

chestTrigger.addEventListener("click", () => {
  engine.revealProposal();
});

engine.start();
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```powershell
npx vitest run tests/unit/storyEngine.test.ts
```

Expected: PASS with `2 passed`.

- [ ] **Step 5: Commit**

```powershell
git add src/engine/storyEngine.ts src/app/renderStage.ts src/main.ts tests/unit/storyEngine.test.ts
git commit -m "feat: add memory montage and final chest reveal"
```

### Task 7: Wire Real Assets, Graceful Startup, And Browser Smoke Tests

**Files:**
- Create: `tests/unit/assetFiles.test.ts`
- Create: `tests/e2e/proposal-flow.spec.ts`
- Modify: `src/main.ts`
- Modify: `src/app/createApp.ts`
- Modify: `src/styles/stage.css`
- Create or replace: `public/audio/proposal-theme.mp3`
- Create or replace: `public/photos/memory-01.jpg`
- Create or replace: `public/photos/memory-02.jpg`
- Create or replace: `public/photos/memory-03.jpg`
- Create or replace: `public/photos/memory-04.jpg`
- Create or replace: `public/photos/memory-05.jpg`
- Create or replace: `public/photos/memory-06.jpg`
- Create or replace: `public/photos/memory-07.jpg`
- Create or replace: `public/photos/memory-08.jpg`
- Create or replace: `public/sprites/hero-girl-idle.png`
- Create or replace: `public/sprites/hero-girl-rescued.png`
- Create or replace: `public/sprites/hero-boy-run.png`
- Create or replace: `public/sprites/hero-boy-kneel.png`
- Create or replace: `public/sprites/dragon.png`
- Create or replace: `public/sprites/chest-closed.png`
- Create or replace: `public/sprites/chest-open.png`
- Create or replace: `public/sprites/heart.png`
- Create or replace: `public/sprites/ring.png`

- [ ] **Step 1: Write the failing tests**

Create `tests/unit/assetFiles.test.ts`:

```ts
import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";

const requiredFiles = [
  "public/audio/proposal-theme.mp3",
  "public/photos/memory-01.jpg",
  "public/photos/memory-02.jpg",
  "public/photos/memory-03.jpg",
  "public/photos/memory-04.jpg",
  "public/photos/memory-05.jpg",
  "public/photos/memory-06.jpg",
  "public/photos/memory-07.jpg",
  "public/photos/memory-08.jpg",
  "public/sprites/hero-girl-idle.png",
  "public/sprites/hero-girl-rescued.png",
  "public/sprites/hero-boy-run.png",
  "public/sprites/hero-boy-kneel.png",
  "public/sprites/dragon.png",
  "public/sprites/chest-closed.png",
  "public/sprites/chest-open.png",
  "public/sprites/heart.png",
  "public/sprites/ring.png"
];

describe("production assets", () => {
  it("contains every required media file", () => {
    requiredFiles.forEach((file) => {
      expect(existsSync(file), `${file} should exist`).toBe(true);
    });
  });
});
```

Create `tests/e2e/proposal-flow.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("plays to the chest scene and reveals the proposal", async ({ page }) => {
  await page.goto("/?testMode=1");
  await page.getByRole("button", { name: "点击开启音乐与童话" }).click();
  await expect(page.getByText("点一下，打开属于我们的终章。")).toBeVisible();
  await page.getByRole("button", { name: "打开终章" }).click();
  await expect(page.getByText("你愿意嫁给我吗？")).toBeVisible();
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```powershell
npx vitest run tests/unit/assetFiles.test.ts
npx playwright test tests/e2e/proposal-flow.spec.ts
```

Expected:
- Vitest FAIL because the production assets do not exist yet.
- Playwright FAIL because the app does not yet shorten timings in `testMode` and does not wire the start overlay to the music gate.

- [ ] **Step 3: Write minimal implementation**

Create the static-asset directories:

```powershell
New-Item -ItemType Directory -Force public\audio,public\photos,public\sprites | Out-Null
```

Place the final production media under these exact paths:

```text
public/audio/proposal-theme.mp3
public/photos/memory-01.jpg
public/photos/memory-02.jpg
public/photos/memory-03.jpg
public/photos/memory-04.jpg
public/photos/memory-05.jpg
public/photos/memory-06.jpg
public/photos/memory-07.jpg
public/photos/memory-08.jpg
public/sprites/hero-girl-idle.png
public/sprites/hero-girl-rescued.png
public/sprites/hero-boy-run.png
public/sprites/hero-boy-kneel.png
public/sprites/dragon.png
public/sprites/chest-closed.png
public/sprites/chest-open.png
public/sprites/heart.png
public/sprites/ring.png
```

Use this asset-production checklist while placing files:

- `hero-girl-*` sprites must read as long-haired and wearing a purple coat.
- `hero-boy-*` sprites must read as wearing glasses and dark outerwear.
- The dragon should feel fairytale-dangerous, not horror-focused.
- The chest-open sprite should visually support the final heart-and-ring reveal.
- The eight `memory-*.jpg` files should already be cropped and ordered for the intended montage flow.

Update `src/app/createApp.ts` to keep the overlay visible until the user starts playback:

```ts
export function createApp(root: HTMLElement) {
  root.innerHTML = `
    <main class="proposal-app" data-role="app-root" data-scene="opening">
      <div class="stage" data-role="stage">
        <div class="stage__backdrop"></div>
        <div class="stage__actors"></div>
        <div class="stage__effects"></div>
        <div class="stage__photos" data-role="photo-strip"></div>
        <p class="stage__subtitle" data-role="subtitle"></p>
        <p class="stage__proposal-line" data-role="proposal-line"></p>
        <button class="stage__prompt" data-role="chest-trigger" type="button" hidden>
          打开终章
        </button>
        <p class="stage__viewport-note" data-role="viewport-note" hidden>
          推荐使用电脑横屏观看这段童话。
        </p>
      </div>
      <button class="start-overlay" data-role="start-overlay" type="button">
        点击开启音乐与童话
      </button>
      <audio data-role="bgm" preload="auto"></audio>
    </main>
  `;
}
```

Replace `src/main.ts` with:

```ts
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
const chestTrigger = document.querySelector<HTMLButtonElement>('[data-role="chest-trigger"]');
const startOverlay = document.querySelector<HTMLButtonElement>('[data-role="start-overlay"]');
const viewportNote = document.querySelector<HTMLElement>('[data-role="viewport-note"]');
const bgm = document.querySelector<HTMLAudioElement>('[data-role="bgm"]');

if (!appRoot || !chestTrigger || !startOverlay || !viewportNote || !bgm) {
  throw new Error("Critical app nodes are missing");
}

bgm.src = assetManifest.music;
viewportNote.hidden = window.innerWidth >= 1024;

const speedFactor = new URLSearchParams(window.location.search).has("testMode") ? 0.01 : 1;
const tunedScenes = storyScenes.map((scene) =>
  scene.autoAdvance
    ? { ...scene, durationMs: Math.max(40, Math.round(scene.durationMs * speedFactor)) }
    : scene
);

const copyByScene = {
  opening: sceneCopy.opening,
  dragon: sceneCopy.dragon,
  rescue: "",
  memory: sceneCopy.memory,
  chest: sceneCopy.chestPrompt,
  proposal: ""
} as const;

const engine = createStoryEngine(tunedScenes, {
  onSceneChange(sceneId) {
    renderStage(appRoot, {
      sceneId,
      subtitle: copyByScene[sceneId],
      photos: sceneId === "memory" ? assetManifest.photos : [],
      showPrompt: sceneId === "chest",
      proposalLine: ""
    });
  }
});

const music = createMusicController(bgm);

startOverlay.addEventListener("click", async () => {
  startOverlay.hidden = true;
  await preloadImages(assetManifest.photos);
  await music.start();
  engine.start();
});

chestTrigger.addEventListener("click", () => {
  engine.revealProposal();
});
```

Append to `src/styles/stage.css`:

```css
.start-overlay {
  position: fixed;
  inset: auto 50% 48px auto;
  transform: translateX(-50%);
  z-index: 8;
  padding: 16px 28px;
  border: 0;
  border-radius: 999px;
  color: #2d1839;
  background: linear-gradient(180deg, #ffe7d6 0%, #ffd2e5 100%);
  box-shadow: 0 18px 36px rgba(0, 0, 0, 0.28);
}

.stage__prompt {
  padding: 14px 28px;
  border: 0;
  border-radius: 999px;
  color: #2d1839;
  background: linear-gradient(180deg, #ffe9d9 0%, #ffd6ef 100%);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.28);
}

.proposal-app[data-scene="proposal"] .stage__proposal-line {
  text-shadow: 0 0 18px rgba(255, 223, 173, 0.65);
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run:

```powershell
npx vitest run
npx playwright test
npm run build
```

Expected:
- Vitest PASS for all unit tests.
- Playwright PASS for `proposal-flow.spec.ts`.
- Build PASS with Vite output under `dist/`.

- [ ] **Step 5: Commit**

```powershell
git add public src tests
git commit -m "feat: wire proposal assets and end-to-end flow"
```
