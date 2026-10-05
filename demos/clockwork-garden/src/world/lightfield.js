import * as THREE from 'three';
import { L } from './layout.js';
import { SUN_DIR } from './atmosphere.js';

// The light field: every lantern, path lamp, seed lantern, glowing bloom and
// firefly swarm in the house lights the garden around it, in every lit
// material (instanced bee-scale leaves included), without three's per-light
// cost or shader recompiles when lights come and go.
//
// Forward rendering pays for each real light in every fragment of every lit
// material, and a light-count change recompiles every shader, so dozens of
// lanterns can't be real lights. Instead (a clustered-forward light list in
// world space, built on the CPU each frame):
//   · up to 384 light sources live in a small float texture
//     (world position, radius, colour × intensity, soft-core size);
//   · the house floor is cut into 24-unit columns; each column lists the (up
//     to 8, or 4 on `low`) lights whose sphere reaches it, strongest first
//     when crowded, in a second tiny texture;
//   · a patch at the end of the direct-lighting chunk looks up the fragment's
//     column, adds a soft windowed falloff with a little wrap (no hot spots
//     under a lantern, light that wraps round thin leaves) for the diffuse
//     part of each light, and one specular evaluation (three's own BRDF:
//     GGX, clearcoat, sheen) from the irradiance-weighted mean direction, so
//     brass and enamel catch warm highlights at the cost of one light.
// Fragment cost is bounded by the per-column cap, not by how many lanterns are
// lit, and lights never pop: a light fades by its intensity, and the column
// lists are rebuilt every frame from the same sources.
//
// The same patch carries the moonlight's "cookie": the directional key is
// shadowed analytically by the vault's iron (arched ribs every bay, the
// purlins, the side-wall mullions and rails, the stone plinth and the
// columns), traced from each fragment toward the light, so rib shadows lie
// across the whole house at any distance (the real shadow map adds the near
// contact shadows). And it blends the two nearest environment maps of the
// time-of-day ramp, so the hour slides without stepping.
//
// Film safety: the patch is compiled in only while an interactive mode is
// active (the program cache key changes with LF.on, and every patched
// material is re-keyed on a mode switch), so the film keeps its exact shaders.

const H = L.house;
export const LF_CELL = 24;
const GX0 = H.x0 - 48, GZ0 = H.z1 - 48;
const NX = Math.ceil((H.x1 - H.x0 + 96) / LF_CELL);
const NZ = Math.ceil((H.z0 - H.z1 + 96) / LF_CELL);
export const LF_MAX = 384;
const TOL = SUN_DIR.clone().negate(); // toward the light (sun by day, moon by night)
const f = (x) => x.toFixed(5);

export const LF = {
  on: false,
  materials: new Set(),
  u: {
    cgLFGrid: { value: null },
    cgLFData: { value: null },
    cgLFGridP: { value: new THREE.Vector4(GX0, GZ0, 1 / LF_CELL, NX) },
    cgLFK: { value: 1 }, // overall gain (0 switches the field off)
    cgGoboK: { value: new THREE.Vector4(0, 0, 0, 0) }, // strength, -, -, -
    cgEnvB: { value: null },
    cgEnvMix: { value: 0 },
  },
};

