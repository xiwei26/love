import { describe, expect, it } from "vitest";
import { renderStage } from "../../src/app/renderStage";
import { sceneCopy } from "../../src/content/copy";

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
      proposalLine: "",
    });

    expect(document.querySelector(".proposal-app")?.dataset.scene).toBe("chest");
    expect(document.querySelector('[data-role="subtitle"]')?.textContent).toBe(
      sceneCopy.chestPrompt,
    );
    expect(
      (document.querySelector('[data-role="chest-trigger"]') as HTMLButtonElement)
        .hidden,
    ).toBe(false);
  });
});
