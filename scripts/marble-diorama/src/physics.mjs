import { updateLandingStun } from "./landing-stun.mjs";
import { landingContact } from "./landing-contact.mjs";
import { updateLaunchBonus } from "./launch-bonus.mjs";
import { ACID_RECOVERY_TICKS } from "./acid-capture.mjs";
import { vacuumAt } from "./vacuum.mjs";
import { transferForce, chooseTransfer } from "./powered-transfer.mjs";
import {
  traversalPaths,
  updateTraversalBonuses,
} from "./traversal-bonuses.mjs";
import { landingTargets, updateLandingTargets } from "./landing-targets.mjs";
import { acidShape, acidPositionAt } from "./acid.mjs";
import RAPIER from "@dimforge/rapier3d-compat";
import { compileCourse, motionAt, presenceAt, SURFACES } from "./course.mjs";
import {
  createEnemies,
  steerEnemies,
  updateEnemies,
  birdMotionAt,
} from "./enemies.mjs";
import { difficultyPreset } from "./difficulty.mjs";
export const PHYSICS_VERSION = "rapier-0.20.0-mm-25";
export const STEP = 1 / 120,
  RADIUS = 0.55,
  MASS = 1;
export const initPhysics = () => RAPIER.init();
const copy = (v) => ({ ...v }),
  mag = (v) => Math.hypot(v.x, v.y, v.z),
  clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export class Simulation {
  constructor(course, options = {}) {
    this.course = course;
    this.compiled = compileCourse(course);
    this.landingTargets = landingTargets(course);
    this.traversalPaths = traversalPaths(course);
    this.options = {
      players: 1,
      difficulty: 0,
      untimed: false,
      assisted: false,
      seed: 237,
      ...options,
    };
    this.options.players = clamp(Math.trunc(this.options.players) || 1, 1, 2);
    this.preset = difficultyPreset(this.options.difficulty);
    this.options.difficulty = this.preset.level;
    this.tick = 0;
    this.events = [];
    this.world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
    this.world.timestep = STEP;
    this.world.integrationParameters.numSolverIterations = 12;
    this.world.integrationParameters.normalizedAllowedLinearError = 0.0001;
    this.world.integrationParameters.normalizedPredictionDistance = 0.002;
    this.queue = new RAPIER.EventQueue(true);
    this.movers = [];
    for (const g of this.compiled.statics)
      this.world.createCollider(
        RAPIER.ColliderDesc.trimesh(
          g.vertices,
          g.indices,
          RAPIER.TriMeshFlags.FIX_INTERNAL_EDGES,
        )
          .setFriction(SURFACES[g.material].friction)
          .setRestitution(0.08),
      );
    for (const g of this.compiled.moving) {
      const pose = motionAt(g.part, 0),
        b = this.world.createRigidBody(
          RAPIER.RigidBodyDesc.kinematicPositionBased()
            .setTranslation(...Object.values(pose.position))
            .setRotation(pose.rotation),
        );
      const cd = ["flipper", "vacuum-mouth"].includes(g.part.profile)
        ? RAPIER.ColliderDesc.trimesh(
            g.vertices,
            g.indices,
            RAPIER.TriMeshFlags.FIX_INTERNAL_EDGES,
          )
        : RAPIER.ColliderDesc.convexHull(g.vertices);
      if (!cd) throw Error("Invalid convex moving part");
      this.world.createCollider(
        cd
          .setFriction(SURFACES[g.part.material ?? "stone"].friction)
          .setRestitution(0.05),
        b,
      );
      this.movers.push({
        part: g.part,
        handle: b.handle,
        previous: pose,
        current: pose,
      });
      b.setEnabled(presenceAt(g.part, 0).visible);
    }
    this.players = Array.from({ length: this.options.players }, (_, i) =>
      this.addPlayer(i),
    );
    this.enemies = createEnemies(this);
    this.acid = (course.zones ?? [])
      .filter((z) => z.kind === "acid")
      .map((zone) => ({
        zone,
        handle: this.world.createCollider(
          RAPIER.ColliderDesc.trimesh(
            acidShape(zone, 0).vertices,
            acidShape(zone, 0).indices,
          )
            .setTranslation(...Object.values(acidPositionAt(zone, 0)))
            .setSensor(true),
        ).handle,
      }));
  }
  addPlayer(i) {
    const s = this.course.starts[i % this.course.starts.length],
      b = this.world.createRigidBody(
        RAPIER.RigidBodyDesc.dynamic()
          .setTranslation(s.x, s.y, s.z)
          .setCcdEnabled(true)
          .setCanSleep(true)
          .setLinearDamping(0),
      );
    const col = this.world.createCollider(
      RAPIER.ColliderDesc.ball(RADIUS)
        .setMass(MASS)
        .setFriction(0.95)
        .setFrictionCombineRule(RAPIER.CoefficientCombineRule.Min)
        .setRestitution(0.08)
        .setActiveEvents(RAPIER.ActiveEvents.CONTACT_FORCE_EVENTS)
        .setContactForceEventThreshold(15),
      b,
    );
    const pose = { position: copy(s), rotation: copy(b.rotation()) };
    return {
      handle: b.handle,
      collider: col.handle,
      previous: pose,
      current: pose,
      time: this.course.time,
      score: 0,
      status: "racing",
      checkpoint: -1,
      deaths: 0,
      campaignDeaths: 0,
      finishTick: null,
      grounded: false,
      respawnTick: 0,
      springTick: 0,
      stunTick: 0,
      stunnedUntil: 0,
      impactAirTicks: 0,
      impactLaunched: false,
      launchBonusPending: null,
      progress: 0,
      safePosition: copy(s),
      safeHistory: [],
    };
  }
  body(p) {
    return this.world.getRigidBody(p.handle);
  }
  respawnPosition(p) {
    return this.options.assisted && p.checkpoint >= 0
      ? this.course.checkpoints[p.checkpoint]
      : this.course.rules?.respawn === "last-safe"
        ? p.safePosition
        : this.course.starts[
            this.players.indexOf(p) % this.course.starts.length
          ];
  }
  respawn(p) {
    const s = p.acidCapture?.destination ?? this.respawnPosition(p);
    const b = this.body(p);
    b.setEnabled(true);
    b.setTranslation(s, true);
    b.setLinvel({ x: 0, y: 0, z: 0 }, true);
    b.setAngvel({ x: 0, y: 0, z: 0 }, true);
    b.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true);
    p.status = "racing";
    p.vacuumCapture = null;
    p.acidCapture = null;
    p.stunnedUntil = 0;
    p.impactAirTicks = 0;
    p.impactLaunched = false;
    p.launchBonusPending = null;
    p.safeHistory = [];
    p.previous = p.current = {
      position: copy(s),
      rotation: copy(b.rotation()),
    };
    this.events.push({ type: "respawn", player: this.players.indexOf(p) });
  }
  step(inputs = []) {
    this.events = [];
    this.tick++;
    for (const a of this.acid) {
      const time = this.tick * STEP * this.preset.machineSpeed;
      const geometry = acidShape(a.zone, time),
        collider = this.world.getCollider(a.handle);
      if (a.geometry !== geometry) {
        collider.setShape(
          RAPIER.ColliderDesc.trimesh(geometry.vertices, geometry.indices)
            .shape,
        );
        a.geometry = geometry;
      }
      collider.setTranslation(acidPositionAt(a.zone, time));
    }
    steerEnemies(this, STEP);
    for (const m of this.movers) {
      m.previous = m.current;
      const machineTime =
        m.part.motion.axis === "launch"
          ? m.launchTick === undefined
            ? 0
            : (this.tick - m.launchTick) * STEP
          : this.tick * STEP * this.preset.machineSpeed;
      m.current = motionAt(m.part, machineTime);
      if (
        m.part.profile === "flipper" &&
        m.launchTick !== undefined &&
        this.tick - m.launchTick ===
          Math.ceil((m.part.motion.delay ?? 0.5) / STEP) + 1
      )
        this.events.push({
          type: "spring",
          player: m.launchPlayer,
          part: m.part.id,
        });
      const b = this.world.getRigidBody(m.handle);
      if (m.current.vertices)
        b.collider(0).setShape(
          RAPIER.ColliderDesc.convexHull(m.current.vertices).shape,
        );
      b.setEnabled(
        presenceAt(m.part, this.tick * STEP * this.preset.machineSpeed).visible,
      );
      b.setNextKinematicTranslation(m.current.position);
      b.setNextKinematicRotation(m.current.rotation);
    }
    for (let i = 0; i < this.players.length; i++) {
      const p = this.players[i],
        b = this.body(p);
      p.previous = p.current;
      if (p.status === "finished" || p.status === "timeout") continue;
      if (!this.options.untimed)
        p.time = Math.max(
          0,
          p.time -
            STEP * (this.course.rules?.timerRate ?? 1) * this.preset.clockRate,
        );
      if (p.time === 0 && !this.options.untimed) {
        p.status = "timeout";
        b.setBodyType(RAPIER.RigidBodyType.Fixed, true);
        b.setEnabled(false);
        this.events.push({ type: "timeout", player: i });
        continue;
      }
      if (p.status === "falling") {
        if (this.tick >= p.respawnTick) this.respawn(p);
        continue;
      }
      const pos = b.translation(),
        v = b.linvel(),
        w = b.angvel();
      const ray = new RAPIER.Ray(pos, { x: 0, y: -1, z: 0 });
      const hit = this.world.castRayAndGetNormal(
        ray,
        RADIUS + 0.09,
        true,
        undefined,
        undefined,
        this.world.getCollider(p.collider),
        b,
      );
      p.grounded = !!hit;
      p.groundNormal = hit ? copy(hit.normal) : null;
      const landingBonus = updateLandingTargets(
        this.landingTargets,
        p,
        pos,
        RADIUS,
      );
      if (landingBonus) this.events.push({ ...landingBonus, player: i });
      if (hit && hit.timeOfImpact < RADIUS + 0.015) p.landingAirTicks = 0;
      if (
        this.course.rules?.respawn === "last-safe" &&
        p.grounded &&
        this.tick % 30 === 0 &&
        Math.hypot(v.x, v.z) < 6
      ) {
        const supported = [
          [RADIUS * 1.4, 0],
          [-RADIUS * 1.4, 0],
          [0, RADIUS * 1.4],
          [0, -RADIUS * 1.4],
        ].every(([dx, dz]) =>
          this.world.castRay(
            new RAPIER.Ray(
              { x: pos.x + dx, y: pos.y + 0.1, z: pos.z + dz },
              { x: 0, y: -1, z: 0 },
            ),
            RADIUS + 0.4,
            true,
            undefined,
            undefined,
            this.world.getCollider(p.collider),
            b,
          ),
        );
        if (supported)
          p.safeHistory.push({ tick: this.tick, position: copy(pos) });
        while (p.safeHistory.length && p.safeHistory[0].tick <= this.tick - 120)
          p.safePosition = p.safeHistory.shift().position;
      }
      const input = (this.tick < p.stunnedUntil ? null : inputs[i]) ?? {
          x: 0,
          z: 0,
          turbo: false,
        },
        x = clamp(Number(input.x) || 0, -1, 1),
        z = clamp(Number(input.z) || 0, -1, 1),
        n = Math.max(1, Math.hypot(x, z));
      if (p.grounded) {
        const speed = Math.hypot(v.x, v.z),
          max = input.turbo ? 12 : 8,
          along = (v.x * x + v.z * z) / Math.max(speed, 0.001),
          gain = along > 0 ? clamp((max - speed) / 2, 0, 1) : 1,
          torque = (input.turbo ? 2.2 : 1.35) * gain;
        b.applyTorqueImpulse(
          { x: (z / n) * torque * STEP, y: 0, z: (-x / n) * torque * STEP },
          true,
        );
        // Contact-only rolling resistance leaves airborne angular momentum intact.
        const wm = mag(w),
          res = Math.min(0.025 * STEP, wm * 0.4 * MASS * RADIUS * RADIUS);
        if (wm > 0.00001)
          b.applyTorqueImpulse(
            {
              x: (-w.x / wm) * res,
              y: (-w.y / wm) * res,
              z: (-w.z / wm) * res,
            },
            false,
          );
      }
      for (const zone of this.course.zones ?? []) {
        if (
          !presenceAt(zone, this.tick * STEP * this.preset.machineSpeed).visible
        )
          continue;
        const vacuum =
          zone.kind === "vacuum"
            ? vacuumAt(
                zone,
                this.tick * STEP * this.preset.machineSpeed,
                this.course.parts,
              )
            : null;
        if (vacuum && !vacuum.active) continue;
        const center = vacuum?.position ?? zone;
        const dist = Math.hypot(
          pos.x - center.x,
          pos.y - center.y,
          pos.z - center.z,
        );
        if (dist < zone.radius && zone.kind === "magnet" && dist > 0.01)
          b.applyImpulse(
            {
              x: (zone.x - pos.x) * zone.strength * STEP * this.preset.force,
              y: 0,
              z: (zone.z - pos.z) * zone.strength * STEP * this.preset.force,
            },
            true,
          );
        if (dist < zone.radius && zone.kind === "hazard") this.fall(p);
        if (zone.kind === "vacuum" && dist < zone.radius && dist > 0.01) {
          const q = vacuum.direction,
            dot = ((pos.x - center.x) * q.x + (pos.z - center.z) * q.z) / dist;
          if (dot > 0.35) {
            const force =
              zone.strength *
              vacuum.strength *
              (1 - dist / zone.radius) *
              this.preset.force;
            b.applyImpulse(
              {
                x: ((center.x - pos.x) / dist) * force * STEP,
                y: ((center.y - pos.y) / dist) * force * STEP,
                z: ((center.z - pos.z) / dist) * force * STEP,
              },
              true,
            );
            if (dist < 0.7) this.fall(p, { cause: "vacuum", intake: center });
          }
        }
      }
      for (const s of this.course.parts.filter((s) => s.kind === "spring")) {
        const cs = Math.cos(s.angle ?? 0),
          sn = Math.sin(s.angle ?? 0),
          dx = pos.x - s.x,
          dz = pos.z - s.z;
        const arm = this.movers.find((m) => m.part.id === s.id);
        if (s.profile === "flipper") {
          const resting =
            arm.launchTick === undefined ||
            (this.tick - arm.launchTick) * STEP >
              s.motion.period + (s.motion.delay ?? 0.5);
          const localX = dx * cs + dz * sn,
            localZ = -dx * sn + dz * cs;
          if (
            resting &&
            p.grounded &&
            Math.hypot(localX, localZ - (s.d - s.w) / 2) < s.w * 0.38 &&
            Math.abs(pos.y - s.y - RADIUS) < 0.25
          ) {
            arm.launchTick = this.tick;
            arm.launchPlayer = i;
          }
          continue;
        }
        if (
          p.grounded &&
          this.tick - p.springTick > 90 &&
          Math.abs(dx * cs + dz * sn) < s.w / 2 &&
          Math.abs(-dx * sn + dz * cs) < s.d / 2 &&
          Math.abs(pos.y - s.y - RADIUS) < 0.15
        ) {
          const launch = s.launch ?? { lateral: 0, up: 7, forward: 3 };
          const velocity = launch.velocity ? b.linvel() : { x: 0, y: 0, z: 0 };
          b.applyImpulse(
            {
              x: launch.lateral * cs - launch.forward * sn - velocity.x,
              y: launch.up - velocity.y,
              z: launch.lateral * sn + launch.forward * cs - velocity.z,
            },
            true,
          );
          p.springTick = this.tick;
          p.impactLaunched = true;
          p.launchBonusPending = s.launchBonus
            ? { part: s.id, airborne: false }
            : null;
          if (arm) arm.launchTick = this.tick;
          this.events.push({ type: "spring", player: i, part: s.id });
        }
      }
    }
    for (const [index, p] of this.players.entries()) {
      const wasPowered = p.poweredTransfer;
      p.poweredTransfer = null;
      if (p.status !== "racing") continue;
      const b = this.body(p);
      if (!wasPowered) {
        const choice = chooseTransfer(
          this.traversalPaths,
          b.translation(),
          RADIUS,
          this.options.seed ^ this.tick ^ (index * 0x9e3779b9),
          this.players
            .filter((q) => q !== p && q.status === "racing")
            .map((q) => this.body(q).translation()),
        );
        if (choice) p.transferRoute = choice;
      }
      const flow = transferForce(
        this.traversalPaths,
        b.translation(),
        b.linvel(),
        RADIUS,
        p.transferRoute,
      );
      if (flow) {
        p.poweredTransfer = flow.id;
        b.applyImpulse(
          {
            x: flow.acceleration.x * MASS * STEP,
            y: flow.acceleration.y * MASS * STEP,
            z: flow.acceleration.z * MASS * STEP,
          },
          true,
        );
      }
    }
    const incomingVelocity = this.players.map((p) =>
      copy(this.body(p).linvel()),
    );
    this.world.step(this.queue);
    for (let i = 0; i < this.players.length; i++) {
      const p = this.players[i];
      if (
        p.status !== "racing" ||
        (!this.course.rules?.landingStun && !p.launchBonusPending)
      )
        continue;
      const contact = landingContact(this, p, incomingVelocity[i], RADIUS);
      updateLandingStun(this, p, contact);
      const award = updateLaunchBonus(this, p, contact, RADIUS);
      if (award) this.events.push({ ...award, player: i });
    }
    updateEnemies(this);
    for (const acid of this.acid)
      for (const p of this.players)
        if (
          p.status === "racing" &&
          this.world.intersectionPair(
            this.world.getCollider(acid.handle),
            this.world.getCollider(p.collider),
          )
        )
          this.fall(p, { cause: "acid", zone: acid.zone });
    for (const m of this.movers) {
      const b = this.world.getRigidBody(m.handle);
      m.current = {
        ...m.current, // Preserve the deforming hull for rendering and snapshots.
        position: copy(b.translation()),
        rotation: copy(b.rotation()),
      };
    }
    this.queue.drainContactForceEvents((e) => {
      const force = e.totalForceMagnitude();
      if (force > 15)
        this.events.push({
          type: "impact",
          force,
          collider1: e.collider1(),
          collider2: e.collider2(),
        });
    });
    for (let i = 0; i < this.players.length; i++) {
      const p = this.players[i],
        b = this.body(p),
        pos = b.translation();
      p.current = { position: copy(pos), rotation: copy(b.rotation()) };
      if (p.status !== "racing") continue;
      if (pos.y < -12) {
        this.fall(p);
        continue;
      }
      for (const event of updateTraversalBonuses(
        this.traversalPaths,
        p,
        pos,
        RADIUS,
      ))
        this.events.push({ ...event, player: i });
      for (let j = 0; j < (this.course.checkpoints ?? []).length; j++) {
        const c = this.course.checkpoints[j];
        if (
          j > p.checkpoint &&
          Math.hypot(pos.x - c.x, pos.y - c.y, pos.z - c.z) < 2
        ) {
          p.checkpoint = j;
          this.events.push({ type: "checkpoint", player: i });
        }
      }
      const progress = Math.max(
        0,
        (this.course.starts[0].z - pos.z) *
          (this.course.goal.z < this.course.starts[0].z ? 1 : -1),
      );
      if (progress > p.progress) {
        p.score += Math.floor(progress * 10) - Math.floor(p.progress * 10);
        p.progress = progress;
      }
      const g = this.course.goal,
        gc = Math.cos(g.angle ?? 0),
        gs = Math.sin(g.angle ?? 0),
        gx = (pos.x - g.x) * gc + (pos.z - g.z) * gs,
        gz = -(pos.x - g.x) * gs + (pos.z - g.z) * gc;
      if (
        Math.abs(gx) < (g.width ?? 4) / 2 &&
        Math.abs(gz) < (g.depth ?? 2.4) / 2 &&
        Math.abs(pos.y - (g.y + RADIUS)) < 0.25 &&
        p.grounded
      ) {
        p.status = "finished";
        p.finishTick = this.tick;
        p.score += this.course.rules?.finishBonus ?? 0;
        p.score += this.options.untimed
          ? 0
          : Math.floor(p.time) * (this.course.rules?.finishPointRate ?? 10);
        b.setBodyType(RAPIER.RigidBodyType.Fixed, true);
        b.setEnabled(false);
        this.events.push({ type: "finish", player: i });
      }
    }
    return this.events;
  }
  fall(p, detail) {
    if (p.status !== "racing") return;
    p.status = "falling";
    p.stunnedUntil = 0;
    p.impactAirTicks = 0;
    p.impactLaunched = false;
    p.launchBonusPending = null;
    this.body(p).setEnabled(false);
    p.deaths++;
    const vacuum = detail?.cause === "vacuum";
    const acid = detail?.cause === "acid";
    p.respawnTick =
      this.tick + (vacuum ? 252 : acid ? ACID_RECOVERY_TICKS : 90);
    if (acid) {
      const origin = this.body(p).translation();
      const pool = acidPositionAt(
        detail.zone,
        this.tick * STEP * this.preset.machineSpeed,
      );
      p.acidCapture = {
        tick: this.tick,
        zone: this.course.zones.indexOf(detail.zone),
        offset: {
          x: origin.x - pool.x,
          y: origin.y - pool.y,
          z: origin.z - pool.z,
        },
        rotation: copy(this.body(p).rotation()),
        destination: copy(this.respawnPosition(p)),
      };
    } else p.acidCapture = null;
    p.vacuumCapture = vacuum
      ? {
          tick: this.tick,
          origin: copy(this.body(p).translation()),
          intake: copy(detail.intake),
          destination: copy(this.respawnPosition(p)),
        }
      : null;
    p.landingAirTicks = 0;
    p.traversals = {};
    p.transferRoute = null;
    this.events.push({
      type: "fall",
      player: this.players.indexOf(p),
      ...(vacuum ? { cause: "vacuum" } : acid ? { cause: "acid" } : {}),
    });
  }
  snapshot() {
    return {
      tick: this.tick,
      world: Array.from(this.world.takeSnapshot()),
      players: structuredClone(this.players),
      movers: structuredClone(this.movers),
      enemies: structuredClone(this.enemies),
    };
  }
  restore(s) {
    this.world.free();
    this.world = RAPIER.World.restoreSnapshot(Uint8Array.from(s.world));
    this.tick = s.tick;
    this.players = structuredClone(s.players);
    this.movers = structuredClone(s.movers);
    this.enemies = structuredClone(s.enemies ?? []);
    this.events = [];
    // Cached shapes are only an optimization, never restored simulation state.
    for (const a of this.acid) a.geometry = null;
  }
  dispose() {
    this.queue.free();
    this.world.free();
  }
}

