// Prepare individual transparent game sprites from the generated master sheet.
// Artwork stays unchanged; connected neutral matte areas are removed before export.
import { chromium } from 'playwright';
import { readFile, writeFile } from 'node:fs/promises';
const source = await readFile(new URL('../garden-gpt-image-2/image/unified-sprites-20260912.png', import.meta.url));
const specs = [
  ['boy-run', 0, 0, 418, 475], ['boy-kneel', 418, 0, 412, 475], ['boy-idle', 830, 0, 424, 475],
  ['girl-idle', 0, 475, 418, 440], ['girl-happy', 418, 475, 412, 440], ['dragon', 830, 475, 424, 440],
  ['chest-closed', 0, 915, 418, 339], ['chest-open', 418, 915, 412, 339], ['ring', 830, 915, 424, 339],
];
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  const sprites = await page.evaluate(async ({ data, specs }) => {
    const image = new Image(); image.src = 'data:image/png;base64,' + data; await image.decode();
    return specs.map(([name, x, y, width, height]) => {
      const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext('2d'); ctx.drawImage(image, x, y, width, height, 0, 0, width, height);
      const pixels = ctx.getImageData(0, 0, width, height); const rgba = pixels.data;
      const visited = new Uint8Array(width * height);
      const isMatte = p => { const c = p * 4; return Math.min(rgba[c], rgba[c+1], rgba[c+2]) > 185 && Math.max(rgba[c], rgba[c+1], rgba[c+2]) - Math.min(rgba[c], rgba[c+1], rgba[c+2]) < 17; };
      for (let p = 0; p < width * height; p++) {
        if (visited[p] || !isMatte(p)) continue;
        const component = [p]; visited[p] = 1; let edge = false, lo = 255, hi = 0;
        for (let n = 0; n < component.length; n++) {
          const q = component[n], px = q % width, py = Math.floor(q / width);
          edge ||= px === 0 || px === width - 1 || py === 0 || py === height - 1;
          lo = Math.min(lo, rgba[q * 4]); hi = Math.max(hi, rgba[q * 4]);
          for (const next of [px ? q-1 : -1, px < width-1 ? q+1 : -1, py ? q-width : -1, py < height-1 ? q+width : -1]) {
            if (next >= 0 && !visited[next] && isMatte(next)) { visited[next] = 1; component.push(next); }
          }
        }
        if (edge || (component.length > 30 && lo < 225 && hi > 245)) component.forEach(q => { rgba[q * 4 + 3] = 0; });
      }
      // Defringe only pale matte pixels touching transparency, preserving dark outlines.
      const alpha = new Uint8Array(width * height);
      for (let p = 0; p < alpha.length; p++) alpha[p] = rgba[p * 4 + 3];
      for (let p = width; p < width * (height - 1); p++) {
        if (!alpha[p] || p % width === 0 || p % width === width - 1) continue;
        const c = p * 4;
        if ([p-1, p+1, p-width, p+width].some(q => !alpha[q]) && Math.min(rgba[c], rgba[c+1], rgba[c+2]) > 85 && Math.max(rgba[c], rgba[c+1], rgba[c+2]) - Math.min(rgba[c], rgba[c+1], rgba[c+2]) < 60) rgba[c+3] = 0;
      }
      ctx.putImageData(pixels, 0, 0);
      let left = width, top = height, right = 0, bottom = 0;
      for (let p = 0; p < width * height; p++) if (rgba[p * 4 + 3]) {
        const px = p % width, py = Math.floor(p / width);
        left = Math.min(left, px); right = Math.max(right, px); top = Math.min(top, py); bottom = Math.max(bottom, py);
      }
      const out = document.createElement('canvas'); out.width = out.height = 256;
      const dest = out.getContext('2d'); dest.imageSmoothingEnabled = true; dest.imageSmoothingQuality = 'high';
      const w = right-left+1, h = bottom-top+1;
      const scale = name.startsWith('boy') || name.startsWith('girl') ? .53 : Math.min(220/w, 220/h);
      const targetW = w*scale, targetH = h*scale;
      dest.drawImage(canvas, left, top, w, h, (256-targetW)/2, name === 'ring' ? (256-targetH)/2 : 232-targetH, targetW, targetH);
      return { name, data: out.toDataURL('image/png').split(',')[1] };
    });
  }, { data: source.toString('base64'), specs });
  for (const sprite of sprites) {
    await writeFile(new URL('../public/sprites/storybook-' + sprite.name + '.png', import.meta.url), Buffer.from(sprite.data, 'base64'));
    console.log('Prepared ' + sprite.name);
  }
} finally { await browser.close(); }
