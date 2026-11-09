// Thin binding over the wasm engine core. No copies: everything the renderer
// needs is read straight out of wasm linear memory through typed-array views.

import { quadLuts } from './quad_luts.js';

// Mirrors `out::*` in engine/src/lib.rs. Floats are stored as raw bits; use
// Engine.outF32 to read them.
export const OUT = {
  QUADS_PTR: 0, QUAD_ROWS: 1, QUAD_HIGH: 2, DIRTY_RUNS_PTR: 3, DIRTY_RUNS_LEN: 4,
  XF_PTR: 5, XF_COUNT: 6, OCC_PTR: 7, OCC_SX: 8, OCC_SY: 9, OCC_SZ: 10,
  OCC_DIRTY_PTR: 11, OCC_DIRTY_LEN: 12, WORLD_SX: 13, WORLD_SY: 14, WORLD_SZ: 15,
  STAT_QUADS: 16, STAT_DIRTY_CHUNKS: 17, STAT_BODIES: 18, STAT_FRAME: 19,
  STAT_AWAKE: 20, STAT_PARTICLES: 21, STAT_CONTACTS: 22, PROF_PTR: 23, PROF_LEN: 24,
  PARTICLES_PTR: 32, PARTICLE_COUNT: 33, LIGHTS_PTR: 34, LIGHT_COUNT: 35,
  EVENTS_PTR: 36, EVENT_COUNT: 37,
  EVENT_TOTAL: 50, REPLAY_PTR: 53,
  CAM_X: 40, CAM_Y: 41, CAM_Z: 42, CAM_YAW: 43, CAM_PITCH: 44, CAM_FOV: 45, PLAYER_FLAGS: 46,
  PARTICLE_DEBRIS: 47, PARTICLE_RESTING: 48, PARTICLE_REST_REV: 49,
  FIRE_BURNING: 51, FIRE_BURNT: 52,
  FINE_PTR: 54, FINE_ROWS: 55, FINE_HIGH: 56, FINE_DIRTY_PTR: 57, FINE_DIRTY_LEN: 58, STAT_FINE_QUADS: 59, STAT_REFINED: 60, FINE_CHANGED: 62,
  WATER_PTR: 61, STAT_STALE_CHUNKS: 63,
  LEN: 64,
};

// Mirrors `prof::*`: per-system milliseconds for the last step / prepare.
export const PROF = { PLAYER: 0, STRUCTURE: 1, PHYSICS: 2, IMPACTS: 3, PARTICLES: 4, REMESH: 5, STEP_TOTAL: 6, PREPARE_TOTAL: 7, PARTICLE_FX: 8, PARTICLE_SOLIDS: 9, PARTICLE_RUBBLE: 10, PARTICLE_GAS: 11, FIRE: 12, REPLAY: 13, WATER: 14, PHYSICS_OVER: 15, PREPARE_PARTICLES: 16, PREPARE_WATER: 17, REMESH_COARSE: 18, REMESH_DETAIL: 19, LEN: 20 };

// Mirrors `detail::cost::*`: the parts of the detail layer's ledger
// (`Engine.detailCost`: milliseconds by part, then counts by part).
export const DETAIL_COST = { STEP_MARKS: 0, STEP_CUTS: 1, STEP_PURGE: 2, STEP_TOUCH: 3, STEP_PIECE: 4, DECOR: 5, FINE: 6, WEAR: 7, ESTIMATE: 8, LOD: 9, LIST: 10, DUE: 11, DIRT: 12, PICK: 13, WEAR_ELSE: 14, LIST_PIECE: 15, WEAR_HITS: 16, CLOCK: 17, LIST_ROWS: 18, LIST_WHOLE: 19, ROWS_EDIT: 20, ROWS_MASK: 21, LIST_READ: 22, LIST_MASKS: 23, FINE_PIECE: 24, NEAR_PIECES: 25, NEAR_PLAIN: 26, LEN: 27 };

// Mirrors `events::ev`. Event record: [kind, x, y, z, magnitude, material, a, b].
export const EV = { IMPACT: 1, BREAK: 2, EXPLOSION: 3, FRACTURE: 4, DETACH: 5, GLASS: 6, FOOTSTEP: 7, SHOT: 8, IGNITE: 9, CREAK: 10, THUD: 11, JOINT_BREAK: 12, SCORE: 13, CONCUSSION: 14, INCOMING: 15, SPLASH: 16, HURT: 17 };
// What a SCORE event says (its `a`): mirrors `objective::said`.
export const SAID = { CHAIN: 1, COLLAPSE: 2, LEVELLED: 3, TIME: 4, FINAL: 5, STRIKE: 6, DAMAGE: 7, VOID: 8, SWEEP: 9, SLIP: 10, MISS: 11 };
export const EV_STRIDE = 8;
export const LIGHT_STRIDE = 8;
export const P_STRIDE = 12;
// A billboard's row is shorter (engine/src/particles.rs): the instances from
// PARTICLE_DEBRIS on, eight words each, after the cubes' twelve.
export const P_SPRITE_STRIDE = 8;
// Words of the particle buffer in use: `count` instances, the first
// `debris` of them cubes.
export const particleWords = (count, debris) => { const d = Math.min(debris, count); return d * P_STRIDE + (count - d) * P_SPRITE_STRIDE; };

