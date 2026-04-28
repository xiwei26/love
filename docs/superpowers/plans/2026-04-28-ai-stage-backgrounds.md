# AI Stage Backgrounds Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the five non-memory stage backdrops with AI-generated refined pixel-art empty-stage background images while keeping existing sprite animation and the Three.js memory scene intact.

**Architecture:** Add five static background assets under `public/backgrounds`, expose them through `assetManifest.backgrounds`, preload them with the existing image preloader, and attach the current scene's background URL to the backdrop DOM through a CSS variable. CSS uses the generated plate as the deepest layer and keeps existing animated atmosphere/effects above it for motion and readability.

**Tech Stack:** Vite, TypeScript, CSS, Vitest, Playwright, built-in host image generation using the GPT Image 2 prompt workflow.

---

## File Structure

- Create: `public/backgrounds/stage-opening.png`
- Create: `public/backgrounds/stage-dragon.png`
- Create: `public/backgrounds/stage-rescue.png`
- Create: `public/backgrounds/stage-chest.png`
- Create: `public/backgrounds/stage-proposal.png`
- Create: `garden-gpt-image-2/prompt/stage-backgrounds-20260428.md`
- Modify: `src/content/assets.ts`
- Modify: `src/main.ts`
- Modify: `src/app/renderStage.ts`
- Modify: `src/styles/stage.css`
- Modify: `tests/unit/assetFiles.test.ts`
- Modify: `tests/unit/renderStage.test.ts`

---

### Task 1: Generate And Save Background Plates

**Files:**
- Create: `garden-gpt-image-2/prompt/stage-backgrounds-20260428.md`
- Create: `public/backgrounds/stage-opening.png`
- Create: `public/backgrounds/stage-dragon.png`
- Create: `public/backgrounds/stage-rescue.png`
- Create: `public/backgrounds/stage-chest.png`
- Create: `public/backgrounds/stage-proposal.png`

- [ ] **Step 1: Create the prompt archive**

Create `garden-gpt-image-2/prompt/stage-backgrounds-20260428.md` with:

```markdown
# Stage Background Prompt Set

Use case: stylized-concept
Asset type: full-screen browser game stage background
Style/medium: refined 8-bit pixel art, premium fairytale game environment, painterly magical lighting
Composition/framing: landscape 16:9, full-bleed, empty stage plate, foreground-safe lower third, subtitle-safe top center
Constraints: no characters, no people, no dragon, no treasure chest, no heart, no ring, no text, no logo, no watermark, no UI frame, no captions, no signs
Recommended size: 2048x1152

## Shared Base Prompt

Refined 8-bit pixel art game background, premium fairytale adventure stage, landscape 16:9, empty environment plate only, no characters, no dragon, no treasure chest, no heart, no ring, no text, no logo, no watermark, no UI. Rich pixel detail, painterly magical lighting, crisp readable silhouettes, foreground-safe lower third, subtitle-safe top center, cohesive romantic fantasy palette, suitable as a full-screen browser game stage.

## Opening

Refined 8-bit pixel art game background, premium fairytale adventure stage, landscape 16:9. Moonlit mountain forest with layered pine silhouettes, distant cliffs, a softly glowing cave entrance in the middle distance, firefly-like magic lights, clear empty lower-left and lower-right stage spaces for two character sprites, calm darker upper-center subtitle-safe sky. Deep navy, forest green, muted violet, warm cave gold. Empty environment plate only: no characters, no people, no dragon, no treasure chest, no heart, no ring, no text, no logo, no watermark, no UI.

## Dragon

Refined 8-bit pixel art game background, premium fairytale adventure stage, landscape 16:9. Secret volcanic cave domain with lava cracks, rune stones, suspended chains, cyan crystals, high ledge area for a captive character sprite, open right-side zone for an animated dragon sprite, readable dark stone surfaces and ember glow. Dangerous fairytale mood, not horror. Volcanic red, ember orange, dark violet, cyan crystal highlights. Empty environment plate only: no characters, no people, no dragon, no cage, no treasure chest, no heart, no ring, no text, no logo, no watermark, no UI.

## Rescue

Refined 8-bit pixel art game background, premium fairytale adventure stage, landscape 16:9. Wide battle arena inside a magical volcanic cave, clear center-left to center-right action lane for a jumping hero sprite and holy slash animation, readable right-side zone for a large animated dragon sprite, central stone platform, lava glow below, vertical holy-light fissure from above, magic dust and warm impact lighting. Hot ember orange, dark stone, pale gold light, small cyan accents. Empty environment plate only: no characters, no people, no dragon, no cage, no treasure chest, no heart, no ring, no text, no logo, no watermark, no UI.

## Chest

Refined 8-bit pixel art game background, premium fairytale adventure stage, landscape 16:9. Quiet treasure-vault stage after battle, central bottom area left empty for an animated treasure chest sprite, distant gold mist, luminous crystals, stone arches, soft dust light, calm magical depth. Deep blue stone, champagne gold, soft cyan, blush highlights. Empty environment plate only: no characters, no people, no dragon, no treasure chest, no heart, no ring, no text, no logo, no watermark, no UI.

## Proposal

Refined 8-bit pixel art game background, premium fairytale adventure stage, landscape 16:9. Romantic final treasure-vault transformation, warm ceremonial platform in the center bottom for a kneeling proposal tableau, top-center space for glowing heart and ring sprites, soft light beams, star-like sparkles, gentle stone arches and crystals, screenshot-friendly still composition. Champagne gold, warm white, rose pink, soft dusk blue. Empty environment plate only: no characters, no people, no dragon, no treasure chest, no heart, no ring, no text, no logo, no watermark, no UI.
```

