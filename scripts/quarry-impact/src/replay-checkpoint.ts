import * as T from 'three';
import type {Vehicle} from './vehicle';
import type {GlassState} from './car-materials';

const attributes=['position','normal','impactWear','impactAxis','transferPaint'] as const;
const scalars=['health','engineDamage','engineStall','damageLeft','damageRight','lastHit','lastDamage','impactSerial','scraping'] as const;

/** Session-only reconstruction cache. Never serialized into a recording or save.
 * Check the complete allocation before copying any vehicle buffers. */
export function replayCheckpointBytes(cars:readonly Vehicle[]){
 let bytes=0;
 for(const car of cars){
  car.model.traverse(()=>bytes+=1024);
  for(const mesh of [...car.panels,...car.glass])for(const name of attributes)bytes+=mesh.geometry.getAttribute(name)?.array.byteLength??0;
 }
 return bytes;
}
export function captureReplayCheckpoint(cars:readonly Vehicle[],limit:number){
 const bytes=replayCheckpointBytes(cars);
 if(bytes>limit)return;
 const states=cars.map(car=>{
  const nodes:{node:T.Object3D;visible:boolean;position:T.Vector3;quaternion:T.Quaternion;scale:T.Vector3;matrix:T.Matrix4;auto:boolean}[]=[];
  car.model.traverse(node=>nodes.push({node,visible:node.visible,position:node.position.clone(),quaternion:node.quaternion.clone(),scale:node.scale.clone(),matrix:node.matrix.clone(),auto:node.matrixAutoUpdate}));
  const meshes=[...car.panels,...car.glass].map(mesh=>{
   const glass=(mesh.material as T.Material).userData.glassState as GlassState|undefined;
   return {mesh,damage:mesh.userData.damage,shift:(mesh.userData.engineShift as T.Vector3|undefined)?.clone(),
    buffers:attributes.flatMap(name=>{const a=mesh.geometry.getAttribute(name);return a?[{name,array:a.array.slice()}]:[];}),
    box:mesh.geometry.boundingBox?.clone(),sphere:mesh.geometry.boundingSphere?.clone(),
    opacity:(mesh.material as T.Material).opacity,glass:glass?{damage:glass.damage.value,impact:glass.impact.value.clone()}:undefined};
  });
  return {car,nodes,meshes,values:scalars.map(key=>car[key]),structure:car.structuralDamage?.slice(),tyres:car.tyreDamage?.slice(),
   zones:{...car.damageZones},partZones:{...car.wreckParts.zones},wheelDamage:car.wreckParts.wheelDamage.slice(),wheelShift:car.wreckParts.wheelShift.map(v=>v.clone()),
   assemblies:car.wreckParts.assemblies.map(a=>({damage:a.damage,side:a.side,loose:a.loose})),poseTime:car.wreckParts.poseTime};
 });
 return {bytes,restore(){
  for(const s of states){
   const c=s.car;c.repair();
   scalars.forEach((key,i)=>{(c as any)[key]=s.values[i];});
   c.structuralDamage=s.structure?.slice();c.structure.update(c.structuralDamage,c.health);c.tyreDamage=s.tyres?.slice();
   Object.assign(c.damageZones,s.zones);Object.assign(c.wreckParts.zones,s.partZones);
   c.wreckParts.wheelDamage.set(s.wheelDamage);c.wreckParts.wheelShift.forEach((v,i)=>v.copy(s.wheelShift[i]));
   c.wreckParts.assemblies.forEach((a,i)=>Object.assign(a,s.assemblies[i]));c.wreckParts.poseAt(s.poseTime,c.speed);
   for(const n of s.nodes){n.node.visible=n.visible;n.node.position.copy(n.position);n.node.quaternion.copy(n.quaternion);n.node.scale.copy(n.scale);n.node.matrix.copy(n.matrix);n.node.matrixAutoUpdate=n.auto;n.node.matrixWorldNeedsUpdate=true;}
   for(const m of s.meshes){
    m.mesh.userData.damage=m.damage;if(m.shift)m.mesh.userData.engineShift=m.shift.clone();else delete m.mesh.userData.engineShift;
    for(const b of m.buffers){const a=m.mesh.geometry.getAttribute(b.name) as T.BufferAttribute;a.array.set(b.array);a.needsUpdate=true;}
    m.mesh.geometry.boundingBox=m.box?.clone()??null;m.mesh.geometry.boundingSphere=m.sphere?.clone()??null;
    (m.mesh.material as T.Material).opacity=m.opacity;
    const glass=(m.mesh.material as T.Material).userData.glassState as GlassState|undefined;
    if(glass&&m.glass){glass.damage.value=m.glass.damage;glass.impact.value.copy(m.glass.impact);}
   }
  }
 }};
}

export class ReplayCheckpointCache {
 private entries:{time:number;eventIndex:number;state:NonNullable<ReturnType<typeof captureReplayCheckpoint>>}[]=[];
 readonly limit:number;
 constructor(limit=128*1024*1024){this.limit=Math.max(0,limit);}
 get bytes(){return this.entries.reduce((n,e)=>n+e.state.bytes,0);}
 get size(){return this.entries.length;}
 save(cars:readonly Vehicle[],time:number,eventIndex:number){
  if(eventIndex<32||this.entries.some(e=>e.eventIndex===eventIndex||Math.abs(e.time-time)<5&&Math.abs(e.eventIndex-eventIndex)<256))return;
  const bytes=replayCheckpointBytes(cars);if(bytes>this.limit)return;
  // Evict before allocation so cache buffers never temporarily double the cap.
  while(this.entries.length&&(this.entries.length>=3||this.bytes+bytes>this.limit)){
   const cheapest=this.entries.reduce((a,b)=>a.eventIndex<b.eventIndex?a:b);
   if(cheapest.eventIndex>eventIndex)return;
   this.entries.splice(this.entries.indexOf(cheapest),1);
  }
  const state=captureReplayCheckpoint(cars,this.limit);if(!state)return;
  this.entries.push({time,eventIndex,state});
 }
 restore(time:number,after:number){
  const entry=this.entries.filter(e=>e.time<=time&&e.eventIndex>after).sort((a,b)=>b.eventIndex-a.eventIndex)[0];
  if(!entry)return;
  entry.state.restore();
  this.entries.splice(this.entries.indexOf(entry),1);this.entries.push(entry);
  return entry.eventIndex;
 }
 clear(){this.entries=[];}
}