// Mirrors `player::button`. NOCLIP and BLAST act on the press, not the hold.
export const BUTTON = { PRIMARY: 1, SECONDARY: 2, JUMP: 4, SPRINT: 8, CROUCH: 16, NOCLIP: 32, BLAST: 64, USE: 128, UNHEARD: 256 };
// Mirrors `player::pflag` (out slot PLAYER_FLAGS) and `player::fx`.
export const PFLAG = { GROUND: 1, CROUCH: 2, NOCLIP: 4, SPRINT: 8, ON_BODY: 16, EMBEDDED: 32, IN_WATER: 64, THROWN: 128, DOWN: 256 };
// (BLAST_STILL is no camera effect and not among ALL: a host whose player
// must not be carried about, a headset, adds it to the mask it gives
// playerConfig, and a blast leaves the body where it stands. It wounds as
// it did; pieces still strike and press, and a fall is a fall.)
// (MEASURED_PUSH, LOW_OVERHEAD, NEAR_SIDES and WAY_UP are none either:
// rules of the player's controller that are being judged, off unless the
// page is opened with ?push=measured, ?overhead=side, ?sides=near or
// ?climb=through.)
export const VIEW_FX = { BOB: 1, LAND_DIP: 2, FOV_KICK: 4, ALL: 7, BLAST_STILL: 8, MEASURED_PUSH: 16, LOW_OVERHEAD: 32, NEAR_SIDES: 64, WAY_UP: 128 };
// Mirrors `tools::tool` (the `tool` argument of input()) and `tools::item`.
export const TOOL = { HAMMER: 0, RIFLE: 1, SHOTGUN: 2, ROCKET: 3, CHARGE: 4, GRAVITY: 5, CANNON: 6, SPAWNER: 7, FLAME: 8, SATCHEL: 9, BREACH: 10, STRIKE: 11, COUNT: 12 };
export const SPAWN_ITEM = { CRATE: 0, BLOCK: 1, BEAM: 2, PANE: 3, BARREL: 4, COUNT: 5, CAR: 5, TRUCK: 6, DOZER: 7, ALL: 8 };
// Mirrors `tools::toy` (the argument of toy()): the sandbox's toy box.
export const TOY = { WRECKING_BALL: 0, DOMINOES: 1, BARRELS: 2, METEOR: 3, CARPET: 4, CLEAR: 5, COUNT: 6 };
// Mirrors `vehicle::kind`, and the layout of vehicleState() (`vehicle/host.rs`).
export const VEHICLE = { CAR: 0, FLATBED: 1, TRUCK: 2, DOZER: 3 };
export const VEHICLE_STATE = { DRIVING: 0, KIND: 1, SPEED: 2, TOP_SPEED: 3, LOOK_YAW: 4, LOOK_PITCH: 5, PROMPT: 6, COCKPIT: 7, THROTTLE: 8, STEER: 9, HANDBRAKE: 10, GROUNDED: 11, WHEELS: 12, COUNT: 13, RAMS: 14, WRECKED: 15, SLIP: 16, SLIP_MATERIAL: 17, PUSH: 18, HELD: 19, EDGE: 20 };
// Layout of toolState() and playerState().
export const TOOL_STATE = { ACTIVE: 0, COOLDOWN: 1, CHARGES: 2, DETONATING: 3, HELD_BODY: 4, SPAWN_ITEM: 5, KICK_PITCH: 6, KICK_YAW: 7, SHOTS: 8, ROCKETS: 9, SPREAD: 10, AIM: 11, COOL_FRACTION: 12, MAX_CHARGES: 13, FUEL: 14, SHOCK: 15, SATCHELS: 16, MAX_SATCHELS: 17, STRIKES: 18, STRIKE_STOCK: 19, BREACHES: 20, SATCHEL_STOCK: 21, READY: 22, FLASH: 23, BUTTON_NOTHING: 30 };
export const PLAYER_STATE = { FEET_X: 0, FEET_Y: 1, FEET_Z: 2, VEL_X: 3, VEL_Y: 4, VEL_Z: 5, EYE_HEIGHT: 6, SPEED: 7, FLAGS: 8, GROUND_MATERIAL: 9, GROUND_BODY: 10, HEIGHT: 11, HEALTH: 12, PRESS: 13 };
// Layouts of tally() and objectiveState() (`player/tally.rs`, `player/objective.rs`).
export const TALLY = { VOXELS: 0, PIECES: 1, LARGEST: 2, DURATION: 3, QUIET: 4, SERIAL: 5, TOTAL_VOXELS: 6, TOTAL_PIECES: 7, TOTAL_LARGEST: 8, ACTIVE: 9 };
export const OBJ = { STATE: 0, INDEX: 1, CLOCK: 2, TIME_LIMIT: 3, CHARGES_USED: 4, CHARGE_LIMIT: 5, DOWN: 6, HEIGHT: 7, HEIGHT0: 8, GOAL: 9, GOAL_VALUE: 10, STARS: 11, FAIL: 12, TOOLS: 13, STANDING: 14, TOTAL: 15, PROGRESS: 16, CHARGES_LEFT: 17, PASSES: 18, BUTTON: 19 };
export const OBJ_STATE = { IDLE: 0, READY: 1, RUNNING: 2, WON: 3, DONE: 4, FAILED: 5 };
// Layout of gameState() (`player/objective/mayhem.rs`): the game being
// played beyond a plain objective. STATE is an OBJ_STATE (WON: time is up,
// the score still open). From DOWN on, one slot per structure followed;
// from PLAN on, its number in the scene's plans.
export const GAME = { MODE: 0, STATE: 1, CLOCK: 2, TIME: 3, SCORE_M: 4, SCORE: 5, MULT: 6, FUSE: 7, LINKS: 8, BEST_MULT: 9, LEVELLED: 10, TARGETS: 11, STRIKES: 12, MEDAL: 13, PAR: 14, OVERTIME: 17, VOXELS: 18, BIGGEST: 19, MASK: 20, SKIPPED: 21, MASK_HI: 22, AIMED: 23, DOWN: 64, PLAN: 96, LEN: 128 };
export const GAME_MODE = { NONE: 0, MAYHEM: 1, JOB: 2 };
// The same block while a contract is played (`player/objective/jobs.rs`):
// money in dollars, MEDAL what the profit as it stands would earn (0 done at
// a loss, 1 bronze, 2 silver, 3 gold), PRICE one slot per tool, LOST the
// share gone of each neighbour that must stand, AT the target's centre (m).
export const JOB = { MODE: 0, STATE: 1, CLOCK: 2, TIME: 3, FEE: 4, SPENT: 5, DAMAGES: 6, PROFIT: 7, MEDAL: 8, SILVER: 9, GOLD: 10, KEEPS: 11, PROGRESS: 12, FAIL: 13, GONE: 14, CHARGES_LEFT: 15, PRICE: 16, LOST: 32, AT: 48, WORKING: 51, STRAINING: 52, RIDE: 53, HAND: 54, GOT_BY: 55, GOT_MATERIAL: 56, LOW: 57, CARRIED: 58, CARRY: 59, LEFT: 60, FEATS: 61, OFFERED: 62, LOW_BY: 63, LOW_MATERIAL: 64, LOW_FROM: 65, LATE: 66, SECS: 67 };
// Layout of replayState() and of the block out slot REPLAY_PTR points at
// (`replay::block`), and the director's shots (`replay::director::shot`).
export const REPLAY = { MODE: 0, STEP: 1, LENGTH: 2, CAM_X: 3, CAM_Y: 4, CAM_Z: 5, CAM_YAW: 6, CAM_PITCH: 7, CAM_FOV: 8, TIMESCALE: 9, SHOT: 10, CUTS: 11, QUIET: 12, DIVERGED: 13, SERIAL: 14, RECORDED: 15, FX_DIVERGED: 16, LEN: 18 };
export const REPLAY_MODE = { OFF: 0, PLAYING: 1, FINISHED: 2 };
export const SHOT = { NONE: 0, WIDE: 1, TRACK: 2, LOW: 3, ORBIT: 4 };

