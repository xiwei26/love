import "./styles/global.css";
import "./styles/stage.css";
import { createApp } from "./app/createApp";
import { renderStage } from "./app/renderStage";

const root = document.querySelector<HTMLElement>("#app");

if (!root) {
  throw new Error("#app root not found");
}

createApp(root);

renderStage(document.querySelector(".proposal-app") as HTMLElement, {
  sceneId: "opening",
  subtitle: "",
  photos: [],
  showPrompt: false,
  proposalLine: "",
});
