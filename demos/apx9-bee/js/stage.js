// Renderer, studio environment (softbox PMREM), lights, shadow floor and paper backdrop.
import * as THREE from 'three';
import { backdrop } from './textures.js';

export const LAYER = { MAIN: 0, FUR: 2, GLASS: 3, GUIDE: 4, SEL: 5, HOVER: 6 };

const PIXEL_BUDGET = { high: 7.5e6, medium: 3.6e6, low: 1.5e6 };

/** HDR studio: gradient dome + softboxes + black flags, baked to a PMREM for image-based lighting. */
function studioScene() {
  const s = new THREE.Scene();
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(80, 48, 24),
    new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
      fragmentShader: `varying vec3 vP; void main(){
        float h = vP.y;
        vec3 top = vec3(0.50,0.58,0.74);
        vec3 mid = vec3(0.24,0.24,0.25);
        vec3 bot = vec3(0.05,0.048,0.045);
        vec3 c = h > 0.0 ? mix(mid, top, pow(h, 0.9)) : mix(mid, bot, pow(-h, 0.5));
        gl_FragColor = vec4(c, 1.0);
      }`,
    })
  );
  s.add(dome);
  const box = (w, h, pos, intensity, tint = [1, 1, 1]) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(tint[0] * intensity, tint[1] * intensity, tint[2] * intensity), side: THREE.DoubleSide }));
    m.position.set(...pos); m.lookAt(0, 0, 0); s.add(m); return m;
  };
  box(38, 24, [-32, 34, 34], 18, [1.0, 0.96, 0.9]);     // key softbox
  box(10, 44, [46, 6, 14], 11, [0.9, 0.95, 1.0]);         // right strip
  box(52, 52, [0, 58, 4], 3.4, [1, 1, 1]);               // overhead
  box(8, 36, [-36, 10, -40], 15, [1, 0.97, 0.92]);       // back-left rim
  box(8, 36, [38, 14, -40], 12, [0.92, 0.96, 1.0]);       // back-right rim
  box(34, 8, [0, -22, 46], 2.5, [1, 0.95, 0.85]);        // low front bounce
  box(30, 22, [4, 6, 56], 0.0, [0, 0, 0]);               // black flag behind the camera (deep chrome contrast)
  box(10, 40, [-58, 4, 6], 0.0, [0, 0, 0]);              // black flag left
  return s;
}

