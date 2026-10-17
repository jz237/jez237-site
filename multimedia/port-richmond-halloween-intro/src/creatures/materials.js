// Runtime materials for the infected: baked skin atlases under a dead-flesh shader (bind-space pores / fine wrinkles /
// livor / venous marbling, per-vertex curvature for crease darkening and thin-area scatter, wet / dry / blood
// roughness), cloudy dead eyes with ONE catchlight, stained teeth, wet mouth tissue, garments with folds, weave, dirt,
// rain and blood. Deterministic: canvas textures come from seeded noise, shader noise is a function of the bind-pose
// position (rest space), so the detail sticks to the skin through every pose.
import * as THREE from 'three';

function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

// Per-actor look (uniforms only, so every actor shares the same programs).
//  wet: rain on the skin (streaks), mottle: livor / marbling, scatter: dead-flesh wrap tint,
//  cloth: { tint, dirt, wet, blood (front soak from the jaw), fold (bump scale), weave (period m) }
const LOOK = {
  default: { wet: 0.6, mottle: 0.9, cloth: { tint: [1, 1, 1], dirt: 0.6, wet: 0.5, blood: 0, fold: 1.0, weave: 0.0011 } },
  homeowner: { wet: 0.3, mottle: 1.0, cloth: { tint: [0.74, 0.70, 0.66], dirt: 0.85, wet: 0.25, blood: 1, fold: 1.4, weave: 0.0016, quilt: [0.042, 0.0028, 0.005, 1] } },
  facepaint: { wet: 0.95, mottle: 0.7, paint: 1, cloth: { tint: [1, 1, 1], dirt: 0.5, wet: 0.85, blood: 0, fold: 1.0, weave: 0.0009 } },
  wreck: { wet: 0.7, mottle: 1.0, cloth: { tint: [0.92, 0.88, 0.84], dirt: 0.95, wet: 0.6, blood: 0, fold: 1.1, weave: 0.0013, seam: 1 } },
  scarecrow: { wet: 0.7, mottle: 0.9, cloth: { tint: [1, 1, 1], dirt: 0.5, wet: 0.6, blood: 0, fold: 1.0, weave: 0.0012 } },
  screamer: { wet: 0.8, mottle: 1.0, cloth: { tint: [1, 1, 1], dirt: 0.5, wet: 0.6, blood: 0, fold: 1.2, weave: 0.001 } },
};
const look = (actor) => LOOK[actor] || LOOK.default;

// ---------------------------------------------------------------------------------------------------------------
// shared GLSL: hash, value noise (rest space), derivative bump (h in metres: physically scaled, no bump map needed)
const NOISE = `
float crH( vec3 p ) { p = fract( p * vec3( 0.1031, 0.1030, 0.0973 ) ); p += dot( p, p.yxz + 33.33 ); return fract( ( p.x + p.y ) * p.z ); }
float crN( vec3 p ) {
  vec3 i = floor( p ); vec3 f = fract( p ); f = f * f * ( 3.0 - 2.0 * f );
  return mix( mix( mix( crH( i ), crH( i + vec3( 1, 0, 0 ) ), f.x ), mix( crH( i + vec3( 0, 1, 0 ) ), crH( i + vec3( 1, 1, 0 ) ), f.x ), f.y ),
              mix( mix( crH( i + vec3( 0, 0, 1 ) ), crH( i + vec3( 1, 0, 1 ) ), f.x ), mix( crH( i + vec3( 0, 1, 1 ) ), crH( i + vec3( 1, 1, 1 ) ), f.x ), f.y ), f.z );
}
vec3 crBump( vec3 sp, vec3 sn, float h, float fd ) {
  vec3 sx = dFdx( sp ), sy = dFdy( sp );
  vec3 r1 = cross( sy, sn ), r2 = cross( sn, sx );
  float det = dot( sx, r1 ) * fd;
  vec3 g = sign( det ) * ( dFdx( h ) * r1 + dFdy( h ) * r2 );
  return normalize( abs( det ) * sn - g );
}`;

const REST_VERT = (extra = '') => (sh) => {
  sh.vertexShader = sh.vertexShader
    .replace('#include <common>', `#include <common>\nvarying vec3 vRest;${extra.includes('N') ? '\nvarying vec3 vRestN;' : ''}${extra.includes('C') ? '\nattribute float aCurv;\nvarying float vCurv;' : ''}`)
    .replace('#include <begin_vertex>', `#include <begin_vertex>\nvRest = position;${extra.includes('N') ? '\nvRestN = normal;' : ''}${extra.includes('C') ? '\nvCurv = aCurv;' : ''}`);
};

// ---------------------------------------------------------------------------------------------------------------
// Per-vertex mean curvature of the rest pose (1/m; convex > 0), welded across UV seams, smoothed twice.
// Skin uses it for crease (cavity) darkening and for thin-area scatter (ears, nose, lips, fingers).
function addCurvature(geo) {
  if (!geo || geo.attributes.aCurv) return 0;
  const t0 = performance.now();
  const pos = geo.attributes.position, nrm = geo.attributes.normal;
  const n = pos.count;
  const out = new Float32Array(n);
  if (!nrm || !geo.index) { geo.setAttribute('aCurv', new THREE.BufferAttribute(out, 1)); return 0; }
  // plain xyz float arrays (Draco gives non-interleaved Float32 attributes; anything else is copied once)
  const xyz = (a) => {
    if (!a.isInterleavedBufferAttribute && a.itemSize === 3 && !a.normalized && a.array instanceof Float32Array) return a.array;
    const f = new Float32Array(a.count * 3);
    for (let i = 0; i < a.count; i++) { f[i * 3] = a.getX(i); f[i * 3 + 1] = a.getY(i); f[i * 3 + 2] = a.getZ(i); }
    return f;
  };
  const PA = xyz(pos), NA = xyz(nrm);
  const wid = new Int32Array(n), map = new Map();
  let W = 0;
  for (let i = 0; i < n; i++) {
    const k = ((Math.round(PA[i * 3] * 2e4) + 40000) * 80001 + (Math.round(PA[i * 3 + 1] * 2e4) + 40000)) * 80001 + (Math.round(PA[i * 3 + 2] * 2e4) + 40000);
    let w = map.get(k);
    if (w === undefined) { w = W++; map.set(k, w); }
    wid[i] = w;
  }
  const P = new Float32Array(W * 3), N = new Float32Array(W * 3);
  for (let i = 0; i < n; i++) {
    const w = wid[i] * 3, j = i * 3;
    P[w] = PA[j]; P[w + 1] = PA[j + 1]; P[w + 2] = PA[j + 2];
    N[w] += NA[j]; N[w + 1] += NA[j + 1]; N[w + 2] += NA[j + 2];
  }
  for (let w = 0; w < W; w++) { const l = Math.hypot(N[w * 3], N[w * 3 + 1], N[w * 3 + 2]) || 1; N[w * 3] /= l; N[w * 3 + 1] /= l; N[w * 3 + 2] /= l; }
  const idx = geo.index.array;
  const E = new Int32Array(idx.length * 2);
  let ne = 0;
  const K = new Float32Array(W), C = new Float32Array(W);
  for (let t = 0; t + 2 < idx.length; t += 3) {
    for (let e = 0; e < 3; e++) {
      const a = wid[idx[t + e]], b = wid[idx[t + (e + 1) % 3]];
      if (a === b) continue;
      const dx = P[a * 3] - P[b * 3], dy = P[a * 3 + 1] - P[b * 3 + 1], dz = P[a * 3 + 2] - P[b * 3 + 2];
      const d2 = dx * dx + dy * dy + dz * dz;
      if (d2 < 1e-12) continue;
      const k = ((N[a * 3] - N[b * 3]) * dx + (N[a * 3 + 1] - N[b * 3 + 1]) * dy + (N[a * 3 + 2] - N[b * 3 + 2]) * dz) / d2;
      K[a] += k; C[a]++; K[b] += k; C[b]++;
      E[ne++] = a; E[ne++] = b;
    }
  }
  for (let w = 0; w < W; w++) if (C[w]) K[w] /= C[w];
  const S = new Float32Array(W);
  for (let pass = 0; pass < 2; pass++) {
    S.fill(0);
    for (let e = 0; e < ne; e += 2) { S[E[e]] += K[E[e + 1]]; S[E[e + 1]] += K[E[e]]; }
    for (let w = 0; w < W; w++) if (C[w]) K[w] = 0.4 * K[w] + 0.6 * S[w] / C[w];
  }
  for (let i = 0; i < n; i++) out[i] = K[wid[i]];
  geo.setAttribute('aCurv', new THREE.BufferAttribute(out, 1));
  return performance.now() - t0;
}