// The water block out slot WATER_PTR points at (`water::output::block`, 16
// u32 words) and the strides of the buffers it describes, in floats.
export const WATER = {
  RECT_PTR: 0, RECT_COUNT: 1, RECT_REV: 2, TILE_PTR: 3, TILE_COUNT: 4, PATCH_PTR: 5, DIRTY_PTR: 6, DIRTY_COUNT: 7,
  PARCEL_PTR: 8, PARCEL_COUNT: 9, RUNS: 10, AWAKE: 11, PATCHES: 12, FLOW: 13, FLOW_X: 14, FLOW_Z: 15, LEN: 16,
  RECT_STRIDE: 8, TILE_STRIDE: 4, PARCEL_STRIDE: 8,
};

export const QUAD_TEX_W = 2048;
export const XF_STRIDE = 16;
export const VOXEL = 0.1;
export const SIM_DT = 1 / 60;

export class Engine {
  static async load(url) {
    const imports = { env: { js_now: () => performance.now() } };
    let instance, module;
    try {
      ({ instance, module } = await WebAssembly.instantiateStreaming(fetch(url), imports));
    } catch (e) {
      // Hosts that serve .wasm with the wrong MIME type land here.
      const bytes = await (await fetch(url)).arrayBuffer();
      ({ instance, module } = await WebAssembly.instantiate(bytes, imports));
    }
    const engine = new Engine(instance);
    // (Compiled once: a mesher on a thread of its own is a second instance
    // of the same module, mesh_away.js.)
    engine.module = module;
    // The materials' kinds, before anything is meshed (they stay with the
    // instance, through every new world): the engine writes a mesh's heap
    // quads (rubble, foliage) last in its slot, so that the renderer's
    // heap program draws those and not the walls that share a segment
    // with them (QuadStore::write_parted; render_geom.js draws such a
    // segment in two parts).
    engine.quadKinds(...quadLuts(engine.palette()));
    return engine;
  }

