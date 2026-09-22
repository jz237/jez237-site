import { createNativeFlags, advanceNativeFlags } from "./native-flags.mjs";
import { createBirdSequence } from "./native-bird.mjs";
import { createMiniatureSequence } from "./native-miniature.mjs";
import { advanceNativeMiniatures } from "./native-miniature-physics.mjs";
import { advanceNativeBirds } from "./native-bird-physics.mjs";
import { finishBirdCapture } from "./bird-capture.mjs";
import { createAerialPegs, advanceAerialPegs } from "./aerial-pegs.mjs";
import {
  createTerrainNavigation,
  advanceTerrainNavigation,
  terrainTileAt,
} from "./terrain-navigation.mjs";
import { createNativeCamera, advanceNativeCamera } from "./native-camera.mjs";
import {
  createAerialHammers,
  advanceAerialHammers,
} from "./aerial-hammers.mjs";
import { updateLandingStun, landingControlScale } from "./landing-stun.mjs";
import { landingContact } from "./landing-contact.mjs";
import { updateNativePracticeLanding } from "./native-practice-landings.mjs";
import { updateLaunchBonus } from "./launch-bonus.mjs";
import { ACID_RECOVERY_TICKS } from "./acid-capture.mjs";
import { vacuumAt } from "./vacuum.mjs";
import { nativeDynamics } from "./native-dynamics.mjs";
import { physicalNativePipes } from "./native-pipe-physics.mjs";
import { applyNativeSlope } from "./native-slopes.mjs";
import {
  createAerialPaddle,
  advanceAerialPaddle,
  queuePaddleContact,
  paddleLaunchVelocity,
} from "./aerial-paddle.mjs";
import {
  createAerialVacuums,
  advanceAerialVacuums,
  aerialVacuumPoses,
  nativeVacuumEffect,
  scheduleVacuumRetirement,
} from "./aerial-vacuums.mjs";
import {
  createTerrainAnimations,
  advanceTerrainAnimations,
} from "./animated-terrain.mjs";
import { transferForce, chooseTransfer } from "./powered-transfer.mjs";
import { physicalNativeTransfer } from "./native-transfer-physics.mjs";
import {
  traversalPaths,
  updateTraversalBonuses,
} from "./traversal-bonuses.mjs";
import { landingTargets, updateLandingTargets } from "./landing-targets.mjs";
import { acidShape, acidPositionAt } from "./acid.mjs";
import { createAcidSequence, holdAcidOnContact } from "./native-acid.mjs";
import { advanceNativeAcids } from "./native-acid-physics.mjs";
import RAPIER from "@dimforge/rapier3d-compat";
import { finishSlinkyCapture, SLINKY_REFORM_TICKS } from "./slinky-capture.mjs";
import { compileCourse, motionAt, presenceAt, SURFACES } from "./course.mjs";
import {
  createEnemies,
  steerEnemies,
  updateEnemies,
  birdMotionAt,
} from "./enemies.mjs";
import { difficultyPreset } from "./difficulty.mjs";
import { courseTime } from "./rules.mjs";
export const PHYSICS_VERSION = "rapier-0.20.0-mm-41";
export const STEP = 1 / 120,
  RADIUS = 0.55,
  MASS = 1;