// ---------------------------------------------------------------------------------------------------------------
// SKIN
const SKIN_PARS = `
varying vec3 vRest;
varying float vCurv;
uniform float uWet;
uniform float uMottle;
uniform float uPaint;   // 1 = protect pale greasepaint (facepaint only); pale skin elsewhere gets the full treatment
uniform float uWrap;
uniform vec3 uScatter;
vec3 skDiffN;
float skThin;
float skHand = 0.0;
float skSpecOcc;
${NOISE}`;

const SKIN_COLOR = `
#include <color_fragment>
float skPx = max( length( fwidth( vRest ) ), 1e-6 );
vec3 skA = diffuseColor.rgb;
// the paint pass baked veins as saturated blue loops (read as ink / graffiti): turn blue-dominant albedo into darker,
// desaturated purple-grey marbling
{
  // (painted veins: linear ~0.06/0.07/0.10 on skin ~0.10/0.10/0.09) -> lifted back toward the skin with a faint
  // purple-grey cast: subtle marbling instead of dark ink loops
  float blue = smoothstep( 0.0, 0.025, skA.b - max( skA.r, skA.g ) );
  skA = mix( skA, vec3( dot( skA, vec3( 0.3, 0.59, 0.11 ) ) * 1.22 ) * vec3( 0.96, 0.9, 0.97 ), blue * 0.8 );
}
float skMax = max( skA.r, max( skA.g, skA.b ) );
// baked blood (red-dominant, not bright) and greasepaint / very pale areas keep their painted colour
float skBlood = smoothstep( 0.3, 0.55, ( skA.r - max( skA.g, skA.b ) ) / max( skA.r, 1e-4 ) ) * ( 1.0 - smoothstep( 0.2, 0.4, skMax ) );
float skPale = smoothstep( 0.3, 0.55, dot( skA, vec3( 0.299, 0.587, 0.114 ) ) ) * uPaint;
{
#ifdef CR_LOW
  vec3 t = vec3( 1.0 );  // low tier (phones): no noise lookups; only the cheap, noise-free terms below
  float nb = 0.5;
#else
  // shared octaves (few lookups: this runs on every skin pixel under 29 lights)
  float n1 = crN( vRest * 13.0 ), n2 = crN( vRest * 41.0 + 3.7 ), n3 = crN( vRest * 7.0 + 21.1 ), nb = crN( vRest * 70.0 + 2.0 );
  float livor = smoothstep( 0.46, 0.78, n1 * 0.65 + n2 * 0.35 );
  float decay = smoothstep( 0.5, 0.8, n3 * 0.7 + ( 1.0 - n2 ) * 0.3 );
  vec3 t = mix( vec3( 1.0 ), vec3( 0.7, 0.56, 0.76 ), livor * uMottle );           // purple-grey livor / bruising
  t *= mix( vec3( 1.0 ), vec3( 0.84, 0.93, 0.76 ), decay * uMottle * 0.75 );        // green-grey decay
  // venous marbling: thin branching lines (warped ridged noise) in some regions; skipped once too fine to see
  float vfade = 1.0 - smoothstep( 0.03, 0.09, skPx * 46.0 );
  if ( vfade > 0.0 ) {
    float w0 = crN( vRest * 17.0 );
    float vr = 1.0 - abs( 2.0 * crN( vRest * 46.0 + vec3( w0, 1.0 - w0, w0 * w0 ) * 1.7 ) - 1.0 );
    float veins = smoothstep( 0.88, 0.975, vr ) * smoothstep( 0.45, 0.72, n3 ) * smoothstep( 0.4, 0.7, n2 ) * vfade;
    t *= mix( vec3( 1.0 ), vec3( 0.62, 0.6, 0.64 ), veins * uMottle * 0.75 );
  }
  // blotchy dirt / pigment: fine (1.7 mm, only up close) + mid (14 mm) + big patches
  float fw = 1.0 - smoothstep( 0.25, 0.7, skPx * 600.0 );
  float fine = fw > 0.0 ? crN( vRest * 600.0 ) - 0.5 : 0.0;
  t *= 1.0 + fine * 0.3 * fw + ( nb - 0.5 ) * 0.26;
  t *= 0.7 + 0.55 * smoothstep( 0.25, 0.75, n1 * 0.35 + n2 * 0.25 + nb * 0.4 );
#endif
  // dead extremities: fingertips, ears, nose tip go cyanotic (thin convex parts, from the rest curvature)
  float thin = smoothstep( 30.0, 130.0, vCurv );
  t *= mix( vec3( 1.0 ), vec3( 0.72, 0.62, 0.76 ), thin * 0.55 * uMottle );
  // grime on the hands and feet (rest pose: arms hang beside the thighs, |x| > ~0.21 m; feet below ~0.2 m)
  float hand = smoothstep( 0.2, 0.26, abs( vRest.x ) ) * ( 1.0 - smoothstep( 0.86, 0.96, vRest.y ) ) * smoothstep( 0.5, 0.6, vRest.y );
  float foot = 1.0 - smoothstep( 0.08, 0.22, vRest.y );
  skHand = clamp( hand + foot, 0.0, 1.0 );
#ifdef CR_LOW
  t *= 1.0 - 0.25 * skHand;
#else
  if ( skHand > 0.0 ) {
    float grime = skHand * smoothstep( 0.3, 0.62, crN( vRest * 38.0 + 5.0 ) * 0.7 + nb * 0.3 );
    t *= mix( vec3( 1.0 ), vec3( 0.36, 0.31, 0.26 ), grime * 0.9 );
    // knuckle / finger creases: fine dark lines across the fingers (fingers hang along -y), close range only
    float cfade = 1.0 - smoothstep( 0.0004, 0.0008, skPx );
    if ( cfade > 0.0 ) {
      float cr = 1.0 - abs( 2.0 * crN( vec3( vRest.x * 90.0, vRest.y * 520.0, vRest.z * 90.0 ) + 3.0 ) - 1.0 );
      t *= 1.0 - 0.3 * hand * smoothstep( 0.84, 0.96, cr ) * smoothstep( 0.45, 0.65, n2 ) * cfade;
    }
  }
#endif
  diffuseColor.rgb = mix( skA * t, skA, clamp( skBlood + skPale * 0.55, 0.0, 1.0 ) );
}
// creases darken (concave rest curvature), thin convex parts scatter more
float skCav = smoothstep( -6.0, -45.0, vCurv );
skThin = smoothstep( 30.0, 130.0, vCurv );
diffuseColor.rgb *= 1.0 - 0.55 * skCav;
skSpecOcc = 1.0 - 0.7 * skCav;`;

