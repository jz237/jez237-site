import {damageWheels} from './component-damage';
import * as T from 'three';
import {doorBase,lidBase,LID} from './door-swing';
type Member={mesh:T.Mesh;matrix:T.Matrix4;position:T.Vector3;quaternion:T.Quaternion;scale:T.Vector3;auto:boolean;toModel:T.Matrix4;fromParent:T.Matrix4};
type Assembly={name:string;members:Member[];bounds:T.Box3;damage:number;side:number;loose:number;swing?:number;swingRate?:number;
  /** Extra drop (rad) of a bumper that came without its clips at its free end (offline; sagging-bumpers.ts). */
  sag?:number};

/** Extra bonnet lift (radians) from airflow: none below 14 m/s or for a barely loose bonnet. */
export function hoodWindLift(speed:number,loose:number){
  const s=T.MathUtils.smoothstep(Math.abs(speed),14,30),l=T.MathUtils.smoothstep(loose,.3,.9);
  return .55*s*l;
}
/** How far (0..1) a nearly torn-off bonnet has been flipped back over the windscreen by the airflow: from loose 0.8
 * and 20 m/s, fully folded (about 117°) by loose 0.95 at 28 m/s. Pure, so replays reproduce it from loose + speed. */
export function hoodFlip(speed:number,loose:number){return T.MathUtils.smoothstep(loose,.8,.95)*T.MathUtils.smoothstep(Math.abs(speed),20,28);}
export const HOOD_FOLD=-2.05;
/** Dangling mirrors: they start to hang at MIRROR_HANG.start damage and hang fully by start + span (they detach near 5.9). */
export const MIRROR_HANG={start:2.5,span:2.5,droop:1.15,flap:.22,sway:.08} as const;
/** How far (radians) a hanging mirror has dropped: droop with a flap that grows with speed. Pure in time and speed, so replays match. */
export function mirrorDroop(loose:number,time:number,speed:number,side:number){
  const l=T.MathUtils.clamp(Number.isFinite(loose)?loose:0,0,1),pace=Math.min(1,Math.abs(Number.isFinite(speed)?speed:0)/15),t=Number.isFinite(time)?time:0;
  return l*(MIRROR_HANG.droop+MIRROR_HANG.flap*pace*Math.sin(t*9.3+side*1.7)+MIRROR_HANG.sway*Math.sin(t*2.1+side));
}
/** Visual hinge failures around the authored bodywork. No extra rigid bodies. */
export class WreckAttachments {
  /** Offline cars (and replays of offline events) let a loose bonnet flip back over the screen. */
  flipHood=false;
  readonly assemblies:Assembly[]=[];
  readonly wheelDamage=new Float32Array(4);
  readonly wheelShift=Array.from({length:4},()=>new T.Vector3());
  /** 1 where the wheel has been torn off and the car runs on the bare hub. */
  readonly wheelLost=new Uint8Array(4);
  readonly zones={front:0,rear:0,left:0,right:0,roof:0};
  private time=0;
  private wheelTravel=0;
  private wheelSpeed=0;
  private wheelRest:T.Vector3[];
  private wheelHub:T.Vector3[];
  private wheelBase:T.Quaternion[];
  private wheelApplied:T.Quaternion[];
  private wheelRotation=new T.Quaternion();
  private wheelEuler=new T.Euler();
  constructor(root:T.Group,private wheels:T.Object3D[],private width:number,private wheelRadius=.375){
    this.wheelRest=wheels.map(w=>w.position.clone());
    root.updateMatrixWorld(true);this.wheelHub=wheels.map(w=>root.worldToLocal(w.getWorldPosition(new T.Vector3())));this.wheelBase=wheels.map(w=>w.quaternion.clone());this.wheelApplied=wheels.map(w=>w.quaternion.clone());
    root.updateWorldMatrix(true,true);const inverse=root.matrixWorld.clone().invert(),map=new Map<string,Assembly>();
    root.traverse(o=>{
      if(!(o instanceof T.Mesh)||!o.userData.wreckRest)return;
      const name=o.name.toLowerCase();
      const rearDoor=/bodydoorrear[lr]/.test(name);
      const door=(rearDoor||/bodydoor[lr]/.test(name))&&!name.includes('mirror');
      const bounds=new T.Box3().setFromBufferAttribute(o.userData.wreckRest);
      const cargo=/^panel_cargodoorvan[lr]/.test(name);
      const group=/^panel_enginelidmarten/.test(name)?'engine-lid':/^panel_(?:bodytrunk|boot|trunkmorrow)/.test(name)?'boot':cargo?('cargo-'+(name.includes('cargodoorvanl')?'left':'right')):door?`door-${rearDoor?'rear-':''}${bounds.getCenter(new T.Vector3()).x<0?'left':'right'}`:/^(?:panel_tailgate(?:estate|rearwindow|tern|trail|kite|alder|saber|ravenhill|fernleigh|cornet)|glass_tailgate(?:rear$|tern|trail|kite|alder|saber|ravenhill|fernleigh|cornet))/.test(name)?'tailgate':/^panel_servinghatchcornet/.test(name)?'hatch':o.userData.detachAssembly?.startsWith('wing-')?null:o.userData.detachAssembly;
      if(!group)return;
      let a=map.get(group);if(!a){a={name:group,members:[],bounds:new T.Box3(),damage:0,side:1,loose:0};map.set(group,a);}
      a.bounds.union(bounds);
      const parentToModel=new T.Matrix4().multiplyMatrices(inverse,o.parent!.matrixWorld);
      a.members.push({mesh:o,matrix:o.matrix.clone(),position:o.position.clone(),quaternion:o.quaternion.clone(),scale:o.scale.clone(),auto:o.matrixAutoUpdate,toModel:new T.Matrix4().multiplyMatrices(inverse,o.matrixWorld),fromParent:parentToModel.invert()});
    });
    this.assemblies.push(...map.values());
  }
  hit(point:T.Vector3,direction:T.Vector3,damage:number){
    const zone=direction.y<-.45&&point.y>1.15?'roof':Math.abs(direction.x)>.6?(point.x<0?'left':'right'):(point.z>=0?'front':'rear');
    this.zones[zone]+=damage;
    for(const a of this.assemblies){
      const d=a.bounds.distanceToPoint(point);if(d>1.1)continue;
      a.damage+=damage*Math.pow(1-d/1.1,1.3);a.side=point.x<0?-1:1;
      // A knocked mirror hangs off on its wire long before it tears away.
      const mirror=a.name.startsWith('mirror'),threshold=mirror?MIRROR_HANG.start:a.name.startsWith('door')?18:a.name==='hood'?12:10;
      a.loose=T.MathUtils.clamp((a.damage-threshold)/(mirror?MIRROR_HANG.span:38),0,1);
    }
    damageWheels(this.wheelDamage,this.wheelShift,this.wheelRest,point,direction,damage);
    this.pose(0,0);
  }
  get poseTime(){return this.time;}
  poseAt(time:number,speed:number){this.time=Math.max(0,time);this.pose(0,speed);}
  pose(dt:number,speed:number){
    this.time+=Math.max(0,dt);
    if(dt>0){this.wheelTravel+=speed*dt/this.wheelRadius;this.wheelSpeed=Math.abs(speed);}
    for(const a of this.assemblies){
      if(a.loose===0)continue;
      const flutter=Math.sin(this.time*7.1+a.side)*Math.min(.025,Math.abs(speed)*.0013)*a.loose;
      const pivot=a.bounds.getCenter(new T.Vector3()),euler=new T.Euler();
      if(a.name==='hood'){
        // At speed the airflow gets under a loose bonnet and lifts it, shaking, toward the screen.
        const lift=hoodWindLift(speed,a.loose);
        pivot.set(0,a.bounds.max.y-.04,a.bounds.min.z+.08);euler.x=-a.loose*.42-lift+flutter*(1+lift*4);euler.z=a.side*a.loose*.045;
        // Nearly torn off at speed it folds right back against the windscreen (blinding a driver in the cab view).
        if(this.flipHood){const flip=hoodFlip(speed,a.loose);if(flip>0)euler.x+=(HOOD_FOLD-euler.x)*flip;}
      }else if(a.name.startsWith('cargo-')){
        const side=a.name.endsWith('left')?-1:1;
        pivot.set(side<0?a.bounds.min.x:a.bounds.max.x,pivot.y,a.bounds.max.z);euler.y=-side*((a.swing??0)>0?lidBase('cargo',a.loose)+a.swing!:a.loose*.45)+flutter;
      }else if(a.name==='engine-lid'){
        pivot.set(0,a.bounds.max.y-.02,a.bounds.max.z-.03);euler.x=a.loose*.48+flutter;
      }else if(a.name==='tailgate'){
        pivot.set(0,a.bounds.max.y-.025,a.bounds.max.z-.025);euler.x=((a.swing??0)>0?lidBase('tailgate',a.loose)+a.swing!:a.loose*.38)+flutter;euler.z=a.side*a.loose*.018;
      }else if(a.name==='boot'){
        // Hinged along its front edge, under the rear window: it lifts at the back.
        pivot.set(0,a.bounds.max.y-.01,a.bounds.max.z-.02);euler.x=((a.swing??0)>0?lidBase('boot',a.loose)+a.swing!:a.loose*LID.boot.ajar)+flutter;euler.z=a.side*a.loose*.02;
      }else if(a.name==='drop-tailgate'){
        pivot.set(0,a.bounds.min.y+.01,a.bounds.min.z+.02);euler.x=-((a.swing??0)>0?lidBase('drop',a.loose)+a.swing!:a.loose*1.05)+flutter;
      }else if(a.name==='hatch'){
        const side=pivot.x<0?-1:1;
        pivot.set(side<0?a.bounds.max.x:a.bounds.min.x,a.bounds.max.y-.01,pivot.z);euler.z=-side*a.loose*.55+flutter;
      }else if(a.name.startsWith('mirror')){
        // Hanging off the door by its wire: it swings down about its inner bottom edge (staying outside the skin), flapping harder the faster the car goes.
        const side=a.name.endsWith('left')?-1:1;pivot.set(side<0?a.bounds.max.x:a.bounds.min.x,a.bounds.min.y,pivot.z);
        euler.z=-side*mirrorDroop(a.loose,this.time,speed,side);euler.y=side*a.loose*.25*Math.min(1,Math.abs(speed)/20);
      }else if(a.name.startsWith('door')){
        const side=a.name.endsWith('left')?-1:1;
        pivot.set(side*this.width,a.bounds.min.y+.45,a.bounds.max.z-.06);euler.y=-side*((a.swing??0)>0?doorBase(a.loose)+a.swing!:a.loose*.075);euler.x=-a.loose*.025;
      }else{
        pivot.x=-a.side*this.width*.82;pivot.y=a.bounds.max.y-.07;
        euler.z=-a.side*(a.loose*.3+(a.sag??0))+flutter;euler.x=(a.name==='front-bumper'?-.18:.18)*a.loose;
      }
      const hinge=new T.Matrix4().makeTranslation(pivot.x,pivot.y,pivot.z)
        .multiply(new T.Matrix4().makeRotationFromEuler(euler)).multiply(new T.Matrix4().makeTranslation(-pivot.x,-pivot.y,-pivot.z));
      for(const p of a.members){if(!p.mesh.visible)continue;p.mesh.matrixAutoUpdate=false;p.mesh.matrix.copy(p.fromParent).multiply(hinge).multiply(p.toModel);p.mesh.matrixWorldNeedsUpdate=true;}
    }
  }
  wheelsPose(){
    for(let i=0;i<4;i++){
      const w=this.wheels[i],d=this.wheelDamage[i],side=i%2?1:-1;
      w.position.x=this.wheelRest[i].x+this.wheelShift[i].x;w.position.z=this.wheelRest[i].z+this.wheelShift[i].z;
      if(!w.quaternion.equals(this.wheelApplied[i]))this.wheelBase[i].copy(w.quaternion);
      const wobble=Math.sin(this.wheelTravel+side+i*1.7)*d*d*.022*Math.min(1,this.wheelSpeed/2);
      w.quaternion.copy(this.wheelBase[i]).premultiply(this.wheelRotation.setFromEuler(this.wheelEuler.set(0,wobble,-side*d*.22)));
      this.wheelApplied[i].copy(w.quaternion);
    }
  }
  inspectionOffset(rotation=new T.Quaternion()){
    const zone=(Object.entries(this.zones).sort((a,b)=>b[1]-a[1])[0]?.[0]??'front');
    const offset=zone==='left'?new T.Vector3(-5.4,2,2.1):zone==='right'?new T.Vector3(5.4,2,2.1):zone==='rear'?new T.Vector3(-3.6,2,-5.1):zone==='roof'?new T.Vector3(-4,3.8,3.7):new T.Vector3(-3.9,2,4.8);
    const height=offset.y;offset.applyQuaternion(rotation);offset.y=height;
    if(Math.hypot(offset.x,offset.z)<3){offset.x=-4.2;offset.z=4.2;}
    return offset;
  }
  /** Distance from a model-space point to a wheel's authored hub, vertical offsets weighted like
   * wheel damage (independent of suspension travel, so replays judge it identically). */
  wheelReach(i:number,point:T.Vector3){const h=this.wheelHub[i];return Math.hypot(point.x-h.x,(point.y-h.y)*.6,point.z-h.z);}
  reset(){
    this.time=this.wheelTravel=this.wheelSpeed=0;this.wheelDamage.fill(0);this.wheelShift.forEach(v=>v.set(0,0,0));
    for(const key of Object.keys(this.zones)as (keyof typeof this.zones)[])this.zones[key]=0;
    for(const a of this.assemblies){a.damage=a.loose=0;a.swing=a.swingRate=0;a.sag=0;for(const p of a.members){p.mesh.position.copy(p.position);p.mesh.quaternion.copy(p.quaternion);p.mesh.scale.copy(p.scale);p.mesh.matrix.copy(p.matrix);p.mesh.matrixAutoUpdate=p.auto;p.mesh.matrixWorldNeedsUpdate=true;}}
    this.wheels.forEach((w,i)=>{if(this.wheelLost[i])w.visible=true;w.position.x=this.wheelRest[i].x;w.position.z=this.wheelRest[i].z;w.quaternion.copy(this.wheelBase[i]);this.wheelApplied[i].copy(w.quaternion);});
    this.wheelLost.fill(0);
  }
}