export function createStage(container, Q) {
  const renderer = new THREE.WebGLRenderer({
    antialias: false, alpha: false, powerPreference: 'high-performance',
    preserveDrawingBuffer: Q.params.has('qa'), stencil: false,
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const tm = (Q.params.get('tm') || 'neutral').toLowerCase();
  renderer.toneMapping = tm === 'aces' ? THREE.ACESFilmicToneMapping : tm === 'agx' ? THREE.AgXToneMapping : THREE.NeutralToneMapping;
  renderer.toneMappingExposure = parseFloat(Q.params.get('exp')) || 0.78;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.info.autoReset = false;
  renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;touch-action:none;outline:none';
  renderer.domElement.tabIndex = 0;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(26, 1, 1, 1000);
  camera.layers.set(0);
  for (const l of [2, 3, 4]) camera.layers.enable(l);

  // ---- image based lighting
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = studioScene();
  const envRT = pmrem.fromScene(envScene, 0.012, 0.1, 400);
  scene.environment = envRT.texture;
  scene.environmentIntensity = parseFloat(Q.params.get('env')) || 1.0;
  envScene.traverse((o) => { o.geometry?.dispose(); o.material?.dispose(); });
  pmrem.dispose();

  // ---- backdrop
  const bgTex = backdrop({ w: 1024, h: 1024 });
  scene.background = bgTex;
  scene.backgroundIntensity = 1.0;
  scene.backgroundBlurriness = 0;

  // ---- lights (key matches the key softbox so speculars and reflections agree)
  const keyDir = new THREE.Vector3(-32, 34, 34).normalize();
  const key = new THREE.DirectionalLight(0xfff1dc, 2.6);
  key.castShadow = true;
  key.shadow.mapSize.set(Q.shadow, Q.shadow);
  key.shadow.bias = -0.0003;
  key.shadow.normalBias = 0.03;
  key.shadow.radius = 3;
  key.layers.enableAll();
  scene.add(key, key.target);

  const fill = new THREE.DirectionalLight(0xd6e4ff, 0.55);
  fill.position.set(42, 14, 10);
  scene.add(fill, fill.target);

  const rim = new THREE.DirectionalLight(0xfff0d8, 0.9);
  rim.position.set(-20, 18, -42);
  scene.add(rim, rim.target);

  // ---- shadow catcher
  const floorMat = new THREE.ShadowMaterial({ color: 0x1b1d22, opacity: 0.34 });
  // Shadows of far-flung exploded parts fall a long way from the bee: fade the catcher out radially so they dissolve instead of showing as hard blotches.
  const fade = { c: new THREE.Vector2(), r: new THREE.Vector2(52, 100) };
  floorMat.onBeforeCompile = (sh) => {
    sh.uniforms.uFadeC = { value: fade.c };
    sh.uniforms.uFadeR = { value: fade.r };
    sh.vertexShader = sh.vertexShader
      .replace('void main() {', 'varying vec2 vFloorXZ;\nvoid main() {')
      .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\n\tvFloorXZ = (modelMatrix * vec4(position, 1.0)).xz;');
    sh.fragmentShader = sh.fragmentShader
      .replace('void main() {', 'uniform vec2 uFadeC; uniform vec2 uFadeR; varying vec2 vFloorXZ;\nvoid main() {')
      .replace('opacity * ( 1.0 - getShadowMask() )', 'opacity * ( 1.0 - smoothstep( uFadeR.x, uFadeR.y, length( vFloorXZ - uFadeC ) ) ) * ( 1.0 - getShadowMask() )');
  };
  floorMat.customProgramCacheKey = () => 'apx-floor-fade-v1';
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(1600, 1600), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  floor.layers.disableAll();
  floor.layers.enable(4);
  floor.position.y = -20;
  floor.renderOrder = -1;
  scene.add(floor);

  const sphere = new THREE.Sphere(new THREE.Vector3(), 30);
  const shadowFit = { r: -1, cx: 1e9, cy: 1e9, cz: 1e9 };

  const stage = {
    renderer, scene, camera, key, fill, rim, floor, keyDir, sphere, fade,
    size: new THREE.Vector2(1, 1), dpr: 1,
    /** Resize canvas to the container; returns [w, h, dpr] in device pixels. */
    resize() {
      const w = Math.max(2, container.clientWidth), h = Math.max(2, container.clientHeight);
      let dpr = Math.min(window.devicePixelRatio || 1, Q.dpr);
      const budget = PIXEL_BUDGET[Q.tier] ?? PIXEL_BUDGET.high;
      dpr = Math.max(0.6, Math.min(dpr, Math.sqrt(budget / (w * h))));
      renderer.setPixelRatio(dpr);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      stage.size.set(w, h);
      stage.dpr = dpr;
      return [w, h, dpr];
    },
    /** Fit the key light's shadow frustum and the floor to the current bee bounds. */
    fitShadow(box, snap = false) {
      box.getBoundingSphere(sphere);
      const r = sphere.radius * 1.12 + 1;
      const c = sphere.center;
      const moved = Math.abs(shadowFit.r - r) > 0.5 || Math.abs(shadowFit.cx - c.x) > 0.5 || Math.abs(shadowFit.cy - c.y) > 0.5 || Math.abs(shadowFit.cz - c.z) > 0.5;
      if (moved) {
        shadowFit.r = r; shadowFit.cx = c.x; shadowFit.cy = c.y; shadowFit.cz = c.z;
        key.target.position.copy(c);
        key.position.copy(c).addScaledVector(keyDir, r * 2.2 + 20);
        const sc = key.shadow.camera;
        sc.left = -r; sc.right = r; sc.top = r; sc.bottom = -r;
        sc.near = Math.max(0.1, r * 0.6); sc.far = r * 4.4 + 40;
        sc.updateProjectionMatrix();
        key.target.updateMatrixWorld();
      }
      const targetY = box.min.y - 2.6;
      floor.position.y = snap ? targetY : floor.position.y + (targetY - floor.position.y) * 0.25;
      floor.position.x = c.x; floor.position.z = c.z;
      fade.c.set(c.x, c.z);
    },
  };
  return stage;
}
