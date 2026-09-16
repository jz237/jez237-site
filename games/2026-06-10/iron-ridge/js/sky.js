// Procedural daytime sky: gradient dome with sun disc, drifting billboard
// clouds (canvas texture), layered distant ridge silhouettes (the "iron
// ridge" backdrop), circling birds, hemisphere + directional sun lighting.

import * as THREE from 'three';
import { Simplex2, makeRng } from './noise.js?v=detail2';

export const SUN_DIR = new THREE.Vector3(0.55, 0.62, 0.38).normalize();

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
  vec3 zenith  = vec3(0.09, 0.31, 0.79);
  vec3 horizon = vec3(0.78, 0.88, 0.97);
  vec3 ground  = vec3(0.62, 0.68, 0.66);
  vec3 col = mix(horizon, zenith, pow(max(h, 0.0), 0.52));
  if (h < 0.0) col = mix(horizon, ground, clamp(-h * 8.0, 0.0, 1.0));

  float sunAmt = max(dot(normalize(vDir), sunDir), 0.0);
  col += vec3(1.0, 0.94, 0.78) * pow(sunAmt, 900.0) * 0.85;  // disc
  col += vec3(1.0, 0.88, 0.62) * pow(sunAmt, 24.0) * 0.13;   // halo
  col += vec3(1.0, 0.86, 0.66) * pow(sunAmt, 6.0) * 0.07;    // warm scatter
  col += vec3(0.95, 0.92, 0.85) * pow(sunAmt, 3.0) * 0.05;   // broad haze

  gl_FragColor = vec4(col, 1.0);
}`;

function cloudTexture(seed) {
  const s = 256;
  const cv = document.createElement('canvas');
  cv.width = cv.height = s;
  const ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, s, s);
  const rng = makeRng(seed);
  // layered soft blobs — white cores with a cooler shaded underside
  for (let i = 0; i < 24; i++) {
    const x = s * (0.18 + rng() * 0.64);
    const y = s * (0.32 + rng() * 0.3);
    const r = s * (0.07 + rng() * 0.15);
    // shadow blob, offset downward
    const gs = ctx.createRadialGradient(x, y + r * 0.4, 0, x, y + r * 0.4, r * 1.05);
    gs.addColorStop(0, 'rgba(148,168,196,0.30)');
    gs.addColorStop(1, 'rgba(148,168,196,0)');
    ctx.fillStyle = gs;
    ctx.fillRect(0, 0, s, s);
    // lit core, offset upward
    const g = ctx.createRadialGradient(x, y - r * 0.22, 0, x, y - r * 0.22, r);
    g.addColorStop(0, 'rgba(255,255,255,0.62)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// --- distant ridge silhouettes -------------------------------------------
// Concentric jagged rings well past the terrain edge (280m) but inside the
// camera far plane (700m). They follow the player, so they read as an
// infinitely distant backdrop; fog is baked into the vertex colors instead
// of applied (uniform fog at that range would erase them).
function ridgeLayer(radius, base, amp, topColor, baseColor, seed, freq) {
  // Four gently curved slope bands, with baked gully shading. More natural
  // relief than a single vertical silhouette; still one draw per ridge.
  const N=512, rows=5, noise=new Simplex2(seed),verts=[],cols=[],idx=[];
  const top=new THREE.Color(topColor),haze=new THREE.Color(baseColor),c=new THREE.Color();
  const heights=[];
  for(let i=0;i<N;i++) {
    const a=i/N*Math.PI*2,cx=Math.cos(a),sz=Math.sin(a);
    const n=noise.fbm(cx*freq+3.7,sz*freq-1.9,3,2.0,.42);
    heights.push(base+Math.pow(THREE.MathUtils.clamp(n*.43+.55,0,1),1.15)*amp);
  }
  for(let i=0;i<=N;i++) {
    const a=(i%N)/N*Math.PI*2,cx=Math.cos(a),sz=Math.sin(a);
    const h=heights[i%N],slope=(heights[(i+1)%N]-heights[(i+N-1)%N])*.032;
    for(let j=0;j<rows;j++) {
      const t=j/(rows-1),r=radius-(1-t)*45;
      verts.push(cx*r,-22+(h+22)*Math.pow(t,.85),sz*r);
      const gully=noise.noise(cx*freq*4.1+t*.65,sz*freq*4.1)*.5+.5;
      const shade=1+THREE.MathUtils.clamp(slope*Math.cos(a-.7),-.09,.09)*t-gully*.075*t;
      c.copy(haze).lerp(top,Math.pow(t,1.5)*.9).multiplyScalar(shade);
      cols.push(c.r,c.g,c.b);
      if(i<N&&j<rows-1){const k=i*rows+j;idx.push(k,k+rows,k+1,k+1,k+rows,k+rows+1);}
    }
  }
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));
  geo.setAttribute('color',new THREE.Float32BufferAttribute(cols,3));geo.setIndex(idx);
  const mesh=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({vertexColors:true,fog:false,side:THREE.DoubleSide}));
  mesh.frustumCulled=false;return mesh;
}

// --- birds ----------------------------------------------------------------
function buildBirds(count) {
  const group = new THREE.Group();
  const mat = new THREE.MeshBasicMaterial({
    color: 0x2e3440, side: THREE.DoubleSide,
  });
  const wingGeo = new THREE.PlaneGeometry(1.05, 0.34);
  wingGeo.translate(0.52, 0, 0); // pivot at the body
  const rng = makeRng(4242);
  const birds = [];
  for (let i = 0; i < count; i++) {
    const bird = new THREE.Group();
    const l = new THREE.Mesh(wingGeo, mat);
    const r = new THREE.Mesh(wingGeo, mat);
    r.rotation.y = Math.PI;
    bird.add(l, r);
    group.add(bird);
    birds.push({
      bird, l, r,
      orbitR: 34 + rng() * 46,
      orbitH: 52 + rng() * 30,
      ang: rng() * Math.PI * 2,
      speed: (0.09 + rng() * 0.07) * (rng() < 0.5 ? 1 : -1),
      flapSpeed: 5.5 + rng() * 2.5,
      phase: rng() * Math.PI * 2,
      cx: (rng() - 0.5) * 120,
      cz: (rng() - 0.5) * 120,
    });
  }
  return { group, birds };
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

  // the eponymous ridge line: three haze-graded silhouette layers
  const distant = new THREE.Group();
  distant.add(ridgeLayer(645, 30, 96, 0xabbac7, 0xcbdce5, 1201, 2.6));
  distant.add(ridgeLayer(565, 18, 74, 0x859da7, 0xc2d4db, 5807, 3.4));
  distant.add(ridgeLayer(488, 8, 50, 0x657f80, 0xb6cbd0, 9103, 4.3));
  scene.add(distant);

  // clouds
  const texA = cloudTexture(71);
  const texB = cloudTexture(137);
  const clouds = new THREE.Group();
  const cloudData = [];
  for (let i = 0; i < 26; i++) {
    const cMat = new THREE.SpriteMaterial({
      map: i % 2 ? texA : texB,
      transparent: true, opacity: 0.58 + Math.random() * 0.2,
      depthWrite: false, fog: false, color: 0xffffff,
    });
    const sp = new THREE.Sprite(cMat);
    const ang = Math.random() * Math.PI * 2;
    const rad = 260 + Math.random() * 440;
    sp.position.set(Math.cos(ang) * rad, 110 + Math.random() * 110, Math.sin(ang) * rad);
    const sc = 130 + Math.random() * 200;
    sp.scale.set(sc, sc * 0.42, 1);
    clouds.add(sp);
    cloudData.push({ sp, speed: 1.2 + Math.random() * 1.6 });
  }
  scene.add(clouds);

  // birds
  const { group: birdGroup, birds } = buildBirds(7);
  scene.add(birdGroup);
  let birdT = 0;

  // lighting
  const hemi = new THREE.HemisphereLight(0xc1d5e5, 0x777052, 0.96);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight(0xffe8c4, 2.65);
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
    // keep sky + backdrop + shadow frustum centred on the player
    sky.position.copy(focus);
    distant.position.set(focus.x, 0, focus.z);
    sun.position.copy(focus).addScaledVector(SUN_DIR, 180);
    sun.target.position.copy(focus);
    for (const c of cloudData) {
      c.sp.position.x += c.speed * dt;
      if (c.sp.position.x - focus.x > 720) c.sp.position.x -= 1440;
    }
    birdT += dt;
    for (const b of birds) {
      b.ang += b.speed * dt;
      const x = focus.x + b.cx + Math.cos(b.ang) * b.orbitR;
      const z = focus.z + b.cz + Math.sin(b.ang) * b.orbitR;
      const y = b.orbitH + Math.sin(birdT * 0.31 + b.phase) * 4;
      b.bird.position.set(x, y, z);
      // face along the direction of travel
      b.bird.rotation.y = -b.ang - (b.speed > 0 ? Math.PI : 0);
      const flap = Math.sin(birdT * b.flapSpeed + b.phase) * 0.55 + 0.1;
      b.l.rotation.z = flap;
      b.r.rotation.z = flap; // mirrored mesh flaps opposite
    }
  }

  return { sky, sun, hemi, update };
}
