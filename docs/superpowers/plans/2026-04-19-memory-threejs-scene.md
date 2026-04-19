# Memory Three.js Scene Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static `memory` photo grid with a Three.js-driven 3D memory scene where one hero photo arrives first, more photos expand into a calm starfield, and the whole memory field gathers back toward the chest.

**Architecture:** Keep the current DOM stage system as the scene controller and mount a dedicated Three.js canvas only during the `memory` scene. Implement the 3D scene as an isolated module with explicit `mount`, `start`, `stop`, `resize`, and `dispose` responsibilities so the rest of the site remains unchanged.

**Tech Stack:** TypeScript, Vite, Three.js, DOM APIs, Vitest, Playwright

---

## Planned File Structure

- `package.json` - add the `three` runtime dependency
- `src/app/createApp.ts` - add a dedicated memory-scene canvas host inside the stage
- `src/app/renderStage.ts` - toggle memory host visibility and suppress flat photo rendering when 3D mode is active
- `src/content/assets.ts` - continue providing photo URLs to the memory scene module
- `src/memory/types.ts` - memory-scene-specific public interfaces and data contracts
- `src/memory/createMemoryLayout.ts` - deterministic layout model for hero photo, supporting photos, and gather-back positions
- `src/memory/createMemoryScene.ts` - Three.js scene creation, animation loop, photo planes, particles, resize, and cleanup
- `src/main.ts` - scene orchestration between DOM stage scenes and the Three.js memory scene
- `tests/unit/createApp.test.ts` - verify memory host markup exists
- `tests/unit/memoryLayout.test.ts` - verify hero-first layout and expansion ordering
- `tests/unit/renderStage.test.ts` - verify `memory` scene exposes the Three.js host and suppresses flat photo cards
- `tests/e2e/proposal-flow.spec.ts` - verify memory scene still transitions to `chest`

### Task 1: Add The Memory Scene Host And Three Dependency

**Files:**
- Modify: `package.json`
- Modify: `src/app/createApp.ts`
- Modify: `tests/unit/createApp.test.ts`

- [ ] **Step 1: Write the failing test**

Append this expectation to `tests/unit/createApp.test.ts`:

```ts
expect(document.querySelector('[data-role="memory-host"]')).not.toBeNull();
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
npx vitest run tests/unit/createApp.test.ts
```

Expected: FAIL because the app shell does not yet render a memory-scene host element.

- [ ] **Step 3: Write minimal implementation**

Install Three.js:

```powershell
npm install three
```

Update `package.json` so the dependency section includes:

```json
{
  "dependencies": {
    "three": "^0.179.1"
  }
}
```

Update the stage markup in `src/app/createApp.ts`:

```ts
export function createApp(root: HTMLElement) {
  root.innerHTML = `
    <main class="proposal-app" data-role="app-root" data-scene="opening">
      <div class="stage" data-role="stage">
        <div class="stage__backdrop" data-role="stage-backdrop"></div>
        <div class="stage__memory" data-role="memory-host" hidden></div>
        <div class="stage__actors" data-role="stage-actors"></div>
        <div class="stage__effects" data-role="stage-effects"></div>
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
npx vitest run tests/unit/createApp.test.ts
```

Expected: PASS with the memory host now present.

- [ ] **Step 5: Commit**

```powershell
git add package.json package-lock.json src/app/createApp.ts tests/unit/createApp.test.ts
git commit -m "feat: add memory scene host and three dependency"
```

### Task 2: Build A Deterministic Memory Layout Model

**Files:**
- Create: `src/memory/types.ts`
- Create: `src/memory/createMemoryLayout.ts`
- Test: `tests/unit/memoryLayout.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/unit/memoryLayout.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { createMemoryLayout } from "../../src/memory/createMemoryLayout";

