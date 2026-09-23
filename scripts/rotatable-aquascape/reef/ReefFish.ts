import * as T from 'three';
import metadata from './assets/fish/model-info.json';
import {bodyBend} from './MarineFinFlex.ts';
import {type MarineSpecies} from './MarineModels.ts';
import {type Obstacle} from './ReefScene.ts';

type Species=MarineSpecies;
const names:Record<Species,string>={tang:'Blue tang',yellow:'Yellow tang',clown:'Clownfish',anthias:'Anthias',chromis:'Blue-green chromis',gramma:'Royal gramma'};
const descriptions:Record<Species,string>={tang:'A laterally compressed body lets this blue tang turn between reef structures. It alternates fin-powered cruising with short tail-driven bursts, exploring the open channel and rock edges.',yellow:'Watch the yellow tang cruise around the islands and pause near the rock. Tangs graze as well as take food from the water. Its paired fins work independently while the tail supplies extra thrust.',clown:'The two clownfish stay close to their host anemone. They make short foraging trips into the water and return to shelter, rather than joining the open-water school.',anthias:'These orange fish use the open water above the reef. Individuals keep changing position within their loose group, making short feeding trips and then returning toward shelter.',chromis:'The blue-green fish loosely associate above the reef. They keep individual spacing and change speed instead of swimming in a perfectly synchronized formation.',gramma:'This purple-and-yellow inhabitant keeps closer to the reef and its shelter. Watch for exploratory trips around the lower openings and retreating turns.'};
const specs:Record<Species,{h:number;w:number;size:number;color:string}>={tang:{h:.32,w:.095,size:.83,color:'#285deb'},yellow:{h:.35,w:.09,size:.72,color:'#ffd800'},clown:{h:.21,w:.12,size:.53,color:'#f68210'},anthias:{h:.16,w:.075,size:.47,color:'#f8783c'},chromis:{h:.19,w:.085,size:.41,color:'#59bde0'},gramma:{h:.16,w:.07,size:.49,color:'#b951df'}};
const v=(x:number,y:number,z=0)=>new T.Vector3(x,y,z);
type Fish={group:T.Group;species:Species;position:T.Vector3;velocity:T.Vector3;goal:T.Vector3;radius:number;yaw:number;pitch:number;clock:{value:number};effort:{value:number};mouthOpening:{value:number};until:number;phase:number;pectoral:T.Group[];mouth:T.Group;eyes:T.Group;mode:string};
export type Food={position:T.Vector3;alive:boolean;age:number};
export class ReefFish{
 readonly fish:Fish[]=[];readonly foods:Food[]=[];readonly notes:T.Object3D[]=[];private clock=0;private seed=Math.random()*100;private templates=new Map<Species,T.Group>();private eatCount=0;private foodMesh:T.InstancedMesh;private dummy=new T.Object3D();
 constructor(private scene:T.Scene,private obstacles:Obstacle[],private hosts:T.Vector3[],templates:Map<Species,T.Group>){
  this.templates=templates;
  this.foodMesh=new T.InstancedMesh(new T.SphereGeometry(.022,6,4),new T.MeshStandardMaterial({color:'#cf9d67',roughness:.8}),48);this.foodMesh.count=0;scene.add(this.foodMesh);
  for(const [s,count] of [['tang',1],['yellow',1],['clown',2],['anthias',7],['chromis',8],['gramma',1]] as [Species,number][]){
   for(let i=0;i<count;i++){
    const group=this.templates.get(s)!.clone(true),clock={value:Math.random()*7},effort={value:.5},mouthOpening={value:0};
    group.traverse(o=>{if(o instanceof T.Mesh){o.material=(o.material as T.MeshStandardMaterial).clone();const mat=o.material as T.MeshStandardMaterial;
     if(o.name==='body'||o.name==='fin'){
      const isBody=o.name==='body',isPectoral=Boolean(o.userData.pectoral);mat.onBeforeCompile=shader=>{shader.uniforms.swimTime=clock;shader.uniforms.swimEffort=effort;shader.uniforms.mouthOpening=mouthOpening;shader.uniforms.mouthY={value:metadata[s].mouth[1]};shader.vertexShader='uniform float swimTime,swimEffort,mouthOpening,mouthY;\n'+(isBody?'':'attribute float finFlex; attribute vec3 finGradient;\n')+shader.vertexShader;
       shader.vertexShader=shader.vertexShader.replace('#include <beginnormal_vertex>',`#include <beginnormal_vertex>
        float tail=clamp((.3-position.x)/.9,0.,1.),dTail=position.x>-.6&&position.x<.3?-1./.9:0.;
        float slope=(2.*tail*dTail*sin(swimTime*7.5-position.x*7.)-7.*tail*tail*cos(swimTime*7.5-position.x*7.))*(.018+swimEffort*.075);
        ${isPectoral?'slope=0.;':''}
        vec3 tissueSlope=vec3(slope,0.,0.);
        ${isBody?'':`float finPhase=swimTime*9.-position.x*8.,finAmplitude=.015+abs(position.y)*.11;
        tissueSlope+=vec3(-8.*cos(finPhase)*finFlex*finAmplitude,sin(finPhase)*finFlex*.11*sign(position.y),0.)+sin(finPhase)*finAmplitude*finGradient;`}
        ${isBody?`float jawT=clamp((position.x-.43)/.07,0.,1.),jawWeight=jawT*jawT*(3.-2.*jawT);
        float jawSlope=position.x>.43&&position.x<.5?6.*jawT*(1.-jawT)/.07:0.;
        float jawY=position.y-mouthY;
        objectNormal.y/=1.+jawWeight*mouthOpening;
        objectNormal.x-=jawY*jawSlope*mouthOpening*objectNormal.y;`:''}
        objectNormal.z/=max(.25,1.+tissueSlope.z);objectNormal.xy-=tissueSlope.xy*objectNormal.z;objectNormal=normalize(objectNormal);`);
       shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
        ${isBody?'transformed.y+=jawY*jawWeight*mouthOpening;':''}
        float rear=clamp((.3-position.x)/.9,0.,1.);
        ${isPectoral?'':'transformed.z+=sin(swimTime*7.5-position.x*7.)*rear*rear*(.018+swimEffort*.075);'}
        ${isBody?'':'transformed.z+=sin(swimTime*9.-position.x*8.)*finFlex*(.015+abs(position.y)*.11);'}
       `);
       // Interior tissue receives little direct light through the small aperture.
       // Vertex depth also masks specular light; diffuse vertex color alone does not.
       if(isBody)shader.fragmentShader=shader.fragmentShader.replace('#include <lights_fragment_end>',`#include <lights_fragment_end>
        float oralExposure=smoothstep(.03,.9,vColor.r);
        reflectedLight.directSpecular*=oralExposure;
        reflectedLight.indirectSpecular*=oralExposure;
       `);
      };mat.customProgramCacheKey=()=>`reef-${isBody?'body':isPectoral?'pectoral':'fin'}-oral-tissue-v4`;
     }
    }});
    const size=specs[s].size*(.83+Math.random()*.17);group.scale.setScalar(size);group.userData.note={title:names[s],description:descriptions[s]};scene.add(group);this.notes.push(group);
    let position=this.destination(s,i);const radius=size*(s==='tang'||s==='yellow'?.4:.31);for(let attempt=0;attempt<500;attempt++){if(this.free(position,radius)&&this.fish.every(o=>position.distanceTo(o.position)>radius+o.radius+.06))break;position=this.destination(s,i);}
    const fish:Fish={group,species:s,position,velocity:v(0,0,0),goal:position.clone(),radius:size*(s==='tang'||s==='yellow'?.4:.31),yaw:Math.random()*6.28,pitch:0,clock,effort,mouthOpening,until:0,phase:Math.random()*6.28,pectoral:group.children.filter(o=>o.name==='pectoral') as T.Group[],mouth:group.getObjectByName('mouth') as T.Group,eyes:group.getObjectByName('eyes') as T.Group,mode:'exploring'};group.position.copy(position);this.fish.push(fish);
   }
  }
 }
 private free(p:T.Vector3,r:number){return p.x>-4.7+r&&p.x<4.7-r&&p.z>-2.09+r&&p.z<2.09-r&&p.y>.3+r&&p.y<5.12-r&&this.obstacles.every(o=>p.distanceToSquared(o.center)>(o.radius+r)**2);}
 private clearSegment(a:T.Vector3,b:T.Vector3,r:number){
  if(!this.free(b,r))return false;const dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z,l=dx*dx+dy*dy+dz*dz;
  for(const o of this.obstacles){const radius=o.radius+r,c=o.center;
   if(c.x+radius<Math.min(a.x,b.x)||c.x-radius>Math.max(a.x,b.x)||c.y+radius<Math.min(a.y,b.y)||c.y-radius>Math.max(a.y,b.y)||c.z+radius<Math.min(a.z,b.z)||c.z-radius>Math.max(a.z,b.z))continue;
   const t=T.MathUtils.clamp(((c.x-a.x)*dx+(c.y-a.y)*dy+(c.z-a.z)*dz)/(l||1),0,1),x=a.x+dx*t-c.x,y=a.y+dy*t-c.y,z=a.z+dz*t-c.z;
   if(x*x+y*y+z*z<radius*radius)return false;
  }return true;
 }
 private destination(s:Species,index=0){
  for(let j=0;j<250;j++){
   let p:T.Vector3;
   if(s==='clown')p=this.hosts[0].clone().add(v((Math.random()-.5)*1.9,.15+Math.random()*1.15,(Math.random()-.3)*1.1));
   else if(s==='anthias')p=v(-2.2+(Math.random()-.5)*3,3.55+Math.random()*1.35,(Math.random()-.5)*3);
   else if(s==='chromis')p=v(2.8+(Math.random()-.5)*2.5,3.65+Math.random()*1.25,(Math.random()-.5)*3);
   else p=v((Math.random()-.5)*8.5,.8+Math.random()*3.6,(Math.random()-.5)*3.6);
   if(this.free(p,s==='tang'||s==='yellow'?.36:.2))return p;
  }
  return v((index%7-3)*.5,4.8,1.3);
 }
 feed(){
  if(this.foods.some(f=>f.alive))return false;
  this.foods.length=0;for(let i=0;i<36;i++)this.foods.push({position:v((Math.random()-.5)*3.2,4.95+Math.random()*.08,.8+(Math.random()-.5)*.9),alive:true,age:0});return true;
 }
 update(dt:number,night:boolean){
  this.clock+=dt;const now=this.clock;
  for(const food of this.foods)if(food.alive){food.age+=dt;const next=food.position.clone();next.y-=dt*.07;next.x+=Math.sin(now*1.1+food.age*.2)*dt*.025;if(this.free(next,.028))food.position.copy(next);if(food.age>42)food.alive=false;}
  for(let i=0;i<this.fish.length;i++){
   const f=this.fish[i],mouth=f.mouth.position.clone().multiplyScalar(f.group.scale.x).applyEuler(new T.Euler(0,f.yaw,f.pitch,'YXZ')).add(f.position);
   let target:Food|undefined,dist=Infinity;
   for(const food of this.foods)if(food.alive){const d=f.position.distanceToSquared(food.position);if(d<dist&&this.clearSegment(f.position,food.position,f.radius)){dist=d;target=food;}}
   if(target){f.goal.copy(target.position);f.mode='feeding';if(mouth.distanceTo(target.position)<.13){target.alive=false;this.eatCount++;f.until=now+.6;f.goal.copy(f.position).add(v(Math.cos(f.yaw)*.5,0,-Math.sin(f.yaw)*.5));}}
   else if(now>f.until||f.position.distanceTo(f.goal)<.2){
    for(let j=0;j<20;j++){const p=this.destination(f.species,i);if(this.clearSegment(f.position,p,f.radius)){f.goal.copy(p);break;}}
    f.until=now+2+Math.random()*5;f.mode=Math.random()<.22?'hovering':'exploring';
   }
   const desired=f.goal.clone().sub(f.position);let speed=(f.species==='tang'||f.species==='yellow'?.47:.34)*(night?.42:1);
   speed*=.75+.35*Math.sin(now*.83+f.phase);if(f.mode==='hovering')speed*=.2;if(target)speed=1.2+(Math.sin(now*6+f.phase)+1)*.35;
   desired.normalize();
   if(!target&&(f.species==='chromis'||f.species==='anthias')){const center=v(0,0,0),alignment=v(0,0,0);let neighbors=0;for(const other of this.fish)if(other!==f&&other.species===f.species&&f.position.distanceToSquared(other.position)<2.25){center.add(other.position);alignment.add(other.velocity);neighbors++;}if(neighbors){desired.addScaledVector(center.multiplyScalar(1/neighbors).sub(f.position),.08).addScaledVector(alignment.normalize(),.15);}}
   // Local separation and obstacle anticipation. Heading, rather than position,
   // turns gradually; a rejected swept step waits/replans instead of teleporting.
   for(const other of this.fish)if(other!==f){const d=f.position.clone().sub(other.position),l=d.length(),space=f.radius+other.radius+.22;if(l<space&&l>.0001)desired.addScaledVector(d,(space-l)/space/l*2.8);}
   for(const o of this.obstacles){const x=f.position.x-o.center.x,y=f.position.y-o.center.y,z=f.position.z-o.center.z,limit=o.radius+f.radius+.38,d2=x*x+y*y+z*z;if(d2<limit*limit&&d2>.000001){const d=Math.sqrt(d2),gain=(limit-d)/.38/d*2;desired.x+=x*gain;desired.y+=y*gain;desired.z+=z*gain;}}
   const wantedYaw=Math.atan2(-desired.z,desired.x),turn=Math.atan2(Math.sin(wantedYaw-f.yaw),Math.cos(wantedYaw-f.yaw));f.yaw+=T.MathUtils.clamp(turn,-dt*1.55,dt*1.55);
   const pitch=T.MathUtils.clamp(Math.atan2(desired.y,Math.hypot(desired.x,desired.z)),-.28,.28);f.pitch=T.MathUtils.damp(f.pitch,pitch,2.5,dt);
   speed*=Math.max(.17,Math.cos(turn));const forward=v(Math.cos(f.yaw)*Math.cos(f.pitch),Math.sin(f.pitch),-Math.sin(f.yaw)*Math.cos(f.pitch));f.velocity.lerp(forward.multiplyScalar(speed),1-Math.exp(-dt*3));
   const next=f.position.clone().addScaledVector(f.velocity,dt);
   const collision=this.fish.some(other=>other!==f&&next.distanceToSquared(other.position)<(f.radius+other.radius)**2);
   if(!collision&&this.clearSegment(f.position,next,f.radius))f.position.copy(next);else{f.velocity.multiplyScalar(.65);f.until=0;}
   f.group.position.copy(f.position);f.group.rotation.set(0,f.yaw,f.pitch,'YXZ');f.clock.value+=dt*(.52+f.velocity.length()*1.65);f.effort.value=T.MathUtils.damp(f.effort.value,f.velocity.length(),5,dt);
   for(let j=0;j<f.pectoral.length;j++){const p=f.pectoral[j];p.position.z=p.userData.restZ+bodyBend(p.position.x,f.clock.value,f.effort.value);p.rotation.y=Math.sign(p.userData.restZ)*(.24+.20*Math.sin(now*(7+f.effort.value*5)+f.phase+j));p.rotation.x=Math.cos(now*6+f.phase+j)*.055;}
   for(const gill of f.group.children)if(gill.name==='gill')gill.position.z=gill.userData.side*(.0005+.002*(1+Math.sin(now*5.5+f.phase)));
   f.mouth.scale.set(1,.24+.09*(1+Math.sin(now*5.5+f.phase))+(target?.alive?Math.max(0,1-Math.sqrt(dist))*Math.max(0,Math.sin(now*18))*1.35:0),1);f.mouthOpening.value=Math.max(0,f.mouth.scale.y-.24)*.85;
  }
  let n=0;for(const f of this.foods)if(f.alive){this.dummy.position.copy(f.position);this.dummy.updateMatrix();this.foodMesh.setMatrixAt(n++,this.dummy.matrix);}this.foodMesh.count=n;if(n)this.foodMesh.instanceMatrix.needsUpdate=true;
 }
 anatomySnapshot(){return this.fish.map(f=>({species:f.species,model:f.group.userData.model,phase:f.clock.value,pectoral:f.pectoral.map(p=>[p.rotation.x,p.rotation.y]),gills:f.group.children.filter(o=>o.name==='gill').map(g=>g.position.z),mouth:f.mouth.scale.y,mouthOpening:f.mouthOpening.value}));}
 snapshot(){return {fish:this.fish.length,bites:this.eatCount,food:this.foods.filter(f=>f.alive).length,positions:this.fish.map(f=>({species:f.species,x:f.position.x,y:f.position.y,z:f.position.z,mode:f.mode})),obstacleOverlaps:this.fish.filter(f=>!this.free(f.position,f.radius)).length,fishOverlaps:this.fish.reduce((n,f,i)=>n+this.fish.slice(i+1).filter(o=>f.position.distanceToSquared(o.position)<(f.radius+o.radius-.01)**2).length,0)};}
}