const SKIN_ROUGH = `
#include <roughnessmap_fragment>
{
  // rain streaks running down (rest space: y up) + oily patches -> wet; everything else drier than the bake
#ifdef CR_LOW
  float wet = 0.0;
#else
  float ws = crN( vec3( vRest.x * 62.0, vRest.y * 5.0, vRest.z * 62.0 ) + 4.0 );
  float wet = clamp( smoothstep( 0.55, 0.8, ws ) * uWet + smoothstep( 0.6, 0.85, crN( vRest * 19.0 + 8.0 ) ) * 0.45, 0.0, 1.0 );
#endif
  roughnessFactor = mix( roughnessFactor, max( roughnessFactor, 0.72 ), 0.65 );
  roughnessFactor = max( roughnessFactor, 0.62 * skHand );   // dead hands / feet: dry, no glossy fingers
  roughnessFactor = mix( roughnessFactor, 0.3, wet );
  diffuseColor.rgb *= 1.0 - 0.14 * wet;
  // blood: fresh = glossy, dried = matte and dark
  if ( skBlood > 0.0 ) {
#ifdef CR_LOW
    float bw = 0.5;
#else
    float bw = smoothstep( 0.4, 0.62, crN( vRest * 52.0 + 1.3 ) );
#endif
    roughnessFactor = mix( roughnessFactor, mix( 0.88, 0.16, bw ), skBlood );
    diffuseColor.rgb *= mix( 1.0, mix( 0.45, 1.0, bw ), skBlood );
  }
}`;

const SKIN_NORMAL = `
#include <normal_fragment_maps>
vec3 skN0 = normal;
#ifdef CR_DETAIL
{
  // pores (~0.9 mm pits), criss-cross fine wrinkles (~1.5 mm), soft lumps (~6 mm); each fades before it aliases
  float pw = 1.0 - smoothstep( 0.3, 0.7, skPx * 1100.0 );
  float ww = 1.0 - smoothstep( 0.3, 0.7, skPx * 420.0 );
  float lw = 1.0 - smoothstep( 0.3, 0.7, skPx * 150.0 );
  float h = 0.0;
  if ( lw > 0.0 ) {
    float pore = pw > 0.0 ? smoothstep( 0.58, 0.9, crN( vRest * 1100.0 ) ) : 0.0;
    float wr = 0.0;
    if ( ww > 0.0 ) {
      float w1 = 1.0 - abs( 2.0 * crN( vRest * vec3( 680.0, 170.0, 680.0 ) + 2.0 ) - 1.0 );
      float w2 = 1.0 - abs( 2.0 * crN( vRest * vec3( 170.0, 680.0, 420.0 ) + 9.0 ) - 1.0 );
      wr = pow( max( w1, w2 ), 5.0 );
    }
    float lump = crN( vRest * 150.0 + 5.0 );
    h = - 0.00004 * pore * pw - 0.000045 * wr * ww + 0.00012 * lump * lw;
  }
  normal = crBump( - vViewPosition, normal, h, faceDirection );
}
#endif
skDiffN = normalize( mix( skN0, normal, 0.3 ) ); // diffuse sees a softened version of the micro relief (skin, not sandpaper)`;

const SKIN_LIGHT = `
#include <lights_physical_pars_fragment>
void RE_Direct_Skin( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
  float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
  reflectedLight.directSpecular += dotNL * directLight.color * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material ) * skSpecOcc;
  // diffuse: wrap (soft terminator) where the extra light is tinted by the dead-flesh scatter colour; thin parts more
  float ndl = dot( skDiffN, directLight.direction );
  float w = uWrap * ( 1.0 + 1.6 * skThin );
  float lam = saturate( ndl );
  float wr = saturate( ( ndl + w ) / ( 1.0 + w ) );
  vec3 sc = max( wr - lam, 0.0 ) * uScatter * ( 1.0 + 0.8 * skThin );
  reflectedLight.directDiffuse += ( lam + sc ) * directLight.color * BRDF_Lambert( material.diffuseContribution );
}
#undef RE_Direct
#define RE_Direct RE_Direct_Skin`;

export function skinMaterial(src, opts = {}) {
  const L = look(opts.actor);
  const m = new THREE.MeshPhysicalMaterial({
    map: src.map || null,
    normalMap: src.normalMap || null,
    roughnessMap: src.roughnessMap || src.metalnessMap || null,
    roughness: 1.0,
    metalness: 0.0,
    specularIntensity: opts.specular ?? 0.5,
    envMapIntensity: opts.env ?? 0.6,
    normalScale: new THREE.Vector2(opts.normalScale ?? 1.0, opts.normalScale ?? 1.0),
  });
  if (src.normalScale) m.normalScale.copy(src.normalScale).multiplyScalar(opts.normalScale ?? 1.0);
  if (opts.tint) m.color.set(opts.tint);
  m.name = 'CreatureSkin';
  const detail = (opts.quality ?? 'high') === 'high'; // micro-normal / fold bump layer: high tier only
  const low = opts.quality === 'low';                   // phones: no noise lookups at all (never heavier than before)
  const U = {
    uWet: { value: L.wet }, uMottle: { value: L.mottle }, uPaint: { value: L.paint ?? 0 }, uWrap: { value: opts.wrap ?? 0.32 },
    uScatter: { value: new THREE.Vector3(0.50, 0.60, 0.62) }, // dead flesh scatters grey-green / violet, not red
  };
  m.userData.crUniforms = U;
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, U);
    REST_VERT('C')(sh);
    sh.fragmentShader = (detail ? '#define CR_DETAIL\n' : '') + (low ? '#define CR_LOW\n' : '') + sh.fragmentShader
      .replace('#include <common>', '#include <common>\n' + SKIN_PARS)
      .replace('#include <lights_physical_pars_fragment>', SKIN_LIGHT)
      .replace('#include <color_fragment>', SKIN_COLOR)
      .replace('#include <roughnessmap_fragment>', SKIN_ROUGH)
      .replace('#include <normal_fragment_maps>', SKIN_NORMAL)
      .replace('#include <lights_fragment_end>', '#include <lights_fragment_end>\nreflectedLight.indirectSpecular *= skSpecOcc;');
  };
  m.customProgramCacheKey = () => 'crSkin' + (detail ? 'D' : '') + (low ? 'L' : '');
  return m;
}

