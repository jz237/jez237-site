import * as THREE from 'three';
import {LizardModel, LIZARD_SCALE, LizardLimbData} from './LizardModel';
import {TANK} from './Case';
import {TailDynamics} from './TailDynamics';
import {Footholds} from './Footholds';
import type {TailCollision} from './TailContacts';

/** Keeps a point (with a radius) inside the glass. */
function insideGlass(p: THREE.Vector3, r: number) {
  const mx = TANK.w / 2 - 0.004 - r, mz = TANK.d / 2 - 0.004 - r;
  p.x = Math.max(-mx, Math.min(mx, p.x));
  p.z = Math.max(-mz, Math.min(mz, p.z));
  return p;
}

/**
 * Procedural skeleton for the agamid. The brain sets intentions (where the
 * body is, which way it faces, how fast it goes, where it looks); the rig turns
 * them into bone matrices every frame:
 *  - anchored soles, diagonal walking steps and deliberate contact transfers on climbs
 *  - two-bone IK for each sprawling limb with an outward elbow/knee
 *  - a standing wave in the trunk synchronised with the steps, head stabilised
 *  - a simulated tail that drags on the ground and follows the body's path
 *  - breathing, gular pumping, beard display, jaw, tongue, blinking eyes
 * Units: the sculpt is in centimetres; the scene is in metres.
 */

export interface GroundQuery {
  heightAt(x: number, z: number): number;
  normalAt(x: number, z: number, out?: THREE.Vector3): THREE.Vector3;
  /** What is there (SurfaceKind: 1 rock, 2 wood); optional. */
  kindAt?(x: number, z: number): number;
  heightBelow?(x: number, z: number, ceiling: number): number;
  supportAt?(x: number, z: number, ceiling: number, out: {y: number; normal: THREE.Vector3}): {y: number; normal: THREE.Vector3};
  tailContacts?: TailCollision;
}

const K = LIZARD_SCALE; // metres per sculpt centimetre
const UP = new THREE.Vector3(0, 1, 0);
const tmpV = new THREE.Vector3(), tmpV2 = new THREE.Vector3(), tmpV3 = new THREE.Vector3();
const tmpM = new THREE.Matrix4(), tmpM2 = new THREE.Matrix4();
const tmpQ = new THREE.Quaternion();

const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
const damp = (cur: number, target: number, rate: number, dt: number) => cur + (target - cur) * (1 - Math.exp(-rate * dt));
const wrapAngle = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));
const smooth = (t: number) => t * t * (3 - 2 * t);

function frameMatrix(x: THREE.Vector3, upHint: THREE.Vector3, out: THREE.Matrix4) {
  const X = tmpV.copy(x).normalize();
  const Z = tmpV2.crossVectors(X, upHint);
  if (Z.lengthSq() < 1e-8) Z.crossVectors(X, new THREE.Vector3(0, 0, 1));
  Z.normalize();
  const Y = tmpV3.crossVectors(Z, X).normalize();
  return out.makeBasis(X, Y, Z);
}

interface Leg {
  data: LizardLimbData;
  front: boolean;
  side: number;
  offset: number;
  planted: THREE.Vector3; // hand-bone origin on the ground (world)
  plantedYaw: number;
  normal: THREE.Vector3;
  swing: boolean;
  swingT: number;
  swingDur: number;
  swingStall: number;
  avoiding: boolean;
  returning: boolean;
  from: THREE.Vector3;
  to: THREE.Vector3;
  fromYaw: number;
  toYaw: number;
  toNormal: THREE.Vector3;
  fromNormal: THREE.Vector3;
  heel: number; // 0 flat .. 1 heel raised (late stance)
  homeLocal: THREE.Vector3; // hand origin in the body frame (sculpt cm)
  lastPhase: number;
  liftScale: number;
  wristAbove: number; // wrist height above the hand origin (cm)
  digitRel: THREE.Matrix4[];
  handBindInv: THREE.Matrix4;
  bindUpper: THREE.Matrix4;
  bindLower: THREE.Matrix4;
  reach: number;
  stepDue: boolean;
  stepTop: number;
  bendDirection: THREE.Vector3;
  wristDirection: THREE.Vector3;
  handForward: THREE.Vector3;
  handNormal: THREE.Vector3;
  nextPlanTime: number;
  footprint: THREE.Vector3[];
  limbSkin: THREE.Vector3[][];
  digitHand: THREE.Matrix4 | null;
}

export interface RigInputs {
  /** body centre on the ground (x, z); y is solved from the surface */
  x: number; z: number;
  heading: number; // radians, 0 = +X, positive turns toward -Z (left)
  speed: number; // m/s along the heading
  turnRate: number; // rad/s
  clearance: number; // belly clearance in sculpt cm (0 = lying flat)
  chestLift: number; // extra chest height (cm) from straightened front legs
  headPitch: number; // radians, positive = head up (added to look)
  look: THREE.Vector3 | null; // world point to look at
  jaw: number; // 0..1
  tongue: number; // 0..1
  display: number; // 0..1 beard puff
  lid: number; // 1 open .. 0 closed (combined with blinks)
  breath: number; // breathing depth multiplier
  lunge: number; // 0..1 forward thrust of head and chest
  bob: number; // head-bob offset in cm (push-ups)
  wave: number; // 0..1 arm-wave amount (left front limb)
  sideLean: number; // body roll, radians
  headTilt: number; // head roll, radians (positive: the left eye turns up)
  tailTwitch: number; // 0..1 predatory flicking of the tail tip
  shake: number; // 0..1 thrashing the head side to side (subduing prey)
  swallow: number; // 0..1 a gulp: the throat bulges and the head lifts
  flatten: number; // 0..1 basking: ribs spread, the body widens and flattens to the lamp
  tone: number; // -1 pale (hot) .. 1 dark (cold)
  beardDark: number; // 0..1 a stressed dragon's beard blackens
  tongueReach: number; // 0..1 shooting the tongue out to pick up prey
}

export class LizardRig {
  readonly inputs: RigInputs = {
    x: 0, z: 0, heading: 0, speed: 0, turnRate: 0, clearance: 0.7, chestLift: 0, headPitch: 0,
    look: null, jaw: 0, tongue: 0, display: 0, lid: 1, breath: 1, lunge: 0, bob: 0, wave: 0, sideLean: 0, tailTwitch: 0, shake: 0, swallow: 0, headTilt: 0, flatten: 0, tone: 0, beardDark: 0, tongueReach: 0,
  };
  /** Gait phase 0..1 and the derived standing wave in the trunk. */
  phase = 0;
  private bend = 0;
  private bodyY = 0;
  private bodyPitch = 0;
  private bodyRoll = 0;
  private legs: Leg[] = [];
  private spineNames = ['head', 'neck', 'chest', 'spine2', 'spine1', 'pelvis'];
  private spineIdx: number[];
  private spineBindX: number[];
  private spineBindY: number[];
  private tailIdx: number[];
  private tailBind: THREE.Vector3[];
  private tailPts: THREE.Vector3[] = [];
  private tailDynamics: TailDynamics;
  private tailLen: number[] = [];
  private tailRadius: number[] = [];
  private bindTilt: THREE.Matrix4[] = [];
  private boneWorld: THREE.Matrix4[];
  private headLift = [0, 0];
  private headYaw = 0;
  private headPitchCur = 0;
  private headRollCur = 0;
  private headGoalYaw = 0;
  private headGoalPitch = 0;
  private headHold = 0;
  private blinkT = 2;
  private blink = 0;
  private time = 0;
  private gularT = 0;
  private eyeLook = new THREE.Euler();
  private eyeGoal = new THREE.Euler();
  private eyeHold = 0;
  readonly rootX = 4.1; // sculpt x of the body centre
  /** World position of the snout tip, updated each frame. */
  readonly snout = new THREE.Vector3();
  readonly headForward = new THREE.Vector3(1, 0, 0);
  readonly mouth = new THREE.Vector3();
  moving = false;
  /** 0 walking .. 1 full sprint: the body rises, the nose lifts and the tail comes off the ground. */
  private sprint = 0;
  private walkExtension = 0;
  private strideHz = 0.85;
  private initialised = false;
  private hasPose = false;
  private poseDt = 1 / 60;
  private footholds: Footholds;
  private collision?: TailCollision;
  private accepted: {x:number; z:number; heading:number; y:number; pitch:number; roll:number; bend:number; lift:number; lunge:number} | null = null;
  /** Motion rejected by support/clearance constraints; the brain can replan. */
  blocked = false;
  private climbing = false;
  private motionSpeed = 0;
  get placingFoot() {return this.climbing && this.legs.some(l => l.swing);}
  readonly ground: GroundQuery;
  /** Called whenever a foot is put down (world position). */
  onFootDown?: (p: THREE.Vector3, front: boolean) => void;

