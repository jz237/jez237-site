import * as THREE from 'three';
import type {LizardRig} from './LizardRig';
import type {Nav} from './Nav';
import type {Surface} from './Surface';
import {SurfaceKind} from './Surface';
import type {Insects, Cricket} from './Insects';
import type {Dish} from './Dish';
import {POOL, poolDistance, WATER_LEVEL, CAVE} from './Ground';
import {TANK} from './Case';

/**
 * Behaviour for the bearded dragon. Lizards move in short bursts and freeze,
 * flick the head in quick saccades, bask with the chest raised (sometimes with
 * the mouth open to shed heat), drink by lapping, stalk and lunge at prey,
 * signal with head bobs and slow arm waves, and sleep flat at night.
 * Timings are illustrative, not measured ethology.
 */
type Mode = 'bask' | 'idle' | 'travel' | 'drink' | 'hunt' | 'sleep' | 'display' | 'startle' | 'petted' | 'soak' | 'shelter' | 'graze' | 'sip';
/** Facing straight out of the cave mouth (towards the glass). */
const FACE_OUT = -Math.PI / 2;

const rnd = () => Math.random();
const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
const damp = (cur: number, target: number, rate: number, dt: number) => cur + (target - cur) * (1 - Math.exp(-rate * dt));
const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));
const smoothstep01 = (t: number) => {t = clamp(t, 0, 1); return t * t * (3 - 2 * t);};

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
  private pose: Pose = {clearance: 0.1, chestLift: 2.3, headPitch: 0.45, lid: 1, breath: 1};
  private poseGoal: Pose = {clearance: 0.1, chestLift: 2.3, headPitch: 0.45, lid: 1, breath: 1};
  private faceHeading: number | null = null;
  private prey: Cricket | null = null;
  private huntPhase: 'notice' | 'approach' | 'fix' | 'strike' | 'grip' | 'chew' | 'swallow' | 'lick' = 'notice';
  private bites = 0;
  private biteT = 0;
  private preySide = 1;
  private phaseT = 0;
  private lapCount = 0;
  private drinkPitch = -0.55;
  private huntGoal: [number, number] | null = null;
  private huntPrey: [number, number] | null = null;
  private huntReplanT=0;
  private preyHiddenT=0;
  private standTries = 0;
  private misses = 0;
  private gapeT = 0;
  private displayKind: 'bob' | 'wave' = 'bob';
  private boredom = 0;
  private goal: [number, number] | null = null;
  private replans = 0;
  private blockedT = 0;
  private stallT = 0;
  /** Time spent walking into something the body is pushed back off (the glass, a tall stone). */
  private pushedT = 0;
  private retreatLeft = 0;
  private retreatT = 0;
  private retreatSign = -1;
  private turnStallT = 0;
  private caveApproach = false;
  private caveBacking = false;
  private caveExit = 0;
  private bowlExit: {x:number;z:number;heading:number;time:number}|null=null;
  private backOutLeft=0;
  /** Closest it has come to the end of the current route, and how long since it got closer. */
  private nearPath: [number, number][] | null = null;
  private nearBest = Infinity;
  private nearT = 0;
  private stallRef = new THREE.Vector2();
  private stallHeading = 0;
  private leadT = 0;
  private lickT = 0;
  private tmp2: [number, number] = [0, 0];
  private ignorePrey = new WeakMap<Cricket, number>();
  /** Running for the cave: no stops to look around on the way. */
  private hurry = false;
  private clearT = 0;
  /** The dish of greens, and grazing from it. */
  dish: Dish | null = null;
  private grazePhase: 'face' | 'reach' | 'bite' | 'chew' = 'face';
  private grazeBites = 0;
  private grazeT = 0;
  private lastGraze = -60;
  /** The current strike is a tongue flick (small prey within reach) rather than a lunge. */
  private tongueStrike = false;
  private onTongue = false;
  /** How long the current cricket has been held in the jaws. */
  private caughtT = 0;
  /** Leaf tips that hold droplets after rain or misting, and how wet the leaves are (0..1). */
  leafTips: THREE.Vector3[] = [];
  leavesWet = 0;
  private sipTip = new THREE.Vector3();
  private sipPitch = 0;
  private lastSip = -60;
  private lastMist = -60;
  private snoutLickT = 0;
  /** Each lick at a wet leaf. */
  onSip?: (p: THREE.Vector3) => void;
  night = false;
  raining = false;
  heat = 1;
  storm = 0;
  /** What the surroundings would warm or cool the body to (0 cold .. 1 hot); set from the lamp, shade and rain. */
  envTemp = 0.5;
  /** 0..1 how strongly the basking lamp falls on it. */
  lampOnIt = 0;
  /** Body temperature, 0 cold .. 1 hot: it follows envTemp over tens of seconds. */
  bodyTemp = 0.55;
  /** 0..1 alarm (storms, lightning, sudden movement); fades over about twenty seconds. */
  stress = 0;
  cameraPos = new THREE.Vector3();
  pointer: THREE.Vector3 | null = null;
  private pointerPrev = new THREE.Vector3();
  private baskSpot: [number, number, number] = [-0.4, 0.085, 0];
  private sleepSpot: [number, number, number] = [0.475, -0.018, -Math.PI / 2];
  onLap?: (p: THREE.Vector3) => void;
  /** Each bite through a cricket's shell. */
  onCrunch?: (p: THREE.Vector3, strength: number) => void;

  constructor(readonly rig: LizardRig, readonly nav: Nav, readonly surface: Surface, readonly insects: Insects) {
    // Highest comfortable stretch of the sandstone ledge under the basking lamp: the whole
    // body (head to hips, both flanks) must lie on wood, level and without a
    // crack under it, so it lies along the sandstone ledge rather than hanging off its edge.
    let best = -Infinity;
    for (let x = -0.52; x <= -0.39; x += 0.005) for (let z = 0.02; z <= 0.07; z += 0.005) {
      if (surface.kindAt(x, z) !== SurfaceKind.Rock || !nav.reachable(x, z)) continue;
      for (let h = Math.PI - 0.32; h <= Math.PI - 0.12; h += 0.10) {
        const fx = Math.cos(h), fz = -Math.sin(h);
        let lo = Infinity, hi = -Infinity, sum = 0, n = 0, dip = 0, ok = true;
        for (const sd of [-0.01, 0, 0.01]) {
          let y0 = NaN, y1 = NaN;
          for (let a = -0.065; a <= 0.076 && ok; a += 0.01) {
            const sx = x + fx * a - fz * sd, sz = z + fz * a + fx * sd;
            if (surface.kindAt(sx, sz) !== SurfaceKind.Rock) {ok = false; break;}
            const y = surface.heightAt(sx, sz);
            lo = Math.min(lo, y); hi = Math.max(hi, y); sum += y; n++;
            // a crack: a sample well below the line through its neighbours
            if (!Number.isNaN(y0)) dip = Math.max(dip, (y0 + y) / 2 - y1);
            y0 = y1; y1 = y;
          }
          if (!ok) break;
        }
        if (!ok || dip > 0.005 || hi - lo > 0.03) continue;
        const score = sum / n - (hi - lo) * 3 - dip * 4 - Math.abs(x + 0.465) * 0.4;
        if (score > best) {best = score; this.baskSpot = [x, z, h];}
      }
    }
    // Sleeps tucked in among the cool hide at the back left, on reachable ground.
    const sleep = nav.nearestWalkable(this.sleepSpot[0], this.sleepSpot[1], nav.mainRegion);
    if (sleep) {this.sleepSpot[0] = sleep[0]; this.sleepSpot[1] = sleep[1];}
    const I = rig.inputs;
    I.x = this.baskSpot[0];
    I.z = this.baskSpot[1];
    I.heading = this.baskSpot[2];
    I.clearance = 0.1;
    I.chestLift = 2.3;
    I.headPitch = 0.45;
    this.lookT = 4;
    rig.reset();
  }

  private setMode(m: Mode, status: string) {
    this.mode = m;
    this.modeT = 0;
    this.status = status;
    // A bearded dragon is a sit-and-wait lizard: once settled it stays put for
    // tens of seconds to minutes, watching, before it moves on.
    if (m === 'idle') this.holdFor = Math.min(70, 8 + -Math.log(1 - rnd() * 0.98) * 16);
  }
  private holdFor = 20;
  private tmpTilt = new THREE.Vector3();

  /** At lights-out, finish a mouthful and move to the shaded shelter. */
  restInHide() {
    if (this.prey?.caught && !this.prey.eaten) return;
    if (!this.goTo(this.sleepSpot[0], this.sleepSpot[1], 'sleep', 0.08)) {
      this.setMode('sleep', 'Falling asleep');
      this.posePreset('sleep');
    }
  }

  private posePreset(kind: 'bask' | 'alert' | 'walk' | 'rest' | 'sleep' | 'drink') {
    const p: Record<string, Pose> = {
      bask: {clearance: 0.05, chestLift: 2.3, headPitch: 0.45, lid: 0.85, breath: 1},
      alert: {clearance: 0.35, chestLift: 0.9, headPitch: 0.12, lid: 1, breath: 1},
      walk: {clearance: 0.95, chestLift: 0.15, headPitch: 0.05, lid: 1, breath: 1.2},
      rest: {clearance: 0.12, chestLift: 0.45, headPitch: 0.02, lid: 1, breath: 1},
      sleep: {clearance: -0.15, chestLift: -0.2, headPitch: -0.22, lid: 0, breath: 0.6},
      drink: {clearance: 0.25, chestLift: -0.6, headPitch: -0.55, lid: 1, breath: 1},
    };
    this.poseGoal = {...p[kind]};
  }

  /** Plans a route; returns false if there is no way there. */
  // A normal walk between pauses; prey pursuit and startles still use bursts.
  private goTo(x: number, z: number, then: Mode, cruise = 0.12) {
    const I = this.rig.inputs;
    const path = this.nav.path(I.x, I.z, x, z);
    if (!path || path.length < 2) return false;
    this.path = path;
    this.pathI = 1;
    this.goal = path[path.length - 1];
    this.retreatT=0;this.retreatLeft=0;
    this.turnStallT=0;
    this.caveApproach=Math.abs(x-.475)<.11 && z<.11 && this.surface.heightAt(x,z)<.12;
    this.caveBacking=false;
    this.caveExit=!this.caveApproach && Math.abs(I.x-.475)<.11 && I.z<.11 && this.surface.heightAt(I.x,I.z)<.12
      ? (Math.sin(I.heading)>0 ? -1 : 1) : 0;
    this.bowlExit=I.x>.43&&I.x<.52&&I.z>.30&&x<.40
      ? {x:I.x-Math.cos(I.heading)*.075,z:I.z+Math.sin(I.heading)*.075,heading:I.heading,time:0} : null;
    // Leave the greens dish along the approach corridor before attempting a
    // half-turn between its rim, the steps and the front glass.
    this.backOutLeft=I.x>-.5&&I.x<-.34&&I.z>.29&&Math.cos(I.heading)<-.25
      && (x>-.35||this.surface.heightAt(x,z)>.15) ? .09 : 0;
    this.replans = 0;
    this.blockedT = 0;
    this.stallT = 0;
    this.pushedT = 0;
    this.stallRef.set(I.x, I.z);
    this.after = then;
    this.hurry = false;
    this.cruise = cruise * (0.85 + rnd() * 0.3);
    this.burstLeft = 0.12 + rnd() * 0.3;
    this.pauseT = 0;
    this.leadT = 0.2;
    this.setMode('travel', then === 'drink' ? 'Heading to the water' : then === 'bask' ? 'Returning to the basking ledge' : then === 'sleep' ? 'Looking for a place to sleep' : then === 'soak' ? 'Wading into the shallows' : then === 'shelter' ? 'Heading for the cave' : then === 'graze' ? 'Off to the greens dish' : then === 'sip' ? 'Off to lick the wet leaves' : 'Exploring');
    this.posePreset('walk');
    return true;
  }

  /** A body position on the shore from which the head reaches over the water. */
  private drinkSpot(): [number, number, number] | null {
    const I = this.rig.inputs;
    // Approach the low bowl from its open left side, leaving room to turn and
    // keeping the shoulder/forefoot sweep out of the stone rim.
    const side:[number,number,number]=[POOL.cx-.17,POOL.cz-.035,Math.atan2(-.035,.17)];
    if(this.nav.reachable(side[0],side[1]))return side;
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

  /** A reachable spot beside the dish, facing it, with the mouth over the greens. */
  private grazeSpot(): [number, number, number] | null {
    const d = this.dish;
    if (!d) return null;
    const side:[number,number,number]=[d.centre.x+.17,d.centre.z-.035,Math.atan2(-.035,-.17)];
    if(this.nav.reachable(side[0],side[1]))return side;
    const I = this.rig.inputs;
    let best: [number, number, number] | null = null, bd = Infinity;
    for (let k = 0; k < 12; k++) {
      const a = (k / 12) * Math.PI * 2;
      const x = d.centre.x + Math.cos(a) * 0.1, z = d.centre.z + Math.sin(a) * 0.1;
      if (!this.nav.reachable(x, z) || this.nav.isWet(x, z)) continue;
      const dist = Math.hypot(x - I.x, z - I.z);
      if (dist < bd) {bd = dist; best = [x, z, Math.atan2(-(d.centre.z - z), d.centre.x - x)];}
    }
    return best;
  }

  /**
   * A reachable stance facing a leaf tip at licking height, near `near` when
   * given (where the mist went) or else near the lizard.
   */
  private sipSpot(near?: THREE.Vector3): [number, number, number] | null {
    const I = this.rig.inputs;
    const cx = near?.x ?? I.x, cz = near?.z ?? I.z;
    let best: [number, number, number] | null = null, bs = Infinity;
    for (const p of this.leafTips) {
      const dc = Math.hypot(p.x - cx, p.z - cz);
      if (dc > (near ? 0.16 : 0.45)) continue;
      if (p.y - this.surface.heightAt(p.x, p.z) < 0.02) continue;
      for (let k = 0; k < 8; k++) {
        const a = (k / 8) * Math.PI * 2;
        const x = p.x + Math.cos(a) * 0.066, z = p.z + Math.sin(a) * 0.066;
        // the tip must be at head height from where it stands (not down off a log)
        const h = p.y - this.surface.heightAt(x, z);
        if (h < 0.03 || h > 0.06) continue;
        if (!this.nav.reachable(x, z) || this.nav.isWet(x, z)) continue;
        const score = dc + Math.hypot(x - I.x, z - I.z) * 0.5 + rnd() * 0.05;
        if (score < bs) {bs = score; best = [x, z, Math.atan2(-(p.z - z), p.x - x)]; this.sipTip.copy(p);}
      }
    }
    return best;
  }

  /** The misting bottle sprayed at `p`: a lick of the snout if it caught the face, and a trip to the wet leaves. */
  misted(p: THREE.Vector3) {
    if (this.mode === 'sleep') return;
    const I = this.rig.inputs;
    if (p.distanceTo(this.rig.snout) < 0.07 || Math.hypot(p.x - I.x, p.z - I.z) < 0.06) {
      this.snoutLickT = 2.4;
      this.pose.lid = 0.15;
    }
    if (this.t - this.lastMist < 1.5) return;
    this.lastMist = this.t;
    if (this.mode === 'hunt' || this.sheltering || this.mode === 'startle' || this.mode === 'sip' || this.mode === 'graze' || this.mode === 'petted') return;
    if (this.mode === 'travel' && this.after === 'sip') return;
    if (Math.hypot(p.x - I.x, p.z - I.z) > 0.55 || rnd() > 0.8) return;
    const s = this.sipSpot(p);
    if (s && this.goTo(s[0], s[1], 'sip')) this.faceHeading = s[2];
  }

  private chooseActivity() {
    if (this.night) {
      // Sleeps where it basks if it is already up on the sandstone ledge; otherwise in the cool hide.
      const I = this.rig.inputs;
      if (!this.goTo(this.sleepSpot[0], this.sleepSpot[1], 'sleep', 0.08)) this.setMode('sleep', 'Falling asleep');
      return;
    }
    const prey = this.insects.nearest(this.rig.snout);
    if (prey && this.canHunt(prey)) {this.startHunt(prey); return;}
    const r = rnd();
    const I = this.rig.inputs;
    const onLog = Math.hypot(I.x - this.baskSpot[0], I.z - this.baskSpot[1]) < 0.03;
    // most often it simply stays where it is and keeps watching
    if (rnd() < 0.25 && this.bodyTemp > 0.4 && this.t > 5) {this.setMode('idle', onLog ? 'Basking under the lamp' : 'Watching'); return;}
    // after rain (or misting) it licks the droplets off the leaves
    if (this.leavesWet > 0.25 && this.t - this.lastSip > 20 && rnd() < 0.6) {
      const s = this.sipSpot();
      if (s && this.goTo(s[0], s[1], 'sip')) {this.faceHeading = s[2]; return;}
    }
    if (this.dish && this.dish.remaining > 0 && this.t - this.lastGraze > 45 && rnd() < 0.35) {
      const s = this.grazeSpot();
      if (s && this.goTo(s[0], s[1], 'graze')) {this.faceHeading = s[2]; return;}
    }
    if (r < 0.18) {
      const s = this.drinkSpot();
      if (s && this.goTo(s[0], s[1], 'drink')) {this.faceHeading = s[2]; return;}
    }
    if ((r < 0.42 || (this.bodyTemp < 0.45 && r < 0.8)) && !onLog && this.heat > 0.5) {
      if (this.goTo(this.baskSpot[0], this.baskSpot[1], 'bask')) {this.faceHeading = this.baskSpot[2]; return;}
    }
    if (r < 0.46) {
      // come to the front glass and look out at the room
      // (far enough back that the snout stays off the glass)
      const p = this.nav.randomPoint(rnd, {x0: -0.5, x1: 0.5, z0: TANK.d / 2 - 0.18, z1: TANK.d / 2 - 0.135});
      if (p && this.goTo(p[0], p[1], 'idle')) {this.faceHeading = -Math.PI / 2 + (rnd() - 0.5) * 0.6; return;}
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
  private standPoint(c: Cricket, target=c.pos): [number, number] | null {
    const I = this.rig.inputs;
    const start=this.nav.nearestWalkable(I.x,I.z);
    const region = start ? this.nav.region[this.nav.idx(...start)] : -1;
    // A fleeing cricket can hide beneath the arch. Approach its opening from
    // the sand; do not turn the sprawling animal sideways inside the doorway.
    if(Math.abs(target.x-.475)<.11&&target.z<.15&&this.surface.heightAt(target.x,target.z)<.12)return [.485,.28];
    let best: [number, number] | null = null, bestScore = Infinity;
    for (let k = 0; k < 16; k++) {
      const a = (k / 16) * Math.PI * 2 + this.standTries * 0.7;
      const dx = Math.cos(a), dz = Math.sin(a);
      const sx = target.x + dx * 0.12, sz = target.z + dz * 0.12;
      if(Math.abs(sx-.475)<.14&&sz<.26&&this.surface.heightAt(sx,sz)<.12)continue;
      const ki = this.nav.idx(sx, sz);
      if (ki < 0 || this.nav.region[ki] !== region || this.nav.isWet(sx, sz)) continue;
      // the head must have room to reach in
      if (!this.nav.walkable(target.x + dx * 0.035, target.z + dz * 0.035)) continue;
      const score = Math.hypot(sx - I.x, sz - I.z) + this.nav.costAt(sx, sz) * 0.02;
      if (score < bestScore) {bestScore = score; best = [sx, sz];}
    }
    return best;
  }

  /** Recent time spent near a point (decays over a couple of minutes). */
  private static readonly VX = Math.ceil(TANK.w / 0.1);
  private static readonly VZ = Math.ceil(TANK.d / 0.1);
  private visited = new Float32Array(LizardBrain.VX * LizardBrain.VZ);
  private visitedCell(x: number, z: number) {
    const i = clamp(Math.floor((x + TANK.w / 2) / 0.1), 0, LizardBrain.VX - 1), j = clamp(Math.floor((z + TANK.d / 2) / 0.1), 0, LizardBrain.VZ - 1);
    return j * LizardBrain.VX + i;
  }
  private visitedAt(x: number, z: number) {return this.visited[this.visitedCell(x, z)] / 60;}

  startHunt(c: Cricket) {
    if (this.prey?.caught && !this.prey.eaten) return; // one mouthful at a time
    this.prey = c;
    this.path = [];
    this.huntGoal = null;
    this.huntPrey = null;
    this.huntReplanT=0;this.preyHiddenT=0;
    this.standTries = 0;
    // Pursuit must not inherit an exploration pause, a head-lead delay or a
    // failed approach from the activity that the cricket interrupted.
    this.pauseT=0;this.leadT=0;this.lickT=0;this.hurry=true;
    this.blockedT=0;this.stallT=0;this.pushedT=0;this.turnStallT=0;
    this.retreatT=0;this.retreatLeft=0;this.backOutLeft=0;
    this.caveApproach=false;this.caveBacking=false;this.bowlExit=null;
    const I=this.rig.inputs;
    this.caveExit=Math.abs(I.x-.475)<.11&&I.z<.24&&this.surface.heightAt(I.x,I.z)<.12
      ? (Math.sin(I.heading)>0?-1:1):0;
    this.bowlExit=I.x>.43&&I.x<.52&&I.z>.30&&c.pos.x<.40
      ? {x:I.x-Math.cos(I.heading)*.075,z:I.z+Math.sin(I.heading)*.075,heading:I.heading,time:0}:null;
    this.backOutLeft=I.x>-.5&&I.x<-.34&&I.z>.29&&Math.cos(I.heading)<-.25
      && (c.pos.x>-.35||this.surface.heightAt(c.pos.x,c.pos.z)>.15)?.09:0;
    this.stallRef.set(I.x,I.z);this.stallHeading=I.heading;
    this.misses=0;
    this.huntPhase = 'notice';
    this.phaseT = 0;
    this.setMode('hunt', 'Spotted a cricket');
    this.posePreset('alert');
  }

  /** On its way to the cave, or in it. */
  get sheltering() {return this.mode === 'shelter' || (this.hurry && this.after === 'shelter' && (this.mode === 'travel' || this.mode === 'startle'));}

  /** Makes for the cave (urgently after a close strike). */
  private seekShelter(urgent: boolean) {
    if (this.sheltering) return true;
    if (this.prey?.caught) return false; // finish the mouthful first
    if (!this.goTo(CAVE.den.x, CAVE.den.z, 'shelter', urgent ? 0.22 : 0.15)) return false;
    this.hurry = true;
    this.prey = null;
    this.faceHeading = FACE_OUT;
    this.status = urgent ? 'Bolting for the cave' : 'Heading for the cave';
    this.posePreset('walk');
    return true;
  }

  /** Lightning struck at `p`: bolt for cover if it was close, otherwise freeze and stare. */
  lightning(p: THREE.Vector3, strength: number) {
    const near = Math.hypot(p.x - this.rig.inputs.x, p.z - this.rig.inputs.z) < 0.3;
    this.stress = Math.min(1, this.stress + (near ? 0.6 : 0.3) * strength * (this.mode === 'shelter' ? 0.5 : 1));
    this.lookPoint.copy(p);
    this.looking = true;
    this.lookT = 2.5;
    // safe in the cave: a flinch and a blink
    if (this.mode === 'shelter') {
      this.pose.lid = 0.1;
      this.pose.headPitch -= 0.15;
      return;
    }
    if (this.mode === 'sleep') {this.setMode('idle', 'Woken by the thunder'); this.posePreset('alert');}
    const d = Math.hypot(p.x - this.rig.inputs.x, p.z - this.rig.inputs.z);
    if (this.storm > 0.3 && this.seekShelter(d < 0.3 * strength)) return;
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
    this.stress = Math.max(0, this.stress - 0.3);
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
      this.visited[this.visitedCell(I.x, I.z)] += dt;
    }
    I.jaw = damp(I.jaw, 0, 6, dt);
    I.tongue = damp(I.tongue, 0, 12, dt);
    I.lunge = damp(I.lunge, 0, 10, dt);
    I.shake = damp(I.shake, 0, 8, dt);
    if (this.mode !== 'hunt' || this.huntPhase !== 'strike') I.tongueReach = damp(I.tongueReach, 0, 20, dt);
    I.swallow = damp(I.swallow, 0, 3, dt);
    I.bob = damp(I.bob, 0, 20, dt);
    I.wave = damp(I.wave, 0, 3, dt);
    I.display = damp(I.display, 0, 1.5, dt);
    const twitch = this.mode === 'hunt' && (this.huntPhase === 'approach' || this.huntPhase === 'fix') ? 1 : 0;
    I.tailTwitch = damp(I.tailTwitch, twitch, 6, dt);
    let targetSpeed = 0, targetTurn = 0;
    // Thermoregulation: the body follows its surroundings slowly; colour and
    // posture follow the body. A storm keeps it on edge.
    this.bodyTemp += (this.envTemp - this.bodyTemp) * (1 - Math.exp(-dt / 32));
    this.stress = Math.max(this.storm > 0.4 ? 0.45 * this.storm : 0, this.stress - dt / 18);
    I.tone = damp(I.tone, clamp((0.5 - this.bodyTemp) * 2.4, -1, 1), 0.4, dt);
    I.beardDark = damp(I.beardDark, smoothstep01((this.stress - 0.25) / 0.5), 1.5, dt);
    const flatGoal = this.mode === 'bask' ? clamp((0.9 - this.bodyTemp) * 2.2, 0.25, 1) * Math.min(1, 0.3 + this.lampOnIt) : this.mode === 'soak' || this.mode === 'sleep' ? 0.25 : 0;
    I.flatten = damp(I.flatten, flatGoal, 1.2, dt);

    // Sudden close movement of the pointer near the head makes it flinch away.
    // (not with a cricket in its jaws: it finishes the mouthful first)
    if (this.pointer && this.mode !== 'sleep' && this.mode !== 'startle' && this.mode !== 'petted' && !this.prey?.caught) {
      const pv = this.pointer.distanceTo(this.pointerPrev) / Math.max(dt, 1e-3);
      const close = this.pointer.distanceTo(this.rig.snout) < 0.06;
      if (close && pv > 0.8 && rnd() < 0.25) this.startle(this.pointer);
      this.pointerPrev.copy(this.pointer);
    }
    // A cricket in the jaws is always finished off, whatever interrupted the meal
    // (and after a long while it is simply swallowed, so one is never carried for ever).
    if (this.prey?.caught && !this.prey.eaten) {
      this.caughtT += dt;
      if (this.caughtT > 25) {this.prey.eaten = true; this.prey.group.visible = false; this.prey = null; this.onTongue = false;}
      else if (this.mode !== 'hunt' && this.mode !== 'startle' && this.mode !== 'travel') {
        this.onTongue = false;
        if (this.huntPhase !== 'grip' && this.huntPhase !== 'chew' && this.huntPhase !== 'swallow' && this.huntPhase !== 'lick') this.huntPhase = 'grip';
        this.phaseT = 0;
        this.setMode('hunt', 'Eating');
      }
    } else this.caughtT = 0;
    // Prey appearing interrupts calm activities.
    this.boredom = Math.max(0, this.boredom - dt);
    // A storm sends it to the cave.
    const stormy = this.storm > 0.42 || (this.raining && this.storm > 0.25);
    if (stormy && !this.sheltering && this.mode !== 'startle' && this.modeT > 0.5) this.seekShelter(false);
    if (!this.night && !this.sheltering && this.mode !== 'hunt' && this.mode !== 'startle' && this.modeT > 0.8 && this.boredom <= 0) {
      const prey = this.insects.nearest(this.rig.snout);
      if (prey && !prey.airborne && prey.pos.distanceTo(this.rig.snout) < 0.6 && this.canHunt(prey)) this.startHunt(prey);
      else if (prey && this.mode !== 'travel') {this.lookPoint.copy(prey.pos); this.looking = true; this.lookT = 0.8;}
    }

    // Lights out: wind down promptly.
    if (this.night && (this.mode === 'bask' || this.mode === 'idle' || this.mode === 'display') && this.modeT > 2.5) this.chooseActivity();

    // Its eyes are on the sides of its head: to watch something above it (a
    // finger, the camera, the lamp) it tilts its head to turn one eye up.
    I.headTilt = 0;
    if ((this.mode === 'idle' || this.mode === 'bask') && I.look && this.modeT > 1) {
      const d = this.tmpTilt.copy(I.look).sub(this.rig.snout);
      const len = Math.max(0.01, d.length());
      const upK = d.y / len;
      if (upK > 0.3 && len < 0.9) {
        const side = d.x * Math.sin(I.heading) + d.z * Math.cos(I.heading); // + = to its right
        I.headTilt = -Math.sign(side || 1) * clamp((upK - 0.3) * 1.3, 0, 0.42);
      }
    }
    switch (this.mode) {
      case 'bask': {
        // settles along the sandstone ledge first (it arrives facing however the path came in)
        if (this.faceHeading !== null && Math.abs(wrap(this.faceHeading - I.heading)) > 0.12 && this.modeT < 3) {
          targetTurn = this.turnToward(this.faceHeading);
          this.posePreset('alert');
          break;
        }
        this.posePreset('bask');
        this.status = this.bodyTemp < 0.42 ? 'Warming up under the lamp' : this.bodyTemp > 0.78 ? 'Hot: gaping to cool off' : 'Basking under the lamp';
        // Gaping (mouth held open) is how agamids shed excess heat.
        this.gapeT -= dt;
        if (this.gapeT < -14 - rnd() * 20 && this.bodyTemp > 0.7) this.gapeT = 4 + rnd() * 6;
        if (this.gapeT > 0) I.jaw = damp(I.jaw, 0.38, 4, dt);
        this.poseGoal.lid = this.gapeT > 0 ? 0.7 : 0.85;
        this.idleLook(dt, 0.35);
        // a cold dragon stays put until it has warmed; a hot one soon moves off to cool
        const done = this.bodyTemp > 0.74 ? this.modeT > 20 : this.bodyTemp > 0.5 ? this.modeT > 45 + rnd() * 900 * dt : this.modeT > 150;
        if (done) this.chooseActivity();
        break;
      }
      case 'idle': {
        if (this.faceHeading !== null) targetTurn = this.turnToward(this.faceHeading);
        if (this.modeT > 0.3) this.posePreset(this.modeT > 6 ? 'rest' : 'alert');
        this.idleLook(dt, 0.55);
        if (this.modeT > this.holdFor) {this.faceHeading = null; this.chooseActivity();}
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
        if (this.modeT < 5 && Math.abs(wrap(FACE_OUT - I.heading)) > 0.12) {
          targetTurn = this.turnToward(FACE_OUT);
          this.posePreset('rest');
          I.look = null;
          break;
        }
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
      case 'shelter': {
        // turn round to face out of the mouth, then settle low and watch the storm
        if (this.modeT < 3 && Math.abs(wrap(FACE_OUT - I.heading)) > 0.15) {
          targetTurn = this.turnToward(FACE_OUT);
          this.posePreset('alert');
          break;
        }
        if (this.night && this.modeT > 6) {
          this.posePreset('sleep');
          I.look = null;
          this.status = 'Asleep in the cave';
        } else {
          this.posePreset('rest');
          this.poseGoal.headPitch = 0.1;
          this.poseGoal.lid = 0.8;
          this.status = this.storm > 0.2 || this.raining ? 'Sheltering in the cave' : 'Peering out of the cave';
          this.idleLook(dt, 0.45);
        }
        // out again once the weather has been clear for a little while (in daylight)
        this.clearT = this.storm < 0.15 && !this.raining ? this.clearT + dt : 0;
        if (this.clearT > 6 && !this.night) {this.clearT = 0; this.hurry = false; this.posePreset('alert'); this.chooseActivity();}
        break;
      }
      case 'graze': {
        const d = this.dish;
        if (!d || d.remaining <= 0 || this.grazeBites >= 4) {this.setMode('idle', 'Content'); break;}
        this.status = 'Eating greens';
        this.grazeT += dt;
        if (this.grazePhase === 'face') {
          this.posePreset('alert');
          if (this.faceHeading !== null && Math.abs(wrap(this.faceHeading - I.heading)) > 0.12 && this.grazeT < 2) {targetTurn = this.turnToward(this.faceHeading); break;}
          this.grazePhase = 'reach'; this.grazeT = 0;
        }
        // head down to the dish, eyeing a piece, then a sideways nip and a few chews
        this.lookPoint.copy(d.centre); this.lookPoint.y += d.foodHeight; this.looking = true; I.look = this.lookPoint;
        this.posePreset('alert');
        this.poseGoal.chestLift = .65;
        this.poseGoal.headPitch = -0.10;
        if (this.grazePhase === 'reach') {
          I.lunge = Math.max(I.lunge, Math.min(1, this.grazeT / 0.4) * 0.35);
          I.jaw = Math.max(I.jaw, Math.min(1, this.grazeT / 0.4) * 0.38);
          if (this.grazeT > 0.45) {this.grazePhase = 'bite'; this.grazeT = 0;}
        } else if (this.grazePhase === 'bite') {
          I.jaw = 0.04;
          if (this.grazeT > 0.08 && d.take(this.rig.mouth)) {
            this.onCrunch?.(this.rig.mouth, 0.35);
            this.grazePhase = 'chew'; this.grazeT = 0; this.grazeBites++;
          } else if (this.grazeT > 0.3) {this.grazePhase = 'chew'; this.grazeT = 0; this.grazeBites++;}
        } else {
          this.poseGoal.headPitch = 0.05;
          I.look = null;
          I.jaw = 0.06 + 0.14 * Math.max(0, Math.sin(this.grazeT * 17));
          if (this.grazeT > 1.1 && this.grazeT < 1.5) I.tongue = Math.max(I.tongue, Math.sin((this.grazeT - 1.1) / 0.4 * Math.PI) * 0.5);
          if (this.grazeT > 1.7) {this.grazePhase = 'reach'; this.grazeT = 0;}
        }
        break;
      }
      case 'sip': {
        if (this.faceHeading !== null && Math.abs(wrap(this.faceHeading - I.heading)) > 0.12 && this.modeT < 2) {
          targetTurn = this.turnToward(this.faceHeading);
          this.posePreset('alert');
          break;
        }
        this.posePreset('alert');
        this.status = 'Lapping droplets off the leaves';
        this.lookPoint.copy(this.sipTip); this.looking = true; I.look = this.lookPoint;
        // keep the snout on the leaf: small turns of the body and a stretch of the neck
        {
          const want = Math.atan2(-(this.sipTip.z - I.z), this.sipTip.x - I.x);
          if (Math.abs(wrap(want - I.heading)) > 0.04) targetTurn = this.turnToward(want) * 0.5;
          const reach = Math.hypot(this.sipTip.x - I.x, this.sipTip.z - I.z) - Math.hypot(this.rig.mouth.x - I.x, this.rig.mouth.z - I.z);
          I.lunge = Math.max(I.lunge, clamp(reach / 0.03, 0, 0.3));
        }
        // stretch up (or dip) until the mouth meets the leaf tip, then lap at it
        this.poseGoal.chestLift = 1.15;
        this.sipPitch = clamp(this.sipPitch - (this.rig.mouth.y - this.sipTip.y) * 18 * dt, -0.5, 0.35);
        this.poseGoal.headPitch = this.sipPitch;
        const lapT = this.modeT - 0.9;
        if (lapT > 0) {
          const ph = (lapT * 1.6) % 1;
          I.tongue = Math.max(I.tongue, ph < 0.4 ? Math.sin((ph / 0.4) * Math.PI) * 0.85 : 0);
          I.jaw = Math.max(I.jaw, I.tongue * 0.15);
          const lap = Math.floor(lapT * 1.6);
          if (lap > this.lapCount && ph > 0.2) {this.lapCount = lap; this.onSip?.(this.sipTip);}
        }
        if (this.modeT > 5 + rnd() * 60 * dt) {this.lapCount = 0; this.lastSip = this.t; this.setMode('idle', 'Watching');}
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
    // mist on the face: blink, and lick it off the lips
    if (this.snoutLickT > 0) {
      this.snoutLickT -= dt;
      const ph = (this.snoutLickT * 2.2) % 1;
      if (this.mode !== 'hunt') I.tongue = Math.max(I.tongue, ph > 0.6 ? Math.sin(((ph - 0.6) / 0.4) * Math.PI) * 0.7 : 0);
    }

    // Snappy acceleration and braking: bursts, not glides.
    this.speed = damp(this.speed, targetSpeed, targetSpeed > this.speed ? 9 : 14, dt);
    this.turn = damp(this.turn, targetTurn, 5, dt);
    I.speed = this.speed;
    I.turnRate = this.turn;
    const oldHeading=I.heading;
    I.heading = wrap(I.heading + this.turn * dt);
    const oldX = I.x, oldZ = I.z;
    const nx = I.x + Math.cos(I.heading) * this.speed * dt;
    const nz = I.z - Math.sin(I.heading) * this.speed * dt;
    // The hide's straight entry is narrower than the grid's turning margin.
    // Its aligned forward/backward motion is still checked by actual body and
    // foot contacts; an inflated navigation cell must not stop it in the doorway.
    const alignedHide=(this.caveBacking||this.caveExit!==0)&&Math.abs(nx-.485)<.025&&nz>-.10&&nz<.31&&this.surface.heightAt(nx,nz)<.12;
    const huntDoorway=this.mode==='hunt'&&!this.caveExit&&Math.abs(nx-.475)<.14&&nz<.26&&this.surface.heightAt(nx,nz)<.12;
    if (!huntDoorway&&(Math.abs(this.speed) < 1e-4 || ((this.nav.walkable(nx, nz)||alignedHide) && this.nav.canTraverse(I.x, I.z, nx, nz)) || !this.nav.walkable(I.x, I.z))) {I.x = nx; I.z = nz; this.blockedT = 0;}
    else {this.speed *= 0.5; this.blockedT += dt;}
    // The gait follows actual progress; an obstacle cannot make it paddle in place.
    I.speed = Math.sign(this.speed) * Math.hypot(I.x - oldX, I.z - oldZ) / Math.max(dt, 1e-6);
    const movedX = I.x, movedZ = I.z;
    // Pose eases toward its goal.
    const p = this.pose, g = this.poseGoal;
    p.clearance = damp(p.clearance, g.clearance, 4, dt);
    p.chestLift = damp(p.chestLift, g.chestLift, 4, dt);
    p.headPitch = damp(p.headPitch, g.headPitch, 5, dt);
    p.lid = damp(p.lid, g.lid, this.mode === 'sleep' ? 0.6 : 5, dt);
    p.breath = damp(p.breath, g.breath, 2, dt);
    I.clearance = p.clearance + (Math.abs(this.speed) > 0.02 ? 0.2 : 0);
    I.chestLift = p.chestLift;
    I.headPitch = p.headPitch;
    I.lid = p.lid;
    I.breath = p.breath;
    this.rig.update(dt);
    // Measure accepted motion, including turns. A stuck airborne foot must
    // not disable recovery indefinitely, and a healthy pivot is progress.
    const travelling=this.mode==='travel'||this.mode==='startle'||(this.mode==='hunt'&&this.huntPhase==='approach');
    // Direct cave/bowl approaches run before the route's pause/head-lead
    // timers. Those dormant timers must not suppress their stall detection.
    const directApproach=this.caveExit!==0||this.caveBacking||this.bowlExit!==null;
    if(travelling && (directApproach||(this.pauseT<=0&&this.leadT<=0)) && this.retreatT<=0){
      this.stallT+=dt;
      if(Math.hypot(I.x-this.stallRef.x,I.z-this.stallRef.y)>.004 || Math.abs(wrap(I.heading-this.stallHeading))>.06){
        this.stallT=0;this.stallRef.set(I.x,I.z);this.stallHeading=I.heading;
      }
    }else{this.stallT=0;this.stallRef.set(I.x,I.z);this.stallHeading=I.heading;}
    const turningBlocked=Math.abs(this.turn)>.3 && !this.rig.placingFoot && Math.abs(wrap(I.heading-oldHeading))<.0001;
    this.turnStallT=turningBlocked ? this.turnStallT+dt : Math.max(0,this.turnStallT-dt);
    if(this.retreatLeft>0 && this.speed*this.retreatSign>0)this.retreatLeft=Math.max(0,this.retreatLeft-Math.hypot(I.x-oldX,I.z-oldZ));
    if(this.backOutLeft>0 && this.speed<0 && this.retreatT<=0)this.backOutLeft=Math.max(0,this.backOutLeft-Math.hypot(I.x-oldX,I.z-oldZ));
    // Walking on the spot: the rig shoved the body back off the glass or a stone
    // it was walking into (see travel)
    const back = -((I.x - movedX) * Math.cos(I.heading) - (I.z - movedZ) * Math.sin(I.heading));
    this.pushedT = !this.rig.placingFoot && this.speed > 0.01 && back > 0.5 * this.speed * dt ? this.pushedT + dt : Math.max(0, this.pushedT - dt);
    // A caught cricket is held crosswise in the jaws, sticking out of one side
    // and drawn further in with every bite.
    if (this.prey && this.prey.caught && this.onTongue) {
      // stuck to the tongue as it reels in
      this.prey.pos.copy(this.rig.model.tongueTip);
      this.prey.group.position.copy(this.prey.pos);
    } else if (this.prey && this.prey.caught) {
      const c = this.prey;
      const fwd = this.rig.headForward;
      const lat = new THREE.Vector3().crossVectors(fwd, new THREE.Vector3(0, 1, 0)).normalize().multiplyScalar(this.preySide);
      const upH = new THREE.Vector3().crossVectors(lat, fwd).normalize().multiplyScalar(this.preySide);
      const out = (0.006 + 0.004 * (1 - c.consumed)) * (1 - c.consumed * 0.7);
      c.pos.copy(this.rig.mouth).addScaledVector(lat, out).addScaledVector(upH, -0.0022);
      c.group.position.copy(c.pos);
      // the cricket's head points out of the side of the mouth, its back up
      const m = new THREE.Matrix4().makeBasis(lat, upH, new THREE.Vector3().crossVectors(lat, upH));
      c.group.quaternion.setFromRotationMatrix(m);
      c.group.rotation.order = 'XYZ';
    }
  }

  private turnToward(h: number) {
    const e = wrap(h - this.rig.inputs.heading);
    return Math.abs(e) < 0.06 ? 0 : clamp(e * 3.2, -1.25, 1.25);
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
    this.stress = Math.min(1, this.stress + 0.35);
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
    this.setMode(this.after, this.after === 'bask' ? 'Basking under the lamp' : this.after === 'drink' ? 'Drinking' : this.after === 'sleep' ? 'Asleep' : this.after === 'soak' ? 'Soaking in the shallows' : this.after === 'shelter' ? 'Sheltering in the cave' : this.after === 'graze' ? 'Eating greens' : this.after === 'sip' ? 'Lapping droplets off the leaves' : 'Watching');
    if (this.after === 'graze') {this.grazePhase = 'face'; this.grazeBites = 0; this.grazeT = 0; this.lastGraze = this.t;}
    if (this.after === 'bask') this.posePreset('bask');
    if (this.after === 'sip') {this.sipPitch = 0; this.lapCount = 0;}
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
    if(this.stallT>1.5 && this.retreatT<=0){
      if(this.mode==='hunt'&&!this.caveExit&&!this.bowlExit){this.nav.avoidApproach(I.x,I.z,I.heading);this.replan();}
      this.retreatSign=-Math.sign(this.speed||1);this.retreatLeft=.025;this.retreatT=2;
      this.stallT=0;this.pushedT=0;this.turnStallT=0;
    }
    if(this.retreatT>0){
      this.retreatT-=dt;
      if(this.retreatLeft>.003 && this.retreatT>0)return {speed:.025*this.retreatSign,turn:0};
      this.retreatT=0;this.retreatLeft=0;this.stallT=0;this.pushedT=0;this.turnStallT=0;
      // A contact recovery preserves the destination and allows the other
      // supports to take their next step before trying the approach again.
      this.blockedT=0;
    }
    if(this.bowlExit){
      const exit=this.bowlExit;exit.time+=dt;
      // Withdraw into open sand before turning away from the water. Pivoting
      // beside the rim can trap a hind foot between the bowl and front glass.
      if(Math.hypot(I.x-exit.x,I.z-exit.z)>.012 && exit.time<6){
        const err=wrap(exit.heading-I.heading);
        this.posePreset('walk');
        return {speed:Math.abs(err)<.3 ? -.05 : 0,turn:clamp(err*3,-.6,.6)};
      }
      this.bowlExit=null;this.replan();
    }
    // The hide is wide enough to rest in, but not to turn the full animal
    // sideways. Turn on the open sand, then back in with the head facing out.
    if(this.caveApproach && (this.caveBacking || Math.hypot(I.x-.485,I.z-.28)<.025)){
      this.caveBacking=true;
      const dz=I.z-this.goal![1];
      if(dz<.014){this.caveApproach=false;this.faceHeading=-Math.PI/2;this.arrive();return {speed:0,turn:0};}
      const want=Math.atan2(dz,.485-I.x)+Math.PI;
      const err=wrap(want-I.heading);
      this.posePreset('walk');
      return {speed:Math.abs(err)<.25 ? -.035 : 0,turn:clamp(err*3,-.8,.8)};
    }
    if(this.caveExit){
      if(I.z<.28){
        const want=Math.atan2(-(.32-I.z),.485-I.x)+(this.caveExit<0?Math.PI:0),err=wrap(want-I.heading);
        return {speed:Math.abs(err)<.35 ? .035*this.caveExit : 0,turn:clamp(err*3,-.6,.6)};
      }
      this.caveExit=0;
      if(this.mode==='hunt'){this.path=[];this.huntGoal=null;this.huntPrey=null;this.goal=null;return {speed:0,turn:0};}
      this.replan();
    }
    if (!this.path.length || this.pathI >= this.path.length) {this.arrive(); return {speed: 0, turn: 0};}
    // Blocked or stalled: plan again from here, and give up if that keeps failing.
    // (walking on the spot against the glass or a stone counts too; close to the
    // end of the route that is simply as far as it can go, see below)
    if (this.blockedT > 0.8 || this.stallT > 8 || this.turnStallT>2 || (this.pushedT > 3 && this.remaining() > 0.06)) {
      if (this.pushedT > 3 || this.stallT > 8 || this.turnStallT>2) {
        this.nav.avoidApproach(I.x, I.z, I.heading);
        this.retreatSign=-1;this.retreatLeft=.025;this.retreatT=2;this.stallT=0;this.pushedT=0;this.turnStallT=0;
        this.status='Finding a firmer foothold';
        return {speed:-.025,turn:0};
      }
      this.stallT = 0;
      this.pushedT = 0;
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
      // exploring lizards stop to taste the ground with a quick tongue-tap
      if (this.lickT > 0) {
        this.lickT -= dt;
        I.look = null;
        this.poseGoal.headPitch = -0.45;
        const ph = 1 - this.lickT / 0.5;
        if (ph > 0.35 && ph < 0.6) I.tongue = Math.max(I.tongue, Math.sin((ph - 0.35) / 0.25 * Math.PI) * 0.55);
      } else if (this.mode === 'travel' && !this.hurry && rnd() < dt * 0.25) this.lickT = 0.5;
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
      const [nx, nz] = this.path[this.pathI + 1];
      const nextVisible = this.nav.lineClear(I.x, I.z, nx, nz, Infinity);
      if (Math.hypot(wx - I.x, wz - I.z) < 0.018 && nextVisible) {this.pathI++; continue;}
      // past the waypoint along the next segment?
      const sx = nx - wx, sz = nz - wz;
      if ((I.x - wx) * sx + (I.z - wz) * sz > 0 && nextVisible) {this.pathI++; continue;}
      break;
    }
    const remaining = this.remaining();
    const [ex, ez] = this.path[this.path.length - 1];
    if (remaining < 0.014 || (this.pathI === this.path.length - 1 && Math.hypot(ex - I.x, ez - I.z) < 0.014)) {this.arrive(); return {speed: 0, turn: 0};}
    // It watches the way ahead, low and a hand's length out: near the end of the
    // path the gaze runs on past it rather than dropping to a spot under its chin
    // (which would rear its head up like a periscope).
    const look = this.pathPoint(Math.min(0.11, remaining), this.tmp2);
    const over = Math.max(0, 0.11 - remaining);
    const lx = look[0] + Math.cos(I.heading) * over, lz = look[1] - Math.sin(I.heading) * over;
    // (and over a dip, a hollow or the pool, at about the level it walks on)
    this.lookPoint.set(lx, Math.max(this.surface.heightAt(lx, lz), this.surface.heightAt(I.x, I.z) - 0.01) + 0.02, lz);
    I.look = this.lookPoint;
    let aim = this.pathPoint(Math.min(0.062, remaining), this.tmp2);
    for (const ahead of [.04, .025, .012, .005]) {
      if (this.nav.lineClear(I.x, I.z, aim[0], aim[1], Infinity)) break;
      aim = this.pathPoint(Math.min(ahead, remaining), this.tmp2);
    }
    const backing=this.backOutLeft>0;
    const want = Math.atan2(-(aim[1] - I.z), aim[0] - I.x)+(backing?Math.PI:0);
    const err = wrap(want - I.heading);
    if (this.leadT > 0) {
      this.leadT -= dt;
      return {speed: 0, turn: Math.abs(err) > 1.2 ? Math.sign(err) * 1.1 : 0};
    }
    // Nearly there: a lizard does not wheel round for the last step or two, nor
    // keep circling or pushing at a spot it cannot quite reach (tucked against
    // the sandstone ledge, up at the glass). That is as far as it goes: it has arrived.
    if (this.path !== this.nearPath) {this.nearPath = this.path; this.nearBest = Infinity; this.nearT = 0;}
    if (remaining < this.nearBest - 0.005) {this.nearBest = remaining; this.nearT = 0;}
    else this.nearT += dt;
    if (remaining < 0.035 && (Math.abs(err) > 1.0 || this.nearT > 1.5 || this.pushedT > 0.25)) {
      this.pushedT = 0;
      this.arrive();
      return {speed: 0, turn: 0};
    }
    let speed = (backing?Math.min(this.cruise,.05):this.cruise) * Math.max(0, Math.cos(err)) ** 2;
    // Too far off course: pivot on the spot with short steps, as lizards do.
    if (Math.abs(err) > 1.25) speed = 0;
    // ease off on the final approach and through the water
    speed *= clamp(remaining / 0.05, 0.4, 1);
    if (this.nav.isWet(I.x, I.z)) speed *= 0.6;
    const rise = this.surface.heightAt(I.x + Math.cos(I.heading) * .04, I.z - Math.sin(I.heading) * .04) - this.surface.heightAt(I.x, I.z);
    speed *= clamp(1 / (1 + Math.abs(rise) / .03), .35, 1);
    const maxTurn = this.mode === 'startle' ? 2.0 : this.mode==='hunt' ? 1.8 : 1.15;
    const turn = clamp(err * 3.3, -maxTurn, maxTurn);
    this.burstLeft -= this.speed * dt;
    if (this.burstLeft <= 0 && this.mode !== 'startle' && !this.hurry && remaining > 0.08) {
      this.pauseT = rnd() < 0.25 ? 1.2 + rnd() * 2.5 : 0.25 + rnd() * 0.7;
    }
    return {speed:backing?-speed:speed, turn};
  }

  private hunt(dt: number) {
    const I = this.rig.inputs;
    const c = this.prey;
    if (!c || (c.eaten && this.huntPhase !== 'lick')) {this.prey = null; this.setMode('idle', 'Watching'); return {speed: 0, turn: 0};}
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
        return {speed: 0, turn: !this.caveExit&&!this.bowlExit&&Math.abs(err) > 0.6 ? this.turnToward(want) : 0};
      case 'approach': {
        this.status = 'Chasing a cricket';
        this.posePreset('walk');
        // Finish leaving a confined stance before fixation, steering or a
        // strike can take control. The tail and hind feet must clear it too.
        if(this.caveExit||this.bowlExit)return this.travel(dt);
        // Keep closing during a hop, aiming at the reachable landing area.
        // Contact checks still govern every step; only a grounded cricket can
        // trigger the final fixation and strike.
        const target=c.pos.clone();
        if(c.airborne){
          const height=Math.max(0,c.pos.y-this.surface.heightAt(c.pos.x,c.pos.z));
          const flight=clamp((c.vel.y+Math.sqrt(c.vel.y*c.vel.y+19.6*height))/9.8,0,.3);
          const x=c.pos.x+c.vel.x*flight,z=c.pos.z+c.vel.z*flight;
          if(this.nav.dry(x,z))target.set(x,this.surface.heightAt(x,z),z);
        }
        const mouthD = c.pos.distanceTo(this.rig.mouth);
        if (!c.airborne && mouthD < 0.055 && Math.abs(err) < 0.4) {this.huntPhase = 'fix'; this.phaseT = 0; this.path = []; return {speed: 0, turn: 0};}
        if (this.phaseT > 50) {this.ignorePrey.set(c, this.t + 10); this.prey = null; this.boredom = 6; this.setMode('idle', 'Lost interest'); return {speed: 0, turn: 0};}
        this.cruise=flat>.20?.24:flat>.09?.18:.10;
        this.huntReplanT=Math.max(0,this.huntReplanT-dt);
        // Plan a route to a stand-off spot near the prey; replan if it moves.
        const moved = !this.huntPrey || Math.hypot(this.huntPrey[0] - target.x, this.huntPrey[1] - target.z) > 0.03;
        if ((moved || !this.path.length) && this.huntReplanT<=0) {
          this.huntReplanT=.20;
          const stand = this.standPoint(c,target);
          const path = stand && this.nav.path(I.x, I.z, stand[0], stand[1]);
          if (!path) {
            // A hop can briefly hide the prey behind an edge. Keep the last
            // supported approach instead of abandoning a long chase on the
            // first temporarily unavailable landing point.
            this.preyHiddenT+=.20;
            if(this.preyHiddenT>5){this.ignorePrey.set(c,this.t+8);this.prey=null;this.setMode('idle','Watching');return {speed:0,turn:0};}
          }else{
            this.preyHiddenT=0;this.huntPrey=[target.x,target.z];
            this.huntGoal = stand;
            this.path = path;
            this.pathI = 1;
            this.goal = path[path.length - 1];
            this.replans = 0;
          }
        }
        if(!this.path.length)return {speed:0,turn:this.turnToward(want)};
        if (this.pathI >= this.path.length) {
          // At the stand-off point: face the prey, creep in, or strike from a little
          // further (the lunge and tongue add reach). If it cannot get close from
          // this side, try another side.
          if(Math.abs(c.pos.x-.475)<.11&&c.pos.z<.15&&this.surface.heightAt(c.pos.x,c.pos.z)<.12){
            this.status='Watching the cave entrance';return {speed:0,turn:clamp(wrap(Math.PI/2-I.heading)*3,-1,1)};
          }
          if (Math.abs(err) > 0.3) return {speed: 0, turn: clamp(err * 5, -2.5, 2.5)};
          if (!c.airborne && mouthD < 0.06) {this.huntPhase = 'fix'; this.phaseT = 0; return {speed: 0, turn: 0};}
          const ax=I.x+Math.cos(I.heading)*.02,az=I.z-Math.sin(I.heading)*.02;
          const doorway=Math.abs(ax-.475)<.14&&az<.26&&this.surface.heightAt(ax,az)<.12;
          const ahead = !doorway && this.nav.walkable(ax,az) && this.pushedT < 0.3;
          if (ahead) return {speed: c.airborne&&flat<.06?0:.10, turn: clamp(err * 5, -2.5, 2.5)};
          this.standTries++;
          this.huntPrey = null; // forces a new stand-off spot on another side
          this.path = [];
          return {speed: 0, turn: 0};
        }
        const r = this.travel(dt);
        // Keep the eyes on the prey while following the supported route.
        this.lookPoint.copy(c.pos);
        I.look = this.lookPoint;
        if (this.mode !== 'hunt') this.mode = 'hunt';
        return r;
      }
      case 'fix':
        this.status = 'Fixating';
        this.posePreset('walk');this.poseGoal.headPitch=-.25;
        if (c.pos.distanceTo(this.rig.mouth) > 0.085 || c.airborne) {this.huntPhase = 'approach'; this.phaseT = 0; return {speed: 0, turn: 0};}
        if (this.phaseT > 0.12 + rnd() * 0.02) {
          this.huntPhase = 'strike'; this.phaseT = 0;
          // close prey is often picked up with a flick of the sticky tongue
          this.tongueStrike = c.pos.distanceTo(this.rig.mouth) < 0.042 && rnd() < 0.75;
          this.onTongue = false;
          // and a cricket that sees it coming may hop clear
          if (rnd() < 0.25) c.startle(this.rig.snout);
        }
        return {speed: 0, turn: clamp(err * 6, -2, 2)};
      case 'strike': {
        this.status = 'Strike!';
        const k = this.phaseT;
        if (this.tongueStrike) {
          // the tongue shoots out, sticks to the prey and reels it into the mouth
          I.lunge = k < 0.07 ? (k / 0.07) * 0.35 : Math.max(0, 0.35 * (1 - (k - 0.07) / 0.2));
          I.jaw = k < 0.26 ? 0.42 : I.jaw;
          I.tongueReach = k < 0.08 ? k / 0.08 : Math.max(0, 1 - (k - 0.12) / 0.12);
          if (k > 0.04 && k < 0.15 && !c.caught && c.pos.distanceTo(this.rig.model.tongueTip) < 0.013) {
            c.caught = true;
            c.airborne = false;
            this.onTongue = true;
          }
          if (k > 0.26) this.onTongue = false;
          if (k > 0.32) {
            I.tongueReach = 0;
            this.phaseT = 0;
            if (c.caught) {this.huntPhase = 'grip'; this.preySide = Math.random() < 0.5 ? -1 : 1; c.consumed = 0;} else {this.misses++; this.huntPhase = this.misses > 3 ? 'approach' : 'fix'; this.status = 'Missed';}
            if (this.misses > 5) {this.prey = null; this.misses = 0; this.boredom = 8; this.setMode('idle', 'Missed');}
          }
          return {speed: 0, turn: clamp(err * 6, -3, 3)};
        }
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
          if (c.caught) {this.huntPhase = 'grip'; this.preySide = Math.random() < 0.5 ? -1 : 1; c.consumed = 0;} else {this.misses++; this.huntPhase = this.misses > 3 ? 'approach' : 'fix';}
          if (this.misses > 5) {this.prey = null; this.misses = 0; this.boredom = 8; this.setMode('idle', 'Missed');}
        }
        return {speed: k < 0.1 ? 0.32 : 0, turn: clamp(err * 6, -3, 3)};
      }
      case 'grip': {
        // clamp down and thrash the head to subdue it
        this.status = 'Caught it!';
        I.look = null;
        I.jaw = 0.12;
        I.shake = this.phaseT < 0.55 ? 1 : 0;
        c.struggle = 1;
        if (this.phaseT > 0.4 && this.phaseT - dt <= 0.4) this.onCrunch?.(this.rig.mouth, 0.7);
        if (this.phaseT > 0.75) {this.huntPhase = 'chew'; this.phaseT = 0; this.bites = 0; this.biteT = 0;}
        return {speed: 0, turn: 0};
      }
      case 'chew': {
        // bite after bite: open, snap shut with a crunch, work it further in
        this.status = 'Eating';
        I.look = null;
        this.poseGoal.headPitch = 0.18;
        this.biteT += dt;
        const dur = 0.42 + 0.08 * Math.sin(this.bites * 1.7);
        const k = this.biteT / dur;
        I.jaw = k < 0.45 ? 0.12 + 0.3 * Math.sin((k / 0.45) * Math.PI * 0.5) : 0.42 * Math.max(0, 1 - (k - 0.45) / 0.12) + 0.08;
        I.lunge = Math.max(I.lunge, k > 0.4 && k < 0.6 ? 0.18 : 0);
        c.struggle = Math.max(0.05, 1 - this.bites * 0.22);
        if (k >= 1) {
          this.biteT = 0;
          this.bites++;
          c.consumed = Math.min(0.85, c.consumed + 0.16);
          this.onCrunch?.(this.rig.mouth, 1 - this.bites * 0.1);
          // now and then a re-grip with a quick shake
          if (this.bites === 2) I.shake = 0.6;
        }
        if (this.bites >= 5) {this.huntPhase = 'swallow'; this.phaseT = 0;}
        return {speed: 0, turn: 0};
      }
      case 'swallow': {
        // head up, eyes half shut, the throat working it down
        this.status = 'Swallowing';
        I.look = null;
        I.jaw = this.phaseT < 0.25 ? 0.16 : 0.02;
        I.swallow = Math.sin(Math.min(1, this.phaseT / 0.9) * Math.PI);
        this.poseGoal.lid = 0.35;
        c.consumed = Math.min(1, c.consumed + dt * 0.9);
        c.struggle = 0;
        if (this.phaseT > 0.35) c.group.visible = false;
        if (this.phaseT > 1.0) {c.eaten = true; this.misses = 0; this.huntPhase = 'lick'; this.phaseT = 0; this.poseGoal.lid = 1;}
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