// ---------------------------------------------------------------------------------------------------------------
// EYES: yellowed sclera with burst vessels, milky clouded iris; ONE catchlight from the brightest light reaching the
// eye (not one dot per light), a soft wet reflection of the environment, lid shadow toward the corners.
let _eyeTex = null;
export function eyeTexture(seed = 7) {
  if (_eyeTex) return _eyeTex;
  const N = 512, C = N / 2;
  const c = document.createElement('canvas'); c.width = c.height = N;
  const g = c.getContext('2d');
  const r = rng(seed);
  // sclera (uv radius 0.5 = back of the eyeball; visible part ~0..0.16): yellowed ivory, greyer / darker to the back
  const sg = g.createRadialGradient(C, C, 0, C, C, C);
  sg.addColorStop(0, '#c9c2aa'); sg.addColorStop(0.25, '#bfb395'); sg.addColorStop(0.4, '#ab9c7c'); sg.addColorStop(0.56, '#877357'); sg.addColorStop(1, '#3a2a1e');
  g.fillStyle = sg; g.fillRect(0, 0, N, N);
  // yellow-brown stains
  for (let i = 0; i < 40; i++) {
    const a = r() * Math.PI * 2, rad = N * (0.1 + r() * 0.2);
    const x = C + Math.cos(a) * rad, y = C + Math.sin(a) * rad, s = N * (0.02 + r() * 0.05);
    const hg = g.createRadialGradient(x, y, 0, x, y, s);
    hg.addColorStop(0, `rgba(${150 + r() * 30 | 0},${118 + r() * 20 | 0},${60 + r() * 20 | 0},${0.12 + r() * 0.16})`); hg.addColorStop(1, 'rgba(150,120,60,0)');
    g.fillStyle = hg; g.fillRect(0, 0, N, N);
  }
  // vessels: thin wavy red lines from the corners (left / right) toward the iris, branching once
  const vessel = (x, y, a, len, w, alpha, depth) => {
    g.strokeStyle = `rgba(${120 + r() * 50 | 0},${14 + r() * 18 | 0},${16 + r() * 14 | 0},${alpha})`;
    g.lineWidth = w; g.lineCap = 'round';
    g.beginPath(); g.moveTo(x, y);
    for (let k = 0; k < len; k++) {
      a += (r() - 0.5) * 0.7;
      x += Math.cos(a) * N * 0.008; y += Math.sin(a) * N * 0.008;
      g.lineTo(x, y);
      if (Math.hypot(x - C, y - C) < N * 0.088) break;
      if (depth < 1 && r() < 0.06) { g.stroke(); vessel(x, y, a + (r() < 0.5 ? 0.7 : -0.7), len - k, w * 0.6, alpha * 0.8, depth + 1); g.beginPath(); g.moveTo(x, y); }
    }
    g.stroke();
  };
  for (let i = 0; i < 46; i++) {
    const side = r() < 0.5 ? 0 : Math.PI;
    const a0 = (r() < 0.82 ? side + (r() - 0.5) * 1.3 : r() * Math.PI * 2);
    const rad = N * (0.22 + r() * 0.1);
    vessel(C + Math.cos(a0) * rad, C + Math.sin(a0) * rad, a0 + Math.PI + (r() - 0.5) * 0.5, 10 + (r() * 14 | 0), 0.5 + r() * 1.0, 0.3 + r() * 0.4, 0);
  }
  // burst vessels: a few flat haemorrhage patches near the corners
  for (let i = 0; i < 2; i++) {
    const a = (i ? 0 : Math.PI) + (r() - 0.5) * 0.7, rad = N * (0.13 + r() * 0.05);
    const x = C + Math.cos(a) * rad, y = C + Math.sin(a) * rad, s = N * (0.02 + r() * 0.02);
    const hg = g.createRadialGradient(x, y, 0, x, y, s);
    hg.addColorStop(0, 'rgba(112,16,12,0.5)'); hg.addColorStop(0.6, 'rgba(105,16,12,0.3)'); hg.addColorStop(1, 'rgba(105,16,12,0)');
    g.fillStyle = hg; g.fillRect(0, 0, N, N);
  }
  // iris (radius 0.083 of the uv field): dull grey-green, radial fibres, dark limbal ring, mid-dilated clouded pupil
  const ir = N * 0.078; // a little under anatomical (0.083)
  const ig = g.createRadialGradient(C, C, ir * 0.3, C, C, ir);
  ig.addColorStop(0, '#5f6966'); ig.addColorStop(0.55, '#737d79'); ig.addColorStop(0.85, '#5f6562'); ig.addColorStop(1, '#45433f');
  g.fillStyle = ig; g.beginPath(); g.arc(C, C, ir, 0, Math.PI * 2); g.fill();
  for (let i = 0; i < 120; i++) {
    const a = r() * Math.PI * 2;
    g.strokeStyle = `rgba(${40 + r() * 30 | 0},${44 + r() * 30 | 0},${40 + r() * 25 | 0},${0.15 + r() * 0.3})`; g.lineWidth = 0.6 + r() * 0.8;
    g.beginPath(); g.moveTo(C + Math.cos(a) * ir * 0.38, C + Math.sin(a) * ir * 0.38); g.lineTo(C + Math.cos(a + (r() - 0.5) * 0.2) * ir * 0.95, C + Math.sin(a) * ir * 0.95); g.stroke();
  }
  g.fillStyle = '#1e2120'; g.beginPath(); g.arc(C, C, ir * 0.34, 0, Math.PI * 2); g.fill();
  // milky film (clouded cornea): strong over the pupil / iris, blotchy, fading past the limbus
  const film = g.createRadialGradient(C, C, 0, C, C, ir * 1.3);
  film.addColorStop(0, 'rgba(186,194,192,0.46)'); film.addColorStop(0.7, 'rgba(180,188,186,0.34)'); film.addColorStop(0.9, 'rgba(166,172,168,0.14)'); film.addColorStop(1, 'rgba(160,166,160,0)');
  g.fillStyle = film; g.fillRect(0, 0, N, N);
  for (let i = 0; i < 14; i++) {
    const a = r() * Math.PI * 2, rad = ir * r() * 0.9, x = C + Math.cos(a) * rad, y = C + Math.sin(a) * rad, s = ir * (0.12 + r() * 0.25);
    const hg = g.createRadialGradient(x, y, 0, x, y, s);
    hg.addColorStop(0, `rgba(215,222,216,${0.12 + r() * 0.22})`); hg.addColorStop(1, 'rgba(215,222,216,0)');
    g.fillStyle = hg; g.fillRect(0, 0, N, N);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  _eyeTex = t;
  return t;
}

export function eyeMaterial() {
  const m = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0.62, 0.61, 0.59),
    map: eyeTexture(),
    roughness: 0.16,          // the environment reflection on the wet cornea
    specularIntensity: 1.0,
    envMapIntensity: 0.55,
  });
  m.name = 'CreatureEye';
  const U = { uCatch: { value: 1.0 } };
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, U);
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform float uCatch;\nvec3 eyL = vec3( 0.0, 0.0, 1.0 ); vec3 eyC = vec3( 0.0 ); float eyW = 0.0; float eyLid = 1.0;')
      .replace('#include <lights_physical_pars_fragment>', `#include <lights_physical_pars_fragment>
void RE_Direct_Eye( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
  float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
  reflectedLight.directDiffuse += dotNL * directLight.color * BRDF_Lambert( material.diffuseContribution );
  // the catchlight comes from the key: favour bright lights near the view direction (a lamp behind the head only
  // grazes the eyeball's edge)
  float w = dot( directLight.color, vec3( 0.3, 0.59, 0.11 ) ) * ( 0.15 + dotNL ) * ( 0.1 + 0.9 * pow2( saturate( dot( directLight.direction, geometryViewDir ) ) ) );
  if ( w > eyW ) { eyW = w; eyL = directLight.direction; eyC = directLight.color; }
}
#undef RE_Direct
#define RE_Direct RE_Direct_Eye`)
      .replace('#include <map_fragment>', `#include <map_fragment>
#ifdef USE_MAP
  // lids shade the eyeball toward the corners and under the upper lid: the eye sits in its socket
  vec2 eyD = vMapUv - 0.5;
  eyLid = ( 1.0 - smoothstep( 0.065, 0.12, length( eyD * vec2( 0.85, 1.6 ) ) ) ) * ( 1.0 - 0.6 * smoothstep( -0.03, -0.075, eyD.y ) );
  diffuseColor.rgb *= mix( 0.24, 1.0, eyLid );
#endif`)
      .replace('#include <lights_fragment_end>', `#include <lights_fragment_end>
{
  PhysicalMaterial cm = material;
  cm.roughness = 0.085; cm.specularColorBlended = vec3( 0.04 ); cm.specularF90 = 1.0;
  float ndl = saturate( dot( geometryNormal, eyL ) );
  float front = smoothstep( 0.25, 0.65, dot( eyL, geometryViewDir ) ); // only a light in front of the eye makes the catchlight
  reflectedLight.directSpecular += ndl * eyC * BRDF_GGX( eyL, geometryViewDir, geometryNormal, cm ) * uCatch * front * ( 0.25 + 0.75 * eyLid );
  reflectedLight.indirectSpecular *= 0.35 + 0.65 * eyLid;
}`);
  };
  m.customProgramCacheKey = () => 'crEye';
  return m;
}

