import * as T from 'three';
/** Windscreen wipers (offline, cosmetic). In rain the arms sweep up from their parked line and back, one stroke every
 * WIPERS.period seconds, across WIPERS.sweep radians in the plane of the glass; when it is dry they finish the stroke and
 * park. They run off the battery: a wrecked car or cut electrics stop them wherever they are. A front hit past
 * WIPERS.bend (rear for a tailgate wiper, WIPERS.step later for each further arm) bends an arm up off the glass by up to
 * WIPERS.lift radians, and a bent arm is jammed where it was. Arms are the separate wiper meshes (bars along their
 * longest axis) pivoting at their lower end; cars whose wipers are one fused mesh keep them still. */
export const WIPERS={period:1.4,sweep:1.1,bend:.42,step:.14,lift:.9} as const;
/** How hard it rains sets the wiper speed: below WIPE_RATE.intermittent they make a stroke and rest parked WIPE_RATE.pause
 * s (longer the lighter the shower); above WIPE_RATE.fast they run WIPE_RATE.fastSpeed times as fast. */
export const WIPE_RATE={intermittent:.5,pause:2.4,fast:.8,fastSpeed:1.6} as const;
/** Stroke speed (times the normal rate) and the rest after each stroke (s) for a shower of this strength (0–1). */
export function wipeRate(level:number){const l=Number.isFinite(level)?Math.max(0,Math.min(1,level)):1;
  return {speed:l>WIPE_RATE.fast?WIPE_RATE.fastSpeed:1,pause:l<WIPE_RATE.intermittent?WIPE_RATE.pause*(1.5-l/WIPE_RATE.intermittent):0};}
