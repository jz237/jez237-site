// The betta bowl's studio (its page only): the bowl stands on a dark lacquered table in front of a
// seamless blue backdrop, lit from above by the lamp in its lid, like a product photograph; or at
// night, the room dark and the lamp in its blue moonlight mode (StudioLight, below). The same WGSL
// draws the backdrop behind the bowl (StudioBackdrop.ts) and what the bowl's glass and water bend and
// reflect (shaders.ts globes_bg, the bowl's variant), so the two always agree.
// World frame: y up, the bowl's centre at the origin when it stands at rest, its glass's foot on
// the table.

/** Where the table's top is (world y: the foot of the bowl's glass), and the backdrop's wall
 *  behind it (world z; the table runs back to it). */
export const STUDIO_TABLE_Y = -1.0;
export const STUDIO_WALL_Z = -3.4;

type Rgb = readonly [number, number, number];

/** The studio's light (linear, HDR), as its WGSL takes it (studio_light): the backdrop's paper (at its
 *  edges, midway, in the glow behind the bowl, and at its foot, lifted by the table's glow; and how dark
 *  it grows towards the top, a share); the room round the set, low and high, and the soft boxes the
 *  glass mirrors (the broad one high on the left, the strip on the right, the one overhead); on the
 *  table, the pool of the lamp's light the bowl spills (and how deeply the water's caustics mottle it,
 *  against by day), the room's dim blue and the line of light along its far edge. And in the bowl,
 *  tints of its light by day: the lamp's (what the photons carry, lightConfig's sunIrradiance, and the
 *  lamp's face), its beam's in the air and the water, the light round about (the room's, and the
 *  lamp's bounced: the ambient and the water's glow) and the key soft box's on the furnishings. And the
 *  grain the backdrop and the table are drawn with (a share of their light, either way), so that
 *  their dark gradients at night do not band in the picture's 8 bits; and the plants' green leaves and
 *  stalks, how bright (a share) and how grey (towards their own luminance), for a green that reflects
 *  little of the moonlight. */
export interface StudioLight {
  wallEdge: Rgb;
  wallMid: Rgb;
  wallCore: Rgb;
  wallFoot: Rgb;
  wallTop: number;
  roomLow: Rgb;
  roomHigh: Rgb;
  softbox: Rgb;
  strip: Rgb;
  top: Rgb;
  pool: Rgb;
  poolMottle: number;
  grain: number;
  leafDim: number;
  leafGrey: number;
  tableRoom: Rgb;
  tableEdge: Rgb;
  lamp: Rgb;
  beam: Rgb;
  ambient: Rgb;
  key: Rgb;
}

/** By day: a product shot, the studio lit, the lamp warm white. */
export const STUDIO_DAY: StudioLight = {
  wallEdge: [0.003, 0.014, 0.04],
  wallMid: [0.014, 0.07, 0.16],
  wallCore: [0.045, 0.17, 0.33],
  wallFoot: [0.03, 0.04, 0.05],
  wallTop: 0.6,
  roomLow: [0.01, 0.026, 0.046],
  roomHigh: [0.02, 0.045, 0.075],
  softbox: [1.0, 0.97, 0.92],
  strip: [0.85, 0.92, 1.0],
  top: [0.9, 0.92, 0.95],
  pool: [1.0, 0.44, 0.09],
  poolMottle: 1,
  grain: 0,
  leafDim: 1,
  leafGrey: 0,
  tableRoom: [0.18, 0.3, 0.42],
  tableEdge: [0.05, 0.08, 0.11],
  lamp: [1, 1, 1],
  beam: [1, 1, 1],
  ambient: [1, 1, 1],
  key: [1, 1, 1],
};

/** By night (Night, app/night.mjs): the room's lights off, the lamp in its soft blue moonlight mode,
 *  much dimmer. The paper deep blue, faintly lit behind the bowl where the lamp's light reaches it,
 *  darker to its edges; the soft boxes a whisper (the glass's outline still shows); the pool on the
 *  table blue, the caustics plain in it; the beams silver-blue, the water dark round them; the plants
 *  a dark teal-green. */
export const STUDIO_NIGHT: StudioLight = {
  wallEdge: [0.0009, 0.003, 0.012],
  wallMid: [0.002, 0.0065, 0.022],
  wallCore: [0.0045, 0.014, 0.042],
  wallFoot: [0.003, 0.006, 0.014],
  wallTop: 0.45,
  roomLow: [0.0012, 0.0025, 0.0055],
  roomHigh: [0.0022, 0.0045, 0.0095],
  softbox: [0.03, 0.034, 0.042],
  strip: [0.026, 0.031, 0.04],
  top: [0.03, 0.034, 0.042],
  pool: [0.05, 0.11, 0.28],
  poolMottle: 2.5,
  grain: 0.12,
  leafDim: 0.62,
  leafGrey: 0.38,
  tableRoom: [0.006, 0.01, 0.02],
  tableEdge: [0.004, 0.007, 0.013],
  lamp: [0.17, 0.23, 0.6],
  beam: [0.4, 0.56, 1.0],
  ambient: [0.02, 0.034, 0.07],
  key: [0.03, 0.036, 0.05],
};

