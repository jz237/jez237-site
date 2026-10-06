import * as THREE from 'three';
import { SCANS } from './scanlist.js';

// Photographed surfaces and a photographed sky (CC0 scans from Poly Haven and
// ambientCG; credits in assets/scans/CREDITS.md, made by tools/scans.py).
//
// Every scanned map is a texture from the first frame, so the programs are
// compiled with it; until its photo has downloaded and decoded (off the main
// thread) it holds a stand-in: the procedural texture it replaces, or a
// neutral pixel. Then only its pixels change (a new source, one upload), no
// shader is rebuilt. The downloads start with the page and run alongside the
// garden's construction. ?scans=0 keeps the procedural look throughout.

const Q = new URLSearchParams(location.search);
export const SCANS_ON = Q.get('scans') !== '0';
const BITMAPS = Q.get('bitmaps') !== '0'; // (?bitmaps=0: image elements throughout, to compare)

const BASE = new URL('../../assets/scans/', import.meta.url);
const images = new Map(); // key → Promise<HTMLImageElement | null>
const users = new Map(); // key → [Texture]
let size = '1k';

// (the surfaces behind the planting, which the page needs first; the sky,
// 40 KB, ahead, so the light can be baked with it)
function fetchImage(file, priority) {
  const img = new Image();
  img.decoding = 'async';
  img.fetchPriority = priority;
  img.src = new URL(file, BASE).href;
  return img.decode().then(() => img, () => null);
}
// The surfaces come as ImageBitmaps where the browser can make them: their
// pixels are ready to upload (an image element is decoded again when it is
// uploaded: ~15 ms a map on a phone, against ~1.5). Flipped as they are made,
// so they lie as an image element would with three's flipY (apply() sets it).
function fetchBitmap(file, priority) {
  if (typeof createImageBitmap !== 'function' || !BITMAPS) return fetchImage(file, priority);
  return fetch(new URL(file, BASE).href, { priority })
    .then((r) => (r.ok ? r.blob() : Promise.reject(r.status)))
    .then((b) => createImageBitmap(b, { imageOrientation: 'flipY', premultiplyAlpha: 'none', colorSpaceConversion: 'none' }))
    .catch(() => fetchImage(file, priority));
}
function sourceOf(key, img) {
  if (!sources.has(key)) sources.set(key, new THREE.Source(img));
  return sources.get(key);
}

// the size to load (the low tier takes the half-size set), and the sky at
// once; every other scan begins downloading when a material first asks for
// it (so a tier that leaves one out never fetches it)
let started = false;
export function startScans(quality) {
  if (!SCANS_ON || started) return;
  started = true;
  size = quality.tier === 'low' ? '512' : '1k';
  load('sky');
}

function load(key) {
  if (!started || images.has(key) || !(key in SCANS.files)) return images.get(key);
  const files = SCANS.files[key];
  const file = files[size] || files['512'] || files['1k'];
  // (the sky as an image element: it is used at load, and needs no flip)
  const p = (key === 'sky' ? fetchImage(file, 'high') : fetchBitmap(file, 'low')).then((img) => {
    if (img) { sourceOf(key, img); arrive(key, img); }
    return img;
  });
  images.set(key, p);
  return p;
}

// Arrivals: while the page loads, a photo goes straight onto its textures
// (the warm-up frames upload it behind the loading screen); once frames are
// on show, arrivals queue and `scansTick` uploads one per frame, so a burst
// of them never lands in a single frame (on a phone each costs several ms).
let live = false, renderer = null;
const queue = [];
const sources = new Map(); // key → Source (all of a scan's textures share it: one upload)
function arrive(key, img) {
  if (live) queue.push(key);
  else onto(key);
}
function onto(key) {
  const src = sources.get(key);
  for (const t of users.get(key) || []) apply(t, src);
  const first = users.get(key)?.[0];
  if (live && first && renderer) renderer.initTexture(first);
}
export function scansLive(r) { live = true; renderer = r; }
export function scansTick() { if (queue.length) onto(queue.shift()); }

