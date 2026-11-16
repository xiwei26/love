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

  await expect.poll(() => page.evaluate(() => document.fullscreenElement === document.documentElement)).toBe(true);
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

for (const mode of ["unsupported", "rejected", "throws"] as const) {
  test(`continues the story when fullscreen is ${mode}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.addInitScript((mode) => {
      Object.defineProperty(document, "fullscreenEnabled", { value: mode !== "unsupported" });
      Element.prototype.requestFullscreen = () => {
        if (mode === "throws") throw new Error("Fullscreen unavailable");
        return Promise.reject(new Error("Fullscreen denied"));
      };
    }, mode);
    await page.goto("/?testMode=1");
    await page.getByRole("button", { name: "点击开启音乐与童话" }).click();
    await page.locator('[data-role="chest-trigger"]').click();
    await expect(page.locator('[data-role="proposal-line"]')).toContainText(finalProposalLine);
    expect(errors).toEqual([]);
  });
}

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

for (const viewport of [{ width: 1440, height: 900 }, { width: 844, height: 390 }, { width: 390, height: 844 }, { width: 320, height: 568 }]) {
  test(`keeps controls and proposal composition clear at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/?testMode=1");
    await page.getByRole("button", { name: "点击开启音乐与童话" }).click();
    const trigger = page.locator('[data-role="chest-trigger"]');
    await expect(trigger).toBeVisible();
    const receivesClick = await trigger.evaluate(element => {
      const rect = element.getBoundingClientRect();
      return document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2) === element;
    });
    expect(receivesClick).toBe(true);
    await trigger.click();
    await expect(page.locator('[data-role="app-root"]')).toHaveAttribute("data-scene", "proposal");
    await page.waitForTimeout(1800);
    const line = await page.locator('[data-role="proposal-line"]').boundingBox();
    for (const selector of [".stage-sprite--proposal-boy", ".stage-sprite--proposal-girl", ".stage-sprite--proposal-chest", ".stage-sprite--proposal-ring"]) {
      const box = await page.locator(selector).boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width);
      expect(box!.y).toBeGreaterThanOrEqual(line!.y + line!.height);
      expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