export function teethMaterial() {
  const m = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0.115, 0.088, 0.052), roughness: 0.62, clearcoat: 0.25, clearcoatRoughness: 0.35, specularIntensity: 0.4 });
  m.name = 'CreatureTeeth';
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

// ---------------------------------------------------------------------------------------------------------------
// Wet flesh (gums, mouth / throat lining, tongue, torn tissue): one program, the look comes from uniforms.
//  base colour, mottling, depth darkening toward the back (-Z rest), pale fascia / fat streaks, dark clots, a furred
//  coating (tongue) and papillae / fibre relief; wet = low roughness + clearcoat, coated / clotted = rough.
const FLESH_PARS = `
varying vec3 vRest;
uniform vec4 uFl;   // front z, depth (0 = off), fascia amount, clot amount
uniform vec4 uFl2;  // coating amount, papillae amount, fibre amount, wet roughness
${NOISE}`;
function fleshMaterial(name, base, opts = {}) {
  const m = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(...base), roughness: 1.0, clearcoat: opts.coat ?? 0.4, clearcoatRoughness: 0.22,
    specularIntensity: opts.spec ?? 0.45, envMapIntensity: 0.4, side: opts.side ?? THREE.FrontSide,
  });
  m.name = name;
  const U = {
    uFl: { value: new THREE.Vector4(opts.front ?? 0.09, opts.depth ?? 0.0, opts.fascia ?? 0.0, opts.clot ?? 0.3) },
    uFl2: { value: new THREE.Vector4(opts.coatPatch ?? 0.0, opts.papillae ?? 0.0, opts.fibre ?? 0.0, opts.rough ?? 0.35) },
  };
  const low = !!opts.low;
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, U);
    REST_VERT()(sh);
    sh.fragmentShader = (low ? '#define CR_LOW\n' : '') + sh.fragmentShader
      .replace('#include <common>', '#include <common>\n' + FLESH_PARS)
      .replace('#include <color_fragment>', `#include <color_fragment>
float flPx = max( length( fwidth( vRest ) ), 1e-6 );
float fn1 = crN( vRest * 260.0 );
diffuseColor.rgb *= 0.72 + 0.45 * fn1;
#ifdef CR_LOW
float flClot = 0.0;   // low tier: two lookups (mottle + coating), like the pre-pass shader
#else
float fn2 = crN( vRest * 900.0 );
diffuseColor.rgb = mix( diffuseColor.rgb, diffuseColor.rgb * vec3( 0.55, 0.42, 0.45 ), smoothstep( 0.55, 0.85, fn2 ) * 0.5 );
// dark clots
float flClot = smoothstep( 0.55, 0.8, crN( vRest * 120.0 + 3.3 ) ) * uFl.w;
diffuseColor.rgb = mix( diffuseColor.rgb, vec3( 0.03, 0.005, 0.004 ), flClot * 0.8 );
// pale fascia / fat streaks (stretched noise)
float flFas = smoothstep( 0.7, 0.9, crN( vRest * vec3( 90.0, 420.0, 90.0 ) + 1.7 ) ) * uFl.z;
diffuseColor.rgb = mix( diffuseColor.rgb, vec3( 0.3, 0.21, 0.15 ), flFas * 0.6 );
#endif
// furred coating (dead tongue): pale grey-yellow patches
float flCoat = smoothstep( 0.42, 0.72, crN( vRest * 140.0 + 9.0 ) ) * uFl2.x;
diffuseColor.rgb = mix( diffuseColor.rgb, vec3( 0.2, 0.14, 0.14 ), flCoat * 0.6 );
if ( uFl.y > 0.0 ) { float dk = clamp( ( uFl.x - vRest.z ) / uFl.y, 0.0, 1.0 ); diffuseColor.rgb *= mix( 1.0, 0.22, dk * dk ); }`)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
roughnessFactor = mix( uFl2.w, 0.8, clamp( flCoat * 0.9 + flClot * 0.5, 0.0, 1.0 ) );`)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
#ifndef CR_LOW
{
  float pw = 1.0 - smoothstep( 0.3, 0.7, flPx * 1600.0 );
  float fw = 1.0 - smoothstep( 0.3, 0.7, flPx * 700.0 );
  float h = uFl2.y * pw * 0.00006 * smoothstep( 0.4, 0.8, crN( vRest * 1600.0 ) )
          + uFl2.z * fw * 0.00008 * crN( vRest * vec3( 250.0, 900.0, 250.0 ) )
          + 0.0002 * crN( vRest * 160.0 + 2.0 );
  normal = crBump( - vViewPosition, normal, h, faceDirection );
}
#endif`)
      .replace('#include <clearcoat_normal_fragment_begin>', '#include <clearcoat_normal_fragment_begin>\n#ifdef USE_CLEARCOAT\nclearcoatNormal = normalize( mix( clearcoatNormal, normal, 0.5 ) );\n#endif')
      .replace('#include <lights_physical_fragment>', `#include <lights_physical_fragment>
#ifdef USE_CLEARCOAT
material.clearcoat *= 1.0 - clamp( flCoat + flClot * 0.6, 0.0, 1.0 );
#endif`);
  };
  m.customProgramCacheKey = () => 'crFlesh' + (low ? 'L' : '');
  return m;
}