function apply(tex, src) {
  if (!src || tex.userData.scanned) return;
  tex.source = src;
  tex.flipY = !(typeof ImageBitmap !== 'undefined' && src.data instanceof ImageBitmap);
  tex.userData.scanned = true;
  tex.needsUpdate = true;
}

// resolves once every photo has arrived (or failed); `cap` ms at most
export function scansReady(cap = Infinity) {
  if (!images.size) return Promise.resolve(true);
  const all = Promise.all(images.values()).then(() => true);
  return cap === Infinity ? all : Promise.race([all, new Promise((r) => setTimeout(() => r(false), cap))]);
}

export function scanImage(key) {
  return images.get(key) || Promise.resolve(null);
}

export const hasScan = (key) => SCANS_ON && key in SCANS.files;

// a 1×1 stand-in of one colour (0..255)
function pixel(r, g, b) {
  const c = document.createElement('canvas');
  c.width = c.height = 1;
  const ctx = c.getContext('2d');
  ctx.fillStyle = `rgb(${r},${g},${b})`;
  ctx.fillRect(0, 0, 1, 1);
  return c;
}
export const FLAT_NORMAL = [128, 128, 255];

// a texture that will hold the scan `key`: `fallback` is the stand-in (a
// canvas, an existing texture whose image is borrowed, or [r,g,b])
export function scanTexture(key, { srgb = false, repeat = null, fallback = FLAT_NORMAL, anisotropy = 8 } = {}) {
  const stand = Array.isArray(fallback) ? pixel(...fallback) : fallback.isTexture ? fallback.image : fallback;
  const t = new THREE.Texture(stand);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.anisotropy = anisotropy;
  if (repeat) t.repeat.set(repeat[0], repeat[1]);
  t.needsUpdate = true;
  if (!users.has(key)) users.set(key, []);
  users.get(key).push(t);
  // (asked for after its photo arrived and was applied: apply at once)
  load(key);
  if (sources.has(key) && !queue.includes(key)) apply(t, sources.get(key));
  return t;
}

// a scanned surface set as standard-material maps (colour, normal, and the
// packed occlusion/roughness): {} when the scans are off or the set missing
export function scanMaps(set, { fallback = null, normalScale = 1, rough = true } = {}) {
  if (!hasScan(set + '.col')) return {};
  // (a photo wider than tall repeats faster across its height, to keep its proportions)
  const repeat = [1, SCANS.aspect?.[set] || 1];
  const out = { map: scanTexture(set + '.col', { srgb: true, repeat, fallback: fallback || [150, 140, 125] }) };
  if (hasScan(set + '.nrm')) { out.normalMap = scanTexture(set + '.nrm', { repeat }); out.normalScale = new THREE.Vector2(normalScale, normalScale); }
  if (hasScan(set + '.orm')) { const orm = scanTexture(set + '.orm', { repeat, fallback: [255, 200, 0] }); if (rough) out.roughnessMap = orm; out.aoMap = orm; }
  return out;
}

// the tile size (world units one repeat of the photo covers) of a set
export const tileOf = (set) => SCANS.tile[set] || 60;

// Bake planar UVs into a geometry from its vertices' positions under
// `matrix` (world units / `tile`), each face projected along its dominant
// axis, offset by `off` ([u, v]) so neighbouring pieces show different stone.
export function planarUVs(geo, matrix, tile, off = [0, 0], rot = false) {
  const p = geo.attributes.position, n = geo.attributes.normal;
  const uv = new Float32Array(p.count * 2);
  const v = new THREE.Vector3(), nn = new THREE.Vector3();
  const nm = new THREE.Matrix3().getNormalMatrix(matrix);
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i).applyMatrix4(matrix);
    nn.fromBufferAttribute(n, i).applyMatrix3(nm);
    const ax = Math.abs(nn.x), ay = Math.abs(nn.y), az = Math.abs(nn.z);
    let a, b;
    if (ay >= ax && ay >= az) { a = v.x; b = v.z; } else if (ax >= az) { a = v.z; b = v.y; } else { a = v.x; b = v.y; }
    if (rot) [a, b] = [b, -a];
    uv[i * 2] = a / tile + off[0];
    uv[i * 2 + 1] = b / tile + off[1];
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  return geo;
}