/** The order studio_light takes them in: a colour to each column of its four matrices (its xyz), and
 *  the shares in the first columns' w. */
export const STUDIO_COLOURS = ['wallEdge', 'wallMid', 'wallCore', 'wallFoot', 'roomLow', 'roomHigh', 'softbox', 'strip', 'top', 'pool', 'tableRoom', 'tableEdge', 'lamp', 'beam', 'ambient', 'key'] as const;
export const STUDIO_SHARES = ['wallTop', 'poolMottle', 'grain', 'leafDim', 'leafGrey'] as const;

/** The studio's light `night` of the way from day to night (0..1), into `out` (its four matrices'
 *  elements, column by column, as studio_light takes them). Each goes by the same share of its ratio,
 *  as a dimmer turns a light down, so the picture darkens evenly (the grain, none by day, in step);
 *  by day, exactly STUDIO_DAY. */
export function studioLight(night: number, out: Float32Array): Float32Array {
  const blend = (day: number, dark: number): number => (day > 0 ? day * (dark / day) ** night : dark * night);
  STUDIO_COLOURS.forEach((name, k) => {
    for (let c = 0; c < 3; c++) out[4 * k + c] = blend(STUDIO_DAY[name][c], STUDIO_NIGHT[name][c]);
  });
  STUDIO_SHARES.forEach((name, k) => (out[4 * k + 3] = blend(STUDIO_DAY[name], STUDIO_NIGHT[name])));
  return out;
}

/** A colour's or a share's name in the WGSL: studioWallEdge, ... */
const wgslName = (name: string): string => `studio${name[0].toUpperCase()}${name.slice(1)}`;

/** The studio's light as each entry point takes it (four uniforms: studioLight.ts), to hand on to
 *  studio_light. */
export const STUDIO_LIGHT_PARAMS = ', studioLight0: mat4x4f, studioLight1: mat4x4f, studioLight2: mat4x4f, studioLight3: mat4x4f';
export const STUDIO_LIGHT_ARGS = 'studioLight0, studioLight1, studioLight2, studioLight3';

