import * as T from 'three';
import {inside,bottom,seeded} from './PondGeometry.js';
const wrap=a=>Math.atan2(Math.sin(a),Math.cos(a));
export const varieties=[
 {id:'kohaku',name:'Kohaku',colors:'White · red',note:'Broad red markings rest on a clean white body. This classic two-color variety makes the calm, rounded outline of a koi easy to read.'},
 {id:'sanke',name:'Taisho Sanke',colors:'White · red · black',note:'Red and smaller black markings sit on a white base. Sanke is a color variety of koi, with the same care needs as the other fish here.'},
 {id:'showa',name:'Showa',colors:'Black · red · white',note:'Black wraps the body and head, with red and white areas breaking up the pattern. Each fish has its own arrangement of markings.'},
 {id:'ogon',name:'Yamabuki Ogon',colors:'Metallic gold',note:'A golden, single-color koi. Light travels over its overlapping scales, which cover a rounded body rather than a flat silhouette.'},
 {id:'asagi',name:'Asagi',colors:'Blue-gray · orange',note:'A blue-gray, net-patterned back contrasts with orange along the lower flanks. Look for the regular scale edges and pale head.'},
 {id:'shiro',name:'Shiro Utsuri',colors:'Black · white',note:'Alternating black and white markings extend around the body. Koi patterns develop as fish grow; these are authored examples of the varieties.'},
 {id:'ochiba',name:'Ochiba',colors:'Gray · warm brown',note:'Warm brown markings sit over a gray body, suggesting fallen leaves on water. The quieter palette complements the brighter varieties.'}
];
export class KoiSchool{
 constructor(seed=Math.floor(Math.random()*2**30)){this.random=seeded(seed);this.time=0;this.food=[];this.bites=0;this.fish=varieties.map((v,i)=>{const p=this.destination(),size=1.02+this.random()*.28;return {id:i,variety:v,position:p,velocity:new T.Vector3(),goal:this.destination(),size,yaw:this.random()*6.28,pitch:0,turn:0,phase:this.random()*6.28,finPhase:this.random()*6.28,individual:.85+this.random()*.3,decision:1+this.random()*5,stroke:1+this.random()*2,coast:false,effort:.7,hold:0,hunger:.4+this.random()*.4,energy:.8+this.random()*.2,memory:null,mode:'exploring',target:null};});}
 destination(){let x,z;do{x=(this.random()-.5)*16;z=(this.random()-.5)*10;}while(!inside(x,z,1.5));return new T.Vector3(x,Math.max(bottom(x,z)+.5,-.38-this.random()*1.02),z);}
 feed(x=0,z=1){if(this.food.length>24)return false;for(let i=0;i<16;i++){const px=x+(this.random()-.5)*1.4,pz=z+(this.random()-.5);if(inside(px,pz,1))this.food.push({position:new T.Vector3(px,-.025,pz),alive:true,age:0});}return true;}
 mouth(f){return new T.Vector3(.48*f.size,-.039*f.size,0).applyEuler(new T.Euler(0,f.yaw,f.pitch,'YXZ')).add(f.position);}
 update(dt){if(dt<=0)return;dt=Math.min(dt,.05);this.time+=dt;const now=this.time;
  for(const food of this.food){food.age+=dt;if(food.age>65)food.alive=false;food.position.y=Math.max(-.14,food.position.y-dt*.001);}
  for(const f of this.fish){
   f.hunger=Math.min(1,f.hunger+dt*.003);f.energy=T.MathUtils.clamp(f.energy+dt*(f.coast?.018:-.006),.4,1);
   const mouth=this.mouth(f);let target=null,best=5.6**2;
   for(const food of this.food){if(!food.alive||f.hunger<.12)continue;const distance=food.position.distanceToSquared(mouth);if(distance<best){target=food;best=distance;}}
   if(target){f.target=target;f.goal.copy(target.position).add(new T.Vector3(-Math.cos(f.yaw)*.48*f.size,-.02*f.size,Math.sin(f.yaw)*.48*f.size));f.mode='approaching food';}
   else{f.target=null;if(now>f.decision||f.position.distanceTo(f.goal)<.65){const inspect=this.random()<.22;f.goal.copy(f.memory&&this.random()<.18?f.memory:this.destination());f.decision=now+9+this.random()*13;f.hold=inspect?now+1.2+this.random()*2.4:0;f.mode=inspect?'inspecting':'exploring';}}
   if(now>f.stroke){f.coast=!f.coast;f.stroke=now+(f.coast?1.0:1.7)+this.random()*2.3;}
   const delta=f.goal.clone().sub(f.position),distance=delta.length(),desired=delta.clone().normalize();
   // Perceive the space ahead and yield to nearby bodies, including their heads and tails.
   for(const other of this.fish){if(other===f)continue;for(const q of [-.32,.18]){const center=other.position.clone().add(new T.Vector3(Math.cos(other.yaw)*q*other.size,0,-Math.sin(other.yaw)*q*other.size)),away=f.position.clone().sub(center),d=away.length(),spacing=(f.size+other.size)*.40;if(d<spacing+.3)desired.addScaledVector(away.normalize(),Math.max(0,1-d/(spacing+.3))*(target?.8:1.9));}}
   const ahead=f.position.clone().add(new T.Vector3(Math.cos(f.yaw),0,-Math.sin(f.yaw)).multiplyScalar(1.6*f.size));
   if(!inside(ahead.x,ahead.z,1.05)){desired.x-=f.position.x*.75;desired.z-=f.position.z*.75;}
   const goalYaw=Math.atan2(-desired.z,desired.x),error=wrap(goalYaw-f.yaw),rate=T.MathUtils.clamp(error*1.12,-.62,.62);
   f.turn=T.MathUtils.damp(f.turn,rate,3,dt);f.yaw+=f.turn*dt;
   let speed=f.size*(target?.77:.47+.08*Math.sin(now*.22+f.id))*f.individual*(f.coast&&!target?.46:1)*(.76+.24*f.energy);
   speed*=Math.max(.30,Math.cos(Math.min(Math.PI/2,Math.abs(error))));
   if(!target&&now<f.hold)speed*=.08;
   if(target)speed*=Math.min(1,.17+distance/.8);
   const forward=new T.Vector3(Math.cos(f.yaw)*speed,T.MathUtils.clamp((f.goal.y-f.position.y)*.65,-.13,.13),-Math.sin(f.yaw)*speed);
   if(target&&distance<.68){const gap=target.position.clone().sub(mouth),along=gap.x*Math.cos(f.yaw)-gap.z*Math.sin(f.yaw),advance=T.MathUtils.clamp(along*2,-.095,speed);forward.set(Math.cos(f.yaw)*advance,T.MathUtils.clamp(gap.y*1.9,-.13,.13),-Math.sin(f.yaw)*advance);}
   // Inertia changes pace, while the velocity stays aligned to the slowly turning body.
   const oldSpeed=Math.hypot(f.velocity.x,f.velocity.z),advance=T.MathUtils.damp(oldSpeed,Math.hypot(forward.x,forward.z),f.coast?1.1:2.4,dt),sign=forward.x*Math.cos(f.yaw)-forward.z*Math.sin(f.yaw)<0?-1:1;
   f.velocity.set(Math.cos(f.yaw)*advance*sign,T.MathUtils.damp(f.velocity.y,forward.y,2.2,dt),-Math.sin(f.yaw)*advance*sign);
   const next=f.position.clone().addScaledVector(f.velocity,dt);
   if(inside(next.x,next.z,1.5)){next.y=T.MathUtils.clamp(next.y,bottom(next.x,next.z)+.33,target?-.04:-.22);f.position.copy(next);}else{f.goal.set(-f.position.x*.25,-.85,-f.position.z*.25);f.decision=now+6;f.velocity.multiplyScalar(.8);}
   f.pitch=T.MathUtils.damp(f.pitch,target&&distance<.8?.12:T.MathUtils.clamp(f.velocity.y*.85,-.13,.13),2,dt);
   const exertion=target?.9:now<f.hold?.13:f.coast?.22:.78;
   f.effort=T.MathUtils.damp(f.effort,exertion,2.8,dt);
   f.phase+=dt*(3.0+advance*3.5)*(f.coast?.67:1)*f.individual;f.finPhase+=dt*(2.0+advance*3.4+(now<f.hold?1.2:0))*f.individual;
   if(target&&this.mouth(f).distanceTo(target.position)<.05){target.alive=false;f.hunger=Math.max(0,f.hunger-.18);f.energy=Math.min(1,f.energy+.04);f.memory=f.position.clone();f.hold=now+.75;f.target=null;f.mode='taking a morsel';this.bites++;}
  }
  for(let i=0;i<this.fish.length;i++)for(let j=i+1;j<this.fish.length;j++){const a=this.fish[i],b=this.fish[j],delta=a.position.clone().sub(b.position),d=delta.length(),min=(a.size+b.size)*.21;if(d<min&&d>.0001){delta.multiplyScalar((min-d)/d*.5);const pa=a.position.clone().add(delta),pb=b.position.clone().sub(delta);if(inside(pa.x,pa.z,1.12)&&inside(pb.x,pb.z,1.12)){a.position.copy(pa);b.position.copy(pb);}}}
  this.food=this.food.filter(f=>f.alive);
 }
 snapshot(){return {time:this.time,bites:this.bites,food:this.food.length,fish:this.fish.map(f=>({id:f.id,position:f.position.toArray(),yaw:f.yaw,pitch:f.pitch,phase:f.phase,finPhase:f.finPhase,mode:f.mode,speed:f.velocity.length(),hunger:f.hunger,energy:f.energy}))};}
}