  constructor(instance) {
    this.x = instance.exports;
    this.mem = this.x.memory;
    this._buf = null;
    this.out = null;
    // The last prepareRender: where its out block is, the alpha it was given
    // and how many there have been (a frame built over this engine tells a
    // new out block from the one it holds by the count).
    this.outPtr = 0;
    this.alpha = 1;
    this.prepared = 0;
    this._normalBudget = -1;
    // The compiled module, where load() made this engine, and the mesher
    // on a thread of its own, where there is one (mesh_away.js).
    this.module = null;
    this.meshAway = null;
  }

  // Views die whenever wasm memory grows; rebuild them lazily.
  _views() {
    if (this._buf !== this.mem.buffer) {
      this._buf = this.mem.buffer;
      this.u8 = new Uint8Array(this._buf);
      this.u32 = new Uint32Array(this._buf);
      this.f32 = new Float32Array(this._buf);
    }
  }

  init(scene, seed) {
    this.x.vx_init(scene >>> 0, seed >>> 0);
    // A new engine starts on its own budget again.
    this._normalBudget = -1;
  }

  // Height (m) of the land around a scene's world (scene::surround).
  sceneSurround(scene) {
    return this.x.vx_scene_surround ? this.x.vx_scene_surround(scene >>> 0) : 1.2;
  }

  // The land beyond a scene's box (scene::far) as a copy of vx_scene_far's
  // block of i32 (the export in engine/src/scene/far.rs has the layout;
  // web/js/render_far.js reads it): a header of sixteen words, the boxes,
  // the skins, a palette, the terrain and the atlas. The pictures are of
  // the world as it stands: ask at start.
  far(scene, seed) {
    if (!this.x.vx_scene_far) return new Int32Array(16);
    const p = this.x.vx_scene_far(scene >>> 0, seed >>> 0);
    const h = new Int32Array(this.mem.buffer, p, 16);
    const cells = h[8] > 1 && h[9] > 1 ? (h[8] - 1) * (h[9] - 1) : 0;
    return new Int32Array(this.mem.buffer, p, 16 + h[0] * 8 + h[5] * 12 + 256 + h[8] + h[9] + h[8] * h[9] + cells + h[11] * 13 + h[6] * h[7]).slice();
  }

  step(dt = SIM_DT) {
    this.x.vx_step(dt);
  }

  // Returns a Uint32Array view of the render-output block (valid until the
  // next engine call that can allocate).
  prepareRender(alpha) {
    const p = this.x.vx_prepare_render(alpha);
    // (Before the views: the job this prepare made goes to the mesher.)
    if (this.meshAway) this.meshAway.after();
    this.outPtr = p;
    this.alpha = alpha;
    this.prepared++;
    this._views();
    this.out = this.u32.subarray(p >> 2, (p >> 2) + OUT.LEN);
    return this.out;
  }

  // The mesher on a thread of its own (mesh_away.js), for a check or the
  // console: [1 if it is at work, jobs posted, answers brought back,
  // prepares the answers were late by in all, and at most, what the
  // posting and the bringing back took the engine's thread (ms), and how
  // long the answers were in coming, in all and at most (ms)].
  meshState() {
    const a = this.meshAway;
    return a ? [a.on ? 1 : 0, a.stats.jobs, a.stats.answers, a.stats.late, a.stats.latest, a.stats.ms, a.stats.wait, a.stats.waitMost] : [0, 0, 0, 0, 0, 0, 0, 0];
  }

  // Mesh every stale chunk now, whatever the per-frame budget.
  remeshAll() {
    this.x.vx_remesh_all();
  }

  // While a restarted scene meshes behind a curtain: `ms` of remeshing per
  // rendered frame instead of the budget in force (0 puts that back).
  loadBudget(ms) {
    if (ms > 0) {
      if (this._normalBudget < 0) this._normalBudget = this.x.vx_remesh_budget();
      this.x.vx_set_remesh_budget(ms);
    } else if (this._normalBudget >= 0) {
      this.x.vx_set_remesh_budget(this._normalBudget);
      this._normalBudget = -1;
    }
  }

  // The budget in force from now on (ms of remeshing a prepare): a host
  // whose steps leave it time gives the mesher more of it. While a load
  // budget is in force this is what comes back after it.
  remeshBudget(ms) {
    if (this._normalBudget >= 0) this._normalBudget = ms;
    else this.x.vx_set_remesh_budget(ms);
  }

  palette() {
    const p = this.x.vx_palette();
    this._views();
    return this.u8.subarray(p, p + 256 * 8);
  }

  // Float view of the out block (same memory as `out`).
  outF32(out) {
    return this.f32.subarray(out.byteOffset >> 2, (out.byteOffset >> 2) + OUT.LEN);
  }

  // A copy of the world's solid mask as it stands: { sx, sy, sz, bits } with
  // one bit per voxel, byte (x >> 3) + ceil(sx / 8) * (z + sz * y), bit x & 7.
  solidBits() {
    const p = this.x.vx_solid_bits();
    this._views();
    const sx = this.u32[p >> 2], sy = this.u32[(p >> 2) + 1], sz = this.u32[(p >> 2) + 2];
    const bits = this.u8.slice(p + 12, p + 12 + ((sx + 7) >> 3) * sy * sz);
    this.x.vx_solid_bits_release();
    return { sx, sy, sz, bits };
  }

