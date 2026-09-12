const baseUrl = import.meta.env.BASE_URL;

function withBase(path: string) {
  return `${baseUrl}${path}`;
}

export const assetManifest = {
  music: withBase("audio/proposal-theme.mp3"),
  sprites: {
    girlIdle: withBase("sprites/storybook-girl-idle.png"),
    girlRescued: withBase("sprites/storybook-girl-happy.png"),
    boyRun: withBase("sprites/storybook-boy-run.png"),
    boyKneel: withBase("sprites/storybook-boy-kneel.png"),
    boyIdle: withBase("sprites/storybook-boy-idle.png"),
    dragon: withBase("sprites/storybook-dragon.png"),
    chestClosed: withBase("sprites/storybook-chest-closed.png"),
    chestOpen: withBase("sprites/storybook-chest-open.png"),
    heart: withBase("sprites/heart.png"),
    ring: withBase("sprites/storybook-ring.png"),
  },
  backgrounds: {
    opening: withBase("backgrounds/stage-opening.png"),
    dragon: withBase("backgrounds/stage-dragon.png"),
    rescue: withBase("backgrounds/stage-rescue.png"),
    chest: withBase("backgrounds/stage-chest.png"),
    proposal: withBase("backgrounds/stage-proposal.png"),
  },
  photos: [
    withBase("photos/memory-01.jpg"),
    withBase("photos/memory-02.jpg"),
    withBase("photos/memory-03.jpg"),
    withBase("photos/memory-04.jpg"),
    withBase("photos/memory-05.jpg"),
    withBase("photos/memory-06.jpg"),
    withBase("photos/memory-07.jpg"),
    withBase("photos/memory-08.jpg"),
  ],
} as const;
