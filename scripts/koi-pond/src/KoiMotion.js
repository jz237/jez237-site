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
 constructor(seed=Math.floor(Math.random()*2**30)){this.random=seeded(seed);this.time=0;this.food=[];this.bites=0;this.fish=varieties.map((v,i)=>{const p=this.destination(),size=.80+this.random()*.22;return {id:i,variety:v,position:p,velocity:new T.Vector3(),goal:this.destination(),size,yaw:this.random()*6.28,pitch:0,turn:0,phase:this.random()*6.28,finPhase:this.random()*6.28,individual:.86+this.random()*.3,decision:1+this.random()*5,stroke:1+this.random()*2,coast:false,hold:0,hunger:.4+this.random()*.4,energy:.8+this.random()*.2,memory:null,mode:'exploring',target:null};});}
 destination(){let x,z;do{x=(this.random()-.5)*7;z=(this.random()-.5)*4.7;}while(!inside(x,z,.8));return new T.Vector3(x,Math.max(bottom(x,z)+.35,-.33-this.random()*.65),z);}
 feed(x=0,z=1){if(this.food.filter(f=>f.alive).length>24)return false;for(let i=0;i<16;i++){const px=x+(this.random()-.5)*1.2,pz=z+(this.random()-.5)*.8;if(inside(px,pz,.7))this.food.push({position:new T.Vector3(px,-.025,pz),alive:true,age:0});}return true;}
 mouth(f){return new T.Vector3(.48*f.size,-.039*f.size,0).applyEuler(new T.Euler(0,f.yaw,f.pitch,'YXZ')).add(f.position);}
 update(dt){if(dt<=0)return;dt=Math.min(dt,.05);this.time+=dt;const now=this.time;
  for(const food of this.food){food.age+=dt;if(food.age>42)food.alive=false;food.position.y=Math.max(-.18,food.position.y-dt*.0015);}
  for(const f of this.fish){
   f.hunger=Math.min(1,f.hunger+dt*.003);f.energy=T.MathUtils.clamp(f.energy+dt*(f.coast?.006:.001)-f.velocity.length()*dt*.002,.4,1);
   const mouth=this.mouth(f);let target=null,best=3.2**2;
   for(const food of this.food){if(!food.alive||f.hunger<.12)continue;const distance=food.position.distanceToSquared(mouth);if(distance<best){target=food;best=distance;}}
   if(target){f.target=target;f.goal.copy(target.position).add(new T.Vector3(-Math.cos(f.yaw)*.48*f.size,-.02*f.size,Math.sin(f.yaw)*.48*f.size));f.mode='approaching food';}
   else{f.target=null;if(now>f.decision||f.position.distanceTo(f.goal)<.3){const inspect=this.random()<.25;f.goal.copy(f.memory&&this.random()<.22?f.memory:this.destination());f.decision=now+5+this.random()*9;f.hold=inspect?now+1+this.random()*2.8:0;f.mode=inspect?'inspecting':'exploring';}}
   if(now>f.stroke){f.coast=!f.coast;f.stroke=now+(f.coast?.8:1.1)+this.random()*2.1;}
   const desired=f.goal.clone().sub(f.position),distance=desired.length();desired.normalize();
   for(const other of this.fish){if(other===f)continue;const away=f.position.clone().sub(other.position),d=away.length(),spacing=(f.size+other.size)*.45;if(d<spacing+.35)desired.addScaledVector(away.normalize(),Math.max(0,1-d/(spacing+.35))*2.2);}
   // Look ahead before turning into the sloping banks; keep a continuous route.
   const ahead=f.position.clone().add(new T.Vector3(Math.cos(f.yaw),0,-Math.sin(f.yaw)).multiplyScalar(.85*f.size));
   if(!inside(ahead.x,ahead.z,.45)){desired.x-=f.position.x*.85;desired.z-=f.position.z*.85;}
   const goalYaw=Math.atan2(-desired.z,desired.x),error=wrap(goalYaw-f.yaw),rate=T.MathUtils.clamp(error*1.5,-.9,.9);
   f.turn=T.MathUtils.damp(f.turn,rate,2.8,dt);f.yaw+=f.turn*dt;
   let speed=f.size*(target?.95:.27+.14*Math.sin(now*.3+f.phase))*f.individual*(f.coast&&!target?.5:1)*(.75+.25*f.energy);
   if(!target&&now<f.hold)speed*=.15;
   if(target)speed*=Math.min(1,.18+distance/.6);
   const forward=new T.Vector3(Math.cos(f.yaw)*speed,T.MathUtils.clamp((f.goal.y-f.position.y)*.9,-.15,.15),-Math.sin(f.yaw)*speed);
   if(target&&distance<.5){const gap=target.position.clone().sub(mouth),along=gap.x*Math.cos(f.yaw)-gap.z*Math.sin(f.yaw),advance=T.MathUtils.clamp(along*2,-.14,speed);forward.set(Math.cos(f.yaw)*advance,T.MathUtils.clamp(gap.y*1.8,-.15,.15),-Math.sin(f.yaw)*advance);}
   f.velocity.lerp(forward,1-Math.exp(-dt*2.7));const next=f.position.clone().addScaledVector(f.velocity,dt);
   if(inside(next.x,next.z,.72)){next.y=T.MathUtils.clamp(next.y,bottom(next.x,next.z)+.23,target?-.04:-.16);f.position.copy(next);}else{f.goal.set(-f.position.x*.2,-.65,-f.position.z*.2);f.decision=now+4;f.velocity.multiplyScalar(.6);}
   f.pitch=T.MathUtils.damp(f.pitch,target&&distance<.7?.12:T.MathUtils.clamp(f.velocity.y*.7,-.13,.13),2,dt);
   f.phase+=dt*(2.6+f.velocity.length()*3.8)*(f.coast?.64:1)*f.individual;f.finPhase+=dt*(3.3+speed*3.1)*f.individual;
   if(target&&this.mouth(f).distanceTo(target.position)<.045){target.alive=false;f.hunger=Math.max(0,f.hunger-.18);f.energy=Math.min(1,f.energy+.04);f.memory=f.position.clone();f.hold=now+.75;f.target=null;f.mode='taking a morsel';this.bites++;}
  }
  // Symmetric body spacing corrects residual crossings without snapping headings.
  for(let i=0;i<this.fish.length;i++)for(let j=i+1;j<this.fish.length;j++){const a=this.fish[i],b=this.fish[j],delta=a.position.clone().sub(b.position),d=delta.length(),min=(a.size+b.size)*.21;if(d<min&&d>.0001){delta.multiplyScalar((min-d)/d*.5);const pa=a.position.clone().add(delta),pb=b.position.clone().sub(delta);if(inside(pa.x,pa.z,.55)&&inside(pb.x,pb.z,.55)){a.position.copy(pa);b.position.copy(pb);}}}
  this.food=this.food.filter(f=>f.alive);
 }
 snapshot(){return {time:this.time,bites:this.bites,food:this.food.length,fish:this.fish.map(f=>({id:f.id,position:f.position.toArray(),yaw:f.yaw,pitch:f.pitch,phase:f.phase,finPhase:f.finPhase,mode:f.mode,speed:f.velocity.length(),hunger:f.hunger,energy:f.energy}))};}
}