export const WIPER_NAME=/^panel_.*Wiper/i;
const unit=(n:number)=>{const s=Math.sin(n*12.9898)*43758.5453;return s-Math.floor(s);};
const X=new T.Vector3(1,0,0),q=new T.Quaternion(),bendQ=new T.Quaternion(),v=new T.Vector3(),lean=new T.Vector3();
export type WiperArm={mesh:T.Mesh;parent:T.Object3D|null;position:T.Vector3;rest:T.Quaternion;pivot:T.Vector3;axis:T.Vector3;lean:T.Vector3;sign:number;tilt:number;rear:boolean;angle:number;bent:number};
/** The arm's angle from parked at stroke phase p (cycles): up and back once per cycle, easing at both ends. */
export const strokeAngle=(p:number)=>Number.isFinite(p)?WIPERS.sweep*(1-Math.cos(2*Math.PI*p))/2:0;
/** The wiper arms under model, in their parents' space: pivot at the lower end, swept about the glass normal. */
export function wiperArms(model:T.Object3D):WiperArm[]{
  const arms:WiperArm[]=[];
  model.traverse(o=>{
    if(!(o instanceof T.Mesh)||!WIPER_NAME.test(o.name))return;
    const g=o.geometry as T.BufferGeometry;if(!g.boundingBox)g.computeBoundingBox();const b=g.boundingBox!,size=b.getSize(new T.Vector3()),centre=b.getCenter(new T.Vector3());
    const k=size.x>=size.y&&size.x>=size.z?'x':size.y>=size.z?'y':'z',half=new T.Vector3();half[k]=size[k]/2;
    const local=new T.Matrix4().compose(o.position,o.quaternion,o.scale),a=centre.clone().sub(half).applyMatrix4(local),c=centre.clone().add(half).applyMatrix4(local);
    const pivot=a.y<=c.y?a:c,tip=a.y<=c.y?c:a,d=tip.clone().sub(pivot);if(d.lengthSq()<1e-8)return;
    // The glass contains the arm and (near enough) the car's width, so its normal is across both; point it up off the glass.
    const axis=new T.Vector3().crossVectors(X,d);if(axis.lengthSq()<1e-8)return;axis.normalize();if(axis.y<0)axis.negate();
    const sign=v.copy(d).applyAxisAngle(axis,.1).y>d.y?1:-1,side=new T.Vector3().crossVectors(axis,d).normalize();
    // Bending lifts the tip off the glass, along the normal.
    const tilt=v.copy(d).applyAxisAngle(side,.1).dot(axis)>0?1:-1;
    arms.push({mesh:o,parent:o.parent,position:o.position.clone(),rest:o.quaternion.clone(),pivot,axis,lean:side,sign,tilt,rear:pivot.z<0,angle:0,bent:0});
  });
  return arms;
}
export class WiperRig{
  /** Stroke phase in cycles (whole numbers are parked). */
  phase=0;
  /** The wipers moved on the last update: powered, with an arm still working, raining or finishing a stroke. */
  moving=false;
  /** Seconds left resting parked between intermittent strokes. */
  rest=0;
  constructor(readonly arms:WiperArm[],private readonly seed=0){}
  get sweeping(){return this.arms.some(a=>!a.bent&&a.angle>1e-4);}
  get bentArms(){return this.arms.filter(a=>a.bent>0).length;}
  /** Advance dt: raining, powered (battery and wiring alive), front and rear structural damage 0–1. */
  update(dt:number,raining:boolean,powered:boolean,front:number,rear:number,level?:number){
    if(!(dt>0)||!this.arms.length){this.moving=false;return;}
    let changed=false;
    this.arms.forEach((arm,i)=>{
      if(arm.bent)return;const hit=arm.rear?rear:front;
      if(Number.isFinite(hit)&&hit>=WIPERS.bend+i*WIPERS.step){arm.bent=WIPERS.lift*(.55+.45*unit(this.seed+i));changed=true;}
    });
    const rate=level===undefined?{speed:1,pause:0}:wipeRate(level);
    this.moving=powered&&(raining&&this.rest<=0||this.phase%1>0)&&this.arms.some(a=>!a.bent);
    if(powered){
      const was=this.phase;
      // In a light shower they rest parked between strokes; in a downpour they run fast.
      if(raining&&this.rest>0)this.rest-=dt;
      else if(raining){const stroke=Math.floor(this.phase);this.phase+=dt/WIPERS.period*rate.speed;if(rate.pause>0&&Math.floor(this.phase)>stroke){this.phase=stroke+1;this.rest=rate.pause;}}
      else if(this.phase%1>0)this.phase=Math.min(Math.floor(this.phase)+1,this.phase+dt/WIPERS.period);
      if(this.phase!==was)changed=true;
    }
    if(!changed)return;
    const angle=strokeAngle(this.phase);
    for(const arm of this.arms){
      // An arm torn off with its panel is no longer ours to move.
      if(arm.mesh.parent!==arm.parent)continue;
      if(!arm.bent)arm.angle=angle;
      q.setFromAxisAngle(arm.axis,arm.sign*arm.angle);
      if(arm.bent){lean.copy(arm.lean).applyQuaternion(q);bendQ.setFromAxisAngle(lean,arm.tilt*arm.bent);q.premultiply(bendQ);}
      arm.mesh.quaternion.copy(q).multiply(arm.rest);
      arm.mesh.position.copy(arm.position).sub(arm.pivot).applyQuaternion(q).add(arm.pivot);
    }
  }
}
/** A windscreen's wiped state, 0 beaded with rain to 1 clear (GlassState.wiped): working wipers clear it at WIPED.clear a
 * second; once they stop, the rain beads it over again at WIPED.fill a second. */
export const WIPED={clear:2,fill:.1} as const;
export const wipeStep=(wiped:number,sweeping:boolean,dt:number)=>{const w=Number.isFinite(wiped)?wiped:0;return dt>0?w+((sweeping?1:0)-w)*Math.min(1,dt*(sweeping?WIPED.clear:WIPED.fill)):w;};
/** The windscreen among a car's glass: the most forward pane across the middle of the car (in the root's space). */
export function windscreen(glass:readonly T.Mesh[],root:T.Object3D){
  root.updateMatrixWorld(true);const inverse=root.matrixWorld.clone().invert(),box=new T.Box3(),c=new T.Vector3();let best:T.Mesh|undefined,z=0;
  for(const g of glass){box.setFromObject(g).getCenter(c).applyMatrix4(inverse);if(Math.abs(c.x)<.35&&c.z>z){z=c.z;best=g;}}
  return best;
}
