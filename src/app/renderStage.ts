import { assetManifest } from "../content/assets";
import { finalProposalLine } from "../content/copy";
import type { SceneId } from "../engine/types";

interface RenderStageOptions {
  sceneId: SceneId;
  subtitle: string;
  photos: string[];
  showPrompt: boolean;
  proposalLine: string;
}

interface StageSprite {
  alt: string;
  className: string;
  src: string;
}

interface StageVisual {
  actors: StageSprite[];
  effects: StageSprite[];
}

const sceneVisuals: Record<Exclude<SceneId, "memory">, StageVisual> = {
  opening: {
    actors: [
      {
        alt: "Running hero",
        className: "stage-sprite--opening-boy",
        src: assetManifest.sprites.boyRun,
      },
      {
        alt: "Waiting heroine",
        className: "stage-sprite--opening-girl",
        src: assetManifest.sprites.girlIdle,
      },
    ],
    effects: [
      {
        alt: "Floating heart",
        className: "stage-sprite--opening-heart",
        src: assetManifest.sprites.heart,
      },
    ],
  },
  dragon: {
    actors: [
      {
        alt: "Approaching hero",
        className: "stage-sprite--dragon-boy",
        src: assetManifest.sprites.boyRun,
      },
      {
        alt: "Captured heroine",
        className: "stage-sprite--dragon-girl",
        src: assetManifest.sprites.girlIdle,
      },
      {
        alt: "Dragon guardian",
        className: "stage-sprite--dragon-dragon",
        src: assetManifest.sprites.dragon,
      },
    ],
    effects: [],
  },
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
  chest: {
    actors: [
      {
        alt: "Waiting hero",
        className: "stage-sprite--chest-boy",
        src: assetManifest.sprites.boyRun,
      },
      {
        alt: "Waiting heroine",
        className: "stage-sprite--chest-girl",
        src: assetManifest.sprites.girlIdle,
      },
      {
        alt: "Treasure chest",
        className: "stage-sprite--chest-box",
        src: assetManifest.sprites.chestClosed,
      },
    ],
    effects: [
      {
        alt: "Guiding heart",
        className: "stage-sprite--chest-heart",
        src: assetManifest.sprites.heart,
      },
    ],
  },
  proposal: {
    actors: [
      {
        alt: "Kneeling hero",
        className: "stage-sprite--proposal-boy",
        src: assetManifest.sprites.boyKneel,
      },
      {
        alt: "Beloved heroine",
        className: "stage-sprite--proposal-girl",
        src: assetManifest.sprites.girlRescued,
      },
      {
        alt: "Open treasure chest",
        className: "stage-sprite--proposal-chest",
        src: assetManifest.sprites.chestOpen,
      },
    ],
    effects: [
      {
        alt: "Engagement ring",
        className: "stage-sprite--proposal-ring",
        src: assetManifest.sprites.ring,
      },
      {
        alt: "Floating heart",
        className: "stage-sprite--proposal-heart",
        src: assetManifest.sprites.heart,
      },
    ],
  },
};

function renderSharedAtmosphere() {
  return `
    <span class="scene-backdrop__glow scene-backdrop__glow--left"></span>
    <span class="scene-backdrop__glow scene-backdrop__glow--right"></span>
  `;
}

