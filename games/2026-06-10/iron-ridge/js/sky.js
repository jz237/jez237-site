// Procedural daytime sky: gradient dome with sun disc, drifting billboard
// clouds (canvas texture), layered distant ridge silhouettes (the "iron
// ridge" backdrop), circling birds, hemisphere + directional sun lighting.

import * as THREE from 'three';
import { Simplex2, makeRng } from './noise.js?v=polish2';

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
uniform float uTime;
uniform vec3 uZenith;
uniform vec3 uHorizon;
uniform vec3 uSunTint;
uniform float uCirrus;
uniform float uOvercast;
uniform float uSunVis;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

void main() {
  vec3 dir = normalize(vDir);
  float h = clamp(dir.y, -0.1, 1.0);
  vec3 zenith  = uZenith;
  vec3 horizon = uHorizon;
  vec3 ground  = vec3(0.62, 0.68, 0.66);
  vec3 col = mix(horizon, zenith, pow(max(h, 0.0), 0.52));
  if (h < 0.0) col = mix(horizon, ground, clamp(-h * 8.0, 0.0, 1.0));

  // warmer, brighter horizon on the sun's side of the sky
  vec2 flatDir = normalize(dir.xz + 1e-4), flatSun = normalize(sunDir.xz);
  float sunSide = dot(flatDir, flatSun) * 0.5 + 0.5;
  float band = exp(-max(h, 0.0) * 9.0);
  col = mix(col, uSunTint, band * sunSide * sunSide * 0.3);
  // thin milky haze hugging the horizon all round
  col = mix(col, mix(vec3(0.86, 0.9, 0.93), horizon, 0.5), exp(-abs(h) * 26.0) * 0.45);

  // high cirrus: stretched streaks, only well above the horizon
  if (h > 0.04) {
    vec2 uv = dir.xz / (h + 0.18) * 1.6;
    uv = vec2(uv.x * 0.55 + uv.y * 0.35, uv.y * 2.4 - uv.x * 0.2) + vec2(uTime * 0.004, 0.0);
    float n = vnoise(uv * 1.3) * 0.6 + vnoise(uv * 3.1) * 0.3 + vnoise(uv * 7.3) * 0.1;
    float wisp = smoothstep(0.6, 0.88, n) * smoothstep(0.04, 0.24, h) * (1.0 - smoothstep(0.55, 0.95, h));
    col = mix(col, vec3(0.97, 0.98, 1.0), wisp * 0.32 * uCirrus);
  }
  // overcast deck: a grey, softly lumpy cloud layer across the whole sky
  if (uOvercast > 0.001 && h > -0.02) {
    vec2 ov = dir.xz / (h + 0.25) * 0.9 + vec2(uTime * 0.01, uTime * 0.004);
    float lump = vnoise(ov * 1.1) * 0.6 + vnoise(ov * 2.7) * 0.3 + vnoise(ov * 6.1) * 0.1;
    vec3 deck = mix(horizon * 0.82, horizon * 1.04, lump);
    col = mix(col, deck, uOvercast * smoothstep(-0.02, 0.12, h) * (0.75 + lump * 0.25));
  }

  float sunAmt = max(dot(dir, sunDir), 0.0);
  col += uSunTint * pow(sunAmt, 900.0) * 0.85 * uSunVis;          // disc
  col += uSunTint * pow(sunAmt, 24.0) * 0.14 * (0.3 + 0.7 * uSunVis); // halo
  col += uSunTint * pow(sunAmt, 6.0) * 0.08;                        // warm scatter
  col += vec3(0.95, 0.92, 0.85) * pow(sunAmt, 3.0) * 0.05;          // broad haze

  gl_FragColor = vec4(col, 1.0);
}`;

function cloudTexture(seed, stratus = false) {
  const s = 256;
  const cv = document.createElement('canvas');
  cv.width = cv.height = s;
  const ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, s, s);
  const rng = makeRng(seed);
  // layered soft blobs — white cores with a cooler shaded underside
  for (let i = 0; i < (stratus ? 40 : 24); i++) {
    const x = s * (stratus ? 0.08 + rng() * 0.84 : 0.18 + rng() * 0.64);
    const y = s * (stratus ? 0.42 + rng() * 0.14 : 0.32 + rng() * 0.3);
    const r = s * (stratus ? 0.05 + rng() * 0.08 : 0.07 + rng() * 0.15);
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
// weather haze over the whole backdrop (0 on a clear day)
const ridgeWeather = { value: 0 };
function ridgeLayer(radius, base, amp, topColor, baseColor, seed, freq, map, aerial = 0) {
  const N=384,rows=9,noise=new Simplex2(seed),verts=[],cols=[],uvs=[],indices=[];
  const top=new THREE.Color(topColor),haze=new THREE.Color(baseColor),c=new THREE.Color();
  const heights=[];
  for(let i=0;i<N;i++) {
    const a=i/N*Math.PI*2,x=Math.cos(a),z=Math.sin(a);
    const broad=noise.fbm(x*freq+3.7,z*freq-1.9,4,2,.43);
    const crag=1-Math.abs(noise.noise(x*freq*2.7-10,z*freq*2.7+13));
    heights.push(base+amp*(.35+broad*.55+crag*.19));
  }
  for(let i=0;i<=N;i++) {
    const a=(i%N)/N*Math.PI*2,x=Math.cos(a),z=Math.sin(a),h=heights[i%N];
    for(let j=0;j<rows;j++) {
      const t=j/(rows-1),gully=noise.noise(x*freq*5+t*.6,z*freq*5+t*.35);
      // Broad foothills rise into a narrow crest; gullies fan down the slope.
      const r=radius-95*Math.pow(1-t,1.3)+gully*8*Math.sin(t*Math.PI);
      const y=-28+(h+28)*Math.pow(t,.9)+gully*amp*.09*Math.sin(t*Math.PI);
      verts.push(x*r,y,z*r);uvs.push(i/N*8+seed*.001,.015+t*.48);
      c.copy(haze).lerp(top,Math.pow(t,.65));cols.push(c.r,c.g,c.b);
      if(i<N&&j<rows-1){const k=i*rows+j;indices.push(k,k+rows,k+1,k+1,k+rows,k+rows+1);}
    }
  }
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));
  geo.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));geo.setIndex(indices);geo.computeVertexNormals();
  const normals=geo.attributes.normal;
  for(let i=0;i<normals.count;i++){
    const light=Math.max(0,normals.getX(i)*SUN_DIR.x+normals.getY(i)*SUN_DIR.y+normals.getZ(i)*SUN_DIR.z);
    const heightMix=(i%rows)/(rows-1),shade=1-heightMix*(.34-light*.34);
    cols[i*3]*=shade;cols[i*3+1]*=shade;cols[i*3+2]*=shade;
  }
  geo.setAttribute('color',new THREE.Float32BufferAttribute(cols,3));
  const material=new THREE.MeshBasicMaterial({map,vertexColors:true,fog:true,side:THREE.DoubleSide});
  // Keep haze at the hidden foot of the ridge so slopes retain their detail.
  material.onBeforeCompile=shader=>{
    shader.uniforms.uRidgeWeather=ridgeWeather;
    shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying float vRidgeHeight;').replace('#include <begin_vertex>','#include <begin_vertex>\nvRidgeHeight=position.y;');
    shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying float vRidgeHeight;\nuniform float uRidgeWeather;').replace('#include <fog_fragment>',`\n#ifdef USE_FOG\ngl_FragColor.rgb=mix(gl_FragColor.rgb,fogColor,uRidgeWeather*(${(0.75+aerial).toFixed(3)}));\ngl_FragColor.rgb=mix(gl_FragColor.rgb,vec3(0.6,0.7,0.8),${aerial.toFixed(3)}*(0.55+0.45*(1.0-smoothstep(0.0,110.0,vRidgeHeight))));\ngl_FragColor.rgb=mix(gl_FragColor.rgb,fogColor,1.0-smoothstep(-12.0,32.0,vRidgeHeight));\n#endif`);
    shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`
      // Reuse forest/ravine detail from First Light without importing its sky.
      vec3 mountainPhoto=texture2D(map,vMapUv).rgb;
      float detail=clamp(dot(mountainPhoto,vec3(.299,.587,.114))*3.4+.45,.50,1.32);
      diffuseColor.rgb*=detail;`);
  };
  material.customProgramCacheKey=()=> 'textured-ridge6-'+aerial.toFixed(3);
  const mesh=new THREE.Mesh(geo,material);mesh.name='distant-ridge';mesh.frustumCulled=false;return mesh;
}

