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
        src: assetManifest.sprites.boyIdle,
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
    if (options.sceneId === "rescue") {
      effects.innerHTML += '<span class="stage-effect stage-effect--rescue-slash"></span><span class="stage-effect stage-effect--rescue-burst"></span>';
    }
  }

  photoStrip.innerHTML = "";
}
