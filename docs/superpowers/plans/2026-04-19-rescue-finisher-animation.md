# Rescue Finisher Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the `rescue` scene so the hero defeats the dragon with a readable leap-and-holy-strike finisher.

**Architecture:** Keep the existing DOM-and-CSS stage system. Improve the rescue beat by adding dedicated effect markup in the renderer and replacing the current rescue animation keyframes with a clearer multi-phase sequence.

**Tech Stack:** TypeScript, DOM rendering, CSS keyframes, Vitest, Playwright

---

## Planned File Structure

- `src/app/renderStage.ts` - add rescue-specific effect elements for holy slash and impact bloom
- `src/styles/stage.css` - replace rescue motion with three-phase finisher choreography
- `tests/unit/renderStage.test.ts` - verify new rescue effect markup appears in the rescue scene

### Task 1: Add Rescue Finisher Effect Markup

**Files:**
- Modify: `src/app/renderStage.ts`
- Test: `tests/unit/renderStage.test.ts`

- [ ] **Step 1: Write the failing test**

Append this test case to `tests/unit/renderStage.test.ts`:

```ts
it("renders holy finisher effect layers in the rescue scene", () => {
  document.body.innerHTML = '<div id="app"></div>';
  const root = document.querySelector("#app") as HTMLElement;

  createApp(root);

  const appRoot = document.querySelector('[data-role="app-root"]') as HTMLElement;

  renderStage(appRoot, {
    sceneId: "rescue",
    subtitle: "",
    photos: [],
    showPrompt: false,
    proposalLine: "",
  });

  expect(document.querySelector(".scene-backdrop__flame-wave")).not.toBeNull();
  expect(document.querySelector(".scene-backdrop__impact")).not.toBeNull();
  expect(document.querySelector(".stage-effect--rescue-slash")).not.toBeNull();
  expect(document.querySelector(".stage-effect--rescue-burst")).not.toBeNull();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
npx vitest run tests/unit/renderStage.test.ts
```

Expected: FAIL because rescue-specific slash/burst effect nodes do not exist yet.

- [ ] **Step 3: Write minimal implementation**

Update the rescue scene definition inside `src/app/renderStage.ts` so the `effects` list includes dedicated effect sprites or effect-layer classes:

```ts
  rescue: {
    actors: [
      {
        alt: "Charging hero",
        className: "stage-sprite--rescue-boy",
        src: assetManifest.sprites.boyRun,
      },
      {
        alt: "Freed heroine",
        className: "stage-sprite--rescue-girl",
        src: assetManifest.sprites.girlRescued,
      },
      {
        alt: "Reeling dragon",
        className: "stage-sprite--rescue-dragon",
        src: assetManifest.sprites.dragon,
      },
    ],
    effects: [
      {
        alt: "Returning heart",
        className: "stage-sprite--rescue-heart",
        src: assetManifest.sprites.heart,
      },
    ],
  },
```

Then extend `renderSceneArchitecture("rescue")` to include the new effect layers:

```ts
    case "rescue":
      return `
        <span class="scene-backdrop__mist scene-backdrop__mist--crater"></span>
        <span class="scene-backdrop__lava scene-backdrop__lava--rear"></span>
        <span class="scene-backdrop__lava scene-backdrop__lava--arena"></span>
        <span class="scene-backdrop__platform scene-backdrop__platform--arena-left"></span>
        <span class="scene-backdrop__platform scene-backdrop__platform--arena-center"></span>
        <span class="scene-backdrop__platform scene-backdrop__platform--captive"></span>
        <span class="scene-backdrop__chain scene-backdrop__chain--left"></span>
        <span class="scene-backdrop__chain scene-backdrop__chain--right"></span>
        <span class="scene-backdrop__cage scene-backdrop__cage--fracture"></span>
        <span class="scene-backdrop__flame-wave"></span>
        <span class="scene-backdrop__impact"></span>
        <span class="stage-effect stage-effect--rescue-slash"></span>
        <span class="stage-effect stage-effect--rescue-burst"></span>
      `;
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```powershell
npx vitest run tests/unit/renderStage.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add src/app/renderStage.ts tests/unit/renderStage.test.ts
git commit -m "feat: add rescue finisher effect markup"
```

### Task 2: Rework Rescue Motion Into Leap, Hang, And Holy Strike

**Files:**
- Modify: `src/styles/stage.css`

- [ ] **Step 1: Define the new rescue choreography**

Replace the current `rescue` keyframe intent with these phase boundaries:

```css
/* target motion beats
0-28%: forward charge
28-46%: leap to apex
46-56%: brief hang-time
56-72%: diagonal holy strike
72-100%: settle and victory release
*/
```

- [ ] **Step 2: Rewrite the hero finisher keyframes**

Replace the existing `@keyframes rescueHeroClash` block with a clearer multi-phase version:

```css
@keyframes rescueHeroClash {
  0%,
  18% {
    transform: translateX(0) translateY(0) scale(1);
  }

  32% {
    transform: translateX(112px) translateY(-10px) scale(1.02);
  }

  46% {
    transform: translateX(170px) translateY(-118px) scale(1.05);
  }

  54% {
    transform: translateX(176px) translateY(-124px) scale(1.05);
  }

  70% {
    transform: translateX(228px) translateY(-10px) scale(1.04);
  }

  100% {
    transform: translateX(232px) translateY(-4px) scale(1);
  }
}
```

- [ ] **Step 3: Rewrite the dragon and heroine response**

Update `@keyframes rescueDragonClash` and `@keyframes rescueGirlRelease` so the strike reads as final:

```css
@keyframes rescueDragonClash {
  0%,
  52% {
    transform: translateX(0) translateY(0) scale(1);
    opacity: 1;
    filter: drop-shadow(0 24px 36px rgba(0, 0, 0, 0.36));
  }

  66% {
    transform: translateX(86px) translateY(-28px) scale(0.92);
    opacity: 0.7;
    filter: brightness(1.2) drop-shadow(0 24px 36px rgba(0, 0, 0, 0.2));
  }

  100% {
    transform: translateX(126px) translateY(-64px) scale(0.72);
    opacity: 0;
    filter: brightness(0.8) drop-shadow(0 24px 36px rgba(0, 0, 0, 0));
  }
}

