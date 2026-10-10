import * as THREE from 'three';
import type {LizardRig} from './LizardRig';
import type {Nav} from './Nav';
import type {Surface} from './Surface';
import {SurfaceKind} from './Surface';
import type {Insects, Cricket} from './Insects';
import type {Water} from './Water';
import {POOL, poolDistance, WATER_LEVEL} from './Ground';
import {TANK} from './Case';

/**
 * Behaviour for the bearded dragon. Lizards move in short bursts and freeze,
 * flick the head in quick saccades, bask with the chest raised (sometimes with
 * the mouth open to shed heat), drink by lapping, stalk and lunge at prey,
 * signal with head bobs and slow arm waves, and sleep flat at night.
 * Timings are illustrative, not measured ethology.
 */
type Mode = 'bask' | 'idle' | 'travel' | 'drink' | 'hunt' | 'sleep' | 'display' | 'startle' | 'petted' | 'soak';

const rnd = Math.random;
const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
const damp = (cur: number, target: number, rate: number, dt: number) => cur + (target - cur) * (1 - Math.exp(-rate * dt));
const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

interface Pose {clearance: number; chestLift: number; headPitch: number; lid: number; breath: number}

export class LizardBrain {
  mode: Mode = 'bask';
  status = 'Basking under the lamp';
  private t = 0;
  private modeT = 0;
  private path: [number, number][] = [];
  private pathI = 0;
  private burstLeft = 0;
  private pauseT = 0;
  private cruise = 0.1;
  private speed = 0;
  private turn = 0;
  private after: Mode = 'idle';
  private lookT = 0;
  private lookPoint = new THREE.Vector3();
  private looking = false;
  private pose: Pose = {clearance: 0.1, chestLift: 1.3, headPitch: 0.22, lid: 1, breath: 1};
  private poseGoal: Pose = {clearance: 0.1, chestLift: 1.3, headPitch: 0.22, lid: 1, breath: 1};
  private faceHeading: number | null = null;
  private prey: Cricket | null = null;
  private huntPhase: 'notice' | 'approach' | 'fix' | 'strike' | 'chew' | 'lick' = 'notice';
  private phaseT = 0;
  private lapCount = 0;
  private drinkPitch = -0.55;
  private huntGoal: [number, number] | null = null;
  private huntPrey: [number, number] | null = null;
  private standTries = 0;
  private misses = 0;
  private gapeT = 0;
  private displayKind: 'bob' | 'wave' = 'bob';
  private boredom = 0;
  private goal: [number, number] | null = null;
  private replans = 0;
  private blockedT = 0;
  private stallT = 0;
  private stallRef = new THREE.Vector2();
  private leadT = 0;
  private tmp2: [number, number] = [0, 0];
  private ignorePrey = new WeakMap<Cricket, number>();
  night = false;
  raining = false;
  heat = 1;
  storm = 0;
  cameraPos = new THREE.Vector3();
  pointer: THREE.Vector3 | null = null;
  private pointerPrev = new THREE.Vector3();
  private baskSpot: [number, number, number] = [-0.4, 0.085, 0];
  private sleepSpot: [number, number, number] = [-0.47, -0.08, 0.6];
  onLap?: (p: THREE.Vector3) => void;

  constructor(readonly rig: LizardRig, readonly nav: Nav, readonly surface: Surface, readonly insects: Insects, readonly water: Water) {
    // Highest comfortable point on the log under the basking lamp.
    let best = -Infinity;
    for (let x = -0.5; x <= -0.26; x += 0.005) for (let z = 0.02; z <= 0.15; z += 0.005) {
      if (surface.kindAt(x, z) !== SurfaceKind.Wood) continue;
      const y = surface.heightAt(x, z) - Math.abs(x + 0.38) * 0.2;
      // the body needs a flat stretch along the log
      const flat = Math.abs(surface.heightAt(x + 0.04, z) - surface.heightAt(x - 0.04, z));
      if (y - flat * 2 > best && nav.reachable(x, z)) {best = y - flat * 2; this.baskSpot = [x, z, 0.2];}
    }
    // Sleeps tucked in among the ferns at the back left, on reachable ground.
    const sleep = nav.nearestWalkable(this.sleepSpot[0], this.sleepSpot[1], nav.mainRegion);
    if (sleep) {this.sleepSpot[0] = sleep[0]; this.sleepSpot[1] = sleep[1];}
    const I = rig.inputs;
    I.x = this.baskSpot[0];
    I.z = this.baskSpot[1];
    I.heading = this.baskSpot[2];
    I.clearance = 0.1;
    I.chestLift = 1.3;
    rig.reset();
  }

  private setMode(m: Mode, status: string) {
    this.mode = m;
    this.modeT = 0;
    this.status = status;
  }

