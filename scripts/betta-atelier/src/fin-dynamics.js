// A reduced-order wet membrane: inextensible but bendable rays, compliant tissue, anchored
// insertions and velocity-dependent water drag. Not a CFD/biological calibration.
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
export const water = { strength: 0, direction: 'changing' };

// World-space current. All fins and suspended particles sample the same field.
// Direction changes ease in at the caller; eddies vary in space, not per frame.
export function waterVelocity(t, x, y, z, strength, direction, out) {
  let a = 0, b = 0, c = 0;
  switch (direction) {
    case 'right': a = 1; break;
    case 'left': a = -1; break;
    case 'front': c = 1; break;
    case 'back': c = -1; break;
    case 'up': b = 1; break;
    case 'down': b = -1; break;
    default:
      a = Math.cos(t * 0.19);
      c = Math.sin(t * 0.19);
      b = 0.32 * Math.sin(t * 0.31 + 0.8);
  }
  const speed = strength * (0.82 + 0.18 * Math.sin(t * 0.73));
  out[0] = speed * (a + 0.16 * Math.sin(y * 1.4 + z * 0.7 - t * 1.1));
  out[1] = speed * (b + 0.12 * Math.sin(z * 1.2 + x * 0.8 + t * 0.83));
  out[2] = speed * (c + 0.17 * Math.sin(x * 1.6 - y * 0.6 - t * 0.91));
  return out;
}

/** How finely the fins are solved: the step (s), the share of the constraint passes, and the most
 *  of a frame that is caught up on (s). A host on a slow device may lighten it (Globes on phones). */
export const FIN_QUALITY = { step: 1 / 120, passScale: 1, maxFrame: 0.07 };

/** Clamped (state.clamp, 0..1: an unwell fish holding its fins folded in), how much of each broad
 *  fin's spread closes up at the most (caudal, dorsal, anal), how far the caudal droops (rad), and
 *  how far the ventrals tuck back (rad) and in towards each other (a share). */
const CLAMP_FOLD = [0.62, 0.68, 0.62], CLAMP_DROOP = 0.12, CLAMP_TUCK = 1.05, CLAMP_PINCH = 0.6;