export function gumMaterial(low = false) {
  return fleshMaterial('CreatureGum', [0.11, 0.032, 0.036], { rough: 0.32, coat: 0.5, clot: 0.35, low });
}

export function cavityMaterial(low = false) {
  // mouth / throat lining: dark wet red-brown, black toward the back of the mouth and down the throat
  return fleshMaterial('CreatureCavity', [0.075, 0.016, 0.014], { rough: 0.5, coat: 0.1, spec: 0.35, side: THREE.DoubleSide, front: 0.09, depth: 0.06, clot: 0.3, fibre: 0.5, low });
}

export function tongueMaterial(low = false) {
  // dead tongue: dark red-purple with a furred grey-yellow coating, papillae, wet only at the edges / tip
  return fleshMaterial('CreatureTongue', [0.19, 0.042, 0.036], { rough: 0.58, coat: 0.06, spec: 0.3, coatPatch: 0.5, papillae: 1.6, clot: 0.25, low });
}

// Wet torn tissue strands, saliva / blood strings: raw red muscle with dark clots and pale fascia, glossy where wet
export function tissueMaterial(low = false) {
  return fleshMaterial('CreatureTissue', [0.3, 0.035, 0.025], { rough: 0.24, coat: 0.65, side: THREE.DoubleSide, fascia: 0.3, clot: 0.35, fibre: 1.0, low });
}

// Glass shards embedded in the skin: dark, mostly reflective, slightly see-through, bloody at the base
export function glassMaterial() {
  const m = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0.42, 0.50, 0.47), roughness: 0.08, metalness: 0.0, specularIntensity: 1.0,
    clearcoat: 1.0, clearcoatRoughness: 0.03, envMapIntensity: 2.5, transparent: true, opacity: 0.85,
    side: THREE.DoubleSide, depthWrite: false,
  });
  m.name = 'CreatureGlass';
  return m;
}

