import * as THREE from "three";

export interface HeartBounds { left: number; right: number; top: number; bottom: number }

// Bounds are in screen pixels and include the maximum pulse and halo extent.
export function findHeartSpaces(width: number, height: number, photos: HeartBounds[]) {
  const occupied = [...photos];
  const spaces: HeartBounds[] = [];
  const margin = Math.max(8, Math.min(width, height) * .015);
  for (const side of [.27, .73]) {
    let best: HeartBounds | undefined;
    let bestScore = -Infinity;
    for (let size = Math.min(width * .24, height * .30); size >= 32; size *= .88) {
      for (let y = height * .2 + size / 2; y < height - margin - size / 2; y += height / 32) {
        for (let x = margin + size / 2; x < width - margin - size / 2; x += width / 40) {
          if ((side < .5) !== (x < width / 2)) continue;
          const box = { left: x - size / 2, right: x + size / 2, top: y - size / 2, bottom: y + size / 2 };
          if (occupied.some(p => box.left < p.right + margin && box.right > p.left - margin && box.top < p.bottom + margin && box.bottom > p.top - margin)) continue;
          const score = size - Math.hypot(x - width * side, y - height * .55) * .08;
          if (score > bestScore) { best = box; bestScore = score; }
        }
      }
      if (best) break;
    }
    if (best) { spaces.push(best); occupied.push(best); }
  }
  return spaces;
}

export function createMemoryHearts() {
  const geometry = new THREE.BufferGeometry();
  const positions: number[] = [];
  const colors: number[] = [];
  // A dense curved rim, an airy interior, and a sparse outer dust halo.
  for (let i = 0; i < 1800; i++) {
    const t = Math.random() * Math.PI * 2;
    const rim = i < 1000;
    const radius = rim ? .88 + Math.random() * .12 : i < 1550 ? Math.sqrt(Math.random()) * .9 : 1.03 + Math.random() * .16;
    const x = Math.pow(Math.sin(t), 3);
    const y = (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t) + 2.5) / 16;
    positions.push(x * radius, y * radius, (Math.random() - .5) * .12);
    const color = new THREE.Color().setRGB(1, .18 + Math.random() * .35, .38 + Math.random() * .27);
    colors.push(color.r, color.g, color.b);
  }
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  const material = new THREE.ShaderMaterial({
    uniforms: { opacity: { value: 0 }, pixelRatio: { value: Math.min(devicePixelRatio, 2) } },
    vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `uniform float pixelRatio; varying vec3 tint;
      void main() { tint = color; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = 2.4 * pixelRatio; }`,
    fragmentShader: `uniform float opacity; varying vec3 tint;
      void main() { float r = length(gl_PointCoord - .5) * 2.;
        gl_FragColor = vec4(tint, (1. - smoothstep(.05, 1., r)) * opacity); }`,
  });
  const group = new THREE.Group();
  const hearts = [new THREE.Points(geometry, material), new THREE.Points(geometry, material)];
  hearts.forEach(heart => group.add(heart));
  let scales: number[] = [];
  return {
    group,
    layout(width: number, height: number, photos: HeartBounds[]) {
      const spaces = findHeartSpaces(width, height, photos);
      // Behind every photo, so moving photos naturally occlude the particles.
      const z = -12;
      const viewHeight = 2 * Math.tan(21 * Math.PI / 180) * (5.2 - z);
      scales = spaces.map(box => (box.right - box.left) / height * viewHeight / 3.0);
      hearts.forEach((heart, i) => {
        const box = spaces[i];
        heart.visible = !!box;
        if (!box) return;
        heart.position.set(((box.left + box.right) / 2 - width / 2) / height * viewHeight,
          (.5 - (box.top + box.bottom) / 2 / height) * viewHeight, z);
      });
    },
    update(elapsed: number, reducedMotion: boolean) {
      const phase = (elapsed % 1500) / 1500;
      const pulse = reducedMotion ? 0 : Math.exp(-Math.pow((phase - .16) / .065, 2)) + .6 * Math.exp(-Math.pow((phase - .34) / .085, 2));
      hearts.forEach((heart, i) => heart.scale.setScalar((scales[i] ?? 0) * (1 + pulse * .12)));
      material.uniforms.opacity.value = reducedMotion ? .85 : Math.min(1, Math.max(0, (elapsed - 2800) / 1800)) * (.7 + pulse * .2) * Math.min(1, Math.max(0, (22000 - elapsed) / 2500));
    },
    dispose() { geometry.dispose(); material.dispose(); },
  };
}