  // Where every voxel is right now (engine/src/particles/books.rs), in
  // voxels. Counts both grids: for instruments, not for a frame.
  matter() {
    const p = this.x.vx_matter();
    const v = new Float64Array(this.mem.buffer, p, 16);
    const names = ['world', 'rubble', 'pieces', 'debrisMoving', 'debrisResting', 'settling', 'held', 'burnt', 'fire', 'offMap', 'refused', 'bulked', 'destroyed', 'taken', 'laid'];
    return Object.fromEntries(names.map((n, i) => [n, v[i]]));
  }

  carveSphere(x, y, z, r, power = 1) {
    return this.x.vx_carve_sphere(x, y, z, r, power);
  }

  explode(x, y, z, r, power = 1) {
    this.x.vx_explode(x, y, z, r, power);
  }

  // Heat in a sphere (m): flammable voxels in it with a face in the air
  // catch, each with its material's chance times `heat` (1 = a flame held
  // to it). Returns how many were lit.
  ignite(x, y, z, r, heat = 1) {
    return this.x.vx_ignite(x, y, z, r, heat);
  }

  // View of [burning, charred, consumed, lit, brands in flight, ms of the
  // last update, explosive voxels set off, spare].
  fireStats() {
    const p = this.x.vx_fire_stats() >> 2;
    this._views();
    return this.f32.subarray(p, p + 8);
  }

  /** Loading screen: run the particle code once on a throwaway population,
   *  and every other system once on a toy world, so the first real step does
   *  not pay for compiling the code it runs. */
  warmUp() {
    this.x.vx_warm_up();
    if (this.x.vx_warm_code) this.x.vx_warm_code();
  }

  // Rubble deposition on/off: resting debris is baked back into the world.
  setRubble(on) {
    this.x.vx_set_rubble(on ? 1 : 0);
  }

  // Effect quality 0.25..1.5: particle counts, lifetimes, detail distances.
  setFxQuality(q) {
    this.x.vx_set_fx_quality(q);
  }

  // One piece of debris: position (m), velocity (m/s), material id, edge (m).
  spawnDebris(x, y, z, vx, vy, vz, material, size = VOXEL) {
    this.x.vx_spawn_debris(x, y, z, vx, vy, vz, material, size);
  }

  // Most bodies simulated at once (default 150); 0 only reads the value.
  // Beyond it slow bodies wait their turn asleep and small flying ones
  // become debris, so lower it with the quality setting on slow machines.
  physicsBudget(awake = 0) {
    return this.x.vx_physics_budget(awake);
  }

  // A 1.5 t steel ball hanging on `rope` metres of rope from a world point.
  // Returns its body id (0: none); `x.vx_body_set_velocity` sets it swinging.
  spawnWreckingBall(x, y, z, rope) {
    return this.x.vx_spawn_wrecking_ball(x, y, z, rope);
  }

  // The sandbox's toy box (tools/toys.rs): set off toy `kind` (TOY) on what
  // the player is looking at, up to 80 m away. True when it did something:
  // it is refused when the player looks at nothing, and while a contract,
  // an objective or a run of Mayhem is on.
  toy(kind) {
    return this.x.vx_toy(kind >>> 0) !== 0;
  }

  // The level for what may be shown with less work on a slow machine: 1
  // = as built, down to 0. Nothing the simulation decides follows from it
  // (engine/src/effort.rs). Returns the level in force; with no argument
  // it only reads it.
  effort(level = -1) {
    return this.x.vx_effort ? this.x.vx_effort(level) : 1;
  }

  // Global multiplier on material strengths used by the stress solver.
  strengthScale(scale) {
    this.x.vx_strength_scale(scale);
  }

  // View of [nodes, edges, frames still being solved, solver iterations
  // last step, max stress ratio, fractures total, detached total, spare].
  structureStats() {
    const p = this.x.vx_structure_stats() >> 2;
    this._views();
    return this.f32.subarray(p, p + 8);
  }

  spawnBox(x, y, z, sx, sy, sz, material) {
    return this.x.vx_spawn_box(x, y, z, sx, sy, sz, material);
  }

  input(moveX, moveZ, yaw, pitch, buttons, pressed, tool) {
    this.x.vx_input(moveX, moveZ, yaw, pitch, buttons, pressed, tool);
  }

  // Latest sim camera as a view of [x, y, z, yaw, pitch, fov].
  camera() {
    const p = this.x.vx_camera() >> 2;
    this._views();
    return this.f32.subarray(p, p + 6);
  }

  setCamera(x, y, z, yaw, pitch) {
    this.x.vx_set_camera(x, y, z, yaw, pitch);
  }

  // Put the player's feet at (x, y, z) in walking mode (also the respawn
  // point). setCamera, by contrast, leaves a free-flying noclip camera.
  playerSpawn(x, y, z, yaw, pitch) {
    this.x.vx_player_spawn(x, y, z, yaw, pitch);
  }

  // viewFx: mask of VIEW_FX bits; fov: base vertical field of view in degrees.
  playerConfig(viewFx, fov) {
    this.x.vx_player_config(viewFx, fov);
  }

  playerNoclip(on) {
    this.x.vx_player_noclip(on ? 1 : 0);
  }