export const STUDIO_WGSL = /* wgsl */ `
const STUDIO_TABLE_Y: f32 = ${STUDIO_TABLE_Y.toFixed(4)};
const STUDIO_WALL_Z: f32 = ${STUDIO_WALL_Z.toFixed(4)};

// Where the bowl stands (its centre, world): the table's pool of lamp light and its shade under
// the glass follow it.
var<private> studioBowl: vec3f = vec3f(0.0);

// The studio's light (studio.ts StudioLight: by day, by night, or on the way between), set by each
// entry point from its uniforms (studio_light). (Read where literals were: each of these functions is
// copied into every place it is called from, and a name is shorter.)
${STUDIO_COLOURS.map((name) => `var<private> ${wgslName(name)}: vec3f;`).join('\n')}
${STUDIO_SHARES.map((name) => `var<private> ${wgslName(name)}: f32;`).join('\n')}

fn studio_light(a: mat4x4f, b: mat4x4f, c: mat4x4f, d: mat4x4f) {
${STUDIO_COLOURS.map((name, k) => `  ${wgslName(name)} = ${'abcd'[k >> 2]}[${k & 3}].xyz;`).join('\n')}
${STUDIO_SHARES.map((name, k) => `  ${wgslName(name)} = ${'abcd'[k >> 2]}[${k & 3}].w;`).join('\n')}
}

// atan2(y, x), given an angle where both are 0 (straight up; right under the bowl's middle): a GPU
// that follows SPIR-V's rules need not give a number there. (Nor for a smoothstep whose edges run
// the wrong way round: those falling here are 1 - a rising one.)
fn studio_atan2(y: f32, x: f32) -> f32 {
  return atan2(y, select(x, 1e-20, x == 0.0 && y == 0.0));
}

// The backdrop: blue paper, lit brightest behind the bowl a little above it, falling off to the
// sides and darker towards the top.
fn studio_wall(x: vec3f) -> vec3f {
  let q = vec2f((x.x - studioBowl.x * 0.35) / 4.6, (x.y - 0.35) / 2.9);
  let glow = exp(-dot(q, q));
  var c = mix(studioWallEdge, studioWallMid, smoothstep(0.0, 0.55, glow));
  c = mix(c, studioWallCore, smoothstep(0.5, 1.0, glow));
  // (Where the paper sweeps down into the table, the table's own glow lifts it a little.)
  let foot = exp(-max(x.y - STUDIO_TABLE_Y, 0.0) * 3.0);
  c += studioWallFoot * foot * exp(-x.x * x.x / 9.0);
  return c * mix(1.0, studioWallTop, smoothstep(1.2, 4.0, x.y));
}

// A rectangular soft box seen along d: 1 inside it (half-size: its half-width and half-height, in
// radians about), its edges soft; axis: where it is, upright.
fn studio_softbox(d: vec3f, axis: vec3f, half: vec2f) -> f32 {
  let ahead = dot(d, axis);
  if (ahead <= 0.0) { return 0.0; }
  let right = normalize(cross(axis, vec3f(0.0, 1.0, 0.0)));
  let up = cross(right, axis);
  let q = vec2f(dot(d, right), dot(d, up)) / ahead;
  return (1.0 - smoothstep(half.x * 0.45, half.x, abs(q.x))) * (1.0 - smoothstep(half.y * 0.45, half.y, abs(q.y)));
}

// The studio round the set, away from the backdrop: dim blue, with the soft boxes whose
// reflections give the glass its sheen (a broad one high on the left in front, a strip on the
// right, one overhead).
fn studio_room(d: vec3f) -> vec3f {
  var c = mix(studioRoomLow, studioRoomHigh, clamp(d.y * 0.5 + 0.5, 0.0, 1.0));
  c += studioSoftbox * (2.6 * studio_softbox(d, normalize(vec3f(-0.6, 0.7, 0.4)), vec2f(0.12, 0.2)) + 0.08 * pow(max(dot(d, normalize(vec3f(-0.55, 0.62, 0.56))), 0.0), 8.0));
  // (The strip: a narrow band of bearing on the right towards the front, most of the way up.)
  let bearing = studio_atan2(d.x, d.z);
  c += studioStrip * 1.8 * (1.0 - smoothstep(0.035, 0.07, abs(bearing - 1.15))) * (1.0 - smoothstep(0.55, 0.75, abs(d.y - 0.1)));
  let top = max(d.y, 0.0);
  c += studioTop * 0.45 * pow(top, 24.0);
  return c;
}

// Light falling on the table at x: the lamp's light the bowl gathers and spills round its foot (a
// pool, warm by day and blue by night, brightest in a ring just outside the glass, mottled by the
// water's caustics), the
// glass's foot shading the table right under it, and the room's dim blue.
fn studio_tableLight(x: vec3f) -> vec3f {
  let d = x.xz - studioBowl.xz;
  let r = length(d);
  let a = studio_atan2(d.y, d.x);
  let mottle = 0.85 + 0.15 * sin(a * 5.0 + 2.0 * sin(r * 9.0)) * sin(r * 13.0 - a * 3.0);
  let k = (r - 0.6) / 0.26;
  let ring = exp(-k * k);
  let core = exp(-r * r / 0.2);
  let fade = exp(-max(r - 0.9, 0.0) * 2.5);
  var e = studioPool * (30.0 * ring * mix(1.0, mottle, studioPoolMottle) + 16.0 * core) * fade;
  e *= mix(0.4, 1.0, smoothstep(0.02, 0.2, r));
  return e + studioTableRoom;
}

// The table at x: a dark blue-grey lacquer lit by the pool and the room (what its gloss mirrors,
// studio_view adds; the app's table adds the bowl's own reflection over it: StudioBackdrop.ts).
fn studio_table(x: vec3f) -> vec3f {
  let albedo = vec3f(0.034, 0.040, 0.050);
  var c = albedo * studio_tableLight(x) / 3.14159265;
  // (Its far edge, where it meets the backdrop, catches a thin line of light.)
  c += studioTableEdge * (1.0 - smoothstep(0.0, 0.06, x.z - STUDIO_WALL_Z));
  return c;
}

// What lies beyond the table along d from o: the backdrop, or the room.
fn studio_far(o: vec3f, d: vec3f) -> vec3f {
  if (d.z < -1e-4) {
    let t = (STUDIO_WALL_Z - o.z) / d.z;
    let x = o + d * t;
    if (x.y >= STUDIO_TABLE_Y) { return studio_wall(x); }
  }
  return studio_room(d);
}

// What a ray from o (world) heading along d sees of the studio: the table, and when gloss what it
// mirrors of the backdrop and the room; or what lies beyond it. (One look beyond, either way: a
// shader holds a copy of this for every place it is called from, shaders.ts globesZero.)
fn studio_view(o: vec3f, d: vec3f, gloss: bool) -> vec3f {
  var c = vec3f(0.0);
  var w = 1.0;
  var fo = o;
  var fd = d;
  if (d.y < -1e-5 && o.y > STUDIO_TABLE_Y) {
    let t = (STUDIO_TABLE_Y - o.y) / d.y;
    let x = o + d * t;
    if (x.z > STUDIO_WALL_Z) {
      c = studio_table(x);
      w = select(0.0, 0.04 + 0.96 * pow(1.0 - clamp(-d.y, 0.0, 1.0), 5.0), gloss);
      fo = x;
      fd = vec3f(d.x, -d.y, d.z);
    }
  }
  if (w > 0.0) { c += w * studio_far(fo, fd); }
  return c;
}
`;