// ---- GLSL ---------------------------------------------------------------------------
const HEAD = /* glsl */ `
  uniform highp sampler2D cgLFGrid;
  uniform highp sampler2D cgLFData;
  uniform vec4 cgLFGridP;
  uniform float cgLFK;
  uniform vec4 cgGoboK;
  #define CG_NZ ${NZ}
  #define CG_WRAP 0.3
  // one light of the field: soft window to zero at its radius, a soft core
  // (no hot spot under a lantern), a little wrap round thin leaves
  void cgLFLight( float fi, vec3 P, vec3 N, inout vec3 diff, inout vec3 spC, inout vec3 spD ) {
    if ( fi < 0.0 ) return;
    int i = int( fi );
    vec4 lp = texelFetch( cgLFData, ivec2( i, 0 ), 0 );
    vec3 Lv = lp.xyz - P;
    float d2 = dot( Lv, Lv );
    float r2 = lp.w * lp.w;
    if ( d2 >= r2 ) return;
    vec4 lc = texelFetch( cgLFData, ivec2( i, 1 ), 0 );
    vec3 Ld = Lv * inversesqrt( max( d2, 1e-4 ) );
    float w = 1.0 - d2 / r2;
    float att = w * w / ( 1.0 + d2 * lc.w );
    float ndl = dot( N, Ld );
    vec3 E = lc.rgb * att;
    diff += E * max( ( ndl + CG_WRAP ) / ( 1.0 + CG_WRAP ), 0.0 );
    // (the specular sum: lamps in front of the surface, faded in past its horizon)
    float nl = smoothstep( 0.0, 0.2, ndl );
    spC += E * nl;
    spD += Ld * ( dot( E, vec3( 0.3, 0.59, 0.11 ) ) * nl );
  }
  // the vault's iron between a point and the light (1 = clear)
  float cgArch( float x ) { float k = ( clamp( x, ${f(H.x0)}, ${f(H.x1)} ) - ${f((H.x0 + H.x1) / 2)} ) / ${f((H.x1 - H.x0) / 2)}; return ${f(H.wall)} + ${f(H.ridge - H.wall)} * sqrt( max( 0.0, 1.0 - k * k ) ); }
  float cgBar( float d, float hw, float soft ) { return 1.0 - smoothstep( hw - soft, hw + soft, d ); }
  float cgGobo( vec3 P ) {
    if ( cgGoboK.x <= 0.0 || P.x < ${f(H.x0)} || P.x > ${f(H.x1)} || P.z > ${f(H.z0)} || P.z < ${f(H.z1)} ) return 1.0;
    const vec3 D = vec3( ${f(TOL.x)}, ${f(TOL.y)}, ${f(TOL.z)} );
    float yr = cgArch( P.x );
    if ( P.y >= yr ) return 1.0;
    float s = ( yr - P.y ) / D.y;
    for ( int i = 0; i < 3; i ++ ) s = ( cgArch( P.x + D.x * s ) - P.y ) / D.y;
    vec3 R = P + D * s;
    float soft = 0.4 + s * 0.003;
    float sh = 0.0;
    if ( R.x < ${f(H.x0 + 0.5)} ) {
      // through the side wall: mullions, rails, the stone plinth
      float sw = ( P.x - ${f(H.x0)} ) / -D.x;
      vec3 W = P + D * sw;
      if ( W.y < 68.0 ) return 1.0 - cgGoboK.x;
      float dz = abs( mod( W.z - ${f(H.z0)} + 16.0, 32.0 ) - 16.0 );
      sh = cgBar( dz, 0.75, soft );
      float dy = min( min( abs( W.y - 160.0 ), abs( W.y - 250.0 ) ), abs( W.y - 68.0 ) );
      sh = max( sh, cgBar( dy, 1.2, soft ) );
    } else {
      // through the vault: an arched rib every bay, purlins along the arch
      float dz = abs( mod( R.z - ${f(H.z0)} + 47.5, 95.0 ) - 47.5 );
      sh = cgBar( dz, 4.4, soft );
      float px = ( R.x - ${f(H.x0)} ) / ${f((H.x1 - H.x0) / 22)};
      float dx = abs( fract( px + 0.5 ) - 0.5 ) * ${f((H.x1 - H.x0) / 22)};
      sh = max( sh, cgBar( dx, 1.6, soft ) * 0.9 );
    }
    // the iron columns down the beds
    for ( int c = 0; c < 2; c ++ ) {
      float cx = c == 0 ? -118.0 : 168.0;
      float sc = ( cx - P.x ) / D.x;
      if ( sc > 0.0 && P.y + D.y * sc < 295.0 ) {
        float zc = P.z + D.z * sc;
        float dz = abs( mod( zc - 150.0 + 75.0, 150.0 ) - 75.0 );
        if ( zc < 175.0 && zc > -775.0 ) sh = max( sh, cgBar( dz * ${f(Math.abs(TOL.x) / Math.hypot(TOL.x, TOL.z))}, 3.7, soft ) );
      }
    }
    return 1.0 - sh * cgGoboK.x;
  }
`;

// world position of the fragment, once (the grid, the cookie)
const BEGIN_WP = /* glsl */ `
IncidentLight directLight;
vec3 cgWP = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
`;