  // Change the look direction only; movement and buttons stay as last sent.
  look(yaw, pitch) {
    this.x.vx_look(yaw, pitch);
  }

  // A view of `len` floats at `ptr`, reused for as long as it stays valid so
  // per-frame readers allocate nothing.
  _stateView(slot, ptr, len) {
    this._views();
    let v = this[slot];
    if (!v || v.buffer !== this._buf || v.byteOffset !== ptr) {
      v = this[slot] = this.f32.subarray(ptr >> 2, (ptr >> 2) + len);
    }
    return v;
  }

  // Float views indexed by PLAYER_STATE / TOOL_STATE, refreshed by the call.
  playerState() {
    return this._stateView('_playerState', this.x.vx_player_state(), 14);
  }

  toolState() {
    return this._stateView('_toolState', this.x.vx_tool_state(), 31);
  }

  // The marks blasts have left, for the renderer to blacken what stands
  // inside them: [how many, how many there have been in all, then x, y, z
  // and reach (m) of each, oldest first] (`tools.rs::vx_scorch_marks`). A
  // row with a negative reach is pressed earth where something heavy
  // landed, of radius -reach: skip it if only soot is drawn.
  scorchMarks() {
    return this._stateView('_scorchMarks', this.x.vx_scorch_marks(), 2 + 4 * 64);
  }

  // The water's picture as the last frame prepared holds it, for a test
  // that compares two pages: { hash: sixteen hex digits over the rows of
  // the tiles shown and every texel of their patches, arrived: every
  // drawn level is where its water is (two pages that stepped the same
  // world hold the same picture only then), tiles: how many are shown }
  // (`water/output/doors.rs::vx_water_drawn`). Reads only; through
  // sim.ask('waterDrawnHash') where the engine runs in a worker.
  waterDrawnHash() {
    const f = this.x.vx_water_drawn;
    if (!f) return null;
    const hex = (v) => (v >>> 0).toString(16).padStart(8, '0');
    return { hash: hex(f(1)) + hex(f(0)), arrived: f(2) !== 0, tiles: f(3) >>> 0 };
  }

  // How far fine detail is drawn (m) and how many fine quads at most: the
  // renderer's tier (engine/src/detail.rs).
  detailConfig(distance, maxQuads) {
    if (this.x.vx_detail_config) this.x.vx_detail_config(distance, maxQuads);
  }

  // How much of the marks a blast leaves on what faces it is drawn: 1 all
  // of them, 0 none (the renderer's tier). For the blasts from now on;
  // changes nothing in the simulation.
  detailMarks(share) {
    if (this.x.vx_detail_marks) this.x.vx_detail_marks(share);
  }

  // The picture is seen from (x, y, z) m and not from the player's eye (a
  // tool's observer camera): fine detail is drawn round there. With no
  // arguments: from the player's eye again. Changes nothing in the
  // simulation. (The engine follows over the next frames; remeshAll, where
  // a tool has it, brings it there at once.)
  detailEye(x, y, z) {
    if (this.x.vx_detail_eye) this.x.vx_detail_eye(x || 0, y || 0, z || 0, x === undefined ? 0 : 1);
  }

  // The share of a frame (ms) the engine gives the one fine mesh of a
  // piece of the world that it makes whatever the clock says, before the
  // mesh is left for the next frame (meanwhile that piece is drawn as it
  // was, or with whole voxels). 0 or nothing: as the engine is built.
  // Changes nothing in the simulation; a new game starts as built.
  detailShare(ms) {
    if (this.x.vx_detail_share) this.x.vx_detail_share(ms || 0);
  }

  // What the detail layer has cost since this was last asked, steps and
  // prepares together: DETAIL_COST.LEN milliseconds by part, then as many
  // counts (a copy). It keeps its ledger from here on if `on` (as built it
  // keeps none: asking the clock is not free). Changes no mesh and no step.
  // (Add the answers up over many frames before reading them: a browser's
  // clock is coarse, and one frame's time for a part may be under nothing.)
  detailCost(on = true) {
    if (!this.x.vx_detail_cost) return null;
    const p = this.x.vx_detail_cost(on ? 1 : 0);
    this._views();
    return Array.from(this.f32.subarray(p >> 2, (p >> 2) + 2 * DETAIL_COST.LEN));
  }

  // What the player is driving, if anything (VEHICLE_STATE).
  vehicleState() {
    return this._stateView('_vehicleState', this.x.vx_vehicle_state(), 24);
  }

  // What has just been destroyed (TALLY) and the demolition objective being
  // played (OBJ), as float views refreshed by the call.
  tally() {
    return this._stateView('_tally', this.x.vx_tally(), 10);
  }

  objectiveState() {
    return this._stateView('_objective', this.x.vx_objective_state(), 20);
  }

  // Objective `i` of a scene, or null: goal 'below' (metres) or 'down'
  // (share 0..1), limits (0: none), tools as a mask of 1 << TOOL.X, the
  // two par values for two and three stars, and where the target is (m).
  objectiveSpec(scene, i) {
    const p = this.x.vx_objective_spec(scene, i) >> 2;
    this._views();
    const u = this.u32, f = this.f32;
    if (!u[p]) return null;
    const name = new TextDecoder().decode(this.u8.slice(u[p + 8], u[p + 8] + u[p + 9]));
    return { name, goal: u[p + 1] ? 'down' : 'below', value: f[p + 2], timeLimit: f[p + 3], charges: u[p + 4], tools: u[p + 5], par: [f[p + 6], f[p + 7]], at: [f[p + 10], f[p + 11], f[p + 12]], base: f[p + 13] };
  }

