import { describe, expect, it } from "vitest";
import { createApp } from "../../src/app/createApp";
import { renderStage } from "../../src/app/renderStage";
import { assetManifest } from "../../src/content/assets";
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

    expect(
      (document.querySelector(".proposal-app") as HTMLElement | null)?.dataset.scene,
    ).toBe("chest");
    expect(document.querySelector('[data-role="subtitle"]')?.textContent).toBe(
      sceneCopy.chestPrompt,
    );
    expect(
      (document.querySelector('[data-role="chest-trigger"]') as HTMLButtonElement)
        .hidden,
    ).toBe(false);
  });

  it("renders scene-specific sprites while leaving memory focused on photos", () => {
    document.body.innerHTML = '<div id="app"></div>';
    const root = document.querySelector("#app") as HTMLElement;

    createApp(root);

    const appRoot = document.querySelector('[data-role="app-root"]') as HTMLElement;

    const spriteScenes = [
      {
        sceneId: "opening" as const,
        subtitle: sceneCopy.opening,
        expectedSprites: [
          assetManifest.sprites.girlIdle,
          assetManifest.sprites.boyRun,
          assetManifest.sprites.heart,
        ],
        expectedBackdropSelectors: [
          ".scene-backdrop__platform--opening-left",
          ".scene-backdrop__mist--left",
        ],
      },
      {
        sceneId: "dragon" as const,
        subtitle: sceneCopy.dragon,
        expectedSprites: [
          assetManifest.sprites.girlIdle,
          assetManifest.sprites.boyRun,
          assetManifest.sprites.dragon,
        ],
        expectedBackdropSelectors: [
          ".scene-backdrop__lava--front",
          ".scene-backdrop__platform--captive",
          ".scene-backdrop__cage",
        ],
      },
      {
        sceneId: "rescue" as const,
        subtitle: "",
        expectedSprites: [
          assetManifest.sprites.girlRescued,
          assetManifest.sprites.boyRun,
          assetManifest.sprites.dragon,
        ],
        expectedBackdropSelectors: [
          ".scene-backdrop__lava--arena",
          ".scene-backdrop__flame-wave",
          ".scene-backdrop__impact",
          ".stage-effect--rescue-slash",
          ".stage-effect--rescue-burst",
        ],
      },
      {
        sceneId: "chest" as const,
        subtitle: sceneCopy.chestPrompt,
        expectedSprites: [
          assetManifest.sprites.girlIdle,
          assetManifest.sprites.boyRun,
          assetManifest.sprites.chestClosed,
        ],
        expectedBackdropSelectors: [
          ".scene-backdrop__dais--chest",
          ".scene-backdrop__pillar--left",
        ],
      },
      {
        sceneId: "proposal" as const,
        subtitle: "",
        expectedSprites: [
          assetManifest.sprites.girlRescued,
          assetManifest.sprites.boyKneel,
          assetManifest.sprites.chestOpen,
          assetManifest.sprites.ring,
        ],
        expectedBackdropSelectors: [
          ".scene-backdrop__dais--proposal",
          ".scene-backdrop__beam--center",
        ],
      },
    ];

    for (const spriteScene of spriteScenes) {
      renderStage(appRoot, {
        sceneId: spriteScene.sceneId,
        subtitle: spriteScene.subtitle,
        photos: [],
        showPrompt: spriteScene.sceneId === "chest",
        proposalLine: "",
      });

      const sceneSprites = Array.from(
        document.querySelectorAll<HTMLImageElement>(".stage__actors img, .stage__effects img"),
      ).map((image) => image.getAttribute("src"));

      expect(sceneSprites).toEqual(expect.arrayContaining(spriteScene.expectedSprites));
      expect(document.querySelector(".stage__backdrop")?.children.length).toBeGreaterThan(0);

      spriteScene.expectedBackdropSelectors.forEach((selector) => {
        expect(document.querySelector(selector)).not.toBeNull();
      });
    }

    renderStage(appRoot, {
      sceneId: "memory",
      subtitle: sceneCopy.memory,
      photos: assetManifest.photos.slice(0, 2),
      showPrompt: false,
      proposalLine: "",
    });

    expect((document.querySelector('[data-role="memory-host"]') as HTMLElement).hidden).toBe(
      false,
    );
    expect(document.querySelector(".stage__actors")?.childElementCount).toBe(0);
    expect(document.querySelector(".stage__effects")?.childElementCount).toBe(0);
    expect(document.querySelector(".stage__backdrop")?.childElementCount).toBe(0);
    expect(document.querySelectorAll(".memory-card img")).toHaveLength(0);
  });
});