const FIELD = /* glsl */ `
#if defined( RE_Direct )
if ( cgLFK > 0.0 ) {
  ivec2 cgC = ivec2( floor( ( cgWP.xz - cgLFGridP.xy ) * cgLFGridP.z ) );
  if ( cgC.x >= 0 && cgC.y >= 0 && cgC.x < int( cgLFGridP.w ) && cgC.y < CG_NZ ) {
    vec3 cgN = ( vec4( geometryNormal, 0.0 ) * viewMatrix ).xyz;
    vec3 cgDiff = vec3( 0.0 ), cgSpC = vec3( 0.0 ), cgSpD = vec3( 0.0 );
    vec4 cgI = texelFetch( cgLFGrid, ivec2( cgC.x * 2, cgC.y ), 0 );
    cgLFLight( cgI.x, cgWP, cgN, cgDiff, cgSpC, cgSpD );
    cgLFLight( cgI.y, cgWP, cgN, cgDiff, cgSpC, cgSpD );
    cgLFLight( cgI.z, cgWP, cgN, cgDiff, cgSpC, cgSpD );
    cgLFLight( cgI.w, cgWP, cgN, cgDiff, cgSpC, cgSpD );
    #if CG_LF_PER > 4
    if ( cgI.w >= 0.0 ) {
      cgI = texelFetch( cgLFGrid, ivec2( cgC.x * 2 + 1, cgC.y ), 0 );
      cgLFLight( cgI.x, cgWP, cgN, cgDiff, cgSpC, cgSpD );
      cgLFLight( cgI.y, cgWP, cgN, cgDiff, cgSpC, cgSpD );
      cgLFLight( cgI.z, cgWP, cgN, cgDiff, cgSpC, cgSpD );
      cgLFLight( cgI.w, cgWP, cgN, cgDiff, cgSpC, cgSpD );
    }
    #endif
    #if defined( STANDARD )
      #define CG_DIFF diffuseContribution
    #else
      #define CG_DIFF diffuseColor
    #endif
    // a soft knee: right beside a lamp the light rolls off instead of burning out
    float cgM = max( cgDiff.r, max( cgDiff.g, cgDiff.b ) );
    if ( cgM > 1.6 ) { float cgK = ( 1.6 + ( cgM - 1.6 ) * 0.3 ) / cgM; cgDiff *= cgK; cgSpC *= cgK; }
    reflectedLight.directDiffuse += cgDiff * cgLFK * BRDF_Lambert( material.CG_DIFF );
    float cgSL = length( cgSpD );
    // (highlights from far lamps are sub-pixel: the specular pass is for the near garden)
    if ( cgSL > 1e-6 && dot( geometryPosition, geometryPosition ) < 30000.0 ) {
      // the specular part, from the irradiance-weighted mean direction of the
      // lamps (diffuse is per lamp, above). Lamps are broad soft sources, so
      // roughness is floored: no pin-point highlights (which would also
      // overflow half floats on mirror-glossy clearcoats)
      vec3 cgLd = ( viewMatrix * vec4( cgSpD / cgSL, 0.0 ) ).xyz;
      #if defined( STANDARD )
        // a lean GGX lobe plus the clearcoat's: F·D/(4·N·V) per unit of irradiance
        // arriving square-on (each lamp's N·L cancels against the BRDF's 1/N·L)
        vec3 cgH = normalize( cgLd + geometryViewDir );
        float cgVH = saturate( dot( geometryViewDir, cgH ) );
        float cgV4 = 0.25 / max( dot( geometryNormal, geometryViewDir ), 0.12 );
        float cgFw = pow( 1.0 - cgVH, 5.0 );
        float cgNH = saturate( dot( geometryNormal, cgH ) );
        float cgA = max( material.roughness, 0.32 ); cgA *= cgA; cgA *= cgA;
        float cgDn = cgNH * cgNH * ( cgA - 1.0 ) + 1.0;
        vec3 cgSp = cgSpC * ( material.specularColor + ( 1.0 - material.specularColor ) * cgFw ) * ( cgA / ( PI * cgDn * cgDn ) * cgV4 );
        #ifdef USE_CLEARCOAT
          float cgNHc = saturate( dot( geometryClearcoatNormal, cgH ) );
          float cgAc = max( material.clearcoatRoughness, 0.3 ); cgAc *= cgAc; cgAc *= cgAc;
          float cgDc = cgNHc * cgNHc * ( cgAc - 1.0 ) + 1.0;
          cgSp += cgSpC * ( ( 0.04 + 0.96 * cgFw ) * cgAc / ( PI * cgDc * cgDc ) * cgV4 * material.clearcoat );
        #endif
        reflectedLight.directSpecular += min( cgSp * cgLFK, vec3( 6.0 ) );
      #else
        // other lighting models: their own BRDF, diffuse already added
        IncidentLight cgL;
        cgL.direction = cgLd;
        cgL.color = cgSpC * cgLFK;
        cgL.visible = true;
        vec3 cgDC = material.CG_DIFF;
        material.CG_DIFF = vec3( 0.0 );
        RE_Direct( cgL, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
        material.CG_DIFF = cgDC;
      #endif
    }
    #undef CG_DIFF
  }
}
#endif
`;