// ---------------------------------------------------------------------------------------------------------------
// GARMENTS: baked colour / roughness / normal atlas + runtime detail: hanging folds (rest-space y) and compression
// folds around the sleeves, fabric weave (uv space, period from the mesh's uv scale), grime toward the hems and
// cuffs, rain-darkened patches, and (homeowner) blood soaked down the front from the jaw.
const CLOTH_PARS = `
varying vec3 vRest;
varying vec3 vRestN;
uniform vec3 uCTint;
uniform vec4 uCl;     // dirt, wet, fold amount, weave frequency (cycles per uv unit)
uniform vec4 uCBlood; // chin x, chin y, front z, amount
uniform vec4 uCArm;   // shoulder |x|, arm axis (x, y, z) of the left arm in rest space
uniform vec4 uCSh;    // shoulder joint y, z; sleeve seam amount; roughness floor (fabric never reads as vinyl)
uniform vec4 uCQuilt; // channel pitch (m), puff height (m), stitch dash (m), amount (0 = off)
${NOISE}`;
const CLOTH_COLOR = `
#include <color_fragment>
float clPx = max( length( fwidth( vRest ) ), 1e-6 );
// dingier garments get desaturated with their tint (homeowner: the nightgown's blue print read as veins at the neck)
diffuseColor.rgb = mix( diffuseColor.rgb, vec3( dot( diffuseColor.rgb, vec3( 0.3, 0.59, 0.11 ) ) ), clamp( ( 1.0 - uCTint.x ) * 2.3, 0.0, 0.6 ) ) * uCTint;
// grime: blotchy, heavier toward the hem / cuffs (low rest y, far out along the arms) and in the folds
float clArm = smoothstep( uCArm.x - 0.02, uCArm.x + 0.06, abs( vRest.x ) );
float clLow = 1.0 - smoothstep( 0.25, 0.9, vRest.y );
#ifdef CR_LOW
float clD = 0.5;
#else
float clD = crN( vRest * 9.0 + 1.0 ) * 0.6 + crN( vRest * 31.0 + 4.0 ) * 0.4;
#endif
// (rest pose: the arms hang beside the body, cuffs at ~0.85-1.0 m)
float clDirt = clamp( smoothstep( 0.42, 0.8, clD ) * 0.7 + clLow * 0.5 + clArm * ( 1.0 - smoothstep( 0.95, 1.1, vRest.y ) ) * 0.6, 0.0, 1.0 ) * uCl.x;
diffuseColor.rgb = mix( diffuseColor.rgb, diffuseColor.rgb * vec3( 0.52, 0.45, 0.36 ), clDirt * 0.75 );
// fine fibre / stain speckle (fades with distance)
#ifndef CR_LOW
float clFw = 1.0 - smoothstep( 0.25, 0.7, clPx * 300.0 );
diffuseColor.rgb *= 1.0 + ( clFw > 0.0 ? crN( vRest * 300.0 ) - 0.5 : 0.0 ) * 0.07 * clFw + ( crN( vRest * 70.0 + 8.0 ) - 0.5 ) * 0.18;
#endif
// quilted channels (homeowner robe): horizontal in rest space, slightly wavy; grime collects in the stitched grooves
float clQd = 0.0;
if ( uCQuilt.w > 0.0 ) {
  float q = ( vRest.y + 0.006 * sin( vRest.x * 23.0 + vRest.z * 17.0 ) ) / uCQuilt.x;
  clQd = abs( fract( q ) - 0.5 ) * 2.0;                     // 1 on the stitch line, 0 mid-channel
  float dash = step( 0.45, fract( ( vRest.x + vRest.z ) / uCQuilt.z ) ) * ( 1.0 - smoothstep( 0.0008, 0.0016, clPx ) );
  diffuseColor.rgb *= 1.0 - uCQuilt.w * ( 0.32 * smoothstep( 0.72, 1.0, clQd ) + 0.25 * dash * smoothstep( 0.93, 0.985, clQd ) );
}
// rain: soaked patches (darker, glossier), streaking down
#ifdef CR_LOW
float clWet = 0.0;
#else
float clWs = crN( vec3( vRest.x * 22.0, vRest.y * 3.0, vRest.z * 22.0 ) + 7.0 ) * 0.65 + crN( vRest * 14.0 + 2.0 ) * 0.35;
float clWet = smoothstep( 0.5, 0.75, clWs ) * uCl.y;
#endif
diffuseColor.rgb *= 1.0 - 0.38 * clWet;
// blood soaked down the front from the jaw (homeowner): runs, wicked into the fabric, fresher near the top
float clBlood = 0.0;
if ( uCBlood.w > 0.0 ) {
  float dy = uCBlood.y - vRest.y;                       // distance below the chin
  float spread = 0.06 + dy * 0.22;
  float front = smoothstep( 0.0, 0.35, vRestN.z ) * smoothstep( uCBlood.z - 0.2, uCBlood.z - 0.08, vRest.z );
#ifdef CR_LOW
  float runs = 0.5, edge = 0.5, speck = 0.5;
#else
  float runs = crN( vec3( vRest.x * 48.0, vRest.y * 4.0, vRest.z * 10.0 ) + 3.0 ), edge = crN( vRest * 18.0 ), speck = crN( vRest * 60.0 );
#endif
  float soak = 1.0 - smoothstep( spread * 0.6, spread * ( 1.2 + 0.6 * edge ), abs( vRest.x - uCBlood.x ) );
  float reach = 1.0 - smoothstep( 0.18 + 0.32 * runs, 0.3 + 0.4 * runs, dy );
  clBlood = clamp( soak * reach * front * step( -0.03, dy ), 0.0, 1.0 ) * uCBlood.w;
  clBlood = smoothstep( 0.15, 0.6, clBlood + 0.25 * ( speck - 0.5 ) );
  vec3 bc = mix( vec3( 0.032, 0.006, 0.004 ), vec3( 0.085, 0.011, 0.007 ), smoothstep( 0.25, 0.0, dy ) );
  diffuseColor.rgb = mix( diffuseColor.rgb, bc, clBlood * 0.9 );
}`;
const CLOTH_ROUGH = `
#include <roughnessmap_fragment>
roughnessFactor = mix( roughnessFactor, 0.42, clWet );
roughnessFactor = mix( roughnessFactor, 0.34 + 0.4 * smoothstep( 0.06, 0.35, uCBlood.y - vRest.y ), clBlood );
roughnessFactor = max( roughnessFactor, uCSh.w );`;
const CLOTH_NORMAL = `
#include <normal_fragment_maps>
#ifdef CR_DETAIL
{
  // hanging folds (long along rest y) on the body; on the sleeves compression folds + a stitched seam
  float h = 0.0;
  if ( clArm > 0.0 ) {
    float sx = sign( vRest.x );
    vec3 ax = vec3( sx * uCArm.y, uCArm.z, uCArm.w );
    vec3 rel = vRest - vec3( sx * uCArm.x, uCSh.x, uCSh.y );
    float al = dot( rel, ax );
    vec3 pp = rel - al * ax;
    vec3 e1 = normalize( cross( ax, vec3( 0.0, 0.0, 1.0 ) ) ), e2 = cross( ax, e1 );
    float ang = atan( dot( pp, e2 ), sx * dot( pp, e1 ) );            // around the sleeve, mirrored left / right
    // two ridged layers spiralling opposite ways, broken up along the arm (no even rings)
    float f1 = 1.0 - abs( 2.0 * crN( vec3( al * 19.0 + ang * 0.55, ang * 0.9, 3.0 ) ) - 1.0 );
    float f2 = 1.0 - abs( 2.0 * crN( vec3( al * 13.0 - ang * 0.7, ang * 1.3, 7.0 ) ) - 1.0 );
    float sleeve = max( f1 * smoothstep( 0.3, 0.6, crN( vec3( al * 7.0, ang * 0.8, 11.0 ) ) ), f2 * 0.8 );
    float sd = abs( ang - 2.2 );
    float seam = uCSh.z * ( 1.0 - smoothstep( 0.03, 0.09, sd ) );
    float stitch = uCSh.z * step( 0.5, fract( al / 0.006 ) ) * ( 1.0 - smoothstep( 0.012, 0.03, abs( sd - 0.12 ) ) );
    h += clArm * ( uCl.z * 0.009 * sleeve * sleeve - 0.0015 * seam + 0.0003 * stitch );
  }
  if ( clArm < 1.0 ) {
    float hang = 1.0 - abs( 2.0 * crN( vec3( vRest.x * 24.0, vRest.y * 2.2, vRest.z * 24.0 ) + 11.0 ) - 1.0 );
    h += ( 1.0 - clArm ) * uCl.z * 0.012 * hang * hang;
  }
  h += uCl.z * 0.0025 * crN( vRest * 55.0 + 6.0 );
  h += uCQuilt.w * uCQuilt.y * sqrt( max( 0.0, 1.0 - clQd * clQd ) );
  // weave: plain-weave bumps in uv space (threads over / under), only where a thread spans several pixels
  #if defined( USE_NORMALMAP )
    vec2 wu = vNormalMapUv * uCl.w;
    float ww = 1.0 - smoothstep( 0.12, 0.25, length( fwidth( wu ) ) );
    if ( ww > 0.0 ) {
      float th = 0.75 + 0.5 * crH( vec3( floor( wu.x ), floor( wu.y ), 1.0 ) );
      h += ww * 0.00006 * th * ( sin( wu.x * 6.2832 ) * sin( wu.y * 6.2832 ) );
    }
  #endif
  normal = crBump( - vViewPosition, normal, h, faceDirection );
}
#endif`;

export function clothMaterial(src, opts = {}) {
  const L = look(opts.actor).cloth;
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
  m.name = 'CreatureCloth';
  const detail = (opts.quality ?? 'high') === 'high'; // micro-normal / fold bump layer: high tier only
  const low = opts.quality === 'low';
  const U = {
    uCTint: { value: new THREE.Vector3(...L.tint) },
    uCl: { value: new THREE.Vector4(L.dirt, L.wet, L.fold, (opts.uvScale ?? 1.2) / L.weave) },
    uCBlood: { value: new THREE.Vector4(0, 1.45, 0.1, 0) },
    uCArm: { value: new THREE.Vector4(0.2, 1, 0, 0) },
    uCQuilt: { value: new THREE.Vector4(...(L.quilt || [0.04, 0, 0.005, 0])) },
    uCSh: { value: new THREE.Vector4(1.4, 0, L.seam ?? 1, 0.45) },
  };
  m.userData.crUniforms = U;
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, U);
    REST_VERT('N')(sh);
    sh.fragmentShader = (detail ? '#define CR_DETAIL\n' : '') + (low ? '#define CR_LOW\n' : '') + sh.fragmentShader
      .replace('#include <common>', '#include <common>\n' + CLOTH_PARS)
      .replace('#include <color_fragment>', CLOTH_COLOR)
      .replace('#include <roughnessmap_fragment>', CLOTH_ROUGH)
      .replace('#include <normal_fragment_maps>', CLOTH_NORMAL)
      .replace('#include <lights_physical_fragment>', '#include <lights_physical_fragment>\nmaterial.specularColorBlended *= 1.0 - 0.6 * clBlood;\nmaterial.specularF90 *= 0.5; // dark fabric: no bright Fresnel outline at the silhouette');
  };
  m.customProgramCacheKey = () => 'crCloth' + (detail ? 'D' : '') + (low ? 'L' : '');
  return m;
}