  constructor(readonly model: LizardModel, source: GroundQuery) {
    const ceiling=()=>this.initialised ? this.bodyY+.055 : source.heightAt(this.inputs.x,this.inputs.z)+.055;
    const height=(x:number,z:number)=>source.heightBelow
      ? source.heightBelow(x,z,ceiling()) : source.heightAt(x,z);
    this.ground={
      heightAt:height,
      kindAt:source.kindAt?.bind(source),
      supportAt:source.supportAt?.bind(source),
      normalAt:(x,z,out=new THREE.Vector3())=>{
        if(source.heightBelow && source.heightAt(x,z)>ceiling()){
          const e=.002;return out.set(height(x-e,z)-height(x+e,z),2*e,height(x,z-e)-height(x,z+e)).normalize();
        }
        return source.normalAt(x,z,out);
      },
    };
    this.footholds = new Footholds(this.ground);
    this.collision = source.tailContacts;
    const d = model.data;
    this.spineIdx = this.spineNames.map((n) => model.bone(n));
    this.spineBindX = this.spineIdx.map((i) => d.bones[i].origin[0]);
    this.spineBindY = this.spineIdx.map((i) => d.bones[i].origin[1]);
    this.tailIdx = Array.from({length: 10}, (_, i) => model.bone(`tail${i + 1}`));
    this.tailBind = this.tailIdx.map((i) => new THREE.Vector3(...(d.bones[i].origin as [number, number, number])));
    // tail tip beyond the last bone
    this.tailBind.push(new THREE.Vector3(-16.3, 0.23, 0));
    this.boneWorld = d.bones.map(() => new THREE.Matrix4());
    // Bind tilt of every spine/tail bone: its frame if it followed the bind curve.
    const chainX = [...this.spineBindX, ...this.tailBind.map((p) => p.x)];
    const chainY = [...this.spineBindY, ...this.tailBind.map((p) => p.y)];
    const chainIdx = [...this.spineIdx, ...this.tailIdx];
    chainIdx.forEach((bi, k) => {
      const a = Math.max(0, k - 1), b = k === 5 ? 5 : Math.min(chainX.length - 1, k + 1);
      const tan = new THREE.Vector3(chainX[a] - chainX[b], chainY[a] - chainY[b], 0).normalize();
      this.bindTilt[bi] = frameMatrix(tan, UP, new THREE.Matrix4()).clone();
    });
    const pelvisX = d.bones[model.bone('pelvis')].origin[0];
    let prev = new THREE.Vector3(pelvisX, d.bones[model.bone('pelvis')].origin[1], 0);
    for (const p of this.tailBind) {
      this.tailLen.push(prev.distanceTo(p) * K);
      prev = p;
    }
    const prof = d.profile;
    const radiusAt = (x: number) => {
      const i = clamp(Math.round((x + 17.2) / 0.5), 0, prof.length - 1);
      return Math.max(prof[i][1], prof[i][3]);
    };
    // Include the visible scale/spine thickness, rather than testing just the
    // thinner centre line that could leave the rendered skin inside a branch.
    this.tailRadius = this.tailBind.map((p) => radiusAt(p.x) * K * 1.06 + .0004);
    const collision = source.tailContacts ?? {
      projectPoint: (_previous: THREE.Vector3, point: THREE.Vector3, radius: number, normal: THREE.Vector3) => {
        insideGlass(point, radius + .010);
        const floor = (source.heightBelow ? source.heightBelow(point.x, point.z, point.y + radius) : source.heightAt(point.x, point.z)) + radius;
        if (point.y >= floor) return false;
        point.y = floor; normal.y += 1; return true;
      },
    };
    this.tailDynamics = new TailDynamics(this.tailLen, this.tailRadius, collision);

    const offsets: Record<string, number> = {'front-1': 0.0, 'hind1': 0.06, 'front1': 0.5, 'hind-1': 0.56};
    for (const limb of d.limbs) {
      const handBind = model.bind[limb.bones.hand];
      const front = limb.kind === 'front';
      const leg: Leg = {
        data: limb, front, side: limb.side, offset: offsets[`${limb.kind}${limb.side}`] ?? 0,
        planted: new THREE.Vector3(), plantedYaw: 0, normal: new THREE.Vector3(0, 1, 0),
        swing: false, swingT: 0, swingDur: 0.2, swingStall:0, avoiding:false, returning:false, from: new THREE.Vector3(), to: new THREE.Vector3(), fromYaw: 0, toYaw: 0, toNormal: new THREE.Vector3(0, 1, 0), fromNormal:new THREE.Vector3(0,1,0),
        heel: 0,
        homeLocal: new THREE.Vector3(limb.wrist[0] + limb.forward[0] * 0.05, 0, limb.wrist[2] * 1.02),
        lastPhase: 0, liftScale: front ? 0.55 : 0.75, wristAbove: limb.wrist[1] - 0.13,
        digitRel: limb.bones.digits.map((b) => handBind.clone().invert().multiply(model.bind[b])),
        handBindInv: handBind.clone().invert(),
        bindUpper: model.bind[limb.bones.upper].clone(),
        bindLower: model.bind[limb.bones.lower].clone(),
        reach: (limb.upperLength + limb.lowerLength) * K,
        stepDue: false,
        stepTop: 0,
        bendDirection: new THREE.Vector3(), wristDirection: new THREE.Vector3(),
        handForward: new THREE.Vector3(), handNormal: new THREE.Vector3(),
        nextPlanTime: 0,
        footprint: limb.digits.flatMap(d=>[d.base,d.tip]).map(p=>new THREE.Vector3((p[0]-limb.wrist[0]) * K,0,(p[2]-limb.wrist[2]) * K)),
        digitHand:null,
        limbSkin:[limb.bones.upper,limb.bones.lower].map(bone=>{
          const g=model.mesh.geometry,p=g.attributes.position,ids=g.attributes.skinIndex,weights=g.attributes.skinWeight;
          const inverse=model.bind[bone].clone().invert(),points:THREE.Vector3[]=[];
          for(let i=0;i<p.count;i++)for(let j=0;j<4;j++)if(ids.getComponent(i,j)===bone&&weights.getComponent(i,j)>.7){points.push(new THREE.Vector3().fromBufferAttribute(p,i).applyMatrix4(inverse).multiplyScalar(K));break;}
          const envelope=new Set<THREE.Vector3>();
          for(let latitude=0;latitude<=8;latitude++)for(let longitude=0;longitude<16;longitude++){
            const theta=latitude*Math.PI/8,phi=longitude*Math.PI/8,direction=new THREE.Vector3(Math.cos(theta),Math.sin(theta)*Math.cos(phi),Math.sin(theta)*Math.sin(phi));
            let best=points[0],score=-Infinity;for(const p of points){const s=p.dot(direction);if(s>score){score=s;best=p;}}envelope.add(best);
          }
          const min=Math.min(...points.map(p=>p.x)),max=Math.max(...points.map(p=>p.x));
          for(let slice=0;slice<6;slice++)for(let angle=0;angle<8;angle++){
            const cy=Math.cos(angle*Math.PI/4),cz=Math.sin(angle*Math.PI/4);let best:THREE.Vector3|undefined,score=-Infinity;
            for(const p of points)if(Math.min(5,Math.floor((p.x-min)/(max-min)*6))===slice){const s=p.y*cy+p.z*cz;if(s>score){score=s;best=p;}}
            if(best)envelope.add(best);
          }
          return [...envelope];
        }),
      };
      this.legs.push(leg);
    }
  }

  // ---------------------------------------------------------------------------
  /** Body frame (world) at the current pose: origin at the sculpt root point. */
  private body = new THREE.Matrix4();
  private bodyFwd = new THREE.Vector3();
  private bodyUp = new THREE.Vector3();
  private bodyRight = new THREE.Vector3();

  /** Converts a sculpt-space point (cm, body frame) into world space. */
  bodyToWorld(p: THREE.Vector3, out: THREE.Vector3) {
    return out.set((p.x - this.rootX) * K, p.y * K, p.z * K).applyMatrix4(this.body);
  }

  private footSupport(x: number, z: number, out = {y: 0, normal: new THREE.Vector3()}) {
    const hit = this.footholds.support(x, z, this.bodyY + .055);
    out.y = hit.y; out.normal.copy(hit.normal); return out;
  }

  private shoulder(leg: Leg) {
    const k = leg.front ? 2 : 5;
    const origin = this.model.data.bones[this.spineIdx[k]].origin;
    const flank=1+.035*(Math.sin(this.time*Math.PI*2/2.6)*.5+.5)*this.inputs.breath;
    const flat=this.inputs.flatten*(k===5?.5:1);
    const sy=(k===2?1+(flank-1)*.6:1)*(1-.14*flat),sz=(k===2?flank:1)*(1+.17*flat);
    return new THREE.Vector3(leg.data.root[0] - origin[0], leg.data.root[1] - origin[1], leg.data.root[2] - origin[2])
      .multiply(new THREE.Vector3(K,K*sy,K*sz)).applyMatrix4(this.spineFrame[k]).add(this.spinePos[k]);
  }

  private homeWorld(leg: Leg, out: THREE.Vector3, ahead = 0) {
    const h = leg.homeLocal;
    const I=this.inputs, floor=this.ground.heightAt(I.x,I.z);
    const sideX=I.x+this.bodyRight.x*h.z*K,sideZ=I.z+this.bodyRight.z*h.z*K;
    const sideHeight=this.ground.heightAt(sideX,sideZ),kind=this.ground.kindAt?.(I.x,I.z);
    const besideFace=floor<.12 && sideHeight>floor+.03;
    const narrowPerch=(kind===1||kind===2)&&sideHeight<floor-.025;
    const nearGlass=Math.min(TANK.w/2-Math.abs(I.x),TANK.d/2-Math.abs(I.z))<.12;
    const inHide=!!this.ground.kindAt&&Math.abs(I.x-.475)<.11&&I.z<.18&&floor<.12;
    const width=nearGlass||inHide||narrowPerch ? .55 : besideFace ? .70 : 1;
    out.copy(this.bodyFwd).multiplyScalar((h.x - this.rootX) * K + ahead)
      .addScaledVector(this.bodyRight, h.z * K * width * (1 - this.walkExtension * .045));
    out.x += this.inputs.x; out.z += this.inputs.z;
    insideGlass(out, .028);
    out.y = this.footSupport(out.x, out.z).y;
    return out;
  }

  private footYaw(leg:Leg){
    const I=this.inputs;
    const narrow=Math.min(TANK.w/2-Math.abs(I.x),TANK.d/2-Math.abs(I.z))<.12
      ||(!!this.ground.kindAt&&Math.abs(I.x-.475)<.11&&I.z<.18&&this.ground.heightAt(I.x,I.z)<.12)
      ||this.ground.kindAt?.(I.x,I.z)===1||this.ground.kindAt?.(I.x,I.z)===2;
    // Turn the toe fan forward in a tight passage instead of spreading it
    // sideways into the wall. This orientation is chosen before lift-off.
    return I.heading+(narrow ? leg.side*.55 : 0);
  }

  private poseState() {
    const I = this.inputs;
    return {x:I.x, z:I.z, heading:I.heading, y:this.bodyY, pitch:this.bodyPitch, roll:this.bodyRoll,
      bend:this.bend, lift:I.chestLift, lunge:I.lunge};
  }

