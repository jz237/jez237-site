import * as T from 'three';
import {sandHeight} from './ReefOptics.ts';
import metadata from './assets/fish/model-info.json';
import {bodyBend} from './MarineFinFlex.ts';
import {type MarineSpecies} from './MarineModels.ts';
import {type Obstacle} from './ReefScene.ts';

type Species=MarineSpecies;
const names:Record<Species,string>={tang:'Blue tang',yellow:'Yellow tang',clown:'Clownfish',anthias:'Anthias',chromis:'Blue-green chromis',gramma:'Royal gramma',goby:'Mandarin dragonet'};
const descriptions:Record<Species,string>={tang:'A laterally compressed body lets this blue tang turn between reef structures. It alternates fin-powered cruising with short tail-driven bursts, exploring the open channel and rock edges.',yellow:'Watch the yellow tang cruise around the islands and pause near the rock. Tangs graze as well as take food from the water. Its paired fins work independently while the tail supplies extra thrust.',clown:'The two clownfish stay close to their host anemone. They make short foraging trips into the water and return to shelter, rather than joining the open-water school.',anthias:'These orange fish use the open water above the reef. Individuals keep changing position within their loose group, making short feeding trips and then returning toward shelter.',chromis:'The blue-green fish loosely associate above the reef. They keep individual spacing and change speed instead of swimming in a perfectly synchronized formation.',goby:'Synchiropus splendidus hovers close to reef rubble with fluttering pectoral fins, rests on its broad lower fins, and pecks at tiny crustaceans. Short moves and flexible turns interrupt its pauses. It is a dragonet, often called a mandarin goby; it does not sift mouthfuls of sand. The tiny food items here illustrate prey capture, not a living copepod population.',gramma:'This purple-and-yellow inhabitant keeps closer to the reef and its shelter. Watch for exploratory trips around the lower openings and retreating turns.'};
const specs:Record<Species,{h:number;w:number;size:number;color:string}>={tang:{h:.32,w:.095,size:.83,color:'#285deb'},yellow:{h:.35,w:.09,size:.72,color:'#ffd800'},clown:{h:.21,w:.12,size:.4664,color:'#f68210'},anthias:{h:.16,w:.075,size:.47,color:'#f8783c'},chromis:{h:.19,w:.085,size:.41,color:'#59bde0'},gramma:{h:.16,w:.07,size:.49,color:'#b951df'},goby:{h:.19,w:.133,size:.59,color:'#ef7623'}};
const v=(x:number,y:number,z=0)=>new T.Vector3(x,y,z);
type Fish={group:T.Group;species:Species;position:T.Vector3;velocity:T.Vector3;goal:T.Vector3;radius:number;yaw:number;pitch:number;clock:{value:number};effort:{value:number};waveGain:{value:number};turnBend:{value:number};mouthOpening:{value:number};gillOpening:{value:number};respiration:number;until:number;phase:number;pectoral:T.Group[];mouth:T.Group;eyes:T.Group;mode:string;progressPosition:T.Vector3;progressAt:number;blockedTime:number;recoverUntil:number;hostLeg:number;hostHold:number;hostVisits:number;clearance:number;home:T.Vector3;gobyCycle:number;pecks:number};
export type Food={position:T.Vector3;alive:boolean;age:number;sinkRate?:number};
export class ReefFish{
 readonly fish:Fish[]=[];readonly foods:Food[]=[];readonly notes:T.Object3D[]=[];private clock=0;private seed=Math.random()*100;private templates=new Map<Species,T.Group>();private eatCount=0;private foodMesh:T.InstancedMesh;private dummy=new T.Object3D();
 constructor(private scene:T.Scene,private obstacles:Obstacle[],private hosts:T.Vector3[],templates:Map<Species,T.Group>,private hostScale=1){
  this.templates=templates;
  this.foodMesh=new T.InstancedMesh(new T.SphereGeometry(.022,6,4),new T.MeshStandardMaterial({color:'#cf9d67',roughness:.8}),48);this.foodMesh.count=0;scene.add(this.foodMesh);
  for(const [s,count] of [['tang',1],['yellow',1],['clown',2],['anthias',7],['chromis',8],['gramma',1],['goby',1]] as [Species,number][]){
   for(let i=0;i<count;i++){
    const group=this.templates.get(s)!.clone(true),clock={value:Math.random()*7},effort={value:.5},waveGain={value:s==='goby'?.2:1},turnBend={value:0},mouthOpening={value:0},gillOpening={value:0};
    group.traverse(o=>{if(o instanceof T.Mesh){o.material=(o.material as T.MeshStandardMaterial).clone();const mat=o.material as T.MeshStandardMaterial;
     if(o.name==='operculum'){
      mat.onBeforeCompile=shader=>{shader.uniforms.gillOpening=gillOpening;shader.uniforms.gillSide={value:o.userData.side};
       shader.vertexShader='uniform float gillOpening,gillSide;attribute float gillFlex;attribute vec3 gillGradient;\n'+shader.vertexShader;
       shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\ntransformed.z+=gillSide*gillOpening*gillFlex;');
       shader.vertexShader=shader.vertexShader.replace('#include <beginnormal_vertex>','#include <beginnormal_vertex>\nobjectNormal.xy-=gillSide*gillOpening*gillGradient.xy*objectNormal.z;objectNormal=normalize(objectNormal);');
      };mat.customProgramCacheKey=()=> 'reef-attached-operculum-v1';
     }
     if(o.name==='body'||o.name==='fin'){
      const isBody=o.name==='body',isPectoral=Boolean(o.userData.pectoral);mat.onBeforeCompile=shader=>{shader.uniforms.swimTime=clock;shader.uniforms.swimEffort=effort;shader.uniforms.waveGain=waveGain;shader.uniforms.turnBend=turnBend;shader.uniforms.mouthOpening=mouthOpening;shader.uniforms.mouthY={value:metadata[s].mouth[1]};shader.uniforms.jawRadius={value:(metadata[s].upper.at(-1)![1]-metadata[s].lower.at(-1)![1])*1.2};shader.vertexShader='uniform float swimTime,swimEffort,waveGain,turnBend,mouthOpening,mouthY,jawRadius;\n'+(isBody?'':'attribute float finFlex; attribute vec3 finGradient;\n')+shader.vertexShader;
       shader.vertexShader=shader.vertexShader.replace('#include <beginnormal_vertex>',`#include <beginnormal_vertex>
        float tail=clamp((.3-position.x)/.9,0.,1.),dTail=position.x>-.6&&position.x<.3?-1./.9:0.;
        float slope=(2.*tail*dTail*sin(swimTime*7.5-position.x*7.)-7.*tail*tail*cos(swimTime*7.5-position.x*7.))*(.018+swimEffort*.075)*waveGain+2.*tail*dTail*turnBend;
        ${isPectoral?'slope=0.;':''}
        vec3 tissueSlope=vec3(slope,0.,0.);
        ${isBody?'':`float finPhase=swimTime*9.-position.x*8.,finAmplitude=.015+abs(position.y)*.11;
        tissueSlope+=vec3(-8.*cos(finPhase)*finFlex*finAmplitude,sin(finPhase)*finFlex*.11*sign(position.y),0.)+sin(finPhase)*finAmplitude*finGradient;`}
        ${isBody?`float jawT=clamp((position.x-.43)/.07,0.,1.),jawWeight=jawT*jawT*(3.-2.*jawT);
        float jawSlope=position.x>.43&&position.x<.5?6.*jawT*(1.-jawT)/.07:0.;
        float jawY=position.y-mouthY,jawQ=jawY/jawRadius,jawFalloff=exp(-jawQ*jawQ);
        objectNormal.y/=1.+jawWeight*mouthOpening*jawFalloff*(1.-2.*jawQ*jawQ);
        objectNormal.x-=jawY*jawSlope*mouthOpening*jawFalloff*objectNormal.y;`:''}
        objectNormal.z/=max(.25,1.+tissueSlope.z);objectNormal.xy-=tissueSlope.xy*objectNormal.z;objectNormal=normalize(objectNormal);`);
       shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
        ${isBody?'transformed.y+=jawY*jawWeight*mouthOpening*jawFalloff;':''}
        float rear=clamp((.3-position.x)/.9,0.,1.);
        ${isPectoral?'':'transformed.z+=rear*rear*(sin(swimTime*7.5-position.x*7.)*(.018+swimEffort*.075)*waveGain+turnBend);'}
        ${isBody?'':'transformed.z+=sin(swimTime*9.-position.x*8.)*finFlex*(.015+abs(position.y)*.11);'}
       `);
       // Interior tissue receives little direct light through the small aperture.
       // Vertex depth also masks specular light; diffuse vertex color alone does not.
       if(isBody)shader.fragmentShader=shader.fragmentShader.replace('#include <lights_fragment_end>',`#include <lights_fragment_end>
        float oralExposure=smoothstep(.03,.9,vColor.r);
        reflectedLight.directSpecular*=oralExposure;
        reflectedLight.indirectSpecular*=oralExposure;
       `);
      };mat.customProgramCacheKey=()=>`reef-${isBody?'body':isPectoral?'pectoral':'fin'}-localized-respiration-flex-v6`;
     }
    }});
    const size=specs[s].size*(.83+Math.random()*.17);group.scale.setScalar(size);group.userData.note={title:names[s],description:descriptions[s]};scene.add(group);this.notes.push(group);
    let position=this.destination(s,i);const radius=size*(s==='goby'?.87:s==='tang'||s==='yellow'?.4:.31),clearance=s==='goby'?size*.20:radius;for(let attempt=0;attempt<500;attempt++){if(this.free(position,radius,clearance)&&this.fish.every(o=>position.distanceTo(o.position)>radius+o.radius+.06))break;position=this.destination(s,i);}
    const fish:Fish={group,species:s,position,velocity:v(0,0,0),goal:position.clone(),radius,clearance,home:position.clone(),gobyCycle:0,pecks:0,yaw:Math.random()*6.28,pitch:0,clock,effort,waveGain,turnBend,mouthOpening,gillOpening,respiration:Math.random()*Math.PI*2,until:0,phase:Math.random()*6.28,pectoral:group.children.filter(o=>o.name==='pectoral') as T.Group[],mouth:group.getObjectByName('mouth') as T.Group,eyes:group.getObjectByName('eyes') as T.Group,mode:'exploring',progressPosition:position.clone(),progressAt:0,blockedTime:0,recoverUntil:0,hostLeg:i%3,hostHold:0,hostVisits:0};group.position.copy(position);this.fish.push(fish);
   }
  }
 }
 private free(p:T.Vector3,r:number,clearance=r){return p.x>-4.7+r&&p.x<4.7-r&&p.z>-2.09+r&&p.z<2.09-r&&p.y>Math.max(clearance===r?.3:0,sandHeight(p.x,p.z)+(clearance===r?.035:.003))+clearance&&p.y<5.12-r&&this.obstacles.every(o=>p.distanceToSquared(o.center)>(o.radius+r)**2);}
 private clearSegment(a:T.Vector3,b:T.Vector3,r:number,clearance=r){
  if(!this.free(b,r,clearance))return false;const dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z,l=dx*dx+dy*dy+dz*dz;
  for(let i=1;i<8;i++){const t=i/8;if(a.y+dy*t<=sandHeight(a.x+dx*t,a.z+dz*t)+clearance+.035)return false;}
  for(const o of this.obstacles){const radius=o.radius+r,c=o.center;
   if(c.x+radius<Math.min(a.x,b.x)||c.x-radius>Math.max(a.x,b.x)||c.y+radius<Math.min(a.y,b.y)||c.y-radius>Math.max(a.y,b.y)||c.z+radius<Math.min(a.z,b.z)||c.z-radius>Math.max(a.z,b.z))continue;
   const t=T.MathUtils.clamp(((c.x-a.x)*dx+(c.y-a.y)*dy+(c.z-a.z)*dz)/(l||1),0,1),x=a.x+dx*t-c.x,y=a.y+dy*t-c.y,z=a.z+dz*t-c.z;
   if(x*x+y*y+z*z<radius*radius)return false;
  }return true;
 }
 private destination(s:Species,index=0){
  for(let j=0;j<250;j++){
   let p:T.Vector3;
   if(s==='goby'){const x=(Math.random()-.5)*7.5,z=.9+Math.random()*.7;p=v(x,sandHeight(x,z)+.23,z);}
   else if(s==='clown')p=this.hosts[0].clone().add(v((Math.random()-.5)*1.9,.15+Math.random()*1.15,(Math.random()-.3)*1.1));
   else if(s==='anthias')p=v(-2.2+(Math.random()-.5)*3,3.55+Math.random()*1.35,(Math.random()-.5)*3);
   else if(s==='chromis')p=v(2.8+(Math.random()-.5)*2.5,3.65+Math.random()*1.25,(Math.random()-.5)*3);
   else p=v((Math.random()-.5)*8.5,.8+Math.random()*3.6,(Math.random()-.5)*3.6);
   if(this.free(p,s==='goby'?.45:s==='tang'||s==='yellow'?.36:.2,s==='goby'?.154:s==='tang'||s==='yellow'?.36:.2))return p;
  }
  return v((index%7-3)*.5,4.8,1.3);
 }
 private planSwim(f:Fish,index:number,recover:boolean){
  if(f.species==='clown'&&!recover&&this.planHostVisit(f))return;
  let chosen:T.Vector3|undefined;
  if(!recover)for(let j=0;j<20;j++){const p=this.destination(f.species,index);if(p.distanceToSquared(f.position)>.36&&this.clearSegment(f.position,p,f.radius)){chosen=p;break;}}
  if(!chosen){let best=-Infinity;
   for(const reach of [.45,.85,1.4])for(let j=0;j<16;j++){
    const angle=f.yaw+j*Math.PI/8,p=f.position.clone().add(v(Math.cos(angle)*reach,Math.sin(j*2.4+f.phase)*reach*.22,-Math.sin(angle)*reach));
    if(!this.clearSegment(f.position,p,f.radius)||this.fish.some(o=>o!==f&&p.distanceToSquared(o.position)<(f.radius+o.radius+.06)**2))continue;
    const score=reach+.3*Math.cos(angle-f.yaw)+.08*Math.sin(j+f.phase);
    if(score>best){best=score;chosen=p;}
   }
  }
  if(chosen)f.goal.copy(chosen);
  f.until=this.clock+(recover?3:2+Math.random()*5);
  f.mode=recover?'exploring':Math.random()<.16?'hovering':'exploring';
 }
 private planHostVisit(f:Fish){
  const host=this.hosts[0],relative=f.position.clone().sub(host),far=relative.length()>1.45*this.hostScale;
  // Alternate visits to shelter with independently chosen perimeter/foraging
  // excursions. The pair does not share a clock or a repeated circular path.
  const leg=far?0:f.hostLeg===0?(Math.random()<.62?1:2):f.hostLeg===1?0:Math.random()<.68?0:1;
  const bearing=Math.atan2(relative.z,relative.x);
  for(let attempt=0;attempt<48;attempt++){
   const turn=(Math.random()<.5?-1:1)*(.45+Math.random()*1.3),angle=attempt<32?bearing+turn:Math.random()*Math.PI*2;
   const radius=(leg===0?.24+Math.random()*.32:leg===1?.88+Math.random()*.38:.56+Math.random()*.35)*this.hostScale;
   const p=host.clone().add(v(Math.cos(angle)*radius,(.38+Math.random()*(leg===1?.58:.38))*this.hostScale,Math.sin(angle)*radius));
   if(!this.clearSegment(f.position,p,f.radius)||this.fish.some(o=>o!==f&&p.distanceToSquared(o.position)<(f.radius+o.radius+.05)**2))continue;
   f.goal.copy(p);f.hostLeg=leg;f.hostHold=0;f.until=this.clock+4.5+Math.random()*1.5;
   f.mode=leg===0?'returning to anemone':leg===1?'darting from anemone':'circling anemone';return true;
  }
  return false;
 }
 feed(sinkingSites:T.Vector3[]=[]){
  if(this.foods.some(f=>f.alive))return false;
  this.foods.length=0;for(let i=0;i<36;i++)this.foods.push({position:v((Math.random()-.5)*3.2,4.95+Math.random()*.08,.8+(Math.random()-.5)*.9),alive:true,age:0});
  const goby=this.fish.find(f=>f.species==='goby');if(goby)for(let i=0;i<3;i++)this.foods.push({position:goby.position.clone().add(v((i-1)*.18,.55,.06)),alive:true,age:0,sinkRate:.18});
  for(const site of sinkingSites.slice(0,6))this.foods.push({position:v(site.x,4.95,site.z),alive:true,age:0,sinkRate:.43});return true;
 }
 update(dt:number,night:boolean){
  this.clock+=dt;const now=this.clock;
  for(const food of this.foods)if(food.alive){food.age+=dt;const next=food.position.clone();next.y-=dt*(food.sinkRate??.07);next.x+=Math.sin(now*1.1+food.age*.2)*dt*(food.sinkRate?.004:.025);if(this.free(next,.028))food.position.copy(next);if(food.age>42)food.alive=false;}
  for(let i=0;i<this.fish.length;i++){
   const f=this.fish[i];if(f.species==='goby'){this.updateGoby(f,dt,night);continue;}const mouth=f.mouth.position.clone().multiplyScalar(f.group.scale.x).applyEuler(new T.Euler(0,f.yaw,f.pitch,'YXZ')).add(f.position);
   let target:Food|undefined,dist=Infinity;
   // A crowded feeding lane can block a geometrically reachable pellet. Keep
   // the escape route committed instead of replacing it with that pellet on
   // the very next frame. Food becomes eligible again once recovery ends.
   if(now>=f.recoverUntil)for(const food of this.foods)if(food.alive){const d=f.position.distanceToSquared(food.position);if((f.species!=='clown'||food.position.distanceToSquared(this.hosts[0])<5.0)&&d<dist&&this.clearSegment(f.position,food.position,f.radius)){dist=d;target=food;}}
   if(target){f.goal.copy(target.position);f.mode='feeding';if(mouth.distanceTo(target.position)<.13){target.alive=false;this.eatCount++;f.until=now+.6;f.goal.copy(f.position).add(v(Math.cos(f.yaw)*.5,0,-Math.sin(f.yaw)*.5));}}
   else {
    const arrived=f.position.distanceTo(f.goal)<(f.species==='clown'?.14:.2);
    if(f.species==='clown'&&arrived&&!f.hostHold){f.hostHold=now+.3+Math.random()*.75;f.until=f.hostHold;f.hostVisits++;f.mode='sheltering';}
    if(now>f.until||(arrived&&f.species!=='clown'))this.planSwim(f,i,now<f.recoverUntil);
   }
   // Monitor actual displacement, not commanded velocity: a blocked fish can
   // still have a nonzero velocity and animated tail without getting anywhere.
   if(f.position.distanceToSquared(f.progressPosition)>.025){f.progressPosition.copy(f.position);f.progressAt=now;}
   else if(now>=f.recoverUntil&&now-f.progressAt>2.4){f.recoverUntil=now+4;this.planSwim(f,i,true);f.progressAt=now;target=undefined;}
   const desired=f.goal.clone().sub(f.position);let speed=(f.species==='tang'||f.species==='yellow'?.47:.34)*(night?.42:1);
   speed*=.75+.35*Math.sin(now*.83+f.phase);if(f.mode==='hovering')speed*=.2;if(target)speed=1.2+(Math.sin(now*6+f.phase)+1)*.35;
   if(f.species==='clown'&&!target){
    const dart=f.hostLeg===1?1.6:f.hostLeg===0?1.1:.72;
    speed=dart*(night?.35:1)*(.83+.17*Math.sin(now*2.1+f.phase));
    speed*=Math.min(1,desired.length()/.28);
    if(f.mode==='sheltering')speed=0;
   }
   desired.normalize();
   if(!target&&(f.species==='chromis'||f.species==='anthias')){const center=v(0,0,0),alignment=v(0,0,0);let neighbors=0;for(const other of this.fish)if(other!==f&&other.species===f.species&&f.position.distanceToSquared(other.position)<2.25){center.add(other.position);alignment.add(other.velocity);neighbors++;}if(neighbors){desired.addScaledVector(center.multiplyScalar(1/neighbors).sub(f.position),.08).addScaledVector(alignment.normalize(),.15);}}
   // Local separation and obstacle anticipation. Heading, rather than position,
   // turns gradually; a rejected swept step waits/replans instead of teleporting.
   for(const other of this.fish)if(other!==f){const d=f.position.clone().sub(other.position),l=d.length(),space=f.radius+other.radius+.22;if(l<space&&l>.0001)desired.addScaledVector(d,(space-l)/space/l*2.8);}
   const avoidance=v(0,0,0);
   for(const o of this.obstacles){const x=f.position.x-o.center.x,y=f.position.y-o.center.y,z=f.position.z-o.center.z,limit=o.radius+f.radius+.38,d2=x*x+y*y+z*z;if(d2<limit*limit&&d2>.000001){const d=Math.sqrt(d2),gain=(limit-d)/.38/d*2;avoidance.x+=x*gain;avoidance.y+=y*gain;avoidance.z+=z*gain;}}
   // Summing dozens of overlapping rock/coral proxies used to overpower the
   // route and trap a tang between opposing forces. Bound the combined force.
   desired.add(avoidance.clampLength(0,f.species==='clown'?.28:.65));
   const wantedYaw=Math.atan2(-desired.z,desired.x),turn=Math.atan2(Math.sin(wantedYaw-f.yaw),Math.cos(wantedYaw-f.yaw));const turnRate=f.species==='clown'?3.7:1.55;f.yaw+=T.MathUtils.clamp(turn,-dt*turnRate,dt*turnRate);
   const pitch=T.MathUtils.clamp(Math.atan2(desired.y,Math.hypot(desired.x,desired.z)),-.28,.28);f.pitch=T.MathUtils.damp(f.pitch,pitch,2.5,dt);
   speed*=Math.max(.17,Math.cos(turn));const forward=v(Math.cos(f.yaw)*Math.cos(f.pitch),Math.sin(f.pitch),-Math.sin(f.yaw)*Math.cos(f.pitch));f.velocity.lerp(forward.multiplyScalar(speed),1-Math.exp(-dt*(f.species==='clown'?7:3)));
   const next=f.position.clone().addScaledVector(f.velocity,dt);
   const collision=this.fish.some(other=>other!==f&&next.distanceToSquared(other.position)<(f.radius+other.radius)**2);
   if(!collision&&this.clearSegment(f.position,next,f.radius)){f.position.copy(next);f.blockedTime=Math.max(0,f.blockedTime-dt);}else{f.velocity.multiplyScalar(.65);f.blockedTime+=dt;
    // Commit to an escape waypoint long enough to turn; never select a new
    // random destination every rejected frame (the source of the quivering).
    if(f.blockedTime>.65&&now>f.recoverUntil){f.recoverUntil=now+3;this.planSwim(f,i,true);f.blockedTime=0;}
   }
   f.group.position.copy(f.position);f.group.rotation.set(0,f.yaw,f.pitch,'YXZ');f.clock.value+=dt*(.52+f.velocity.length()*1.65);f.effort.value=T.MathUtils.damp(f.effort.value,f.velocity.length(),5,dt);
   for(let j=0;j<f.pectoral.length;j++){const p=f.pectoral[j];p.position.z=p.userData.restZ+bodyBend(p.position.x,f.clock.value,f.effort.value);p.rotation.y=Math.sign(p.userData.restZ)*(.24+.20*Math.sin(now*(7+f.effort.value*5)+f.phase+j));p.rotation.x=Math.cos(now*6+f.phase+j)*.055;}
   // Activity modulates breathing smoothly, independent of tail-beat speed.
   // The mouth pumps first and the operculum follows; these are illustrative
   // species rhythms, not a water-quality or clinical respiration model.
   const base=f.species==='tang'||f.species==='yellow'?.88:1.12;
   f.respiration+=dt*2*Math.PI*(base*(night?.78:1)+Math.min(f.effort.value,1.7)*.20)*(.93+.07*Math.sin(f.phase));
   this.breathe(f,target?.alive?Math.max(0,1-Math.sqrt(dist))*Math.max(0,Math.sin(now*18))*1.35:0);
  }
  let n=0;for(const f of this.foods)if(f.alive){this.dummy.position.copy(f.position);this.dummy.updateMatrix();this.foodMesh.setMatrixAt(n++,this.dummy.matrix);}this.foodMesh.count=n;if(n)this.foodMesh.instanceMatrix.needsUpdate=true;
 }
 private updateGoby(f:Fish,dt:number,night:boolean){
  const now=this.clock,size=f.group.scale.x,stance=f.clearance+.006;
  const clear=(p:T.Vector3)=>this.clearSegment(f.position,p,f.radius,f.clearance)&&this.fish.every(o=>o===f||p.distanceToSquared(o.position)>(f.radius+o.radius+.025)**2);
  let target:Food|undefined,best=Infinity;
  if(now>=f.recoverUntil)for(const food of this.foods)if(food.alive&&food.position.y-sandHeight(food.position.x,food.position.z)<.62){
   const delta=food.position.clone().sub(f.position);delta.y=0;const d=delta.lengthSq();if(d>2.25||d>=best)continue;
   const aim=delta.lengthSq()>.00001?delta.normalize():v(Math.cos(f.yaw),0,-Math.sin(f.yaw));
   const p=food.position.clone().addScaledVector(aim,-metadata.goby.mouth[0]*size);
   p.y=Math.max(sandHeight(p.x,p.z)+stance,food.position.y-metadata.goby.mouth[1]*size);
   if(clear(p)){best=d;target=food;f.goal.copy(p);}
  }
  if(target){f.mode='feeding';f.gobyCycle=0;f.until=now+1.2;}
  const arrived=Math.hypot(f.position.x-f.goal.x,f.position.z-f.goal.z)<.08;
  if(!target&&arrived&&f.mode==='bottom hover'){
   f.mode=night||Math.random()<.45?'resting':'pecking';f.gobyCycle=now;f.until=now+(night?9:4.5)+Math.random()*(night?8:4);f.goal.copy(f.position);
   if(f.mode==='pecking')f.pecks++;
  }
  // Commit to a short route or a rest. A blocked prey item cannot perpetually
  // replace the escape waypoint or make the fish quiver at a rock boundary.
  if(f.position.distanceToSquared(f.progressPosition)>.006){f.progressPosition.copy(f.position);f.progressAt=now;}
  else if(target&&now-f.progressAt>2.5){target=undefined;f.recoverUntil=now+3;f.until=0;f.progressAt=now;}
  const startled=f.mode!=='bottom hover'&&now>f.recoverUntil&&this.fish.some(o=>o!==f&&o.position.distanceTo(f.position)<f.radius+o.radius+.12);
  if(!target&&(now>f.until||startled)){
   let chosen:T.Vector3|undefined;
   for(let i=0;i<48;i++){
    const a=Math.random()*Math.PI*2,reach=.28+Math.random()*1.0,p=f.position.clone().add(v(Math.cos(a)*reach,0,Math.sin(a)*reach));
    p.y=sandHeight(p.x,p.z)+stance+.045;
    if(p.distanceToSquared(f.home)>12||!clear(p))continue;chosen=p;break;
   }
   if(chosen){f.goal.copy(chosen);f.mode='bottom hover';f.until=now+6+Math.random()*3;f.gobyCycle=0;}
   else {f.mode='resting';f.until=now+1+Math.random()*2;}
   if(startled)f.recoverUntil=now+3;
  }
  let wantedYaw=f.yaw,wantedPitch=0,speed=0,peck=0;
  if(f.mode==='bottom hover'||target){
   const delta=f.goal.clone().sub(f.position);if(target)delta.copy(target.position).sub(f.position);
   wantedYaw=Math.atan2(-delta.z,delta.x);
   speed=(target?.36:now<f.recoverUntil?.62:.19+.085*Math.sin(now*2.1+f.phase))*(night?.6:1);
   speed*=Math.min(1,f.position.distanceTo(f.goal)/.15);
   if(target)wantedPitch=T.MathUtils.clamp(Math.atan2(delta.y,Math.hypot(delta.x,delta.z)),-.25,.18);
  }else if(f.mode==='pecking'){
   // One small substrate-directed pick, followed by a quiet inspection pause.
   // Mandarin dragonets pick microfauna; no sleeper-goby sand/gill stream.
   const t=now-f.gobyCycle;peck=Math.max(0,Math.sin(Math.PI*Math.min(1,t/.65)));
   wantedPitch=-.22*peck;
   if(t>1.0)f.mode='resting';
  }
  const turn=Math.atan2(Math.sin(wantedYaw-f.yaw),Math.cos(wantedYaw-f.yaw));
  const yawStep=T.MathUtils.clamp(turn,-dt*1.8,dt*1.8);f.yaw+=yawStep;f.pitch=T.MathUtils.damp(f.pitch,wantedPitch,6,dt);
  speed*=Math.max(0,Math.cos(turn));const forward=v(Math.cos(f.yaw)*speed,0,-Math.sin(f.yaw)*speed);f.velocity.lerp(forward,1-Math.exp(-dt*7));
  const next=f.position.clone().addScaledVector(f.velocity,dt);
  let bed=sandHeight(next.x,next.z);
  for(const along of [-.78,-.4,0,.25,.5])for(const side of [-.23,.23]){
   const x=next.x+(Math.cos(f.yaw)*along+Math.sin(f.yaw)*side)*size,z=next.z+(-Math.sin(f.yaw)*along+Math.cos(f.yaw)*side)*size;
   // The raised tail and nose do not need the full belly clearance. Applying
   // one height to the entire footprint made rests hover above nearby dunes.
   const raisedEnd=Math.max(0,Math.abs(along)-.25)*size*.19;
   bed=Math.max(bed,sandHeight(x,z)-raisedEnd);
  }
  const floor=bed+stance,desiredHeight=target?Math.max(floor,f.goal.y):floor+(f.mode==='bottom hover'?.085:0);
  next.y=T.MathUtils.damp(f.position.y,desiredHeight,8,dt);
  if(clear(next)){f.position.copy(next);f.blockedTime=0;}else{f.velocity.multiplyScalar(.4);f.blockedTime+=dt;if(f.blockedTime>.7){f.until=0;f.recoverUntil=now+3;f.mode='resting';f.blockedTime=0;}}
  const moving=f.velocity.length();
  f.group.position.copy(f.position);f.group.rotation.set(0,f.yaw,f.pitch,'YXZ');f.clock.value+=dt*(.32+moving*2.5);f.effort.value=T.MathUtils.damp(f.effort.value,moving,5,dt);
  f.waveGain.value=T.MathUtils.damp(f.waveGain.value,.15+Math.min(1,moving/.25)*2.8,6,dt);
  f.turnBend.value=T.MathUtils.damp(f.turnBend.value,-yawStep/Math.max(dt,.001)*.068,5,dt);
  for(let j=0;j<f.pectoral.length;j++){
   const p=f.pectoral[j],side=Math.sign(p.userData.restZ),pelvic=p.userData.pelvic;
   p.position.z=p.userData.restZ+bodyBend(p.position.x,f.clock.value,f.effort.value,f.waveGain.value,f.turnBend.value);
   // Broad paired fins have independent clocks. Pectoral flutter continues
   // while hovering; pelvic fans spread to support rests and soften in motion.
   const phase=now*(pelvic?2.4:16+moving*9)+f.phase+j*.87,footMotion=Math.min(1,moving/.08);
   p.rotation.x=-side*(pelvic?.73+Math.min(1,moving/.2)*.3+.06*Math.sin(phase)*footMotion:.77+.19*Math.sin(phase));
   p.rotation.y=side*(pelvic?.10+.09*Math.sin(phase+.8)*footMotion:.38+.26*Math.sin(phase+.6));
   p.rotation.z=pelvic?.04*Math.sin(phase)*footMotion:.07*Math.sin(phase+1.3);
  }
  f.respiration+=dt*Math.PI*2*(night?.72:.95);this.breathe(f,peck*.8+(target?.35:0));
  if(target){const mouth=f.mouth.position.clone().multiplyScalar(size).applyEuler(f.group.rotation).add(f.position);if(mouth.distanceTo(target.position)<.065){target.alive=false;this.eatCount++;f.pecks++;f.mode='resting';f.until=now+.65;f.goal.copy(f.position);}}
 }
 private breathe(f:Fish,bite=0){
  const inhale=.5+.5*Math.sin(f.respiration),outflow=.5+.5*Math.sin(f.respiration-.95);
  f.gillOpening.value=.001+.019*outflow;
  for(const gill of f.group.children)if(gill.name==='gill'){
   gill.userData.opening=gill.userData.side*f.gillOpening.value;
   gill.position.z=gill.userData.restZ+bodyBend(gill.position.x,f.clock.value,f.effort.value,f.waveGain.value,f.turnBend.value);
  }
  f.mouthOpening.value=Math.min(1.9,.12+.90*inhale+Math.min(.25,f.effort.value*.15)+bite);
  f.mouth.scale.y=.24+f.mouthOpening.value;
 }
 /** Isolated rendered respiration study: navigation/fin pose stays fixed. */
 respirationStudy(species:Species,phase:number){const f=this.fish.find(f=>f.species===species)!;f.respiration=phase;this.breathe(f);}
 anatomySnapshot(){return this.fish.map(f=>({species:f.species,model:f.group.userData.model,phase:f.clock.value,pectoral:f.pectoral.filter(p=>!p.userData.pelvic).map(p=>[p.rotation.x,p.rotation.y]),pelvic:f.pectoral.filter(p=>p.userData.pelvic).map(p=>[p.rotation.x,p.rotation.y]),gills:f.group.children.filter(o=>o.name==='gill').map(g=>g.userData.opening),mouth:f.mouth.scale.y,mouthOpening:f.mouthOpening.value}));}
 snapshot(){return {fish:this.fish.length,sandGrains:0,bites:this.eatCount,food:this.foods.filter(f=>f.alive).length,positions:this.fish.map(f=>({species:f.species,x:f.position.x,y:f.position.y,z:f.position.z,mode:f.mode,hostVisits:f.hostVisits,speed:f.velocity.length(),heightAboveSand:f.position.y-sandHeight(f.position.x,f.position.z),pecks:f.pecks})),obstacleOverlaps:this.fish.filter(f=>!this.free(f.position,f.radius,f.clearance)).length,fishOverlaps:this.fish.reduce((n,f,i)=>n+this.fish.slice(i+1).filter(o=>f.position.distanceToSquared(o.position)<(f.radius+o.radius-.01)**2).length,0)};}
}
