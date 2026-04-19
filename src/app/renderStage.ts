import { finalProposalLine } from "../content/copy";
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
  const chestTrigger = root.querySelector<HTMLButtonElement>(
    '[data-role="chest-trigger"]',
  );
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
            `,
          )
          .join("")
      : "";
}