export class FixedClock {
  constructor(step) {
    this.run = step;
    this.accumulator = 0;
    this.paused = false;
  }
  advance(seconds) {
    if (this.paused || !Number.isFinite(seconds) || seconds < 0) return 0;
    this.accumulator += seconds;
    let count = 0;
    while (!this.paused && this.accumulator + 1e-10 >= STEP) {
      this.accumulator -= STEP;
      this.run();
      count++;
    }
    return count;
  }
  get alpha() {
    return Math.max(0, this.accumulator / STEP);
  }
  pause(value) {
    this.paused = value;
    this.accumulator = 0;
  }
}
export class DemoController {
  constructor() {
    this.index = 0;
    this.lastDeath = 0;
    this.recovering = false;
    this.exitRoute = null;
  }
  input(sim, player = 0) {
    if (sim.players[player].poweredTransfer) return { x: 0, z: 0 };
    const p = sim.players[player],
      b = sim.body(p),
      pos = b.translation(),
      v = b.linvel(),
      exitRoute = p.traversalClaims?.includes(p.transferRoute?.id)
        ? sim.course.alternateRoutes?.find(
            (r) => r.id === p.transferRoute?.exitRoute,
          )
        : null,
      playerRoute =
        exitRoute?.route ??
        (sim.players.length === 1 && sim.course.route?.length
          ? sim.course.route
          : sim.course.playerRoutes?.[player]),
      route = playerRoute?.length
        ? playerRoute
        : sim.course.route?.length
          ? sim.course.route
          : [sim.course.goal];
    if (this.exitRoute !== (exitRoute?.id ?? null)) {
      this.exitRoute = exitRoute?.id ?? null;
      this.recovering = true;
    }
    if (p.deaths !== this.lastDeath) {
      this.recovering = true;
      this.lastDeath = p.deaths;
    }
    if (p.status !== "racing") return { x: 0, z: 0, turbo: false };
    if (this.recovering) {
      this.index = route.reduce(
        (best, t, i) =>
          Math.hypot(t.x - pos.x, t.y - pos.y, t.z - pos.z) <
          Math.hypot(
            route[best].x - pos.x,
            route[best].y - pos.y,
            route[best].z - pos.z,
          )
            ? i
            : best,
        0,
      );
      this.recovering = false;
    }
    this.index = Math.min(Math.max(this.index, 0), route.length - 1);
    const collectible = (t) =>
      t.collect
        ? sim.enemies.find(
            (e) => e.def.id === t.collect && e.def.kind === "mini",
          )
        : null;
    // Collection waypoints follow a miniature's measured position, but only
    // within the authored safe area. A missed or fallen miniature must not
    // trap the demonstration in a chase or send it over the edge.
    while (route[this.index]?.collect && this.index < route.length - 1) {
      const waypoint = route[this.index],
        enemy = collectible(waypoint);
      if (this.collectionIndex !== this.index) {
        this.collectionIndex = this.index;
        this.collectionTick = sim.tick;
      }
      const ep = enemy?.current.position;
      if (
        !enemy ||
        enemy.collected ||
        sim.tick - this.collectionTick > 8 / STEP ||
        Math.hypot(ep.x - waypoint.x, ep.z - waypoint.z) > 4 ||
        Math.abs(ep.y - enemy.def.radius - waypoint.y) > 1
      )
        this.index++;
      else break;
    }
    const resolve = (t) => {
      const enemy = collectible(t);
      if (enemy && !enemy.collected)
        return {
          ...t,
          ...enemy.current.position,
          y: enemy.current.position.y - enemy.def.radius,
        };
      const mover = t.part
        ? sim.movers.find((m) => m.part.id === t.part)
        : null;
      return mover ? { ...t, ...mover.current.position } : t;
    };
    let target = resolve(route[this.index]);
    const waiting = target.waitFor;
    // A collision can push a marble beyond a tight waypoint. Once settled
    // beside it, continue along the next leg rather than steering backward
    // indefinitely. Stop markers and timed crossings must still be reached.
    const nextWaypoint = route[Math.min(this.index + 1, route.length - 1)];
    const nearWaypoint =
      Math.hypot(pos.x - target.x, pos.z - target.z) <
      Math.max(target.radius ?? 0.75, RADIUS * 2.5);
    if (nearWaypoint && Math.hypot(v.x, v.z) < 0.2)
      this.stalledTicks = (this.stalledTicks ?? 0) + 1;
    else this.stalledTicks = 0;
    const passedCorner =
      this.stalledTicks > 120 &&
      !target.stop &&
      !waiting &&
      Math.abs(pos.y - RADIUS - target.y) < 0.25 &&
      Math.hypot(pos.x - nextWaypoint.x, pos.z - nextWaypoint.z) <
        Math.hypot(target.x - nextWaypoint.x, target.z - nextWaypoint.z);
    const movingGate = waiting
      ? sim.movers.find((m) => m.part.id === waiting.part)
      : null;
    const pegBed = target.waitForPegBed;
    const pegBedClear =
      !pegBed ||
      sim.movers
        .filter((m) => m.part.id.startsWith(pegBed))
        .every(({ part }) => {
          const length = Math.hypot(
            nextWaypoint.x - pos.x,
            nextWaypoint.z - pos.z,
          );
          const ux = (nextWaypoint.x - pos.x) / length,
            uz = (nextWaypoint.z - pos.z) / length;
          const forward = (part.x - pos.x) * ux + (part.z - pos.z) * uz;
          const side = Math.abs((part.x - pos.x) * uz - (part.z - pos.z) * ux);
          if (side > RADIUS + part.w / 2 + 0.12) return true;
          const crossingSpeed = (nextWaypoint.speed ?? 2.4) * 1.6;
          for (let ahead = 0; ahead < 2.4; ahead += 0.04) {
            const travel = crossingSpeed * Math.max(0, ahead - 0.3);
            if (Math.abs(forward - travel) > RADIUS + part.w / 2 + 0.5)
              continue;
            if (
              motionAt(
                part,
                (sim.tick * STEP + ahead) * sim.preset.machineSpeed,
              ).position.y >
              part.y + 0.03
            )
              return false;
          }
          return true;
        });
    const gateOpen =
      pegBedClear &&
      (!waiting ||
        (movingGate &&
          presenceAt(movingGate.part, sim.tick * STEP * sim.preset.machineSpeed)
            .visible &&
          presenceAt(movingGate.part, sim.tick * STEP * sim.preset.machineSpeed)
            .remaining >= (waiting.remaining ?? 0) &&
          movingGate.current.position[waiting.axis] >= waiting.min &&
          movingGate.current.position[waiting.axis] <= waiting.max &&
          (!waiting.rising ||
            sim.world.getRigidBody(movingGate.handle).linvel()[waiting.axis] >
              0)));
    if (
      !target.collect &&
      (Math.hypot(pos.x - target.x, pos.z - target.z) <
        (target.radius ?? 0.75) ||
        passedCorner) &&
      (!target.stop || Math.hypot(v.x, v.z) < 0.6) &&
      gateOpen &&
      this.index < route.length - 1
    )
      target = resolve(route[++this.index]);
    const previous = this.index
      ? route[this.index - 1]
      : sim.course.starts[player % sim.course.starts.length];
    const next = route[Math.min(this.index + 1, route.length - 1)];
    const ax = target.x - previous.x,
      az = target.z - previous.z,
      bx = next.x - target.x,
      bz = next.z - target.z;
    const cosine =
      (ax * bx + az * bz) /
      Math.max(0.001, Math.hypot(ax, az) * Math.hypot(bx, bz));
    // Preserve authored slow approaches, including the leg before a narrow
    // entrance. Broad runs can use turbo with earlier velocity correction.
    const precise = target.stop || (target.radius ?? 0.75) <= 0.6;
    const maximum = Math.min(
        (target.speed ?? 3.5) * (precise ? 1 : 1.6),
        (next.radius ?? 0.75) <= 0.6 ? (next.speed ?? 3.5) : Infinity,
      ),
      cornerSpeed =
        this.index === route.length - 1
          ? 0.5
          : (precise || !target.flow ? 0.5 : 1) + 3 * Math.max(0, cosine) ** 4;
    // Begin turning toward the next leg inside an explicitly authored broad
    // corner. Tight entries, stops, moving gates and pickups retain direct aim.
    // This is a steering target only; the rigid body still follows normal input.
    const lookahead =
      target.flow &&
      !precise &&
      !target.collect &&
      this.index < route.length - 1
        ? Math.max(
            0,
            (target.radius ?? 0.75) * 2 -
              Math.hypot(target.x - pos.x, target.z - pos.z),
          ) * 0.5
        : 0;
    const segment = Math.max(
      0.01,
      Math.hypot(next.x - target.x, next.z - target.z),
    );
    const dx = target.x - pos.x + ((next.x - target.x) / segment) * lookahead,
      dz = target.z - pos.z + ((next.z - target.z) / segment) * lookahead,
      dist = Math.hypot(dx, dz),
      cruisingSpeed = Math.min(
        maximum,
        target.stop
          ? Math.sqrt(2 * 1.5 * Math.max(0, dist - 0.2))
          : Math.sqrt(2 * 1.5 * Math.max(0, dist - 0.75)) + cornerSpeed,
      );
    // Give the earlier player priority at intersecting approaches. Predict
    // closest approach from measured velocities and brake before entering the
    // crossing; neither marble is moved or made non-colliding by the demo.
    const traffic = sim.players.slice(0, player).some((other) => {
      if (other.status !== "racing") return false;
      const ob = sim.body(other),
        op = ob.translation(),
        ov = ob.linvel();
      if (Math.abs(op.y - pos.y) > RADIUS * 2) return false;
      // Ordinary following/overtaking is not a crossing conflict.
      const speeds = Math.hypot(v.x, v.z) * Math.hypot(ov.x, ov.z);
      if (speeds > 0.1 && (v.x * ov.x + v.z * ov.z) / speeds > 0.75)
        return false;
      const rx = op.x - pos.x,
        rz = op.z - pos.z;
      const vx = ov.x - v.x,
        vz = ov.z - v.z;
      const relativeSpeed2 = vx * vx + vz * vz;
      if (relativeSpeed2 < 0.01) return false;
      const closestTime = -(rx * vx + rz * vz) / relativeSpeed2;
      return (
        closestTime > 0 &&
        closestTime < 2.5 &&
        Math.hypot(rx + vx * closestTime, rz + vz * closestTime) <
          RADIUS * 2 + 0.5
      );
    });
    const birdCrossing = sim.enemies.some((enemy) => {
      if (enemy.def.kind !== "bird" || enemy.collected) return false;
      const home = enemy.def,
        direction = home.direction;
      if (Math.abs(home.y - pos.y) > RADIUS + home.radius) return false;
      const rx = home.x - pos.x,
        rz = home.z - pos.z;
      // Only wait outside the flight corridor. Once in it, keep rolling out;
      // stopping under an approaching bird would turn a near miss into a hit.
      const clearance = RADIUS + home.radius + 0.4;
      if (
        Math.abs(rx * direction.z - rz * direction.x) /
          Math.hypot(direction.x, direction.z) <
        clearance
      )
        return false;
      // Include the next launch while a bird is resting off the board. Its
      // physical flight and this forecast use the same clock and motion rule.
      for (let ahead = 0.15; ahead <= 2.4; ahead += 0.15) {
        const future = birdMotionAt(
          home,
          sim.tick * STEP + ahead,
          sim.preset.enemySpeed,
        );
        const travel = Math.min(dist, cruisingSpeed * ahead);
        if (
          future.active &&
          Math.hypot(
            future.position.x - pos.x - (dx / Math.max(dist, 0.01)) * travel,
            future.position.z - pos.z - (dz / Math.max(dist, 0.01)) * travel,
          ) < clearance
        )
          return true;
      }
      return false;
    });
    const speed = traffic || birdCrossing ? 0 : cruisingSpeed;
    // Counter gravity on descents as well as climbs. Slip feedback limits
    // excessive spin before a low-friction surface grips again.
    const compensation = p.groundNormal
      ? (-9.81 * RADIUS * p.groundNormal.y) / 2.2
      : 0;
    const errorX =
        (dx / Math.max(dist, 0.01)) * speed -
        v.x +
        0.6 * (v.x + b.angvel().z * RADIUS) +
        compensation * (p.groundNormal?.x ?? 0),
      errorZ =
        (dz / Math.max(dist, 0.01)) * speed -
        v.z +
        0.6 * (v.z - b.angvel().x * RADIUS) +
        compensation * (p.groundNormal?.z ?? 0),
      inputMagnitude = Math.max(0.5, Math.hypot(errorX, errorZ)),
      x = errorX / inputMagnitude,
      z = errorZ / inputMagnitude;
    return { x, z, turbo: true };
  }
}