describe("createMemoryLayout", () => {
  it("creates one hero photo and supporting photos in depth layers", () => {
    const layout = createMemoryLayout([
      "/photos/memory-01.jpg",
      "/photos/memory-02.jpg",
      "/photos/memory-03.jpg",
      "/photos/memory-04.jpg",
    ]);

    expect(layout.hero.photoUrl).toBe("/photos/memory-01.jpg");
    expect(layout.supporting).toHaveLength(3);
    expect(layout.supporting.every((item) => item.z < layout.hero.z)).toBe(true);
  });

  it("creates gather-back targets for every photo", () => {
    const layout = createMemoryLayout([
      "/photos/memory-01.jpg",
      "/photos/memory-02.jpg",
      "/photos/memory-03.jpg",
    ]);

    expect(layout.gatherTargets).toHaveLength(3);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
npx vitest run tests/unit/memoryLayout.test.ts
```

Expected: FAIL because the memory-layout module does not exist yet.

- [ ] **Step 3: Write minimal implementation**

Create `src/memory/types.ts`:

```ts
export interface MemoryPhotoPlacement {
  photoUrl: string;
  x: number;
  y: number;
  z: number;
  rotationY: number;
  scale: number;
}

export interface MemorySceneLayout {
  hero: MemoryPhotoPlacement;
  supporting: MemoryPhotoPlacement[];
  gatherTargets: Array<{ x: number; y: number; z: number }>;
}
```

Create `src/memory/createMemoryLayout.ts`:

```ts
import type { MemoryPhotoPlacement, MemorySceneLayout } from "./types";

function createSupportingPlacement(photoUrl: string, index: number): MemoryPhotoPlacement {
  const columns = [-1.6, -0.7, 0.7, 1.6];
  const rows = [0.8, -0.15, -1.05];
  const x = columns[index % columns.length] ?? 0;
  const y = rows[index % rows.length] ?? 0;
  const z = -1.4 - index * 0.35;

  return {
    photoUrl,
    x,
    y,
    z,
    rotationY: (index % 2 === 0 ? -1 : 1) * 0.14,
    scale: 0.78,
  };
}

export function createMemoryLayout(photoUrls: string[]): MemorySceneLayout {
  const [heroUrl, ...supportingUrls] = photoUrls;

  return {
    hero: {
      photoUrl: heroUrl,
      x: 0,
      y: 0.08,
      z: -0.4,
      rotationY: 0,
      scale: 1,
    },
    supporting: supportingUrls.map(createSupportingPlacement),
    gatherTargets: photoUrls.map((_, index) => ({
      x: 0,
      y: 0,
      z: -2.2 - index * 0.1,
    })),
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```powershell
npx vitest run tests/unit/memoryLayout.test.ts
```

Expected: PASS with a hero-first layout and matching gather targets.

- [ ] **Step 5: Commit**

```powershell
git add src/memory/types.ts src/memory/createMemoryLayout.ts tests/unit/memoryLayout.test.ts
git commit -m "feat: add memory scene layout model"
```

### Task 3: Implement The Three.js Memory Scene Controller

**Files:**
- Create: `src/memory/createMemoryScene.ts`

- [ ] **Step 1: Define the controller surface**

Create the public API in `src/memory/createMemoryScene.ts`:

```ts
export interface MemorySceneController {
  mount: (host: HTMLElement) => void;
  start: (photoUrls: string[]) => Promise<void>;
  stop: () => void;
  resize: (width: number, height: number) => void;
  dispose: () => void;
}
```

- [ ] **Step 2: Implement the Three.js scene bootstrapping**

Use `three` to create:

```ts
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 30);
camera.position.set(0, 0, 5.2);
```

Create one particle system using a `BufferGeometry` with a moderate particle count:

```ts
const particleCount = 220;
```

Create photo planes from loaded textures:

```ts
const geometry = new THREE.PlaneGeometry(1.5, 1.9, 1, 1);
const material = new THREE.MeshBasicMaterial({
  map: texture,
  transparent: true,
  side: THREE.DoubleSide,
});
```

Apply the layout from `createMemoryLayout(photoUrls)` so:

- the first photo is centered and closest
- later photos appear deeper and smaller
- gather targets are stored for the exit phase

- [ ] **Step 3: Implement the memory-scene timeline**

Inside the animation loop, advance through these phases:

```ts
const totalDurationMs = 22000;
const arrivalEndMs = 5000;
const expansionEndMs = 14000;
const gatherStartMs = 18000;
```

Rules:

- hero photo arrives first during `0 -> arrivalEndMs`
- supporting photos fade and drift in during `arrivalEndMs -> expansionEndMs`
- all photos and particles gather inward after `gatherStartMs`
- camera drift remains subtle throughout

- [ ] **Step 4: Add lifecycle cleanup**

On `stop()` and `dispose()`:

- cancel the animation frame
- remove the renderer DOM node from the host if mounted
- dispose geometries, materials, and textures
- clear the current photo meshes array

- [ ] **Step 5: Commit**

```powershell
git add src/memory/createMemoryScene.ts
git commit -m "feat: add threejs memory scene controller"
```

### Task 4: Integrate The Memory Scene With The Existing Stage

**Files:**
- Modify: `src/app/renderStage.ts`
- Modify: `src/main.ts`
- Modify: `src/styles/stage.css`
- Test: `tests/unit/renderStage.test.ts`
- Test: `tests/e2e/proposal-flow.spec.ts`

- [ ] **Step 1: Write the failing unit expectation**

Extend the existing `memory` assertion in `tests/unit/renderStage.test.ts`:

```ts
expect((document.querySelector('[data-role="memory-host"]') as HTMLElement).hidden).toBe(
  false,
);
expect(document.querySelectorAll(".memory-card img")).toHaveLength(0);
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
npx vitest run tests/unit/renderStage.test.ts
```

Expected: FAIL because the memory host is still hidden and flat photo cards are still rendered.

- [ ] **Step 3: Update the renderer for memory-scene ownership**

In `src/app/renderStage.ts`, query the memory host:

```ts
const memoryHost = root.querySelector<HTMLElement>('[data-role="memory-host"]');
```

Then toggle it by scene:

```ts
if (memoryHost) {
  memoryHost.hidden = options.sceneId !== "memory";
}
```

Suppress flat photo rendering during `memory`:

```ts
photoStrip.innerHTML = "";
```

Keep all non-memory scenes unchanged.

- [ ] **Step 4: Wire the Three.js controller in `src/main.ts`**

Import and create the controller:

```ts
import { createMemoryScene } from "./memory/createMemoryScene";
```

Query the memory host:

```ts
const memoryHost = document.querySelector<HTMLElement>('[data-role="memory-host"]');
```

Mount the controller once:

```ts
const memoryScene = createMemoryScene();
memoryScene.mount(memoryHost);
```

In `renderScene(sceneId)`:

```ts
if (sceneId === "memory") {
  void memoryScene.start([...assetManifest.photos]);
} else {
  memoryScene.stop();
}
```

Add resize handling:

```ts
function syncMemorySize() {
  const rect = stageRoot.getBoundingClientRect();
  memoryScene.resize(rect.width, rect.height);
}

window.addEventListener("resize", syncMemorySize);
syncMemorySize();
```

- [ ] **Step 5: Add minimal stage styles for the memory host**

Append to `src/styles/stage.css`:

```css
.stage__memory {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
}

.stage__memory canvas {
  display: block;
  width: 100%;
  height: 100%;
}
```

- [ ] **Step 6: Update the e2e flow to verify the memory scene still hands off to the chest**

Append this assertion to `tests/e2e/proposal-flow.spec.ts` before the chest scene:

```ts
await expect(appRoot).toHaveAttribute("data-scene", "memory");
await expect(page.locator('[data-role="memory-host"]')).toBeVisible();
```

Keep the existing chest and proposal assertions afterward.

- [ ] **Step 7: Run tests and build**

Run:

```powershell
npx vitest run tests/unit/createApp.test.ts tests/unit/memoryLayout.test.ts tests/unit/renderStage.test.ts
npm test
npm run build
npx playwright test
```

Expected: PASS, with the memory scene visible and the flow still reaching `chest` and `proposal`.

- [ ] **Step 8: Commit**

```powershell
git add src/app/renderStage.ts src/main.ts src/styles/stage.css tests/unit/renderStage.test.ts tests/e2e/proposal-flow.spec.ts
git commit -m "feat: integrate threejs memory scene into stage flow"
```
