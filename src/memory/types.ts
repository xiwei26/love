export interface MemoryPhotoPlacement {
  photoUrl: string;
  x: number;
  y: number;
  z: number;
  rotationY: number;
  scale: number;
}

export interface MemorySceneLayout {
  hero: MemoryPhotoPlacement;
  supporting: MemoryPhotoPlacement[];
  gatherTargets: Array<{ x: number; y: number; z: number }>;
}

export interface MemorySceneController {
  mount: (host: HTMLElement) => void;
  start: (photoUrls: string[]) => Promise<void>;
  stop: () => void;
  resize: (width: number, height: number) => void;
  dispose: () => void;
}
