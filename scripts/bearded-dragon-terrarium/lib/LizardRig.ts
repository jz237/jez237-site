import * as THREE from 'three';
import {LizardModel, LIZARD_SCALE, LizardLimbData} from './LizardModel';
import {TANK} from './Case';
import {TailDynamics} from './TailDynamics';
import {Footholds, type Foothold} from './Footholds';
import {footTransfer,transferTiming} from './FootTransfer';
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

// Skin probes have a 1.5 mm radius. Let their centres meet a support rather
// than requiring an invisible air gap that can wedge a folded arm at a rim.
const LIMB_CONTACT_MARGIN = .0015;
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
  swingElapsed?: number;
  supportArc?:THREE.Vector3[]|null;
  avoiding: boolean;
  returning: boolean;
  settling: boolean;
  failedStep: THREE.Vector3 | null;
  failedUntil: number;
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
  lateralSpeed?: number; // m/s toward the right flank during a confined recovery
  turnRate: number; // rad/s
  clearance: number; // belly clearance in sculpt cm (0 = lying flat)
  chestLift: number; // extra chest height (cm) from straightened front legs
  headPitch: number; // radians, positive = head up (added to look)
  look: THREE.Vector3 | null; // world point to look at
  tracking: boolean; // sustained attention; no idle gaze hold during a hunt
  restAdjustment: boolean; // one supported comfort step after arrival
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
    tracking:false,restAdjustment:false,
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
  private flankSkin: {parts:{k:number;local:THREE.Vector3;weight:number}[]}[]=[];
  private flankPatches:number[][]=[];
  private flankPoints:THREE.Vector3[]=[];
  private flankMatrices=Array.from({length:6},()=>new THREE.Matrix4());
  private flankScratch={v:new THREE.Vector3(),q:new THREE.Vector3(),n:new THREE.Vector3(),center:new THREE.Vector3(),scale:new THREE.Vector3()};
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
  private stepSearch:{leg:Leg;search:Generator<void,Foothold|null,unknown>;x:number;z:number;heading:number}|null=null;
  private stepWorkRemaining=48;
  private collision?: TailCollision;
  private accepted: ReturnType<LizardRig['poseState']> | null = null;
  /** Motion rejected by support/clearance constraints; the brain can replan. */
  blocked = false;
  private climbing = false;
  private carefulTurn=false;
  private rebalancePoint:THREE.Vector2|null=null;
  private nextComfortStep=0;
  private nextTransferTime=0;
  maneuver:'walk'|'climb'|'turn'='walk';
  private motionSpeed = 0;
  private jawOpen=0;
  private previousHead={yaw:0,pitch:0};
  private headPitchFloor=-1.15;
  private headSkin:{bone:number;patches:{center:THREE.Vector3;radius:number;points:THREE.Vector3[]}[]}[]=[];
  get placingFoot() {return this.climbing && this.legs.some(l => l.swing);}
  get canRedirect(){return !this.legs.some(l=>l.swing)&&Math.abs(this.bodyPitch)<.20
    &&Math.max(...this.legs.map(l=>l.planted.y))-Math.min(...this.legs.map(l=>l.planted.y))<.012;}
  get needsRecovery(){return this.legs.some(l=>l.swing&&l.returning&&(l.swingElapsed??0)>.8);}
  get canPickUpPrey(){return this.legs.filter(l=>!l.swing).length>=3
    &&this.legs.every(l=>!l.front||!l.swing)&&!this.needsRecovery&&Math.abs(this.motionSpeed)<.035;}
  /** Compare millimetre-scale shifts of the current stance. This is a query:
   * no foot, bone, accepted pose or simulation clock advances. The ordinary
   * contact solver must still accept every tick of the chosen recovery. */
  recoveryCost(forward:number,lateral:number,turn=0){
    const I=this.inputs,x=I.x,z=I.z,heading=I.heading;
    try{
      I.x+=.001*(Math.cos(I.heading)*forward+Math.sin(I.heading)*lateral);
      I.z+=.001*(-Math.sin(I.heading)*forward+Math.cos(I.heading)*lateral);
      I.heading+=turn*.01;
      this.composeBody();this.solveSpine(0);
      return this.supportError();
    }finally{I.x=x;I.z=z;I.heading=heading;this.composeBody();this.solveSpine(0);}
  }
  private supportedTransferShoulder(leg:Leg,advance:number){
    const I=this.inputs,x=I.x,z=I.z;
    try{
      I.x+=this.bodyFwd.x*advance;I.z+=this.bodyFwd.z*advance;
      this.composeBody();this.solveSpine(0);
      return this.supportError(.0001,undefined,undefined,leg)<=.0001?this.shoulder(leg):null;
    }finally{I.x=x;I.z=z;this.composeBody();this.solveSpine(0);}
  }
  /** The contact solver owns the final root pose; behavior consumes this feedback. */
  readonly motion = {speed:0,turnRate:0,blocked:false,transferring:false};
  readonly ground: GroundQuery;
  /** Called whenever a foot is put down (world position). */
  onFootDown?: (p: THREE.Vector3, front: boolean) => void;

  constructor(readonly model: LizardModel, source: GroundQuery) {
    const ceiling=()=>this.initialised ? this.bodyY+.055 : source.heightAt(this.inputs.x,this.inputs.z)+.055;
    const height=(x:number,z:number)=>source.heightBelow
      ? source.heightBelow(x,z,ceiling()) : source.heightAt(x,z);
    this.ground={
      heightAt:height,
      tailContacts:source.tailContacts,
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
    for(const name of ['head','neck','jaw']){
      const bone=model.bone(name),g=model.mesh.geometry,p=g.attributes.position,ids=g.attributes.skinIndex,w=g.attributes.skinWeight;
      const inverse=model.bind[bone].clone().invert(),points:THREE.Vector3[]=[];
      for(let i=0;i<p.count;i++)for(let j=0;j<4;j++)if(ids.getComponent(i,j)===bone&&w.getComponent(i,j)>.7){points.push(new THREE.Vector3().fromBufferAttribute(p,i).applyMatrix4(inverse));break;}
      // Convex extremes miss contacts inside the jaw's outline, especially a
      // curved bowl rim. Spatial patches cover the whole visible surface.
      // A conservative sphere rejects distant patches before vertex checks.
      const cells=new Map<string,THREE.Vector3[]>(),unique=new Set<string>();
      for(const p of points){
        // Sub-millimetre sculpt detail does not need separate collision casts.
        // A 2.56 mm spatial cell plus the 3 mm probe margin covers that detail
        // while bounding the expensive checks beside a curved stone face.
        const id=p.toArray().map(v=>Math.floor(v/.16)).join(',');if(unique.has(id))continue;unique.add(id);
        const key=p.toArray().map(v=>Math.floor(v/.6)).join(',');
        const cell=cells.get(key)??[];cell.push(p);cells.set(key,cell);
      }
      const patches=[...cells.values()].map(points=>{
        const center=new THREE.Box3().setFromPoints(points).getCenter(new THREE.Vector3());
        return {center,radius:Math.max(...points.map(p=>p.distanceTo(center)))*K,points};
      });
      this.headSkin.push({bone,patches});
    }
    this.spineIdx = this.spineNames.map((n) => model.bone(n));
    {
      const g=model.mesh.geometry,p=g.attributes.position,ids=g.attributes.skinIndex,w=g.attributes.skinWeight;
      const cells=new Map<string,number>(),inverse=this.spineIdx.map(b=>model.bind[b].clone().invert());
      for(let i=0;i<p.count;i++){
        if(Math.abs(p.getZ(i))<1.6)continue;
        let trunk=true;
        for(let j=0;j<4;j++)if(w.getComponent(i,j)>.001&&this.spineIdx.indexOf(ids.getComponent(i,j))<2){trunk=false;break;}
        if(!trunk)continue;
        // Retain the outer skin in each 6.4 mm longitudinal/vertical cell.
        // The narrow belly capsules do not cover the spreading flank spines.
        const key=[Math.floor(p.getX(i)/.4),Math.floor(p.getY(i)/.4),Math.sign(p.getZ(i))].join(',');
        const old=cells.get(key);if(old===undefined||Math.abs(p.getZ(i))>Math.abs(p.getZ(old)))cells.set(key,i);
      }
      const patches=new Map<string,number[]>();
      for(const i of cells.values()){
        const parts:{k:number;local:THREE.Vector3;weight:number}[]=[];
        for(let j=0;j<4;j++)if(w.getComponent(i,j)>.001){
          const k=this.spineIdx.indexOf(ids.getComponent(i,j));
          parts.push({k,local:new THREE.Vector3().fromBufferAttribute(p,i).applyMatrix4(inverse[k]),weight:w.getComponent(i,j)});
        }
        const key=[Math.floor(p.getX(i)/1.2),Math.floor(p.getY(i)/1.2),Math.sign(p.getZ(i))].join(',');
        const patch=patches.get(key)??[];patch.push(this.flankSkin.length);patches.set(key,patch);
        this.flankSkin.push({parts});
      }
      this.flankPatches=[...patches.values()];
      this.flankPoints=this.flankSkin.map(()=>new THREE.Vector3());
    }
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
        swing: false, swingT: 0, swingDur: 0.2, swingStall:0, avoiding:false, returning:false, settling:false, failedStep:null, failedUntil:0, from: new THREE.Vector3(), to: new THREE.Vector3(), fromYaw: 0, toYaw: 0, toNormal: new THREE.Vector3(0, 1, 0), fromNormal:new THREE.Vector3(0,1,0),
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
      // Toe endpoints leave the centre and heel of the palm unsampled. Keep
      // the lowest original hand vertex in each 4 mm patch, so a rough riser
      // cannot protrude through the palm between otherwise clear toes.
      const geometry=model.mesh.geometry,positions=geometry.attributes.position,skinIds=geometry.attributes.skinIndex,skinWeights=geometry.attributes.skinWeight;
      const palmCells=new Map<string,number>();
      for(let i=0;i<positions.count;i++)for(let j=0;j<4;j++)if(skinIds.getComponent(i,j)===limb.bones.hand&&skinWeights.getComponent(i,j)>.7){
        const key=`${Math.floor((positions.getX(i)-limb.wrist[0])/.25)},${Math.floor((positions.getZ(i)-limb.wrist[2])/.25)}`,old=palmCells.get(key);
        if(old===undefined||positions.getY(i)<positions.getY(old))palmCells.set(key,i);
        break;
      }
      for(const id of palmCells.values())leg.footprint.push(new THREE.Vector3((positions.getX(id)-limb.wrist[0])*K,0,(positions.getZ(id)-limb.wrist[2])*K));
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
    const width=nearGlass||inHide||narrowPerch ? .55 : besideFace ? .70 : 1-.15*this.walkExtension;
    out.copy(this.bodyFwd).multiplyScalar((h.x - this.rootX) * K + ahead)
      .addScaledVector(this.bodyRight, h.z * K * width * (1 - this.walkExtension * .045));
    out.applyAxisAngle(UP,this.turnLead());
    out.x += this.inputs.x; out.z += this.inputs.z;
    insideGlass(out, .028);
    out.y = this.footSupport(out.x, out.z).y;
    return out;
  }

  private turnLead(){
    // Prepare a short support step for the requested turn before asking the
    // constrained torso to rotate. Targets based only on the accepted heading
    // can stay unchanged precisely when the planted feet prevent that turn.
    return this.carefulTurn||this.climbing?clamp(this.inputs.turnRate*.18,-.18,.18):0;
  }

  private footYaw(leg:Leg){
    const I=this.inputs;
    const narrow=Math.min(TANK.w/2-Math.abs(I.x),TANK.d/2-Math.abs(I.z))<.12
      ||(!!this.ground.kindAt&&Math.abs(I.x-.475)<.11&&I.z<.18&&this.ground.heightAt(I.x,I.z)<.12)
      ||this.ground.kindAt?.(I.x,I.z)===1||this.ground.kindAt?.(I.x,I.z)===2;
    // Turn the toe fan forward in a tight passage instead of spreading it
    // sideways into the wall. This orientation is chosen before lift-off.
    const bindSplay=Math.atan2(-leg.data.forward[2],leg.data.forward[0]);
    return I.heading+this.turnLead()-(narrow ? bindSplay*.9 : 0);
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
  private supportError(limit=Infinity, allowances?:number[], measured?:number[], transferring?:Leg) {
    let error = 0;
    const measure=(key:number,value:number)=>{
      value=Math.max(0,value);if(measured)measured[key]=value;
      return value-(allowances?.[key]??0);
    };
    for (const [index,leg] of this.legs.entries()) {
      if(leg===transferring)continue;
      if (this.collision) {
        const p=this.shoulder(leg), q=p.clone();
        this.collision.projectPoint(p,q,leg.front?.012:.016,new THREE.Vector3());
        error=Math.max(error,measure(index*3,p.distanceTo(q)-.0015));
      }
      if (leg.front && leg.side < 0 && this.inputs.wave > .01) continue;
      // The landing remains reachable throughout swing. Releasing its support
      // constraint until late swing can strand a paw above the sand indefinitely.
      // Once a transfer is rejected, its old landing may be folded beneath
      // the shoulder or out of reach. Constrain the visible airborne limb,
      // not that abandoned target, while three planted feet support recovery.
      const recovering=leg.swing&&leg.returning&&!leg.settling;
      const wrist = recovering?this.transferPose(leg,leg.swingT).W
        :(leg.swing ? leg.to.clone() : leg.planted.clone()).addScaledVector(leg.swing ? leg.toNormal : leg.normal, (.12 + leg.wristAbove) * K);
      const S=this.shoulder(leg),distance=S.distanceTo(wrist);
      // Reach is a hard constraint. A pre-existing soft skin contact must never
      // give the optimizer permission to stretch a different planted limb.
      const maximum=recovering?(leg.data.upperLength+leg.data.lowerLength)*K*.999:leg.reach*(leg.swing?.94:.96);
      const minimum=recovering&&!leg.front?this.minimumTransferReach(leg):leg.reach*(leg.front?.40:.30);
      let reachError=Math.max(100*(distance-maximum),100*(minimum-distance));
      // Keep a committed climbing arc reachable, including its withdrawal
      // path. Moving the shoulder over a lifted paw can make the return arc
      // fold through the elbow even while the final landing remains reachable.
      if(leg.swing&&leg.supportArc)for(const point of leg.supportArc){
        const d=S.distanceTo(point);
        reachError=Math.max(reachError,100*(d-leg.reach*.98),100*(this.minimumTransferReach(leg)-d));
      }
      if(leg.swing&&!leg.returning){
        const airborne=this.transferPose(leg,leg.swingT);
        reachError=Math.max(reachError,100*(leg.reach*.40-airborne.distance));
      }
      error = Math.max(error, measure(index*3+1,reachError));
      if(error>limit)return error;
      if(this.collision && leg.bendDirection.lengthSq()>.5){
        const contact=leg.swing ? this.transferPose(leg,leg.swingT)
          : this.transferPoseFor(leg,leg.planted,leg.normal,S);
        error=Math.max(error,measure(index*3+2,this.limbObstruction(leg,S,contact.W,contact.plane,limit+LIMB_CONTACT_MARGIN+(allowances?.[index*3+2]??0))-LIMB_CONTACT_MARGIN));
      }
      if(error>limit)return error;
    }
    for (const k of [2, 3, 4, 5]) for (const side of [-1, 0, 1]) {
      const key=12+(k-2)*6+(side+1)*2;
      const p = this.spinePos[k].clone().addScaledVector(this.bodyRight, side * (k === 3 || k === 4 ? .016 : .010));
      const radius = k === 2 || k === 3 || k === 4 ? .016 : .012;
      if (this.collision) {
        const q = p.clone(); this.collision.projectPoint(p, q, radius, new THREE.Vector3());
        error = Math.max(error, measure(key,p.distanceTo(q) - .0015));
      } else error = Math.max(error, measure(key,this.ground.heightAt(p.x, p.z) + radius - p.y - .0015));
      const inside = insideGlass(p.clone(), radius + .004);
      error = Math.max(error, measure(key+1,inside.distanceTo(p)));
      if(error>limit)return error;
    }
    // Skin blends continuously between the spinal joints. Separate spheres
    // at the joints leave an uncovered belly strip across a sharp rock edge.
    for(const k of [2,3,4])for(const side of [-1,0,1]){
      const key=37+(k-2)*3+side+1;
      const width=k===2?.013:k===3?.016:.013;
      const p=this.spinePos[k].clone().lerp(this.spinePos[k+1],.5).addScaledVector(this.bodyRight,side*width);
      if(this.collision){
        const q=p.clone();this.collision.projectPoint(p,q,.016,new THREE.Vector3());
        error=Math.max(error,measure(key,p.distanceTo(q)-.0015));
      }else error=Math.max(error,measure(key,this.ground.heightAt(p.x,p.z)+.016-p.y-.0015));
      if(error>limit)return error;
    }
    if(this.collision){
      // Use the actual blended skin and the same breathing/flattening scale
      // as rendering. Inflating a trunk sphere would also fill empty space
      // beneath a flank and unnecessarily block supported climbs.
      const matrices=this.flankMatrices,points=this.flankPoints,{v,q,n,center,scale}=this.flankScratch;
      for(let k=0;k<6;k++)matrices[k].copy(this.spineFrame[k]).scale(this.spineScale(k,scale)).setPosition(this.spinePos[k]);
      for(let i=0;i<points.length;i++){
        const p=points[i].set(0,0,0);for(const part of this.flankSkin[i].parts)p.addScaledVector(v.copy(part.local).applyMatrix4(matrices[part.k]),part.weight);
      }
      for(const patch of this.flankPatches){
        center.set(0,0,0);for(const i of patch)center.add(points[i]);center.divideScalar(patch.length);
        let radius=.002;for(const i of patch)radius=Math.max(radius,points[i].distanceTo(center)+.002);
        q.copy(center);this.collision.projectPoint(center,q,radius,n.set(0,0,0));
        if(center.distanceToSquared(q)<1e-16)continue;
        for(const i of patch){
          const p=points[i];q.copy(p);this.collision.projectPoint(p,q,.002,n.set(0,0,0));
          error=Math.max(error,measure(46+i,p.distanceTo(q)-.0015));
          if(error>limit)return error;
        }
      }
    }
    // The neck first chooses a clear, bounded gaze. Its resulting envelope
    // then constrains root movement too: steering cannot carry the jaw through
    // a rock while waiting for an independent neck correction to catch up.
    return Math.max(error, measure(36,this.headContactDepth(limit + .001+(allowances?.[36]??0)) - .001));
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
    const waiting=this.legs.filter(l=>l.swing&&(l.avoiding||l.swingStall>.05));
    const scoreAt=()=>{
      const current=errorAt();
      // Real contacts take priority over a future swing pose. Combining both
      // in one max-error allowed the hips to sink while clearing a raised paw.
      if(current>.0001)return 1+current*100;
      let future=0;
      for(const leg of waiting){
        const p=this.transferPose(leg,Math.min(1,leg.swingT+this.poseDt/leg.swingDur));
        const minimum=this.minimumTransferReach(leg);
        future=Math.max(future,this.limbObstruction(leg,p.S,p.W,p.plane)-LIMB_CONTACT_MARGIN,100*(minimum-p.distance));
      }
      return future;
    };
    const set = (p: typeof wanted) => {
      Object.assign(this.inputs, {x:p.x,z:p.z,heading:p.heading,chestLift:p.lift,lunge:p.lunge});
      this.bodyY=p.y; this.bodyPitch=p.pitch; this.bodyRoll=p.roll; this.bend=p.bend;
      this.composeBody(); this.solveSpine(0);
    };
    // Elevated transfers are planned as complete clear arcs. Preserve that
    // supported torso while the paw crosses the edge; translating the hip
    // midway can invalidate the shin clearance near touchdown. The ordinary
    // fitter remains available for an already blocked recovery or a changed
    // head/body contact. Weight shifts resume as soon as the paw is planted.
    if(this.legs.some(l=>l.swing&&l.supportArc)&&!this.legs.some(l=>l.swing&&(l.returning||l.swingStall>.05))){
      set(old);
      if(errorAt(.0001)<=.0001){this.accepted=this.poseState();return;}
      set(wanted);
    }
    // A snap may wait for a foot to lift. When that support releases, advance
    // from the accepted pose rather than jumping to the brain's elapsed lunge.
    const lunge=clamp(wanted.lunge,old.lunge-8*this.poseDt,old.lunge+12*this.poseDt);
    if(lunge!==wanted.lunge){wanted.lunge=lunge;set(wanted);}
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
      let best=this.poseState(), error=scoreAt();
      const start={...best};
      const ranges = [['y', .085], ['pitch', .9], ['roll', .65]] as const;
      // A knee beside a rim may need a lateral weight shift before lowering.
      // Height and pitch alone cannot provide that clearance. These small
      // shifts retain every planted anchor and pass the same whole-body checks.
      const levelSupports=!this.climbing||(Math.abs(old.pitch)<.20&&Math.max(...this.legs.map(l=>l.planted.y))-Math.min(...this.legs.map(l=>l.planted.y))<.025);
      if(this.moving&&levelSupports&&Math.abs(old.roll)>.3&&Math.abs(this.motion.speed)<.01&&!this.rebalancePoint)
        this.rebalancePoint=new THREE.Vector2(old.x,old.z);
      if(this.rebalancePoint&&Math.hypot(this.inputs.x-this.rebalancePoint.x,this.inputs.z-this.rebalancePoint.y)>.10)this.rebalancePoint=null;
      const groundShift=this.moving&&levelSupports&&this.rebalancePoint!==null;
      const shifts=waiting.length||groundShift?[['x',.03],['z',.03]] as const:[];
      // On level supports, a small weight shift can release a folded limb
      // without rolling the trunk farther onto its side. These bounded shifts
      // preserve all anchors and pass the same mesh and reach constraints.
      const axes=groundShift?[...shifts,...ranges]:[...ranges,...shifts];
      for(let pass=0;pass<3 && error>.0001;pass++) for(const [key,rate] of axes) {
        if(error<=.0001)break;
        for(const sign of [-1,1]) {
          const anchor=groundShift&&(key==='x'||key==='z')?start[key]:old[key];
          const candidate={...best,[key]:clamp(best[key]+sign*rate*this.poseDt,anchor-rate*this.poseDt,anchor+rate*this.poseDt)};
          set(candidate); const e=scoreAt();
          if(e<error-1e-7){error=e;best=candidate;}
        }
        set(best);
      }
      if(error>.0001 && this.moving){
        // At a ledge, raising the hips and changing pitch must happen
        // together: either adjustment alone can worsen another planted leg.
        // Search coupled weight shifts only after the cheap axial fit fails.
        const base={...best};
        for(const dy of [-1,0,1])for(const dp of [-1,0,1])for(const dr of [-1,0,1]){
          if(Number(dy!==0)+Number(dp!==0)+Number(dr!==0)<2)continue;
          const candidate={...base,
            y:clamp(base.y+dy*.085*this.poseDt,old.y-.085*this.poseDt,old.y+.085*this.poseDt),
            pitch:clamp(base.pitch+dp*.9*this.poseDt,old.pitch-.9*this.poseDt,old.pitch+.9*this.poseDt),
            roll:clamp(base.roll+dr*.65*this.poseDt,old.roll-.65*this.poseDt,old.roll+.65*this.poseDt)};
          set(candidate);const e=scoreAt();
          if(e<error-1e-7){error=e;best=candidate;}
        }
        set(best);
      }
      const elevatedSupports=this.ground.heightAt(this.inputs.x,this.inputs.z)>.12||this.legs.some(l=>l.planted.y>.12);
      if(error>.0001&&this.moving&&elevatedSupports&&(waiting.some(l=>(l.swingElapsed??0)>.3)||(Math.abs(this.motion.speed)<.001&&Math.abs(this.motion.turnRate)<.03))){
        // A constrained stance can require simultaneous translation, pitch
        // and roll. Coordinate descent cannot cross that corner of the
        // feasible region. Linearize each contact separately, project a small
        // coupled correction, then verify it against the actual meshes.
        // The same per-tick movement bounds still apply; this never releases
        // an anchor or accepts a linear approximation without a full check.
        const axes=[['x',.03],['z',.03],['y',.085],['pitch',.9],['roll',.65]] as const;
        const base={...best};
        const sample=()=>{
          const values:number[]=[];this.supportError(Infinity,undefined,values);
          for(const leg of waiting){
            const p=this.transferPose(leg,Math.min(1,leg.swingT+this.poseDt/leg.swingDur));
            values.push(Math.max(0,this.limbObstruction(leg,p.S,p.W,p.plane)-LIMB_CONTACT_MARGIN));
            values.push(Math.max(0,100*(this.minimumTransferReach(leg)-p.distance)));
          }
          return Array.from({length:values.length},(_,i)=>values[i]??0);
        };
        const values=sample(),gradients=values.map(()=>Array(axes.length).fill(0));
        for(const [axis,[key,rate]] of axes.entries()){
          const span=rate*this.poseDt;
          set({...base,[key]:base[key]+span});const plus=sample();
          set({...base,[key]:base[key]-span});const minus=sample();
          for(let i=0;i<values.length;i++)gradients[i][axis]=((plus[i]??0)-(minus[i]??0))*.5;
        }
        const correction=Array(axes.length).fill(0);
        for(let pass=0;pass<16;pass++)for(let i=0;i<values.length;i++){
          const g=gradients[i],norm=g.reduce((sum,v)=>sum+v*v,0);
          if(norm<1e-16)continue;
          const excess=values[i]+g.reduce((sum,v,j)=>sum+v*correction[j],0)-.00005;
          if(excess<=0)continue;
          for(let j=0;j<axes.length;j++)correction[j]=clamp(correction[j]-g[j]*excess/norm,-1,1);
        }
        for(const fraction of [1,.5,.25]){
          const candidate={...base};
          for(const [j,[key,rate]] of axes.entries())candidate[key]=clamp(base[key]+correction[j]*rate*this.poseDt*fraction,old[key]-rate*this.poseDt,old[key]+rate*this.poseDt);
          set(candidate);const e=scoreAt();
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
      return errorAt();
    };
    if(this.moving&&errorAt(.0001)>.0001){
      // A requested trunk sway or crouch must not veto a safe translation.
      // Preserve the supported trunk first; at a ramp edge its steering bend
      // can otherwise trap the hind foot even while backing away is feasible.
      const requested=this.poseState(),requestedError=errorAt();
      // A crouch must not pin an extended forefoot beside a shallow dish.
      // Retain its supported chest while all contacts are at floor level.
      // During a descent, the last high rear support still requires climbing
      // posture changes even after the root itself has reached the sand.
      const floorSupports=this.ground.heightAt(this.inputs.x,this.inputs.z)<.12
        &&this.legs.every(l=>l.planted.y<.12&&(!l.swing||l.to.y<.12));
      set({...requested,y:old.y,pitch:old.pitch,roll:old.roll,bend:old.bend,
        lift:floorSupports?old.lift:requested.lift,lunge:floorSupports?old.lunge:requested.lunge});
      if(errorAt()>requestedError)set(requested);
    }
    if(errorAt(.0001)>.0001||waiting.length)fit();
    wanted=this.poseState();
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
      apply(0);
      const allowance:number[]=[];this.supportError(Infinity,undefined,allowance);
      for(let k=0;k<allowance.length;k++)allowance[k]=Math.max(0,(allowance[k]??0)-.00011);
      // An existing contact at one joint must never authorize penetration at
      // another. Compare each limb/body contact with its own previous bound.
      const acceptable=()=>this.supportError(.0001,allowance)<=.0001;
      // Shift weight vertically before advancing over a riser, if the supports permit it.
      apply(1, 0);
      fit();
      if (!acceptable()) {
        let low = 0, high = 1;
        for (let i = 0; i < 8; i++) {const t = (low + high) / 2; apply(t); if (acceptable()) low = t; else high = t;}
        apply(low);
      }
      this.blocked = Math.hypot(this.inputs.x - wanted.x, this.inputs.z - wanted.z) > .00005
        || Math.abs(wrapAngle(this.inputs.heading - wanted.heading)) > .001;
    }
    this.accepted = this.poseState();
    // Keep the accepted posture through every subsequent spine solve. The
    // brain owns the desired pose and will request it again next tick; restoring
    // a rejected lift here silently invalidated the planted shoulder supports.
  }

  /** Teleports the lizard: feet planted at their homes, tail laid out behind. */
  reset() {
    this.rebalancePoint=null;
    const I = this.inputs;
    this.initialised = false;
    this.hasPose = false; this.accepted = null;
    this.motionSpeed=0;
    this.headPitchFloor=-1.15;
    this.stepSearch=null;
    this.nextTransferTime=0;
    this.computeBodyFrame(1, true);
    this.solveSpine(0);
    for (const leg of this.legs) {
      this.homeWorld(leg, leg.planted);
      const foothold = this.footholds.find(leg.planted, this.shoulder(leg), leg.reach, I.heading, leg.side, undefined, leg.footprint);
      if (foothold) {leg.planted.copy(foothold.point); leg.normal.copy(foothold.normal);}
      leg.from.copy(leg.planted); leg.to.copy(leg.planted); leg.toNormal.copy(leg.normal);leg.fromNormal.copy(leg.normal);
      leg.plantedYaw = I.heading;
      leg.swing = false;
      leg.swingStall=0;leg.swingElapsed=0;leg.avoiding=false;leg.returning=false;leg.supportArc=null;
      leg.failedStep=null;leg.failedUntil=0;leg.settling=false;
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
      if(leg.swing&&leg.returning&&!leg.settling)continue; // a new, verified recovery landing does own the torso
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
    this.previousHead={yaw:this.headYaw,pitch:this.headPitchCur};
    this.stepWorkRemaining=48;
    this.time += dt;
    const I = this.inputs;
    this.jawOpen=damp(this.jawOpen,I.jaw,25,dt);
    const speedCm = Math.hypot(I.speed,I.lateralSpeed??0) / K;
    const heights = this.legs.map(l => l.planted.y);
    const kindHere = this.ground.kindAt?.(I.x, I.z);
    this.climbing = kindHere === 1 || kindHere === 2 || (!!this.ground.kindAt&&Math.abs(I.x-.475)<.11&&I.z<.18&&this.ground.heightAt(I.x,I.z)<.12) || Math.max(...heights) - Math.min(...heights) > .009
      || Math.abs(this.ground.heightAt(I.x + Math.cos(I.heading) * .06, I.z - Math.sin(I.heading) * .06) - this.ground.heightAt(I.x, I.z)) > .008;
    const wasMoving=this.moving;
    this.moving = speedCm > 0.45 || Math.abs(I.turnRate) > 0.12;
    if(this.moving&&!wasMoving)for(const leg of this.legs){
      // A failed cosmetic adjustment waits at rest, but that long cooldown
      // must not pin a planted limb when a deliberate walk begins.
      if(!leg.swing)leg.nextPlanTime=Math.min(leg.nextPlanTime,this.time);
      leg.failedUntil=Math.min(leg.failedUntil,this.time+1);
    }
    this.carefulTurn=(Math.abs(I.turnRate)>.55&&Math.abs(I.speed)<.04)||Math.abs(I.lateralSpeed??0)>.002;
    this.maneuver=this.climbing?'climb':this.carefulTurn?'turn':'walk';
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
      const maximum = (placingFoot ? .045 : this.climbing ? .08 : .36) * dt;
      if (distance > maximum) {I.x = this.accepted.x + dx * maximum / distance; I.z = this.accepted.z + dz * maximum / distance;}
      // Keep the support frame aligned during a committed climbing transfer.
      // Re-aiming the torso midway through that arc can trap the shin even
      // though both the original lift and landing were clear.
      const turn = placingFoot ? 0 : this.climbing ? .8 : 2.2;
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
    this.resolveHeadContact();
    this.fitBodyHeight(dt);
    const before=this.accepted;
    this.supportPose();
    if(before){
      this.motion.speed=Math.sign(I.speed||(I.lateralSpeed??0))*Math.hypot(I.x-before.x,I.z-before.z)/dt;
      this.motion.turnRate=wrapAngle(I.heading-before.heading)/dt;
      this.motionSpeed=damp(this.motionSpeed,Math.abs(this.motion.speed),10,dt);
    }
    this.updateLegs(dt, freq, frontDuty, hindDuty);
    this.resolveHeadContact();
    this.motion.blocked=this.blocked;this.motion.transferring=this.legs.some(l=>l.swing);
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
      // A target passing behind the short neck must not flip atan2 from one
      // extreme to the other. The body turns toward it; the head keeps a bounded
      // forward gaze, including when a path target crosses a ramp edge.
      goalYaw = clamp(-Math.atan2(local.z, Math.max(.025,local.x)) - this.bend * 0.6, -1.1, 1.1);
      goalPitch = clamp(Math.atan2(local.y, Math.max(.03,Math.hypot(local.x, local.z))), -0.6, 0.6);
      if(I.tracking&&this.hasPose){
        const near=I.look.clone().sub(this.mouth),distance=near.length();
        if(distance>.012&&distance<.08){
          // At pickup distance, aiming from the chest creates large parallax:
          // the mouth can pass beside the insect while the torso keeps turning.
          // Close the remaining yaw error from the actual committed mouth.
          const error=wrapAngle(Math.atan2(-near.z,near.x)-Math.atan2(-this.headForward.z,this.headForward.x));
          goalYaw=clamp(this.headYaw+clamp(error*.25,-.18,.18),-1.1,1.1);
          const pitchError=Math.atan2(near.y,Math.hypot(near.x,near.z))
            -Math.atan2(this.headForward.y,Math.hypot(this.headForward.x,this.headForward.z));
          goalPitch=clamp(this.headPitchCur+clamp(pitchError*.2,-.12,.12)-I.headPitch,-.8,.6);
        }
      }
      // on the move the head is carried low and level, glancing only a little up or down
      if (this.moving) goalPitch = clamp(goalPitch, -0.35, 0.18);
    }
    // a bearded dragon's neck is short and thick: the head tips up by about 35°
    // at most (more comes only from raising the chest), and down far enough to drink
    this.headPitchFloor=Math.max(-1.15,this.headPitchFloor-.35*dt);
    goalPitch = clamp(goalPitch + I.headPitch, this.headPitchFloor, 0.6);
    this.headHold -= dt;
    const err = Math.abs(goalYaw - this.headGoalYaw) + Math.abs(goalPitch - this.headGoalPitch);
    if (I.tracking || err > 0.14 || (this.headHold < 0 && err > 0.03)) {
      this.headGoalYaw = goalYaw;
      this.headGoalPitch = goalPitch;
      this.headHold = I.tracking ? 0 : 0.4 + Math.random() * 1.2;
    }
    // fast, critically damped approach = a crisp, bird-like head flick
    const yawRate=this.moving?4:8,pitchRate=this.moving?3:6;
    this.headYaw = clamp(damp(this.headYaw, this.headGoalYaw, 16, dt),this.headYaw-yawRate*dt,this.headYaw+yawRate*dt);
    this.headPitchCur = clamp(damp(this.headPitchCur, this.headGoalPitch + I.swallow * 0.35, 14, dt),this.headPitchCur-pitchRate*dt,this.headPitchCur+pitchRate*dt);
    // a slow, deliberate tilt, held, as it turns one eye up to watch something
    this.headRollCur = damp(this.headRollCur, I.headTilt, 4, dt);
    // thrashing prey: quick, wide side-to-side snaps of the head
    if (I.shake > 0.01) this.headYaw += Math.sin(this.time * 23) * 0.32 * I.shake * Math.min(1, dt * 60);
  }

  /** The neck/head can rear independently of the shoulder supports. Check the
   * visible jaw and snout, not just a sphere at the centre of the skull. */
  private headContactDepth(limit=Infinity){
    if(!this.collision)return 0;
    const model=this.model,head=model.bone('head'),neck=model.bone('neck'),jaw=model.bone('jaw');
    const hb=model.data.bones[head].origin,jb=model.data.bones[jaw].origin;
      const headM=this.spineFrame[0].clone().scale(new THREE.Vector3(K,K,K)).setPosition(this.spinePos[0]);
      const neckM=this.spineFrame[1].clone().scale(new THREE.Vector3(K,K,K)).setPosition(this.spinePos[1]);
      const jawM=headM.clone().multiply(new THREE.Matrix4().makeTranslation(jb[0]-hb[0],jb[1]-hb[1],jb[2]-hb[2]))
        .multiply(new THREE.Matrix4().makeRotationZ(-this.jawOpen*.55));
      let maximum=0;
      const center=new THREE.Vector3(),broad=new THREE.Vector3(),p=new THREE.Vector3(),q=new THREE.Vector3(),normal=new THREE.Vector3();
      for(const group of this.headSkin){const M=group.bone===head?headM:group.bone===neck?neckM:jawM;
        for(const patch of group.patches){
          center.copy(patch.center).applyMatrix4(M);broad.copy(center);
          this.collision.projectPoint(center,broad,patch.radius+.003,normal.set(0,0,0));
          if(center.distanceToSquared(broad)<1e-16)continue;
          for(const local of patch.points){
            p.copy(local).applyMatrix4(M);q.copy(p);
            this.collision.projectPoint(p,q,.003,normal.set(0,0,0));
            maximum=Math.max(maximum,p.distanceTo(q));if(maximum>limit)return maximum;
          }
        }
      }
      return maximum;
  }

  private resolveHeadContact(){
    let penetration=this.headContactDepth();if(penetration<.001)return;
    const original=this.headPitchCur,originalYaw=this.headYaw;let bestPitch=original,bestYaw=originalYaw,bestDepth=penetration;
    // Solve pitch and yaw together. Rearing through a large angle before trying
    // a small sideways motion caused a five-centimetre head pop at the glass.
    // Every contact correction shares the normal angular-speed limits.
    const yawStep=4*this.poseDt,pitchStep=3*this.poseDt;
    this.headYaw=this.previousHead.yaw;this.headPitchCur=this.previousHead.pitch;this.solveSpine(0);
    const retained=this.headContactDepth();
    if(retained<bestDepth){bestDepth=retained;bestYaw=this.headYaw;bestPitch=this.headPitchCur;}
    for(const dp of [0,pitchStep,-pitchStep])for(const dy of [0,-yawStep,yawStep]){
      this.headYaw=clamp(clamp(originalYaw+dy,-1.1,1.1),this.previousHead.yaw-yawStep,this.previousHead.yaw+yawStep);
      this.headPitchCur=clamp(clamp(original+dp,-1.15,.6),this.previousHead.pitch-pitchStep,this.previousHead.pitch+pitchStep);
      this.solveSpine(0);penetration=this.headContactDepth();
      if(penetration<bestDepth-1e-7){bestDepth=penetration;bestPitch=this.headPitchCur;bestYaw=this.headYaw;}
    }
    this.headYaw=bestYaw;this.headPitchCur=bestPitch;this.solveSpine(0);
    if(bestPitch>original)this.headPitchFloor=Math.max(this.headPitchFloor,bestPitch);
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
        this.headLift[k] = Math.max(this.headLift[k],Math.min(lift,this.headLift[k]+.04*dt));
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
  private minimumTransferReach(leg:Leg){
    // A withdrawing hind knee can flex farther than a load-bearing stance.
    // Use the two-bone geometric limit during recovery; its final planted
    // landing still needs the ordinary support reach and full skin clearance.
    return leg.returning&&!leg.front?Math.abs(leg.data.upperLength-leg.data.lowerLength)*K+.0001:leg.reach*.40;
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
    const serial=this.climbing||this.carefulTurn||this.legs.some(l=>l.swing&&l.supportArc);
    const order=serial ? [...this.legs].sort((a,b)=>Number(b.swing)-Number(a.swing)||need(b)-need(a)) : this.legs;
    for (const leg of order) {
      const duty = leg.front ? frontDuty : hindDuty, ph = (this.phase + leg.offset) % 1;
      leg.avoiding=false;
      if (leg.swing) {
        leg.swingElapsed=(leg.swingElapsed??0)+dt;
        const previous=leg.swingT,next=Math.min(1,previous+dt/leg.swingDur);
        leg.swingT=next;
        if(this.collision && leg.bendDirection.lengthSq()>.5){
          const before=this.transferPose(leg,previous);
          const minimum=Math.min(before.distance,this.minimumTransferReach(leg))-1e-7;
          const allowed=Math.max(LIMB_CONTACT_MARGIN,this.limbObstruction(leg,before.S,before.W,before.plane)+.00002);
          // Fold and solid-contact allowances are independent. A pre-existing
          // folded joint must not buy permission to move its knee through stone.
          const valid=(t:number)=>{const p=this.transferPose(leg,t);return p.distance>=minimum&&this.limbObstruction(leg,p.S,p.W,p.plane)<=allowed;};
          if(!valid(next)){
            let lo=previous,hi=next;
            for(let pass=0;pass<6;pass++){const mid=(lo+hi)/2;if(valid(mid))lo=mid;else hi=mid;}
            leg.swingT=lo;leg.avoiding=true;
            const ahead=this.transferPose(leg,next),now=this.transferPose(leg,lo);
            const prepared=this.clearLimbPlane(leg,ahead.S,ahead.W,ahead.plane)
              .applyQuaternion(new THREE.Quaternion().setFromUnitVectors(ahead.direction,now.direction));
            if(this.limbObstruction(leg,now.S,now.W,prepared)<=allowed){leg.bendDirection.copy(prepared);leg.wristDirection.copy(now.direction);}
          }
          leg.swingStall=leg.swingT-previous<dt/leg.swingDur*.1 ? leg.swingStall+dt : 0;
          if((leg.swingStall>.25||leg.swingElapsed>.65)&&!leg.returning){
            // Retrace the same clear arc to the old support. Starting a fresh
            // raised arc from mid-air made a blocked hind foot pump up and down.
            leg.failedStep=leg.to.clone();leg.failedUntil=this.time+(this.moving?3:12);
            const oldWrist=leg.from.clone().addScaledVector(leg.fromNormal,(.12+leg.wristAbove)*K);
            leg.returning=true;
            // Prefer a verified support below the current paw before retracing
            // a raised arc. The torso may already have descended far enough
            // that the old arc folds the knee against the ledge.
            this.settleBlockedFoot(leg);
            if(!leg.settling&&this.shoulder(leg).distanceTo(oldWrist)<leg.reach*.92){
              const from=leg.from.clone(),normal=leg.fromNormal.clone(),yaw=leg.fromYaw;
              leg.from.copy(leg.to);leg.to.copy(from);
              leg.fromNormal.copy(leg.toNormal);leg.toNormal.copy(normal);
              leg.fromYaw=leg.toYaw;leg.toYaw=yaw;
              leg.swingT=1-leg.swingT;
            }
            leg.swingStall=0;
          }
          // A verified lowering keeps its clock while it makes progress. The total
          // airborne age includes the rejected arc; using it here restarted a
          // healthy recovery every 300 ms and could keep the paw up forever.
          if(leg.returning&&leg.swingStall>.25&&this.time>=leg.nextPlanTime){
            this.settleBlockedFoot(leg);leg.nextPlanTime=this.time+.3;
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
              if(leg.supportArc)this.cacheTransferReach(leg);
            } else leg.swingT = .98;
            leg.lastPhase = ph; continue;
          }
          leg.swing = false;leg.supportArc=null; leg.planted.copy(leg.to); leg.plantedYaw = leg.toYaw;
          if(leg.returning){leg.nextPlanTime=this.time+(this.moving?1:12);leg.returning=false;}
          leg.normal.copy(leg.toNormal); leg.heel = 0;
          if(serial)this.nextTransferTime=this.time+.06;
          this.onFootDown?.(leg.planted, leg.front);
        }
      } else {
        this.homeWorld(leg, home);
        const footYaw=this.footYaw(leg);
        const drift = home.distanceTo(leg.planted), yawErr = Math.abs(wrapAngle(footYaw - leg.plantedYaw));
        const wrist = leg.planted.clone().addScaledVector(leg.normal, (.12 + leg.wristAbove) * K);
        const extension=this.shoulder(leg).distanceTo(wrist)/leg.reach;
        // Reposition before a limb reaches the hard support limit. Waiting
        // until it is nearly straight can leave no room to lift over an edge
        // or to reverse direction after backing into the hide.
        const folded=leg.front?(this.moving?.50:.40):(this.moving?.40:.31);
        const strained = extension > (this.climbing ? (this.moving ? .86 : .90) : .955) || extension<folded || yawErr > (this.climbing ? .32 : .65);
        if (!this.moving || this.climbing) leg.stepDue = false;
        else if (ph >= duty && leg.lastPhase < duty) leg.stepDue = true;
        // Attention to nearby prey is a deliberate supported hold. Starting
        // cosmetic resting steps here delayed a well-aimed pickup until the
        // cricket escaped. Required reach corrections still take priority.
        const settle = !I.tracking && !this.moving && (drift > .016 || yawErr > .35) && !this.legs.some(l => l.swing);
        const comfort=I.restAdjustment&&!this.moving&&this.time>=this.nextComfortStep&&drift>.006;
        const free = this.legs.filter(l => !l.swing).length;
        // A rejected transfer can need another support to shift before it
        // can land. Prefer its diagonal partner, but a different limb at its
        // reach/fold limit must also be allowed to adjust. Requiring that
        // limiting support to wait for recovery makes recovery impossible.
        // Only one extra paw can lift; two world-space anchors remain fixed.
        const recoveryPartner=this.legs.some(other=>other.swing&&other.returning&&(other.swingElapsed??0)>.8
          &&other!==leg&&(strained||other.front!==leg.front&&other.side!==leg.side));
        const supports=comfort?4:serial&&!recoveryPartner?4:3;
        if ((leg.stepDue || strained || settle || comfort || recoveryPartner || (this.blocked && this.moving && this.climbing) || this.stepSearch?.leg===leg) && free >= supports && (!serial||this.time>=this.nextTransferTime) && (this.stepSearch?.leg===leg || this.time >= leg.nextPlanTime)) {
          const swingDur = (1 - duty) / freq;
          const ahead = this.moving ? this.climbing ? Math.sign(I.speed || 1) * .022 : clamp(I.speed * (duty / freq * .5 + swingDur),-.07,.07) : 0;
          this.homeWorld(leg, home, ahead);
          if(I.lateralSpeed){
            const lead=clamp(I.lateralSpeed*(duty/freq*.5+swingDur),-.025,.025);
            home.x+=Math.sin(I.heading)*lead;home.z+=Math.cos(I.heading)*lead;
            home.y=this.footSupport(home.x,home.z).y;
          }
          const predicted = this.shoulder(leg);
          if(!this.climbing){
            // Size a level stride to this limb's actual lateral/vertical reach.
            // Asking for an unreachable lead forced a broad search every step,
            // then left the torso waiting while the planted limb straightened.
            const wrist=home.clone().addScaledVector(UP,(.12+leg.wristAbove)*K);
            const delta=wrist.sub(predicted),along=delta.dot(this.bodyFwd);
            const lateralSq=Math.max(0,delta.lengthSq()-along*along);
            const extent=Math.sqrt(Math.max(0,(leg.reach*.88)**2-lateralSq));
            home.addScaledVector(this.bodyFwd,clamp(along,-extent,extent)-along);
            home.y=this.footSupport(home.x,home.z).y;
          }
          // Walking beside a ledge is different from climbing toward it. Keep
          // the lateral feet on the sand when the trunk's route remains level.
          const floor=this.ground.heightAt(I.x,I.z),forward=this.ground.heightAt(I.x+Math.cos(I.heading)*.09,I.z-Math.sin(I.heading)*.09);
          const maximumHeight=floor<.12 && forward<floor+.025 ? floor+.012 : Infinity;
          const hold = this.planStep(leg,()=>{
            // A future shoulder is useful only if the rest of the stance can
            // support that torso shift. Checking an isolated translated hip
            // otherwise approves an arc that the other planted feet prevent.
            const forecast=[.25,.5,.75].map(phase=>this.supportedTransferShoulder(leg,clamp(I.speed,-.045,.045)*.32*phase));
            return this.footholds.search(home.clone(), predicted, leg.reach, I.heading, leg.side, leg.planted.clone(), leg.footprint,leg.plantedYaw,maximumHeight,footYaw,h=>{
            // Reject a negligible reposition inside the search, so a nearby
            // useful alternative can win. Rejecting only the winning result
            // repeatedly selected the old support and starved the other feet.
            if(h.point.distanceTo(leg.planted)<=(this.climbing?.009:.004)&&yawErr<=.2)return false;
            if(leg.failedStep&&this.time<leg.failedUntil&&h.point.distanceTo(leg.failedStep)<.016)return false;
            if(!this.collision||leg.bendDirection.lengthSq()<.5)return true;
            const W=h.point.clone().addScaledVector(h.normal,(.12+leg.wristAbove)*K),direction=W.clone().sub(predicted).normalize(),plane=leg.bendDirection.clone();
            // Leave room for the torso's supported shift during the transfer.
            // A forepaw tucked almost under its shoulder forces the elbow
            // through a folded singularity when backing into the hide.
            if(leg.front&&W.distanceTo(predicted)<leg.reach*.50)return false;
            if(leg.wristDirection.lengthSq()>.5)plane.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(leg.wristDirection,direction));
            plane.addScaledVector(direction,-plane.dot(direction)).normalize();
            this.boundLimbPlane(leg,direction,plane);
            // A clear sole is insufficient when the shin or elbow would be
            // buried at touchdown. Leave this support planted and try another
            // patch (or another leg) before beginning that impossible transfer.
            const clearance=this.moving?LIMB_CONTACT_MARGIN:.0015;
            if(this.limbObstruction(leg,predicted,W,plane,clearance)>=clearance)return false;
            // Check the lifted shin/elbow too, before giving up a sound support.
            // Endpoint-only planning started arcs that immediately hit a riser.
            const initial=this.transferPoseFor(leg,leg.planted,leg.normal,predicted);
            const allowed=Math.max(clearance,this.limbObstruction(leg,predicted,initial.W,initial.plane)+.0001);
            const elevated=this.ground.heightAt(I.x,I.z)>.12||this.legs.some(l=>l.planted.y>.12)||h.point.y>.12;
            const raised=transferTiming(leg.planted.y,h.point.y,h.top).raised;
            const completeArc=this.climbing?elevated:raised;
            if(completeArc&&this.legs.some(l=>l!==leg&&l.swing))return false;
            if(completeArc){
              // One continuously transported elbow/knee must clear the entire
              // transfer. Independent clear orientations at a few samples do
              // not establish a connected path for the actual limb.
              const preview={...leg,bendDirection:initial.plane.clone(),wristDirection:initial.direction.clone()};
              const duration=Math.max(swingDur,transferTiming(leg.planted.y,h.point.y,h.top).duration);
              for(let sample=1;sample<=16;sample++){
                const phase=sample/16,p=footTransfer(leg.planted,h.point,h.top,phase,leg.liftScale*K);
                const normal=leg.normal.clone().lerp(h.normal,smooth(phase)).normalize();
                const path=this.transferPoseFor(preview,p,normal,predicted);
                if(path.distance>=leg.reach*.98||path.distance<=leg.reach*.40)return false;
                const plane=this.clearLimbPlane(preview,predicted,path.W,path.plane,3*duration/16);
                if(this.limbObstruction(leg,predicted,path.W,plane,allowed)>allowed)return false;
                preview.bendDirection.copy(plane);preview.wristDirection.copy(path.direction);
              }
              return true;
            }
            for(const [index,phase] of [.25,.5,.75].entries()){
              const p=footTransfer(leg.planted,h.point,h.top,phase,leg.liftScale*K);
              const normal=leg.normal.clone().lerp(h.normal,smooth(phase)).normalize();
              // A supported torso advances during the transfer. Check both the
              // current shoulder and that small forecast weight shift; requiring
              // the frozen shoulder to clear the entire arc caused hesitation.
              const shifted=forecast[index];
              const feasible=(shifted?[predicted,shifted]:[predicted]).some(S=>{
                const path=this.transferPoseFor(leg,p,normal,S);
                if(path.distance>=leg.reach*.98||path.distance<=leg.reach*.40)return false;
                return [0,.3,-.3,.6,-.6].some(turn=>{
                  const plane=this.boundLimbPlane(leg,path.direction,path.plane.clone().applyAxisAngle(path.direction,turn));
                  return this.limbObstruction(leg,S,path.W,plane,allowed)<=allowed;
                });
              });
              if(!feasible)return false;
            }
            return true;
          },.025,.055,leg.liftScale*K);
          });
          if (hold && (hold.point.distanceTo(leg.planted) > (this.climbing ? .009 : .004) || yawErr > .2)) {
            const climbing = Math.abs(hold.point.y - leg.planted.y) > .008 || hold.top > Math.min(hold.point.y, leg.planted.y) + .008;
            if (!climbing || free >= 3) {
              // The phase oscillator requests a step; it never owns its progress.
              // A delayed lift starts at the planted sole, not partway along an
              // airborne arc. Skipping even 15% produced a visible foot pop.
              leg.swing = true; leg.swingT = 0; leg.stepDue = false;
              leg.swingStall=0;leg.swingElapsed=0;
              leg.returning=false;leg.settling=false;
              // Lift-off is rendered at phase zero for one physics tick. Include
              // that tick in the transfer duration so short running swings do
              // not steal another 6% of the stride from hind-foot support.
              leg.swingDur = climbing ? Math.max(transferTiming(leg.planted.y,hold.point.y,hold.top).duration, swingDur) : this.carefulTurn ? .24 : this.moving ? Math.max(.04,swingDur-dt) : .28;
              if(comfort)this.nextComfortStep=this.time+12;
              leg.from.copy(leg.planted); leg.to.copy(hold.point); leg.fromYaw = leg.plantedYaw;
              leg.fromNormal.copy(leg.normal);
              leg.toYaw = footYaw; leg.toNormal.copy(hold.normal); leg.stepTop = hold.top;
              // The serial gait also serves narrow floor-level passages.
              // Their dynamic walking strides need the ordinary shoulder
              // forecast; elevated climbs and raised ground strides reserve
              // their complete arc before lifting off.
              const elevated=this.ground.heightAt(I.x,I.z)>.12||this.legs.some(l=>l.planted.y>.12)||hold.point.y>.12;
              if(this.climbing?elevated:transferTiming(leg.from.y,leg.to.y,leg.stepTop).raised)this.cacheTransferReach(leg);else leg.supportArc=null;
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

  private planStep(leg:Leg,create:()=>Generator<void,Foothold|null,unknown>){
    const I=this.inputs;
    if(this.stepSearch&&(Math.hypot(I.x-this.stepSearch.x,I.z-this.stepSearch.z)>.015
      ||Math.abs(wrapAngle(I.heading-this.stepSearch.heading))>.15))this.stepSearch=null;
    if(this.stepSearch&&this.stepSearch.leg!==leg)return null;
    const job=this.stepSearch??={leg,search:create(),x:I.x,z:I.z,heading:I.heading};
    // Deterministic work cap: behavior is identical on fast and slow machines.
    while(this.stepWorkRemaining-->0){
      const result=job.search.next();
      if(!result.done)continue;
      this.stepSearch=null;leg.nextPlanTime=this.time+.12;
      const hold=result.value;if(!hold)return null;
      const S=this.shoulder(leg),p=this.transferPoseFor(leg,hold.point,hold.normal,S);
      if(p.distance>leg.reach*.94||p.distance<leg.reach*.30)return null;
      if(this.collision&&this.limbObstruction(leg,S,p.W,p.plane,.0015)>.0015)return null;
      return hold;
    }
    return null;
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

  private spineScale(k:number,out=new THREE.Vector3()){
    const I=this.inputs,breathe=Math.sin(this.time*Math.PI*2/2.6)*.5+.5,flank=1+.035*breathe*I.breath;
    const flat=k>=2?I.flatten*(k===5?.5:1):0;
    const sy=(k===2||k===3?1+(flank-1)*.6:1)*(1-.14*flat);
    const sz=(k===2||k===3||k===4?flank:1)*(1+.17*flat);
    return out.set(K,K*sy,K*sz);
  }

  private commit() {
    const I = this.inputs;
    const model = this.model;
    // spine
    for (let k = 0; k < 6; k++) {
      const bi = this.spineIdx[k];
      // basking: the ribs spread, so the trunk widens and flattens
      const scale=this.spineScale(k);
      this.setBone(bi, this.spinePos[k], this.spineFrame[k], scale.y/K, scale.z/K);
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
    const jawM = headM.clone().multiply(tmpM.makeTranslation(jb[0] - hb[0], jb[1] - hb[1], jb[2] - hb[2])).multiply(tmpM2.makeRotationZ(-this.jawOpen * 0.55));
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
    model.tongueOut = I.tongue;
    model.tongueReach = I.tongueReach;
    model.tongueTarget = I.tracking ? I.look : null;
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
    const foot=footTransfer(leg.from,leg.to,leg.stepTop,phase,leg.liftScale*K,leg.settling);
    // A turning paw sweeps a wider arc than either endpoint. Keep the complete
    // toe fan inside the glass throughout the transfer, not only at touchdown.
    const yaw=leg.fromYaw+wrapAngle(leg.toYaw-leg.fromYaw)*smooth(phase),c=Math.cos(yaw),s=Math.sin(yaw);
    let minX=0,maxX=0,minZ=0,maxZ=0;
    for(const p of leg.footprint){const x=c*p.x+s*p.z,z=-s*p.x+c*p.z;minX=Math.min(minX,x);maxX=Math.max(maxX,x);minZ=Math.min(minZ,z);maxZ=Math.max(maxZ,z);}
    foot.x=clamp(foot.x,-TANK.w/2+.014-minX,TANK.w/2-.014-maxX);
    foot.z=clamp(foot.z,-TANK.d/2+.014-minZ,TANK.d/2-.014-maxZ);
    return foot;
  }

  private cacheTransferReach(leg:Leg){
    leg.supportArc=Array.from({length:17},(_,i)=>{
      const phase=i/16,normal=leg.fromNormal.clone().lerp(leg.toNormal,smooth(phase)).normalize();
      return this.footPosition(leg,phase).addScaledVector(normal,(.12+leg.wristAbove)*K);
    });
  }

  private settleBlockedFoot(leg:Leg){
    const S=this.shoulder(leg);
    const normal=leg.fromNormal.clone().lerp(leg.toNormal,smooth(leg.swingT)).normalize();
    const yaw=leg.fromYaw+wrapAngle(leg.toYaw-leg.fromYaw)*smooth(leg.swingT);
    const initial=this.transferPose(leg,leg.swingT);
    // Start from the visible wrist after IK reach limits, not an unreachable
    // curve point underneath the hip. Otherwise every recovery is rejected
    // against a limb pose that the renderer never actually draws.
    const current=initial.W.clone().addScaledVector(normal,-(.12+leg.wristAbove)*K);
    const allowed=Math.max(LIMB_CONTACT_MARGIN,this.limbObstruction(leg,S,initial.W,initial.plane)+.00002);
    const hold=this.footholds.find(current,S,leg.reach,this.inputs.heading,leg.side,undefined,leg.footprint,yaw,current.y+.008,yaw,h=>{
      const landingDistance=S.distanceTo(h.point.clone().addScaledVector(h.normal,(.12+leg.wristAbove)*K));
      if(landingDistance>leg.reach*.92||landingDistance<leg.reach*(leg.front?.40:.30))return false;
      // The recovery puts the paw down; it must not create another raised arc.
      // Follow one continuous elbow/knee plane through the lowering. Finding
      // unrelated clear planes at four samples can approve a transfer whose
      // joint would have to cross the rock to get between those planes.
      const preview={...leg,bendDirection:initial.plane.clone(),wristDirection:initial.direction.clone()};
      for(let sample=1;sample<=16;sample++){
        const t=sample/16;
        const p=current.clone().lerp(h.point,t),n=normal.clone().lerp(h.normal,t).normalize();
        const transfer=this.transferPoseFor(preview,p,n,S),W=transfer.W,dir=transfer.direction;
        if(transfer.distance>leg.reach*.92||transfer.distance<this.minimumTransferReach(leg))return false;
        const plane=this.clearLimbPlane(preview,S,W,transfer.plane,.25/16*3);
        if(this.limbObstruction(leg,S,W,plane,allowed)>allowed)return false;
        preview.bendDirection.copy(plane);preview.wristDirection.copy(dir);
        if(this.collision){const q=p.clone().addScaledVector(n,.003),out=q.clone();this.collision.projectPoint(q,out,.002,new THREE.Vector3());if(q.distanceTo(out)>.001)return false;}
      }
      return true;
    });
    if(!hold)return;
    leg.from.copy(current);leg.to.copy(hold.point);leg.fromNormal.copy(normal);leg.toNormal.copy(hold.normal);
    leg.fromYaw=yaw;leg.toYaw=yaw;leg.swingT=0;leg.swingDur=.25;leg.swingStall=0;leg.settling=true;
    if(leg.supportArc)this.cacheTransferReach(leg);
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
    return this.transferPoseFor(leg,this.footPosition(leg,phase),normal,S);
  }

  private transferPoseFor(leg:Leg,foot:THREE.Vector3,normal:THREE.Vector3,S:THREE.Vector3){
    const W=foot.clone().addScaledVector(normal,(.12+leg.wristAbove)*K);
    const delta=W.clone().sub(S),a=leg.data.upperLength*K,b=leg.data.lowerLength*K;
    const distance=delta.length();
    if(distance>0)W.copy(S).addScaledVector(delta.divideScalar(distance),clamp(distance,Math.abs(a-b)+.0001,(a+b)*.999));
    const direction=W.clone().sub(S).normalize(),plane=leg.bendDirection.clone();
    if(leg.wristDirection.lengthSq()>.5)plane.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(leg.wristDirection,direction));
    plane.addScaledVector(direction,-plane.dot(direction)).normalize();
    this.boundLimbPlane(leg,direction,plane);
    return {S,W,direction,plane,distance};
  }

  private forearmReference(leg:Leg,direction:THREE.Vector3){
    // The elbow bends back. Using the nearly sideways bind upper arm as the
    // reference becomes singular when a wrist extends outward, causing a flip.
    const p=new THREE.Vector3(-1,-.15,0).transformDirection(this.spineFrame[2]);
    p.addScaledVector(direction,-p.dot(direction));
    // At a straight-arm singularity, retain the transported frame; a tiny
    // projected pole must not flip the forearm by half a revolution.
    const strength=p.length();
    return strength>.12?{axis:p.divideScalar(strength),strength}:null;
  }

  private boundLimbPlane(leg:Leg,direction:THREE.Vector3,plane:THREE.Vector3){
    if(!leg.front)return plane;
    const reference=this.forearmReference(leg,direction);
    if(!reference)return plane;
    const angle=Math.atan2(direction.dot(new THREE.Vector3().crossVectors(reference.axis,plane)),reference.axis.dot(plane));
    // The projected anatomical pole disappears when the wrist points along
    // the upper arm, then reappears on the opposite side. Enforcing its angle
    // instantly can flip an otherwise supported elbow through the rock.
    // Transport the existing plane through that singularity. Fade in the
    // angular bound as the projection becomes reliable, instead of switching
    // from no bound to a 160-degree range at a single threshold.
    const range=THREE.MathUtils.lerp(Math.PI,1.4,smooth(clamp((reference.strength-.12)/.28,0,1)));
    const correction=clamp(clamp(angle,-range,range)-angle,-8*this.poseDt,8*this.poseDt);
    return plane.applyAxisAngle(direction,correction);
  }

  private clearLimbPlane(leg: Leg, S: THREE.Vector3, W: THREE.Vector3, plane: THREE.Vector3,maximumTurn=3*this.poseDt) {
    const direction = W.clone().sub(S), dist = direction.length(); direction.normalize();
    const unbounded=plane.clone();
    this.boundLimbPlane(leg,direction,plane);
    if(!this.collision)return plane;
    if(plane.distanceToSquared(unbounded)>1e-12&&this.limbObstruction(leg,S,W,plane)>
      Math.max(LIMB_CONTACT_MARGIN,this.limbObstruction(leg,S,W,unbounded))+.00002)plane.copy(unbounded);
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
    if(score<.0005) return plane;
    for(const turn of [.2,-.2,.45,-.45,.75,-.75,1.05,-1.05,1.4,-1.4]) {
      const p=this.boundLimbPlane(leg,direction,plane.clone().applyAxisAngle(direction,turn)),E=knee(p),upper=E.clone().sub(S);
      if(upper.dot(this.bodyRight)*leg.side<.001 || (leg.front&&upper.dot(this.bodyUp)>.011))continue;
      const s=penetration(p,score-Math.abs(turn)*.0003)+Math.abs(turn)*.0003;
      if(s<score){score=s;best=p;angle=turn;}
    }
    // Contact can change the elbow plane, but cannot snap it around the wrist axis.
    if(angle){
      // The anatomical bound may change the tested candidate's angle. Move
      // toward that actual clear candidate, not its pre-bound search angle;
      // applying the bound again could turn the elbow into the obstacle.
      const actual=Math.atan2(direction.dot(new THREE.Vector3().crossVectors(plane,best)),plane.dot(best));
      const next=plane.clone().applyAxisAngle(direction,clamp(actual,-maximumTurn,maximumTurn));
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
    // The preferred forearm plane and its angular bound use the same
    // posterior reference. A separate sideways bind pole fights that bound
    // at wide stances, winding the elbow up between supported steps.
    const toPole = leg.front
      ? new THREE.Vector3(-1,-.15,0).transformDirection(g)
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
    const transported=perp.clone();
    const transportedDepth=this.collision?this.limbObstruction(leg,S,W,transported):0;
    // A committed transfer was checked with this transported bend plane.
    // Pulling it toward a cosmetic preferred pole again during flight can
    // rotate the elbow into the riser after the path has passed its checks.
    // Contact clearance may still rotate the plane continuously; the resting
    // preference resumes once the paw has a real support again.
    if (!leg.swing && !leg.avoiding && preferred.lengthSq() > 1e-10) {
      preferred.normalize();
      const angle = Math.atan2(dir.dot(new THREE.Vector3().crossVectors(perp, preferred)), perp.dot(preferred));
      const rate=leg.front?4*this.poseDt:Infinity;
      const proposed=perp.clone().applyAxisAngle(dir, clamp(angle * confidence * (1 - Math.exp(-14 * this.poseDt)),-rate,rate));
      if(!this.collision||this.limbObstruction(leg,S,W,proposed)<=Math.max(LIMB_CONTACT_MARGIN,transportedDepth)+1e-7)perp.copy(proposed);
    }
    perp.copy(this.clearLimbPlane(leg, S, W, perp));
    // A preferred resting elbow pose must not undo the support solver's
    // clearance. Keep the transported plane if that cosmetic rotation would
    // sink the forearm into sand/stone faster than contact can rotate it out.
    if(this.collision&&this.limbObstruction(leg,S,W,perp)>
      Math.max(LIMB_CONTACT_MARGIN,transportedDepth)+1e-7)perp.copy(transported);
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