  // Start objective `i` of the scene on the world as it is (true when it
  // is now on); stop goes back to the free sandbox.
  objectiveStart(scene, i) {
    return this.x.vx_objective_start(scene, i) !== 0;
  }

  objectiveStop() {
    this.x.vx_objective_stop();
  }

  // Mayhem: sixty seconds for a score, on the world as it is (true when it
  // is now on). objectiveStop() ends it. gameState() is a float view
  // indexed by GAME, refreshed by the call.
  mayhemStart(scene) {
    return this.x.vx_mayhem_start(scene) !== 0;
  }

  // The player has waited `ms` longer than the world ran: the run's
  // clock moves on by that much (mayhem.rs: skip).
  mayhemSkip(ms) {
    this.x.vx_mayhem_skip(ms >>> 0);
  }

  gameState() {
    return this._stateView('_game', this.x.vx_game_state(), GAME.LEN);
  }

  // Contract `i` of a scene, or null: what the board shows of it, and the
  // neighbours that must stand. jobStart() starts it on the world as it is
  // (true when it is now on); objectiveStop() ends it; gameState() follows
  // it (JOB).
  jobInfo(scene, i) {
    const p = this.x.vx_job_info(scene, i) >> 2;
    this._views();
    const u = this.u32, f = this.f32;
    if (!u[p]) return null;
    const text = (at) => new TextDecoder().decode(this.u8.slice(u[at], u[at] + u[at + 1]));
    const job = { title: text(p + 1), brief: text(p + 3), id: text(p + 5), fee: u[p + 7] | 0, silver: u[p + 8] | 0, gold: u[p + 9] | 0, tools: u[p + 11], charges: u[p + 12], timeLimit: f[p + 13], name: text(p + 14), keep: [] };
    const keeps = u[p + 10];
    for (let k = 0; k < keeps; k++) {
      const q = this.x.vx_job_keep(scene, i, k) >> 2;
      this._views();
      const v = this.u32, g = this.f32;
      if (v[q]) job.keep.push({ name: new TextDecoder().decode(this.u8.slice(v[q + 1], v[q + 1] + v[q + 2])), rate: v[q + 3] | 0, void: g[q + 4], at: [g[q + 5], g[q + 6], g[q + 7]] });
    }
    return job;
  }

  jobStart(scene, i) {
    return this.x.vx_job_start(scene, i) !== 0;
  }

  // Structure `i` of a scene's plans, or null: its name, where it is (m)
  // and how many voxels stand on its supports.
  planInfo(scene, i) {
    const p = this.x.vx_plan_info(scene, i) >> 2;
    this._views();
    const u = this.u32, f = this.f32;
    if (!u[p]) return null;
    const name = new TextDecoder().decode(this.u8.slice(u[p + 1], u[p + 1] + u[p + 2]));
    return { name, at: [f[p + 3], f[p + 4], f[p + 5]], voxels: u[p + 6] };
  }

  // Replays (engine/src/replay.rs). Everything that enters the simulation
  // is recorded as it is played. replayBegin() plays the newest session
  // back from its start: it re-initialises the engine like init() (the
  // renderer needs its reset()), and from then on step() takes its input
  // from the log and ignores the host's, until the log ends or init() is
  // called. False when nothing has been recorded.
  replayBegin() {
    return this.x.vx_replay_begin() !== 0;
  }

  // Float view indexed by REPLAY, refreshed by the call. The same block
  // rides in every out block (slot REPLAY_PTR) with the director's camera
  // at that frame's alpha.
  replayState() {
    return this._stateView('_replay', this.x.vx_replay_state(), REPLAY.LEN);
  }

  // Cut to another shot now.
  replayNextShot() {
    this.x.vx_replay_next_shot();
  }

  // Width over height of the picture the director frames for.
  replayAspect(aspect) {
    this.x.vx_replay_aspect(aspect);
  }

  // The newest session as bytes (a copy), or null: attach to a bug report.
  replayExport() {
    const n = this.x.vx_replay_export();
    if (!n) return null;
    const p = this.x.vx_replay_export_ptr();
    this._views();
    return this.u8.slice(p, p + n);
  }

  // Take a session from bytes; replayBegin() then plays it. 1: taken,
  // 0: not a replay file, 2: from a build this one cannot read, 3: damaged,
  // 4: it asks for more bodies than a playback will hold.
  replayImport(bytes) {
    const p = this.x.vx_replay_import_buffer(bytes.length);
    if (!p) return 0;
    this._views();
    this.u8.set(bytes, p);
    return this.x.vx_replay_import();
  }

  // Acoustic queries against the static world (engine/src/acoustics.rs).
  // Bit 0: a roof within 10 m; bits 1..4: a wall within 14 m on +x, -x, +z, -z.
  acousticEnclosure(x, y, z) {
    return this.x.vx_acoustic_enclosure(x, y, z);
  }