// metres per uv unit of a mesh (sqrt of 3D area / uv area): the weave period is set in metres
function uvScale(geo) {
  const pos = geo.attributes.position, uv = geo.attributes.uv, idx = geo.index;
  if (!pos || !uv || !idx) return 1.2;
  let A = 0, U = 0;
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  const ia = idx.array, step = Math.max(3, Math.floor(ia.length / 3 / 4000) * 3);
  for (let t = 0; t + 2 < ia.length; t += step) {
    const i0 = ia[t], i1 = ia[t + 1], i2 = ia[t + 2];
    a.fromBufferAttribute(pos, i0); b.fromBufferAttribute(pos, i1); c.fromBufferAttribute(pos, i2);
    A += b.sub(a).cross(c.sub(a)).length() * 0.5;
    const u0 = uv.getX(i0), v0 = uv.getY(i0), u1 = uv.getX(i1) - u0, v1 = uv.getY(i1) - v0, u2 = uv.getX(i2) - u0, v2 = uv.getY(i2) - v0;
    U += Math.abs(u1 * v2 - u2 * v1) * 0.5;
  }
  return U > 0 ? Math.sqrt(A / U) : 1.2;
}

// rest-space reference points of a dressed actor: chin (head-weighted vertices of the body), shoulder / arm axis
function restFrame(root, wantChin) {
  let body = null, best = -1;
  root.traverse((o) => { if (o.isSkinnedMesh && /^Body/.test(o.name) && o.geometry.attributes.position.count > best) { best = o.geometry.attributes.position.count; body = o; } });
  const out = { chin: new THREE.Vector3(0, 1.45, 0.1), shoulderX: 0.2, shoulder: new THREE.Vector3(0.2, 1.4, 0), arm: new THREE.Vector3(1, 0, 0) };
  if (!body) return out;
  const sk = body.skeleton;
  const bindPos = (name) => { const i = sk.bones.findIndex((b) => b.name === name); if (i < 0) return null; return new THREE.Vector3().setFromMatrixPosition(new THREE.Matrix4().copy(sk.boneInverses[i]).invert()); };
  // bind matrices are in the skinned mesh's space only when bindMatrix is identity (true for these exports)
  const ua = bindPos('upperarm_l'), la = bindPos('lowerarm_l');
  if (ua && la) { out.shoulderX = Math.abs(ua.x); out.shoulder.copy(ua); out.arm.copy(la).sub(ua).normalize(); if (ua.x < 0) out.arm.x *= -1; }
  const hi = wantChin ? sk.bones.findIndex((b) => b.name === 'head') : -1;
  // the chin: lowest point of the head-weighted skin over every Body part
  const bb = new THREE.Box3(), p = new THREE.Vector3();
  root.traverse((o) => {
    if (!o.isSkinnedMesh || !/^Body/.test(o.name) || hi < 0) return;
    const g = o.geometry, si = g.attributes.skinIndex, sw = g.attributes.skinWeight, pos = g.attributes.position;
    if (!si) return;
    for (let i = 0; i < pos.count; i++) { let w = 0; for (let k = 0; k < 4; k++) if (si.getComponent(i, k) === hi) w += sw.getComponent(i, k); if (w > 0.9) bb.expandByPoint(p.fromBufferAttribute(pos, i)); }
  });
  if (!bb.isEmpty()) out.chin.set((bb.min.x + bb.max.x) / 2, bb.min.y + 0.01, bb.max.z - 0.02);
  return out;
}

// Apply the right material to every mesh of a loaded creature glTF.
//   opts: { actor, quality, normalScale }
export function dressCreature(root, opts = {}) {
  const tDress = performance.now();
  const low = opts.quality === 'low';
  const shared = { eye: eyeMaterial(), teeth: teethMaterial(), gum: gumMaterial(low), cav: cavityMaterial(low), tongue: tongueMaterial(low), tissue: tissueMaterial(low), glass: glassMaterial() };
  const L = look(opts.actor);
  const frame = restFrame(root, !!L.cloth.blood);
  let curvMs = 0;
  root.traverse((o) => {
    if (!o.isMesh) return;
    o.castShadow = true;
    o.receiveShadow = true;
    const n = (o.name + ' ' + (o.parent ? o.parent.name : '')).toLowerCase();
    // shot-specific geometry, hidden until the film enables it (facepaint DroolPuddle: U3 only, head on its right cheek)
    if (o.name.startsWith('DroolPuddle')) o.visible = false;
    if (n.includes('clothes')) {
      o.material = clothMaterial(o.material, { ...opts, uvScale: uvScale(o.geometry) });
      const U = o.material.userData.crUniforms;
      U.uCArm.value.set(frame.shoulderX, frame.arm.x, frame.arm.y, frame.arm.z);
      U.uCSh.value.x = frame.shoulder.y; U.uCSh.value.y = frame.shoulder.z;
      // facepaint's black jersey hood: darker (its rolled hem read as a light outline round the face), matte
      if (/hood/i.test(o.name)) {
        U.uCTint.value.multiplyScalar(0.42); U.uCSh.value.w = 0.76;
        o.material.sheen = 0.25; o.material.sheenRoughness = 0.7; o.material.sheenColor.setRGB(0.22, 0.22, 0.24); // faint cotton fuzz
      }
      if (L.cloth.blood) U.uCBlood.value.set(frame.chin.x, frame.chin.y, frame.chin.z, L.cloth.blood);
    } else if (n.includes('eye')) o.material = shared.eye;
    else if (n.includes('teeth')) o.material = shared.teeth;
    else if (n.includes('gum')) o.material = shared.gum;
    else if (n.includes('cavity') || n.includes('throat')) o.material = shared.cav;
    else if (n.includes('tissue') || n.includes('drool')) o.material = shared.tissue;
    else if (n.includes('glass')) { o.material = shared.glass; o.castShadow = false; o.renderOrder = 2; }
    else if (n.includes('tongue')) o.material = shared.tongue;
    else {
      curvMs += addCurvature(o.geometry);
      if (Array.isArray(o.material)) o.material = o.material.map((m) => skinMaterial(m, opts));
      else o.material = skinMaterial(o.material, opts);
    }
  });
  if (typeof location !== 'undefined' && /[?&]crdebug=1/.test(location.search)) console.log('[creatures]', opts.actor, 'dress ms', (performance.now() - tDress).toFixed(1), 'curvature ms', curvMs.toFixed(1), 'chin', frame.chin.toArray().map((x) => x.toFixed(3)).join(','), 'shoulderX', frame.shoulderX.toFixed(3), 'arm', frame.arm.toArray().map((x) => x.toFixed(2)).join(','));
  return { curvMs };
}
