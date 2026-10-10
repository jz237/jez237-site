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
type Mode = 'bask' | 'idle' | 'travel' | 'drink' | 'hunt' | 'sleep' | 'display' | 'startle' | 'petted';

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
  private misses = 0;
  private gapeT = 0;
  private displayKind: 'bob' | 'wave' = 'bob';
  private boredom = 0;
  night = false;
  raining = false;
  heat = 1;
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
      if (y - flat * 2 > best && nav.walkable(x, z)) {best = y - flat * 2; this.baskSpot = [x, z, 0.2];}
    }
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
    this.after = then;
    this.cruise = cruise;
    this.burstLeft = 0.04 + rnd() * 0.16;
    this.pauseT = 0;
    this.setMode('travel', then === 'drink' ? 'Heading to the water' : then === 'bask' ? 'Returning to the basking log' : then === 'sleep' ? 'Looking for a place to sleep' : 'Exploring');
    this.posePreset('walk');
    return true;
  }

  /** A body position on the shore from which the head reaches over the water. */
  private drinkSpot(): [number, number, number] | null {
    const I = this.rig.inputs;
    const candidates: [number, number, number, number][] = [];
    for (let x = POOL.cx - POOL.rx * 1.5; x <= POOL.cx + POOL.rx * 1.5; x += 0.012) {
      for (let z = POOL.cz - POOL.rz * 1.6; z <= Math.min(TANK.d / 2 - 0.04, POOL.cz + POOL.rz * 1.6); z += 0.012) {
        if (!this.nav.walkable(x, z) || poolDistance(x, z) < 0.03) continue;
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
    if (prey) {this.startHunt(prey); return;}
    const r = rnd();
    const I = this.rig.inputs;
    const onLog = Math.hypot(I.x - this.baskSpot[0], I.z - this.baskSpot[1]) < 0.03;
    if (r < 0.22) {
      const s = this.drinkSpot();
      if (s && this.goTo(s[0], s[1], 'drink')) {this.faceHeading = s[2]; return;}
    }
    if (r < 0.42 && !onLog) {
      if (this.goTo(this.baskSpot[0], this.baskSpot[1], 'bask')) {this.faceHeading = this.baskSpot[2]; return;}
    }
    if (r < 0.55) {
      // come to the front glass and look out at the room
      const p = this.nav.randomPoint(rnd, {x0: -0.45, x1: 0.05, z0: 0.14, z1: 0.2});
      if (p && this.goTo(p[0], p[1], 'idle')) {this.faceHeading = -Math.PI / 2 + (rnd() - 0.5) * 0.6; return;}
    }
    if (r < 0.66) {
      this.displayKind = rnd() < 0.6 ? 'bob' : 'wave';
      this.setMode('display', this.displayKind === 'bob' ? 'Head-bobbing' : 'Waving an arm');
      return;
    }
    const p = this.nav.randomPoint(rnd);
    if (p && this.goTo(p[0], p[1], 'idle')) {this.faceHeading = null; return;}
    this.setMode('idle', 'Watching');
  }

  startHunt(c: Cricket) {
    this.prey = c;
    this.path = [];
    this.huntGoal = null;
    this.huntPhase = 'notice';
    this.phaseT = 0;
    this.setMode('hunt', 'Spotted a cricket');
    this.posePreset('alert');
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
      if (prey && !prey.airborne && prey.pos.distanceTo(this.rig.snout) < 0.6) this.startHunt(prey);
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
    if (this.nav.walkable(nx, nz) || !this.nav.walkable(I.x, I.z)) {I.x = nx; I.z = nz;}
    else {this.speed = 0; if (this.mode === 'travel') this.path = [];}
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

  /** Follows the planned path in bursts: dash, freeze, scan, dash. */
  private travel(dt: number) {
    const I = this.rig.inputs;
    if (!this.path.length || this.pathI >= this.path.length) {
      if (this.mode === 'hunt') return {speed: 0, turn: 0};
      this.setMode(this.after, this.after === 'bask' ? 'Basking under the lamp' : this.after === 'drink' ? 'Drinking' : this.after === 'sleep' ? 'Asleep' : 'Watching');
      if (this.after === 'bask') this.posePreset('bask');
      return {speed: 0, turn: 0};
    }
    if (this.pauseT > 0) {
      this.pauseT -= dt;
      this.idleLook(dt, 0.25);
      this.posePreset('alert');
      if (this.pauseT <= 0) {this.burstLeft = 0.05 + rnd() * 0.18; this.posePreset('walk');}
      return {speed: 0, turn: 0};
    }
    const [wx, wz] = this.path[this.pathI];
    const dx = wx - I.x, dz = wz - I.z;
    const d = Math.hypot(dx, dz);
    if (d < 0.012) {this.pathI++; return {speed: this.speed, turn: 0};}
    const want = Math.atan2(-dz, dx);
    const err = wrap(want - I.heading);
    // look where it is going
    this.lookPoint.set(wx, this.surface.heightAt(wx, wz) + 0.02, wz);
    I.look = this.lookPoint;
    let speed = this.cruise * clamp(1 - Math.abs(err) / 1.2, 0, 1);
    const turn = clamp(err * 6, -3.2, 3.2);
    if (Math.abs(err) > 1.0) speed = 0;
    // slow down for the final approach
    const remaining = d + this.path.slice(this.pathI + 1).reduce((s, p, i, arr) => s + (i === 0 ? Math.hypot(p[0] - wx, p[1] - wz) : Math.hypot(p[0] - arr[i - 1][0], p[1] - arr[i - 1][1])), 0);
    speed *= clamp(remaining / 0.04, 0.35, 1);
    this.burstLeft -= this.speed * dt;
    if (this.burstLeft <= 0 && (this.mode === 'travel' || this.mode === 'hunt') && remaining > 0.06) {
      this.pauseT = 0.4 + rnd() * (rnd() < 0.3 ? 2.6 : 1.0);
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
        if (this.phaseT > 14) {this.prey = null; this.boredom = 10; this.setMode('idle', 'Lost interest'); return {speed: 0, turn: 0};}
        // Plan a route to a spot just short of the prey; replan if it moves.
        const stand = 0.085;
        const ax = c.pos.x - Math.cos(want) * stand, az = c.pos.z + Math.sin(want) * stand;
        const moved = !this.huntGoal || Math.hypot(this.huntGoal[0] - ax, this.huntGoal[1] - az) > 0.03;
        if (moved || !this.path.length) {
          const path = this.nav.path(I.x, I.z, ax, az);
          this.huntGoal = [ax, az];
          if (!path) {
            if (this.phaseT > 4) {this.prey = null; this.setMode('idle', 'Watching');}
            return {speed: 0, turn: this.turnToward(want)};
          }
          this.path = path;
          this.pathI = 1;
          this.cruise = flat > 0.25 ? 0.12 : 0.05;
          this.burstLeft = 0.05;
        }
        if (this.pathI >= this.path.length) {
          // at the stand-off point: creep and face the prey; strike from a little further if it cannot get closer
          const ahead = this.nav.walkable(I.x + Math.cos(I.heading) * 0.015, I.z - Math.sin(I.heading) * 0.015);
          if (!ahead && mouthD < 0.075 && Math.abs(err) < 0.4) {this.huntPhase = 'fix'; this.phaseT = 0; return {speed: 0, turn: 0};}
          return {speed: Math.abs(err) < 0.3 && mouthD > 0.05 && ahead ? 0.03 : 0, turn: clamp(err * 5, -2.5, 2.5)};
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
