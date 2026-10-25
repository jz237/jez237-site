// The betta bowl's studio (its page only): the bowl stands on a dark lacquered table in front of a
// seamless blue backdrop, lit from above by the lamp in its lid, like a product photograph. The
// same WGSL draws the backdrop behind the bowl (StudioBackdrop.ts) and what the bowl's glass and
// water bend and reflect (shaders.ts globes_bg, the bowl's variant), so the two always agree.
// World frame: y up, the bowl's centre at the origin when it stands at rest, its glass's foot on
// the table.

/** Where the table's top is (world y: the foot of the bowl's glass), and the backdrop's wall
 *  behind it (world z; the table runs back to it). */
export const STUDIO_TABLE_Y = -1.0;
export const STUDIO_WALL_Z = -3.4;

export const STUDIO_WGSL = /* wgsl */ `
const STUDIO_TABLE_Y: f32 = ${STUDIO_TABLE_Y.toFixed(4)};
const STUDIO_WALL_Z: f32 = ${STUDIO_WALL_Z.toFixed(4)};

// Where the bowl stands (its centre, world): the table's pool of lamp light and its shade under
// the glass follow it.
var<private> studioBowl: vec3f = vec3f(0.0);

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
  let edge = vec3f(0.003, 0.014, 0.040);
  let mid = vec3f(0.014, 0.070, 0.160);
  let core = vec3f(0.045, 0.170, 0.330);
  var c = mix(edge, mid, smoothstep(0.0, 0.55, glow));
  c = mix(c, core, smoothstep(0.5, 1.0, glow));
  // (Where the paper sweeps down into the table, the table's own glow lifts it a little.)
  let foot = exp(-max(x.y - STUDIO_TABLE_Y, 0.0) * 3.0);
  c += vec3f(0.030, 0.040, 0.050) * foot * exp(-x.x * x.x / 9.0);
  return c * mix(1.0, 0.6, smoothstep(1.2, 4.0, x.y));
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
  var c = mix(vec3f(0.010, 0.026, 0.046), vec3f(0.020, 0.045, 0.075), clamp(d.y * 0.5 + 0.5, 0.0, 1.0));
  c += vec3f(1.00, 0.97, 0.92) * (2.6 * studio_softbox(d, normalize(vec3f(-0.6, 0.7, 0.4)), vec2f(0.12, 0.2)) + 0.08 * pow(max(dot(d, normalize(vec3f(-0.55, 0.62, 0.56))), 0.0), 8.0));
  // (The strip: a narrow band of bearing on the right towards the front, most of the way up.)
  let bearing = studio_atan2(d.x, d.z);
  c += vec3f(0.85, 0.92, 1.0) * 1.8 * (1.0 - smoothstep(0.035, 0.07, abs(bearing - 1.15))) * (1.0 - smoothstep(0.55, 0.75, abs(d.y - 0.1)));
  let top = max(d.y, 0.0);
  c += vec3f(0.9, 0.92, 0.95) * 0.45 * pow(top, 24.0);
  return c;
}

// Light falling on the table at x: the lamp's light the bowl gathers and spills round its foot (a
// warm pool, brightest in a ring just outside the glass, mottled by the water's caustics), the
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
  var e = vec3f(1.0, 0.44, 0.09) * (30.0 * ring * mottle + 16.0 * core) * fade;
  e *= mix(0.4, 1.0, smoothstep(0.02, 0.2, r));
  return e + vec3f(0.18, 0.30, 0.42);
}

// The table at x: a dark blue-grey lacquer lit by the pool and the room (what its gloss mirrors,
// studio_view adds; the app's table adds the bowl's own reflection over it: StudioBackdrop.ts).
fn studio_table(x: vec3f) -> vec3f {
  let albedo = vec3f(0.034, 0.040, 0.050);
  var c = albedo * studio_tableLight(x) / 3.14159265;
  // (Its far edge, where it meets the backdrop, catches a thin line of light.)
  c += vec3f(0.05, 0.08, 0.11) * (1.0 - smoothstep(0.0, 0.06, x.z - STUDIO_WALL_Z));
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
