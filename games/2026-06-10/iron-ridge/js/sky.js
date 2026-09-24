// Procedural daytime sky: gradient dome with sun disc, drifting billboard
// clouds (canvas texture), layered distant ridge silhouettes (the "iron
// ridge" backdrop), circling birds, hemisphere + directional sun lighting.

import * as THREE from 'three';
import { Simplex2, makeRng } from './noise.js?v=polish1';

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
  vec3 zenith  = vec3(0.09, 0.31, 0.79);
  vec3 horizon = vec3(0.78, 0.88, 0.97);
  vec3 ground  = vec3(0.62, 0.68, 0.66);
  vec3 col = mix(horizon, zenith, pow(max(h, 0.0), 0.52));
  if (h < 0.0) col = mix(horizon, ground, clamp(-h * 8.0, 0.0, 1.0));

  // warmer, brighter horizon on the sun's side of the sky
  vec2 flatDir = normalize(dir.xz + 1e-4), flatSun = normalize(sunDir.xz);
  float sunSide = dot(flatDir, flatSun) * 0.5 + 0.5;
  float band = exp(-max(h, 0.0) * 9.0);
  col = mix(col, vec3(0.98, 0.9, 0.78), band * sunSide * sunSide * 0.3);
  // thin milky haze hugging the horizon all round
  col = mix(col, vec3(0.86, 0.9, 0.93), exp(-abs(h) * 26.0) * 0.45);

  // high cirrus: stretched streaks, only well above the horizon
  if (h > 0.04) {
    vec2 uv = dir.xz / (h + 0.18) * 1.6;
    uv = vec2(uv.x * 0.55 + uv.y * 0.35, uv.y * 2.4 - uv.x * 0.2) + vec2(uTime * 0.004, 0.0);
    float n = vnoise(uv * 1.3) * 0.6 + vnoise(uv * 3.1) * 0.3 + vnoise(uv * 7.3) * 0.1;
    float wisp = smoothstep(0.6, 0.88, n) * smoothstep(0.04, 0.24, h) * (1.0 - smoothstep(0.55, 0.95, h));
    col = mix(col, vec3(0.97, 0.98, 1.0), wisp * 0.32);
  }

  float sunAmt = max(dot(dir, sunDir), 0.0);
  col += vec3(1.0, 0.94, 0.78) * pow(sunAmt, 900.0) * 0.85;  // disc
  col += vec3(1.0, 0.88, 0.62) * pow(sunAmt, 24.0) * 0.13;   // halo
  col += vec3(1.0, 0.86, 0.66) * pow(sunAmt, 6.0) * 0.07;    // warm scatter
  col += vec3(0.95, 0.92, 0.85) * pow(sunAmt, 3.0) * 0.05;   // broad haze

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
    shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying float vRidgeHeight;').replace('#include <begin_vertex>','#include <begin_vertex>\nvRidgeHeight=position.y;');
    shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying float vRidgeHeight;').replace('#include <fog_fragment>',`\n#ifdef USE_FOG\ngl_FragColor.rgb=mix(gl_FragColor.rgb,vec3(0.6,0.7,0.8),${aerial.toFixed(3)}*(0.55+0.45*(1.0-smoothstep(0.0,110.0,vRidgeHeight))));\ngl_FragColor.rgb=mix(gl_FragColor.rgb,fogColor,1.0-smoothstep(-12.0,32.0,vRidgeHeight));\n#endif`);
    shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`
      // Reuse forest/ravine detail from First Light without importing its sky.
      vec3 mountainPhoto=texture2D(map,vMapUv).rgb;
      float detail=clamp(dot(mountainPhoto,vec3(.299,.587,.114))*3.4+.45,.50,1.32);
      diffuseColor.rgb*=detail;`);
  };
  material.customProgramCacheKey=()=> 'textured-ridge5-'+aerial.toFixed(3);
  const mesh=new THREE.Mesh(geo,material);mesh.name='distant-ridge';mesh.frustumCulled=false;return mesh;
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
    uniforms: { sunDir: { value: SUN_DIR.clone() }, uTime: { value: 0 } },
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
    skyMat.uniforms.uTime.value += dt;
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

  return { sky, sun, hemi, distant, update };
}