// The published 2.2 turbo torque could not reach even the screen-space
// displacement observed from rest in the Amiga opening. See CONTROL-RESPONSE.md.
// This clears that conservative envelope; full input/trajectory calibration
// remains open. Demo paths use gentler torque through ordinary analog input.
export const STEERING_TORQUE = Object.freeze({ normal: 1.35, turbo: 4.4 });
const DEMO_TORQUE = 3.3;
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
    this.terrainAnimations = createTerrainAnimations(
      course,
      this.options.players,
    );
    this.preset = difficultyPreset(this.options.difficulty);
    this.options.difficulty = this.preset.level;
    this.tick = 0;
    this.nativeCamera = course.nativeCamera
      ? createNativeCamera(course.nativeCamera)
      : null;
    this.nativeFlags = createNativeFlags(course);
    this.nativeBirds = course.birdSequence
      ? createBirdSequence(this.options.seed)
      : null;
    this.nativeAcids = course.acidSequence
      ? createAcidSequence(this.options.seed)
      : null;
    this.nativeMiniatures = course.miniatureSequence
      ? createMiniatureSequence(this.options.seed)
      : null;
    this.aerialHammers = createAerialHammers(course);
    this.aerialPegs = createAerialPegs(course, this.options.seed);
    this.aerialVacuums = createAerialVacuums(course);
    this.aerialPaddle = createAerialPaddle(course, this.options.seed);
    this.nativeVacuumPoses = aerialVacuumPoses(course, this.aerialVacuums);
    this.events = [];
    this.nativeDynamics = nativeDynamics(course);
    this.world = new RAPIER.World({
      x: 0,
      y: -this.nativeDynamics.gravity,
      z: 0,
    });
    this.world.timestep = STEP;
    this.world.integrationParameters.numSolverIterations = 12;
    this.world.integrationParameters.normalizedAllowedLinearError = 0.0001;
    this.world.integrationParameters.normalizedPredictionDistance = 0.002;
    if (course.parts.some((part) => part.nativePipe)) {
      // Prepare contact constraints before two fast marbles meet in the Y.
      // These are solver tolerances; collider and rendered radii stay .55.
      this.world.integrationParameters.normalizedPredictionDistance = 0.15;
      this.world.integrationParameters.contact_natural_frequency = 120;
    }
    this.queue = new RAPIER.EventQueue(true);
    this.movers = [];
    this.staticColliderHandles = [];
    for (const g of this.compiled.statics)
      this.staticColliderHandles.push(
        this.world.createCollider(
          RAPIER.ColliderDesc.trimesh(
            g.vertices,
            g.indices,
            RAPIER.TriMeshFlags.FIX_INTERNAL_EDGES,
          )
            .setFriction(SURFACES[g.material].friction)
            .setRestitution(0.08),
        ).handle,
      );
    for (const g of this.compiled.moving) {
      const pose = motionAt(g.part, 0),
        b = this.world.createRigidBody(
          RAPIER.RigidBodyDesc.kinematicPositionBased()
            .setTranslation(...Object.values(pose.position))
            .setRotation(pose.rotation),
        );
      const cd =
        g.part.motion.axis === "terrain-sequence" ||
        ["flipper", "vacuum-mouth", "hammer"].includes(g.part.profile)
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
      b.setEnabled(pose.visible ?? presenceAt(g.part, 0).visible);
      if (g.part.motion.axis === "terrain") b.collider(0).setEnabled(false);
    }
    this.players = Array.from({ length: this.options.players }, (_, i) =>
      this.addPlayer(i),
    );
    this.enemies = createEnemies(this);
    this.acid = (course.zones ?? [])
      .filter((z) => z.kind === "acid")
      .map((zone) => ({
        zone,
        hidden: zone.nativeAcidSlot !== undefined,
        handle: this.world.createCollider(
          RAPIER.ColliderDesc.trimesh(
            acidShape(zone, 0).vertices,
            acidShape(zone, 0).indices,
          )
            .setTranslation(...Object.values(acidPositionAt(zone, 0)))
            .setSensor(true)
            .setEnabled(zone.nativeAcidSlot === undefined),
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
      time:
        this.course.category === "campaign"
          ? (courseTime(this.course.id, this.options.difficulty) ??
            this.course.time)
          : this.course.time,
      score: 0,
      status: "racing",
      checkpoint: -1,
      deaths: 0,
      campaignDeaths: 0,
      finishTick: null,
      grounded: false,
      groundFriction: null,
      respawnTick: 0,
      springTick: 0,
      stunTick: 0,
      stunnedUntil: 0,
      impactAirTicks: 0,
      impactLaunched: false,
      launchBonusPending: null,
      progress: 0,
      navigation: createTerrainNavigation(this.course, i, s),
      safeNavigation: createTerrainNavigation(this.course, i, s),
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
    const s =
      p.birdCapture?.destination ??
      p.slinkyCapture?.destination ??
      p.acidCapture?.destination ??
      this.respawnPosition(p);
    const b = this.body(p);
    b.setEnabled(true);
    b.setTranslation(s, true);
    b.setLinvel({ x: 0, y: 0, z: 0 }, true);
    b.setAngvel({ x: 0, y: 0, z: 0 }, true);
    b.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true);
    if (this.course.navigation) {
      const i = this.players.indexOf(p);
      const saved =
        this.options.assisted && p.checkpoint >= 0
          ? p.checkpointNavigation
          : this.course.rules?.respawn === "last-safe"
            ? p.safeNavigation
            : null;
      p.navigation = structuredClone(
        saved ?? createTerrainNavigation(this.course, i, s),
      );
      const part = this.course.parts.find(
        (p) => p.id === this.course.navigation.partId,
      );
      p.navigation.tile = terrainTileAt(part, s);
    }
    p.status = "racing";
    p.vacuumCapture = null;
    p.nativeVacuumPrevious = null;
    p.nativeVacuumCaptureUntil = null;
    p.acidCapture = null;
    p.slinkyCapture = null;
    p.birdCapture = null;
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
      if (a.zone.nativeAcidSlot !== undefined) continue;
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
    const terrainPlayers = this.players.map((p) => ({
      position: this.body(p).translation(),
      active: p.status === "racing",
      region: p.navigation?.region,
      navigationPartId: this.course.navigation?.partId,
    }));
    advanceNativeCamera(
      this.course,
      this.nativeCamera,
      terrainPlayers,
      this.tick * STEP * this.preset.machineSpeed,
      RADIUS,
    );
    advanceNativeFlags(
      this.course,
      this.nativeFlags,
      this.tick * STEP * this.preset.machineSpeed,
      this.nativeCamera,
    );
    advanceNativeAcids(this, STEP);
    advanceNativeBirds(this, STEP);
    advanceNativeMiniatures(this, STEP);
    steerEnemies(this, STEP);
    const terrainPoses = advanceTerrainAnimations(
      this.course,
      this.terrainAnimations,
      terrainPlayers,
      this.tick * STEP * this.preset.machineSpeed,
      this.nativeCamera,
    );
    const pegPoses = advanceAerialPegs(
      this.course,
      this.aerialPegs,
      terrainPlayers,
      this.tick * STEP * this.preset.machineSpeed,
    );
    const hammerPoses = advanceAerialHammers(
      this.course,
      this.aerialHammers,
      terrainPlayers,
      this.tick * STEP * this.preset.machineSpeed,
      this.nativeCamera,
    );
    advanceAerialVacuums(
      this.course,
      this.aerialVacuums,
      terrainPlayers.map((p, i) => ({
        ...p,
        active:
          p.active ||
          (this.players[i].nativeVacuumCaptureUntil ?? -1) >
            (this.aerialVacuums?.sequence.tick ?? 0),
      })),
      this.tick * STEP * this.preset.machineSpeed,
      this.nativeCamera,
    );
    this.nativeVacuumPoses = aerialVacuumPoses(this.course, this.aerialVacuums);
    const paddle = advanceAerialPaddle(
      this.course,
      this.aerialPaddle,
      this.tick * STEP * this.preset.machineSpeed,
      this.nativeCamera,
    );
    if (paddle?.launched !== undefined && paddle.launched !== null) {
      const p = this.players[paddle.launched];
      const part = this.course.parts.find(
        (v) => v.id === this.course.paddleSequence.part,
      );
      const b = p && this.body(p),
        pos = b?.translation();
      const cs = Math.cos(part.angle ?? 0),
        sn = Math.sin(part.angle ?? 0);
      const cup = {
        x: part.x - ((part.d - part.w) / 2) * sn,
        z: part.z + ((part.d - part.w) / 2) * cs,
      };
      // A real spring impulse at the cup, with no source position snap. A
      // marble that rolled away during the dwell cannot be launched remotely.
      if (
        p?.status === "racing" &&
        Math.hypot(pos.x - cup.x, pos.z - cup.z) < part.w * 0.55 &&
        Math.abs(pos.y - part.y - RADIUS) < 0.25
      ) {
        const v = b.linvel(),
          target = paddleLaunchVelocity(this.course, part, this.aerialPaddle);
        b.applyImpulse(
          {
            x: (target.x - v.x) * MASS,
            y: (target.y - v.y) * MASS,
            z: (target.z - v.z) * MASS,
          },
          true,
        );
        p.springTick = this.tick;
        p.impactLaunched = true;
      }
      this.events.push({
        type: "spring",
        player: paddle.launched,
        part: this.course.paddleSequence.part,
      });
    }
    for (const m of this.movers) {
      m.previous = m.current;
      const machineTime =
        m.part.motion.axis === "launch"
          ? m.launchTick === undefined
            ? 0
            : (this.tick - m.launchTick) * STEP
          : this.tick * STEP * this.preset.machineSpeed;
      m.current = motionAt(
        m.part,
        machineTime,
        terrainPoses[m.part.sourcePartId] ??
          hammerPoses[m.part.id] ??
          pegPoses[m.part.id] ??
          this.nativeVacuumPoses[m.part.id] ??
          (m.part.id === this.course.paddleSequence?.part
            ? paddle?.pose
            : undefined),
        m.previous,
      );
      if (
        m.part.profile === "flipper" &&
        m.part.motion.axis !== "native-paddle" &&
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
      if (
        m.part.motion.axis === "terrain-sequence" &&
        m.current.frame !== m.previous.frame
      ) {
        const data = this.compiled.moving.find((g) => g.part.id === m.part.id)
          .frames[m.current.frame];
        b.collider(0).setShape(
          RAPIER.ColliderDesc.trimesh(
            data.vertices,
            data.indices,
            RAPIER.TriMeshFlags.FIX_INTERNAL_EDGES,
          ).shape,
        );
      }
      if (m.current.vertices && m.current !== m.previous)
        b.collider(0).setShape(
          RAPIER.ColliderDesc.convexHull(m.current.vertices).shape,
        );
      if (m.part.motion.axis === "terrain")
        b.collider(0).setEnabled(
          m.current.terrainHeights.some(
            (h, i) => h > m.part.terrainTriangle[i].y + 1e-7,
          ),
        );
      else
        b.setEnabled(
          m.current.visible ??
            presenceAt(m.part, this.tick * STEP * this.preset.machineSpeed)
              .visible,
        );
      b.setNextKinematicTranslation(m.current.position);
      b.setNextKinematicRotation(m.current.rotation);
      if (
        ["native-vacuum", "native-paddle"].includes(m.part.motion.axis) &&
        !m.current.visible
      )
        b.setTranslation(m.current.position, false);
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
        finishSlinkyCapture(this, p);
        finishBirdCapture(this, p);
        if (this.tick >= p.respawnTick) this.respawn(p);
        continue;
      }
      const pos = b.translation(),
        v = b.linvel(),
        w = b.angvel();
      applyNativeSlope(this, p, STEP);
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
      p.groundFriction = hit ? hit.collider.friction() : null;
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
          p.safeHistory.push({
            tick: this.tick,
            position: copy(pos),
            navigation: structuredClone(p.navigation),
          });
        while (
          p.safeHistory.length &&
          p.safeHistory[0].tick <= this.tick - 120
        ) {
          const safe = p.safeHistory.shift();
          p.safePosition = safe.position;
          p.safeNavigation = safe.navigation;
        }
      }
      const input = inputs[i] ?? {
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
          torque =
            (input.turbo ? STEERING_TORQUE.turbo : STEERING_TORQUE.normal) *
            gain *
            landingControlScale(p, this.tick);
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
      if (this.aerialVacuums?.steps) {
        const previous = p.nativeVacuumPrevious ?? pos;
        for (let j = 0; j < 6; j++) {
          const effect = nativeVacuumEffect(
            this.course,
            this.aerialVacuums,
            j,
            previous,
            pos,
            RADIUS,
          );
          if (!effect) continue;
          if (effect.kind === "pull")
            b.applyImpulse(
              {
                x: effect.x * this.aerialVacuums.steps,
                y: 0,
                z: effect.z * this.aerialVacuums.steps,
              },
              true,
            );
          else if (effect.kind === "capture") {
            scheduleVacuumRetirement(this.aerialVacuums, j);
            p.nativeVacuumCaptureUntil = this.aerialVacuums.sequence.tick + 32;
            this.fall(p, { cause: "vacuum", intake: effect.intake });
            break;
          }
          // The source body rectangles remain reference evidence. Solid
          // contact uses the visible housing mesh, including while rising;
          // invisible rectangular blocks must not override that geometry.
        }
        p.nativeVacuumPrevious = copy(b.translation());
        if (p.status !== "racing") continue;
      }
      for (const zone of this.course.zones ?? []) {
        if (this.course.vacuumSequence?.parts.includes(zone.mouth)) continue;
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
            s.motion.axis === "native-paddle"
              ? this.aerialPaddle.sequence.loaded &&
                this.aerialPaddle.sequence.phase === "idle"
              : arm.launchTick === undefined ||
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
            if (
              s.motion.axis === "native-paddle" &&
              !queuePaddleContact(this.aerialPaddle, i)
            )
              continue;
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
      const flow =
        physicalNativeTransfer(this, p, index, RADIUS, wasPowered) ??
        physicalNativePipes(this, p, RADIUS, wasPowered) ??
        transferForce(
          this.traversalPaths.filter(
            (path) => !path.nativeTransfer && !path.nativePipe,
          ),
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
    if (this.nativeDynamics.terminalSpeed !== null)
      for (const actor of [
        ...this.players.filter((p) => p.status === "racing"),
        ...this.enemies.filter(
          (e) =>
            (e.nativeSteelie || e.slinkyFalling) && !e.hidden && !e.defeated,
        ),
      ]) {
        // The guard's airborne branch at 0x13350 uses the same acceleration
        // and terminal descent as the player's branch at 0x130f0.
        const b = this.body(actor),
          v = b.linvel();
        // Account for the gravity Rapier adds during this step. This limits
        // only downward velocity; planar momentum and angular motion remain.
        const minimum =
          -this.nativeDynamics.terminalSpeed +
          this.nativeDynamics.gravity * STEP;
        if (v.y < minimum) b.setLinvel({ ...v, y: minimum }, true);
      }
    this.world.step(this.queue);
    const landingContacts = [];
    for (let i = 0; i < this.players.length; i++) {
      const p = this.players[i];
      if (
        p.status !== "racing" ||
        (!this.course.rules?.landingStun &&
          !p.launchBonusPending &&
          !this.course.nativePracticeLandings)
      )
        continue;
      const contact = landingContact(this, p, incomingVelocity[i], RADIUS);
      landingContacts[i] = contact;
      updateLandingStun(this, p, contact);
      const award = updateLaunchBonus(this, p, contact, RADIUS);
      if (award) this.events.push({ ...award, player: i });
    }
    updateEnemies(this, incomingVelocity);
    for (const acid of this.acid)
      for (const p of this.players)
        if (
          !acid.hidden &&
          p.status === "racing" &&
          this.world.intersectionPair(
            this.world.getCollider(acid.handle),
            this.world.getCollider(p.collider),
          )
        )
          this.fall(p, { cause: "acid", zone: acid.zone, pool: acid });
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
      const nativeFinish = advanceTerrainNavigation(
        this.course,
        p.navigation,
        pos,
      );
      if (landingContacts[i]) {
        const award = updateNativePracticeLanding(
          this,
          p,
          landingContacts[i],
          RADIUS,
        );
        if (award) this.events.push({ ...award, player: i });
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
          p.checkpointNavigation = structuredClone(p.navigation);
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
        this.course.navigation
          ? nativeFinish
          : Math.abs(gx) < (g.width ?? 4) / 2 &&
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
    const slinky = detail?.cause === "slinky";
    const bird = detail?.cause === "bird";
    if (!slinky && !bird) p.deaths++;
    const vacuum = detail?.cause === "vacuum";
    const acid = detail?.cause === "acid";
    p.respawnTick =
      this.tick + (vacuum ? 252 : acid ? ACID_RECOVERY_TICKS : 90);
    p.slinkyCapture = slinky
      ? {
          tick: this.tick,
          enemy: detail.enemy,
          releaseTick: detail.releaseTick,
          endTick: detail.releaseTick + SLINKY_REFORM_TICKS,
          released: false,
          origin: copy(this.body(p).translation()),
          rotation: copy(this.body(p).rotation()),
          destination: copy(this.respawnPosition(p)),
        }
      : null;
    if (slinky) p.respawnTick = p.slinkyCapture.endTick;
    p.birdCapture = bird
      ? {
          tick: this.tick,
          releaseTick: detail.releaseTick,
          endTick: detail.endTick,
          released: false,
          origin: copy(this.body(p).translation()),
          rotation: copy(this.body(p).rotation()),
          destination: copy(this.respawnPosition(p)),
        }
      : null;
    if (bird) p.respawnTick = p.birdCapture.endTick;
    if (acid) {
      const origin = this.body(p).translation();
      const pool =
        detail.pool?.current?.position ??
        acidPositionAt(
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
      holdAcidOnContact(this.nativeAcids?.slots[detail.zone.nativeAcidSlot]);
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
    p.nativePracticeAirborne = false;
    p.traversals = {};
    p.transferRoute = null;
    if (!slinky && !bird)
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
      staticColliderHandles: [...this.staticColliderHandles],
      players: structuredClone(this.players),
      movers: structuredClone(this.movers),
      terrainAnimations: structuredClone(this.terrainAnimations),
      nativeCamera: structuredClone(this.nativeCamera),
      nativeFlags: structuredClone(this.nativeFlags),
      nativeBirds: structuredClone(this.nativeBirds),
      nativeMiniatures: structuredClone(this.nativeMiniatures),
      nativeAcids: structuredClone(this.nativeAcids),
      acid: this.acid.map(({ zone, geometry, ...runtime }) =>
        structuredClone(runtime),
      ),
      aerialHammers: structuredClone(this.aerialHammers),
      aerialPegs: structuredClone(this.aerialPegs),
      aerialVacuums: structuredClone(this.aerialVacuums),
      aerialPaddle: structuredClone(this.aerialPaddle),
      enemies: structuredClone(this.enemies),
    };
  }
  restore(s) {
    this.world.free();
    this.world = RAPIER.World.restoreSnapshot(Uint8Array.from(s.world));
    this.staticColliderHandles = [
      ...(s.staticColliderHandles ?? this.staticColliderHandles),
    ];
    this.tick = s.tick;
    this.players = structuredClone(s.players);
    this.movers = structuredClone(s.movers);
    this.terrainAnimations = structuredClone(
      s.terrainAnimations ??
        createTerrainAnimations(this.course, this.options.players),
    );
    this.nativeCamera = structuredClone(
      s.nativeCamera ??
        (this.course.nativeCamera
          ? createNativeCamera(this.course.nativeCamera)
          : null),
    );
    this.nativeFlags = structuredClone(
      s.nativeFlags ?? createNativeFlags(this.course),
    );
    this.nativeBirds = structuredClone(
      s.nativeBirds ??
        (this.course.birdSequence
          ? createBirdSequence(this.options.seed)
          : null),
    );
    this.nativeAcids = structuredClone(
      s.nativeAcids ??
        (this.course.acidSequence
          ? createAcidSequence(this.options.seed)
          : null),
    );
    this.nativeMiniatures = structuredClone(
      s.nativeMiniatures ??
        (this.course.miniatureSequence
          ? createMiniatureSequence(this.options.seed)
          : null),
    );
    if (s.acid)
      this.acid.forEach((a, i) => Object.assign(a, structuredClone(s.acid[i])));
    this.enemies = structuredClone(s.enemies ?? []);
    this.aerialHammers = structuredClone(
      s.aerialHammers ?? createAerialHammers(this.course),
    );
    this.aerialPegs = structuredClone(
      s.aerialPegs ?? createAerialPegs(this.course, this.options.seed),
    );
    this.aerialVacuums = structuredClone(
      s.aerialVacuums ?? createAerialVacuums(this.course),
    );
    this.nativeVacuumPoses = aerialVacuumPoses(this.course, this.aerialVacuums);
    this.aerialPaddle = structuredClone(
      s.aerialPaddle ?? createAerialPaddle(this.course, this.options.seed),
    );
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
      if (enemy.def.nativeBirdSlot !== undefined) {
        const slot = sim.nativeBirds.slots[enemy.def.nativeBirdSlot];
        if (enemy.hidden || slot.mode !== "fly") return false;
        const bird = sim.world.getRigidBody(enemy.handle);
        const bp = bird.translation(),
          bv = bird.linvel();
        if (Math.abs(bp.y - pos.y) > RADIUS + enemy.def.radius) return false;
        // Forecast from real motion. Native birds can change speed or retire;
        // full native-course demo routes remain a separate acceptance gate.
        for (let ahead = 0.15; ahead <= 1.2; ahead += 0.15) {
          const travel = Math.min(dist, cruisingSpeed * ahead);
          if (
            Math.hypot(
              bp.x +
                bv.x * ahead -
                pos.x -
                (dx / Math.max(dist, 0.01)) * travel,
              bp.z +
                bv.z * ahead -
                pos.z -
                (dz / Math.max(dist, 0.01)) * travel,
            ) <
            RADIUS + enemy.def.radius + 0.4
          )
            return true;
        }
        return false;
      }
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
    // Extra torque cannot provide extra grip on ice. Also ease off before an
    // authored slow approach, while there is still room to shed momentum.
    const steeringTorque =
      (p.groundFriction !== null && p.groundFriction < 0.1) ||
      (target.speed ?? 3.5) <= 1.4 ||
      (next.speed ?? 3.5) <= 1.4
        ? 2.2
        : DEMO_TORQUE;
    // Counter gravity on descents as well as climbs. Slip feedback limits
    // excessive spin before a low-friction surface grips again.
    const compensation = p.groundNormal
      ? (-sim.nativeDynamics.gravity * RADIUS * p.groundNormal.y) /
        steeringTorque
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
    const strength = steeringTorque / STEERING_TORQUE.turbo;
    return { x: x * strength, z: z * strength, turbo: true };
  }
}