  private composeBody() {
    const I = this.inputs;
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(this.bodyRoll, I.heading, this.bodyPitch, 'YZX'));
    const thrust = I.lunge * 1.6 * K;
    this.body.compose(new THREE.Vector3(I.x + Math.cos(I.heading) * thrust, this.bodyY - this.spineBindYAt(this.rootX) * K,
      I.z - Math.sin(I.heading) * thrust), q, new THREE.Vector3(1, 1, 1));
    this.bodyFwd.set(1, 0, 0).applyQuaternion(q); this.bodyUp.set(0, 1, 0).applyQuaternion(q);
    this.bodyRight.set(0, 0, 1).applyQuaternion(q);
  }

  /** Test the proposed torso against planted contacts and solid geometry BEFORE committing it. */
  private supportError(limit=Infinity) {
    let error = 0;
    for (const leg of this.legs) {
      if (this.collision) {
        const p=this.shoulder(leg), q=p.clone();
        this.collision.projectPoint(p,q,leg.front?.012:.016,new THREE.Vector3());
        error=Math.max(error,p.distanceTo(q)-.0015);
      }
      if (leg.front && leg.side < 0 && this.inputs.wave > .01) continue;
      // The landing remains reachable throughout swing. Releasing its support
      // constraint until late swing can strand a paw above the sand indefinitely.
      const wrist = (leg.swing ? leg.to.clone() : leg.planted.clone()).addScaledVector(leg.swing ? leg.toNormal : leg.normal, (.12 + leg.wristAbove) * K);
      const S=this.shoulder(leg),distance=S.distanceTo(wrist);
      // Reach is a hard constraint. A pre-existing soft skin contact must never
      // give the optimizer permission to stretch a different planted limb.
      error = Math.max(error, 100*(distance - leg.reach * (leg.swing ? .94 : .96)), 100*(leg.reach*.30-distance));
      if(error>limit)return error;
      if(this.collision && leg.bendDirection.lengthSq()>.5){
        const contactWrist=leg.swing ? this.transferPose(leg,leg.swingT).W : wrist;
        const dir=contactWrist.clone().sub(S).normalize(),plane=leg.bendDirection.clone();
        if(leg.wristDirection.lengthSq()>.5)plane.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(leg.wristDirection,dir));
        plane.addScaledVector(dir,-plane.dot(dir)).normalize();
        error=Math.max(error,this.limbObstruction(leg,S,contactWrist,plane,limit+.0008)-.0008);
      }
      if(error>limit)return error;
    }
    for (const k of [2, 3, 4, 5]) for (const side of [-1, 0, 1]) {
      const p = this.spinePos[k].clone().addScaledVector(this.bodyRight, side * (k === 3 || k === 4 ? .016 : .010));
      const radius = k === 3 || k === 4 ? .014 : .012;
      if (this.collision) {
        const q = p.clone(); this.collision.projectPoint(p, q, radius, new THREE.Vector3());
        error = Math.max(error, p.distanceTo(q) - .0015);
      } else error = Math.max(error, this.ground.heightAt(p.x, p.z) + radius - p.y - .0015);
      const inside = insideGlass(p.clone(), radius + .004);
      error = Math.max(error, inside.distanceTo(p));
      if(error>limit)return error;
    }
    return error;
  }

  private supportPose() {
    let wanted = this.poseState(); const old = this.accepted;
    this.blocked = false;
    if (!old) {this.accepted = wanted; return;}
    // The fitter revisits endpoints while refining a contact. Reuse exact
    // results within this tick; feet, breathing and terrain are unchanged here.
    const errors=new Map<string,number>();
    const errorAt=(limit=Infinity)=>{
      const p=this.poseState(),key=Object.values(p).join(',');
      const cached=errors.get(key);if(cached!==undefined)return cached;
      const value=this.supportError(limit);
      if(value<=limit)errors.set(key,value);
      return value;
    };
    const set = (p: typeof wanted) => {
      Object.assign(this.inputs, {x:p.x,z:p.z,heading:p.heading,chestLift:p.lift,lunge:p.lunge});
      this.bodyY=p.y; this.bodyPitch=p.pitch; this.bodyRoll=p.roll; this.bend=p.bend;
      this.composeBody(); this.solveSpine(0);
    };
    // Once resting, retain a supported posture instead of requesting the same
    // slightly lower crouch and refitting all four limbs every single tick.
    // Breathing still changes the shoulders, so validate the held posture and
    // fall back to the full fitter whenever its contacts actually change.
    if (!this.moving && !this.legs.some(l=>l.swing)
      && Math.hypot(wanted.x-old.x,wanted.z-old.z)<.00001
      && Math.abs(wrapAngle(wanted.heading-old.heading))<.0001
      && Math.abs(wanted.lift-old.lift)<.0001 && Math.abs(wanted.lunge-old.lunge)<.0001
      && Math.abs(wanted.y-old.y)<.0015 && Math.abs(wanted.pitch-old.pitch)<.015 && Math.abs(wanted.roll-old.roll)<.015) {
      set({...wanted,y:old.y,pitch:old.pitch,roll:old.roll});
      if(errorAt(.0001)<=.0001){this.accepted=this.poseState();return;}
      set(wanted);
    }
    // Fit the whole torso to its supports. Lowering alone cannot resolve a
    // descent with front feet on the next step and hind feet on the upper step.
    const fit = () => {
      let best=this.poseState(), error=errorAt();
      const start={...best};
      const ranges = [['y', .085], ['pitch', .9], ['roll', .65]] as const;
      for(let pass=0;pass<3 && error>.0001;pass++) for(const [key,rate] of ranges) {
        if(error<=.0001)break;
        for(const sign of [-1,1]) {
          const candidate={...best,[key]:clamp(best[key]+sign*rate*this.poseDt,old[key]-rate*this.poseDt,old[key]+rate*this.poseDt)};
          set(candidate); const e=errorAt(error-1e-7);
          if(e<error-1e-7){error=e;best=candidate;}
        }
        set(best);
      }
      // Stop at the first supported pose, rather than taking a full correction
      // step past it at rest. Otherwise the requested crouch lowers the torso
      // next tick and the fitter kicks it up again, producing a 30 Hz quiver.
      // During a step, retain the weight shift that clears the next obstacle.
      if(error<=.0001 && !this.moving){
        let lo=0,hi=1;
        for(let i=0;i<6;i++){
          const t=(lo+hi)/2;
          set({...best,y:THREE.MathUtils.lerp(start.y,best.y,t),pitch:THREE.MathUtils.lerp(start.pitch,best.pitch,t),roll:THREE.MathUtils.lerp(start.roll,best.roll,t)});
          if(errorAt(.0001)<=.0001)hi=t;else lo=t;
        }
        set({...best,y:THREE.MathUtils.lerp(start.y,best.y,hi),pitch:THREE.MathUtils.lerp(start.pitch,best.pitch,hi),roll:THREE.MathUtils.lerp(start.roll,best.roll,hi)});
        error=errorAt();
      }
      return error;
    };
    if(errorAt(.0001)>.0001) {fit(); wanted=this.poseState();}
    const apply = (t: number, advance = t) => {
      const I = this.inputs;
      I.x = THREE.MathUtils.lerp(old.x, wanted.x, advance); I.z = THREE.MathUtils.lerp(old.z, wanted.z, advance);
      I.heading = old.heading + wrapAngle(wanted.heading - old.heading) * advance;
      this.bodyY = THREE.MathUtils.lerp(old.y, wanted.y, t);
      this.bodyPitch = THREE.MathUtils.lerp(old.pitch, wanted.pitch, t); this.bodyRoll = THREE.MathUtils.lerp(old.roll, wanted.roll, t);
      this.bend = THREE.MathUtils.lerp(old.bend, wanted.bend, t);
      I.chestLift = THREE.MathUtils.lerp(old.lift, wanted.lift, t); I.lunge = THREE.MathUtils.lerp(old.lunge, wanted.lunge, t);
      this.composeBody(); this.solveSpine(0);
    };
    if (errorAt(.0001) > .0001) {
      apply(0); const previousError = errorAt();
      const allowed = Math.max(.0001, previousError - .00001);
      // Shift weight vertically before advancing over a riser, if the supports permit it.
      apply(1, 0);
      fit();
      if (errorAt(allowed) > allowed) {
        let low = 0, high = 1;
        for (let i = 0; i < 8; i++) {const t = (low + high) / 2; apply(t); if (errorAt(allowed) <= allowed) low = t; else high = t;}
        apply(low);
      }
      this.blocked = Math.hypot(this.inputs.x - wanted.x, this.inputs.z - wanted.z) > .00005
        || Math.abs(wrapAngle(this.inputs.heading - wanted.heading)) > .001;
    }
    this.accepted = this.poseState();
    // The brain retains its desired posture; the accepted pose converges as feet reposition.
    this.inputs.chestLift = wanted.lift; this.inputs.lunge = wanted.lunge;
  }

  /** Teleports the lizard: feet planted at their homes, tail laid out behind. */
  reset() {
    const I = this.inputs;
    this.initialised = false;
    this.hasPose = false; this.accepted = null;
    this.motionSpeed=0;
    this.computeBodyFrame(1, true);
    this.solveSpine(0);
    for (const leg of this.legs) {
      this.homeWorld(leg, leg.planted);
      const foothold = this.footholds.find(leg.planted, this.shoulder(leg), leg.reach, I.heading, leg.side, undefined, leg.footprint);
      if (foothold) {leg.planted.copy(foothold.point); leg.normal.copy(foothold.normal);}
      leg.from.copy(leg.planted); leg.to.copy(leg.planted); leg.toNormal.copy(leg.normal);leg.fromNormal.copy(leg.normal);
      leg.plantedYaw = I.heading;
      leg.swing = false;
      leg.swingStall=0;leg.avoiding=false;leg.returning=false;
      leg.stepDue = false;
      leg.nextPlanTime = 0;
      leg.bendDirection.set(0, 0, 0); leg.wristDirection.set(0, 0, 0);
      leg.handForward.set(0, 0, 0); leg.handNormal.set(0, 0, 0);
      leg.lastPhase = (this.phase + leg.offset) % 1;
      leg.digitHand=null;
      leg.normal.copy(this.footSupport(leg.planted.x, leg.planted.z).normal);
    }
    const pelvis = this.bodyToWorld(new THREE.Vector3(0.9, this.spineBindY[5], 0), new THREE.Vector3());
    this.tailDynamics.reset(pelvis, this.bodyFwd.clone().negate());
    this.tailPts = this.tailDynamics.points;
    this.initialised = true;
    this.accepted = this.poseState();
  }

  private computeBodyFrame(dt: number, snap = false) {
    const I = this.inputs, f = new THREE.Vector3(Math.cos(I.heading), 0, -Math.sin(I.heading));
    const right = new THREE.Vector3(-f.z, 0, f.x);
    const H = (along: number, side = 0) => this.ground.heightAt(I.x + f.x * along + right.x * side, I.z + f.z * along + right.z * side);
    const front = (H(.045) + H(.065)) / 2, rear = (H(-.035) + H(-.055)) / 2;
    const pitch = clamp(Math.atan2(front - rear, .10), -.65, .65);
    const roll = clamp(Math.atan2(H(0, -.025) - H(0, .025), .05), -.22, .22) + I.sideLean;
    const motionWeight=smooth(clamp(this.motionSpeed/.04,0,1));
    const bob = this.moving ? Math.abs(Math.sin(this.phase * Math.PI * 2)) * .10 * motionWeight : 0;
    let y = H(0) + (I.clearance + 1.05 + bob + this.sprint * .6) * K;
    // Anticipate the belly's approach to a rise without instantly lifting the skeleton.
    for (const along of [-.055, -.035, -.015, .015, .035, .055]) {
      y = Math.max(y, H(along) + .018 - along * Math.sin(pitch));
    }
    if (snap) {this.bodyY = y; this.bodyPitch = pitch; this.bodyRoll = roll;}
    else {
      const old = this.accepted;
      this.bodyY = damp(this.bodyY, y, 8, dt);
      this.bodyPitch = damp(this.bodyPitch, pitch, 7, dt); this.bodyRoll = damp(this.bodyRoll, roll, 6, dt);
      if (old) {
        this.bodyY = clamp(this.bodyY, old.y - .085 * dt, old.y + .085 * dt);
        this.bodyPitch = clamp(this.bodyPitch, old.pitch - .9 * dt, old.pitch + .9 * dt);
        this.bodyRoll = clamp(this.bodyRoll, old.roll - .65 * dt, old.roll + .65 * dt);
      }
    }
    this.composeBody();
  }

  private fitBodyHeight(dt: number) {
    let lo = -Infinity, hi = Infinity;
    for (const leg of this.legs) {
      const s = this.shoulder(leg), w = (leg.swing ? leg.to.clone() : leg.planted.clone()).addScaledVector(leg.swing ? leg.toNormal : leg.normal, (.12 + leg.wristAbove) * K);
      const horizontal = (s.x - w.x) ** 2 + (s.z - w.z) ** 2;
      const reach = leg.reach * .94;
      if (horizontal >= reach * reach) continue;
      const dy = Math.sqrt(reach * reach - horizontal), offset = s.y - this.bodyY;
      lo = Math.max(lo, w.y - dy - offset); hi = Math.min(hi, w.y + dy - offset);
    }
    if (lo <= hi) {
      const y = clamp(this.bodyY, lo, hi), old = this.accepted;
      this.bodyY = old ? clamp(y, old.y - .085 * dt, old.y + .085 * dt) : y;
      this.composeBody(); this.solveSpine(0);
    }
  }

  private spineBindYAt(x: number) {
    const prof = this.model.data.profile;
    const i = clamp(Math.round((x + 17.2) / 0.5), 0, prof.length - 1);
    return prof[i][4];
  }

  // ---------------------------------------------------------------------------
  update(dt: number) {
    if (!this.initialised) this.reset();
    dt = Math.min(dt, 1 / 20);
    this.poseDt = dt;
    this.time += dt;
    const I = this.inputs;
    const speedCm = Math.abs(I.speed) / K;
    const heights = this.legs.map(l => l.planted.y);
    const kindHere = this.ground.kindAt?.(I.x, I.z);
    this.climbing = kindHere === 1 || kindHere === 2 || (!!this.ground.kindAt&&Math.abs(I.x-.475)<.11&&I.z<.18&&this.ground.heightAt(I.x,I.z)<.12) || Math.max(...heights) - Math.min(...heights) > .009
      || Math.abs(this.ground.heightAt(I.x + Math.cos(I.heading) * .06, I.z - Math.sin(I.heading) * .06) - this.ground.heightAt(I.x, I.z)) > .008;
    this.moving = speedCm > 0.45 || Math.abs(I.turnRate) > 0.12;
    this.sprint = damp(this.sprint, smooth(clamp((speedCm - 12) / 14, 0, 1)), 6, dt);
    this.walkExtension = damp(this.walkExtension, this.moving ? 1 : 0, 5, dt);
    // Cadence follows speed and the adult model's reachable stride. Loose ground
    // and uneven stone use slightly shorter steps, with smoothly changing timing.
    const kind = this.ground.kindAt?.(I.x, I.z);
    const shortSteps = kind === 0 ? 1.03 : kind === 1 ? 1.07 : 1;
    const targetHz = clamp((0.60 + speedCm / 6.6 + Math.max(0, speedCm - 7.5) * 0.04 + (speedCm < 2 ? Math.abs(I.turnRate) * 0.55 : 0)) * shortSteps, 0.65, 5);
    this.strideHz = damp(this.strideHz, targetHz, 8, dt);
    const freq = this.strideHz;
    // P. vitticeps walking measurements average 63% forefoot and 74% hindfoot
    // stance at 0.30 m/s (Bonnan et al., doi:10.1002/ar.25588). Slower creeping
    // keeps more support; sand adds stance time. These are separate limb timings.
    const pace = clamp(speedCm / 18.75, 0, 1);
    const extraSupport = kind === 0 ? 0.02 : 0;
    const frontDuty = 0.77 - 0.14 * pace + extraSupport;
    const hindDuty = 0.83 - 0.09 * pace + extraSupport;
    if (this.moving) this.phase = (this.phase + dt * freq) % 1;
    if (this.accepted) {
      const dx = I.x - this.accepted.x, dz = I.z - this.accepted.z, distance = Math.hypot(dx, dz);
      const placingFoot = this.climbing && this.legs.some(l => l.swing);
      // Three planted feet can support a small weight shift while the fourth
      // clears a riser. Freezing the torso here can trap a descending hind shin
      // against the edge even though a few millimetres forward would clear it.
      const maximum = (placingFoot ? .032 : this.climbing ? .065 : .36) * dt;
      if (distance > maximum) {I.x = this.accepted.x + dx * maximum / distance; I.z = this.accepted.z + dz * maximum / distance;}
      const turn = placingFoot ? .3 : this.climbing ? .8 : 2.2;
      I.heading = this.accepted.heading + clamp(wrapAngle(I.heading - this.accepted.heading), -turn * dt, turn * dt);
    }
    this.computeBodyFrame(dt);

    // Lateral standing wave in the trunk, synchronised with the diagonal pairs:
    // a sprawling lizard swings its shoulders and hips to lengthen each stride.
    // The body wave follows accepted travel, not the brain's requested speed.
    // A waiting foot must not make the torso paddle and bob against its supports.
    const amp = this.moving ? clamp(0.035 + speedCm / 160, 0.035, 0.18) * smooth(clamp(this.motionSpeed/.04,0,1)) : 0;
    const steer = clamp(I.turnRate * 0.09, -0.18, 0.18);
    this.bend = damp(this.bend, -amp * Math.cos(this.phase * Math.PI * 2) + steer, 14, dt);

    this.updateHead(dt);
    this.solveSpine(dt);
    this.fitBodyHeight(dt);
    const before=this.accepted;
    this.supportPose();
    if(before)this.motionSpeed=damp(this.motionSpeed,Math.hypot(I.x-before.x,I.z-before.z)/dt,10,dt);
    this.updateLegs(dt, freq, frontDuty, hindDuty);
    this.updateTail(dt, speedCm);
    this.updateFace(dt);
    this.commit();
  }

  private updateHead(dt: number) {
    const I = this.inputs;
    // Lizards move the head in quick saccades, then hold it still.
    let goalYaw = 0, goalPitch = 0;
    if (I.look) {
      const chestWorld = this.bodyToWorld(new THREE.Vector3(9.4, 2.6, 0), new THREE.Vector3());
      const d = I.look.clone().sub(chestWorld);
      const local = new THREE.Vector3(d.dot(this.bodyFwd), d.dot(this.bodyUp), d.dot(this.bodyRight));
      goalYaw = clamp(-Math.atan2(local.z, local.x) - this.bend * 0.6, -1.1, 1.1);
      goalPitch = clamp(Math.atan2(local.y, Math.hypot(local.x, local.z)), -0.6, 0.6);
      // on the move the head is carried low and level, glancing only a little up or down
      if (this.moving) goalPitch = clamp(goalPitch, -0.35, 0.18);
    }
    // a bearded dragon's neck is short and thick: the head tips up by about 35°
    // at most (more comes only from raising the chest), and down far enough to drink
    goalPitch = clamp(goalPitch + I.headPitch, -1.15, 0.6);
    this.headHold -= dt;
    const err = Math.abs(goalYaw - this.headGoalYaw) + Math.abs(goalPitch - this.headGoalPitch);
    if (err > 0.14 || (this.headHold < 0 && err > 0.03)) {
      this.headGoalYaw = goalYaw;
      this.headGoalPitch = goalPitch;
      this.headHold = 0.4 + Math.random() * 1.2;
    }
    // fast, critically damped approach = a crisp, bird-like head flick
    this.headYaw = damp(this.headYaw, this.headGoalYaw, 16, dt);
    this.headPitchCur = damp(this.headPitchCur, this.headGoalPitch + I.swallow * 0.35, 14, dt);
    // a slow, deliberate tilt, held, as it turns one eye up to watch something
    this.headRollCur = damp(this.headRollCur, I.headTilt, 4, dt);
    // thrashing prey: quick, wide side-to-side snaps of the head
    if (I.shake > 0.01) this.headYaw += Math.sin(this.time * 23) * 0.32 * I.shake * Math.min(1, dt * 60);
  }

  /** A point along the tail (0 = base). */
  tailPoint(i: number) {return this.tailPts[Math.min(i, this.tailPts.length - 1)] ?? this.spinePos[5];}

  /** World positions of head..pelvis (for picking). */
  spinePoints() {return this.spinePos;}

  // Positions/orientations of head..pelvis (world), computed each frame.
  private spinePos: THREE.Vector3[] = Array.from({length: 6}, () => new THREE.Vector3());
  private spineFrame: THREE.Matrix4[] = Array.from({length: 6}, () => new THREE.Matrix4());

  private solveSpine(dt: number) {
    void dt;
    const I = this.inputs;
    const b = this.bend;
    // Joint yaw (lateral) and pitch (vertical) angles from the root outward.
    // Order matches spineNames: head, neck, chest, spine2, spine1, pelvis.
    const lift = I.chestLift;
    const chestPitch = Math.atan2(lift * 0.9, 4.5) + I.lunge * 0.05;
    const neckYaw = this.headYaw * 0.45 - b * 0.55;
    const headYaw = this.headYaw * 0.55 - b * 0.25;
    const neckPitch = this.headPitchCur * 0.45 - chestPitch * 0.7;
    const headPitch = this.headPitchCur * 0.55 - chestPitch * 0.25;
    const fwdYaw = [b * 0.32, b * 0.34, neckYaw, headYaw];
    const fwdPitch = [chestPitch * 0.5, chestPitch * 0.5, neckPitch, headPitch];
    const backYaw = [b * 0.4, b * 0.4];
    const backPitch = [0, 0];
    // forward chain: root -> spine2 -> chest -> neck -> head
    const root = this.bodyToWorld(new THREE.Vector3(this.rootX, this.spineBindYAt(this.rootX), 0), new THREE.Vector3());
    const chainF = [3, 2, 1, 0];
    const chainB = [4, 5];
    const walk = (order: number[], yaws: number[], pitches: number[], dir: 1 | -1): THREE.Quaternion => {
      let pos = root.clone();
      let px = this.rootX, py = this.spineBindYAt(this.rootX);
      const q = new THREE.Quaternion().setFromRotationMatrix(tmpM.extractRotation(this.body));
      for (let k = 0; k < order.length; k++) {
        const idx = order[k];
        // rotate at this joint (before the segment leading to the next bone)
        const yaw = yaws[k] * dir, pitch = pitches[k];
        // (the head and, a little, the neck roll when it tilts its head)
        const roll = dir > 0 ? (idx === 0 ? this.headRollCur * 0.7 : idx === 1 ? this.headRollCur * 0.3 : 0) : 0;
        const jq = new THREE.Quaternion().setFromEuler(new THREE.Euler(roll, yaw, pitch * dir, 'YZX'));
        q.multiply(jq);
        const nx = this.spineBindX[idx], ny = this.spineBindY[idx];
        const seg = new THREE.Vector3((nx - px) * K, (ny - py) * K, 0);
        // a lunge throws the head forward and the short neck gives a little,
        // never a snake-like stretch (and none with the head tipped up)
        const level = 1 - clamp(this.headPitchCur / 0.6, 0, 1) * 0.85;
        if (idx === 0) seg.x += I.lunge * 0.4 * K * level; // head thrust
        if (idx === 1) seg.x += I.lunge * 0.2 * K * level; // neck
        seg.applyQuaternion(q);
        pos = pos.clone().add(seg);
        this.spinePos[idx].copy(pos);
        px = nx; py = ny;
      }
      return q;
    };
    const headQ = walk(chainF, fwdYaw, fwdPitch, 1);
    walk(chainB, backYaw, backPitch, -1);
    // head bob (push-ups) raises the front of the chain
    if (I.bob) for (const k of [0, 1, 2]) this.spinePos[k].addScaledVector(this.bodyUp, I.bob * K * (k === 2 ? 0.7 : 1));
    // Keep the head and neck above whatever lies under them (stones, roots, the log).
    const len12 = this.spinePos[1].distanceTo(this.spinePos[2]), len01 = this.spinePos[0].distanceTo(this.spinePos[1]);
    for (const k of [1, 0]) {
      const p = this.spinePos[k];
      const need = this.ground.heightAt(p.x, p.z) + (k === 0 ? 0.75 : 0.95) * K;
      const lift = need - p.y;
      if (lift > 0 && dt > 0) {
        this.headLift[k] = Math.max(this.headLift[k], lift);
      }
      this.headLift[k] = Math.max(0, this.headLift[k] - 1.2 * K * dt);
      p.y += this.headLift[k];
      if (k === 1) this.spinePos[0].y += this.headLift[1];
    }
    // ...by rearing the neck and head up, never by stretching them: each joint
    // keeps its distance from the one behind it, trading reach for height
    if (this.headLift[0] > 0 || this.headLift[1] > 0) {
      const keepLen = (p: THREE.Vector3, base: THREE.Vector3, len: number) => {
        const dx = p.x - base.x, dz = p.z - base.z;
        const dy = clamp(p.y - base.y, -0.9 * len, 0.9 * len);
        const h = Math.sqrt(Math.max(0, len * len - dy * dy)), hl = Math.hypot(dx, dz);
        const before = p.clone();
        p.set(base.x + (hl > 1e-6 ? dx / hl * h : 0), base.y + dy, base.z + (hl > 1e-6 ? dz / hl * h : 0));
        return p.clone().sub(before);
      };
      this.spinePos[0].add(keepLen(this.spinePos[1], this.spinePos[2], len12));
      keepLen(this.spinePos[0], this.spinePos[1], len01);
    }
    // Frames from neighbouring joints (tangent toward the head).
    const snoutLocal = new THREE.Vector3(12.68 - this.spineBindX[0], 2.44 - this.spineBindY[0], 0);
    for (let k = 0; k < 6; k++) {
      let ahead: THREE.Vector3, behind: THREE.Vector3;
      if (k === 0) {
        // head direction from the accumulated chain: neck -> head extended
        ahead = this.spinePos[0].clone().add(snoutLocal.clone().multiplyScalar(K).applyQuaternion(headQ));
        behind = this.spinePos[1];
        const t = ahead.clone().sub(behind);
        frameMatrix(t, this.bodyUp, tmpM);
        this.spineFrame[0].copy(tmpM).multiply(tmpM2.copy(this.bindTilt[this.spineIdx[0]]).transpose());
        this.snout.copy(ahead);
        this.headForward.copy(t.normalize());
        continue;
      }
      // Looking up or lifting the head over a rim cannot rotate the shoulder
      // girdle and pull the forefeet out of their accepted support pose.
      ahead = k === 2 ? this.spinePos[2] : k > 0 ? this.spinePos[k - 1] : this.spinePos[k];
      // The pelvis belongs to the trunk. Tail contact must not rotate the hips
      // and feed an alternating correction back through the hind-leg IK.
      behind = k < 5 ? this.spinePos[k + 1] : this.spinePos[k];
      const up = this.bodyUp.clone();
      frameMatrix(ahead.clone().sub(behind), up, tmpM);
      this.spineFrame[k].copy(tmpM).multiply(tmpM2.copy(this.bindTilt[this.spineIdx[k]]).transpose());
    }
  }

  private updateTail(dt: number, _speedCm: number) {
    const pelvis = this.spinePos[5];
    const back = new THREE.Vector3().subVectors(pelvis, this.spinePos[4]).normalize();
    this.tailDynamics.update(dt, pelvis, back, this.inputs.tailTwitch);
  }
  private updateLegs(dt: number, freq: number, frontDuty: number, hindDuty: number) {
    const I = this.inputs, home = new THREE.Vector3();
    const need=(leg:Leg)=>{
      const wrist=leg.planted.clone().addScaledVector(leg.normal,(.12+leg.wristAbove)*K);
      const ratio=this.shoulder(leg).distanceTo(wrist)/leg.reach;
      return Math.max(ratio,1.25-ratio)+Math.abs(wrapAngle(this.footYaw(leg)-leg.plantedYaw))*.3;
    };
    // Transfer the support that most limits the next body motion. A fixed
    // front-to-back order can repeatedly move the front feet and starve a hind step.
    const order=this.climbing ? [...this.legs].sort((a,b)=>Number(b.swing)-Number(a.swing)||need(b)-need(a)) : this.legs;
    for (const leg of order) {
      const duty = leg.front ? frontDuty : hindDuty, ph = (this.phase + leg.offset) % 1;
      leg.avoiding=false;
      if (leg.swing) {
        const previous=leg.swingT,next=Math.min(1,previous+dt/leg.swingDur);
        leg.swingT=next;
        if(this.collision && leg.bendDirection.lengthSq()>.5){
          const depth=(t:number)=>{const p=this.transferPose(leg,t);return this.limbObstruction(leg,p.S,p.W,p.plane);};
          const allowed=Math.max(.0008,depth(previous)+.00002);
          if(depth(next)>allowed){
            let lo=previous,hi=next;
            for(let pass=0;pass<6;pass++){const mid=(lo+hi)/2;if(depth(mid)<=allowed)lo=mid;else hi=mid;}
            leg.swingT=lo;leg.avoiding=true;
            const ahead=this.transferPose(leg,next),now=this.transferPose(leg,lo);
            const prepared=this.clearLimbPlane(leg,ahead.S,ahead.W,ahead.plane)
              .applyQuaternion(new THREE.Quaternion().setFromUnitVectors(ahead.direction,now.direction));
            if(this.limbObstruction(leg,now.S,now.W,prepared)<=allowed){leg.bendDirection.copy(prepared);leg.wristDirection.copy(now.direction);}
          }
          leg.swingStall=leg.swingT-previous<dt/leg.swingDur*.1 ? leg.swingStall+dt : 0;
          if(leg.swingStall>.65){
            // Put a blocked transfer down safely, then let another leg change
            // the support pose. Never leave a paw hanging indefinitely.
            const current=this.footPosition(leg),hold=this.footholds.find(leg.planted,this.shoulder(leg),leg.reach,I.heading,leg.side,undefined,leg.footprint,leg.plantedYaw,Infinity,leg.plantedYaw);
            if(hold){leg.fromNormal.lerp(leg.toNormal,smooth(leg.swingT)).normalize();leg.from.copy(current);leg.to.copy(hold.point);leg.toNormal.copy(hold.normal);leg.stepTop=hold.top;leg.fromYaw=leg.fromYaw+wrapAngle(leg.toYaw-leg.fromYaw)*smooth(leg.swingT);leg.toYaw=leg.plantedYaw;leg.swingT=0;leg.swingDur=.3;leg.returning=true;}
            leg.swingStall=0;
          }
        }
        if (leg.swingT >= 1) {
          const wrist = leg.to.clone().addScaledVector(leg.toNormal, (.12 + leg.wristAbove) * K);
          if (this.shoulder(leg).distanceTo(wrist) > leg.reach * .955) {
            // A turn or a blocked advance can invalidate a predicted landing.
            // Retarget from the current foot pose; never declare an airborne foot planted.
            const current = this.footPosition(leg, .98);
            if(this.time < leg.nextPlanTime){leg.swingT=.98;continue;}
            leg.nextPlanTime=this.time+.12;
            const hold = this.footholds.find(leg.to, this.shoulder(leg), leg.reach, I.heading, leg.side, undefined, leg.footprint,leg.toYaw,Infinity,leg.toYaw);
            if (hold) {
              leg.fromNormal.lerp(leg.toNormal,smooth(leg.swingT)).normalize();
              leg.from.copy(current); leg.to.copy(hold.point); leg.toNormal.copy(hold.normal);
              leg.stepTop = hold.top; leg.swingT = 0; leg.swingDur = .24; leg.fromYaw = leg.toYaw;
            } else leg.swingT = .98;
            leg.lastPhase = ph; continue;
          }
          leg.swing = false; leg.planted.copy(leg.to); leg.plantedYaw = leg.toYaw;
          if(leg.returning){leg.nextPlanTime=this.time+1;leg.returning=false;}
          leg.normal.copy(leg.toNormal); leg.heel = 0;
          this.onFootDown?.(leg.planted, leg.front);
        }
      } else {
        this.homeWorld(leg, home);
        const footYaw=this.footYaw(leg);
        const drift = home.distanceTo(leg.planted), yawErr = Math.abs(wrapAngle(footYaw - leg.plantedYaw));
        const wrist = leg.planted.clone().addScaledVector(leg.normal, (.12 + leg.wristAbove) * K);
        const extension=this.shoulder(leg).distanceTo(wrist)/leg.reach;
        const strained = extension > (this.climbing ? .90 : .955) || extension<.40 || yawErr > (this.climbing ? .32 : .65);
        if (!this.moving || this.climbing) leg.stepDue = false;
        else if (ph >= duty && leg.lastPhase < duty) leg.stepDue = true;
        const settle = !this.moving && (drift > .016 || yawErr > .35) && !this.legs.some(l => l.swing);
        const free = this.legs.filter(l => !l.swing).length;
        if ((leg.stepDue || strained || settle || (this.blocked && this.moving && this.climbing)) && free >= (this.climbing ? 4 : 3) && this.time >= leg.nextPlanTime) {
          leg.nextPlanTime=this.time+.12;
          const swingDur = (1 - duty) / freq;
          const ahead = this.moving ? this.climbing ? Math.sign(I.speed || 1) * .012 : clamp(I.speed * (duty / freq * .5 + swingDur),-.07,.07) : 0;
          this.homeWorld(leg, home, ahead);
          const predicted = this.shoulder(leg);
          // Walking beside a ledge is different from climbing toward it. Keep
          // the lateral feet on the sand when the trunk's route remains level.
          const floor=this.ground.heightAt(I.x,I.z),forward=this.ground.heightAt(I.x+Math.cos(I.heading)*.09,I.z-Math.sin(I.heading)*.09);
          const maximumHeight=floor<.12 && forward<floor+.025 ? floor+.025 : Infinity;
          const hold = this.footholds.find(home, predicted, leg.reach, I.heading, leg.side, leg.planted, leg.footprint,leg.plantedYaw,maximumHeight,footYaw,h=>{
            if(!this.collision||leg.bendDirection.lengthSq()<.5)return true;
            const W=h.point.clone().addScaledVector(h.normal,(.12+leg.wristAbove)*K),direction=W.clone().sub(predicted).normalize(),plane=leg.bendDirection.clone();
            if(leg.wristDirection.lengthSq()>.5)plane.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(leg.wristDirection,direction));
            plane.addScaledVector(direction,-plane.dot(direction)).normalize();
            // A clear sole is insufficient when the shin or elbow would be
            // buried at touchdown. Leave this support planted and try another
            // patch (or another leg) before beginning that impossible transfer.
            return this.limbObstruction(leg,predicted,W,plane,.0015)<.0015;
          });
          if (hold && (hold.point.distanceTo(leg.planted) > (this.climbing ? .009 : .004) || yawErr > .2)) {
            const climbing = Math.abs(hold.point.y - leg.planted.y) > .008 || hold.top > Math.min(hold.point.y, leg.planted.y) + .008;
            if (!climbing || free >= 3) {
              const elapsed = leg.stepDue && ph >= duty ? clamp((ph - duty) / (1 - duty), 0, .15) : 0;
              leg.swing = true; leg.swingT = climbing ? 0 : elapsed; leg.stepDue = false;
              leg.swingStall=0;
              leg.returning=false;
              leg.swingDur = climbing ? Math.max(.32, swingDur) : this.moving ? swingDur : .22;
              leg.from.copy(leg.planted); leg.to.copy(hold.point); leg.fromYaw = leg.plantedYaw;
              leg.fromNormal.copy(leg.normal);
              leg.toYaw = footYaw; leg.toNormal.copy(hold.normal); leg.stepTop = hold.top;
              leg.heel = 0;
            }
          }
        }
      }
      leg.lastPhase = ph;
      // A fixed sole in stance; toes articulate only after lift-off.
      leg.heel = 0;
    }
  }

  private updateFace(dt: number) {
    const I = this.inputs;
    // blinks: the lower lid rises, quickly
    this.blinkT -= dt;
    if (this.blinkT < 0) {
      this.blink = 1;
      this.blinkT = 2.5 + Math.random() * 6;
    }
    this.blink = Math.max(0, this.blink - dt * 4.5);
    const b = this.blink > 0 ? Math.sin(this.blink * Math.PI) : 0;
    const open = clamp(I.lid * (1 - b), 0, 1);
    for (const e of this.model.eyes) e.open.value = open;
    // eyes make their own small saccades
    this.eyeHold -= dt;
    if (this.eyeHold < 0) {
      this.eyeGoal.set((Math.random() - 0.5) * 0.25, 0, (Math.random() - 0.5) * 0.35);
      this.eyeHold = 0.6 + Math.random() * 2;
    }
    this.eyeLook.x = damp(this.eyeLook.x, this.eyeGoal.x, 20, dt);
    this.eyeLook.z = damp(this.eyeLook.z, this.eyeGoal.z, 20, dt);
    for (const e of this.model.eyes) e.look.set(this.eyeLook.x, 0, this.eyeLook.z * e.side);
    this.gularT += dt;
  }

  // ---------------------------------------------------------------------------
  private setBone(i: number, pos: THREE.Vector3, rot: THREE.Matrix4, sy = 1, sz = 1) {
    const m = this.boneWorld[i];
    m.copy(rot);
    m.scale(new THREE.Vector3(K, K * sy, K * sz));
    m.setPosition(pos);
    // Bones carry: world = T(pos) * R * S * inverse(bind) — inverse bind is in the skeleton.
    this.model.bones[i].matrix.copy(m);
  }

  private commit() {
    const I = this.inputs;
    const model = this.model;
    const breathe = Math.sin(this.time * Math.PI * 2 / 2.6) * 0.5 + 0.5;
    const flank = 1 + 0.035 * breathe * I.breath;
    // spine
    for (let k = 0; k < 6; k++) {
      const bi = this.spineIdx[k];
      // basking: the ribs spread, so the trunk widens and flattens
      const flat = k >= 2 ? I.flatten * (k === 5 ? 0.5 : 1) : 0;
      const sy = (k === 2 || k === 3 ? 1 + (flank - 1) * 0.6 : 1) * (1 - 0.14 * flat);
      const sz = (k === 2 || k === 3 || k === 4 ? flank : 1) * (1 + 0.17 * flat);
      this.setBone(bi, this.spinePos[k], this.spineFrame[k], sy, sz);
    }
    // Parallel transport carries the tail's cross-section from the pelvis.
    // Rebuilding every bone from world-up flips its roll at a vertical hang.
    const tailForward = this.spinePos[4].clone().sub(this.spinePos[5]).normalize();
    const tailSide = new THREE.Vector3().setFromMatrixColumn(frameMatrix(tailForward, this.bodyUp, new THREE.Matrix4()), 2);
    for (let i = 0; i < this.tailIdx.length; i++) {
      const bi = this.tailIdx[i];
      const ahead = i === 0 ? this.spinePos[5] : this.tailPts[i - 1];
      const behind = this.tailPts[Math.min(i + 1, this.tailPts.length - 1)];
      const tangent = ahead.clone().sub(behind).normalize();
      if (tangent.lengthSq() < .5) tangent.copy(tailForward);
      tailSide.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(tailForward, tangent));
      tailSide.addScaledVector(tangent, -tailSide.dot(tangent)).normalize();
      const up = new THREE.Vector3().crossVectors(tailSide, tangent).normalize();
      const rot = new THREE.Matrix4().makeBasis(tangent, up, tailSide).multiply(tmpM2.copy(this.bindTilt[bi]).transpose());
      this.setBone(bi, this.tailPts[i], rot);
      tailForward.copy(tangent);
    }
    // jaw and gular hang from head and neck
    const head = model.bone('head'), neck = model.bone('neck');
    const headM = this.boneWorld[head];
    const jawIdx = model.bone('jaw'), gIdx = model.bone('gular');
    const hb = model.data.bones[head].origin, jb = model.data.bones[jawIdx].origin;
    const jawM = headM.clone().multiply(tmpM.makeTranslation(jb[0] - hb[0], jb[1] - hb[1], jb[2] - hb[2])).multiply(tmpM2.makeRotationZ(-I.jaw * 0.55));
    model.bones[jawIdx].matrix.copy(jawM);
    this.boneWorld[jawIdx].copy(jawM);
    const nb = model.data.bones[neck].origin, gb = model.data.bones[gIdx].origin;
    const gular = Math.sin(this.gularT * Math.PI * 2 / 1.7) * 0.5 + 0.5;
    const puff = 1 + I.display * 0.55 + gular * 0.05 * I.breath + I.swallow * 0.3;
    const gM = this.boneWorld[neck].clone().multiply(tmpM.makeTranslation(gb[0] - nb[0], gb[1] - nb[1], gb[2] - nb[2])).multiply(tmpM2.makeScale(1, puff, 1 + I.display * 0.35));
    model.bones[gIdx].matrix.copy(gM);
    this.boneWorld[gIdx].copy(gM);
    model.skin.uDisplay.value = damp(model.skin.uDisplay.value, I.display, 3, 1 / 60);
    model.skin.uTone.value = I.tone;
    model.skin.uBeardDark.value = I.beardDark;
    model.tongueOut = Math.max(I.tongue, I.tongueReach);
    model.tongueReach = I.tongueReach;
    // mouth point (for drinking, eating): inside the jaw, near the front
    this.mouth.set(12.15 - jb[0], model.data.mouth[1][1] - jb[1] - 0.05, 0).applyMatrix4(jawM);
    // legs
    for (const leg of this.legs) this.solveLeg(leg);
    for (const e of model.eyes) {
      e.look.x = clamp(e.look.x, -0.3, 0.3);
    }
    model.syncAttachments();
    this.hasPose = true;
  }

  private footPosition(leg: Leg, phase = leg.swingT) {
    if (!leg.swing) return leg.planted.clone();
    const climbing = Math.abs(leg.to.y - leg.from.y) > .008 || leg.stepTop > Math.min(leg.to.y, leg.from.y) + .008;
    const t = smooth(climbing ? clamp((phase - .28) / .44, 0, 1) : phase);
    const foot = leg.from.clone().lerp(leg.to, t);
    if (climbing) {
      const peak = Math.max(leg.stepTop, leg.from.y, leg.to.y) + .012;
      foot.y = phase < .28 ? THREE.MathUtils.lerp(leg.from.y, peak, smooth(phase / .28))
        : phase > .72 ? THREE.MathUtils.lerp(peak, leg.to.y, smooth((phase - .72) / .28)) : peak;
    } else foot.y += Math.sin(Math.PI * phase) ** 2 * leg.liftScale * K;
    // A turning paw sweeps a wider arc than either endpoint. Keep the complete
    // toe fan inside the glass throughout the transfer, not only at touchdown.
    const yaw=leg.fromYaw+wrapAngle(leg.toYaw-leg.fromYaw)*smooth(phase),c=Math.cos(yaw),s=Math.sin(yaw);
    let minX=0,maxX=0,minZ=0,maxZ=0;
    for(const p of leg.footprint){const x=c*p.x+s*p.z,z=-s*p.x+c*p.z;minX=Math.min(minX,x);maxX=Math.max(maxX,x);minZ=Math.min(minZ,z);maxZ=Math.max(maxZ,z);}
    foot.x=clamp(foot.x,-TANK.w/2+.014-minX,TANK.w/2-.014-maxX);
    foot.z=clamp(foot.z,-TANK.d/2+.014-minZ,TANK.d/2-.014-maxZ);
    return foot;
  }

  private limbObstruction(leg:Leg,S:THREE.Vector3,W:THREE.Vector3,plane:THREE.Vector3,limit=Infinity){
    if(!this.collision)return 0;
    const direction=W.clone().sub(S),dist=direction.length();direction.normalize();
    const a=leg.data.upperLength*K,b=leg.data.lowerLength*K;
    const x=(a*a-b*b+dist*dist)/(2*Math.max(dist,.0001)),y=Math.sqrt(Math.max(0,a*a-x*x));
    const E=S.clone().addScaledVector(direction,x).addScaledVector(plane,y);
    let broad=0;
    for(const [from,to,r0,r1] of [[S,E,leg.front?.016:.020,leg.front?.014:.018],[E,W,leg.front?.011:.012,.006]] as [THREE.Vector3,THREE.Vector3,number,number][]){
      for(const t of [0,.25,.5,.75,1]){
        const p=from.clone().lerp(to,t),q=p.clone();
        this.collision.projectPoint(p,q,THREE.MathUtils.lerp(r0,r1,t),new THREE.Vector3());broad=Math.max(broad,p.distanceTo(q));
      }
    }
    if(broad===0)return 0;
    // Capsules are only a broad phase: their empty corners must not trap a
    // perfectly clear bent leg. Test an envelope sampled from the actual sculpt.
    const Z=new THREE.Vector3().crossVectors(plane,direction).normalize();
    let depth=0;
    // The skinned shoulder/hip blend extends behind the upper-bone origin.
    // Cover that rounded joint separately from the rigid limb envelope.
    const joint=S.clone().addScaledVector(E.clone().sub(S).normalize(),-.005),jointOut=joint.clone();
    this.collision.projectPoint(joint,jointOut,leg.front?.0135:.0165,new THREE.Vector3());
    depth=Math.max(depth,joint.distanceTo(jointOut));
    if(depth>limit)return depth;
    for(let part=0;part<2;part++){
      const origin=part?E:S,X=(part?W.clone().sub(E):E.clone().sub(S)).normalize(),Y=new THREE.Vector3().crossVectors(Z,X).normalize();
      for(const local of leg.limbSkin[part]){
        const p=origin.clone().addScaledVector(X,local.x).addScaledVector(Y,local.y).addScaledVector(Z,local.z),q=p.clone();
        this.collision.projectPoint(p,q,.0015,new THREE.Vector3());depth=Math.max(depth,p.distanceTo(q));
        if(depth>limit)return depth;
      }
    }
    return depth;
  }

  private transferPose(leg:Leg,phase:number){
    const S=this.shoulder(leg),normal=leg.fromNormal.clone().lerp(leg.toNormal,smooth(phase)).normalize();
    const W=this.footPosition(leg,phase).addScaledVector(normal,(.12+leg.wristAbove)*K);
    const delta=W.clone().sub(S),a=leg.data.upperLength*K,b=leg.data.lowerLength*K;
    const distance=delta.length();
    if(distance>0)W.copy(S).addScaledVector(delta.divideScalar(distance),clamp(distance,Math.abs(a-b)+.0001,(a+b)*.999));
    const direction=W.clone().sub(S).normalize(),plane=leg.bendDirection.clone();
    if(leg.wristDirection.lengthSq()>.5)plane.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(leg.wristDirection,direction));
    plane.addScaledVector(direction,-plane.dot(direction)).normalize();
    return {S,W,direction,plane};
  }

  private clearLimbPlane(leg: Leg, S: THREE.Vector3, W: THREE.Vector3, plane: THREE.Vector3) {
    if (!this.collision) return plane;
    const direction = W.clone().sub(S), dist = direction.length(); direction.normalize();
    const a = leg.data.upperLength * K, b = leg.data.lowerLength * K;
    const x = (a*a-b*b+dist*dist)/(2*Math.max(dist,.0001)), y = Math.sqrt(Math.max(0,a*a-x*x));
    const knee = (p:THREE.Vector3)=>S.clone().addScaledVector(direction,x).addScaledVector(p,y);
    const penetration = (p:THREE.Vector3,limit=Infinity)=>this.limbObstruction(leg,S,W,p,limit);
    let score=penetration(plane);
    if(leg.bendDirection.lengthSq()>.5 && leg.wristDirection.lengthSq()>.5){
      const previous=leg.bendDirection.clone().applyQuaternion(new THREE.Quaternion().setFromUnitVectors(leg.wristDirection,direction));
      previous.addScaledVector(direction,-previous.dot(direction)).normalize();
      const depth=penetration(previous,score-.00005);
      if(depth<score-.00005){plane.copy(previous);score=depth;}
    }
    let best=plane.clone(), angle=0;
    if(score<.001) return plane;
    for(const turn of [.2,-.2,.45,-.45,.75,-.75,1.05,-1.05,1.4,-1.4]) {
      const p=plane.clone().applyAxisAngle(direction,turn),E=knee(p),upper=E.clone().sub(S);
      if(upper.dot(this.bodyRight)*leg.side<.001 || (leg.front && upper.dot(this.bodyUp)>.011))continue;
      const s=penetration(p,score-Math.abs(turn)*.0003)+Math.abs(turn)*.0003;
      if(s<score){score=s;best=p;angle=turn;}
    }
    // Contact can change the elbow plane, but cannot snap it around the wrist axis.
    if(angle){
      const next=plane.clone().applyAxisAngle(direction,clamp(angle,-3*this.poseDt,3*this.poseDt));
      return penetration(next)<=penetration(plane)+.00002 ? next : plane;
    }
    return best;
  }

  private solveLeg(leg: Leg) {
    const I = this.inputs;
    const model = this.model;
    const d = leg.data;
    const girdle = leg.front ? 2 : 5; // chest or pelvis
    const gIdx = this.spineIdx[girdle];
    // Shoulder/hip rides on its girdle bone.
    const g = this.boneWorld[gIdx];
    const gOrigin = model.data.bones[gIdx].origin;
    const S = new THREE.Vector3(d.root[0] - gOrigin[0], d.root[1] - gOrigin[1], d.root[2] - gOrigin[2]);
    S.applyMatrix4(g);
    // Foot: planted or swinging.
    const foot = this.footPosition(leg);
    let yaw: number;
    const normal = (leg.swing ? leg.fromNormal : leg.normal).clone();
    if (leg.swing) {
      const phase = clamp(leg.swingT, 0, 1);
      yaw = leg.fromYaw + wrapAngle(leg.toYaw - leg.fromYaw) * smooth(phase);
      normal.lerp(leg.toNormal, smooth(phase)).normalize();
    } else {
      yaw = leg.plantedYaw;
    }
    // Arm wave: the left front limb lifts and circles slowly.
    let waveLift = 0;
    if (leg.front && leg.side < 0 && I.wave > 0.01) {
      const w = I.wave;
      const c = this.time * Math.PI * 2 * 0.55;
      waveLift = w;
      const homeW = this.homeWorld(leg, new THREE.Vector3());
      foot.lerp(homeW, w);
      foot.addScaledVector(this.bodyUp, w * (1.6 + 0.5 * Math.sin(c)) * K);
      foot.addScaledVector(this.bodyFwd, w * (0.6 * Math.cos(c) + 0.4) * K);
      foot.addScaledVector(this.bodyRight, w * leg.side * 0.4 * K);
    }
    // Hand frame: forward along the foot's yaw (plus its bind splay), up along the ground normal.
    const splay = Math.atan2(-d.forward[2], d.forward[0]);
    const fYaw = yaw + splay;

    const wantedForward = new THREE.Vector3(Math.cos(fYaw), 0, -Math.sin(fYaw));
    wantedForward.addScaledVector(normal, -wantedForward.dot(normal));
    const handConfidence = smooth(clamp(wantedForward.length() / .3, 0, 1));
    const fwd = leg.handForward.clone();
    if (leg.handNormal.lengthSq() > .5) fwd.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(leg.handNormal, normal));
    fwd.addScaledVector(normal, -fwd.dot(normal));
    if (fwd.lengthSq() < 1e-10) fwd.copy(wantedForward);
    if (fwd.lengthSq() < 1e-10) fwd.copy(this.bodyFwd).addScaledVector(normal, -this.bodyFwd.dot(normal));
    if (fwd.lengthSq() < 1e-10) fwd.crossVectors(this.bodyRight, normal);
    if (fwd.lengthSq() < 1e-10) fwd.crossVectors(UP, normal);
    fwd.normalize();
    if (wantedForward.lengthSq() > 1e-10) {
      wantedForward.normalize();
      const angle = Math.atan2(normal.dot(new THREE.Vector3().crossVectors(fwd, wantedForward)), fwd.dot(wantedForward));
      fwd.applyAxisAngle(normal, angle * handConfidence);
    }
    leg.handForward.copy(fwd); leg.handNormal.copy(normal);
    let handRot = frameMatrix(fwd, normal, new THREE.Matrix4()).clone();
    // Heel peel: rotate the hand about the toe line (lifts the wrist end).
    const peelAngle = leg.heel * (leg.front ? 0.45 : 0.6) + waveLift * 0.5;
    const toeLine = new THREE.Vector3(d.palm[0] - d.wrist[0], 0, d.palm[2] - d.wrist[2]).length() * K * 2.2;
    const side = new THREE.Vector3().setFromMatrixColumn(handRot, 2);
    const pivot = foot.clone().addScaledVector(fwd, toeLine);
    // The heel is behind the toe pivot: a negative rotation raises it.
    const rq = tmpQ.setFromAxisAngle(side, -peelAngle);
    const handPos = foot.clone().sub(pivot).applyQuaternion(rq).add(pivot);
    handRot = new THREE.Matrix4().makeRotationFromQuaternion(rq).multiply(handRot);
    // The hand bind origin sits slightly above the sole.
    handPos.addScaledVector(normal, 0.12 * K);
    // Absolute hand axes (fwd, up, side), matching how the bind frame was built.
    this.setBone(d.bones.hand, handPos, handRot);
    // Wrist target sits above the hand origin.
    const up = new THREE.Vector3().setFromMatrixColumn(handRot, 1);
    const W = handPos.clone().addScaledVector(up, leg.wristAbove * K);
    // Two-bone IK with an outward, raised elbow/knee.
    const a = d.upperLength * K, b = d.lowerLength * K;
    const toW = W.clone().sub(S);
    let dist = toW.length();
    const maxR = (a + b) * 0.999, minR = Math.abs(a - b) + 1e-4;
    if ((leg.swing || waveLift > 0) && (dist > maxR || dist < minR)) {
      // Out of reach: the whole foot follows the wrist rather than stretching the skin.
      const clamped = S.clone().addScaledVector(toW.lengthSq() > 1e-12 ? toW.clone().normalize() : this.bodyUp.clone().negate(), clamp(dist, minR, maxR));
      handPos.add(clamped.clone().sub(W));
      W.copy(clamped);
      dist = S.distanceTo(W);
      this.setBone(d.bones.hand, handPos, handRot);
    }
    dist = clamp(dist, minR, maxR);
    const dir = W.clone().sub(S).normalize();
    // (the elbow out and back, the knee out and forward, both held up near the level of the shoulder and hip)
    const toPole = leg.front
      ? new THREE.Vector3(d.mid[0] - d.root[0], d.mid[1] - d.root[1], d.mid[2] - d.root[2]).transformDirection(g)
      : this.bodyRight.clone().multiplyScalar(leg.side * .045).addScaledVector(this.bodyUp, .045).addScaledVector(this.bodyFwd, .022);
    const poleLength = toPole.length();
    const preferred = toPole.addScaledVector(dir, -toPole.dot(dir));
    const confidence = smooth(clamp((preferred.length() / poleLength - .04) / .28, 0, 1));
    const perp = leg.bendDirection.clone();
    if (leg.wristDirection.lengthSq() > .5) perp.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(leg.wristDirection, dir));
    perp.addScaledVector(dir, -perp.dot(dir));
    if (perp.lengthSq() < 1e-10) {
      perp.copy(preferred);
      if (perp.lengthSq() < 1e-10) perp.copy(this.bodyRight).multiplyScalar(leg.side).addScaledVector(dir, -this.bodyRight.dot(dir) * leg.side);
    }
    perp.normalize();
    if (!leg.avoiding && preferred.lengthSq() > 1e-10) {
      preferred.normalize();
      const angle = Math.atan2(dir.dot(new THREE.Vector3().crossVectors(perp, preferred)), perp.dot(preferred));
      perp.applyAxisAngle(dir, angle * confidence * (1 - Math.exp(-14 * this.poseDt)));
    }
    perp.copy(this.clearLimbPlane(leg, S, W, perp));
    leg.bendDirection.copy(perp); leg.wristDirection.copy(dir);
    const x = (a * a - b * b + dist * dist) / (2 * dist);
    const y = Math.sqrt(Math.max(0, a * a - x * x));
    const E = S.clone().addScaledVector(dir, x).addScaledVector(perp, y);
    // Bone frames: x along the segment, z = limb plane normal (as in the bind).
    const plane = new THREE.Vector3().crossVectors(perp, dir).normalize();
    const upperRot = new THREE.Matrix4();
    {
      const X = E.clone().sub(S).normalize();
      const Z = plane.clone().addScaledVector(X, -plane.dot(X)).normalize();
      const Y = new THREE.Vector3().crossVectors(Z, X);
      upperRot.makeBasis(X, Y, Z);
    }
    const lowerRot = new THREE.Matrix4();
    {
      const X = W.clone().sub(E).normalize();
      const Z = plane.clone().addScaledVector(X, -plane.dot(X)).normalize();
      const Y = new THREE.Vector3().crossVectors(Z, X);
      lowerRot.makeBasis(X, Y, Z);
    }
    // The bind frames were built the same way, so these are absolute bone axes.
    this.setBone(d.bones.upper, S, upperRot);
    this.setBone(d.bones.lower, E, lowerRot);
    // Digits follow the hand; toes stay flat while the heel peels, curl a little in swing.
    const hw = this.boneWorld[d.bones.hand];
    // The habitat is static. A planted hand's toe contacts do not change when
    // the shoulder moves; retain that solved grip until the hand actually moves.
    const sameGrip=!leg.swing && waveLift===0 && leg.digitHand!==null
      && hw.elements.every((v,i)=>Math.abs(v-leg.digitHand!.elements[i])<1e-12);
    if(sameGrip)return;
    if(!leg.swing && waveLift===0)(leg.digitHand??=new THREE.Matrix4()).copy(hw);
    else leg.digitHand=null;
    d.bones.digits.forEach((bi, i) => {
      const rel = leg.digitRel[i];
      const base = hw.clone().multiply(rel);
      const tip = new THREE.Vector3(...d.digits[i].tip as [number,number,number]).applyMatrix4(model.bind[bi].clone().invert());
      let curl = leg.swing ? -.25 * Math.sin(Math.PI*leg.swingT) : 0;
      // Each toe meets the local surface separately on rounded wood and broken
      // stone. A single palm normal cannot describe all five long, splayed toes.
      for(let pass=0;pass<2;pass++) {
        const m=base.clone().multiply(new THREE.Matrix4().makeRotationZ(curl));
        let correction=0;
        for(const t of [.4,.7,1]) {
          const point=tip.clone().multiplyScalar(t).applyMatrix4(m);
          const support=this.footholds.support(point.x,point.z,point.y+.018);
          correction=Math.max(correction,Math.atan2(support.y+.0006-point.y,Math.max(.003,tip.length()*K*t)));
        }
        curl=clamp(curl+correction,-.3,1.0);
      }
      const rotation=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1),curl);
      const m = base.clone().multiply(new THREE.Matrix4().makeRotationFromQuaternion(rotation));
      if(this.collision){
        const inverse=base.clone().invert();
        // Curl is enough for a rounded top, but a cave wall also needs a small
        // sideways toe flex. Keep the toe base and its length fixed.
        for(let pass=0;pass<3;pass++){
          let deepest=0,target:THREE.Vector3|null=null;
          for(const t of [.5,.75,1]){
            const p=tip.clone().multiplyScalar(t).applyMatrix4(m),q=p.clone();
            this.collision.projectPoint(p,q,.0012,new THREE.Vector3());
            const depth=p.distanceTo(q);
            if(depth>deepest+.0001){deepest=depth;target=q.applyMatrix4(inverse).normalize();}
          }
          if(!target || deepest<.0002)break;
          const wanted=new THREE.Quaternion().setFromUnitVectors(tip.clone().normalize(),target);
          if(wanted.angleTo(new THREE.Quaternion())>1.25)break;
          rotation.rotateTowards(wanted,.35);
          m.copy(base).multiply(new THREE.Matrix4().makeRotationFromQuaternion(rotation));
        }
      }
      model.bones[bi].matrix.copy(m);
      this.boneWorld[bi].copy(m);
    });
  }
}
