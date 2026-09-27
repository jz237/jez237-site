import {marineBehavior} from './MarineBehavior.ts';
import {foodNote} from './ReefIdentification.ts';
import * as T from 'three';
import {sandHeight} from './ReefOptics.ts';
import metadata from './assets/fish/model-info.json';
import {bodyBend,turnFrame} from './MarineFinFlex.ts';
import {type MarineSpecies} from './MarineModels.ts';
import {type Obstacle} from './ReefScene.ts';

type Species=MarineSpecies;
const names:Record<Species,string>={tang:'Blue tang',semilarvatus:'Golden butterflyfish',clown:'Clownfish',anthias:'Anthias',chromis:'Blue-green chromis',gramma:'Royal gramma',goby:'Mandarin dragonet'};
const descriptions:Record<Species,string>={tang:'A laterally compressed body lets this blue tang turn between reef structures. It alternates fin-powered cruising with short tail-driven bursts, exploring the open channel and rock edges.',semilarvatus:'Chaetodon semilarvatus, the golden or bluecheek butterflyfish, has fine orange vertical stripes and a blue-gray patch behind the eye. Watch its independent fins, gentle cruising and pauses near the reef. This Red Sea species feeds on coral polyps and other small invertebrates; this mixed display is illustrative, not a coral-safe stocking recommendation.',clown:'The two clownfish stay close to their host anemone. They make short foraging trips into the water and return to shelter, rather than joining the open-water school.',anthias:'These female lyretail anthias hold feeding stations above the reef, facing the gently changing current. Watch for short prey-directed darts and returns, independent fin strokes, and quieter visits toward shelter at night.',chromis:'Blue-green chromis coordinate with nearby schoolmates above the reef: matching headings, drawing together and keeping space. Each fish has its own stroke-and-glide timing and can leave briefly for food before rejoining. At night they seek reachable water near reef shelter.',goby:'Synchiropus splendidus hovers close to reef rubble with fluttering pectoral fins, rests on its broad lower fins, and pecks at tiny crustaceans. Short moves and flexible turns interrupt its pauses. It is a dragonet, often called a mandarin goby; it does not sift mouthfuls of sand. The tiny food items here illustrate prey capture, not a living copepod population.',gramma:'The royal gramma keeps a persistent shelter near the reef. It makes short exploratory forays, pauses nearby and retreats when a larger fish approaches. Feeding stays local to its home instead of taking it on laps of the tank.'};
const specs:Record<Species,{h:number;w:number;size:number;color:string}>={tang:{h:.32,w:.095,size:.83,color:'#285deb'},semilarvatus:{h:.35,w:.09,size:.72,color:'#ffd800'},clown:{h:.21,w:.12,size:.4664,color:'#f68210'},anthias:{h:.16,w:.075,size:.47,color:'#f8783c'},chromis:{h:.19,w:.085,size:.41,color:'#59bde0'},gramma:{h:.16,w:.07,size:.49,color:'#b951df'},goby:{h:.19,w:.133,size:.59,color:'#ef7623'}};
const v=(x:number,y:number,z=0)=>new T.Vector3(x,y,z);
type Fish={group:T.Group;species:Species;position:T.Vector3;velocity:T.Vector3;goal:T.Vector3;radius:number;yaw:number;yawVelocity:number;pitch:number;clock:{value:number};effort:{value:number};waveGain:{value:number};turnBend:{value:number};mouthOpening:{value:number};gillOpening:{value:number};respiration:number;until:number;phase:number;pectoral:T.Group[];mouth:T.Group;eyes:T.Group;mode:string;progressPosition:T.Vector3;progressAt:number;blockedTime:number;recoverUntil:number;hostLeg:number;hostHold:number;hostVisits:number;clearance:number;home:T.Vector3;gobyCycle:number;pecks:number;individuality:number;drive:number;strokeUntil:number;coasting:boolean;tailRest:number;feedingUntil:number;energy:number;hunger:number;memory:T.Vector3|null;shelter:T.Vector3;social:T.Vector3;holdUntil:number;food:Food|null};
export type Food={position:T.Vector3;alive:boolean;age:number;sinkRate?:number};
export class ReefFish{
 readonly fish:Fish[]=[];readonly foods:Food[]=[];readonly notes:T.Object3D[]=[];private clock=0;private shoalGoal=v(2.5,4.15,.2);private nextShoalMove=0;private isNight=false;private templates=new Map<Species,T.Group>();private eatCount=0;private foodMesh:T.InstancedMesh;private dummy=new T.Object3D();
 constructor(private scene:T.Scene,private obstacles:Obstacle[],private hosts:T.Vector3[],templates:Map<Species,T.Group>,private hostScale=1){
  this.templates=templates;
  this.foodMesh=new T.InstancedMesh(new T.SphereGeometry(.022,6,4),new T.MeshStandardMaterial({color:'#cf9d67',roughness:.8}),48);this.foodMesh.count=0;this.foodMesh.name="Food morsels";this.foodMesh.userData.note=foodNote;this.notes.push(this.foodMesh);scene.add(this.foodMesh);
  for(const [s,count] of [['tang',1],['semilarvatus',1],['clown',2],['anthias',7],['chromis',8],['gramma',1],['goby',1]] as [Species,number][]){
   for(let i=0;i<count;i++){
    const group=this.templates.get(s)!.clone(true),clock={value:Math.random()*7},effort={value:.5},waveGain={value:s==='goby'?.2:1},turnBend={value:0},mouthOpening={value:0},gillOpening={value:0};
    // Parts with the same imported material and deformation share one material
    // within this animal. Uniforms remain independent between inhabitants;
    // transparent meshes and their depth ordering remain separate draws.
    const materials=new Map<string,T.MeshStandardMaterial>();
    group.traverse(o=>{if(o instanceof T.Mesh){
     const source=o.material as T.MeshStandardMaterial,key=[source.userData.marineSourceMaterial??source.uuid,o.name,Boolean(o.userData.pectoral),o.userData.side??0].join(':');
     const shared=materials.get(key);if(shared){o.material=shared;return;}
     const mat=source.clone();o.material=mat;materials.set(key,mat);
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
        float slope=(2.*tail*dTail*sin(swimTime*7.5-position.x*7.)-7.*tail*tail*cos(swimTime*7.5-position.x*7.))*(.018+swimEffort*.075)*waveGain;
        ${isPectoral?'slope=0.;':''}
        vec3 tissueSlope=vec3(slope,0.,0.);
        ${isBody?'':`float finPhase=swimTime*9.-position.x*8.,finAmplitude=.015+abs(position.y)*.11;
        tissueSlope+=vec3(-8.*cos(finPhase)*finFlex*finAmplitude,sin(finPhase)*finFlex*.11*sign(position.y),0.)+sin(finPhase)*finAmplitude*finGradient;`}
        ${isBody?`float jawT=clamp((position.x-.43)/.07,0.,1.),jawWeight=jawT*jawT*(3.-2.*jawT);
        float jawSlope=position.x>.43&&position.x<.5?6.*jawT*(1.-jawT)/.07:0.;
        float jawY=position.y-mouthY,jawQ=jawY/jawRadius,jawFalloff=exp(-jawQ*jawQ);
        objectNormal.y/=1.+jawWeight*mouthOpening*jawFalloff*(1.-2.*jawQ*jawQ);
        objectNormal.x-=jawY*jawSlope*mouthOpening*jawFalloff*objectNormal.y;`:''}
        objectNormal.z/=max(.25,1.+tissueSlope.z);objectNormal.xy-=tissueSlope.xy*objectNormal.z;
        ${!isPectoral?`float turnAngle=max(0.,.18-position.x)*turnBend;
        float turnZ=position.z+tail*tail*sin(swimTime*7.5-position.x*7.)*(.018+swimEffort*.075)*waveGain${isBody?'':'+sin(finPhase)*finFlex*finAmplitude'};
        if(position.x<.18&&abs(turnBend)>.0001){objectNormal.x/=max(.45,1.-turnBend*turnZ);objectNormal.xz=mat2(cos(turnAngle),-sin(turnAngle),sin(turnAngle),cos(turnAngle))*objectNormal.xz;}`:''}
        objectNormal=normalize(objectNormal);`);
       shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
        ${isBody?'transformed.y+=jawY*jawWeight*mouthOpening*jawFalloff;':''}
        float rear=clamp((.3-position.x)/.9,0.,1.);
        ${isPectoral?'':'transformed.z+=rear*rear*sin(swimTime*7.5-position.x*7.)*(.018+swimEffort*.075)*waveGain;'}
        ${isBody?'':'transformed.z+=sin(swimTime*9.-position.x*8.)*finFlex*(.015+abs(position.y)*.11);'}
        ${!isPectoral?`if(position.x<.18&&abs(turnBend)>.0001){float turnSin=sin(turnAngle),turnCos=cos(turnAngle),crossZ=transformed.z;transformed.x=.18-turnSin/turnBend+turnSin*crossZ;transformed.z=(1.-turnCos)/turnBend+turnCos*crossZ;}`:''}
       `);
       // Interior tissue receives little direct light through the small aperture.
       // Vertex depth also masks specular light; diffuse vertex color alone does not.
       if(isBody)shader.fragmentShader=shader.fragmentShader.replace('#include <lights_fragment_end>',`#include <lights_fragment_end>
        float oralExposure=smoothstep(.03,.9,vColor.r);
        reflectedLight.directSpecular*=oralExposure;
        reflectedLight.indirectSpecular*=oralExposure;
       `);
      };mat.customProgramCacheKey=()=>`reef-${isBody?'body':isPectoral?'pectoral':'fin'}-curved-localized-respiration-flex-v8`;
     }
    }});
    const size=specs[s].size*(.83+Math.random()*.17);group.scale.setScalar(size);group.userData.note={title:names[s],description:descriptions[s]};scene.add(group);this.notes.push(group);
    let position=this.destination(s,i);const radius=size*(s==='goby'?.87:s==='tang'||s==='semilarvatus'?.4:.31),clearance=s==='goby'?size*.20:radius;for(let attempt=0;attempt<500;attempt++){if(this.free(position,radius,clearance)&&this.fish.every(o=>position.distanceTo(o.position)>radius+o.radius+.06))break;position=this.destination(s,i);}
    const fish:Fish={group,species:s,position,velocity:v(0,0,0),goal:position.clone(),radius,clearance,home:position.clone(),gobyCycle:0,pecks:0,yaw:Math.random()*6.28,yawVelocity:0,pitch:0,clock,effort,waveGain,turnBend,mouthOpening,gillOpening,respiration:Math.random()*Math.PI*2,until:0,phase:Math.random()*6.28,pectoral:group.children.filter(o=>o.name==='pectoral') as T.Group[],mouth:group.getObjectByName('mouth') as T.Group,eyes:group.getObjectByName('eyes') as T.Group,mode:'exploring',progressPosition:position.clone(),progressAt:0,blockedTime:0,recoverUntil:0,hostLeg:i%3,hostHold:0,hostVisits:0,individuality:.88+Math.random()*.24,drive:Math.random(),strokeUntil:Math.random()*3,coasting:false,tailRest:1,feedingUntil:0,energy:.72+Math.random()*.25,hunger:.55+Math.random()*.3,memory:null,shelter:position.clone(),social:v(0,0,0),holdUntil:0,food:null};group.position.copy(position);this.fish.push(fish);
    if(s==='gramma'){fish.home.copy(this.reefPatch(fish,2.1)??position);fish.shelter.copy(fish.home);fish.position.copy(fish.home);fish.group.position.copy(fish.position);fish.goal.copy(fish.home);fish.progressPosition.copy(fish.home);}
   }
  }
 }
 private free(p:T.Vector3,r:number,clearance=r){return p.x>-4.7+r&&p.x<4.7-r&&p.z>-2.09+r&&p.z<2.09-r&&p.y>Math.max(clearance===r?.3:0,sandHeight(p.x,p.z)+(clearance===r?.035:.003))+clearance&&p.y<5.12-r&&this.obstacles.every(o=>p.distanceToSquared(o.center)>(o.radius+r)**2);}
 private clearSegment(a:T.Vector3,b:T.Vector3,r:number,clearance=r){
  if(!this.free(b,r,clearance))return false;const dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z,l=dx*dx+dy*dy+dz*dz;
  // Ground specialists need the same small margin along the route as at its
  // endpoint; the open-water margin otherwise rejects their final settling.
  for(let i=1;i<8;i++){const t=i/8;if(a.y+dy*t<=sandHeight(a.x+dx*t,a.z+dz*t)+clearance+(clearance===r?.035:.003))return false;}
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
   if(this.free(p,s==='goby'?.45:s==='tang'||s==='semilarvatus'?.36:.2,s==='goby'?.154:s==='tang'||s==='semilarvatus'?.36:.2))return p;
  }
  return v((index%7-3)*.5,4.8,1.3);
 }
 /** Choose visible, reachable water beside a reef face, never inside a proxy. */
 private reefPatch(f:Fish,maxHeight=4.3){
  let chosen:T.Vector3|undefined,best=Infinity;
  for(let j=0;j<50;j++){
   const o=this.obstacles.length?this.obstacles[Math.floor(Math.random()*this.obstacles.length)]:null;
   if(!o)break;
   const a=Math.random()*Math.PI*2,margin=o.radius+f.radius+.15+Math.random()*.4;
   const p=o.center.clone().add(v(Math.cos(a)*margin,(Math.random()-.5)*margin,-Math.sin(a)*margin));
   if(p.y>maxHeight||p.y<.55||!this.clearSegment(f.position,p,f.radius)||this.fish.some(other=>other!==f&&p.distanceTo(other.position)<f.radius+other.radius+.08))continue;
   const score=p.distanceToSquared(f.position)+Math.random()*.8;
   if(score<best){best=score;chosen=p;}
  }
  return chosen;
 }
 private planSwim(f:Fish,index:number,recover:boolean){
  if(f.species==='clown'&&!recover&&this.planHostVisit(f))return;
  let chosen:T.Vector3|undefined;
  f.holdUntil=0;
  if(!recover){
   if(this.isNight&&(f.species==='tang'||f.species==='anthias'||f.species==='chromis')){
    if(this.clearSegment(f.position,f.shelter,f.radius))chosen=f.shelter.clone();
    else{chosen=this.reefPatch(f,3.4);if(chosen)f.shelter.copy(chosen);}
   }
   if(this.isNight&&f.species==='gramma'&&this.clearSegment(f.position,f.shelter,f.radius))chosen=f.shelter.clone();
   if(!chosen&&(f.species==='semilarvatus'||(f.species==='tang'&&Math.random()<.25)))chosen=this.reefPatch(f);
   for(let j=0;j<32&&!chosen;j++){
    let p:T.Vector3;
    if(f.species==='gramma'){
     // A persistent shelter, with short independent excursions and returns.
     const returning=f.position.distanceTo(f.shelter)>.95||Math.random()<.42;
     p=f.shelter.clone().add(v((Math.random()-.5)*(returning?.35:2),(Math.random()-.4)*(returning?.2:1.2),(Math.random()-.5)*(returning?.35:1.7)));
    }else if(f.species==='anthias'){
     p=f.home.clone().add(v((Math.random()-.5)*1.7,(Math.random()-.5)*.9,(Math.random()-.5)*1.5));
    }else if(f.species==='chromis'){
     p=this.shoalGoal.clone().add(v(Math.sin(f.phase+j)*.65,(Math.random()-.5)*.55,Math.cos(f.phase+j)*.55));
    }else if(f.memory&&f.hunger>.45&&Math.random()<.18)p=f.memory.clone().add(v((Math.random()-.5)*.8,0,(Math.random()-.5)*.8));
    else p=this.destination(f.species,index);
    if(p.distanceToSquared(f.position)>.09&&this.clearSegment(f.position,p,f.radius))chosen=p;
   }
  }
  if(!chosen){let best=-Infinity;
   for(const reach of [.45,.85,1.4])for(let j=0;j<16;j++){
    const angle=f.yaw+j*Math.PI/8,p=f.position.clone().add(v(Math.cos(angle)*reach,Math.sin(j*2.4+f.phase)*reach*.22,-Math.sin(angle)*reach));
    if(!this.clearSegment(f.position,p,f.radius)||this.fish.some(o=>o!==f&&p.distanceToSquared(o.position)<(f.radius+o.radius+.06)**2))continue;
    const score=reach+.3*Math.cos(angle-f.yaw)+.08*Math.sin(j+f.phase);
    if(score>best){best=score;chosen=p;}
   }
  }
  if(chosen)f.goal.copy(chosen);
  const refuge=this.isNight&&f.species!=='semilarvatus';
  const travelTime=refuge?Math.min(55,10+f.position.distanceTo(f.goal)/(f.group.scale.x*marineBehavior[f.species].cruiseBL[0]*marineBehavior[f.species].night*.7)):5+Math.random()*7;
  f.until=this.clock+(recover?3:travelTime);
  f.mode=recover?'exploring':refuge?'seeking shelter':f.species==='gramma'&&f.goal.distanceTo(f.shelter)<.4?'returning to shelter':'cruising';
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
  if(dt<=0)return;
  this.clock+=dt;const now=this.clock;
  if(night!==this.isNight){
   this.isNight=night;
   for(const f of this.fish){
    f.until=0;f.holdUntil=0;f.hostHold=0;
    if(night&&(f.species==='tang'||f.species==='anthias'||f.species==='chromis')){
     f.shelter.copy(this.reefPatch(f,3.4)??f.position);f.goal.copy(f.shelter);
    }
    if(night&&f.species==='gramma')f.goal.copy(f.shelter);
   }
  }
  if(now>this.nextShoalMove){
   this.shoalGoal.copy(this.destination('chromis'));this.nextShoalMove=now+7+Math.random()*7;
  }
  for(const food of this.foods)if(food.alive){food.age+=dt;const next=food.position.clone();next.y-=dt*(food.sinkRate??.07);next.x+=Math.sin(now*1.1+food.age*.2)*dt*(food.sinkRate?.004:.025);if(this.free(next,.028))food.position.copy(next);if(food.age>42)food.alive=false;}
  for(let i=0;i<this.fish.length;i++){
   const f=this.fish[i],profile=marineBehavior[f.species],size=f.group.scale.x;
   f.hunger=Math.min(1,f.hunger+dt*.0012);
   f.energy=T.MathUtils.clamp(f.energy+dt*(f.coasting||f.holdUntil>now?.012:.003)-dt*Math.max(0,f.velocity.length()/size-1)*.018,.25,1);
   if(f.species==='goby'){this.updateGoby(f,dt,night);continue;}
   const mouth=f.mouth.position.clone().multiplyScalar(size).applyEuler(new T.Euler(0,f.yaw,f.pitch,'YXZ')).add(f.position);
   let target:Food|undefined,dist=Infinity;
   // Perception is local and a selected prey item persists while reachable.
   // Recovery and an actual bite have priority over selecting another pellet.
   if(now>=f.recoverUntil&&now>=f.feedingUntil&&f.hunger>.18)for(const food of this.foods)if(food.alive){
    const d=f.position.distanceToSquared(food.position);
    if(d>(profile.perceptionBL*size)**2||(f.species==='clown'&&food.position.distanceToSquared(this.hosts[0])>5)||(f.species==='gramma'&&food.position.distanceTo(f.shelter)>1.7))continue;
    const occupied=this.fish.some(other=>other!==f&&other.food===food);
    const score=d*(food===f.food?.55:1)*(occupied?1.8:1);
    if(score<dist&&this.clearSegment(f.position,food.position,f.radius)){dist=score;target=food;}
   }
   f.food=target??null;
   if(target){
    // Seek the prey itself; capture is tested at the articulated mouth.
    // Offsetting a waypoint along an unclamped 3D ray strands the fish below
    // steep prey because its real body stays within a natural pitch limit.
    f.goal.copy(target.position);
    f.mode='feeding';f.holdUntil=0;
    if(mouth.distanceTo(target.position)<Math.max(.065,.16*size)){
     target.alive=false;this.eatCount++;f.hunger=Math.max(0,f.hunger-.13);f.energy=Math.min(1,f.energy+.055);f.memory=target.position.clone();
     f.feedingUntil=now+.4+Math.random()*.3;f.holdUntil=f.feedingUntil;f.until=f.feedingUntil;f.goal.copy(f.position);f.mode='inspecting reef';target=undefined;f.food=null;
    }
   }else if(now>=f.feedingUntil){
    const arrived=f.position.distanceTo(f.goal)<(f.species==='clown'?.14:.19);
    if(f.species==='clown'&&arrived&&!f.hostHold){f.hostHold=now+.3+Math.random()*.75;f.until=f.hostHold;f.hostVisits++;f.mode='sheltering';}
    if(f.species!=='clown'&&arrived&&!f.holdUntil&&now>=f.recoverUntil&&Math.random()<(night&&f.species!=='semilarvatus'?1:profile.restChance)){
     f.holdUntil=now+(night&&f.species!=='semilarvatus'?20+Math.random()*25:profile.rest[0]+Math.random()*(profile.rest[1]-profile.rest[0]));
     f.until=f.holdUntil;f.goal.copy(f.position);
     f.mode=night&&f.species!=='semilarvatus'?'resting near shelter':f.species==='anthias'?'holding feeding station':f.species==='gramma'?'resting near shelter':'inspecting reef';
    }
    if(now>f.until||(arrived&&f.species!=='clown'&&!f.holdUntil))this.planSwim(f,i,now<f.recoverUntil);
   }
   const holding=f.holdUntil>now||f.mode==='sheltering';
   // An intentional inspection must not trip the blocked-path watchdog.
   if(holding||f.position.distanceToSquared(f.progressPosition)>.025){f.progressPosition.copy(f.position);f.progressAt=now;}
   else if(now>=f.recoverUntil&&now-f.progressAt>(night&&f.species!=='semilarvatus'?7:2.4)){f.recoverUntil=now+4;this.planSwim(f,i,true);f.progressAt=now;target=undefined;f.food=null;}
   if(now>f.strokeUntil){
    f.coasting=!f.coasting;const interval=f.coasting?profile.coast:profile.stroke;
    f.strokeUntil=now+(interval[0]+Math.random()*(interval[1]-interval[0]))/f.individuality;f.drive=Math.random();
   }
   const desired=f.goal.clone().sub(f.position),distance=desired.length();
   const cruise=profile.cruiseBL[0]+(profile.cruiseBL[1]-profile.cruiseBL[0])*(.55*f.drive+.45*(.5+.5*Math.sin(now*.57+f.phase)));
   let speed=size*cruise*f.individuality*(night?profile.night:1)*(.72+.28*f.energy)*(f.coasting?.68:1);
   if(target)speed=size*profile.burstBL*f.individuality*(.72+.28*f.energy)*Math.min(1,.28+distance/(size*.85));
   if(!target){
    if(night&&f.mode==='seeking shelter')speed=Math.max(speed,size*.5*f.individuality);
    speed*=Math.min(1,distance/(size*.6));if(holding)speed=0;
   }
   if(f.species==='clown'&&!target){
    const dart=f.hostLeg===1?3.6:f.hostLeg===0?2.5:1.65;
    speed=size*dart*f.individuality*(night?profile.night:1)*(.83+.17*Math.sin(now*2.1+f.phase));
    speed*=Math.min(1,distance/.28);if(holding)speed=0;
   }
   desired.normalize();
   if(holding)desired.set(Math.cos(f.yaw),0,-Math.sin(f.yaw));
   if(f.species==='anthias'&&holding){
    // Station holding still needs propulsive fins. Face the gently varying
    // local current instead of constantly orbiting or tracing tank-wide laps.
    const currentYaw=.22*Math.sin(now*.12+f.home.z*.5);
    desired.set(Math.cos(currentYaw),0,-Math.sin(currentYaw));
   }
   if(!target&&!holding&&!night&&profile.schooling){
    const center=v(0,0,0),alignment=v(0,0,0);let neighbors=0;
    const perception=size*(profile.schooling==='shoal'?5:3.5);
    for(const other of this.fish)if(other!==f&&other.species===f.species&&f.position.distanceToSquared(other.position)<perception*perception){center.add(other.position);alignment.add(other.velocity);neighbors++;}
    const social=v(0,0,0);
    if(neighbors){
     social.addScaledVector(center.multiplyScalar(1/neighbors).sub(f.position).clampLength(0,1),profile.schooling==='shoal'?.4:.16);
     if(alignment.lengthSq()>.001)social.addScaledVector(alignment.normalize(),profile.schooling==='shoal'?1.2:.22);
    }
    f.social.lerp(social,1-Math.exp(-dt*2.8));desired.add(f.social);
   }
   // Shelter-associated fish retreat when a larger neighbor enters their space.
   if(f.species==='gramma'&&!target&&now>=f.recoverUntil&&this.fish.some(o=>o!==f&&o.radius>f.radius&&o.position.distanceTo(f.position)<f.radius+o.radius+.35)&&this.clearSegment(f.position,f.shelter,f.radius)){
    f.goal.copy(f.shelter);f.holdUntil=0;f.until=now+3;f.mode='returning to shelter';desired.copy(f.goal).sub(f.position).normalize();speed=size*profile.burstBL*Math.min(1,f.position.distanceTo(f.shelter)/.35);
   }
   for(const other of this.fish)if(other!==f){const d=f.position.clone().sub(other.position),l=d.length(),space=f.radius+other.radius+.22;if(l<space&&l>.0001)desired.addScaledVector(d,(space-l)/space/l*2.8);}
   const avoidance=v(0,0,0);
   for(const o of this.obstacles){const x=f.position.x-o.center.x,y=f.position.y-o.center.y,z=f.position.z-o.center.z,limit=o.radius+f.radius+.38,d2=x*x+y*y+z*z;if(d2<limit*limit&&d2>.000001){const d=Math.sqrt(d2),gain=(limit-d)/.38/d*2;avoidance.x+=x*gain;avoidance.y+=y*gain;avoidance.z+=z*gain;}}
   // Honor the validated escape route: soft rock repulsion can otherwise push
   // a fish back into glass indefinitely. Swept collision checks still apply.
   if(now>=f.recoverUntil)desired.add(avoidance.clampLength(0,f.species==='clown'?.28:.65));
   const wantedYaw=desired.lengthSq()>.00001?Math.atan2(-desired.z,desired.x):f.yaw,turn=Math.atan2(Math.sin(wantedYaw-f.yaw),Math.cos(wantedYaw-f.yaw));
   this.flexTurn(f,turn,dt,profile.turnRate,profile.curve);
   const pitch=T.MathUtils.clamp(Math.atan2(desired.y,Math.hypot(desired.x,desired.z)),-.28,.28);f.pitch=T.MathUtils.damp(f.pitch,pitch,2.5,dt);
   speed*=Math.max(.17,Math.cos(turn));const forward=v(Math.cos(f.yaw)*Math.cos(f.pitch),Math.sin(f.pitch),-Math.sin(f.yaw)*Math.cos(f.pitch)).multiplyScalar(speed);
   if(night&&!target&&!holding&&f.mode==='seeking shelter'){
    // A refuge can be well below the feeding station. Paired-fin descent
    // remains gentle while the body stays upright; pitch alone at night cruise
    // speed would take minutes and repeatedly abandon an otherwise clear route.
    forward.y=T.MathUtils.clamp((f.goal.y-f.position.y)*1.5,-size*.35,size*.35);
   }
   if(target){
    // Aim the head at prey, but brake against the actual mouth position. A
    // mandatory forward floor makes a long-snouted fish circle a pellet forever.
    // Small paired-fin trims permit upright rises and gentle back-paddling when
    // close; every resulting displacement still passes the ordinary swept tests.
    const mouthNow=f.mouth.position.clone().multiplyScalar(size).applyEuler(new T.Euler(0,f.yaw,f.pitch,'YXZ')).add(f.position);
    const gap=target.position.clone().sub(mouthNow),along=gap.x*Math.cos(f.yaw)-gap.z*Math.sin(f.yaw);
    const advance=T.MathUtils.clamp(along*3,-size*.18,speed)*Math.max(0,Math.cos(turn));
    forward.set(Math.cos(f.yaw)*advance,T.MathUtils.clamp(gap.y*2.4,-size*.5,size*.5),-Math.sin(f.yaw)*advance);
   }
   f.velocity.lerp(forward,1-Math.exp(-dt*(target?7:f.species==='clown'?7:holding?6:f.coasting?2:4)));
   const next=f.position.clone().addScaledVector(f.velocity,dt);
   const collision=this.fish.some(other=>other!==f&&next.distanceToSquared(other.position)<(f.radius+other.radius)**2);
   if(!collision&&this.clearSegment(f.position,next,f.radius)){f.position.copy(next);f.blockedTime=Math.max(0,f.blockedTime-dt);}else{f.velocity.multiplyScalar(.65);f.blockedTime+=dt;
    if(f.blockedTime>.65&&now>f.recoverUntil){f.recoverUntil=now+3;this.planSwim(f,i,true);f.blockedTime=0;}
   }
   const swimming=f.velocity.length()/size,thrust=target?1:holding?.3:f.coasting?.22:.65;
   f.tailRest=T.MathUtils.damp(f.tailRest,thrust,3.5,dt);
   f.group.position.copy(f.position);f.group.rotation.set(0,f.yaw,f.pitch,'YXZ');
   f.clock.value+=dt*2*Math.PI*profile.tailHz*f.individuality*(.48+f.tailRest*.52+Math.min(2,swimming)*.26)/7.5;
   f.effort.value=T.MathUtils.damp(f.effort.value,Math.min(1.7,swimming*.65),5,dt);
   f.waveGain.value=T.MathUtils.damp(f.waveGain.value,profile.wave*(.38+.72*f.tailRest),5,dt);
   for(let j=0;j<f.pectoral.length;j++){
    const p=f.pectoral[j],angle=this.attachFin(f,p),pelvic=Boolean(p.userData.pelvic),side=Math.sign(p.userData.restZ);
    p.userData.flutterTime=(p.userData.flutterTime??f.phase+j*.87)+dt*2*Math.PI*profile.finHz*f.individuality*(pelvic?.4:1+swimming*.18)*(1+j*.035);
    const phase=p.userData.flutterTime,amplitude=pelvic?.055:.13+.065*(holding?1:f.tailRest);
    p.rotation.y=angle+side*((pelvic?.14:.24)+amplitude*Math.sin(phase));p.rotation.x=Math.cos(phase*.91)* (pelvic?.025:.055);
   }
   const base=f.species==='tang'||f.species==='semilarvatus'?.88:1.12;
   f.respiration+=dt*2*Math.PI*(base*(night?.78:1)+Math.min(f.effort.value,1.7)*.20)*(.93+.07*Math.sin(f.phase));
   this.breathe(f,target?.alive?Math.max(0,1-mouth.distanceTo(target.position))*Math.max(0,Math.sin(now*18))*1.35:0);
  }
  let n=0;for(const f of this.foods)if(f.alive){this.dummy.position.copy(f.position);this.dummy.updateMatrix();this.foodMesh.setMatrixAt(n++,this.dummy.matrix);}this.foodMesh.count=n;if(n)this.foodMesh.instanceMatrix.needsUpdate=true;
 }
 private updateGoby(f:Fish,dt:number,night:boolean){
  const now=this.clock,size=f.group.scale.x,stance=f.clearance+.006,profile=marineBehavior.goby;
  const clear=(p:T.Vector3)=>this.clearSegment(f.position,p,f.radius,f.clearance)&&this.fish.every(o=>o===f||p.distanceToSquared(o.position)>(f.radius+o.radius+.025)**2);
  let target:Food|undefined,best=Infinity;
  if(now>=f.recoverUntil&&now>=f.feedingUntil&&f.hunger>.18)for(const food of this.foods)if(food.alive&&food.position.y-sandHeight(food.position.x,food.position.z)<.62){
   const delta=food.position.clone().sub(f.position);delta.y=0;const d=delta.lengthSq();if(d>(size*profile.perceptionBL)**2||d>=best)continue;
   const aim=delta.lengthSq()>.00001?delta.normalize():v(Math.cos(f.yaw),0,-Math.sin(f.yaw));
   const p=food.position.clone().addScaledVector(aim,-metadata.goby.mouth[0]*size);
   p.y=Math.max(sandHeight(p.x,p.z)+stance,food.position.y-metadata.goby.mouth[1]*size);
   if(clear(p)){best=d;target=food;f.goal.copy(p);}
  }
  f.food=target??null;if(target){f.mode='feeding';f.gobyCycle=0;f.until=now+1.2;}
  const arrived=Math.hypot(f.position.x-f.goal.x,f.position.z-f.goal.z)<.08;
  if(!target&&arrived&&f.mode==='bottom hover'){
   f.mode=night||Math.random()<.3?'resting':'pecking';f.gobyCycle=now;f.until=now+(night?9:4.5)+Math.random()*(night?8:4);f.goal.copy(f.position);
   if(f.mode==='pecking')f.pecks++;
  }
  // Commit to a short route or a rest. A blocked prey item cannot perpetually
  // replace the escape waypoint or make the fish quiver at a rock boundary.
  if(f.position.distanceToSquared(f.progressPosition)>.006){f.progressPosition.copy(f.position);f.progressAt=now;}
  else if(target&&now-f.progressAt>2.5){target=undefined;f.recoverUntil=now+3;f.until=0;f.progressAt=now;}
  const startled=f.mode!=='bottom hover'&&now>f.recoverUntil&&this.fish.some(o=>o!==f&&o.position.distanceTo(f.position)<f.radius+o.radius+.12);
  if(!target&&(now>f.until||startled)){
   let chosen:T.Vector3|undefined,bestShelter=Infinity;
   for(let i=0;i<48;i++){
    const a=i<32?f.yaw+(Math.random()-.5)*2.7:Math.random()*Math.PI*2;
    const reach=now<f.recoverUntil?.6+Math.random()*.6:.18+Math.random()*.52;
    const p=f.position.clone().add(v(Math.cos(a)*reach,0,-Math.sin(a)*reach));
    p.y=sandHeight(p.x,p.z)+stance+.045;
    if(p.distanceToSquared(f.home)>12||!clear(p))continue;
    // Favor rubble edges, while retaining escape routes if the open bed is the
    // only accessible ground. Never force the animal through a rock proxy.
    const shelter=this.obstacles.length?Math.min(...this.obstacles.map(o=>Math.max(0,p.distanceTo(o.center)-o.radius))):0;
    const score=shelter+Math.random()*.35;if(score<bestShelter){chosen=p;bestShelter=score;}
   }
   if(chosen){f.goal.copy(chosen);f.mode='bottom hover';f.until=now+6+Math.random()*3;f.gobyCycle=now;}
   else {f.mode='resting';f.until=now+1+Math.random()*2;}
   if(startled)f.recoverUntil=now+3;
  }
  // A local patch can receive another pick without a full relocation. Night
  // rests remain quiet, and actual pellets still require mouth contact.
  if(!target&&!night&&f.mode==='resting'&&now-f.gobyCycle>2.0+(Math.sin(f.phase+f.pecks)*.5+.5)*2.2&&now<f.until-.8){
   f.mode='pecking';f.gobyCycle=now;f.pecks++;
  }
  const stroke=Math.pow(Math.max(0,Math.sin((now-f.gobyCycle)*3.8+f.phase)),2);
  let wantedYaw=f.yaw,wantedPitch=0,speed=0,peck=0;
  if(f.mode==='bottom hover'||target){
   const delta=f.goal.clone().sub(f.position);if(target)delta.copy(target.position).sub(f.position);
   wantedYaw=Math.atan2(-delta.z,delta.x);
   speed=size*(target?.72:now<f.recoverUntil?profile.burstBL:profile.cruiseBL[0]+(profile.cruiseBL[1]-profile.cruiseBL[0])*stroke)*f.individuality*(night?profile.night:1);
   speed*=Math.min(1,f.position.distanceTo(f.goal)/.15);
   if(target)wantedPitch=T.MathUtils.clamp(Math.atan2(delta.y,Math.hypot(delta.x,delta.z)),-.25,.18);
  }else if(f.mode==='pecking'){
   // One small substrate-directed pick, followed by a quiet inspection pause.
   // Mandarin dragonets pick microfauna; no sleeper-goby sand/gill stream.
   const t=now-f.gobyCycle;peck=Math.max(0,Math.sin(Math.PI*Math.min(1,t/.65)));
   wantedPitch=-.22*peck;
   if(t>1.0){f.mode='resting';f.gobyCycle=now;}
  }
  const turn=Math.atan2(Math.sin(wantedYaw-f.yaw),Math.cos(wantedYaw-f.yaw));
  this.flexTurn(f,turn,dt,1.65,1.6);f.pitch=T.MathUtils.damp(f.pitch,wantedPitch,6,dt);
  speed*=Math.max(0,Math.cos(turn));const forward=v(Math.cos(f.yaw)*speed,0,-Math.sin(f.yaw)*speed);f.velocity.lerp(forward,1-Math.exp(-dt*7));
  const next=f.position.clone().addScaledVector(f.velocity,dt);
  let bed=sandHeight(next.x,next.z);
  for(const along of [-.78,-.4,0,.25,.5])for(const side of [-.23,.23]){
   const bent=turnFrame(along,side+bodyBend(along,f.clock.value,f.effort.value,f.waveGain.value),f.turnBend.value);
   const x=next.x+(Math.cos(f.yaw)*bent.x+Math.sin(f.yaw)*bent.z)*size,z=next.z+(-Math.sin(f.yaw)*bent.x+Math.cos(f.yaw)*bent.z)*size;
   // The raised tail and nose do not need the full belly clearance. Applying
   // one height to the entire footprint made rests hover above nearby dunes.
   const raisedEnd=Math.max(0,Math.abs(along)-.25)*size*.19;
   bed=Math.max(bed,sandHeight(x,z)-raisedEnd);
  }
  const floor=bed+stance,desiredHeight=target?Math.max(floor,f.goal.y):floor+(f.mode==='bottom hover'?.085:0);
  next.y=T.MathUtils.damp(f.position.y,desiredHeight,8,dt);
  if(clear(next)){f.position.copy(next);f.blockedTime=0;}else{f.velocity.multiplyScalar(.4);f.blockedTime+=dt;if(f.blockedTime>.7){f.until=0;f.recoverUntil=now+3;f.mode='resting';f.blockedTime=0;}}
  f.coasting=f.mode==='resting'||f.mode==='pecking';
  const moving=f.velocity.length();
  f.group.position.copy(f.position);f.group.rotation.set(0,f.yaw,f.pitch,'YXZ');f.clock.value+=dt*(.32+moving*2.5);f.effort.value=T.MathUtils.damp(f.effort.value,moving,5,dt);
  // Pectorals supply ordinary hovering thrust; the flexible rear body adds a
  // stronger stroke during acceleration/escape, then relaxes during the glide.
  f.waveGain.value=T.MathUtils.damp(f.waveGain.value,.15+Math.min(1,moving/.25)*(.7+stroke*.8)+(now<f.recoverUntil?1.2:0),6,dt);
  for(let j=0;j<f.pectoral.length;j++){
   const p=f.pectoral[j],side=Math.sign(p.userData.restZ),pelvic=p.userData.pelvic;
   const angle=this.attachFin(f,p);
   // Broad paired fins have independent clocks. Pectoral flutter continues
   // while hovering; pelvic fans spread to support rests and soften in motion.
   // Integrate frequency rather than multiplying elapsed time by current speed:
   // acceleration must not jump the fin phase or make a resting fish quiver.
   p.userData.flutterTime=(p.userData.flutterTime??f.phase+j*.87)+dt*(pelvic?2.4:14+moving*13+j*.31);
   const phase=p.userData.flutterTime,footMotion=Math.min(1,moving/.08);
   p.rotation.x=-side*(pelvic?.73+Math.min(1,moving/.2)*.3+.06*Math.sin(phase)*footMotion:.77+.19*Math.sin(phase));
   p.rotation.y=angle+side*(pelvic?.10+.09*Math.sin(phase+.8)*footMotion:.38+.26*Math.sin(phase+.6));
   p.rotation.z=pelvic?.04*Math.sin(phase)*footMotion:.07*Math.sin(phase+1.3);
  }
  f.respiration+=dt*Math.PI*2*(night?.72:.95);this.breathe(f,peck*.8+(target?.35:0));
  if(target){const mouth=f.mouth.position.clone().multiplyScalar(size).applyEuler(f.group.rotation).add(f.position);if(mouth.distanceTo(target.position)<.065){target.alive=false;this.eatCount++;f.pecks++;f.hunger=Math.max(0,f.hunger-.13);f.energy=Math.min(1,f.energy+.055);f.memory=target.position.clone();f.food=null;f.feedingUntil=now+.65;f.mode='resting';f.until=f.feedingUntil;f.goal.copy(f.position);}}
 }
 /** Curve first, then let the heading catch up. Filter angular velocity so a
  * new nearby waypoint cannot flip a rigid animal in one abrupt motion. */
 private flexTurn(f:Fish,error:number,dt:number,maxRate:number,maxCurve:number){
  const wanted=T.MathUtils.clamp(error*3,-maxRate,maxRate);
  f.yawVelocity=T.MathUtils.damp(f.yawVelocity,wanted,6,dt);
  const step=T.MathUtils.clamp(f.yawVelocity*dt,-Math.abs(error),Math.abs(error));
  f.yaw+=step;
  // Tail tangent lags the new heading, instead of bending ahead of the head.
  const curve=T.MathUtils.clamp(-(wanted*.65+f.yawVelocity*.35)*(f.species==='goby'?.95:.58),-maxCurve,maxCurve);
  f.turnBend.value=T.MathUtils.damp(f.turnBend.value,curve,9,dt);
 }
 private attachFin(f:Fish,p:T.Group){
  const x=p.userData.restX??(p.userData.restX=p.position.x),wave=bodyBend(x,f.clock.value,f.effort.value,f.waveGain.value);
  const bent=turnFrame(x,p.userData.restZ+wave,f.turnBend.value);p.position.x=bent.x;p.position.z=bent.z;return bent.angle;
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
 snapshot(){return {fish:this.fish.length,sandGrains:0,bites:this.eatCount,food:this.foods.filter(f=>f.alive).length,positions:this.fish.map(f=>({species:f.species,x:f.position.x,y:f.position.y,z:f.position.z,mode:f.mode,hostVisits:f.hostVisits,speed:f.velocity.length(),speedBL:f.velocity.length()/f.group.scale.x,energy:f.energy,hunger:f.hunger,coasting:f.coasting,heightAboveSand:f.position.y-sandHeight(f.position.x,f.position.z),pecks:f.pecks})),obstacleOverlaps:this.fish.filter(f=>!this.free(f.position,f.radius,f.clearance)).length,fishOverlaps:this.fish.reduce((n,f,i)=>n+this.fish.slice(i+1).filter(o=>f.position.distanceToSquared(o.position)<(f.radius+o.radius-.01)**2).length,0)};}
}
