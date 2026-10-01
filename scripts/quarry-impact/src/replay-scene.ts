import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {Vehicle} from './vehicle';
import type {Effects} from './effects';
import {REPLAY_STRIDE,replayBracket,type ReplayDocument} from './replay-data';
export type ReplayProp={mesh:T.Mesh;body:R.RigidBody};
const axis=new T.Vector3(1,0,0),spin=new T.Quaternion(),base=new T.Quaternion(),q=new T.Quaternion();
export function captureReplayFrame(cars:readonly Vehicle[],props:readonly ReplayProp[],epochs:readonly number[]){
  const data=new Float32Array(cars.length*REPLAY_STRIDE+props.length*7);
  cars.forEach((c,i)=>{const o=i*REPLAY_STRIDE;data.set(c.current.toArray(),o);data.set(c.currentQ.toArray(),o+3);data.set(c.velocity.toArray(),o+7);data.set([c.speed,c.rpm,c.gear,c.steering,c.health],o+10);
    c.wheels.forEach((w,j)=>{const a=c.controller.wheelRotation(j)??0,k=o+15+j*8;base.copy(w.quaternion).multiply(spin.setFromAxisAngle(axis,a));data.set(w.position.toArray(),k);data.set(base.toArray(),k+3);data[k+7]=a;});
    data.set(c.surfaceFinish.coating.value.toArray(),o+47);data[o+51]=c.wreckFinish.soot.value;data[o+52]=c.slip;data[o+53]=c.input.brake>.05||c.input.handbrake?1:0;data[o+54]=epochs[i]??0;data[o+55]=c.wreckParts.poseTime;
  });
  props.forEach((p,i)=>{const o=cars.length*REPLAY_STRIDE+i*7,at=p.body.translation(),rot=p.body.rotation();data.set([at.x,at.y,at.z,rot.x,rot.y,rot.z,rot.w],o);});return data;
}
/** Replay copies are never stepped by physics. The live vehicles are retained intact. */
export class ReplayScene {
  readonly cars:Vehicle[]=[];readonly props:T.Mesh[]=[];private eventIndex=0;private time=-1;
  constructor(readonly doc:ReplayDocument,scene:T.Scene,world:R.World,sourceProps:readonly ReplayProp[]){
    const silent={emit(){},mark(){},detach(){}} as unknown as Effects;
    for(const c of doc.meta.cars){const car=new Vehicle(c.id,c.kind,c.setup.paint,scene,world,silent,c.setup);car.body.setEnabled(false);this.cars.push(car);}
    for(let i=0;i<doc.meta.props;i++){const original=sourceProps[i]?.mesh;if(!original)continue;const mesh=original.clone();scene.add(mesh);this.props.push(mesh);}
  }
  seek(time:number){
    if(time<this.time){for(const c of this.cars)c.repair();this.eventIndex=0;}
    while(this.eventIndex<this.doc.events.length&&this.doc.events[this.eventIndex].time<=time){
      const e=this.doc.events[this.eventIndex++],c=this.cars[e.car];
      c.current.fromArray(e.pose);c.currentQ.fromArray(e.pose,3).normalize();c.root.position.copy(c.current);c.root.quaternion.copy(c.currentQ);c.root.updateMatrixWorld(true);
      if(e.kind==='repair')c.repair();
      if(e.kind==='hit'){c.health=e.health!;c.hit(new T.Vector3().fromArray(e.point!).applyQuaternion(c.currentQ).add(c.current),new T.Vector3().fromArray(e.direction!).applyQuaternion(c.currentQ),e.damage!,e.time,true,e.paint===undefined?undefined:new T.Color(e.paint));}
    }
    const {a,b,alpha}=replayBracket(this.doc.frames,time),av=a.values,bv=b.values;
    this.cars.forEach((c,i)=>{const o=i*REPLAY_STRIDE,t=av[o+54]===bv[o+54]?alpha:0,mix=(k:number)=>av[o+k]+(bv[o+k]-av[o+k])*t;
      c.current.set(mix(0),mix(1),mix(2));c.currentQ.fromArray(av,o+3).slerp(q.fromArray(bv,o+3),t).normalize();c.root.position.copy(c.current);c.root.quaternion.copy(c.currentQ);c.previous.copy(c.current);c.previousQ.copy(c.currentQ);
      c.velocity.set(mix(7),mix(8),mix(9));c.speed=mix(10);c.rpm=mix(11);c.gear=av[o+12];c.steering=mix(13);c.health=av[o+14];c.slip=mix(52);
      c.forward.set(0,0,1).applyQuaternion(c.currentQ);c.right.set(1,0,0).applyQuaternion(c.currentQ);
      c.surfaceFinish.coating.value.set(mix(47),mix(48),mix(49),mix(50));c.wreckFinish.soot.value=mix(51);c.wreckParts.poseAt(mix(55),c.speed);
      c.wheels.forEach((w,j)=>{const k=15+j*8;w.position.set(mix(k),mix(k+1),mix(k+2));w.quaternion.fromArray(av,o+k+3).slerp(q.fromArray(bv,o+k+3),t).multiply(spin.setFromAxisAngle(axis,-mix(k+7)));});
      for(const material of c.brakeLights)material.emissiveIntensity=av[o+53]?3.5:.8;
    });
    this.props.forEach((p,i)=>{const o=this.cars.length*REPLAY_STRIDE+i*7;p.position.fromArray(av,o).lerp(new T.Vector3().fromArray(bv,o),alpha);p.quaternion.fromArray(av,o+3).slerp(q.fromArray(bv,o+3),alpha);});this.time=time;
  }
  dispose(){this.cars.forEach(c=>c.dispose());this.props.forEach(p=>p.removeFromParent());}
}