export class FinDynamics {
  constructor({ point, kind, side, columns = 29, rows = 17 }) {
    Object.assign(this, { kind, side, columns, rows });
    this.count = columns * rows;
    this.rest = new Float32Array(this.count * 3);
    this.roots = new Float32Array(columns * 3);
    this.position = new Float32Array(this.count * 3);
    this.previous = new Float32Array(this.count * 3);
    this.target = new Float32Array(this.count * 3);
    this.lastTarget = new Float32Array(this.count * 3);
    this.frameTarget = new Float32Array(this.count * 3);
    this.displayTarget = new Float32Array(this.count * 3);
    this.previousFlare = null;
    this.weights = new Float32Array(this.count);
    this.displacement = new Float32Array(this.count * 4);
    this.accumulator = 0;
    this.initialized = false;
    this.steps = 0;
    this.flow = [0, 0, 0];
    this.scratch = [0, 0, 0];
    for (let j = 0; j < rows; j++) for (let i = 0; i < columns; i++) {
      const n = j * columns + i;
      const p = point(i / (columns - 1), j / (rows - 1));
      this.rest.set(p, n * 3);
      if (j === 0) this.roots.set(p, i * 3);
      this.weights[n] = j === 0 ? 0 : 0.25 + 0.75 * j / (rows - 1);
    }
    const links = [], folding = [];
    const add = (a, b, stiffness, folds = false) => {
      const length = Math.hypot(...[0, 1, 2].map(k => this.rest[a * 3 + k] - this.rest[b * 3 + k]));
      if (length > 0.00001) { links.push(a, b, length, stiffness); folding.push(folds ? 1 : 0); }
    };
    for (let j = 0; j < rows; j++) for (let i = 0; i < columns; i++) {
      const n = j * columns + i;
      if (j) add(n - columns, n, 0.96); // non-stretching fin rays
      if (i) add(n - 1, n, kind < 3 ? 0.45 : 0.65, true); // membrane between rays
      if (j && i) {
        add(n - columns - 1, n, kind < 3 ? 0.15 : 0.22, true);
        add(n - columns, n - 1, kind < 3 ? 0.15 : 0.22, true);
      }
      if (j > 1) add(n - columns * 2, n, kind < 3 ? 0.075 : 0.12); // ray bending, not ray stretching
    }
    this.links = new Float32Array(links);
    this.folding = new Uint8Array(folding);
    this.linkLengths = new Float32Array(folding.length);
    // What the solver reads every substep that never changes, worked out once: each link's ends (as
    // offsets into the position arrays) and [stiffness, both ends' weight, end a's, end b's]; the
    // chords that fold with the fan (the broad fins'), every other link keeping its rest length; each
    // ray segment's rest length; each node's offset from its root, and for the broad fins its angle
    // and in-plane length there.
    const m = folding.length;
    this.linkEnds = new Int32Array(m * 2);
    this.linkTerms = new Float64Array(m * 4);
    const refolding = [];
    for (let l = 0; l < m; l++) {
      const a = links[l * 4], b = links[l * 4 + 1];
      this.linkEnds[l * 2] = a * 3; this.linkEnds[l * 2 + 1] = b * 3;
      this.linkTerms.set([this.links[l * 4 + 3], this.weights[a] + this.weights[b], this.weights[a], this.weights[b]], l * 4);
      if (kind < 3 && folding[l]) refolding.push(l);
      else this.linkLengths[l] = this.links[l * 4 + 2];
    }
    this.refolding = Int32Array.from(refolding);
    this.rayRest = new Float64Array(this.count);
    this.restOffset = new Float64Array(this.count * 3);
    this.restAngle = new Float64Array(this.count);
    this.restSpan = new Float64Array(this.count);
    for (let j = 0; j < rows; j++) for (let i = 0; i < columns; i++) {
      const n = j * columns + i, q = n * 3, a = q - columns * 3, r = i * 3;
      if (j) this.rayRest[n] = Math.hypot(this.rest[q] - this.rest[a], this.rest[q + 1] - this.rest[a + 1], this.rest[q + 2] - this.rest[a + 2]);
      const x = this.rest[q] - this.roots[r], y = this.rest[q + 1] - this.roots[r + 1], z = this.rest[q + 2] - this.roots[r + 2];
      this.restOffset[q] = x; this.restOffset[q + 1] = y; this.restOffset[q + 2] = z;
      this.restAngle[n] = Math.atan2(y, x); this.restSpan[n] = Math.hypot(x, y);
    }
    // Scratch: each row's stiffness and target terms, each column's root frame.
    this.rowStiffness = new Float64Array(rows);
    this.rowTerms = new Float64Array(rows * 4);
    this.rootFrames = new Float64Array(columns * 4);
    // Each node's rest point carried by the body in the last displacement (advance), and the body
    // and its revision it was carried by: a host drawing vertices that sit on the nodes reuses it.
    this.carried = new Float64Array(this.count * 3);
    this.carriedBy = null;
    this.carriedAt = -1;
  }

