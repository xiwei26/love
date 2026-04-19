import type { SceneId, SubtitleCue } from "../engine/types";

export const sceneCopy = {
  opening: "在一个藏着秘密与宝藏的世界里……",
  dragon: "她不小心闯进了龙守护的秘境。",
  memory: "原来最珍贵的宝藏，一直都是我们一起走过的时光。",
  chestPrompt: "点一下，打开属于我们的终章。",
} as const;

export const sceneSubtitleCues: Partial<Record<SceneId, SubtitleCue[]>> = {
  dragon: [
    {
      atMs: 3600,
      text: "勇士奚为踏入龙穴，一路过关斩将。",
    },
    {
      atMs: 7600,
      text: "烈焰与熔岩挡不住他靠近你的脚步。",
    },
  ],
  rescue: [
    {
      atMs: 1800,
      text: "恶龙咆哮着压下最后一道试炼。",
    },
    {
      atMs: 6200,
      text: "可奚为没有后退，终于打败了巨龙。",
    },
    {
      atMs: 10800,
      text: "他穿过火光与危险，只为来到你的身边。",
    },
  ],
} as const;

export const finalProposalLine = "你愿意嫁给我吗？";