@keyframes rescueGirlRelease {
  0%,
  58% {
    transform: translateY(0);
  }

  78% {
    transform: translate(-38px, 86px);
  }

  100% {
    transform: translate(-58px, 104px);
  }
}
```

- [ ] **Step 4: Add holy slash and impact animations**

Append these new effect rules to `src/styles/stage.css`:

```css
.stage-effect {
  position: absolute;
  pointer-events: none;
}

.stage-effect--rescue-slash {
  left: 48%;
  top: 24%;
  width: 10px;
  height: 220px;
  opacity: 0;
  background: linear-gradient(180deg, rgba(255, 247, 225, 0), rgba(255, 245, 214, 0.98), rgba(255, 207, 98, 0));
  box-shadow: 0 0 24px rgba(255, 230, 168, 0.48);
  transform: rotate(28deg);
  animation: rescueHolySlash 14s ease-in-out infinite;
}

.stage-effect--rescue-burst {
  left: 54%;
  top: 40%;
  width: 180px;
  aspect-ratio: 1;
  opacity: 0;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 245, 214, 0.9) 0%, rgba(255, 224, 153, 0.42) 38%, rgba(255, 224, 153, 0) 72%);
  filter: blur(3px);
  animation: rescueHolyBurst 14s ease-in-out infinite;
}

@keyframes rescueHolySlash {
  0%,
  54%,
  100% {
    opacity: 0;
    transform: rotate(28deg) scaleY(0.2);
  }

  63% {
    opacity: 1;
    transform: rotate(28deg) scaleY(1);
  }

  72% {
    opacity: 0;
    transform: rotate(28deg) scaleY(1.12);
  }
}

@keyframes rescueHolyBurst {
  0%,
  60%,
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.2);
  }

  68% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }

  78% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.5);
  }
}
```

- [ ] **Step 5: Run build and tests**

Run:

```powershell
npx vitest run tests/unit/renderStage.test.ts
npm test
npm run build
npx playwright test
```

Expected: all pass, with the rescue scene still reaching the chest prompt correctly.

- [ ] **Step 6: Commit**

```powershell
git add src/styles/stage.css
git commit -m "feat: add holy finisher animation to rescue scene"
```

### Task 3: Verify The Result Visually

**Files:**
- No required code changes

- [ ] **Step 1: Capture a rescue-scene screenshot**

Run a temporary Playwright capture script that waits for `data-scene="rescue"` and saves a screenshot.

```powershell
@'
import { expect, test } from "@playwright/test";

test("capture rescue finisher", async ({ page }) => {
  await page.goto("/?testMode=1");
  await page.locator('[data-role="start-overlay"]').click();
  await expect(page.locator('[data-role="app-root"]')).toHaveAttribute("data-scene", "rescue");
  await page.screenshot({ path: "tmp/rescue-finisher.png", fullPage: true });
});
'@ | Set-Content -LiteralPath tests/e2e/_capture-rescue.spec.ts -Encoding utf8

npx playwright test tests/e2e/_capture-rescue.spec.ts
```

Expected: screenshot file created and the strike moment is visibly clearer than before.

- [ ] **Step 2: Remove the temporary capture spec**

Run:

```powershell
Remove-Item -LiteralPath tests/e2e/_capture-rescue.spec.ts
```

- [ ] **Step 3: Commit if the visual pass required code tweaks**

```powershell
git add src/app/renderStage.ts src/styles/stage.css tests/unit/renderStage.test.ts
git commit -m "refactor: polish rescue finisher timing"
```
