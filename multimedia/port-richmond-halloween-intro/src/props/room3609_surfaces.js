// Surface ageing for the 3609 front room (INTERIOR graphics pass): one shared shader extension per surface kind,
// computed from the room-local position (the room's static meshes are merged into the room group's frame, so the
// object-space position IS the room-local position). Deterministic: pure functions of position, no time.
//   walls:   0.53 m wallpaper strips (each faded a little differently), hairline seams with a lifted edge, a peeling
//            seam, nicotine/dust darkening toward the ceiling, scuffs and dirt near the floor, darker corners, big
//            tide-marked water stains, the unfaded ghost of a picture that used to hang there, nail holes.
//   ceiling: water stain rings + yellowing around the stairwell and the fixture, darker toward the walls.
//   floor:   dust and dirt along the walls / furniture feet, worn bare traffic lanes.
import * as THREE from 'three';

const NOISE = /* glsl */`
float rhash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float rnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(rhash(i), rhash(i + vec2(1.0, 0.0)), u.x), mix(rhash(i + vec2(0.0, 1.0)), rhash(i + vec2(1.0, 1.0)), u.x), u.y);
}
#ifndef RFBM_OCT
#define RFBM_OCT 4
#endif
float rfbm(vec2 p) { float s = 0.0, a = 0.5, n = 0.0; for (int i = 0; i < RFBM_OCT; i++) { s += a * rnoise(p); n += a; p = p * 2.03 + 17.1; a *= 0.5; } return s / n; }
`;

// common vertex hook: room-local position + normal
function vertexHook(sh) {
  sh.vertexShader = sh.vertexShader
    .replace('#include <common>', '#include <common>\nvarying vec3 vRoomP;\nvarying vec3 vRoomN;')
    .replace('#include <begin_vertex>', '#include <begin_vertex>\nvRoomP = transformed;\nvRoomN = objectNormal;');
}

