import {withWreckBatch} from './wreck-batch';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {Vehicle,type VehicleGround} from './vehicle';
import type {Effects} from './effects';
import {REPLAY_STRIDE,replayCarStride,replayBracket,replayCourseId,type ReplayDocument} from './replay-data';
export type ReplayProp={mesh:T.Mesh;body:R.RigidBody};
const axis=new T.Vector3(1,0,0),spin=new T.Quaternion(),base=new T.Quaternion(),q=new T.Quaternion();
export function captureReplayFrame(cars:readonly Vehicle[],props:readonly ReplayProp[],epochs:readonly number[],tyreModel?:1){
  const stride=replayCarStride({tyreModel}),data=new Float32Array(cars.length*stride+props.length*7);
  cars.forEach((c,i)=>{const o=i*stride;data.set(c.current.toArray(),o);data.set(c.currentQ.toArray(),o+3);data.set(c.velocity.toArray(),o+7);data.set([c.speed,c.rpm,c.gear,c.steering,c.health],o+10);
    c.wheels.forEach((w,j)=>{const a=c.controller.wheelRotation(j)??0,k=o+15+j*8;base.copy(w.quaternion).multiply(spin.setFromAxisAngle(axis,a));data.set(w.position.toArray(),k);data.set(base.toArray(),k+3);data[k+7]=a;});
    data.set(c.surfaceFinish.coating.value.toArray(),o+47);data[o+51]=c.wreckFinish.soot.value;data[o+52]=c.slip;data[o+53]=c.input.brake>.05||c.input.handbrake?1:0;data[o+54]=epochs[i]??0;data[o+55]=c.wreckParts.poseTime;
    if(tyreModel===1)c.tireContacts.forEach((contact,j)=>{const k=o+REPLAY_STRIDE+j*6;data.set(contact.plane.value.toArray(),k);data[k+4]=contact.load.value;data[k+5]=contact.active.value;});
  });
  props.forEach((p,i)=>{const o=cars.length*stride+i*7,at=p.body.translation(),rot=p.body.rotation();data.set([at.x,at.y,at.z,rot.x,rot.y,rot.z,rot.w],o);});return data;
}
/** Replay copies are never stepped by physics. The live vehicles are retained intact. */
export class ReplayScene {
  readonly cars:Vehicle[]=[];readonly props:T.Mesh[]=[];private eventIndex=0;private time=-1;private incomplete=false;private visibility=new Map<T.Object3D,boolean>();
  constructor(readonly doc:ReplayDocument,scene:T.Scene,world:R.World,sourceProps:readonly ReplayProp[],ground?:VehicleGround){
    replayCourseId(doc.meta);
    if(sourceProps.length!==doc.meta.props)throw Error('This replay requires the recorded course prop set.');
    for(const prop of sourceProps)if(!prop?.mesh)throw Error('This replay requires the recorded course prop set.');
    const silent={emit(){},mark(){},detach(){}} as unknown as Effects;
    try{
      for(const c of doc.meta.cars){const car=new Vehicle(c.id,c.kind,c.setup.paint,scene,world,silent,c.setup,ground);this.cars.push(car);car.tyreDamage=doc.meta.tyreModel===1?[0,0,0,0]:undefined;car.body.setEnabled(false);}
      for(const original of sourceProps){const mesh=original.mesh.clone();this.props.push(mesh);scene.add(mesh);}
    }catch(error){this.dispose();throw error;}
  }
  seek(time:number){this.seekChunk(time,Infinity);}
  /** One synchronous slice; no background work survives closing the studio.
   * Event deformation is indivisible, so a single contact may exceed the budget. */
  seekChunk(time:number,budgetMs=8):boolean{return withWreckBatch(()=>this.seekNow(time,budgetMs));}
  private show(ready:boolean){
    if(!ready){for(const o of [...this.cars.map(c=>c.root),...this.props])if(!this.visibility.has(o)){this.visibility.set(o,o.visible);o.visible=false;}}
    else{for(const [o,visible]of this.visibility)o.visible=visible;this.visibility.clear();}
  }
  private seekNow(time:number,budgetMs:number){
    const start=performance.now();
    // Contact eligibility uses ancestor visibility; restore it during work.
    this.show(true);
    // A new request may reverse partway through reconstruction, before time
    // has been committed to a completed frame.
    if(time<this.time||(this.incomplete&&this.eventIndex>0&&this.doc.events[this.eventIndex-1].time>time)){for(const c of this.cars){c.repair();c.tyreDamage=this.doc.meta.tyreModel===1?[0,0,0,0]:undefined;}this.eventIndex=0;this.time=-1;}
    while(this.eventIndex<this.doc.events.length&&this.doc.events[this.eventIndex].time<=time){
      const e=this.doc.events[this.eventIndex++],c=this.cars[e.car];
      c.current.fromArray(e.pose);c.currentQ.fromArray(e.pose,3).normalize();c.root.position.copy(c.current);c.root.quaternion.copy(c.currentQ);c.root.updateMatrixWorld(true);
      if(e.kind==='repair'){c.repair();c.tyreDamage=this.doc.meta.tyreModel===1?[0,0,0,0]:undefined;}
      if(e.kind==='hit'){c.health=e.health!;const point=new T.Vector3().fromArray(e.point!).applyQuaternion(c.currentQ).add(c.current),direction=new T.Vector3().fromArray(e.direction!).applyQuaternion(c.currentQ),paint=e.paint===undefined?undefined:new T.Color(e.paint);if(e.scar)c.scar(point,direction,paint);else c.hit(point,direction,e.damage!,e.time,true,paint);}
      if(performance.now()-start>=budgetMs&&this.eventIndex<this.doc.events.length&&this.doc.events[this.eventIndex].time<=time){this.incomplete=true;this.show(false);return false;}
    }
    const {a,b,alpha}=replayBracket(this.doc.frames,time),av=a.values,bv=b.values;
    const stride=replayCarStride(this.doc.meta);
    this.cars.forEach((c,i)=>{const o=i*stride,t=av[o+54]===bv[o+54]?alpha:0,mix=(k:number)=>av[o+k]+(bv[o+k]-av[o+k])*t;
      c.current.set(mix(0),mix(1),mix(2));c.currentQ.fromArray(av,o+3).slerp(q.fromArray(bv,o+3),t).normalize();c.root.position.copy(c.current);c.root.quaternion.copy(c.currentQ);c.previous.copy(c.current);c.previousQ.copy(c.currentQ);
      c.velocity.set(mix(7),mix(8),mix(9));c.speed=mix(10);c.rpm=mix(11);c.gear=av[o+12];c.steering=mix(13);c.health=av[o+14];c.slip=mix(52);
      c.forward.set(0,0,1).applyQuaternion(c.currentQ);c.right.set(1,0,0).applyQuaternion(c.currentQ);
      c.surfaceFinish.coating.value.set(mix(47),mix(48),mix(49),mix(50));c.wreckFinish.soot.value=mix(51);c.wreckParts.poseAt(mix(55),c.speed);
      c.wheels.forEach((w,j)=>{const k=15+j*8;w.position.set(mix(k),mix(k+1),mix(k+2));w.quaternion.fromArray(av,o+k+3).slerp(q.fromArray(bv,o+k+3),t).multiply(spin.setFromAxisAngle(axis,-mix(k+7)));});
      c.syncSuspension();
      c.syncTyres();
      if(this.doc.meta.tyreModel===1)c.tireContacts.forEach((contact,j)=>{
        const k=REPLAY_STRIDE+j*6,blend=av[o+k+5]===bv[o+k+5]?t:0;
        for(let axis=0;axis<4;axis++)contact.plane.value.setComponent(axis,av[o+k+axis]+(bv[o+k+axis]-av[o+k+axis])*blend);
        const normal=Math.hypot(contact.plane.value.x,contact.plane.value.y,contact.plane.value.z);
        if(normal>1e-8)contact.plane.value.multiplyScalar(1/normal);
        contact.load.value=mix(k+4);contact.active.value=av[o+k+5];contact.dirt.value=j%2?c.surfaceFinish.coating.value.w:c.surfaceFinish.coating.value.z;
      });
      for(const material of c.brakeLights)material.emissiveIntensity=av[o+53]?3.5:.8;
    });
    this.props.forEach((p,i)=>{const o=this.cars.length*stride+i*7;p.position.fromArray(av,o).lerp(new T.Vector3().fromArray(bv,o),alpha);p.quaternion.fromArray(av,o+3).slerp(q.fromArray(bv,o+3),alpha);});this.time=time;this.incomplete=false;this.show(true);return true;
  }
  dispose(){this.visibility.clear();this.cars.forEach(c=>c.dispose());this.props.forEach(p=>p.removeFromParent());}
}
