# AI Stage Backgrounds Design

## Summary

The proposal site will replace the current CSS-built non-memory stage backgrounds with a full set of AI-generated refined pixel-art environment plates. Each non-memory scene gets one complete empty-stage background image: `opening`, `dragon`, `rescue`, `chest`, and `proposal`. The `memory` scene keeps its existing Three.js photo galaxy.

The new backgrounds should make the site feel more polished and cinematic while preserving the existing 8-bit fairytale identity. Characters, dragon, chest, heart, ring, subtitles, particles, and scene timing remain controlled by the current code.

## Goals

- Upgrade the visual quality of every non-memory scene with cohesive AI-generated pixel-art backgrounds.
- Keep foreground sprites readable and avoid duplicating actors or props inside background images.
- Preserve the existing scripted animation flow and one-click final proposal interaction.
- Keep the implementation small enough to review safely: add background assets, register them in the asset manifest, and apply them through scene-specific CSS.
- Maintain responsive framing across desktop, mobile portrait, and mobile landscape.

## Non-Goals

- Redrawing the couple sprites, dragon, treasure chest, heart, or ring.
- Replacing the Three.js `memory` scene.
- Rebuilding the stage as a layered parallax system in this iteration.
- Adding playable game mechanics or new story beats.
- Generating backgrounds with embedded text, UI, logos, watermarks, people, dragons, treasure chests, hearts, or rings.

## Visual Thesis

The site should feel like a premium pixel fairytale game: crisp 8-bit silhouettes in front of richly painted pixel environments, with soft magical lighting, readable stage space, and a romantic shift from danger to warmth.

## Background Set

### Opening

Create a moonlit mountain forest stage with a softly glowing cave entrance in the distance. The image should leave clear lower-left and lower-right areas for the couple sprites and a calm upper center area for subtitles. The mood is curious, magical, and inviting.

Preferred palette: deep navy, forest green, muted violet, warm cave gold.

### Dragon

Create a dragon-guarded secret cave environment without the dragon itself. The scene should include lava cracks, rune stones, suspended chains, and a high captive-platform area, but the image must not include any characters or cages that conflict with the animated foreground. The mood is dangerous but fairytale-like rather than horror.

Preferred palette: volcanic red, ember orange, dark violet, cyan crystal highlights.

### Rescue

Create a wider battle arena inside the same cave language. The composition should reserve a clear center-left to center-right action lane for the hero jump and slash animation, plus a readable right-side zone for the animated dragon sprite. The image can include a vertical holy-light opening or bright magical fissure to support the finisher animation.

Preferred palette: hot ember orange, dark stone, pale gold light, small cyan accents.

### Chest

Create a quiet treasure-vault stage after the battle. The center bottom should be open for the animated treasure chest. The background can include distant gold mist, crystals, stone arches, and soft dust light, but no actual treasure chest. The mood is calm, expectant, and enchanted.

Preferred palette: deep blue stone, champagne gold, soft cyan, blush highlights.

### Proposal

Create the romantic final version of the vault, transformed by warm light. The center should feel like a small ceremonial platform for the kneeling proposal tableau, with enough open space for the enlarged heart, ring, chest, and final proposal line. The image should be screenshot-friendly and emotionally still.

Preferred palette: champagne gold, warm white, rose pink, soft dusk blue.

## Image Generation Rules

- Asset type: website/game stage background.
- Style: refined 8-bit pixel art with painterly lighting, not photorealistic.
- Framing: landscape, full-bleed, 16:9 safe composition.
- Recommended generation size: `2048x1152` or another 16:9 size supported by the selected image tool.
- Must be empty stage environments only.
- Must not contain characters, dragons, treasure chests, rings, hearts, captions, signs, watermarks, logos, menus, or UI frames.
- Leave subtitle-safe negative space near the top center.
- Leave foreground-safe space along the lower third for animated sprites.
- Avoid tiny high-contrast details directly behind key foreground sprites.
- Keep all five images visually related through palette, pixel density, lighting softness, and cave/forest material language.

## Technical Design

### Assets

Add a new directory:

```text
public/backgrounds/
```

Expected files:

```text
public/backgrounds/stage-opening.png
public/backgrounds/stage-dragon.png
public/backgrounds/stage-rescue.png
public/backgrounds/stage-chest.png
public/backgrounds/stage-proposal.png
```

### Manifest

Extend `assetManifest` with a `backgrounds` object:

```ts
backgrounds: {
  opening: withBase("backgrounds/stage-opening.png"),
  dragon: withBase("backgrounds/stage-dragon.png"),
  rescue: withBase("backgrounds/stage-rescue.png"),
  chest: withBase("backgrounds/stage-chest.png"),
  proposal: withBase("backgrounds/stage-proposal.png"),
}
```

Preload the background images alongside sprites and photos so scene transitions do not reveal blank loading states.

### Stage Rendering

For non-memory scenes, `renderStage` should attach the current scene's background URL to the backdrop container with a CSS variable such as `--scene-bg`. The `memory` scene should remain unchanged and should not request a generated background image.

The existing CSS atmosphere elements can remain as overlays when they improve motion or readability: embers, dust, glows, beams, rescue slash, burst, and subtle foreground vignettes. Heavy CSS-drawn architecture should be reduced when it competes with the generated plate.

### CSS

Use the generated plate as the deepest visual layer for each non-memory scene. Add a consistent overlay treatment so subtitles and sprites remain readable:

- background-size: cover
- background-position: center
- a dark-to-clear readability gradient
- optional scene-specific color wash
- existing animated particles and effects above the plate

Do not hardcode absolute paths in CSS. All project deployment paths must continue to work under the GitHub Pages `/love/` base path.

## Prompt Plan

Use one shared base prompt and five scene-specific prompts. The base prompt keeps the series consistent:

```text
Refined 8-bit pixel art game background, premium fairytale adventure stage, landscape 16:9, empty environment plate only, no characters, no dragon, no treasure chest, no heart, no ring, no text, no logo, no watermark, no UI. Rich pixel detail, painterly magical lighting, crisp readable silhouettes, foreground-safe lower third, subtitle-safe top center, cohesive romantic fantasy palette, suitable as a full-screen browser game stage.
```

Each scene prompt adds only the required environment details from the Background Set section.

## Testing Strategy

- Unit test that all five background files exist in production assets.
- Unit test or rendering test that non-memory scenes reference a background URL and `memory` does not.
- Build test to confirm the Vite bundle resolves the new assets.
- Browser screenshot check on desktop and mobile landscape to confirm:
  - backgrounds render,
  - subtitles remain readable,
  - sprites do not disappear into the background,
  - proposal composition remains screenshot-friendly,
  - no generated background contains duplicate actors or props.

## Success Criteria

- All five non-memory scenes feel visually richer and more cohesive.
- The animated foreground remains the narrative focus.
- No background includes duplicate people, dragon, chest, heart, ring, text, logo, or watermark.
- The site still builds and deploys correctly to GitHub Pages.
- The `memory` scene continues to show the Three.js photo galaxy without visual regression.
