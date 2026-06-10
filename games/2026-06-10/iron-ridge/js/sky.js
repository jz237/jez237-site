// Procedural daytime sky: gradient dome with sun disc, drifting billboard
// clouds (canvas texture), hemisphere + directional sun lighting.

import * as THREE from 'three';

export const SUN_DIR = new THREE.Vector3(0.45, 0.72, 0.3).normalize();

const SKY_VERT = /* glsl */`
varying vec3 vDir;
void main() {
  vDir = normalize(position);
  vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_Position = p.xyww; // push to far plane
}`;

const SKY_FRAG = /* glsl */`
varying vec3 vDir;
uniform vec3 sunDir;
void main() {
  float h = clamp(vDir.y, -0.1, 1.0);
  vec3 zenith  = vec3(0.19, 0.42, 0.80);
  vec3 horizon = vec3(0.70, 0.83, 0.93);
  vec3 ground  = vec3(0.62, 0.68, 0.66);
  vec3 col = mix(horizon, zenith, pow(max(h, 0.0), 0.42));
  if (h < 0.0) col = mix(horizon, ground, clamp(-h * 8.0, 0.0, 1.0));

  float sunAmt = max(dot(normalize(vDir), sunDir), 0.0);
  col += vec3(1.0, 0.94, 0.78) * pow(sunAmt, 900.0) * 0.85; // disc
  col += vec3(1.0, 0.9, 0.65) * pow(sunAmt, 24.0) * 0.10;   // halo
  col += vec3(0.95, 0.92, 0.85) * pow(sunAmt, 3.0) * 0.05;  // broad haze

  gl_FragColor = vec4(col, 1.0);
}`;

function cloudTexture() {
  const s = 256;
  const cv = document.createElement('canvas');
  cv.width = cv.height = s;
  const ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, s, s);
  // layered soft blobs
  for (let i = 0; i < 26; i++) {
    const x = s * (0.2 + Math.random() * 0.6);
    const y = s * (0.35 + Math.random() * 0.3);
    const r = s * (0.08 + Math.random() * 0.16);
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, 'rgba(255,255,255,0.55)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function buildSky(scene) {
  const skyGeo = new THREE.SphereGeometry(900, 24, 16);
  const skyMat = new THREE.ShaderMaterial({
    vertexShader: SKY_VERT,
    fragmentShader: SKY_FRAG,
    uniforms: { sunDir: { value: SUN_DIR.clone() } },
    side: THREE.BackSide,
    depthWrite: false,
  });
  const sky = new THREE.Mesh(skyGeo, skyMat);
  sky.frustumCulled = false;
  sky.renderOrder = -10;
  scene.add(sky);

  // clouds
  const tex = cloudTexture();
  const clouds = new THREE.Group();
  const cMat = new THREE.SpriteMaterial({
    map: tex, transparent: true, opacity: 0.5, depthWrite: false, fog: false,
    color: 0xdfe7ef,
  });
  const cloudData = [];
  for (let i = 0; i < 18; i++) {
    const sp = new THREE.Sprite(cMat);
    const ang = Math.random() * Math.PI * 2;
    const rad = 280 + Math.random() * 420;
    sp.position.set(Math.cos(ang) * rad, 120 + Math.random() * 90, Math.sin(ang) * rad);
    const sc = 120 + Math.random() * 160;
    sp.scale.set(sc, sc * 0.42, 1);
    clouds.add(sp);
    cloudData.push({ sp, speed: 1.2 + Math.random() * 1.6 });
  }
  scene.add(clouds);

  // lighting
  const hemi = new THREE.HemisphereLight(0xbcd8ee, 0x68724f, 0.85);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight(0xfff2dc, 2.6);
  sun.position.copy(SUN_DIR).multiplyScalar(180);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 30;
  sun.shadow.camera.far = 420;
  const ext = 95;
  sun.shadow.camera.left = -ext;
  sun.shadow.camera.right = ext;
  sun.shadow.camera.top = ext;
  sun.shadow.camera.bottom = -ext;
  sun.shadow.bias = -0.0006;
  sun.shadow.normalBias = 0.6;
  scene.add(sun);
  scene.add(sun.target);

  function update(dt, focus) {
    // keep sky + shadow frustum centred on the player
    sky.position.copy(focus);
    sun.position.copy(focus).addScaledVector(SUN_DIR, 180);
    sun.target.position.copy(focus);
    for (const c of cloudData) {
      c.sp.position.x += c.speed * dt;
      if (c.sp.position.x - focus.x > 720) c.sp.position.x -= 1440;
    }
  }

  return { sky, sun, hemi, update };
}
