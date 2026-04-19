import { describe, expect, it } from "vitest";
import { createApp } from "../../src/app/createApp";

describe("createApp", () => {
  it("renders the stage shell and app root controls", () => {
    document.body.innerHTML = '<div id="app"></div>';

    createApp(document.querySelector<HTMLElement>("#app")!);

    expect(document.querySelector(".proposal-app")).not.toBeNull();
    expect(document.querySelector('[data-role="subtitle"]')?.textContent).toBe("");
    expect(document.querySelector('[data-role="start-overlay"]')).not.toBeNull();
  });
});
