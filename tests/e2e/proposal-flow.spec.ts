import { expect, test } from "@playwright/test";
import { finalProposalLine } from "../../src/content/copy";

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