// --- weather ---------------------------------------------------------------
// Each wave rolls its own sky. Values blend over a few seconds so a change
// reads as the weather turning, not a cut. Colours are linear working space.
const V = (x, y, z) => new THREE.Vector3(x, y, z).normalize();
export const WEATHER = {
  clear: {
    zenith: [0.09, 0.31, 0.79], horizon: [0.78, 0.88, 0.97], sunTint: [1.0, 0.9, 0.78],
    sunDir: V(0.55, 0.62, 0.38), sunColor: 0xffe8c4, sun: 2.65, sunVis: 1,
    hemiSky: 0xc1d5e5, hemiGround: 0x777052, hemi: 0.96,
    fog: 0x81938a, fogMul: 1, cirrus: 1, overcast: 0, cloud: [1, 1, 1], cloudAlpha: 1, exposure: 1.14, rain: 0,
  },
  overcast: {
    zenith: [0.36, 0.41, 0.47], horizon: [0.66, 0.7, 0.73], sunTint: [0.9, 0.9, 0.88],
    sunDir: V(0.5, 0.7, 0.4), sunColor: 0xdfe4ea, sun: 1.15, sunVis: 0,
    hemiSky: 0xcad2d8, hemiGround: 0x6d6a58, hemi: 1.3,
    fog: 0x8c9599, fogMul: 0.78, cirrus: 0, overcast: 0.92, cloud: [0.78, 0.8, 0.83], cloudAlpha: 1, exposure: 1.2, rain: 0,
  },
  dusk: {
    zenith: [0.1, 0.16, 0.4], horizon: [1.0, 0.62, 0.38], sunTint: [1.0, 0.62, 0.32],
    sunDir: V(0.78, 0.17, 0.6), sunColor: 0xffa05a, sun: 2.3, sunVis: 1,
    hemiSky: 0x8d90b5, hemiGround: 0x5c4838, hemi: 0.62,
    fog: 0x9a7d6c, fogMul: 0.92, cirrus: 1.3, overcast: 0, cloud: [1.0, 0.72, 0.58], cloudAlpha: 1, exposure: 1.22, rain: 0,
  },
  rain: {
    zenith: [0.27, 0.3, 0.34], horizon: [0.5, 0.53, 0.56], sunTint: [0.8, 0.82, 0.85],
    sunDir: V(0.45, 0.75, 0.35), sunColor: 0xd5dde4, sun: 0.75, sunVis: 0,
    hemiSky: 0xb8c2c8, hemiGround: 0x5c5a4c, hemi: 1.15,
    fog: 0x6f777a, fogMul: 0.56, cirrus: 0, overcast: 1, cloud: [0.55, 0.57, 0.6], cloudAlpha: 1, exposure: 1.26, rain: 1,
  },
  mist: {
    zenith: [0.3, 0.46, 0.68], horizon: [0.88, 0.9, 0.9], sunTint: [1.0, 0.93, 0.8],
    sunDir: V(0.35, 0.32, 0.62), sunColor: 0xfff0d8, sun: 2.0, sunVis: 0.8,
    hemiSky: 0xd4dcdf, hemiGround: 0x76735c, hemi: 1.05,
    fog: 0xc0c8c6, fogMul: 0.42, cirrus: 0.3, overcast: 0, cloud: [1, 1, 1], cloudAlpha: 0.7, exposure: 1.1, rain: 0,
  },
};
const WAVE_SKIES = ['clear', 'clear', 'overcast', 'dusk', 'rain', 'mist', 'clear', 'dusk', 'overcast', 'rain'];
export function weatherForWave(w) {
  if (w <= WAVE_SKIES.length) return WAVE_SKIES[Math.max(0, w - 1)];
  return ['clear', 'overcast', 'dusk', 'mist', 'rain'][(w - WAVE_SKIES.length - 1) % 5];
}