- [ ] **Step 2: Generate the five images**

Use the built-in host image generator or GPT Image 2 host-native workflow with the five scene prompts from the prompt archive. Generate each image at a 16:9 landscape size. Save the accepted outputs to:

```text
public/backgrounds/stage-opening.png
public/backgrounds/stage-dragon.png
public/backgrounds/stage-rescue.png
public/backgrounds/stage-chest.png
public/backgrounds/stage-proposal.png
```

- [ ] **Step 3: Check the saved files**

Run:

```powershell
Get-ChildItem public\backgrounds | Select-Object Name,Length
```

Expected: the output contains exactly the five `stage-*.png` files and each file has a non-zero `Length`.

- [ ] **Step 4: Visual acceptance check**

Open each PNG and confirm these exact conditions:

```text
1. No characters or people are visible.
2. No dragon is visible.
3. No treasure chest, heart, or ring is visible.
4. No readable text, logo, watermark, menu, or UI is visible.
5. The lower third has usable open stage space for sprites.
6. The top center has usable space for subtitles.
```

- [ ] **Step 5: Commit background assets**

Run:

```powershell
git add garden-gpt-image-2/prompt/stage-backgrounds-20260428.md public/backgrounds
git commit -m "feat: add ai stage background assets"
```

Expected: commit succeeds and includes the prompt archive plus the five background images.

---

### Task 2: Add Tests For Background Assets And Scene Wiring

**Files:**
- Modify: `tests/unit/assetFiles.test.ts`
- Modify: `tests/unit/renderStage.test.ts`

- [ ] **Step 1: Add background files to the production asset test**

In `tests/unit/assetFiles.test.ts`, extend `requiredFiles` so it includes:

```ts
  "public/backgrounds/stage-opening.png",
  "public/backgrounds/stage-dragon.png",
  "public/backgrounds/stage-rescue.png",
  "public/backgrounds/stage-chest.png",
  "public/backgrounds/stage-proposal.png",
```

- [ ] **Step 2: Add render assertions for backdrop background URLs**

In `tests/unit/renderStage.test.ts`, inside the `for (const spriteScene of spriteScenes)` loop after the existing backdrop selector assertions, add:

```ts
      const sceneBackdrop = document.querySelector<HTMLElement>(".scene-backdrop");
      expect(sceneBackdrop?.getAttribute("style")).toContain("--scene-bg:");
      expect(sceneBackdrop?.getAttribute("style")).toContain("backgrounds/stage-");
```

After the existing memory scene assertions, add:

```ts
    expect(document.querySelector(".scene-backdrop")?.getAttribute("style")).toBeNull();
```

- [ ] **Step 3: Run the targeted tests and confirm wiring test fails**

Run:

```powershell
npm test -- tests/unit/assetFiles.test.ts tests/unit/renderStage.test.ts
```

Expected: `assetFiles.test.ts` passes after Task 1 assets exist. `renderStage.test.ts` fails because `.scene-backdrop` does not yet receive the `--scene-bg` style.

---

### Task 3: Register Backgrounds And Preload Them

**Files:**
- Modify: `src/content/assets.ts`
- Modify: `src/main.ts`
- Modify: `src/app/renderStage.ts`
- Test: `tests/unit/renderStage.test.ts`

- [ ] **Step 1: Add backgrounds to the asset manifest**

In `src/content/assets.ts`, add `backgrounds` after `sprites`:

```ts
  backgrounds: {
    opening: withBase("backgrounds/stage-opening.png"),
    dragon: withBase("backgrounds/stage-dragon.png"),
    rescue: withBase("backgrounds/stage-rescue.png"),
    chest: withBase("backgrounds/stage-chest.png"),
    proposal: withBase("backgrounds/stage-proposal.png"),
  },
```

- [ ] **Step 2: Preload backgrounds before the story starts**

In `src/main.ts`, replace the current `stageImageAssets` line with:

```ts
const stageImageAssets = [
  ...Object.values(assetManifest.sprites),
  ...Object.values(assetManifest.backgrounds),
  ...assetManifest.photos,
];
```

- [ ] **Step 3: Attach the scene background URL in renderStage**

In `src/app/renderStage.ts`, add this helper after `renderSceneArchitecture`:

```ts
function getBackdropImage(sceneId: Exclude<SceneId, "memory">) {
  return assetManifest.backgrounds[sceneId];
}
```

Then update `renderBackdrop` to:

```ts
function renderBackdrop(sceneId: SceneId) {
  if (sceneId === "memory") {
    return "";
  }

  const backdropImage = getBackdropImage(sceneId);
  const style = ` style="--scene-bg: url('${backdropImage}')"`;

  return `
    <div class="scene-backdrop scene-backdrop--${sceneId}" aria-hidden="true"${style}>
      <span class="scene-backdrop__sky"></span>
      ${renderSharedAtmosphere(sceneId)}
      ${renderSceneArchitecture(sceneId)}
      <span class="scene-backdrop__ground"></span>
      <span class="scene-backdrop__foreground scene-backdrop__foreground--left"></span>
      <span class="scene-backdrop__foreground scene-backdrop__foreground--right"></span>
    </div>
  `;
}
```

- [ ] **Step 4: Run targeted tests**

Run:

```powershell
npm test -- tests/unit/assetFiles.test.ts tests/unit/renderStage.test.ts
```

Expected: both test files pass.

- [ ] **Step 5: Commit manifest and render wiring**

Run:

```powershell
git add src/content/assets.ts src/main.ts src/app/renderStage.ts tests/unit/assetFiles.test.ts tests/unit/renderStage.test.ts
git commit -m "feat: wire ai stage backgrounds"
```

Expected: commit succeeds and includes only the manifest, preload, render wiring, and tests.

---

### Task 4: Blend Background Plates Into The Stage

**Files:**
- Modify: `src/styles/stage.css`

- [ ] **Step 1: Add a default background variable**

In `.scene-backdrop`, add:

```css
  --scene-bg: none;
```

- [ ] **Step 2: Make the sky layer render generated plates**

Replace `.scene-backdrop__sky` with:

```css
.scene-backdrop__sky {
  inset: 0;
  background-image:
    linear-gradient(180deg, rgba(4, 7, 18, 0.18), rgba(4, 7, 18, 0.42)),
    var(--scene-bg);
  background-position: center;
  background-size: cover;
  image-rendering: pixelated;
}
```

- [ ] **Step 3: Keep scene-specific color washes over the generated images**

Replace each scene-specific `.scene-backdrop--<scene> .scene-backdrop__sky` block with these blocks:

```css
.scene-backdrop--opening .scene-backdrop__sky {
  background-image:
    radial-gradient(circle at 50% 8%, rgba(255, 244, 196, 0.14), transparent 26%),
    linear-gradient(180deg, rgba(13, 31, 54, 0.16) 0%, rgba(33, 56, 83, 0.2) 52%, rgba(45, 25, 58, 0.42) 100%),
    var(--scene-bg);
}

.scene-backdrop--dragon .scene-backdrop__sky {
  background-image:
    radial-gradient(ellipse at 50% 56%, rgba(66, 18, 84, 0.34), transparent 42%),
    linear-gradient(180deg, rgba(8, 7, 17, 0.34) 0%, rgba(36, 16, 32, 0.26) 38%, rgba(74, 23, 24, 0.36) 67%, rgba(17, 4, 9, 0.7) 100%),
    var(--scene-bg);
}

.scene-backdrop--rescue .scene-backdrop__sky {
  background-image:
    radial-gradient(ellipse at 50% 52%, rgba(255, 100, 64, 0.16), transparent 38%),
    linear-gradient(180deg, rgba(20, 11, 24, 0.32) 0%, rgba(59, 23, 34, 0.26) 38%, rgba(134, 40, 29, 0.32) 64%, rgba(22, 4, 9, 0.72) 100%),
    var(--scene-bg);
}

.scene-backdrop--chest .scene-backdrop__sky {
  background-image:
    radial-gradient(ellipse at 50% 66%, rgba(255, 213, 127, 0.12), transparent 40%),
    linear-gradient(180deg, rgba(13, 28, 50, 0.22) 0%, rgba(35, 67, 92, 0.2) 42%, rgba(81, 55, 95, 0.48) 100%),
    var(--scene-bg);
}

.scene-backdrop--proposal .scene-backdrop__sky {
  background-image:
    radial-gradient(ellipse at 50% 72%, rgba(255, 229, 174, 0.16), transparent 42%),
    linear-gradient(180deg, rgba(24, 47, 80, 0.2) 0%, rgba(91, 91, 135, 0.2) 44%, rgba(141, 75, 100, 0.42) 100%),
    var(--scene-bg);
}
```

