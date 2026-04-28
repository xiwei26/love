import { expect, test, type Page } from "@playwright/test";
import { finalProposalLine } from "../../src/content/copy";

async function expectHeroLeftOfHeroine(
  page: Page,
  heroSelector: string,
  heroineSelector: string,
) {
  const [heroBox, heroineBox] = await Promise.all([
    page.locator(heroSelector).boundingBox(),
    page.locator(heroineSelector).boundingBox(),
  ]);

  expect(heroBox, `${heroSelector} should be visible`).not.toBeNull();
  expect(heroineBox, `${heroineSelector} should be visible`).not.toBeNull();

  const heroCenter = heroBox!.x + heroBox!.width / 2;
  const heroineCenter = heroineBox!.x + heroineBox!.width / 2;

  expect(heroCenter).toBeLessThan(heroineCenter);
}

test("plays to the chest scene and reveals the proposal", async ({ page }) => {
  await page.goto("/?testMode=1");

  const appRoot = page.locator('[data-role="app-root"]');
  const memoryHost = page.locator('[data-role="memory-host"]');
  const startOverlay = page.locator('[data-role="start-overlay"]');
  const chestTrigger = page.locator('[data-role="chest-trigger"]');
  const proposalLine = page.locator('[data-role="proposal-line"]');

  await startOverlay.click();

  await expect(startOverlay).toBeHidden();
  await page.waitForFunction(() => {
    const appRoot = document.querySelector('[data-role="app-root"]');
    const memoryHost = document.querySelector<HTMLElement>('[data-role="memory-host"]');
    return appRoot?.getAttribute("data-scene") === "memory" && memoryHost?.hidden === false;
  });
  await expect(appRoot).toHaveAttribute("data-scene", "chest");
  await expect(chestTrigger).toBeVisible();

  await chestTrigger.click();

  await expect(appRoot).toHaveAttribute("data-scene", "proposal");
  await expect(proposalLine).toContainText(finalProposalLine);
});

test("keeps the hero left of the heroine in stable character scenes", async ({ page }) => {
  await page.goto("/?testMode=1");

  const appRoot = page.locator('[data-role="app-root"]');
  const startOverlay = page.locator('[data-role="start-overlay"]');
  const chestTrigger = page.locator('[data-role="chest-trigger"]');

  await expect(appRoot).toHaveAttribute("data-scene", "opening");
  await expectHeroLeftOfHeroine(
    page,
    ".stage-sprite--opening-boy",
    ".stage-sprite--opening-girl",
  );

  await startOverlay.click();
  await expect(appRoot).toHaveAttribute("data-scene", "chest");
  await expectHeroLeftOfHeroine(
    page,
    ".stage-sprite--chest-boy",
    ".stage-sprite--chest-girl",
  );

  await chestTrigger.click();
  await expect(appRoot).toHaveAttribute("data-scene", "proposal");
  await expectHeroLeftOfHeroine(
    page,
    ".stage-sprite--proposal-boy",
    ".stage-sprite--proposal-girl",
  );
});
