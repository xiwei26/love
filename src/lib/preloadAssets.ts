export interface PreloadImagesResult {
  loaded: string[];
  skipped: string[];
}

export async function preloadImages(paths: string[]): Promise<PreloadImagesResult> {
  const loaded: string[] = [];
  const skipped: string[] = [];

  await Promise.all(
    paths.map(
      (path) =>
        new Promise<void>((resolve) => {
          const image = new Image();

          image.onload = () => {
            loaded.push(path);
            resolve();
          };

          image.onerror = () => {
            skipped.push(path);
            resolve();
          };

          image.src = path;
        }),
    ),
  );

  return { loaded, skipped };
}