  makeTargets(state) {
    const { time: t, phase, drive, turn, flare, pectoralPhase, body } = state;
    const turnBend = body.turnBend ?? Math.tanh(turn * 0.95);
    const { columns: w, rows: h, kind, side, roots, target, scratch, restOffset: offset, rowTerms: row } = this;
    // (What is the same across the fin, or along a row, once.)
    const relaxed = kind === 0 ? 0.58 : kind === 1 ? 0.55 : 0.72;
    // Clamped, the rays close up: the caudal's fan narrows and droops, the dorsal and the anal lie
    // back along the body, the membranes held taut; the ventrals tuck back, close together.
    const folded = state.clamp ?? 0, held = 1 - 0.6 * folded;
    const spread = (relaxed + (1 - relaxed) * flare - drive * 0.12) * (1 - (CLAMP_FOLD[kind] ?? 0) * folded), fold = kind === 0 ? 0.10 * (1 - flare) + CLAMP_DROOP * folded : 0;
    let cosA = 0, sinA = 0;
    if (kind === 3) {
      // Alternating rowing stroke, then feathered/cupped recovery.
      const beat = pectoralPhase + (side < 0 ? Math.PI : 0);
      // Sculling fans a little wider than slow swimming; a startle draws the fins in toward the flanks.
      // The fan keeps beating and keeps most of its span, so the fold reads as a change of pose
      // and not as the fin shrinking. Power follows the gait's slow pectoral effort, not the tail's.
      const tuck = state.tuck ?? 0,
        power = (0.62 + 0.36 * (state.pectoralEffort ?? state.effort ?? drive) + 0.05 * (state.pectoralScull ?? state.scull ?? 0)) * (1 - 0.25 * tuck);
      for (let j = 0; j < h; j++) {
        const v = j / (h - 1);
        const stroke = side * (power * (0.48 * Math.sin(beat) + 0.18 * Math.sin(beat - v * 1.5) * v) - 0.12 - 0.1 * tuck);
        const feather = side * (0.18 + 0.72 * Math.max(0, Math.cos(beat))) * v;
        row[j * 4] = Math.cos(stroke); row[j * 4 + 1] = Math.sin(stroke);
        row[j * 4 + 2] = Math.cos(feather); row[j * 4 + 3] = Math.sin(feather);
      }
    } else if (kind === 4) {
      const angle = -0.02 - flare * 0.16 - drive * 0.40 + 0.055 * Math.sin(phase * 0.55 + side) + CLAMP_TUCK * folded;
      cosA = Math.cos(angle); sinA = Math.sin(angle);
      for (let j = 0; j < h; j++) {
        const v = j / (h - 1);
        row[j * 4] = side * v * v * 0.035 * Math.sin(t * 1.2 - v * 2 + side);
      }
    }
    for (let i = 0; i < w; i++) {
      const u = i / (w - 1), r = i * 3;
      body.pitchFrame(roots[r], scratch);
      const upCos = scratch[1], upSin = scratch[2];
      body.frame(roots[r], scratch);
      const tangentCos = scratch[2], tangentSin = scratch[3];
      body.transform(roots[r], roots[r + 1], roots[r + 2], scratch);
      const rx = scratch[0], ry = scratch[1], rz = scratch[2];
      for (let j = 0; j < h; j++) {
        const v = j / (h - 1), m = j * w + i, n = m * 3;
        let x = offset[n], y = offset[n + 1], z = offset[n + 2];
        // Fold by changing ray angle, not shortening or scaling the fin.
        if (kind < 3) {
          const angle = this.restAngle[m] * spread - fold, length = this.restSpan[m];
          x = length * Math.cos(angle); y = length * Math.sin(angle);
          const wave = kind === 0
            ? (0.012 + drive * 0.20) * Math.sin(phase - 2.5 - v * 0.8)
            : (0.025 + drive * 0.13) * Math.sin(phase * 0.8 - u * 3.7 - v * 0.7 + kind * 1.8)
              + turnBend * (0.20 + u * 0.20);
          // Bend throughout the ray, not just a ruffled outer border. Phase
          // varies across the fan and along each ray, so the membrane billows.
          const billow = (1 - flare * 0.7) * (0.05 + drive * 0.095) * held
            * Math.sin(t * 1.7 - u * 5.5 - v * 2.2 + kind * 1.8);
          const bend = (wave + billow) * (0.22 + 0.78 * v);
          // Bend about the ray's in-plane perpendicular; roots stay attached.
          const length3 = Math.hypot(x, y), cosBend = Math.cos(bend);
          x *= cosBend; y *= cosBend;
          z += length3 * Math.sin(bend);
          if (kind === 0) {
            // The broad caudal fan wraps behind the peduncle during a turn.
            // Rotate across its span, preserving ray length and vertical spread;
            // the membrane solver supplies the slower free-edge follow-through.
            const sweep = turnBend * 0.30 * v, cosSweep = Math.cos(sweep), sinSweep = Math.sin(sweep);
            const cx = x * cosSweep - z * sinSweep;
            z = x * sinSweep + z * cosSweep; x = cx;
          }
        } else if (kind === 3) {
          // (The row's stroke, then its feather.)
          const cx = x * row[j * 4] - z * row[j * 4 + 1];
          z = x * row[j * 4 + 1] + z * row[j * 4]; x = cx;
          const cy = y * row[j * 4 + 2] - z * row[j * 4 + 3];
          z = y * row[j * 4 + 3] + z * row[j * 4 + 2]; y = cy;
        } else {
          const cx = x * cosA - y * sinA;
          y = x * sinA + y * cosA; x = cx;
          z = z * (1 - CLAMP_PINCH * folded) + row[j * 4];
        }
        // (Tipped with the trunk's up-and-down bow at the root, then round with its sideways bend.)
        const along = x * upCos - y * upSin;
        y = x * upSin + y * upCos;
        target[n] = rx + along * tangentCos - z * tangentSin;
        target[n + 1] = ry + y; target[n + 2] = rz + along * tangentSin + z * tangentCos;
      }
    }
  }