// blend the two nearest maps of the time-of-day environment ramp
const ENV_HEAD = /* glsl */ `
  uniform sampler2D cgEnvB;
  uniform float cgEnvMix;
`;
const ENV_SAMPLE = /* glsl */ `
  vec4 cgEnv( vec3 dir, float rough ) {
    vec4 a = textureCubeUV( envMap, dir, rough );
    if ( cgEnvMix > 0.002 ) a = mix( a, textureCubeUV( cgEnvB, dir, rough ), cgEnvMix );
    return a;
  }
`;

function inject(sh, per) {
  Object.assign(sh.uniforms, LF.u);
  sh.defines = { ...(sh.defines || {}), CG_LF_PER: per };
  let fs = sh.fragmentShader;
  if (!fs.includes('#include <lights_fragment_begin>')) return; // unlit
  const begin = THREE.ShaderChunk.lights_fragment_begin
    .replace('IncidentLight directLight;', BEGIN_WP)
    .replace('getDirectionalLightInfo( directionalLight, directLight );', 'getDirectionalLightInfo( directionalLight, directLight );\n\t\tdirectLight.color *= cgGobo( cgWP );');
  fs = fs
    .replace('#include <common>', '#include <common>\n' + HEAD)
    .replace('#include <lights_fragment_begin>', begin)
    .replace('#include <lights_fragment_end>', FIELD + '\n#include <lights_fragment_end>');
  if (fs.includes('#include <envmap_physical_pars_fragment>')) {
    const env = THREE.ShaderChunk.envmap_physical_pars_fragment;
    const k = env.indexOf('vec3 getIBLIrradiance');
    const patched = env.slice(0, k) + ENV_SAMPLE + env.slice(k).replaceAll('textureCubeUV( envMap, ', 'cgEnv( ');
    fs = fs.replace('#include <envmap_physical_pars_fragment>', ENV_HEAD + patched);
  }
  sh.fragmentShader = fs;
}

const own = (m, k) => (Object.prototype.hasOwnProperty.call(m, k) ? m[k] : null);
const LIT = (m) => m && (m.isMeshStandardMaterial || m.isMeshLambertMaterial || m.isMeshPhongMaterial || m.isMeshToonMaterial);

// Patch a lit material in place: unchanged while LF.on is false (same source,
// same program key), the light field and the cookie while it is true.
export function lightFieldMaterial(m, per = 8) {
  if (!LIT(m) || LF.materials.has(m) || m.userData.noLightField) return m;
  const prev = own(m, 'onBeforeCompile');
  const key = own(m, 'customProgramCacheKey');
  const prevSrc = (prev || m.onBeforeCompile).toString();
  const wrapped = function (sh, r) {
    if (prev) prev.call(this, sh, r);
    if (LF.on) inject(sh, per);
  };
  if (prev?.sway) wrapped.sway = prev.sway; // (wind.js recognises its own patch)
  m.onBeforeCompile = wrapped;
  m.customProgramCacheKey = function () {
    return (key ? key.call(this) : prevSrc) + (LF.on ? '|lf' + per : '');
  };
  LF.materials.add(m);
  return m;
}

// every lit material under these roots (and loose materials)
export function lightFieldAll(roots, extra = [], per = 8) {
  const seen = new Set();
  const add = (m) => { if (m && !seen.has(m)) { seen.add(m); lightFieldMaterial(m, per); } };
  for (const r of roots) r?.traverse?.((o) => { if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(add); });
  extra.forEach(add);
}

// switch the field in or out: every patched material re-keys its program
// (both variants stay cached, so switching is cheap after the first time)
export function setLightField(on) {
  if (LF.on === on) return;
  LF.on = on;
  for (const m of LF.materials) m.needsUpdate = true;
}