// ---------------------------------------------------------------------------------------------------- walls
const WALL_FRAG = /* glsl */`
{
  vec3 P = vRoomP; vec3 N = normalize(vRoomN);
  bool sideWall = abs(N.x) > 0.5;
  float along = sideWall ? P.z : P.x;
  float wallId = sideWall ? (N.x > 0.0 ? 1.0 : 2.0) : (N.z > 0.0 ? 3.0 : 4.0);
  vec2 q = vec2(along, P.y) + wallId * 17.3;
  float cornerD = sideWall ? min(abs(P.z - uRoomB.z), abs(P.z - uRoomB.w)) : min(abs(P.x - uRoomB.x), abs(P.x - uRoomB.y));
  // decades of cigarette smoke, cooking and dust: the cream paper has aged to a dim nicotine tan (the lead's call for
  // scare three: ~0.25-0.3 reflectance for the ground, so the room falls off into darkness away from the lamp and the
  // homeowner reads pale against it). uAge multiplies the baked (clean) print.
  vec3 c = diffuseColor.rgb * uAge;
  // strips: 0.53 m rolls hung from a plumb line, each faded a little differently (sun, age, a different dye lot)
  float sa = (along + wallId * 0.21) / 0.53;
  float strip = floor(sa), sx = fract(sa);
  float sh = rhash(vec2(strip, wallId * 3.1));
  c *= 0.93 + 0.1 * sh;
  c.b *= 0.97 + 0.04 * rhash(vec2(strip + 7.0, wallId));
  float seamD = min(sx, 1.0 - sx) * 0.53;
  float seam = 1.0 - smoothstep(0.0005, 0.0016, seamD);
  float lift = (1.0 - smoothstep(0.0016, 0.0045, abs(sx * 0.53 - 0.0025))) * step(0.5, rhash(vec2(strip, 9.0)));
  c *= 1.0 - 0.45 * seam;
  c *= 1.0 + 0.07 * lift;
  // peeling: one seam on the lamp wall lets go under the ceiling (the backing paper shows, the curl casts a line)
  float peel = 0.0, peelEdge = 0.0;
  if (wallId == 1.0) {
    float d = P.z - (-2.86);                         // the seam at z -2.86 (left wall, above/behind the lamp)
    float yy = P.y - 2.26;
    float w = 0.055 * clamp(yy / 0.34, 0.0, 1.0);    // the flap: a narrow wedge widening toward the ceiling
    peel = step(0.0, yy) * step(0.0, d) * step(d, w);
    // the curl's shadow falls on the wall beside the flap
    peelEdge = step(0.0, yy) * (1.0 - smoothstep(0.0, 0.012 + 0.03 * clamp(yy / 0.34, 0.0, 1.0), d - w)) * step(w, d);
  }
  // grime: mottling, nicotine + dust toward the ceiling, scuffs + dirt near the floor, corners
  float m = rfbm(q * 1.6);
  float top = smoothstep(uRoomH - 1.1, uRoomH - 0.02, P.y);
  float bot = 1.0 - smoothstep(0.03, 0.42, P.y);
  float corner = 1.0 - smoothstep(0.0, 0.5, cornerD);
  float grime = 0.14 * m + 0.5 * top * (0.55 + 0.9 * m) + 0.3 * bot * (0.4 + 1.2 * rfbm(q * vec2(7.0, 2.0)))
              + 0.5 * corner * (0.45 + 0.9 * rfbm(q * 3.1));
  // scuffs at furniture / hip height (chair backs, the vacuum): dark horizontal streaks
  float scuff = smoothstep(0.78, 0.92, rnoise(q * vec2(9.0, 70.0))) * (1.0 - smoothstep(0.0, 0.35, abs(P.y - 0.55)));
  grime += 0.25 * scuff;
  // water stains: big tide-marked blobs, more of them high on the wall (old roof / radiator leaks)
  float st = rfbm(q * 0.62 + 3.7) + 0.22 * smoothstep(1.3, 2.6, P.y) - 0.1 * smoothstep(1.2, 0.3, P.y);
  float thr = 0.66;
  float stain = smoothstep(thr, thr + 0.03, st);
  float tide = smoothstep(0.0, 0.012, st - thr) * (1.0 - smoothstep(0.012, 0.04, st - thr));
  float tide2 = smoothstep(0.0, 0.008, st - thr - 0.05) * (1.0 - smoothstep(0.008, 0.02, st - thr - 0.05));
  grime += 0.18 * stain + 0.3 * tide + 0.16 * tide2;
  // ghost of a picture that hung here for decades (unfaded paper) with its nail hole; a few other nail holes
  float ghost = 0.0, holes = 0.0;
  if (wallId == 1.0) {
    vec2 g0 = vec2(-2.97, 1.46), g1 = vec2(-2.62, 1.92);          // (z, y) rectangle on the left wall
    vec2 gp = vec2(P.z, P.y);
    vec2 inside = step(g0, gp) * step(gp, g1);
    ghost = inside.x * inside.y;
    float edge = (1.0 - smoothstep(0.0, 0.006, abs(gp.y - g1.y))) * step(g0.x, gp.x) * step(gp.x, g1.x);
    grime += 0.35 * edge;
    holes += 1.0 - smoothstep(0.0012, 0.0022, length(gp - vec2(-2.795, 1.99)));
    holes += 1.0 - smoothstep(0.001, 0.002, length(gp - vec2(-1.31, 1.83)));
    holes += 1.0 - smoothstep(0.001, 0.002, length(gp - vec2(-4.42, 1.62)));
  } else if (wallId == 2.0) {
    holes += 1.0 - smoothstep(0.001, 0.002, length(vec2(P.z, P.y) - vec2(-2.21, 1.71)));
    holes += 1.0 - smoothstep(0.001, 0.002, length(vec2(P.z, P.y) - vec2(-0.86, 1.95)));
    // round the family photo (centre z -1.42, y 1.52, frame 0.364 x 0.464): a bigger, older frame's unfaded ghost
    // shows 2-3 cm past it, and decades of warm air rising off the frame left a soot shadow above it
    vec2 gp = vec2(P.z, P.y) - vec2(-1.44, 1.545);
    vec2 gq = abs(gp) - vec2(0.205, 0.255);
    ghost = step(max(gq.x, gq.y), 0.0);
    vec2 fp = vec2(P.z, P.y) - vec2(-1.42, 1.52);
    float above = smoothstep(0.232, 0.25, fp.y) * (1.0 - smoothstep(0.25, 0.5, fp.y)) * (1.0 - smoothstep(0.15, 0.2, abs(fp.x)));
    grime += 0.45 * above * (0.6 + 0.6 * rfbm(q * 6.0));
  }
  grime *= 1.0 - 0.75 * ghost;
  c *= 1.0 + 0.16 * ghost;
  vec3 dirt = vec3(0.56, 0.42, 0.22);             // yellow-brown nicotine / dust
  c = mix(c, c * dirt, clamp(grime, 0.0, 0.9));
  c *= 1.0 - 0.8 * clamp(holes, 0.0, 1.0);
  // the backing paper (greyer, chalky) where it peels, and the curl's shadow line
  c = mix(c, vec3(dot(c, vec3(0.33))) * vec3(0.95, 0.92, 0.86) * 1.15 * (0.85 + 0.15 * rnoise(q * 40.0)), peel);
  c *= 1.0 - 0.45 * peelEdge;
  diffuseColor.rgb = c;
}
`;

