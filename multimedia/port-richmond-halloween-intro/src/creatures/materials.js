// Runtime materials for the infected: baked skin atlases + light subsurface wrap, cloudy dead eyes,
// stained teeth, wet mouth tissue. Deterministic (canvas textures are drawn from seeded noise).
import * as THREE from 'three';

function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

// Wrap lighting: dead skin is waxy, so only a small, slightly warm wrap on the diffuse term.
function addWrap(material, wrap = 0.18, tint = [0.93, 0.90, 0.90]) {   // dead skin: no warm living scatter
  material.onBeforeCompile = (sh) => {
    sh.uniforms.uWrap = { value: wrap };
    sh.uniforms.uWrapTint = { value: new THREE.Vector3(...tint) };
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform float uWrap;\nuniform vec3 uWrapTint;')
      .replace(
        'reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );',
        'float dotNLw = saturate( ( dot( geometryNormal, directLight.direction ) + uWrap ) / ( 1.0 + uWrap ) );\n\tvec3 irrW = mix( vec3( dotNL ), dotNLw * uWrapTint, 0.65 ) * directLight.color;\n\treflectedLight.directDiffuse += irrW * BRDF_Lambert( material.diffuseContribution );'
      );
  };
  material.customProgramCacheKey = () => 'skinwrap';
}

export function skinMaterial(src, opts = {}) {
  const m = new THREE.MeshPhysicalMaterial({
    map: src.map || null,
    normalMap: src.normalMap || null,
    roughnessMap: src.roughnessMap || src.metalnessMap || null,
    roughness: 1.0,
    metalness: 0.0,
    specularIntensity: opts.specular ?? 0.42,
    envMapIntensity: opts.env ?? 0.7,
    normalScale: new THREE.Vector2(opts.normalScale ?? 1.0, opts.normalScale ?? 1.0),
  });
  if (src.normalScale) m.normalScale.copy(src.normalScale).multiplyScalar(opts.normalScale ?? 1.0);
  if (opts.tint) m.color.set(opts.tint);
  addWrap(m, opts.wrap ?? 0.18);
  return m;
}

// Cloudy, dead eye: milky film over a dull iris, yellowed sclera with burst vessels.
let _eyeTex = null;
export function eyeTexture(seed = 7) {
  if (_eyeTex) return _eyeTex;
  const N = 512;
  const c = document.createElement('canvas'); c.width = c.height = N;
  const g = c.getContext('2d');
  const r = rng(seed);
  // sclera: yellow-grey, darker toward the back
  const sg = g.createRadialGradient(N / 2, N / 2, 0, N / 2, N / 2, N / 2);
  sg.addColorStop(0, '#8e8a80'); sg.addColorStop(0.22, '#887e72'); sg.addColorStop(0.38, '#7a5e54'); sg.addColorStop(0.6, '#5e302a'); sg.addColorStop(1, '#2a1210');
  g.fillStyle = sg; g.fillRect(0, 0, N, N);
  // blood vessels from the edges toward the limbus
  for (let i = 0; i < 160; i++) {
    let a = r() * Math.PI * 2, rad = N * (0.30 + r() * 0.18);
    g.strokeStyle = `rgba(${110 + r() * 50 | 0},${8 + r() * 14 | 0},${10 + r() * 12 | 0},${0.35 + r() * 0.5})`;
    g.lineWidth = 0.6 + r() * 2.2;
    g.beginPath();
    let x = N / 2 + Math.cos(a) * rad, y = N / 2 + Math.sin(a) * rad;
    g.moveTo(x, y);
    for (let k = 0; k < 9; k++) {
      a += (r() - 0.5) * 0.5; rad -= N * (0.012 + r() * 0.012);
      x = N / 2 + Math.cos(a) * rad; y = N / 2 + Math.sin(a) * rad;
      g.lineTo(x, y);
      if (rad < N * 0.1) break;
    }
    g.stroke();
  }
  // a few haemorrhage blotches
  for (let i = 0; i < 9; i++) {
    const a = r() * Math.PI * 2, rad = N * (0.14 + r() * 0.16);
    const x = N / 2 + Math.cos(a) * rad, y = N / 2 + Math.sin(a) * rad;
    const hg = g.createRadialGradient(x, y, 0, x, y, N * (0.02 + r() * 0.04));
    hg.addColorStop(0, 'rgba(110,8,10,0.75)'); hg.addColorStop(1, 'rgba(110,8,10,0)');
    g.fillStyle = hg; g.fillRect(0, 0, N, N);
  }
  // iris (radius ~0.083 of the uv field = 42 px) dull grey-brown, limbal ring, tiny pupil, milky film on top
  const ir = N * 0.083;
  const ig = g.createRadialGradient(N / 2, N / 2, ir * 0.25, N / 2, N / 2, ir);
  ig.addColorStop(0, '#5a6066'); ig.addColorStop(0.7, '#7a8288'); ig.addColorStop(1, '#3a3e42');
  g.fillStyle = ig; g.beginPath(); g.arc(N / 2, N / 2, ir, 0, Math.PI * 2); g.fill();
  for (let i = 0; i < 90; i++) {
    const a = r() * Math.PI * 2;
    g.strokeStyle = `rgba(30,28,24,${0.2 + r() * 0.3})`; g.lineWidth = 1;
    g.beginPath(); g.moveTo(N / 2 + Math.cos(a) * ir * 0.3, N / 2 + Math.sin(a) * ir * 0.3); g.lineTo(N / 2 + Math.cos(a) * ir, N / 2 + Math.sin(a) * ir); g.stroke();
  }
  g.fillStyle = '#1b1a18'; g.beginPath(); g.arc(N / 2, N / 2, ir * 0.22, 0, Math.PI * 2); g.fill();
  const film = g.createRadialGradient(N / 2, N / 2, 0, N / 2, N / 2, ir * 1.35);
  film.addColorStop(0, 'rgba(170,178,176,0.70)'); film.addColorStop(0.6, 'rgba(146,154,152,0.55)'); film.addColorStop(1, 'rgba(120,126,126,0)');
  g.fillStyle = film; g.fillRect(0, 0, N, N);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  _eyeTex = t;
  return t;
}