// Triplanar scanned detail for surfaces without usable UVs (the vault's iron):
// `.dcol` (colour detail, 0.5 = the material's own colour) and `.nr` (normal
// x/y and roughness detail, 0.5 = unchanged), projected in world space along
// the three axes and blended by the normal. Two textures, six taps.
const TRI_HEAD = /* glsl */ `
uniform sampler2D cgTriCol, cgTriNR;
uniform vec4 cgTriK; // 1/tile, colour, normal, roughness strengths
varying vec3 vTriP;
vec3 cgTriW;
vec4 cgTri( sampler2D s, vec3 p ) {
  return texture2D( s, p.zy ) * cgTriW.x + texture2D( s, p.xz ) * cgTriW.y + texture2D( s, p.xy ) * cgTriW.z;
}
`;

export function scanTriplanar(m, set, { strength = [1, 1, 1] } = {}) {
  if (!hasScan(set + '.dcol')) return m;
  const u = {
    cgTriCol: { value: scanTexture(set + '.dcol', { srgb: true, fallback: [188, 188, 188] }) },
    cgTriNR: { value: scanTexture(set + '.nr', { fallback: [128, 128, 128] }) },
    cgTriK: { value: new THREE.Vector4(1 / tileOf(set), ...strength) },
  };
  m.userData.triplanar = u;
  const prev = Object.prototype.hasOwnProperty.call(m, 'onBeforeCompile') ? m.onBeforeCompile : null;
  m.onBeforeCompile = function (sh, r) {
    if (prev) prev.call(this, sh, r);
    Object.assign(sh.uniforms, u);
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vTriP;')
      .replace('#include <project_vertex>', `#include <project_vertex>
        {
          #ifdef USE_INSTANCING
            vTriP = ( modelMatrix * instanceMatrix * vec4( transformed, 1.0 ) ).xyz;
          #else
            vTriP = ( modelMatrix * vec4( transformed, 1.0 ) ).xyz;
          #endif
        }`);
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\n' + TRI_HEAD)
      .replace('#include <color_fragment>', `#include <color_fragment>
        vec3 cgTriNW = normalize( ( vec4( vNormal, 0.0 ) * viewMatrix ).xyz );
        cgTriW = pow( abs( cgTriNW ), vec3( 4.0 ) );
        cgTriW /= dot( cgTriW, vec3( 1.0 ) );
        vec3 cgTriP = vTriP * cgTriK.x;
        vec4 cgTriC = cgTri( cgTriCol, cgTriP );
        vec4 cgTriR = cgTri( cgTriNR, cgTriP );
        diffuseColor.rgb *= mix( vec3( 1.0 ), cgTriC.rgb * 2.0, cgTriK.y );`)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
        roughnessFactor = clamp( roughnessFactor * mix( 1.0, cgTriR.b * 2.0, cgTriK.w ), 0.06, 1.0 );`)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
        {
          // (the detail as a whole: one slope from the blended taps, laid on
          // the surface along its dominant plane; a rough grain needs no more)
          vec2 d = ( cgTriR.xy * 2.0 - 1.0 ) * cgTriK.z;
          vec3 nW = normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
          vec3 t1 = normalize( abs( nW.y ) < 0.99 ? cross( nW, vec3( 0.0, 1.0, 0.0 ) ) : cross( nW, vec3( 1.0, 0.0, 0.0 ) ) );
          vec3 t2 = cross( nW, t1 );
          nW = normalize( nW + t1 * d.x + t2 * d.y );
          normal = normalize( ( viewMatrix * vec4( nW, 0.0 ) ).xyz );
        }`);
  };
  const key = Object.prototype.hasOwnProperty.call(m, 'customProgramCacheKey') ? m.customProgramCacheKey : null;
  m.customProgramCacheKey = function () { return (key ? key.call(this) : '') + '|tri-' + set; };
  return m;
}
