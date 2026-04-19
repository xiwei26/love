export interface MusicController {
  start: () => Promise<boolean>;
  stop: () => void;
}

export function createMusicController(audio: HTMLAudioElement): MusicController {
  audio.loop = true;
  audio.volume = 0.58;

  return {
    async start() {
      try {
        await audio.play();
        return true;
      } catch {
        return false;
      }
    },
    stop() {
      audio.pause();
      audio.currentTime = 0;
    },
  };
}