export function eyeMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0.44, 0.42, 0.40),
    map: eyeTexture(),
    roughness: 0.5,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    specularIntensity: 0.6,
    envMapIntensity: 0.3,
  });
}

export function teethMaterial() {
  const m = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0.115, 0.088, 0.052), roughness: 0.62, clearcoat: 0.25, clearcoatRoughness: 0.35, specularIntensity: 0.4 });
  // gum-line staining by height within each jaw (object space z of the rest pose)
  m.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vRest;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvRest = position;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vRest;\nfloat h31(vec3 p){p=fract(p*0.3183099+0.1);p*=17.0;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}')
      .replace('#include <color_fragment>', `#include <color_fragment>
        float stain = 0.6 * h31(floor(vRest * 900.0)) + 0.4 * h31(floor(vRest * 260.0) + 7.0);
        float dark = smoothstep(0.55, 1.0, stain) * 0.6;
        diffuseColor.rgb *= mix(1.0, 0.3, dark);
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.17, 0.11, 0.06), 0.3);
        // brown-black decay at the gum line (upper teeth: top edge, lower teeth: bottom edge; rest y = Blender z)
        float upper = step(1.5305, vRest.y);
        float gl = upper > 0.5 ? smoothstep(1.539, 1.545, vRest.y) : smoothstep(1.523, 1.517, vRest.y);
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.045, 0.025, 0.015), gl * 0.8);
        // dried blood between the teeth
        float bl = smoothstep(0.75, 0.95, h31(floor(vRest * 300.0) + 3.0));
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.06, 0.012, 0.008), bl * 0.6);`);
  };
  m.customProgramCacheKey = () => 'teeth';
  return m;
}

// Mottled wet flesh: colour noise in rest space (bind-pose position), darkening with depth along -Z (three: the
// mouth's back), so cavities read as a throat going into darkness instead of a glossy ball.
function fleshMaterial(base, opts = {}) {
  const m = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(...base), roughness: opts.rough ?? 0.42, clearcoat: opts.coat ?? 0.45, clearcoatRoughness: 0.28, specularIntensity: 0.5, envMapIntensity: 0.4, side: opts.side ?? THREE.FrontSide });
  const front = (opts.front ?? 0.09).toFixed(4), depth = (opts.depth ?? 0.0).toFixed(4);
  m.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vRest;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvRest = position;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