// ---------------------------------------------------------------------------------------------------- ceiling
const CEIL_FRAG = /* glsl */`
{
  vec3 P = vRoomP;
  vec2 q = P.xz;
  vec3 c = diffuseColor.rgb * vec3(0.8, 0.74, 0.6);        // old flat white gone nicotine-yellow
  float m = rfbm(q * 1.3 + 5.0);
  float dw = min(min(P.x - uRoomB.x, uRoomB.y - P.x), min(uRoomB.z - P.z, P.z - uRoomB.w));
  float edge = 1.0 - smoothstep(0.0, 0.35, dw);
  float grime = 0.12 * m + 0.35 * edge * (0.5 + m);
  // two big water stains with tide rings (a radiator-pipe leak by the front-left window, the bathroom above the stairs)
  float st = 0.0, tide = 0.0;
  for (int i = 0; i < 2; i++) {
    vec2 ctr = i == 0 ? vec2(-2.75, -0.85) : vec2(-2.35, -3.75);
    float rad = i == 0 ? 0.5 : 0.38;
    float d = length((q - ctr) * vec2(1.0, 1.25)) / rad + 0.7 * (rfbm(q * 2.2 + float(i) * 7.0) - 0.5) + 0.25 * (rnoise(q * 9.0) - 0.5);
    st += 1.0 - smoothstep(0.7, 1.0, d);
    float ring = 0.06 + 0.04 * rnoise(q * 5.0);
    tide += 0.8 * exp(-pow((d - 1.0) / ring, 2.0)) + 0.4 * exp(-pow((d - 0.7) / ring, 2.0));
  }
  grime += 0.25 * st + 0.35 * tide;
  vec3 dirt = vec3(0.62, 0.48, 0.28);
  c = mix(c, c * dirt, clamp(grime, 0.0, 0.85));
  diffuseColor.rgb = c;
}
`;

