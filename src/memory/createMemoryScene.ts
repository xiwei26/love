import * as THREE from "three";
import { createMemoryLayout } from "./createMemoryLayout";
import type { MemoryPhotoPlacement, MemorySceneController } from "./types";

interface PhotoPlaneState {
  frameMaterial: THREE.MeshBasicMaterial;
  group: THREE.Group;
  photoMaterial: THREE.MeshBasicMaterial;
  startPosition: THREE.Vector3;
  targetPosition: THREE.Vector3;
  gatherPosition: THREE.Vector3;
}

const cardGeometry = new THREE.PlaneGeometry(1.5, 1.9, 1, 1);
const frameGeometry = new THREE.PlaneGeometry(1.66, 2.06, 1, 1);

const totalDurationMs = 22000;
const arrivalEndMs = 5000;
const expansionEndMs = 14000;
const gatherStartMs = 18000;

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function easeOutCubic(value: number) {
  const inverse = 1 - value;
  return 1 - inverse * inverse * inverse;
}

function easeInOutSine(value: number) {
  return -(Math.cos(Math.PI * value) - 1) / 2;
}

function loadTexture(loader: THREE.TextureLoader, photoUrl: string) {
  return new Promise<THREE.Texture>((resolve, reject) => {
    loader.load(
      photoUrl,
      (texture: THREE.Texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        resolve(texture);
      },
      undefined,
      reject,
    );
  });
}

function createPhotoPlane(texture: THREE.Texture) {
  const group = new THREE.Group();
  const frame = new THREE.Mesh(frameGeometry.clone(), undefined);
  const photo = new THREE.Mesh(cardGeometry.clone(), undefined);

  const frameMaterial = new THREE.MeshBasicMaterial({
    color: 0xf3e9ef,
    transparent: true,
    opacity: 0.18,
    side: THREE.DoubleSide,
  });
  frame.material = frameMaterial;

  const photoMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 1,
    side: THREE.DoubleSide,
  });
  photo.material = photoMaterial;
  photo.position.z = 0.01;

  group.add(frame);
  group.add(photo);

  return {
    frameMaterial,
    group,
    photoMaterial,
  };
}

function buildPhotoState(
  placement: MemoryPhotoPlacement,
  gatherTarget: { x: number; y: number; z: number },
  texture: THREE.Texture,
  isHero: boolean,
) {
  const { frameMaterial, group, photoMaterial } = createPhotoPlane(texture);
  group.scale.setScalar(placement.scale);

  const startPosition = isHero
    ? new THREE.Vector3(0, 0.02, -4.4)
    : new THREE.Vector3(
        placement.x * 0.45,
        placement.y * 0.4,
        placement.z - 2.2,
      );

  group.position.copy(startPosition);
  group.rotation.y = isHero ? 0 : placement.rotationY * 0.35;

  if (!isHero) {
    photoMaterial.opacity = 0;
    frameMaterial.opacity = 0;
  }

  return {
    frameMaterial,
    group,
    photoMaterial,
    startPosition,
    targetPosition: new THREE.Vector3(placement.x, placement.y, placement.z),
    gatherPosition: new THREE.Vector3(gatherTarget.x, gatherTarget.y, gatherTarget.z),
  } satisfies PhotoPlaneState;
}