  private posePreset(kind: 'bask' | 'alert' | 'walk' | 'rest' | 'sleep' | 'drink') {
    const p: Record<string, Pose> = {
      bask: {clearance: 0.05, chestLift: 1.35, headPitch: 0.24, lid: 0.85, breath: 1},
      alert: {clearance: 0.35, chestLift: 0.9, headPitch: 0.12, lid: 1, breath: 1},
      walk: {clearance: 0.75, chestLift: 0.15, headPitch: 0.05, lid: 1, breath: 1.2},
      rest: {clearance: 0.12, chestLift: 0.45, headPitch: 0.02, lid: 1, breath: 1},
      sleep: {clearance: -0.15, chestLift: -0.2, headPitch: -0.22, lid: 0, breath: 0.6},
      drink: {clearance: 0.25, chestLift: -0.6, headPitch: -0.55, lid: 1, breath: 1},
    };
    this.poseGoal = {...p[kind]};
  }

  /** Plans a route; returns false if there is no way there. */
  private goTo(x: number, z: number, then: Mode, cruise = 0.11) {
    const I = this.rig.inputs;
    const path = this.nav.path(I.x, I.z, x, z);
    if (!path || path.length < 2) return false;
    this.path = path;
    this.pathI = 1;
    this.goal = path[path.length - 1];
    this.replans = 0;
    this.blockedT = 0;
    this.stallT = 0;
    this.stallRef.set(I.x, I.z);
    this.after = then;
    this.cruise = cruise * (0.85 + rnd() * 0.3);
    this.burstLeft = 0.12 + rnd() * 0.3;
    this.pauseT = 0;
    this.leadT = 0.2;
    this.setMode('travel', then === 'drink' ? 'Heading to the water' : then === 'bask' ? 'Returning to the basking log' : then === 'sleep' ? 'Looking for a place to sleep' : then === 'soak' ? 'Wading into the shallows' : 'Exploring');
    this.posePreset('walk');
    return true;
  }

