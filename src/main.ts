import "./styles/global.css";
import { createApp } from "./app/createApp";

const root = document.querySelector<HTMLElement>("#app");

if (!root) {
  throw new Error("#app root not found");
}

createApp(root);