function buildRain(count) {
  const pos = new Float32Array(count * 6);
  const seeds = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    seeds[i * 3] = Math.random() * 70 - 35;
    seeds[i * 3 + 1] = Math.random() * 34;
    seeds[i * 3 + 2] = Math.random() * 70 - 35;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.LineBasicMaterial({ color: 0xb5bfc6, transparent: true, opacity: 0, depthWrite: false });
  const lines = new THREE.LineSegments(geo, mat);
  lines.frustumCulled = false;
  lines.visible = false;
  return { lines, pos, seeds, count, fall: 0 };
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
    uniforms: {
      sunDir: { value: SUN_DIR.clone() }, uTime: { value: 0 },
      uZenith: { value: new THREE.Vector3(0.09, 0.31, 0.79) }, uHorizon: { value: new THREE.Vector3(0.78, 0.88, 0.97) },
      uSunTint: { value: new THREE.Vector3(1.0, 0.9, 0.78) }, uCirrus: { value: 1 }, uOvercast: { value: 0 }, uSunVis: { value: 1 },
    },
    side: THREE.BackSide,
    depthWrite: false,
  });
  const sky = new THREE.Mesh(skyGeo, skyMat);
  sky.frustumCulled = false;
  sky.renderOrder = -10;
  scene.add(sky);

  // the eponymous ridge line: three haze-graded silhouette layers
  const ridgeMap=new THREE.TextureLoader().load('./assets/textures/distant-ridge.webp',texture=>{
    // The horizon occupies a narrow screen band. A 1024px copy saves about
    // 5.5 MiB of resident texture memory while retaining its visible detail.
    const source=texture.image,canvas=document.createElement('canvas');canvas.width=1024;
    canvas.height=Math.round(source.height*1024/source.width);
    canvas.getContext('2d').drawImage(source,0,0,canvas.width,canvas.height);
    texture.image=canvas;texture.needsUpdate=true;
  });
  ridgeMap.colorSpace=THREE.SRGBColorSpace;ridgeMap.wrapS=THREE.MirroredRepeatWrapping;ridgeMap.anisotropy=4;
  const distant = new THREE.Group();
  distant.add(ridgeLayer(645, 36, 125, 0x7690a1, 0x899fa5, 1201, 2.6, ridgeMap, 0.22));
  distant.add(ridgeLayer(565, 22, 96, 0x58777a, 0x768e88, 5807, 3.4, ridgeMap, 0.11));
  distant.add(ridgeLayer(488, 12, 68, 0x496554, 0x607d68, 9103, 4.3, ridgeMap));
  scene.add(distant);

  // clouds
  const texA = cloudTexture(71);
  const texB = cloudTexture(137);
  const texC = cloudTexture(203, true);
  const clouds = new THREE.Group();
  const cloudData = [];
  for (let i = 0; i < 26; i++) {
    const stratus = i % 5 === 4;
    const cMat = new THREE.SpriteMaterial({
      map: stratus ? texC : i % 2 ? texA : texB,
      transparent: true, opacity: 0.58 + Math.random() * 0.2,
      depthWrite: false, fog: false, color: 0xffffff,
    });
    const sp = new THREE.Sprite(cMat);
    const ang = Math.random() * Math.PI * 2;
    const rad = 260 + Math.random() * 440;
    sp.position.set(Math.cos(ang) * rad, 110 + Math.random() * 110, Math.sin(ang) * rad);
    const sc = stratus ? 260 + Math.random() * 220 : 90 + Math.random() * 230;
    sp.scale.set(sc, sc * (stratus ? 0.2 : 0.36 + Math.random() * 0.14), 1);
    // clouds toward the sun catch warmer light; the far side stays cooler
    const toSun = (Math.cos(ang) * SUN_DIR.x + Math.sin(ang) * SUN_DIR.z) / Math.hypot(SUN_DIR.x, SUN_DIR.z);
    cMat.color.setRGB(1, 0.97 + toSun * 0.02, 0.93 + toSun * 0.05);
    const baseColor = cMat.color.clone(), baseOpacity = cMat.opacity;
    clouds.add(sp);
    cloudData.push({ sp, speed: 1.2 + Math.random() * 1.6, baseColor, baseOpacity });
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

  // ---- weather state: `cur` eases toward `target` ----
  const rain = buildRain(1400);
  scene.add(rain.lines);
  const lerpC = (a, b, k) => a.lerp(b, k);
  const mk = (p) => ({
    zenith: new THREE.Vector3(...p.zenith), horizon: new THREE.Vector3(...p.horizon), sunTint: new THREE.Vector3(...p.sunTint),
    sunDir: p.sunDir.clone(), sunColor: new THREE.Color(p.sunColor), sun: p.sun, sunVis: p.sunVis,
    hemiSky: new THREE.Color(p.hemiSky), hemiGround: new THREE.Color(p.hemiGround), hemi: p.hemi,
    fog: new THREE.Color(p.fog), fogMul: p.fogMul, cirrus: p.cirrus, overcast: p.overcast,
    cloud: new THREE.Color(...p.cloud), cloudAlpha: p.cloudAlpha, exposure: p.exposure, rain: p.rain,
  });
  const cur = mk(WEATHER.clear);
  let target = mk(WEATHER.clear), weatherName = 'clear';
  function setWeather(name, instant = false) {
    if (!WEATHER[name]) return;
    weatherName = name;
    target = mk(WEATHER[name]);
    if (instant) Object.assign(cur, mk(WEATHER[name]));
  }
  function stepWeather(dt) {
    const k = 1 - Math.exp(-dt * 0.55); // ~5 s to settle
    for (const key of ['zenith', 'horizon', 'sunTint', 'sunDir']) lerpC(cur[key], target[key], k);
    cur.sunDir.normalize();
    for (const key of ['sunColor', 'hemiSky', 'hemiGround', 'fog', 'cloud']) cur[key].lerp(target[key], k);
    for (const key of ['sun', 'sunVis', 'hemi', 'fogMul', 'cirrus', 'overcast', 'cloudAlpha', 'exposure', 'rain']) {
      cur[key] += (target[key] - cur[key]) * k;
    }
    const u = skyMat.uniforms;
    u.uZenith.value.copy(cur.zenith); u.uHorizon.value.copy(cur.horizon); u.uSunTint.value.copy(cur.sunTint);
    u.uCirrus.value = cur.cirrus; u.uOvercast.value = cur.overcast; u.uSunVis.value = cur.sunVis;
    u.sunDir.value.copy(cur.sunDir);
    sun.color.copy(cur.sunColor); sun.intensity = cur.sun;
    hemi.color.copy(cur.hemiSky); hemi.groundColor.copy(cur.hemiGround); hemi.intensity = cur.hemi;
    scene.fog?.color.copy(cur.fog);
    ridgeWeather.value = THREE.MathUtils.clamp((1 - cur.fogMul) * 1.45, 0, 0.8);
    for (const c of cloudData) {
      c.sp.material.color.copy(c.baseColor).multiply(cur.cloud);
      c.sp.material.opacity = c.baseOpacity * cur.cloudAlpha * (1 - cur.overcast * 0.6);
    }
  }
  function stepRain(dt, focus) {
    const amt = cur.rain;
    rain.lines.visible = amt > 0.02;
    if (!rain.lines.visible) return;
    rain.lines.material.opacity = 0.32 * amt;
    rain.fall += dt;
    const { pos, seeds, count } = rain;
    const drop = 24, len = 0.85, windX = 3.2;
    for (let i = 0; i < count; i++) {
      // each streak falls through a 34 m column that wraps around the camera
      let y = seeds[i * 3 + 1] - rain.fall * drop;
      y = ((y % 34) + 34) % 34;
      const x = focus.x + (((seeds[i * 3] + 35 + windX * rain.fall * 0.25) % 70) + 70) % 70 - 35;
      const z = focus.z + seeds[i * 3 + 2];
      const by = focus.y - 12 + y;
      pos[i * 6] = x; pos[i * 6 + 1] = by; pos[i * 6 + 2] = z;
      pos[i * 6 + 3] = x - windX * 0.035; pos[i * 6 + 4] = by + len; pos[i * 6 + 5] = z;
    }
    rain.lines.geometry.attributes.position.needsUpdate = true;
    // only render as much of the curtain as the storm calls for
    rain.lines.geometry.setDrawRange(0, Math.floor(count * 2 * Math.min(1, amt)));
  }

  function update(dt, focus) {
    skyMat.uniforms.uTime.value += dt;
    stepWeather(dt);
    stepRain(dt, focus);
    // keep sky + backdrop + shadow frustum centred on the player
    sky.position.copy(focus);
    distant.position.set(focus.x, 0, focus.z);
    sun.position.copy(focus).addScaledVector(cur.sunDir, 180);
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

  return {
    sky, sun, hemi, distant, update, setWeather,
    get weather() { return cur; }, get weatherName() { return weatherName; },
  };
}