varying vec3 vRest;
float fh(vec3 p){p=fract(p*0.3183099+0.1);p*=17.0;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float fn(vec3 p){vec3 i=floor(p);vec3 f=fract(p);f=f*f*(3.0-2.0*f);
 return mix(mix(mix(fh(i),fh(i+vec3(1,0,0)),f.x),mix(fh(i+vec3(0,1,0)),fh(i+vec3(1,1,0)),f.x),f.y),
            mix(mix(fh(i+vec3(0,0,1)),fh(i+vec3(1,0,1)),f.x),mix(fh(i+vec3(0,1,1)),fh(i+vec3(1,1,1)),f.x),f.y),f.z);}`)
      .replace('#include <color_fragment>', `#include <color_fragment>
        float n1 = fn(vRest * 260.0), n2 = fn(vRest * 900.0);
        diffuseColor.rgb *= 0.55 + 0.75 * n1;
        diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * vec3(0.55, 0.45, 0.45), smoothstep(0.55, 0.85, n2) * 0.6);
        ${opts.depth ? `float dk = clamp((${front} - vRest.z) / ${depth}, 0.0, 1.0); diffuseColor.rgb *= mix(1.0, 0.22, dk * dk);` : ''}`);
  };
  m.customProgramCacheKey = () => 'flesh' + front + depth + (opts.side ?? 0);
  return m;
}

export function gumMaterial() {
  return fleshMaterial([0.10, 0.028, 0.032], { rough: 0.35, coat: 0.55 });
}

export function cavityMaterial() {
  // mouth / throat lining: dark wet red-brown, black toward the back of the mouth and down the throat
  return fleshMaterial([0.062, 0.013, 0.012], { rough: 0.5, coat: 0.12, side: THREE.DoubleSide, front: 0.09, depth: 0.06 });
}

export function tongueMaterial() {
  // dead tongue: dark purple-grey, dry-ish papillae, a little wet sheen
  return fleshMaterial([0.046, 0.019, 0.030], { rough: 0.62, coat: 0.08 });
}

// Wet torn tissue strands, saliva/blood strings (thin tubes): dark red, glossy
export function tissueMaterial() {
  return new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0.026, 0.008, 0.0065), roughness: 0.5, clearcoat: 0.25, clearcoatRoughness: 0.35, specularIntensity: 0.35, side: THREE.DoubleSide });
}

// Glass shards embedded in the skin: dark, mostly reflective, slightly see-through, bloody at the base
export function glassMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0.42, 0.50, 0.47), roughness: 0.08, metalness: 0.0, specularIntensity: 1.0,
    clearcoat: 1.0, clearcoatRoughness: 0.03, envMapIntensity: 2.5, transparent: true, opacity: 0.85,
    side: THREE.DoubleSide, depthWrite: false,
  });
}

// Garments: baked colour/roughness/normal atlas, rain-soaked fabric (low sheen), double-sided so hems, holes and
// straw ribbons never show see-through backfaces.
export function clothMaterial(src, opts = {}) {
  const m = new THREE.MeshPhysicalMaterial({
    map: src.map || null,
    normalMap: src.normalMap || null,
    roughnessMap: src.roughnessMap || src.metalnessMap || null,
    roughness: 1.0,
    metalness: 0.0,
    specularIntensity: 0.45,          // wet fabric glints where the baked roughness is low (rain-soaked patches)
    sheen: 0.12,                      // a grey sheen veiled the burlap/cotton at grazing angles
    sheenRoughness: 0.8,
    sheenColor: new THREE.Color(0.22, 0.19, 0.15),
    envMapIntensity: opts.env ?? 0.6,
    side: THREE.DoubleSide,
    normalScale: new THREE.Vector2(opts.normalScale ?? 1.0, opts.normalScale ?? 1.0),
  });
  if (src.normalScale) m.normalScale.copy(src.normalScale).multiplyScalar(opts.normalScale ?? 1.0);
  return m;
}

// Apply the right material to every mesh of a loaded creature glTF.
export function dressCreature(root, opts = {}) {
  const shared = { eye: eyeMaterial(), teeth: teethMaterial(), gum: gumMaterial(), cav: cavityMaterial(), tongue: tongueMaterial(), tissue: tissueMaterial(), glass: glassMaterial() };
  root.traverse((o) => {
    if (!o.isMesh) return;
    o.castShadow = true;
    o.receiveShadow = true;
    const n = (o.name + ' ' + (o.parent ? o.parent.name : '')).toLowerCase();
    // shot-specific geometry, hidden until the film enables it (facepaint DroolPuddle: U3 only, head on its right cheek)
    if (o.name.startsWith('DroolPuddle')) o.visible = false;
    if (n.includes('clothes')) o.material = clothMaterial(o.material, opts);
    else if (n.includes('eye')) o.material = shared.eye;
    else if (n.includes('teeth')) o.material = shared.teeth;
    else if (n.includes('gum')) o.material = shared.gum;
    else if (n.includes('cavity') || n.includes('throat')) o.material = shared.cav;
    else if (n.includes('tissue') || n.includes('drool')) o.material = shared.tissue;
    else if (n.includes('glass')) { o.material = shared.glass; o.castShadow = false; o.renderOrder = 2; }
    else if (n.includes('tongue')) o.material = shared.tongue;
    else if (Array.isArray(o.material)) o.material = o.material.map((m) => skinMaterial(m, opts));
    else o.material = skinMaterial(o.material, opts);
  });
}