// ---- the CPU side: sources, packing, the column lists --------------------------------------------
// A source: { pos: Vector3 (live), radius, core, color: Color (linear, × intensity), k (0..1 fade) }
export class LightField {
  constructor(quality) {
    this.per = quality.tier === 'low' ? 4 : 8;
    this.data = new Float32Array(LF_MAX * 2 * 4);
    this.dataTex = new THREE.DataTexture(this.data, LF_MAX, 2, THREE.RGBAFormat, THREE.FloatType);
    this.grid = new Float32Array(NX * 2 * NZ * 4).fill(-1);
    this.gridTex = new THREE.DataTexture(this.grid, NX * 2, NZ, THREE.RGBAFormat, THREE.FloatType);
    for (const t of [this.dataTex, this.gridTex]) {
      t.magFilter = t.minFilter = THREE.NearestFilter;
      t.generateMipmaps = false;
      t.needsUpdate = true;
    }
    LF.u.cgLFData.value = this.dataTex;
    LF.u.cgLFGrid.value = this.gridTex;
    this.sources = [];
    this._w = new Float32Array(NX * NZ * this.per);
    this._n = new Uint8Array(NX * NZ);
    this.count = 0;
  }

  add(src) { this.sources.push(src); return src; }
  remove(src) { const i = this.sources.indexOf(src); if (i >= 0) this.sources.splice(i, 1); }

  // pack the live sources (strongest near the camera first when over the cap)
  update(camPos) {
    const list = [];
    for (const s of this.sources) {
      const k = s.k ?? 1;
      const lum = (s.color.r * 0.3 + s.color.g * 0.59 + s.color.b * 0.11) * k;
      if (lum < 0.004 || s.radius <= 0) continue;
      s._lum = lum;
      list.push(s);
    }
    if (list.length > LF_MAX) {
      for (const s of list) {
        const d = Math.max(s.radius * 0.5, s.pos.distanceTo(camPos) - s.radius);
        s._imp = (s._lum * s.radius * s.radius) / (d * d);
      }
      list.sort((a, b) => b._imp - a._imp);
      list.length = LF_MAX;
    }
    const D = this.data, per = this.per, W = this._w, N = this._n, G = this.grid;
    N.fill(0);
    G.fill(-1);
    list.forEach((s, i) => {
      const k = s.k ?? 1;
      const o = i * 4, o2 = (LF_MAX + i) * 4;
      D[o] = s.pos.x; D[o + 1] = s.pos.y; D[o + 2] = s.pos.z; D[o + 3] = s.radius;
      D[o2] = s.color.r * k; D[o2 + 1] = s.color.g * k; D[o2 + 2] = s.color.b * k; D[o2 + 3] = 1 / (s.core * s.core);
      // the columns its sphere reaches (strongest first when a column is full)
      const r = s.radius, x = s.pos.x - GX0, z = s.pos.z - GZ0;
      const i0 = Math.max(0, Math.floor((x - r) / LF_CELL)), i1 = Math.min(NX - 1, Math.floor((x + r) / LF_CELL));
      const j0 = Math.max(0, Math.floor((z - r) / LF_CELL)), j1 = Math.min(NZ - 1, Math.floor((z + r) / LF_CELL));
      for (let j = j0; j <= j1; j++) {
        const dz = Math.max(0, Math.abs(z - (j + 0.5) * LF_CELL) - LF_CELL / 2);
        for (let ii = i0; ii <= i1; ii++) {
          const dx = Math.max(0, Math.abs(x - (ii + 0.5) * LF_CELL) - LF_CELL / 2);
          const dd = dx * dx + dz * dz;
          if (dd >= r * r) continue;
          const q = 1 - dd / (r * r);
          const w = s._lum * q * q;
          const c = j * NX + ii, n = N[c];
          const go = (j * NX * 2 + ii * 2) * 4;
          if (n < per) { G[go + n] = i; W[c * per + n] = w; N[c] = n + 1; continue; }
          // full: replace the weakest if this one is stronger
          let mi = 0;
          for (let t = 1; t < per; t++) if (W[c * per + t] < W[c * per + mi]) mi = t;
          if (w > W[c * per + mi]) { G[go + mi] = i; W[c * per + mi] = w; }
        }
      }
    });
    // (unused slots stay -1; a full first half is followed by the second)
    this.count = list.length;
    this.dataTex.needsUpdate = true;
    this.gridTex.needsUpdate = true;
  }
}