// ---------------------------------------------------------------------------------------------------- floor
const FLOOR_FRAG = /* glsl */`
{
  vec3 P = vRoomP;
  float dw = min(min(P.x - uRoomB.x, uRoomB.y - P.x), min(uRoomB.z - P.z, P.z - uRoomB.w));
  float m = rfbm(P.xz * 2.3 + 11.0);
  rDust = clamp((1.0 - smoothstep(0.0, 0.17, dw)) * (0.5 + 0.7 * m), 0.0, 1.0);
  // traffic lane worn into the finish: front door -> kitchen doorway, and a branch to the sofa / stairs
  vec2 a = vec2(0.0, -0.2), b = vec2(-1.125, -6.5), b2 = vec2(-2.5, -3.4);
  vec2 pa = P.xz - a, ba = b - a, ba2 = b2 - a;
  float d1 = length(pa - ba * clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0));
  float d2 = length(pa - ba2 * clamp(dot(pa, ba2) / dot(ba2, ba2), 0.0, 1.0));
  rLane = (1.0 - smoothstep(0.12, 0.5, min(d1, d2 + 0.12))) * (0.55 + 0.6 * rfbm(P.xz * 4.0));
  vec3 c = diffuseColor.rgb;
  c = mix(c, c * vec3(0.5, 0.45, 0.4), rDust * 0.65);
  c = mix(c, vec3(0.2, 0.18, 0.155), rDust * 0.22);
  c = mix(c, c * 1.15 + vec3(0.012, 0.01, 0.006), clamp(rLane, 0.0, 1.0) * 0.4);
  diffuseColor.rgb = c;
}
`;

// One program for all three surfaces (identical shader source + cache key; uKind picks the branch per material), so
// the room adds a single distinct program for its ageing instead of three.
const SURFACE_FRAG = 'float rDust = 0.0, rLane = 0.0;\nif (uKind < 0.5) ' + WALL_FRAG + 'else if (uKind < 1.5) ' + CEIL_FRAG + 'else ' + FLOOR_FRAG;
// quality 'low' (phones): 1-octave noise instead of 4 (the low tier must not get heavier than the old plain maps)
function surfaceMaterial({ name, map, room, kind, roughness, age = [1, 1, 1], quality = 'high' }) {
  const low = quality === 'low';
  const mat = new THREE.MeshStandardMaterial({ name, map, color: 0xffffff, roughness, side: THREE.FrontSide });
  const uniforms = {
    uRoomB: { value: new THREE.Vector4(room.XL, room.XR, room.FW, room.BW) },
    uRoomH: { value: room.H },
    uAge: { value: new THREE.Vector3(...age) },
    uKind: { value: kind },
  };
  mat.userData.surfaceUniforms = uniforms;
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, uniforms);
    vertexHook(sh);
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vRoomP;\nvarying vec3 vRoomN;\nuniform vec4 uRoomB;\nuniform float uRoomH;\nuniform vec3 uAge;\nuniform float uKind;\n' + (low ? '#define RFBM_OCT 1\n' : '') + NOISE)
      .replace('#include <map_fragment>', '#include <map_fragment>\n' + SURFACE_FRAG)
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = mix(roughnessFactor, 0.85, max(rDust, 0.55 * clamp(rLane, 0.0, 1.0)));');
  };
  mat.customProgramCacheKey = () => (low ? 'room3609_surface_v1_low' : 'room3609_surface_v1');
  return mat;
}

// aged wallpaper: uAge multiplies the clean print (ground ~0.59 -> ~0.26 linear reflectance, shifted yellow-brown);
// live retune: material.userData.surfaceUniforms.uAge
export function wallpaperMaterial({ map, room, name = 'Wallpaper3609', quality }) {
  return surfaceMaterial({ name, map, room, kind: 0, roughness: 0.96, age: [0.5, 0.44, 0.32], quality });   // dead-matte paper (no grazing sheen)
}
export function ceilingMaterial({ map, room, name = 'Ceiling3609', quality }) {
  return surfaceMaterial({ name, map, room, kind: 1, roughness: 0.95, quality });
}
export function floorMaterial({ map, room, name = 'Floor3609', roughness = 0.42, quality }) {
  return surfaceMaterial({ name, map, room, kind: 2, roughness, quality });
}