  /** A body position on the shore from which the head reaches over the water. */
  private drinkSpot(): [number, number, number] | null {
    const I = this.rig.inputs;
    const candidates: [number, number, number, number][] = [];
    for (let x = POOL.cx - POOL.rx * 1.5; x <= POOL.cx + POOL.rx * 1.5; x += 0.012) {
      for (let z = POOL.cz - POOL.rz * 1.6; z <= Math.min(TANK.d / 2 - 0.04, POOL.cz + POOL.rz * 1.6); z += 0.012) {
        if (!this.nav.reachable(x, z) || this.nav.isWet(x, z) || poolDistance(x, z) < 0.01) continue;
        const ground = this.surface.heightAt(x, z);
        if (ground > WATER_LEVEL + 0.035) continue;
        // face the nearest open water
        let best = -1, bestA = 0;
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
          const hx = x + Math.cos(a) * 0.085, hz = z - Math.sin(a) * 0.085;
          const d = -poolDistance(hx, hz);
          if (d > best) {best = d; bestA = a;}
        }
        if (best < 0.02) continue;
        // front feet must stay dry
        const fx = x + Math.cos(bestA) * 0.035, fz = z - Math.sin(bestA) * 0.035;
        if (poolDistance(fx, fz) < 0.01) continue;
        candidates.push([x, z, bestA, Math.hypot(x - I.x, z - I.z)]);
      }
    }
    if (!candidates.length) return null;
    candidates.sort((a, b) => a[3] - b[3]);
    return candidates[Math.floor(rnd() * Math.min(6, candidates.length))].slice(0, 3) as [number, number, number];
  }

  private chooseActivity() {
    if (this.night) {
      // Sleeps where it basks if it is already up on the log; otherwise in the ferns.
      const I = this.rig.inputs;
      if (Math.hypot(I.x - this.baskSpot[0], I.z - this.baskSpot[1]) < 0.06) {this.setMode('sleep', 'Falling asleep'); return;}
      if (!this.goTo(this.sleepSpot[0], this.sleepSpot[1], 'sleep', 0.08)) this.setMode('sleep', 'Falling asleep');
      return;
    }
    const prey = this.insects.nearest(this.rig.snout);
    if (prey && this.canHunt(prey)) {this.startHunt(prey); return;}
    const r = rnd();
    const I = this.rig.inputs;
    const onLog = Math.hypot(I.x - this.baskSpot[0], I.z - this.baskSpot[1]) < 0.03;
    if (r < 0.18) {
      const s = this.drinkSpot();
      if (s && this.goTo(s[0], s[1], 'drink')) {this.faceHeading = s[2]; return;}
    }
    if (r < 0.36 && !onLog && this.heat > 0.5) {
      if (this.goTo(this.baskSpot[0], this.baskSpot[1], 'bask')) {this.faceHeading = this.baskSpot[2]; return;}
    }
    if (r < 0.46) {
      // come to the front glass and look out at the room
      const p = this.nav.randomPoint(rnd, {x0: -0.5, x1: 0.5, z0: 0.15, z1: 0.21});
      if (p && this.goTo(p[0], p[1], 'idle')) {this.faceHeading = -Math.PI / 2 + (rnd() - 0.5) * 0.6; return;}
    }
    if (r < 0.54) {
      // wade out and soak in the shallows
      const p = this.nav.randomPoint(rnd, undefined, false);
      if (p && this.nav.isWet(p[0], p[1]) && this.goTo(p[0], p[1], 'soak', 0.08)) {this.faceHeading = null; return;}
    }
    if (r < 0.62) {
      this.displayKind = rnd() < 0.6 ? 'bob' : 'wave';
      this.setMode('display', this.displayKind === 'bob' ? 'Head-bobbing' : 'Waving an arm');
      return;
    }
    // explore: favour places it has not been lately, so it roams the whole case
    const options: [number, number, number][] = [];
    for (let k = 0; k < 12; k++) {
      const p = this.nav.randomPoint(rnd, undefined, rnd() < 0.75);
      if (!p) continue;
      const d = Math.hypot(p[0] - I.x, p[1] - I.z);
      if (d < 0.15) continue;
      options.push([p[0], p[1], this.visitedAt(p[0], p[1]) * 4 + Math.abs(d - 0.45) * 0.6 + rnd() * 0.3]);
    }
    options.sort((a, b) => a[2] - b[2]);
    for (const p of options.slice(0, 3)) if (this.goTo(p[0], p[1], 'idle')) {this.faceHeading = null; return;}
    this.setMode('idle', 'Watching');
  }

  /** Can it get within striking distance of this cricket? (Remembers the ones it cannot.) */
  private canHunt(c: Cricket) {
    const until = this.ignorePrey.get(c) ?? -1;
    if (this.t < until) return false;
    const I = this.rig.inputs;
    const near = this.nav.nearestWalkable(c.pos.x, c.pos.z, this.nav.region[this.nav.idx(I.x, I.z)] ?? -1);
    const ok = !!near && Math.hypot(near[0] - c.pos.x, near[1] - c.pos.z) < 0.07 && c.pos.y - this.surface.heightAt(c.pos.x, c.pos.z) < 0.05;
    if (!ok) this.ignorePrey.set(c, this.t + 6);
    return ok;
  }

  /** A reachable spot from which the head points at the prey, nearest the lizard first. */
  private standPoint(c: Cricket): [number, number] | null {
    const I = this.rig.inputs;
    const region = this.nav.region[this.nav.idx(I.x, I.z)] ?? -1;
    let best: [number, number] | null = null, bestScore = Infinity;
    for (let k = 0; k < 16; k++) {
      const a = (k / 16) * Math.PI * 2 + this.standTries * 0.7;
      const dx = Math.cos(a), dz = Math.sin(a);
      const sx = c.pos.x + dx * 0.075, sz = c.pos.z + dz * 0.075;
      const ki = this.nav.idx(sx, sz);
      if (ki < 0 || this.nav.region[ki] !== region || this.nav.isWet(sx, sz)) continue;
      // the head must have room to reach in
      if (!this.nav.walkable(c.pos.x + dx * 0.035, c.pos.z + dz * 0.035)) continue;
      const score = Math.hypot(sx - I.x, sz - I.z) + this.nav.costAt(sx, sz) * 0.02;
      if (score < bestScore) {bestScore = score; best = [sx, sz];}
    }
    return best;
  }

  /** Recent time spent near a point (decays over a couple of minutes). */
  private visited = new Float32Array(12 * 5);
  private visitedAt(x: number, z: number) {
    const i = clamp(Math.floor((x + TANK.w / 2) / 0.1), 0, 11), j = clamp(Math.floor((z + TANK.d / 2) / 0.1), 0, 4);
    return this.visited[j * 12 + i] / 60;
  }

  startHunt(c: Cricket) {
    this.prey = c;
    this.path = [];
    this.huntGoal = null;
    this.huntPrey = null;
    this.standTries = 0;
    this.huntPhase = 'notice';
    this.phaseT = 0;
    this.setMode('hunt', 'Spotted a cricket');
    this.posePreset('alert');
  }

  /** Lightning struck at `p`: bolt for cover if it was close, otherwise freeze and stare. */
  lightning(p: THREE.Vector3, strength: number) {
    if (this.mode === 'sleep') {this.setMode('idle', 'Woken by the thunder'); this.posePreset('alert');}
    const d = Math.hypot(p.x - this.rig.inputs.x, p.z - this.rig.inputs.z);
    this.lookPoint.copy(p);
    this.looking = true;
    this.lookT = 2.5;
    if (d < 0.22 * strength && this.mode !== 'hunt') {
      this.startle(p);
      if (this.mode === 'startle') this.status = 'Startled by the lightning';
    } else if (this.mode !== 'startle') {
      this.pauseT = Math.max(this.pauseT, 1.2 + Math.random() * 1.5);
      if (this.mode !== 'travel' && this.mode !== 'hunt') {this.setMode('idle', 'Watching the storm'); this.posePreset('alert');}
    }
    this.rig.inputs.display = Math.max(this.rig.inputs.display, 0.5 * strength);
  }

  /** Called when the pointer touches the lizard with the hand tool. */
  pet() {
    if (this.mode === 'sleep' || this.mode === 'hunt') return;
    this.setMode('petted', 'Enjoying the attention');
  }

  // ---------------------------------------------------------------------------
  update(dt: number) {
    this.t += dt;
    this.modeT += dt;
    const I = this.rig.inputs;
    {
      const decay = Math.exp(-dt / 150);
      for (let k = 0; k < this.visited.length; k++) this.visited[k] *= decay;
      const i = clamp(Math.floor((I.x + TANK.w / 2) / 0.1), 0, 11), j = clamp(Math.floor((I.z + TANK.d / 2) / 0.1), 0, 4);
      this.visited[j * 12 + i] += dt;
    }
    I.jaw = damp(I.jaw, 0, 6, dt);
    I.tongue = damp(I.tongue, 0, 12, dt);
    I.lunge = damp(I.lunge, 0, 10, dt);
    I.bob = damp(I.bob, 0, 20, dt);
    I.wave = damp(I.wave, 0, 3, dt);
    I.display = damp(I.display, 0, 1.5, dt);
    const twitch = this.mode === 'hunt' && (this.huntPhase === 'approach' || this.huntPhase === 'fix') ? 1 : 0;
    I.tailTwitch = damp(I.tailTwitch, twitch, 6, dt);
    let targetSpeed = 0, targetTurn = 0;

    // Sudden close movement of the pointer near the head makes it flinch away.
    if (this.pointer && this.mode !== 'sleep' && this.mode !== 'startle' && this.mode !== 'petted') {
      const pv = this.pointer.distanceTo(this.pointerPrev) / Math.max(dt, 1e-3);
      const close = this.pointer.distanceTo(this.rig.snout) < 0.06;
      if (close && pv > 0.8 && rnd() < 0.25) this.startle(this.pointer);
      this.pointerPrev.copy(this.pointer);
    }
    // Prey appearing interrupts calm activities.
    this.boredom = Math.max(0, this.boredom - dt);
    if (!this.night && this.mode !== 'hunt' && this.mode !== 'startle' && this.modeT > 0.8 && this.boredom <= 0) {
      const prey = this.insects.nearest(this.rig.snout);
      if (prey && !prey.airborne && prey.pos.distanceTo(this.rig.snout) < 0.6 && this.canHunt(prey)) this.startHunt(prey);
      else if (prey && this.mode !== 'travel') {this.lookPoint.copy(prey.pos); this.looking = true; this.lookT = 0.8;}
    }

    // Lights out: wind down promptly.
    if (this.night && (this.mode === 'bask' || this.mode === 'idle' || this.mode === 'display') && this.modeT > 2.5) this.chooseActivity();

    switch (this.mode) {
      case 'bask': {
        this.posePreset('bask');
        // Gaping (mouth held open) is how agamids shed excess heat.
        this.gapeT -= dt;
        if (this.gapeT < -14 - rnd() * 20 && this.heat > 0.7) this.gapeT = 4 + rnd() * 6;
        if (this.gapeT > 0) I.jaw = damp(I.jaw, 0.38, 4, dt);
        this.poseGoal.lid = this.gapeT > 0 ? 0.7 : 0.85;
        this.idleLook(dt, 0.35);
        if (this.modeT > 18 + rnd() * 400 * dt) this.chooseActivity();
        break;
      }
      case 'idle': {
        if (this.faceHeading !== null) targetTurn = this.turnToward(this.faceHeading);
        if (this.modeT > 0.3) this.posePreset(this.modeT > 6 ? 'rest' : 'alert');
        this.idleLook(dt, 0.55);
        if (this.modeT > 4 + rnd() * 600 * dt) {this.faceHeading = null; this.chooseActivity();}
        break;
      }
      case 'display': {
        this.posePreset('alert');
        if (this.displayKind === 'bob') {
          const k = this.modeT;
          if (k > 0.4 && k < 2.2) {
            I.bob = 0.9 * Math.max(0, Math.sin((k - 0.4) * 15));
            I.display = Math.max(I.display, 0.6);
          }
          this.lookAtCamera();
        } else {
          if (this.modeT > 0.3 && this.modeT < 3.2) I.wave = 1;
          this.poseGoal.headPitch = -0.05;
        }
        if (this.modeT > 4) this.setMode('idle', 'Watching');
        break;
      }
      case 'travel': {
        const r = this.travel(dt);
        targetSpeed = r.speed; targetTurn = r.turn;
        break;
      }
      case 'drink': {
        if (this.faceHeading !== null && Math.abs(wrap(this.faceHeading - I.heading)) > 0.12 && this.modeT < 2) {
          targetTurn = this.turnToward(this.faceHeading);
          this.posePreset('alert');
          break;
        }
        this.posePreset('drink');
        this.status = 'Drinking';
        this.rig.inputs.look = null;
        // lower the head until the mouth meets the water
        this.drinkPitch = clamp(this.drinkPitch - (this.rig.mouth.y - (WATER_LEVEL + 0.002)) * 22 * dt, -1.1, 0.2);
        this.poseGoal.headPitch = this.drinkPitch;
        const lapT = this.modeT - 0.8;
        if (lapT > 0) {
          const ph = (lapT * 1.8) % 1;
          I.tongue = ph < 0.35 ? Math.sin((ph / 0.35) * Math.PI) : 0;
          I.jaw = Math.max(I.jaw, I.tongue * 0.18);
          const lap = Math.floor(lapT * 1.8);
          if (lap > this.lapCount && ph > 0.15) {
            this.lapCount = lap;
            this.onLap?.(this.rig.mouth.clone());
          }
        }
        if (this.modeT > 6 + rnd() * 50 * dt) {this.lapCount = 0; this.drinkPitch = -0.55; this.setMode('idle', 'Watching');}
        break;
      }
      case 'soak': {
        // Bearded dragons like a soak: belly down in the shallows, eyes half shut.
        this.posePreset('rest');
        this.poseGoal.clearance = -0.05;
        this.poseGoal.lid = 0.55;
        this.idleLook(dt, 0.2);
        if (this.modeT > 9 + rnd() * 500 * dt) this.chooseActivity();
        break;
      }
      case 'hunt': {
        const r = this.hunt(dt);
        targetSpeed = r.speed; targetTurn = r.turn;
        break;
      }
      case 'sleep': {
        this.posePreset('sleep');
        I.look = null;
        this.status = this.modeT < 4 ? 'Falling asleep' : 'Asleep';
        if (!this.night && this.modeT > 3) {this.posePreset('alert'); this.setMode('idle', 'Waking up');}
        break;
      }
      case 'startle': {
        const r = this.travel(dt);
        targetSpeed = r.speed; targetTurn = r.turn;
        break;
      }
      case 'petted': {
        this.posePreset('rest');
        this.poseGoal.lid = 0.15;
        this.poseGoal.headPitch = -0.1;
        I.look = null;
        if (this.modeT > 3) this.setMode('idle', 'Watching');
        break;
      }
    }
    if (this.raining && this.mode !== 'sleep' && rnd() < dt * 0.15) I.tongue = Math.max(I.tongue, 0.6);

    // Snappy acceleration and braking: bursts, not glides.
    this.speed = damp(this.speed, targetSpeed, targetSpeed > this.speed ? 9 : 14, dt);
    this.turn = damp(this.turn, targetTurn, 12, dt);
    I.speed = this.speed;
    I.turnRate = this.turn;
    I.heading = wrap(I.heading + this.turn * dt);
    const nx = I.x + Math.cos(I.heading) * this.speed * dt;
    const nz = I.z - Math.sin(I.heading) * this.speed * dt;
    if (this.speed < 1e-4 || this.nav.walkable(nx, nz) || !this.nav.walkable(I.x, I.z)) {I.x = nx; I.z = nz; this.blockedT = 0;}
    else if (this.nav.walkable(nx, I.z)) I.x = nx; // slide along the obstacle
    else if (this.nav.walkable(I.x, nz)) I.z = nz;
    else {this.speed *= 0.5; this.blockedT += dt;}
    // stall watchdog: trying to travel but getting nowhere
    if ((this.mode === 'travel' || this.mode === 'startle' || (this.mode === 'hunt' && this.huntPhase === 'approach')) && this.pauseT <= 0 && this.leadT <= 0) {
      this.stallT += dt;
      if (Math.hypot(I.x - this.stallRef.x, I.z - this.stallRef.y) > 0.02) {this.stallT = 0; this.stallRef.set(I.x, I.z);}
    } else {this.stallT = 0; this.stallRef.set(I.x, I.z);}
    // Pose eases toward its goal.
    const p = this.pose, g = this.poseGoal;
    p.clearance = damp(p.clearance, g.clearance, 4, dt);
    p.chestLift = damp(p.chestLift, g.chestLift, 4, dt);
    p.headPitch = damp(p.headPitch, g.headPitch, 5, dt);
    p.lid = damp(p.lid, g.lid, this.mode === 'sleep' ? 0.6 : 5, dt);
    p.breath = damp(p.breath, g.breath, 2, dt);
    I.clearance = p.clearance + (this.speed > 0.02 ? 0.35 : 0);
    I.chestLift = p.chestLift;
    I.headPitch = p.headPitch;
    I.lid = p.lid;
    I.breath = p.breath;
    this.rig.update(dt);
    // A caught cricket stays in the jaws.
    if (this.prey && this.prey.caught) {
      this.prey.pos.copy(this.rig.mouth);
      this.prey.group.position.copy(this.rig.mouth);
      this.prey.group.rotation.y = this.rig.inputs.heading + Math.PI / 2;
    }
  }

  private turnToward(h: number) {
    const e = wrap(h - this.rig.inputs.heading);
    return Math.abs(e) < 0.05 ? 0 : clamp(e * 5, -2.8, 2.8);
  }

  private idleLook(dt: number, cameraBias: number) {
    this.lookT -= dt;
    const I = this.rig.inputs;
    if (this.lookT < 0) {
      this.lookT = 0.8 + rnd() * 3;
      const r = rnd();
      if (this.pointer && this.pointer.distanceTo(this.rig.snout) < 0.3) {this.lookPoint.copy(this.pointer); this.looking = true;}
      else if (r < cameraBias && this.cameraPos.distanceTo(this.rig.snout) < 2.2) {this.lookPoint.copy(this.cameraPos); this.looking = true;}
      else if (r < cameraBias + 0.35) {
        this.lookPoint.set(I.x + (rnd() - 0.5) * 0.6, this.rig.snout.y + (rnd() - 0.3) * 0.15, I.z + (rnd() - 0.5) * 0.4);
        this.looking = true;
      } else this.looking = false;
    }
    I.look = this.looking ? this.lookPoint : null;
  }

  private lookAtCamera() {
    this.lookPoint.copy(this.cameraPos);
    this.rig.inputs.look = this.lookPoint;
  }

  private startle(from: THREE.Vector3) {
    const I = this.rig.inputs;
    const away = Math.atan2(-(I.z - from.z), I.x - from.x);
    const dist = 0.1 + rnd() * 0.08;
    const tx = I.x + Math.cos(away) * dist, tz = I.z - Math.sin(away) * dist;
    if (this.goTo(tx, tz, 'idle', 0.38)) {
      this.mode = 'startle';
      this.status = 'Startled';
      this.burstLeft = dist;
      this.faceHeading = Math.atan2(-(from.z - tz), from.x - tx);
    }
  }

  /** Arrived (or gave up): settle into whatever the trip was for. */
  private arrive() {
    if (this.mode === 'hunt') {this.pathI = this.path.length; return;}
    this.path = [];
    if (this.mode === 'startle') {this.setMode('idle', 'Watching'); return;}
    this.setMode(this.after, this.after === 'bask' ? 'Basking under the lamp' : this.after === 'drink' ? 'Drinking' : this.after === 'sleep' ? 'Asleep' : this.after === 'soak' ? 'Soaking in the shallows' : 'Watching');
    if (this.after === 'bask') this.posePreset('bask');
  }

  /** The route ahead: a point `ahead` metres further along the path from the lizard. */
  private pathPoint(ahead: number, out: [number, number]) {
    const I = this.rig.inputs;
    let px = I.x, pz = I.z, left = ahead;
    for (let i = this.pathI; i < this.path.length; i++) {
      const [wx, wz] = this.path[i];
      const seg = Math.hypot(wx - px, wz - pz);
      if (seg >= left) {const t = left / Math.max(seg, 1e-6); out[0] = px + (wx - px) * t; out[1] = pz + (wz - pz) * t; return out;}
      left -= seg;
      px = wx; pz = wz;
    }
    out[0] = px; out[1] = pz;
    return out;
  }

  private remaining() {
    const I = this.rig.inputs;
    let s = 0, px = I.x, pz = I.z;
    for (let i = this.pathI; i < this.path.length; i++) {
      s += Math.hypot(this.path[i][0] - px, this.path[i][1] - pz);
      px = this.path[i][0]; pz = this.path[i][1];
    }
    return s;
  }

  /** Re-plans to the end of the current route; false once it keeps failing. */
  private replan() {
    const I = this.rig.inputs;
    const end = this.path[this.path.length - 1] ?? this.goal;
    if (!end) return false;
    this.replans++;
    if (this.replans > 4) return false;
    const p = this.nav.path(I.x, I.z, end[0], end[1]);
    if (!p || p.length < 2) return false;
    this.path = p;
    this.pathI = 1;
    this.blockedT = 0;
    return true;
  }

  /**
   * Follows the planned route in bursts: a run of steps, a freeze to scan, then
   * on. Steering pursues a point a little way along the route, so corners are
   * rounded the way an animal takes them rather than snapped to.
   */
  private travel(dt: number) {
    const I = this.rig.inputs;
    if (!this.path.length || this.pathI >= this.path.length) {this.arrive(); return {speed: 0, turn: 0};}
    // Blocked or stalled: plan again from here, and give up if that keeps failing.
    if (this.blockedT > 0.35 || this.stallT > 2.5) {
      this.stallT = 0;
      if (!this.replan()) {
        this.path = [];
        if (this.mode === 'hunt') return {speed: 0, turn: 0};
        this.faceHeading = null;
        this.setMode('idle', 'Watching');
        return {speed: 0, turn: 0};
      }
    }
    if (this.pauseT > 0) {
      this.pauseT -= dt;
      this.idleLook(dt, 0.25);
      if (this.mode !== 'startle') this.posePreset(this.pauseT > 1.2 ? 'rest' : 'alert');
      if (this.pauseT <= 0) {
        this.burstLeft = 0.1 + rnd() * 0.3;
        this.posePreset('walk');
        this.leadT = 0.25; // turn the head toward the route before setting off
      }
      return {speed: 0, turn: 0};
    }
    // advance past waypoints we have reached or overtaken
    while (this.pathI < this.path.length - 1) {
      const [wx, wz] = this.path[this.pathI];
      if (Math.hypot(wx - I.x, wz - I.z) < 0.03) {this.pathI++; continue;}
      const [nx, nz] = this.path[this.pathI + 1];
      // past the waypoint along the next segment?
      const sx = nx - wx, sz = nz - wz;
      if ((I.x - wx) * sx + (I.z - wz) * sz > 0) {this.pathI++; continue;}
      break;
    }
    const remaining = this.remaining();
    const [ex, ez] = this.path[this.path.length - 1];
    if (remaining < 0.014 || (this.pathI === this.path.length - 1 && Math.hypot(ex - I.x, ez - I.z) < 0.014)) {this.arrive(); return {speed: 0, turn: 0};}
    const look = this.pathPoint(0.11, this.tmp2);
    this.lookPoint.set(look[0], this.surface.heightAt(look[0], look[1]) + 0.025, look[1]);
    I.look = this.lookPoint;
    const aim = this.pathPoint(Math.min(0.045, remaining), this.tmp2);
    const want = Math.atan2(-(aim[1] - I.z), aim[0] - I.x);
    const err = wrap(want - I.heading);
    if (this.leadT > 0) {
      this.leadT -= dt;
      return {speed: 0, turn: Math.abs(err) > 1.2 ? Math.sign(err) * 1.6 : 0};
    }
    let speed = this.cruise * Math.max(0, Math.cos(err)) ** 2;
    // Too far off course: pivot on the spot with short steps, as lizards do.
    if (Math.abs(err) > 1.25) speed = 0;
    // ease off on the final approach and through the water
    speed *= clamp(remaining / 0.05, 0.4, 1);
    if (this.nav.isWet(I.x, I.z)) speed *= 0.6;
    const maxTurn = this.mode === 'startle' ? 4 : 2.6;
    const turn = clamp(err * 5, -maxTurn, maxTurn);
    this.burstLeft -= this.speed * dt;
    if (this.burstLeft <= 0 && this.mode !== 'startle' && remaining > 0.08) {
      this.pauseT = rnd() < 0.25 ? 1.2 + rnd() * 2.5 : 0.25 + rnd() * 0.7;
    }
    return {speed, turn};
  }

  private hunt(dt: number) {
    const I = this.rig.inputs;
    const c = this.prey;
    if (!c || c.eaten) {this.prey = null; this.setMode('idle', 'Watching'); return {speed: 0, turn: 0};}
    this.phaseT += dt;
    const head = this.rig.snout;
    const toPrey = new THREE.Vector3().subVectors(c.pos, head);
    const flat = Math.hypot(toPrey.x, toPrey.z);
    const want = Math.atan2(-(c.pos.z - I.z), c.pos.x - I.x);
    const err = wrap(want - I.heading);
    if (!c.caught) {this.lookPoint.copy(c.pos); I.look = this.lookPoint;}
    switch (this.huntPhase) {
      case 'notice':
        this.status = 'Spotted a cricket';
        if (this.phaseT > 0.5 + rnd() * 0.02) {this.huntPhase = 'approach'; this.phaseT = 0;}
        return {speed: 0, turn: Math.abs(err) > 0.6 ? this.turnToward(want) : 0};
      case 'approach': {
        this.status = 'Stalking';
        if (c.airborne) {this.posePreset('alert'); return {speed: 0, turn: 0};}
        const mouthD = c.pos.distanceTo(this.rig.mouth);
        if (mouthD < 0.055 && Math.abs(err) < 0.4) {this.huntPhase = 'fix'; this.phaseT = 0; this.path = []; return {speed: 0, turn: 0};}
        if (this.phaseT > 14) {this.ignorePrey.set(c, this.t + 10); this.prey = null; this.boredom = 6; this.setMode('idle', 'Lost interest'); return {speed: 0, turn: 0};}
        // Plan a route to a stand-off spot near the prey; replan if it moves.
        const moved = !this.huntPrey || Math.hypot(this.huntPrey[0] - c.pos.x, this.huntPrey[1] - c.pos.z) > 0.03;
        if (moved || !this.path.length) {
          const stand = this.standPoint(c);
          this.huntPrey = [c.pos.x, c.pos.z];
          const path = stand && this.nav.path(I.x, I.z, stand[0], stand[1]);
          if (!path) {
            if (this.phaseT > 1.5) {this.ignorePrey.set(c, this.t + 8); this.prey = null; this.setMode('idle', 'Watching');}
            return {speed: 0, turn: this.turnToward(want)};
          }
          this.huntGoal = stand;
          this.path = path;
          this.pathI = 1;
          this.goal = path[path.length - 1];
          this.replans = 0;
          this.cruise = flat > 0.25 ? 0.12 : 0.05;
          this.burstLeft = 0.05 + rnd() * 0.05;
        }
        if (this.pathI >= this.path.length) {
          // At the stand-off point: face the prey, creep in, or strike from a little
          // further (the lunge and tongue add reach). If it cannot get close from
          // this side, try another side.
          if (Math.abs(err) > 0.3) return {speed: 0, turn: clamp(err * 5, -2.5, 2.5)};
          if (mouthD < 0.085) {this.huntPhase = 'fix'; this.phaseT = 0; return {speed: 0, turn: 0};}
          const ahead = this.nav.walkable(I.x + Math.cos(I.heading) * 0.02, I.z - Math.sin(I.heading) * 0.02);
          if (ahead) return {speed: 0.035, turn: clamp(err * 5, -2.5, 2.5)};
          this.standTries++;
          if (this.standTries > 3) {this.ignorePrey.set(c, this.t + 10); this.prey = null; this.setMode('idle', 'Lost interest'); return {speed: 0, turn: 0};}
          this.huntPrey = null; // forces a new stand-off spot on another side
          this.path = [];
          return {speed: 0, turn: 0};
        }
        const r = this.travel(dt);
        // stalking: look only at the prey, freeze often
        this.lookPoint.copy(c.pos);
        I.look = this.lookPoint;
        if (this.mode !== 'hunt') this.mode = 'hunt';
        return r;
      }
      case 'fix':
        this.status = 'Fixating';
        if (c.pos.distanceTo(this.rig.mouth) > 0.085 || c.airborne) {this.huntPhase = 'approach'; this.phaseT = 0; return {speed: 0, turn: 0};}
        if (this.phaseT > 0.35 + rnd() * 0.02) {this.huntPhase = 'strike'; this.phaseT = 0;}
        return {speed: 0, turn: clamp(err * 6, -2, 2)};
      case 'strike': {
        this.status = 'Strike!';
        const k = this.phaseT;
        I.lunge = k < 0.09 ? k / 0.09 : Math.max(0, 1 - (k - 0.09) / 0.25);
        I.jaw = k < 0.12 ? 0.85 : I.jaw;
        I.tongue = k < 0.14 ? 0.7 : I.tongue;
        // the sticky tongue extends the reach of the snap
        if (k > 0.06 && k < 0.18 && !c.caught && c.pos.distanceTo(this.rig.mouth) < 0.04) {
          c.caught = true;
          c.airborne = false;
        }
        if (k > 0.3) {
          this.phaseT = 0;
          if (c.caught) {this.huntPhase = 'chew';} else {this.misses++; this.huntPhase = this.misses > 3 ? 'approach' : 'fix';}
          if (this.misses > 5) {this.prey = null; this.misses = 0; this.boredom = 8; this.setMode('idle', 'Missed');}
        }
        return {speed: k < 0.1 ? 0.32 : 0, turn: clamp(err * 6, -3, 3)};
      }
      case 'chew': {
        this.status = 'Eating';
        I.look = null;
        this.poseGoal.headPitch = 0.2;
        I.jaw = 0.18 + 0.2 * Math.max(0, Math.sin(this.phaseT * 13));
        if (this.phaseT > 2.4) {c.eaten = true; this.misses = 0; this.huntPhase = 'lick'; this.phaseT = 0;}
        return {speed: 0, turn: 0};
      }
      case 'lick': {
        this.status = 'Licking its lips';
        const ph = this.phaseT * 3;
        I.tongue = ph < 2 && ph % 1 < 0.4 ? Math.sin((ph % 1) / 0.4 * Math.PI) * 0.6 : 0;
        if (this.phaseT > 1.4) {this.prey = null; this.setMode('idle', 'Content');}
        return {speed: 0, turn: 0};
      }
    }
    return {speed: 0, turn: 0};
  }
}

export {WATER_LEVEL};
