import {damageWheels} from './component-damage';
import * as T from 'three';
type Member={mesh:T.Mesh;matrix:T.Matrix4;position:T.Vector3;quaternion:T.Quaternion;scale:T.Vector3;auto:boolean;toModel:T.Matrix4;fromParent:T.Matrix4};
type Assembly={name:string;members:Member[];bounds:T.Box3;damage:number;side:number;loose:number};

/** Visual hinge failures around the authored bodywork. No extra rigid bodies. */
export class WreckAttachments {
  readonly assemblies:Assembly[]=[];
  readonly wheelDamage=new Float32Array(4);
  readonly wheelShift=Array.from({length:4},()=>new T.Vector3());
  readonly zones={front:0,rear:0,left:0,right:0,roof:0};
  private time=0;
  private wheelTravel=0;
  private wheelSpeed=0;
  private wheelRest:T.Vector3[];
  private wheelBase:T.Quaternion[];
  private wheelApplied:T.Quaternion[];
  private wheelRotation=new T.Quaternion();
  private wheelEuler=new T.Euler();
  constructor(root:T.Group,private wheels:T.Object3D[],private width:number){
    this.wheelRest=wheels.map(w=>w.position.clone());this.wheelBase=wheels.map(w=>w.quaternion.clone());this.wheelApplied=wheels.map(w=>w.quaternion.clone());
    root.updateWorldMatrix(true,true);const inverse=root.matrixWorld.clone().invert(),map=new Map<string,Assembly>();
    root.traverse(o=>{
      if(!(o instanceof T.Mesh)||!o.userData.wreckRest)return;
      const name=o.name.toLowerCase();
      const door=/bodydoor[lr]/.test(name)&&!name.includes('mirror');
      const bounds=new T.Box3().setFromBufferAttribute(o.userData.wreckRest);
      const group=door?(bounds.getCenter(new T.Vector3()).x<0?'door-left':'door-right'):o.userData.detachAssembly;
      if(!group||group.startsWith('mirror'))return;
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
      const threshold=a.name.startsWith('door')?18:a.name==='hood'?12:10;
      a.loose=T.MathUtils.clamp((a.damage-threshold)/38,0,1);
    }
    damageWheels(this.wheelDamage,this.wheelShift,this.wheelRest,point,direction,damage);
    this.pose(0,0);
  }
  get poseTime(){return this.time;}
  poseAt(time:number,speed:number){this.time=Math.max(0,time);this.pose(0,speed);}
  pose(dt:number,speed:number){
    this.time+=Math.max(0,dt);
    if(dt>0){this.wheelTravel+=speed*dt/.375;this.wheelSpeed=Math.abs(speed);}
    for(const a of this.assemblies){
      if(a.loose===0)continue;
      const flutter=Math.sin(this.time*7.1+a.side)*Math.min(.025,Math.abs(speed)*.0013)*a.loose;
      const pivot=a.bounds.getCenter(new T.Vector3()),euler=new T.Euler();
      if(a.name==='hood'){
        pivot.set(0,a.bounds.max.y-.04,a.bounds.min.z+.08);euler.x=-a.loose*.42+flutter;euler.z=a.side*a.loose*.045;
      }else if(a.name.startsWith('door')){
        const side=a.name==='door-left'?-1:1;
        pivot.set(side*this.width,a.bounds.min.y+.45,a.bounds.max.z-.06);euler.y=-side*a.loose*.075;euler.x=-a.loose*.025;
      }else{
        pivot.x=-a.side*this.width*.82;pivot.y=a.bounds.max.y-.07;
        euler.z=-a.side*a.loose*.3+flutter;euler.x=(a.name==='front-bumper'?-.18:.18)*a.loose;
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
  reset(){
    this.time=this.wheelTravel=this.wheelSpeed=0;this.wheelDamage.fill(0);this.wheelShift.forEach(v=>v.set(0,0,0));
    for(const key of Object.keys(this.zones)as (keyof typeof this.zones)[])this.zones[key]=0;
    for(const a of this.assemblies){a.damage=a.loose=0;for(const p of a.members){p.mesh.position.copy(p.position);p.mesh.quaternion.copy(p.quaternion);p.mesh.scale.copy(p.scale);p.mesh.matrix.copy(p.matrix);p.mesh.matrixAutoUpdate=p.auto;p.mesh.matrixWorldNeedsUpdate=true;}}
    this.wheels.forEach((w,i)=>{w.position.x=this.wheelRest[i].x;w.position.z=this.wheelRest[i].z;w.quaternion.copy(this.wheelBase[i]);this.wheelApplied[i].copy(w.quaternion);});
  }
}