- [ ] **Step 4: Reduce competing CSS-drawn cave architecture**

Change `.scene-backdrop__cave-arch` opacity from `0.82` to:

```css
  opacity: 0.36;
```

Change `.scene-backdrop__cave-arch--battle` opacity from `0.9` to:

```css
  opacity: 0.42;
```

Change `.scene-backdrop__cave-arch--vault, .scene-backdrop__cave-arch--proposal` opacity from `0.64` to:

```css
  opacity: 0.28;
```

Change `.scene-backdrop__cave-arch--proposal` opacity from `0.72` to:

```css
  opacity: 0.32;
```

- [ ] **Step 5: Run build**

Run:

```powershell
npm run build
```

Expected: build succeeds. A Vite chunk-size warning is acceptable if it matches the existing Three.js warning.

- [ ] **Step 6: Commit CSS blending**

Run:

```powershell
git add src/styles/stage.css
git commit -m "style: blend ai stage backgrounds"
```

Expected: commit succeeds and includes only `src/styles/stage.css`.

---

### Task 5: Verify The Full Experience

**Files:**
- No production file changes expected.
- Temporary screenshots may be saved under `tmp/` and removed before final commit.

- [ ] **Step 1: Run all unit tests**

Run:

```powershell
npm test
```

Expected: all Vitest tests pass.

- [ ] **Step 2: Run production build**

Run:

```powershell
npm run build
```

Expected: TypeScript and Vite build succeed.

- [ ] **Step 3: Run e2e flow**

Run:

```powershell
npm run test:e2e
```

Expected: Playwright proposal flow passes. If the local browser runner is blocked by OS permissions, record the error and verify with build plus manual browser preview.

- [ ] **Step 4: Check desktop and mobile landscape rendering**

Run the dev server:

```powershell
npm run dev -- --host 127.0.0.1 --port 4173
```

Open:

```text
http://127.0.0.1:4173/?testMode=1
```

Check these scenes during playback:

```text
opening: forest/cave background appears, subtitles readable, sprites visible.
dragon: volcanic cave background appears, girl/hero/dragon remain readable.
rescue: action lane remains clear during holy slash and burst.
chest: generated vault appears, animated chest is not duplicated by background.
proposal: final heart, ring, chest, and proposal line remain the visual focus.
memory: Three.js photo galaxy still appears and does not use the new background images.
```

- [ ] **Step 5: Commit verification-only fixes if visual issues are found**

If visual verification requires CSS tuning, make a focused commit:

```powershell
git add src/styles/stage.css
git commit -m "style: tune ai background readability"
```

Expected: commit is created only when CSS tuning is needed.

---

### Task 6: Push And Confirm Deployment

**Files:**
- No additional file changes expected.

- [ ] **Step 1: Confirm working tree is clean**

Run:

```powershell
git status --short --branch
```

Expected: `main...origin/main [ahead N]` with no modified or untracked files related to this work. Existing unrelated local files should not be added.

- [ ] **Step 2: Push main**

Run:

```powershell
git push origin main
```

Expected: push succeeds.

- [ ] **Step 3: Verify GitHub Pages**

Open:

```text
https://xiwei26.github.io/love/
```

Expected: the deployed site loads, the opening scene uses the generated pixel-art background, and the `memory` scene still shows the Three.js photo galaxy.

---

## Self-Review Notes

- Spec coverage: the plan covers asset generation, manifest registration, preloading, scene rendering, CSS blending, testing, and deployment verification.
- Scope check: this is one cohesive visual asset integration task; it does not include sprite redesign, memory scene changes, or a parallax rewrite.
- Placeholder scan: the plan contains no unfinished markers or unspecified implementation steps.
- Type consistency: `assetManifest.backgrounds` keys match the existing scene ids: `opening`, `dragon`, `rescue`, `chest`, and `proposal`.