  advance(dt, state) {
    this.lastTarget.set(this.target);
    const opening = dt > 0 && this.initialized && this.kind < 3 && Math.abs(state.flare - this.previousFlare) > 1e-8;
    if (opening) {
      this.makeTargets({ ...state, flare: this.previousFlare });
      this.displayTarget.set(this.target);
    }
    this.makeTargets(state);
    if (opening) {
      // A deliberate display changes the ray fan over the controller's one
      // second. Carry the existing folds/flow deflection with that rest-shape
      // change; do not replace them with a continuously pinned target surface.
      for (let q = this.columns * 3; q < this.position.length; q++) {
        const shift = this.target[q] - this.displayTarget[q];
        this.position[q] += shift; this.previous[q] += shift;
        this.lastTarget[q] += shift;
      }
    }
    if (dt > 0 || !this.initialized) this.previousFlare = state.flare;
    if (!this.initialized) {
      this.position.set(this.target); this.previous.set(this.target);
      this.lastTarget.set(this.target);
      this.initialized = true;
    }
    this.frameTarget.set(this.target);
    this.accumulator += Math.min(dt, FIN_QUALITY.maxFrame);
    const step = FIN_QUALITY.step;
    const substeps = Math.floor((this.accumulator + 1e-10) / step);
    let completed = 0;
    const { target, lastTarget, frameTarget } = this;
    while (completed < substeps) {
      // Move insertions throughout the substeps, not in one frame-sized jump.
      // This matters once the trunk has a substantial muscular stroke.
      const blend = ++completed / substeps;
      for (let i = 0; i < target.length; i++) target[i] = lastTarget[i] + (frameTarget[i] - lastTarget[i]) * blend;
      this.integrate(step, state);
      this.accumulator = Math.max(0, this.accumulator - step);
      this.steps++;
    }
    target.set(frameTarget);
    // (A frame too short for a step, the step being coarse (FIN_QUALITY) and the screen quick: the
    // last solved shape, relative to the body, is carried with it as it is.)
    if (!completed && this.steps) return;
    const { position, rest, scratch, displacement, carried } = this;
    for (let n = 0; n < this.count; n++) {
      state.body.transform(rest[n * 3], rest[n * 3 + 1], rest[n * 3 + 2], scratch);
      for (let k = 0; k < 3; k++) {
        carried[n * 3 + k] = scratch[k];
        displacement[n * 4 + k] = position[n * 3 + k] - scratch[k];
      }
    }
    this.carriedBy = state.body;
    this.carriedAt = state.body.revision;
  }

