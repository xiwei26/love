const baseUrl = import.meta.env.BASE_URL;

function withBase(path: string) {
  return `${baseUrl}${path}`;
}

export const assetManifest = {
  music: withBase("audio/proposal-theme.mp3"),
  sprites: {
    girlIdle: withBase("sprites/hero-girl-idle.png"),
    girlRescued: withBase("sprites/hero-girl-rescued.png"),
    boyRun: withBase("sprites/hero-boy-run.png"),
    boyKneel: withBase("sprites/hero-boy-kneel.png"),
    dragon: withBase("sprites/dragon.png"),
    chestClosed: withBase("sprites/chest-closed.png"),
    chestOpen: withBase("sprites/chest-open.png"),
    heart: withBase("sprites/heart.png"),
    ring: withBase("sprites/ring.png"),
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