function renderSceneArchitecture(sceneId: Exclude<SceneId, "memory">) {
  switch (sceneId) {
    case "opening":
      return `
        <span class="scene-backdrop__mist scene-backdrop__mist--left"></span>
        <span class="scene-backdrop__mist scene-backdrop__mist--right"></span>
        <span class="scene-backdrop__platform scene-backdrop__platform--opening-left"></span>
        <span class="scene-backdrop__platform scene-backdrop__platform--opening-right"></span>
      `;
    case "dragon":
      return `
        <span class="scene-backdrop__cave-arch scene-backdrop__cave-arch--deep"></span>
        <span class="scene-backdrop__crystal scene-backdrop__crystal--left"></span>
        <span class="scene-backdrop__crystal scene-backdrop__crystal--right"></span>
        <span class="scene-backdrop__mist scene-backdrop__mist--crater"></span>
        <span class="scene-backdrop__lava scene-backdrop__lava--rear"></span>
        <span class="scene-backdrop__lava scene-backdrop__lava--front"></span>
        <span class="scene-backdrop__lava-crack scene-backdrop__lava-crack--left"></span>
        <span class="scene-backdrop__lava-crack scene-backdrop__lava-crack--right"></span>
        <span class="scene-backdrop__platform scene-backdrop__platform--entry"></span>
        <span class="scene-backdrop__platform scene-backdrop__platform--bridge"></span>
        <span class="scene-backdrop__platform scene-backdrop__platform--boss"></span>
        <span class="scene-backdrop__platform scene-backdrop__platform--captive"></span>
        <span class="scene-backdrop__chain scene-backdrop__chain--left"></span>
        <span class="scene-backdrop__chain scene-backdrop__chain--right"></span>
        <span class="scene-backdrop__cage"></span>
        <span class="scene-backdrop__flare scene-backdrop__flare--dragon"></span>
      `;
    case "rescue":
      return `
        <span class="scene-backdrop__cave-arch scene-backdrop__cave-arch--battle"></span>
        <span class="scene-backdrop__crystal scene-backdrop__crystal--left"></span>
        <span class="scene-backdrop__crystal scene-backdrop__crystal--right"></span>
        <span class="scene-backdrop__mist scene-backdrop__mist--crater"></span>
        <span class="scene-backdrop__lava scene-backdrop__lava--rear"></span>
        <span class="scene-backdrop__lava scene-backdrop__lava--arena"></span>
        <span class="scene-backdrop__lava-crack scene-backdrop__lava-crack--center"></span>
        <span class="scene-backdrop__lava-crack scene-backdrop__lava-crack--right"></span>
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
    case "chest":
      return `
        <span class="scene-backdrop__cave-arch scene-backdrop__cave-arch--vault"></span>
        <span class="scene-backdrop__crystal scene-backdrop__crystal--treasure-left"></span>
        <span class="scene-backdrop__crystal scene-backdrop__crystal--treasure-right"></span>
        <span class="scene-backdrop__mist scene-backdrop__mist--gold"></span>
        <span class="scene-backdrop__dais scene-backdrop__dais--chest"></span>
        <span class="scene-backdrop__pillar scene-backdrop__pillar--left"></span>
        <span class="scene-backdrop__pillar scene-backdrop__pillar--right"></span>
      `;
    case "proposal":
      return `
        <span class="scene-backdrop__cave-arch scene-backdrop__cave-arch--proposal"></span>
        <span class="scene-backdrop__crystal scene-backdrop__crystal--treasure-left"></span>
        <span class="scene-backdrop__crystal scene-backdrop__crystal--treasure-right"></span>
        <span class="scene-backdrop__mist scene-backdrop__mist--gold"></span>
        <span class="scene-backdrop__dais scene-backdrop__dais--proposal"></span>
        <span class="scene-backdrop__beam scene-backdrop__beam--left"></span>
        <span class="scene-backdrop__beam scene-backdrop__beam--center"></span>
        <span class="scene-backdrop__beam scene-backdrop__beam--right"></span>
      `;
  }
}

function getBackdropImage(sceneId: Exclude<SceneId, "memory">) {
  return assetManifest.backgrounds[sceneId];
}

function renderBackdrop(sceneId: SceneId) {
  if (sceneId === "memory") {
    return "";
  }

  const backdropImage = getBackdropImage(sceneId);
  const style = ` style="--scene-bg: url('${backdropImage}')"`;

  return `
    <div class="scene-backdrop scene-backdrop--${sceneId}" aria-hidden="true"${style}>
      <span class="scene-backdrop__sky"></span>
      ${renderSharedAtmosphere()}
      ${renderSceneArchitecture(sceneId)}
      <span class="scene-backdrop__ground"></span>
      <span class="scene-backdrop__foreground scene-backdrop__foreground--left"></span>
      <span class="scene-backdrop__foreground scene-backdrop__foreground--right"></span>
    </div>
  `;
}

function renderSprites(sprites: StageSprite[]) {
  return sprites
    .map(
      (sprite) => `
        <img
          class="stage-sprite ${sprite.className}"
          src="${sprite.src}"
          alt="${sprite.alt}"
        />
      `,
    )
    .join("");
}

function getSceneVisual(sceneId: SceneId) {
  return sceneId === "memory" ? null : sceneVisuals[sceneId];
}

export function renderStage(root: HTMLElement, options: RenderStageOptions) {
  root.dataset.scene = options.sceneId;

  const subtitle = root.querySelector<HTMLElement>('[data-role="subtitle"]');
  const photoStrip = root.querySelector<HTMLElement>('[data-role="photo-strip"]');
  const chestTrigger = root.querySelector<HTMLButtonElement>(
    '[data-role="chest-trigger"]',
  );
  const proposalLine = root.querySelector<HTMLElement>('[data-role="proposal-line"]');
  const backdrop = root.querySelector<HTMLElement>(
    '[data-role="stage-backdrop"], .stage__backdrop',
  );
  const actors = root.querySelector<HTMLElement>(
    '[data-role="stage-actors"], .stage__actors',
  );
  const effects = root.querySelector<HTMLElement>(
    '[data-role="stage-effects"], .stage__effects',
  );
  const memoryHost = root.querySelector<HTMLElement>(
    '[data-role="memory-host"], .stage__memory',
  );

  if (!subtitle || !photoStrip || !chestTrigger || !proposalLine) {
    throw new Error("Stage nodes are missing");
  }

  subtitle.textContent = options.subtitle;
  proposalLine.textContent =
    options.sceneId === "proposal" ? finalProposalLine : options.proposalLine;
  chestTrigger.hidden = !options.showPrompt;

  if (memoryHost) {
    memoryHost.hidden = options.sceneId !== "memory";
  }

  const sceneVisual = getSceneVisual(options.sceneId);

  if (backdrop) {
    backdrop.innerHTML = renderBackdrop(options.sceneId);
  }

  if (actors) {
    actors.innerHTML = sceneVisual ? renderSprites(sceneVisual.actors) : "";
  }

  if (effects) {
    effects.innerHTML = sceneVisual ? renderSprites(sceneVisual.effects) : "";
  }

  photoStrip.innerHTML = "";
}