export function createMemoryScene(): MemorySceneController {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 30);
  camera.position.set(0, 0, 5.2);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const loader = new THREE.TextureLoader();
  const particleGeometry = new THREE.BufferGeometry();
  const particleCount = 220;
  const particlePositions = new Float32Array(particleCount * 3);

  for (let index = 0; index < particleCount; index += 1) {
    const offset = index * 3;
    particlePositions[offset] = (Math.random() - 0.5) * 10;
    particlePositions[offset + 1] = (Math.random() - 0.5) * 6;
    particlePositions[offset + 2] = -Math.random() * 8;
  }

  particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(particlePositions, 3),
  );

  const particles = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({
      color: 0xf5f2ff,
      size: 0.05,
      transparent: true,
      opacity: 0.72,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  scene.add(particles);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xfff4d6, 0.85);
  directionalLight.position.set(1.8, 1.6, 2.8);
  scene.add(directionalLight);

  let host: HTMLElement | null = null;
  let animationFrame = 0;
  let phaseStart = 0;
  let active = false;
  let currentPhotoStates: PhotoPlaneState[] = [];
  let startNonce = 0;

  function ensureMounted() {
    if (!host || renderer.domElement.parentElement === host) {
      return;
    }

    host.innerHTML = "";
    host.appendChild(renderer.domElement);
  }

  function clearPhotoPlanes() {
    currentPhotoStates.forEach((state) => {
      const photoMesh = state.group.children[1] as THREE.Mesh;
      const texture = state.photoMaterial.map;

      state.group.removeFromParent();
      state.photoMaterial.dispose();
      state.frameMaterial.dispose();
      texture?.dispose();
      photoMesh.geometry.dispose();
      (state.group.children[0] as THREE.Mesh).geometry.dispose();
    });

    currentPhotoStates = [];
  }

  function renderFrame(now: number) {
    if (!active) {
      return;
    }

    if (phaseStart === 0) {
      phaseStart = now;
    }

    const elapsed = now - phaseStart;
    const arrivalProgress = easeOutCubic(clamp01(elapsed / arrivalEndMs));
    const gatherProgress = easeInOutSine(
      clamp01((elapsed - gatherStartMs) / (totalDurationMs - gatherStartMs)),
    );

    currentPhotoStates.forEach((state, index) => {
      const isHero = index === 0;

      if (isHero) {
        state.group.position.lerpVectors(
          state.startPosition,
          state.targetPosition,
          gatherProgress > 0 ? 1 - gatherProgress * 0.18 : arrivalProgress,
        );
        state.group.rotation.y = THREE.MathUtils.lerp(0, 0.04, arrivalProgress);
      } else {
        const localStart = arrivalEndMs * 0.58 + (index - 1) * 900;
        const appearProgress = easeOutCubic(
          clamp01((elapsed - localStart) / (expansionEndMs - localStart)),
        );

        state.group.position.lerpVectors(
          state.startPosition,
          state.targetPosition,
          appearProgress,
        );
        state.group.rotation.y = THREE.MathUtils.lerp(
          state.group.rotation.y,
          state.targetPosition.x >= 0 ? -0.08 : 0.08,
          0.06,
        );
        state.photoMaterial.opacity = appearProgress * (1 - gatherProgress * 0.55);
        state.frameMaterial.opacity = appearProgress * 0.24 * (1 - gatherProgress * 0.4);
      }

      if (gatherProgress > 0) {
        state.group.position.lerp(state.gatherPosition, gatherProgress * 0.1);
        state.group.scale.setScalar(
          THREE.MathUtils.lerp(state.group.scale.x, 0.74, gatherProgress * 0.12),
        );
        if (isHero) {
          state.photoMaterial.opacity = 1 - gatherProgress * 0.32;
          state.frameMaterial.opacity = 0.18 - gatherProgress * 0.08;
        }
      }
    });

    particles.rotation.y += 0.0007;
    particles.rotation.x = Math.sin(elapsed * 0.00016) * 0.03;

    camera.position.x = Math.sin(elapsed * 0.00024) * 0.14;
    camera.position.y = Math.cos(elapsed * 0.0002) * 0.08;
    camera.lookAt(0, 0, -0.6);

    renderer.render(scene, camera);
    animationFrame = window.requestAnimationFrame(renderFrame);
  }

  return {
    mount(nextHost) {
      host = nextHost;
      ensureMounted();
    },
    async start(photoUrls) {
      if (!host || photoUrls.length === 0) {
        return;
      }

      this.stop();
      const nonce = ++startNonce;
      ensureMounted();

      const layout = createMemoryLayout(photoUrls);
      const textures = await Promise.all(
        [layout.hero.photoUrl, ...layout.supporting.map((item) => item.photoUrl)].map((url) =>
          loadTexture(loader, url),
        ),
      );

      if (nonce !== startNonce) {
        textures.forEach((texture: THREE.Texture) => texture.dispose());
        return;
      }

      const heroState = buildPhotoState(
        layout.hero,
        layout.gatherTargets[0],
        textures[0],
        true,
      );
      scene.add(heroState.group);

      const supportingStates = layout.supporting.map((placement, index) =>
        buildPhotoState(
          placement,
          layout.gatherTargets[index + 1],
          textures[index + 1],
          false,
        ),
      );
      supportingStates.forEach((state) => scene.add(state.group));

      currentPhotoStates = [heroState, ...supportingStates];
      active = true;
      phaseStart = 0;
      animationFrame = window.requestAnimationFrame(renderFrame);
    },
    stop() {
      startNonce += 1;
      active = false;
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }
      phaseStart = 0;
      clearPhotoPlanes();
      renderer.clear();
    },
    resize(width, height) {
      const safeWidth = Math.max(1, Math.floor(width));
      const safeHeight = Math.max(1, Math.floor(height));
      camera.aspect = safeWidth / safeHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(safeWidth, safeHeight, false);
    },
    dispose() {
      this.stop();
      if (renderer.domElement.parentElement) {
        renderer.domElement.remove();
      }
      particleGeometry.dispose();
      (particles.material as THREE.PointsMaterial).dispose();
      renderer.dispose();
    },
  };
}
