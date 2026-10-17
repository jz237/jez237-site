import * as T from 'three';
import {VehicleFire} from './vehicle-fire';
import {replayBracket,replayCarStride,type ReplayDocument} from './replay-data';
/** Reconstruct visual plumes from recorded heat/origins, independently of playback
 * direction or frame rate. Smoke remains at historical world-space origins. */
export class ReplayFire {
 readonly fire:VehicleFire;
 private stride:number;
 constructor(private doc:ReplayDocument,scene:T.Scene){this.fire=new VehicleFire(scene,()=>{},()=>.5);this.stride=replayCarStride(doc.meta);}
 private sample(time:number,index:number){
  const {a,b,alpha}=replayBracket(this.doc.frames,time),o=index*this.stride,k=o+this.stride-4;
  const epoch=a.values[o+54],t=epoch===b.values[o+54]?alpha:0;
  const mix=(j:number)=>a.values[j]+(b.values[j]-a.values[j])*t;
  return {heat:mix(k),epoch,position:new T.Vector3(mix(k+1),mix(k+2),mix(k+3))};
 }
 update(time:number,camera:T.Camera){
  const fx=this.fire;for(const p of fx.particles)p.life=0;
  if(this.doc.meta.thermalModel!==1){fx.renderRecorded(time,camera);return;}
  let cursor=0;
  const first=this.doc.frames[0].time;
  this.doc.meta.cars.forEach((car,i)=>{
   const now=this.sample(time,i);
   for(const kind of [1,0]){
    const hz=kind===1?24:3,life=kind===1?.5:4;
    for(let tick=Math.floor(time*hz);tick>=(time-life)*hz;tick--){
     const born=tick/hz,age=time-born;if(born<first||age>=life)continue;
     const source=this.sample(born,i);if(source.heat<.025||source.epoch!==now.epoch)continue;
     const p=fx.particles[cursor++];if(!p)return;
     const seed=((Math.imul(tick+1,1664525)^Math.imul(car.id+7,1013904223))>>>0)/4294967296;
     p.owner=car.id;p.kind=kind;p.age=age;p.life=life;p.heat=source.heat;p.soot=1;p.seed=seed*31;p.aspect=.8;p.strength=source.heat;
     p.size=kind===1?.13+seed*.1:.27+seed*.12;
     p.p.copy(kind===1?now.position:source.position);
     p.p.x+=(seed-.5)*.4+(kind===0?age*.35:0);p.p.z+=Math.sin(seed*31)*.18;
     p.p.y+=.15+age*(kind===1?1.1:1.4);
    }
   }
  });
  fx.renderRecorded(time,camera);
  // Recorded heat also illuminates nearby bodywork; no new ignition simulation.
  const nearest=this.doc.meta.cars.map((_,i)=>this.sample(time,i)).filter(s=>s.heat>.025).sort((a,b)=>a.position.distanceToSquared(camera.position)-b.position.distanceToSquared(camera.position));
  fx.lights.forEach((light,i)=>{const source=nearest[i];if(source){light.position.copy(source.position).add(new T.Vector3(0,.35,0));light.intensity=source.heat*(8+2*Math.sin(time*17));}});
 }
 dispose(){this.fire.dispose();}
}