  // Concrete-equivalent metres of solid between a listener and a source.
  acousticOcclusion(lx, ly, lz, sx, sy, sz) {
    return this.x.vx_acoustic_occlusion(lx, ly, lz, sx, sy, sz);
  }

  // What stands in the way of sound in a box of cells of `1 << shift` voxels
  // a side (x1, y1, z1 exclusive, inside the world): one byte a cell, 170 for
  // concrete all through, x fastest, then z, then y. A view of engine memory:
  // copy it before the next engine call.
  acousticMap(x0, y0, z0, x1, y1, z1, shift) {
    const p = this.x.vx_acoustic_map(x0, y0, z0, x1, y1, z1, shift);
    this._views();
    return this.u8.subarray(p, p + (x1 - x0) * (y1 - y0) * (z1 - z0));
  }

  // What the quad lists need to know of every material, from the three
  // tables quadLuts() makes (quad_luts.js): told once, before quadDelta().
  quadKinds(trans, emit, heap) {
    const p = this.x.vx_quad_kinds();
    this._views();
    for (let i = 0; i < 256; i++) this.u8[p + i] = (trans[i] ? 1 : 0) | (emit[i] ? 2 : 0) | (heap[i] ? 4 : 0) | (heap[i] & 2 ? 8 : 0);
  }

  // What changed in the quad rows the last prepare named, as the words
  // QuadLists.apply() takes (render_geom.js: the same that writeDelta()
  // writes from lists that read the rows): the engine keeps the books
  // beside the rows. To be called once after each prepare by whoever
  // sends the rows on, and by nobody else: each call counts from the one
  // before. flags: 1 from nothing (a new world, or every row sent again),
  // 2 every row, not the changed ones. A view of engine memory, its first
  // word its length: copy it before the next engine call.
  quadDelta(flags = 0) {
    const p = this.x.vx_quad_delta(flags) >> 2;
    this._views();
    return this.u32.subarray(p, p + this.u32[p]);
  }

  // What a host that keeps its own copies of the density volume and of
  // the acoustic map has to be told after a prepare: the cells whose byte
  // changed, out of the dirty boxes named by every prepare since the last
  // call (volume_delta.rs).
  // -> { count, boxes (six words a box: x0 y0 z0 x1 y1 z1 in cells),
  // bytes, occ, sound (the boxes' bytes, `bytes` of each, a box after
  // another, y outermost, then z, then x), named (cells the dirty boxes
  // named), rows (the rows of cells that held a change) }: boxes, occ
  // and sound are views of engine memory. To be called once
  // after each prepare by whoever sends the volumes on, and by nobody
  // else. flags: 1 = the host takes the whole volumes this time (a new
  // world, or too much changed): count is 0, occ and sound are the whole
  // density and the whole map, and they are what the host has been told.
  // 2 = the whole volumes as they stand, for a check: nothing changes.
  volumeDelta(flags = 0) {
    const p = this.x.vx_volume_delta(flags) >> 2;
    this._views();
    const u = this.u32, e = this;
    const n = u[p], table = u[p + 1] >> 2, bytes = u[p + 2], occAt = u[p + 3], soundAt = u[p + 4];
    // (The views are made when they are asked for: an engine call made in
    // between may have grown the memory, and a view made before it would
    // be of nothing. What they are views of stands until the next
    // volumeDelta.)
    return {
      count: n, bytes, named: u[p + 5], rows: u[p + 6],
      get boxes() { e._views(); return e.u32.subarray(table, table + n * 6); },
      get occ() { e._views(); return e.u8.subarray(occAt, occAt + bytes); },
      get sound() { e._views(); return e.u8.subarray(soundAt, soundAt + bytes); },
    };
  }

  // -> null | {x, y, z, nx, ny, nz, dist, material}
  raycast(ox, oy, oz, dx, dy, dz, maxDist = 200) {
    const p = this.x.vx_raycast(ox, oy, oz, dx, dy, dz, maxDist) >> 2;
    this._views();
    const f = this.f32;
    if (f[p] === 0) return null;
    return { x: f[p + 1], y: f[p + 2], z: f[p + 3], nx: f[p + 4], ny: f[p + 5], nz: f[p + 6], dist: f[p + 7], material: f[p + 8] | 0, body: f[p + 9] | 0 };
  }

  // What the tools' own ray meets (the red button's, a round's): the
  // world, a loose piece, and beyond the box the far field, where
  // raycast() meets nothing. A question only; nothing is changed.
  // -> null | {x, y, z, nx, ny, nz, dist, material, body, far}
  toolTrace(ox, oy, oz, dx, dy, dz, maxDist = 200) {
    const p = this.x.vx_tool_trace(ox, oy, oz, dx, dy, dz, maxDist) >> 2;
    this._views();
    const f = this.f32;
    if (f[p] === 0) return null;
    return { x: f[p + 1], y: f[p + 2], z: f[p + 3], nx: f[p + 4], ny: f[p + 5], nz: f[p + 6], dist: f[p + 7], material: f[p + 8] | 0, body: f[p + 9] | 0, far: f[p + 10] !== 0 };
  }
}