  integrate(dt, state) {
    const { position: p, previous: old, target, columns: w, rows: h, flow, linkLengths: lengths, linkEnds: ends, linkTerms: terms } = this;
    const { heading, velocity, angularVelocity, origin, strength, direction, time, localHydrodynamics: local } = state;
    const co = Math.cos(heading), si = Math.sin(heading), dt2 = dt * dt;
    // A fin ray resists stretching, not lateral bending like a rigid sail.
    // Resting/swimming membranes are soft even in their inner half. Display
    // adds muscular tension without pinning their positions against the water.
    // (A row's stiffness, once for the row. Clamped fins are held in by muscle too.)
    const stiffness = this.rowStiffness, folded = state.clamp ?? 0;
    for (let j = 1; j < h; j++) {
      const v = j / (h - 1);
      stiffness[j] = this.kind < 3
        ? 3.8 + 36 * (1 - v) ** 2.4 + state.flare * (5 + 22 * (1 - v) ** 2) + folded * (6 + 20 * (1 - v) ** 2)
        : (this.kind === 4 ? 2.0 + 12 * folded : 5.0) + (this.kind === 3 ? 160 : 110) * (1 - v) ** 3;
    }
    for (let q = 0; q < w * 3; q++) p[q] = old[q] = target[q];
    for (let j = 1; j < h; j++) for (let i = 0; i < w; i++) {
      const q = (j * w + i) * 3;
      const a = (j * w + Math.max(0, i - 1)) * 3, b = (j * w + Math.min(w - 1, i + 1)) * 3;
      const c = ((j - 1) * w + i) * 3, d = (Math.min(h - 1, j + 1) * w + i) * 3;
      const ux = p[b] - p[a], uy = p[b + 1] - p[a + 1], uz = p[b + 2] - p[a + 2];
      const vx = p[d] - p[c], vy = p[d + 1] - p[c + 1], vz = p[d + 2] - p[c + 2];
      let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
      nx /= len; ny /= len; nz /= len;
      let rvx, rvy, rvz;
      if (local) {
        // Host fish may pitch and roll in a turbulent globe. Use the full body
        // frame and omega x radius, not a yaw-only approximation of fin drag.
        const { flow: u, velocity: v, angular: w } = local;
        rvx = u[0] - v[0] - (w[1] * p[q + 2] - w[2] * p[q + 1]) - (p[q] - old[q]) / dt;
        rvy = u[1] - v[1] - (w[2] * p[q] - w[0] * p[q + 2]) - (p[q + 1] - old[q + 1]) / dt;
        rvz = u[2] - v[2] - (w[0] * p[q + 1] - w[1] * p[q]) - (p[q + 2] - old[q + 2]) / dt;
      } else {
        const wx = co * p[q] + si * p[q + 2], wz = -si * p[q] + co * p[q + 2];
        if (state.externalFlow) {
          for (let k = 0; k < 3; k++) flow[k] = state.externalFlow[k];
        } else waterVelocity(time, wx + origin[0], p[q + 1] + origin[1], wz + origin[2], strength, direction, flow);
        // Relative fluid includes translation, turning and each membrane's own speed.
        const fx = flow[0] - velocity[0], fz = flow[2] - velocity[2];
        rvx = co * fx - si * fz - angularVelocity * p[q + 2] - (p[q] - old[q]) / dt;
        rvy = flow[1] - velocity[1] - (p[q + 1] - old[q + 1]) / dt;
        rvz = si * fx + co * fz + angularVelocity * p[q] - (p[q + 2] - old[q + 2]) / dt;
      }
      const normalSpeed = clamp(rvx * nx + rvy * ny + rvz * nz, -2, 2);
      const pressure = normalSpeed * (2.0 + Math.abs(normalSpeed) * 3.5);
      const k = stiffness[j];
      const dx = nx * pressure + rvx * 0.9, dy = ny * pressure + rvy * 0.9, dz = nz * pressure + rvz * 0.9;
      let current = p[q], acceleration = clamp((target[q] - current) * k + dx, -45, 45);
      p[q] += (current - old[q]) * 0.982 + acceleration * dt2;
      old[q] = current;
      current = p[q + 1]; acceleration = clamp((target[q + 1] - current) * k + dy, -45, 45);
      p[q + 1] += (current - old[q + 1]) * 0.982 + acceleration * dt2;
      old[q + 1] = current;
      current = p[q + 2]; acceleration = clamp((target[q + 2] - current) * k + dz, -45, 45);
      p[q + 2] += (current - old[q + 2]) * 0.982 + acceleration * dt2;
      old[q + 2] = current;
    }
    // Cross-ray chord spacing folds with the ray fan. Fin-ray lengths stay
    // fixed; unresolved accordion pleats are represented by shorter chords,
    // not by shrinking the rays. Keeping open-fan chords here would fight closure.
    // (Only those chords change: every other link keeps the rest length it was given.)
    for (let f = 0; f < this.refolding.length; f++) {
      const l = this.refolding[f], a = ends[l * 2], b = ends[l * 2 + 1];
      lengths[l] = Math.hypot(target[b] - target[a], target[b + 1] - target[a + 1], target[b + 2] - target[a + 2]);
    }
    // Alternate constraint traversal to avoid a persistent preferred bend direction.
    const passes = Math.max(3, Math.round((this.kind === 3 ? 12 : 8) * FIN_QUALITY.passScale));
    const m = lengths.length;
    for (let pass = 0; pass < passes; pass++) {
      // Pectoral rays are actively rotated by the muscular base, not merely
      // pulled by a weak spring (which filters a rapid stroke into a slow sway).
      // Actuation fades across the span; the outer membrane stays water-driven.
      if (this.kind === 3 && pass < 4) for (let j = 1; j < h; j++) {
        const v = j / (h - 1), u = clamp((v - 0.22) / 0.55, 0, 1);
        const muscle = 0.5 * (1 - u * u * (3 - 2 * u));
        for (let i = 0; i < w; i++) for (let k = 0; k < 3; k++) {
          const q = (j * w + i) * 3 + k;
          p[q] += (target[q] - p[q]) * muscle;
        }
      }
      // No permanent positional pin across the inner half of the broad fins.
      // Only the insertion is fixed; ray/membrane constraints transmit tension.
      const back = pass % 2 === 1;
      for (let s = 0; s < m; s++) {
        const l = back ? m - 1 - s : s, ai = ends[l * 2], bi = ends[l * 2 + 1];
        const dx = p[bi] - p[ai], dy = p[bi + 1] - p[ai + 1], dz = p[bi + 2] - p[ai + 2];
        const length = Math.sqrt(dx * dx + dy * dy + dz * dz), weight = terms[l * 4 + 1];
        if (length < 1e-7 || !weight) continue;
        const correction = (length - lengths[l]) / length * terms[l * 4] / weight;
        const wa = correction * terms[l * 4 + 2], wb = correction * terms[l * 4 + 3];
        p[ai] += dx * wa; p[ai + 1] += dy * wa; p[ai + 2] += dz * wa;
        p[bi] -= dx * wb; p[bi + 1] -= dy * wb; p[bi + 2] -= dz * wb;
      }
    }
    // Fast trunk strokes can otherwise stretch tiny insertion segments of the
    // long fins before the iterative membrane constraints converge. A final
    // root-to-tip ray limit carries that correction outward without moving roots.
    // The pelvic feelers need it most: it keeps every ray joined to its pinned insertion.
    if (this.kind !== 3) for (let j = 1; j < h; j++) for (let i = 0; i < w; i++) {
      const n = j * w + i, q = n * 3, a = q - w * 3;
      const dx = p[q] - p[a], dy = p[q + 1] - p[a + 1], dz = p[q + 2] - p[a + 2];
      const length = Math.hypot(dx, dy, dz), restLength = this.rayRest[n];
      if (length > 1e-7 && restLength > 1e-7) {
        const ratio = clamp(length, restLength * 0.94, restLength * 1.06) / length;
        p[q] = p[a] + dx * ratio; p[q + 1] = p[a + 1] + dy * ratio; p[q + 2] = p[a + 2] + dz * ratio;
      }
    }
    // Paired fins may fold along the flank, but must not pass through the fish.
    if (state.bodyRadius && this.side) {
      // (Each column's root frame once: every node of the column starts from it.)
      const frames = this.rootFrames, s = this.scratch;
      for (let i = 0; i < w; i++) {
        state.body.frame(this.roots[i * 3], s);
        frames[i * 4] = s[0]; frames[i * 4 + 1] = s[1]; frames[i * 4 + 2] = s[2]; frames[i * 4 + 3] = s[3];
      }
      for (let n = w; n < this.count; n++) {
        const q = n * 3, i = n % w, rootX = this.roots[i * 3];
        const cx = frames[i * 4], cz = frames[i * 4 + 1], co = frames[i * 4 + 2], si = frames[i * 4 + 3];
        const localX = rootX + (p[q] - cx) * co + (p[q + 2] - cz) * si;
        const radius = state.bodyRadius(localX, p[q + 1] - state.body.pitchFrame(localX, s)[0]);
        state.body.frame(localX, s);
        const centerX = s[0], centerZ = s[1], c = s[2], sn = s[3];
        const lateral = -(p[q] - centerX) * sn + (p[q + 2] - centerZ) * c;
        if (radius > 0 && lateral * this.side < radius + 0.009) {
          const push = this.side * (radius + 0.009) - lateral;
          p[q] -= sn * push; p[q + 2] += c * push;
          old[q] = p[q]; old[q + 2] = p[q + 2];
        }
      }
    }
  }

  metrics() {
    let maxDisplacement = 0, maxRayStrain = 0, anchorError = 0;
    for (let n = 0; n < this.count; n++) {
      maxDisplacement = Math.max(maxDisplacement, Math.hypot(...this.displacement.subarray(n * 4, n * 4 + 3)));
      if (n < this.columns) for (let k = 0; k < 3; k++) anchorError = Math.max(anchorError, Math.abs(this.position[n * 3 + k] - this.target[n * 3 + k]));
    }
    for (let n = this.columns; n < this.count; n++) {
      const a = (n - this.columns) * 3, b = n * 3;
      const original = Math.hypot(...[0, 1, 2].map(k => this.rest[a + k] - this.rest[b + k]));
      if (original > 0.005) maxRayStrain = Math.max(maxRayStrain, Math.abs(Math.hypot(...[0, 1, 2].map(k => this.position[a + k] - this.position[b + k])) / original - 1));
    }
    return { kind: this.kind, side: this.side, maxDisplacement, maxRayStrain, anchorError, steps: this.steps };
  }
}
