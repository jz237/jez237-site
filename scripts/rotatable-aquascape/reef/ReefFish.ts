import {marineBehavior,marineHabits} from './MarineBehavior.ts';
import {foodNote} from './ReefIdentification.ts';
import * as T from 'three';
import {sandHeight} from './ReefOptics.ts';
import metadata from './assets/fish/model-info.json';
import {bodyBend,turnFrame} from './MarineFinFlex.ts';
import {type MarineSpecies} from './MarineModels.ts';
import {type Obstacle} from './ReefScene.ts';

type Species=MarineSpecies;
const names:Record<Species,string>={tang:'Blue tang',rostratum:'Black tang',strigosus:'Kole tang',vulpinus:'Foxface rabbitfish',bispinosa:'Coral beauty angelfish',loricula:'Flame angelfish',hexataenia:'Six-line wrasse',cinctus:'Yellow watchman goby',semilarvatus:'Golden butterflyfish',clown:'Clownfish',anthias:'Anthias',chromis:'Blue-green chromis',gramma:'Royal gramma',goby:'Mandarin dragonet'};
const descriptions:Record<Species,string>={tang:'A laterally compressed body lets this blue tang turn between reef structures. It alternates fin-powered cruising with short tail-driven bursts, exploring the open channel and rock edges.',rostratum:'Zebrasoma rostratum, the black or longnose tang, uses its long snout to pick algae from crevices in the reef. Watch it patrol by rowing with its pectoral fins, stop to graze with quick bites, and fold its tall sails when it speeds up. When another tang comes close it turns broadside, raises its dorsal and anal fins and sweeps the white scalpel beside its tail, sometimes following with a short chase. Behavior here is illustrative, not a stocking or compatibility guide.',strigosus:'Ctenochaetus strigosus, the kole or goldring tang, combs diatoms, algae and detritus from rock with bristle-like teeth. Watch it work along reef faces in rapid scraping bites while rowing with its pectoral fins, and turn broadside to other tangs. It is endemic to Hawaii; behavior here is illustrative.',vulpinus:'Siganus vulpinus, the foxface rabbitfish, grazes algae from rock with its small tubular snout. Its fin spines carry venom: when another large fish crowds it, it raises them toward the intruder and quickly darkens to a mottled brown camouflage, as it also does at night. Behavior here is illustrative.',bispinosa:'Centropyge bispinosa, the coral beauty or twospined angelfish, keeps to its own rockwork, picking algae and detritus from the surfaces in short bouts and darting between shelters. It retreats from larger fish and chases rival dwarf angels from its patch.',loricula:'Centropyge loricula, the flame angelfish, grazes constantly around the live rock in its territory, darting between shelters and chasing rival dwarf angels. Note the black bars and the blue-and-black edging at the rear of its dorsal and anal fins.',hexataenia:'Pseudocheilinus hexataenia, the six-line wrasse, threads through the rockwork hunting tiny crustaceans with quick pecks, rowing with its pectoral fins. It stays close to cover and retreats from larger fish. At night it sleeps in a rock cavity inside a mucus cocoon; look for the faint sheen around it in blue hour.',cinctus:'Cryptocentrus cinctus, the yellow watchman goby, guards a burrow in the sand. It perches at the entrance scanning the tank, hops out to pick at the sand or snap passing food, and dives into the burrow when a large or fast fish comes close, peeking out before it emerges. It sleeps in the burrow at night. In the wild it shares the burrow with an alpheid shrimp, which this display does not include.',semilarvatus:'Chaetodon semilarvatus, the golden or bluecheek butterflyfish, has fine orange vertical stripes and a blue-gray patch behind the eye. Watch its independent fins, gentle cruising and pauses near the reef. This Red Sea species feeds on coral polyps and other small invertebrates; this mixed display is illustrative, not a coral-safe stocking recommendation.',clown:'The two clownfish stay close to their host anemone. They make short foraging trips into the water and return to shelter, rather than joining the open-water school.',anthias:'These female lyretail anthias hold feeding stations above the reef, facing the gently changing current. Watch for short prey-directed darts and returns, independent fin strokes, and quieter visits toward shelter at night.',chromis:'Blue-green chromis coordinate with nearby schoolmates above the reef: matching headings, drawing together and keeping space. Each fish has its own stroke-and-glide timing and can leave briefly for food before rejoining. At night they seek reachable water near reef shelter.',goby:'Synchiropus splendidus hovers close to reef rubble with fluttering pectoral fins, rests on its broad lower fins, and pecks at tiny crustaceans. Short moves and flexible turns interrupt its pauses. It is a dragonet, often called a mandarin goby; it does not sift mouthfuls of sand. The tiny food items here illustrate prey capture, not a living copepod population.',gramma:'The royal gramma keeps a persistent shelter near the reef. It makes short exploratory forays, pauses nearby and retreats when a larger fish approaches. Feeding stays local to its home instead of taking it on laps of the tank.'};
const specs:Record<Species,{h:number;w:number;size:number;color:string}>={tang:{h:.32,w:.095,size:.83,color:'#285deb'},rostratum:{h:.36,w:.08,size:.84,color:'#1c1916'},strigosus:{h:.34,w:.085,size:.68,color:'#4b3a33'},vulpinus:{h:.36,w:.09,size:.8,color:'#f4d21a'},bispinosa:{h:.36,w:.1,size:.42,color:'#33287a'},loricula:{h:.36,w:.1,size:.42,color:'#f2441c'},hexataenia:{h:.2,w:.08,size:.34,color:'#7a49c9'},cinctus:{h:.16,w:.1,size:.44,color:'#f1cf22'},semilarvatus:{h:.35,w:.09,size:.72,color:'#ffd800'},clown:{h:.21,w:.12,size:.4664,color:'#f68210'},anthias:{h:.16,w:.075,size:.47,color:'#f8783c'},chromis:{h:.19,w:.085,size:.41,color:'#59bde0'},gramma:{h:.16,w:.07,size:.49,color:'#b951df'},goby:{h:.19,w:.133,size:.59,color:'#ef7623'}};
const v=(x:number,y:number,z=0)=>new T.Vector3(x,y,z);
const UP=v(0,1,0);
// The watchman stands on its splayed pelvic fins: their reach sets its stance.
const footReach=((metadata as Record<string,{footDepth?:number}>).cinctus?.footDepth??.14)*.85;
const large=(s:Species)=>s==='tang'||s==='rostratum'||s==='semilarvatus'||s==='strigosus'||s==='vulpinus';
// Shared, lazily built pieces for the watchman goby burrow and wrasse cocoon.
let burrowParts:{mouth:T.MeshBasicMaterial;pebble:T.BufferGeometry;rock:T.MeshStandardMaterial[]}|null=null,cocoonShape:T.SphereGeometry|null=null;
const wrap=(a:number)=>Math.atan2(Math.sin(a),Math.cos(a));
/** Rabbitfish night and alarm coloration: the yellow and white darken to brown
 * with an irregular pale reticulation; black markings stay dark. */
function camouflageShader(shader:{uniforms:Record<string,unknown>;fragmentShader:string},mottle:{value:number}){
 shader.uniforms.mottle=mottle;
 shader.fragmentShader=`uniform float mottle;
  float camoHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float camoNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(camoHash(i),camoHash(i+vec2(1,0)),f.x),mix(camoHash(i+vec2(0,1)),camoHash(i+1.),f.x),f.y);}
`+shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
  {vec2 q=vMapUv*vec2(30.,20.);float n=.55*camoNoise(q)+.3*camoNoise(q*2.13+7.1)+.15*camoNoise(q*4.7+3.3);
   float pale=smoothstep(.55,.72,n),lum=dot(diffuseColor.rgb,vec3(.3,.55,.15));
   // Fading in or out the fish only dulls and darkens evenly; the pale
   // reticulation appears near full strength, so partial states are not blotchy.
   float shade=mix(.22,1.,smoothstep(.04,.32,lum));
   vec3 camo=mix(vec3(.15,.11,.07),mix(vec3(.15,.11,.07),vec3(.46,.41,.31),pale),smoothstep(.55,.95,mottle))*shade;
   diffuseColor.rgb=mix(diffuseColor.rgb,camo,mottle);}`);
}
/** Established display stocking; pages may extend it with more species. */
export const defaultPopulation:[Species,number][]=[['tang',1],['semilarvatus',1],['clown',2],['anthias',7],['chromis',8],['gramma',1],['goby',1]];
/** A reef face the black tang works over: stand-off water, the proxy surface and its bite plan. */
type Graze={obstacle:Obstacle;normal:T.Vector3;stand:T.Vector3;point:T.Vector3;bites:number;next:number;biteAt:number;shifts:number;entry?:T.Vector3;wait?:number};
/** A short straight lane, checked against the real reef surfaces, along which a
 * feeding fish may move inside the loose collision proxies. */
type Corridor={from:T.Vector3;to:T.Vector3};
type Fish={group:T.Group;species:Species;corridor:Corridor|null;backOut:boolean;lastGraze:T.Vector3|null;snapAt:number;snap:{point:T.Vector3;until:number}|null;snapBite:number;nearGoalSince:number;finFold:{value:number};mottle:{value:number};cocoon:T.Mesh|null;burrow:T.Group|null;hidden:boolean;homeYaw:number;look:number;graze:Graze|null;rival:Fish|null;displayUntil:number;chaseUntil:number;displayCooldown:number;position:T.Vector3;velocity:T.Vector3;goal:T.Vector3;radius:number;yaw:number;yawVelocity:number;pitch:number;clock:{value:number};effort:{value:number};waveGain:{value:number};turnBend:{value:number};mouthOpening:{value:number};gillOpening:{value:number};respiration:number;until:number;phase:number;pectoral:T.Group[];mouth:T.Group;eyes:T.Group;mode:string;progressPosition:T.Vector3;progressAt:number;blockedTime:number;recoverUntil:number;hostLeg:number;hostHold:number;hostVisits:number;clearance:number;home:T.Vector3;gobyCycle:number;pecks:number;individuality:number;drive:number;strokeUntil:number;coasting:boolean;tailRest:number;feedingUntil:number;energy:number;hunger:number;memory:T.Vector3|null;shelter:T.Vector3;social:T.Vector3;holdUntil:number;food:Food|null};
export type Food={position:T.Vector3;alive:boolean;age:number;sinkRate?:number};
/** Plan-time ray query against the real reef surfaces: the distance to the first
 * surface along a unit ray within far, and its kind, or null. */
export type SurfaceProbe=(origin:T.Vector3,direction:T.Vector3,far:number)=>{distance:number;kind:'rock'|'coral'|'other'}|null;
export class ReefFish{
 readonly fish:Fish[]=[];readonly foods:Food[]=[];surfaceProbe:SurfaceProbe|null=null;private siteSearchAt=-1;readonly notes:T.Object3D[]=[];private clock=0;private shoalGoal=v(2.5,4.15,.2);private nextShoalMove=0;private isNight=false;private templates=new Map<Species,T.Group>();private eatCount=0;private foodMesh:T.InstancedMesh;private dummy=new T.Object3D();
 constructor(private scene:T.Scene,private obstacles:Obstacle[],private hosts:T.Vector3[],templates:Map<Species,T.Group>,private hostScale=1,population=defaultPopulation){
  this.templates=templates;
  this.foodMesh=new T.InstancedMesh(new T.SphereGeometry(.022,6,4),new T.MeshStandardMaterial({color:'#cf9d67',roughness:.8}),48);this.foodMesh.count=0;this.foodMesh.name="Food morsels";this.foodMesh.userData.note=foodNote;this.notes.push(this.foodMesh);scene.add(this.foodMesh);
  for(const [s,count] of population)for(let i=0;i<count;i++)this.spawn(s,i);
 }
 /** Release water near the surface, clear of rock and every other animal. */
 private releasePoint(s:Species){
  const radius=specs[s].size*(large(s)?.4:.31);
  for(let attempt=0;attempt<80;attempt++){
   const p=v((Math.random()-.5)*6.4,4.45+Math.random()*.35,-.4+Math.random()*1.9);
   if(this.free(p,radius)&&this.fish.every(o=>p.distanceTo(o.position)>radius+o.radius+.12))return p;
  }
 }
 /** Builds one inhabitant. Without a release point it uses the validated habitat
  * placement of the original stocking, with the same sequence of random draws. */
 private spawn(s:Species,i:number,release?:T.Vector3,added=false){
  {
   {
    const group=this.templates.get(s)!.clone(true),clock={value:Math.random()*7},effort={value:.5},waveGain={value:s==='goby'?.2:1},turnBend={value:0},mouthOpening={value:0},gillOpening={value:0},finFold={value:0},mottle={value:0},camouflage=Boolean(marineHabits[s]?.camouflage);
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
       if(camouflage)camouflageShader(shader,mottle);
      };mat.customProgramCacheKey=()=>`reef-attached-operculum-v1${camouflage?'-mottle':''}`;
     }
     if(o.name==='body'||o.name==='fin'){
      const isBody=o.name==='body',isPectoral=Boolean(o.userData.pectoral);mat.onBeforeCompile=shader=>{shader.uniforms.swimTime=clock;shader.uniforms.swimEffort=effort;shader.uniforms.waveGain=waveGain;shader.uniforms.turnBend=turnBend;shader.uniforms.mouthOpening=mouthOpening;shader.uniforms.finFold=finFold;shader.uniforms.mouthY={value:metadata[s].mouth[1]};shader.uniforms.jawRadius={value:(metadata[s].upper.at(-1)![1]-metadata[s].lower.at(-1)![1])*1.2};shader.vertexShader='uniform float swimTime,swimEffort,waveGain,turnBend,mouthOpening,mouthY,jawRadius,finFold;\n'+(isBody?'':'attribute float finFlex,finHeight; attribute vec3 finGradient;\n')+shader.vertexShader;
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
        ${!isBody&&!isPectoral?'transformed.y-=finFold*finHeight*.55;':''}
        float rear=clamp((.3-position.x)/.9,0.,1.);
        ${isPectoral?'':'transformed.z+=rear*rear*sin(swimTime*7.5-position.x*7.)*(.018+swimEffort*.075)*waveGain;'}
        ${isBody?'':'transformed.z+=sin(swimTime*9.-position.x*8.)*finFlex*(.015+abs(position.y)*.11);'}
        ${!isPectoral?`if(position.x<.18&&abs(turnBend)>.0001){float turnSin=sin(turnAngle),turnCos=cos(turnAngle),crossZ=transformed.z;transformed.x=.18-turnSin/turnBend+turnSin*crossZ;transformed.z=(1.-turnCos)/turnBend+turnCos*crossZ;}`:''}
       `);
       // Interior tissue receives little direct light through the small aperture.
       // Vertex depth also masks specular light; diffuse vertex color alone does not.
       if(camouflage)camouflageShader(shader,mottle);
       if(isBody)shader.fragmentShader=shader.fragmentShader.replace('#include <lights_fragment_end>',`#include <lights_fragment_end>
        float oralExposure=smoothstep(.03,.9,vColor.r);
        reflectedLight.directSpecular*=oralExposure;
        reflectedLight.indirectSpecular*=oralExposure;
       `);
      };mat.customProgramCacheKey=()=>`reef-${isBody?'body':isPectoral?'pectoral':'fin'}-curved-localized-respiration-flex-fold-v9${camouflage?'-mottle':''}`;
     }
    }});
    const size=specs[s].size*(.83+Math.random()*.17);group.scale.setScalar(size);group.userData.note={title:names[s],description:descriptions[s]};this.scene.add(group);this.notes.push(group);
    let position=release?release.clone():this.destination(s,i);const radius=size*(s==='goby'?.87:s==='cinctus'?.36:large(s)?.4:.31),clearance=s==='goby'?size*.20:s==='cinctus'?size*footReach:radius;if(!release)for(let attempt=0;attempt<500;attempt++){if(this.free(position,radius,clearance)&&this.fish.every(o=>position.distanceTo(o.position)>radius+o.radius+.06))break;position=this.destination(s,i);}
    if(added&&!(this.free(position,radius,clearance)&&this.fish.every(o=>position.distanceTo(o.position)>radius+o.radius+.06))){group.removeFromParent();this.notes.splice(this.notes.indexOf(group),1);return;}
    const fish:Fish={group,species:s,corridor:null,backOut:false,lastGraze:null,snapAt:0,snap:null,snapBite:-9,nearGoalSince:-1,finFold,mottle,cocoon:null,burrow:null,hidden:false,homeYaw:0,look:0,graze:null,rival:null,displayUntil:0,chaseUntil:0,displayCooldown:6,position,velocity:v(0,0,0),goal:position.clone(),radius,clearance,home:position.clone(),gobyCycle:0,pecks:0,yaw:Math.random()*6.28,yawVelocity:0,pitch:0,clock,effort,waveGain,turnBend,mouthOpening,gillOpening,respiration:Math.random()*Math.PI*2,until:0,phase:Math.random()*6.28,pectoral:group.children.filter(o=>o.name==='pectoral') as T.Group[],mouth:group.getObjectByName('mouth') as T.Group,eyes:group.getObjectByName('eyes') as T.Group,mode:'exploring',progressPosition:position.clone(),progressAt:0,blockedTime:0,recoverUntil:0,hostLeg:i%3,hostHold:0,hostVisits:0,individuality:.88+Math.random()*.24,drive:Math.random(),strokeUntil:Math.random()*3,coasting:false,tailRest:1,feedingUntil:0,energy:.72+Math.random()*.25,hunger:.55+Math.random()*.3,memory:null,shelter:position.clone(),social:v(0,0,0),holdUntil:0,food:null};group.position.copy(position);this.fish.push(fish);fish.snapAt=1+fish.phase*.7;
    // A released fish keeps its habitat: it swims down to that home rather than
    // treating the surface release water as its station or shelter.
    if(release&&s!=='gramma'){fish.home.copy(this.destination(s,i));fish.shelter.copy(fish.home);fish.mode='entering the tank';}
    if(s==='gramma'&&release){fish.home.copy(this.reefPatch(fish,2.1)??this.destination(s,i));fish.shelter.copy(fish.home);fish.mode='entering the tank';}
    else if(s==='gramma'){fish.home.copy(this.reefPatch(fish,2.1)??position);fish.shelter.copy(fish.home);fish.position.copy(fish.home);fish.group.position.copy(fish.position);fish.goal.copy(fish.home);fish.progressPosition.copy(fish.home);}
    // Territorial reef dwellers keep a shelter beside the rock, like the gramma.
    const habit=marineHabits[s];
    if(habit?.home){
     fish.home.copy(this.reefPatch(fish,3.2)??(release?fish.home:position));fish.shelter.copy(fish.home);
     if(!release){fish.position.copy(fish.home);fish.group.position.copy(fish.position);fish.goal.copy(fish.home);fish.progressPosition.copy(fish.home);}
    }
    if(habit?.cocoon)this.makeCocoon(fish);
    if(s==='cinctus')this.digBurrow(fish);
    return fish;
   }
  }
 }
 /** Adds one animal of a loaded species. Open-water species are released near
  * the surface; the mandarin is placed on validated bottom ground. */
 add(s:Species){
  if(!this.templates.has(s))return;
  const ground=s==='goby'||s==='cinctus',release=ground?undefined:this.releasePoint(s);
  if(!ground&&!release)return;
  return this.spawn(s,this.fish.filter(f=>f.species===s).length,release,true);
 }
 /** Removes the most recently added animal of a species. Geometry and textures
  * stay shared with the template; only this animal's materials are released. */
 remove(s:Species){
  let index=-1;for(let i=this.fish.length-1;i>=0;i--)if(this.fish[i].species===s){index=i;break;}
  if(index<0)return;
  const [f]=this.fish.splice(index,1);f.group.removeFromParent();this.notes.splice(this.notes.indexOf(f.group),1);
  if(f.burrow){f.burrow.removeFromParent();this.notes.splice(this.notes.indexOf(f.burrow),1);}
  const released=new Set<T.Material>();
  f.group.traverse(o=>{if(o instanceof T.Mesh)for(const m of Array.isArray(o.material)?o.material:[o.material])if(!released.has(m)){released.add(m);m.dispose();}});
  for(const other of this.fish)if(other.rival===f){other.rival=null;other.displayUntil=other.chaseUntil=0;other.until=0;}
  return f;
 }
 count(s:Species){return this.fish.reduce((n,f)=>n+(f.species===s?1:0),0);}
 /** The nearest tang close enough to provoke a display, measured between bodies. */
 private rivalNear(f:Fish){
  const habit=marineHabits[f.species],rivals=habit?.rivals??[];let rival:Fish|null=null,best=habit?.displayGap??.7;
  // A guard defends only its own post (a clown's anemone, a gramma's ledge),
  // and only against an intruder actually inside it.
  const post=habit?.guard?f.species==='clown'?this.hosts[0]:f.shelter:null,range=(habit?.guard??0)*(f.species==='clown'?this.hostScale:1);
  if(post&&f.position.distanceTo(post)>range)return null;
  for(const o of this.fish)if(o!==f&&!o.hidden&&rivals.includes(o.species)&&(!post||o.position.distanceTo(post)<range+.15)){const gap=o.position.distanceTo(f.position)-o.radius-f.radius;if(gap<best){best=gap;rival=o;}}
  return rival;
 }
 has(s:Species){return this.templates.has(s);}
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
   else if(s==='cinctus'){const x=(Math.random()-.5)*7.2,z=.5+Math.random()*1.1;p=v(x,sandHeight(x,z)+specs.cinctus.size*footReach+.012,z);}
   else if(s==='clown')p=this.hosts[0].clone().add(v((Math.random()-.5)*1.9,.15+Math.random()*1.15,(Math.random()-.3)*1.1));
   else if(s==='anthias')p=v(-2.2+(Math.random()-.5)*3,3.55+Math.random()*1.35,(Math.random()-.5)*3);
   else if(s==='chromis')p=v(2.8+(Math.random()-.5)*2.5,3.65+Math.random()*1.25,(Math.random()-.5)*3);
   else p=v((Math.random()-.5)*8.5,.8+Math.random()*3.6,(Math.random()-.5)*3.6);
   if(this.free(p,s==='goby'?.45:s==='cinctus'?.2:large(s)?.36:.2,s==='goby'?.154:s==='cinctus'?specs.cinctus.size*footReach:large(s)?.36:.2))return p;
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
 /** A visible reef face for a grazer's snout. The stand-off point stays outside
  * every collision proxy; only the snout reaches toward the surface. A proxy is
  * only a bounding sphere, so with a surface probe the snout's target is the real
  * coral or rock found along the approach, and the fish stands just off it.
  * With a previous face, the next site is a short shift along the same face. */
 private grazeSite(f:Fish,previous?:Graze){
  const habit=marineHabits[f.species]!.graze!,reach=f.radius+.07,surface=habit.surface;
  const fits=(o:Obstacle)=>o.radius>=.14&&(!surface||(surface==='coral')===(o.kind==='coral'));
  // Foraging stays local: faces a short swim away, of the kind this species picks.
  let pool=this.obstacles.filter(o=>fits(o)&&o.center.distanceTo(f.position)<2.4+o.radius);
  if(pool.length<3)pool=this.obstacles.filter(fits);
  const candidates:[number,Graze][]=[];
  for(let j=0;j<60&&pool.length;j++){
   let o:Obstacle|undefined,normal:T.Vector3;
   if(previous){o=previous.obstacle;normal=previous.normal.clone().applyAxisAngle(UP,(Math.random()<.5?-1:1)*(.3+Math.random()*.35));normal.y+=(Math.random()-.5)*.25;normal.normalize();}
   else{
    o=pool[Math.floor(Math.random()*pool.length)];
    // Prefer faces turned toward the viewer, where grazing is visible.
    const a=Math.random()*Math.PI;normal=v(Math.cos(a)*.85,(Math.random()-.4)*.9,Math.sin(a)*.85+.15).normalize();
   }
   if(!o||o.radius<.14)continue;
   // Territorial grazers keep to faces within their home range.
   if(habit.range&&o.center.clone().addScaledVector(normal,o.radius).distanceTo(f.home)>habit.range)continue;
   // The fish faces squarely into the face, within the grazing pitch limit.
   if(Math.abs(normal.y)>Math.sin(.44))continue;
   const stand=o.center.clone().addScaledVector(normal,o.radius+reach);
   // A new bout is somewhere else along the reef, not the face just worked.
   if(!previous&&!habit.range&&f.lastGraze&&stand.distanceToSquared(f.lastGraze)<1.1)continue;
   if(stand.y<.6||stand.y>4.3||!this.clearSegment(f.position,stand,f.radius)||this.fish.some(other=>other!==f&&stand.distanceToSquared(other.position)<(f.radius+other.radius+.1)**2))continue;
   // Nearer faces first, and those near the fish's own depth.
   const score=(previous?0:stand.distanceToSquared(f.position)+1.5*(stand.y-f.position.y)**2)+Math.random()*.6;
   candidates.push([score,{obstacle:o,normal,stand,point:o.center.clone().addScaledVector(normal,o.radius),bites:habit.bites[0]+Math.floor(Math.random()*(habit.bites[1]-habit.bites[0]+1)),next:0,biteAt:-1,shifts:previous?previous.shifts-1:Math.random()<.6?1+Math.floor(Math.random()*2):0}]);
  }
  candidates.sort((a,b)=>a[0]-b[0]);
  const probe=this.surfaceProbe;if(!probe)return candidates[0]?.[1];
  const size=f.group.scale.x,crowded=(p:T.Vector3)=>this.fish.some(other=>other!==f&&p.distanceToSquared(other.position)<(f.radius+other.radius+.1)**2);
  for(const [,g] of candidates.slice(0,16)){
   // Find the real surface behind the face; bites land on it, not on the proxy.
   const inward=g.normal.clone().negate();
   // The mouth sits ahead of and below the body axis: probe and aim along its line.
   const mouth=f.mouth.position.clone().multiplyScalar(size).applyEuler(new T.Euler(0,Math.atan2(-inward.z,inward.x),Math.asin(inward.y),'YXZ'));
   const hit=probe(g.stand.clone().add(mouth),inward,Math.min(g.obstacle.radius*2+reach,.7*size+.06));
   if(!hit||hit.kind==='other'||surface&&hit.kind!==surface)continue;
   // The mouth rests about 4 cm off the surface, so each bite's stroke just reaches it.
   const along=hit.distance-.04,stand=g.stand.clone().addScaledVector(inward,along);
   // Not right down at the sand line, where leaving over rising sand can pin a fish.
   if(stand.y<Math.max(.6,sandHeight(stand.x,stand.z)+f.radius+.15)||stand.y>4.3||crowded(stand))continue;
   if(along<=0){
    // The surface stands proud of its proxy: wait a little farther out.
    const check=probe(stand.clone().add(mouth),inward,.1);
    if(!check||Math.abs(check.distance-.04)>.02||!this.free(stand,f.radius)||!this.clearSegment(f.position,stand,f.radius))continue;
   }else{
    // The proxy is looser than the reef: enter it along the face normal, only if
    // the real surfaces leave room for the body and fins there and on the way.
    if(along>.7*size||!this.inWater(stand,f.radius)||!this.bodyClear(stand,inward,size)||!this.bodyClear(g.stand.clone().lerp(stand,.5),inward,size,true))continue;
    g.entry=g.stand.clone();
   }
   g.stand=stand;g.point=stand.clone().add(mouth).addScaledVector(inward,.04);return g;
  }
  return undefined;
 }
 /** A blocked step slides along what blocks it: the part of the step pushing
  * into each blocking proxy, schoolmate, glass pane, water surface or the sand is
  * removed, and the rest is taken if clear. Social steering can press a fish
  * gently into a proxy; stopping there pinned it for many seconds. */
 private slide(f:Fish,step:T.Vector3){
  const p=f.position,next=p.clone().add(step),r=f.radius,n=new T.Vector3();
  const remove=(x:number,y:number,z:number)=>{n.set(x,y,z).normalize();const d=step.dot(n);if(d<0)step.addScaledVector(n,-d);};
  for(const o of this.obstacles){const limit=o.radius+r+.01;if(next.distanceToSquared(o.center)<limit*limit)remove(p.x-o.center.x,p.y-o.center.y,p.z-o.center.z);}
  for(const o of this.fish)if(o!==f){const limit=r+o.radius+.01;if(next.distanceToSquared(o.position)<limit*limit)remove(p.x-o.position.x,p.y-o.position.y,p.z-o.position.z);}
  if(next.x>4.69-r)remove(-1,0,0);if(next.x<-4.69+r)remove(1,0,0);if(next.z>2.08-r)remove(0,0,-1);if(next.z<-2.08+r)remove(0,0,1);if(next.y>5.11-r)remove(0,-1,0);
  if(next.y<Math.max(.3,sandHeight(next.x,next.z)+.035)+r+.01)remove(0,1,0);
  if(step.lengthSq()<1e-12)return null;
  const slid=p.clone().add(step);
  return this.fish.some(o=>o!==f&&slid.distanceToSquared(o.position)<(r+o.radius)**2)||!this.clearSegment(p,slid,r)?null:slid;
 }
 /** Tank walls and sand only; collision proxies are not considered. */
 private inWater(p:T.Vector3,r:number){return p.x>-4.7+r&&p.x<4.7-r&&p.z>-2.09+r&&p.z<2.09-r&&p.y>Math.max(.3,sandHeight(p.x,p.z)+.035)+r&&p.y<5.12-r;}
 /** No real reef surface within a fish's body and fins, at this position with the
  * pose it takes to face the given direction (pitch limited as when grazing). */
 private bodyClear(p:T.Vector3,facing:T.Vector3,size:number,passing=false){
  const probe=this.surfaceProbe!,yaw=Math.atan2(-facing.z,facing.x),pitch=T.MathUtils.clamp(Math.asin(T.MathUtils.clamp(facing.y,-1,1)),-.48,.48);
  const A=v(Math.cos(yaw)*Math.cos(pitch),Math.sin(pitch),-Math.sin(yaw)*Math.cos(pitch)),U=v(-Math.cos(yaw)*Math.sin(pitch),Math.cos(pitch),Math.sin(yaw)*Math.sin(pitch)),S=A.clone().cross(U);
  const rays:[T.Vector3,number][]=[[A.clone().negate(),.58],[U,.3],[U.clone().negate(),.3],[S,.09],[S.clone().negate(),.09],[A.clone().negate().add(U).normalize(),.4],[A.clone().negate().sub(U).normalize(),.4],[A.clone().negate().add(S).normalize(),.3],[A.clone().negate().sub(S).normalize(),.3]];
  if(!passing)rays.push([A,.46],[A.clone().add(U).normalize(),.22],[A.clone().sub(U).normalize(),.22]);
  return rays.every(([direction,length])=>!probe(p,direction,length*size));
 }
 /** Within the fish's current feeding corridor (a little tolerance around it). */
 private inCorridor(f:Fish,p:T.Vector3){
  const c=f.corridor;if(!c)return false;
  const ab=c.to.clone().sub(c.from),t=T.MathUtils.clamp(p.clone().sub(c.from).dot(ab)/Math.max(1e-9,ab.lengthSq()),0,1);
  return p.distanceTo(c.from.clone().addScaledVector(ab,t))<.05;
 }
 /** A drifting particle just ahead of a planktivore, within its forward view. */
 private planktonPoint(f:Fish,reach:[number,number]){
  const size=f.group.scale.x;
  for(let j=0;j<10;j++){
   const yaw=f.yaw+(Math.random()-.5)*1.3,pitch=(Math.random()-.5)*.5,d=(reach[0]+Math.random()*(reach[1]-reach[0]))*size;
   const p=f.position.clone().add(v(Math.cos(yaw)*Math.cos(pitch)*d,Math.sin(pitch)*d,-Math.sin(yaw)*Math.cos(pitch)*d));
   if(this.clearSegment(f.position,p,f.radius)&&this.fish.every(o=>o===f||p.distanceToSquared(o.position)>(f.radius+o.radius+.05)**2))return p;
  }
  return undefined;
 }
 /** Planktivores strike at single drifting particles: a short dart until the
  * mouth reaches the particle, a snap of the jaws, a brief brake, then on to
  * station or school. No food object exists or is consumed; it is a visual
  * feeding act only. Returns true while the strike directs this fish. */
 private planktonStrike(f:Fish,now:number,night:boolean){
  const plankton=marineHabits[f.species]?.plankton;if(!plankton)return false;
  if(f.snap){
   const reached=f.position.distanceTo(f.snap.point)<f.group.scale.x*.52;
   if(!reached&&now<=f.snap.until)return true;
   if(reached)f.snapBite=now;
   f.snap=null;f.snapAt=now+plankton.interval[0]+Math.random()*(plankton.interval[1]-plankton.interval[0]);
   f.holdUntil=now+.25+Math.random()*.35;f.until=f.holdUntil;f.goal.copy(f.position);
   return true;
  }
  if(night||f.graze||now<f.snapAt||now<f.recoverUntil)return false;
  const point=this.planktonPoint(f,plankton.reach);
  if(!point){f.snapAt=now+1;return false;}
  f.snap={point,until:now+1.4};f.goal.copy(point);f.holdUntil=0;f.until=f.snap.until;f.mode='snapping at plankton';
  return true;
 }
 private planSwim(f:Fish,index:number,recover:boolean){
  if(f.species==='clown'&&!recover&&this.planHostVisit(f))return;
  // A fish inside a feeding corridor backs out along it, still facing the reef,
  // before any other plan: turning in place would swing its tail through coral.
  if(f.corridor&&!this.free(f.position,f.radius,f.clearance)){
   // Aim a little beyond the lane's outer end, so the exit ends promptly once clear.
   const out=f.corridor.from.clone().sub(f.corridor.to).normalize(),beyond=f.corridor.from.clone().addScaledVector(out,.2);
   f.backOut=true;f.goal.copy(this.clearSegment(f.corridor.from,beyond,f.radius)?beyond:f.corridor.from);f.holdUntil=0;f.snap=null;f.nearGoalSince=-1;f.until=this.clock+6;f.mode='backing away from the reef';return;
  }
  f.corridor=null;f.backOut=false;
  let chosen:T.Vector3|undefined;
  f.holdUntil=0;f.snap=null;f.nearGoalSince=-1;if(recover)f.snapAt=Math.max(f.snapAt,this.clock+2);
  // Grazing is a plan of its own; any new plan replaces an unfinished one.
  const previousGraze=f.graze,habit=marineHabits[f.species];f.graze=null;
  // At most one feeding-site search (its surface rays) per frame across the tank:
  // another grazer keeps its current course for a frame or two and plans then.
  if(!recover&&habit?.graze&&!this.isNight&&this.surfaceProbe&&this.siteSearchAt===this.clock){f.until=this.clock+.02+Math.random()*.04;return;}
  if(!recover&&habit?.graze&&!this.isNight){
   this.siteSearchAt=this.clock;
   const site=previousGraze&&previousGraze.shifts>0?this.grazeSite(f,previousGraze):Math.random()<habit.graze.chance?this.grazeSite(f):undefined;
   if(site){f.graze=site;chosen=(site.entry??site.stand).clone();}
  }
  // A territorial fish well outside its range heads straight back to cover,
  // including after a stall, rather than wandering on from wherever it stopped.
  if(habit?.home&&!f.graze&&f.position.distanceTo(f.shelter)>habit.home*1.3&&this.clearSegment(f.position,f.shelter,f.radius))chosen=f.shelter.clone();
  if(!recover&&!chosen){
   if(this.isNight&&(f.species==='tang'||f.species==='rostratum'||f.species==='strigosus'||f.species==='vulpinus'||f.species==='anthias'||f.species==='chromis')){
    if(this.clearSegment(f.position,f.shelter,f.radius))chosen=f.shelter.clone();
    else{chosen=this.reefPatch(f,3.4);if(chosen)f.shelter.copy(chosen);}
   }
   if(this.isNight&&(f.species==='gramma'||habit?.home)&&this.clearSegment(f.position,f.shelter,f.radius))chosen=f.shelter.clone();
   if(!chosen&&(f.species==='semilarvatus'||(f.species==='tang'&&Math.random()<.25)))chosen=this.reefPatch(f);
   for(let j=0;j<32&&!chosen;j++){
    let p:T.Vector3;
    if(f.species==='gramma'){
     // A persistent shelter, with short independent excursions and returns.
     const returning=f.position.distanceTo(f.shelter)>.95||Math.random()<.42;
     p=f.shelter.clone().add(v((Math.random()-.5)*(returning?.35:2),(Math.random()-.4)*(returning?.2:1.2),(Math.random()-.5)*(returning?.35:1.7)));
    }else if(habit?.home){
     // Short excursions over its own rockwork, often doubling back to cover.
     const r=habit.home,returning=f.position.distanceTo(f.shelter)>r*.6||Math.random()<.4;
     p=f.shelter.clone().add(v((Math.random()-.5)*(returning?.3:r*1.2),(Math.random()-.4)*(returning?.2:r*.6),(Math.random()-.5)*(returning?.3:r)));
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
    // A territorial fish's fallback move favors its own cover over pushing on.
    const score=reach+.3*Math.cos(angle-f.yaw)+.08*Math.sin(j+f.phase)-(habit?.home?1.5*p.distanceTo(f.shelter):0);
    if(score>best){best=score;chosen=p;}
   }
  }
  if(chosen)f.goal.copy(chosen);
  const refuge=this.isNight&&f.species!=='semilarvatus';
  // A grazer gets the time its approach actually needs, rather than giving up
  // on a site most of the way there.
  const travelTime=refuge?Math.min(55,10+f.position.distanceTo(f.goal)/(f.group.scale.x*marineBehavior[f.species].cruiseBL[0]*marineBehavior[f.species].night*.7)):f.graze?Math.min(24,4+f.position.distanceTo(f.goal)/(f.group.scale.x*marineBehavior[f.species].cruiseBL[0]*.7)):5+Math.random()*7;
  f.until=this.clock+(recover?3:travelTime);
  f.mode=recover?'exploring':refuge?'seeking shelter':f.graze?habit!.graze!.labels?.[0]??'heading to graze':(f.species==='gramma'||habit?.home)&&f.goal.distanceTo(f.shelter)<.4?'returning to shelter':'cruising';
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
  for(const site of sinkingSites.slice(0,6))this.foods.push({position:v(site.x,4.95,site.z),alive:true,age:0,sinkRate:.43});
  // A few morsels drift down within reach of each watchman's burrow.
  for(const w of this.fish)if(w.species==='cinctus')for(let i=0;i<3;i++)this.foods.push({position:w.home.clone().add(v((i-1)*.2,1.1,.12)),alive:true,age:0,sinkRate:.22});
  return true;
 }
 update(dt:number,night:boolean){
  if(dt<=0)return;
  this.clock+=dt;const now=this.clock;
  if(night!==this.isNight){
   this.isNight=night;
   for(const f of this.fish){
    f.until=0;f.holdUntil=0;f.hostHold=0;
    if(night&&(f.species==='tang'||f.species==='rostratum'||f.species==='strigosus'||f.species==='vulpinus'||f.species==='anthias'||f.species==='chromis')){
     f.shelter.copy(this.reefPatch(f,3.4)??f.position);f.goal.copy(f.shelter);
    }
    if(night&&(f.species==='gramma'||marineHabits[f.species]?.home))f.goal.copy(f.shelter);
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
   if(f.species==='cinctus'){this.updateWatchman(f,dt,night);continue;}
   const habit=marineHabits[f.species],display=habit?.display;
   const mouth=f.mouth.position.clone().multiplyScalar(size).applyEuler(new T.Euler(0,f.yaw,f.pitch,'YXZ')).add(f.position);
   let target:Food|undefined,dist=Infinity;
   // Perception is local and a selected prey item persists while reachable.
   // Recovery and an actual bite have priority over selecting another pellet.
   if(now>=f.recoverUntil&&now>=f.feedingUntil&&f.hunger>.18&&!f.corridor)for(const food of this.foods)if(food.alive){
    const d=f.position.distanceToSquared(food.position);
    if(d>(profile.perceptionBL*size)**2||(f.species==='clown'&&food.position.distanceToSquared(this.hosts[0])>5)||(f.species==='gramma'&&food.position.distanceTo(f.shelter)>1.7)||(habit?.home&&food.position.distanceTo(f.shelter)>habit.home+.8))continue;
    const occupied=this.fish.some(other=>other!==f&&other.food===food);
    const score=d*(food===f.food?.55:1)*(occupied?1.8:1);
    if(score<dist&&this.clearSegment(f.position,food.position,f.radius)){dist=score;target=food;}
   }
   f.food=target??null;
   // A rival close by draws a broadside fin display (tangs), a short chase
   // (dwarf angels, wrasse) or a defensive spine display with camouflage
   // (foxface). A meal, the night refuge or recovery always take priority.
   if(display&&!target&&!night&&!f.corridor&&now>=f.recoverUntil&&!f.rival&&now>f.displayCooldown){
    const rival=this.rivalNear(f);
    if(rival){
     const cool=habit!.displayCooldown??[13,25];f.rival=rival;f.displayCooldown=now+cool[0]+Math.random()*(cool[1]-cool[0]);f.holdUntil=0;f.graze=null;f.snap=null;
     if(display==='chase'){f.displayUntil=now;f.chaseUntil=now+1+Math.random()*.7;f.mode=habit!.chaseLabel??'chasing rival';}
     else{f.displayUntil=now+1.5+Math.random();f.chaseUntil=display==='broadside'&&Math.random()<.4?f.displayUntil+.9+Math.random()*.9:0;f.mode=display==='spines'?'raising venomous spines':'fin display';}
     f.until=Math.max(f.displayUntil,f.chaseUntil);
    }
   }
   if(f.rival&&(target||night||now<f.recoverUntil||now>=Math.max(f.displayUntil,f.chaseUntil))){f.rival=null;f.displayUntil=f.chaseUntil=0;f.until=Math.min(f.until,now);}
   const displaying=f.rival!==null&&now<f.displayUntil,chasing=f.rival!==null&&!displaying;
   if(chasing)f.mode=habit?.chaseLabel??'chasing rival';
   if(target){
    // Seek the prey itself; capture is tested at the articulated mouth.
    // Offsetting a waypoint along an unclamped 3D ray strands the fish below
    // steep prey because its real body stays within a natural pitch limit.
    f.goal.copy(target.position);
    f.mode='feeding';f.holdUntil=0;f.graze=null;f.snap=null;
    if(mouth.distanceTo(target.position)<Math.max(.065,.16*size)){
     target.alive=false;this.eatCount++;f.hunger=Math.max(0,f.hunger-.13);f.energy=Math.min(1,f.energy+.055);f.memory=target.position.clone();
     f.feedingUntil=now+.4+Math.random()*.3;f.holdUntil=f.feedingUntil;f.until=f.feedingUntil;f.goal.copy(f.position);f.mode='inspecting reef';target=undefined;f.food=null;
    }
   }else if(now>=f.feedingUntil&&!f.rival&&!this.planktonStrike(f,now,night)){
    // A cruise waypoint that the fish has hovered near for a while counts as
    // reached: circling it at the maximum turn rate is not a destination.
    const stalled=f.species!=='clown'&&!f.graze&&f.nearGoalSince>=0&&now-f.nearGoalSince>2.5,arrived=f.position.distanceTo(f.goal)<(f.species==='clown'?.14:.19)||stalled;
    if(f.species==='clown'&&arrived&&!f.hostHold){f.hostHold=now+.3+Math.random()*.75;f.until=f.hostHold;f.hostVisits++;f.mode='sheltering';}
    // Near a lane's outer end, settle onto it (inside the lane's tolerance)
    // before moving in to just off the real surface; no rest or new plan here.
    const entering=Boolean(habit?.graze&&f.graze?.entry&&!f.corridor&&arrived);
    if(entering&&f.position.distanceTo(f.goal)<.17&&now>=f.recoverUntil){
     // The lane starts where the fish actually is, once its way in is clear too.
     const g=f.graze!,inward=g.normal.clone().negate();
     if(this.bodyClear(f.position.clone().lerp(g.stand,.5),inward,size,true)){f.corridor={from:f.position.clone(),to:g.stand.clone().addScaledVector(inward,.06)};f.goal.copy(g.stand);f.until=Math.max(f.until,now+6);}
     else{f.graze=null;f.until=now;}
    }else if(!entering&&habit?.graze&&f.graze&&arrived&&!f.holdUntil&&now>=f.recoverUntil){
     // A bout of bites at one face, then a short shift along it or a new patrol.
     // Each bite's stroke stays within a short lane toward the surface.
     if(!f.corridor)f.corridor={from:f.graze.stand.clone(),to:f.graze.stand.clone().addScaledVector(f.graze.normal,-.06)};
     f.lastGraze=f.graze.point.clone();
     const g=f.graze,iv=habit.graze.interval;g.next=now+.3+Math.random()*.3;g.biteAt=-1;
     f.holdUntil=now+.6+g.bites*(.75+Math.random()*.3)*(iv[0]+iv[1])/1.7;f.until=f.holdUntil;f.goal.copy(f.position);f.mode=habit.graze.labels?.[1]??'grazing algae';
    }
    // A waypoint given up on after hovering beside it is not a place to rest.
    if(!entering&&!stalled&&f.species!=='clown'&&arrived&&!f.holdUntil&&now>=f.recoverUntil&&Math.random()<(night&&f.species!=='semilarvatus'?1:profile.restChance)){
     f.holdUntil=now+(night&&f.species!=='semilarvatus'?20+Math.random()*25:profile.rest[0]+Math.random()*(profile.rest[1]-profile.rest[0]));
     f.until=f.holdUntil;f.goal.copy(f.position);
     f.mode=night&&f.species!=='semilarvatus'?'resting near shelter':f.species==='anthias'?'holding feeding station':f.species==='gramma'||habit?.home?'resting near shelter':'inspecting reef';
    }
    const exited=f.backOut&&this.free(f.position,f.radius,f.clearance);
    if(!entering&&(now>f.until||exited||(arrived&&f.species!=='clown'&&!f.holdUntil)))this.planSwim(f,i,now<f.recoverUntil);
   }
   const holding=f.holdUntil>now||f.mode==='sheltering';
   // An intentional inspection must not trip the blocked-path watchdog.
   // A short, slow move along a feeding lane is intentional too; the lane's own
   // time limit bounds it.
   if(holding||f.corridor||f.position.distanceToSquared(f.progressPosition)>.025){f.progressPosition.copy(f.position);f.progressAt=now;}
   else if(now>=f.recoverUntil&&now-f.progressAt>(night&&f.species!=='semilarvatus'?7:2.4)){f.recoverUntil=now+4;this.planSwim(f,i,true);f.progressAt=now;target=undefined;f.food=null;}
   if(now>f.strokeUntil){
    f.coasting=!f.coasting;const interval=f.coasting?profile.coast:profile.stroke;
    f.strokeUntil=now+(interval[0]+Math.random()*(interval[1]-interval[0]))/f.individuality;f.drive=Math.random();
   }
   const desired=f.goal.clone().sub(f.position),distance=desired.length();
   if(holding||target||f.rival||distance>.9)f.nearGoalSince=-1;else if(f.nearGoalSince<0)f.nearGoalSince=now;
   const goalBearing=Math.abs(wrap(Math.atan2(-desired.z,desired.x)-f.yaw));
   const cruise=profile.cruiseBL[0]+(profile.cruiseBL[1]-profile.cruiseBL[0])*(.55*f.drive+.45*(.5+.5*Math.sin(now*.57+f.phase)));
   let speed=size*cruise*f.individuality*(night?profile.night:1)*(.72+.28*f.energy)*(f.coasting?.68:1);
   if(target)speed=size*profile.burstBL*f.individuality*(.72+.28*f.energy)*Math.min(1,.28+distance/(size*.85));
   if(!target){
    if(night&&f.mode==='seeking shelter')speed=Math.max(speed,size*.5*f.individuality);
    speed*=Math.min(1,distance/(size*.6));if(holding)speed=0;
   }
   // A goal close by and off to the side: slow down and turn toward it, rather
   // than circling it at cruising speed and the maximum turn rate.
   // (A shoaling fish steers by its school, not its waypoint; it is not braked.)
   if(!target&&!f.rival&&!holding&&!f.backOut&&f.species!=='clown'&&profile.schooling!=='shoal'&&distance<1.2&&goalBearing>.5)speed*=Math.max(.12,Math.cos(goalBearing));
   // A plankton strike is a short burst that brakes as the mouth reaches the particle.
   if(f.snap&&!target)speed=size*profile.burstBL*.7*f.individuality*Math.max(.2,Math.min(1,.3+(distance-size*.5)/(size*.6)));
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
   const grazing=Boolean(habit?.graze)&&holding&&f.mode===(habit?.graze?.labels?.[1]??'grazing algae')&&f.graze!==null;let jab=0;
   if(grazing){
    // Face the surface and pick: a short forward snout stroke with the mouth
    // open, then back. The stand-off margin keeps every stroke collision-free.
    const g=f.graze!,iv=habit!.graze!.interval,stroke=T.MathUtils.clamp(iv[0]*.9,.2,.42);
    // Bites begin once the fish has settled onto its stance, snout just off the
    // surface; the bout waits for that (up to a few seconds) rather than nipping water.
    const aim=g.normal.clone().negate(),heading=v(Math.cos(f.yaw)*Math.cos(f.pitch),Math.sin(f.pitch),-Math.sin(f.yaw)*Math.cos(f.pitch));
    const settled=f.position.distanceTo(g.stand)<.035&&heading.dot(aim)>Math.cos(.14);
    if(!settled&&g.bites>0&&now>=g.next){g.wait??=now;if(now-g.wait<3){f.holdUntil+=dt;f.until=Math.max(f.until,f.holdUntil);}}
    if((settled||g.wait!==undefined&&now-g.wait>=3)&&now>=g.next&&g.bites>0){g.wait=undefined;g.biteAt=now;g.bites--;g.next=now+iv[0]+Math.random()*(iv[1]-iv[0]);}
    const t=now-g.biteAt;jab=g.biteAt>=0&&t<stroke?Math.sin(Math.PI*2*t/stroke):0;
    desired.copy(g.normal).negate();
   }
   if(displaying){
    // Broadside to the rival, on whichever flank needs the smaller turn.
    const away=f.position.clone().sub(f.rival!.position),a=Math.atan2(-away.z,away.x)+Math.PI/2,b=a+Math.PI,heading=Math.abs(wrap(a-f.yaw))<Math.abs(wrap(b-f.yaw))?a:b;
    desired.set(Math.cos(heading),0,-Math.sin(heading));speed=size*.14;
   }else if(chasing){
    const gap=f.rival!.position.clone().sub(f.position),l=gap.length();
    desired.copy(gap).normalize();speed=size*profile.burstBL*.8*f.individuality*Math.min(1,l/(size*1.1));
   }
   if(!target&&!holding&&!night&&!f.snap&&profile.schooling){
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
   if((f.species==='gramma'||(habit?.retreat&&!chasing))&&!target&&now>=f.recoverUntil&&this.fish.some(o=>o!==f&&o.radius>f.radius&&o.position.distanceTo(f.position)<f.radius+o.radius+.35)&&this.clearSegment(f.position,f.shelter,f.radius)){
    f.goal.copy(f.shelter);f.holdUntil=0;f.until=now+3;f.mode='returning to shelter';desired.copy(f.goal).sub(f.position).normalize();
    // Dart home, then stop there: a burst right up to the shelter circled it.
    const home=f.position.distanceTo(f.shelter);speed=home<.12?0:size*profile.burstBL*Math.min(1,(home/.6)**2);if(home<.12)desired.set(Math.cos(f.yaw),0,-Math.sin(f.yaw));
   }
   for(const other of this.fish)if(other!==f){const d=f.position.clone().sub(other.position),l=d.length(),space=f.radius+other.radius+.22;if(l<space&&l>.0001)desired.addScaledVector(d,(space-l)/space/l*2.8);}
   const avoidance=v(0,0,0);
   for(const o of this.obstacles){const x=f.position.x-o.center.x,y=f.position.y-o.center.y,z=f.position.z-o.center.z,limit=o.radius+f.radius+.38,d2=x*x+y*y+z*z;if(d2<limit*limit&&d2>.000001){const d=Math.sqrt(d2),gain=(limit-d)/.38/d*2;avoidance.x+=x*gain;avoidance.y+=y*gain;avoidance.z+=z*gain;}}
   // Honor the validated escape route: soft rock repulsion can otherwise push
   // a fish back into glass indefinitely. Swept collision checks still apply.
   // A grazer works right beside the rock it is facing; soft repulsion would
   // turn it away. Approaching its stand-off point, repulsion eases off.
   // Any goal was validated clear: close to it, repulsion eases so the fish
   // arrives rather than orbiting a waypoint beside the rock.
   if(grazing||f.corridor)avoidance.set(0,0,0);else if(f.graze&&distance<1.2)avoidance.multiplyScalar((distance/1.2)**2);else if(!f.graze&&distance<1)avoidance.multiplyScalar(.35+.65*distance);
   if(now>=f.recoverUntil)desired.add(avoidance.clampLength(0,f.species==='clown'?.28:.65));
   // A goal almost straight above or below gives no heading to turn toward.
   if(!target&&!grazing&&!f.rival&&!f.backOut&&Math.hypot(f.goal.x-f.position.x,f.goal.z-f.position.z)<.08){desired.x=Math.cos(f.yaw);desired.z=-Math.sin(f.yaw);}
   const wantedYaw=desired.lengthSq()>.00001?Math.atan2(-desired.z,desired.x):f.yaw,turn=Math.atan2(Math.sin(wantedYaw-f.yaw),Math.cos(wantedYaw-f.yaw));
   this.flexTurn(f,turn,dt,profile.turnRate,profile.curve);
   if(displaying){
    // Sweep the tail, and the white scalpel beside it, toward the rival.
    const rel=f.rival!.position.clone().sub(f.position),side=Math.sign(rel.x*Math.sin(f.yaw)+rel.z*Math.cos(f.yaw))||1;
    f.turnBend.value=T.MathUtils.damp(f.turnBend.value,side*(.5+.55*Math.max(0,Math.sin(now*5.5+f.phase))),8,dt);
   }
   if(f.backOut&&f.graze)desired.copy(f.graze.normal).negate();
   const pitchLimit=grazing||f.corridor?.48:.28,pitch=T.MathUtils.clamp(Math.atan2(desired.y,Math.hypot(desired.x,desired.z)),-pitchLimit,pitchLimit);f.pitch=T.MathUtils.damp(f.pitch,pitch,grazing?3.5:2.5,dt);
   speed*=Math.max(.17,Math.cos(turn));const forward=v(Math.cos(f.yaw)*Math.cos(f.pitch),Math.sin(f.pitch),-Math.sin(f.yaw)*Math.cos(f.pitch)).multiplyScalar(speed);
   // Settle onto the validated stand-off point (arrival is only approximate),
   // then add each bite's snout stroke on top of that small correction.
   // Backing out: a gentle reverse paddle along the lane while facing the reef.
   if(f.backOut&&f.corridor)forward.copy(f.goal).sub(f.position).multiplyScalar(1.8).clampLength(0,size*.35);
   // Moving in: glide straight along the lane while turning to face the surface;
   // swimming along a still-turning heading would curve out of it.
   else if(f.corridor&&!grazing)forward.copy(f.goal).sub(f.position).multiplyScalar(2).clampLength(0,size*.3);
   if(grazing)forward.copy(f.graze!.stand).sub(f.position).multiplyScalar(3).clampLength(0,size*.25).addScaledVector(desired,jab*size*habit!.graze!.stroke);
   // A nearby goal steeper than the upright pitch limit: the paired fins lift or
   // sink the body toward it, which pitch alone cannot do without spiraling.
   if(!target&&!holding&&!f.rival&&!f.backOut&&f.species!=='clown'){const dy=f.goal.y-f.position.y,hd=Math.hypot(f.goal.x-f.position.x,f.goal.z-f.position.z);if(Math.abs(dy)>.05&&(hd<.3||hd<1.2&&Math.abs(dy)>hd*.3))forward.y=T.MathUtils.clamp(dy*1.5,-size*.3,size*.3);}
   // Just above the sand's clearance limit, the paired fins lift the body before
   // it moves on: rising sand ahead otherwise blocks every step, pinning the fish.
   if(!holding&&!grazing&&f.species!=='clown'&&f.position.y<sandHeight(f.position.x,f.position.z)+f.clearance+.035+.08)forward.y=Math.max(forward.y,size*.2);
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
   f.velocity.lerp(forward,1-Math.exp(-dt*(target?7:f.species==='clown'?7:holding?6:f.coasting&&distance>1.2?2:4)));
   const next=f.position.clone().addScaledVector(f.velocity,dt);
   const collision=this.fish.some(other=>other!==f&&next.distanceToSquared(other.position)<(f.radius+other.radius)**2);
   if(!collision&&(this.clearSegment(f.position,next,f.radius)||this.inCorridor(f,next))){f.position.copy(next);f.blockedTime=Math.max(0,f.blockedTime-dt);}
   else{
    // Glide along whatever blocks the step rather than stopping dead against it.
    const slid=f.corridor?null:this.slide(f,f.velocity.clone().multiplyScalar(dt));
    if(slid){f.velocity.copy(slid).sub(f.position).divideScalar(dt);f.position.copy(slid);f.blockedTime=Math.max(0,f.blockedTime-dt*.5);}
    else{f.velocity.multiplyScalar(.65);f.blockedTime+=dt;
     if(f.blockedTime>.65&&now>f.recoverUntil){f.recoverUntil=now+3;this.planSwim(f,i,true);f.blockedTime=0;}
    }
   }
   const swimming=f.velocity.length()/size,thrust=target||chasing?1:displaying?.85:holding?.3:f.coasting?.22:.65;
   f.tailRest=T.MathUtils.damp(f.tailRest,thrust,3.5,dt);
   f.group.position.copy(f.position);f.group.rotation.set(0,f.yaw,f.pitch,'YXZ');
   f.clock.value+=dt*2*Math.PI*profile.tailHz*f.individuality*(.48+f.tailRest*.52+Math.min(2,swimming)*.26)/7.5;
   f.effort.value=T.MathUtils.damp(f.effort.value,Math.min(1.7,swimming*.65),5,dt);
   // The black tang's tail stays quiet on pectoral-rowed patrols and joins in
   // fully for bursts, chases and the broadside display.
   f.waveGain.value=T.MathUtils.damp(f.waveGain.value,habit?.labriform&&(target||chasing||displaying)?1.05:profile.wave*(.38+.72*f.tailRest),5,dt);
   if(habit?.sails){
    // Sails stand fully raised to graze, hover and display; they fold partly
    // against the body as speed rises and most of the way in a burst.
    const fold=displaying||grazing||holding?0:target||chasing?.62:f.coasting?.1:.14+.3*Math.min(1,swimming/1.4);
    f.finFold.value=T.MathUtils.damp(f.finFold.value,fold,displaying?9:3.5,dt);
   }
   for(let j=0;j<f.pectoral.length;j++){
    const p=f.pectoral[j],angle=this.attachFin(f,p),pelvic=Boolean(p.userData.pelvic),side=Math.sign(p.userData.restZ);
    p.userData.flutterTime=(p.userData.flutterTime??f.phase+j*.87)+dt*2*Math.PI*profile.finHz*f.individuality*(pelvic?.4:1+swimming*(habit?.labriform?.35:.18))*(1+j*.035);
    const phase=p.userData.flutterTime;
    if(habit?.labriform){
     // Labriform rowing: a quick power stroke and a slower, feathered recovery.
     // Paired fins tuck for bursts and flare broadside during the display.
     const [restAngle,sweep]=pelvic?(displaying?[.36,.05]:[.14,.055]):target||chasing?[.12,.06]:displaying?[.42,.1]:holding?[.3,.16]:[.3,.22];
     p.userData.rest=T.MathUtils.damp(p.userData.rest??restAngle,restAngle,6,dt);p.userData.sweep=T.MathUtils.damp(p.userData.sweep??sweep,sweep,6,dt);
     p.rotation.y=angle+side*(p.userData.rest+p.userData.sweep*Math.sin(phase+.45*Math.sin(phase)));p.rotation.x=Math.cos(phase)*(pelvic?.025:.13);
     continue;
    }
    const amplitude=pelvic?.055:.13+.065*(holding?1:f.tailRest);
    p.rotation.y=angle+side*((pelvic?.14:.24)+amplitude*Math.sin(phase));p.rotation.x=Math.cos(phase*.91)* (pelvic?.025:.055);
   }
   if(habit?.camouflage){
    // Foxface coloration changes within seconds: dark when threatened or asleep.
    const dark=night||displaying;f.mottle.value=T.MathUtils.damp(f.mottle.value,dark?1:0,dark?1.6:1.3,dt);if(f.mottle.value<.002)f.mottle.value=0;
   }
   if(f.cocoon){
    // A mucus cocoon forms slowly around the sleeping wrasse in its cavity.
    const asleep=night&&holding&&f.position.distanceTo(f.shelter)<.6,cocoon=f.cocoon.material as T.MeshPhysicalMaterial;
    cocoon.opacity=T.MathUtils.damp(cocoon.opacity,asleep?.24:0,asleep?.3:2,dt);f.cocoon.visible=cocoon.opacity>.005;
   }
   const base=large(f.species)?.88:1.12;
   f.respiration+=dt*2*Math.PI*(base*(night?.78:1)+Math.min(f.effort.value,1.7)*.20)*(.93+.07*Math.sin(f.phase));
   // The jaws part on the final approach to a particle and snap as it is taken.
   const strike=(f.snap?Math.max(0,1-(distance-size*.5)/(size*.5))*.6:0)+(now-f.snapBite<.3?Math.sin(Math.PI*(now-f.snapBite)/.3)*1.1:0);
   this.breathe(f,(target?.alive?Math.max(0,1-mouth.distanceTo(target.position))*Math.max(0,Math.sin(now*18))*1.35:grazing?Math.max(0,jab)*1.4:0)+strike);
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
 /** Registers templates loaded after construction; gallery options load on demand. */
 addTemplates(templates:Map<Species,T.Group>){for(const [s,template] of templates)this.templates.set(s,template);}
 /** A translucent mucus cocoon, invisible until the wrasse sleeps in its cavity. */
 private makeCocoon(f:Fish){
  cocoonShape??=new T.SphereGeometry(1,32,18);
  const mesh=new T.Mesh(cocoonShape,new T.MeshPhysicalMaterial({color:'#e2edf3',transparent:true,opacity:0,roughness:.12,clearcoat:1,clearcoatRoughness:.08,iridescence:.35,depthWrite:false}));
  mesh.name='cocoon';mesh.scale.set(.66,.26,.18);mesh.visible=false;f.group.add(mesh);f.cocoon=mesh;
 }
 /** Where the watchman rests: facing open water, its tail over the entrance. */
 private watchPerch(f:Fish){
  const reach=f.group.scale.x*.3,p=f.home.clone().add(v(Math.cos(f.homeYaw)*reach,0,-Math.sin(f.homeYaw)*reach));
  p.y=sandHeight(p.x,p.z)+f.clearance+.006;return p;
 }
 /** The watchman's burrow: a dark opening in the sand ringed by small rubble. */
 private digBurrow(f:Fish){
  const size=f.group.scale.x,p=f.position;
  f.homeYaw=-Math.PI/2+(Math.random()-.5)*1.1;f.yaw=f.look=f.homeYaw;
  f.home.set(p.x,sandHeight(p.x,p.z),p.z);f.shelter.copy(f.home);
  const perch=this.watchPerch(f);if(this.free(perch,f.radius,f.clearance))p.copy(perch);else p.y=f.home.y+f.clearance+.006;
  f.group.position.copy(p);f.goal.copy(p);f.progressPosition.copy(p);f.mode='watching from burrow';f.until=this.clock+3+Math.random()*4;
  if(!burrowParts){
   // Radial falloff built from pixels, so no DOM canvas is needed.
   const n=64,data=new Uint8Array(n*n*4);
   for(let y=0;y<n;y++)for(let x=0;x<n;x++){const r=Math.hypot(x-n/2+.5,y-n/2+.5)/(n/2),i=(y*n+x)*4;data[i]=14;data[i+1]=11;data[i+2]=8;data[i+3]=r<1?Math.round(255*Math.min(1,1.25*(1-r)**.6)):0;}
   const map=new T.DataTexture(data,n,n);map.colorSpace=T.SRGBColorSpace;map.needsUpdate=true;
   // Irregular, rounded rubble in sand and shell tones, not faceted crystals.
   const pebble=new T.IcosahedronGeometry(1,2),q=pebble.getAttribute('position');
   for(let i=0;i<q.count;i++){const x=q.getX(i),y=q.getY(i),z=q.getZ(i),k=1+.18*Math.sin(x*5.1+y*3.7)*Math.cos(z*4.3-y*2.2);q.setXYZ(i,x*k,y*k*.82,z*k);}
   pebble.computeVertexNormals();
   burrowParts={mouth:new T.MeshBasicMaterial({map,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),pebble,rock:['#d4c7ad','#b3a68e','#e6ddca','#9c917e'].map(color=>new T.MeshStandardMaterial({color,roughness:.95}))};
  }
  const burrow=new T.Group();burrow.name='Watchman goby burrow';
  const opening=new T.Mesh(new T.CircleGeometry(size*.17,24),burrowParts.mouth);opening.rotation.x=-Math.PI/2;opening.position.set(f.home.x,f.home.y+.006,f.home.z);burrow.add(opening);
  for(let i=0;i<14;i++){
   const a=i/14*Math.PI*2+Math.random()*.5,r=size*(.18+Math.random()*.09),x=f.home.x+Math.cos(a)*r,z=f.home.z+Math.sin(a)*r,s=.004+Math.random()*.007;
   const pebble=new T.Mesh(burrowParts.pebble,burrowParts.rock[i%burrowParts.rock.length]);pebble.scale.set(s,s*.65,s*(.8+Math.random()*.4));pebble.position.set(x,sandHeight(x,z)+s*.2,z);pebble.rotation.set(Math.random()*.4,Math.random()*6.3,Math.random()*.4);pebble.receiveShadow=true;burrow.add(pebble);
  }
  burrow.userData.note={title:'Watchman goby burrow',description:'The yellow watchman goby perches at this sand burrow and retreats into it when threatened and at night. In the wild an alpheid shrimp digs and maintains such burrows and shares them with the goby.'};
  this.scene.add(burrow);this.notes.push(burrow);f.burrow=burrow;
 }
 /** Cryptocentrus cinctus: watches from its burrow, makes short hops to pick at
  * the sand or snap nearby food, dives in when a large or fast fish comes close,
  * peeks out, then emerges. It sleeps inside the burrow at night. */
 private updateWatchman(f:Fish,dt:number,night:boolean){
  const now=this.clock,size=f.group.scale.x,profile=marineBehavior.cinctus,stance=f.clearance+.006;
  const perch=this.watchPerch(f),burrowFloor=f.home.y-size*.42,peekY=f.home.y-size*.05;
  const others=this.fish.filter(o=>o!==f&&!o.hidden);
  const danger=(margin:number)=>others.some(o=>{
   const fast=o.velocity.length()/o.group.scale.x>1.4,big=o.radius>f.radius*1.3;
   return (big||fast)&&o.position.distanceTo(f.position)<f.radius+o.radius+margin+(big?.3:.18);
  });
  const outside=['watching from burrow','sifting sand','hopping','picking at sand','returning to burrow','darting for food'].includes(f.mode);
  if(outside&&(night||(now>=f.recoverUntil&&danger(0)))){f.mode='retreating into burrow';f.food=null;f.recoverUntil=now+2;}
  let target:Food|undefined;
  if(outside&&f.mode!=='retreating into burrow'&&!night&&now>=f.feedingUntil&&f.hunger>.15){
   // Food passing within a short dash of the burrow; it never leaves the area.
   let best=Infinity;
   for(const food of this.foods)if(food.alive){
    const dx=food.position.x-f.home.x,dz=food.position.z-f.home.z,dy=food.position.y-f.home.y,d=food.position.distanceToSquared(f.position);
    if(dx*dx+dz*dz<2.6&&dy>.05&&dy<1.5&&d<best&&this.clearSegment(f.position,food.position,f.radius*.8,f.clearance)){best=d;target=food;}
   }
   if(target)f.mode='darting for food';
  }
  if(f.mode==='darting for food'&&!target){f.mode='returning to burrow';f.goal.copy(perch);}
  f.food=target??null;
  let wantedYaw=f.look,wantedPitch=0,bite=0,speed=0,lift=false;
  switch(f.mode){
   case 'watching from burrow':
    f.goal.copy(perch);
    if(now>f.until){
     const r=Math.random();
     if(r<.5){
      for(let j=0;j<24;j++){
       const a=f.homeYaw+(Math.random()-.5)*2.4,reach=size*(.7+Math.random()),p=f.home.clone().add(v(Math.cos(a)*reach,0,-Math.sin(a)*reach));p.y=sandHeight(p.x,p.z)+stance;
       if(this.clearSegment(f.position,p,f.radius,f.clearance)&&others.every(o=>p.distanceToSquared(o.position)>(f.radius+o.radius+.03)**2)){f.goal.copy(p);f.mode='hopping';break;}
      }
     }else if(r<.75){f.mode='sifting sand';f.gobyCycle=now;}
     if(f.mode==='watching from burrow')f.until=now+3+Math.random()*5;
    }
    // Scanning: short head turns between still looks.
    if(f.mode==='watching from burrow'&&now>f.gobyCycle+1.4+(Math.sin(f.phase+now)*.5+.5)*1.4){f.gobyCycle=now;f.look=f.homeYaw+(Math.random()-.5)*1.1;}
    wantedYaw=f.look;break;
   case 'sifting sand':{
    // A mouthful of sand from in front of the perch, sifted out through the gills.
    const t=now-f.gobyCycle;wantedYaw=f.homeYaw;wantedPitch=t<.6?-.28:0;bite=t<.6?1.2*Math.sin(Math.PI*t/.6):0;
    if(t>1.6){f.mode='watching from burrow';f.until=now+2+Math.random()*4;f.gobyCycle=now;}
    break;}
   case 'hopping':
    speed=size*profile.burstBL*.8;
    if(Math.hypot(f.position.x-f.goal.x,f.position.z-f.goal.z)<.04){f.mode='picking at sand';f.gobyCycle=now;f.until=now+1.2+Math.random()*1.2;f.pecks++;}
    break;
   case 'picking at sand':{
    const t=(now-f.gobyCycle)%.7;wantedPitch=-.3*Math.max(0,Math.sin(Math.PI*t/.45));bite=wantedPitch<-.1?.8:0;
    if(now>f.until){f.mode='returning to burrow';f.goal.copy(perch);}
    break;}
   case 'returning to burrow':
    f.goal.copy(perch);speed=size*1.8;
    if(f.position.distanceTo(perch)<.035){f.mode='watching from burrow';f.look=f.homeYaw;f.until=now+3+Math.random()*5;}
    break;
   case 'darting for food':
    f.goal.copy(target!.position);speed=size*profile.burstBL;lift=true;
    break;
   case 'retreating into burrow':
    f.goal.set(f.home.x,f.home.y+stance,f.home.z);speed=size*profile.burstBL;
    if(Math.hypot(f.position.x-f.home.x,f.position.z-f.home.z)<.04){f.hidden=true;f.mode=night?'sleeping in burrow':'hidden in burrow';f.until=now+3+Math.random()*4;}
    break;
   case 'hidden in burrow':case 'sleeping in burrow':
    if(!night&&(f.mode==='sleeping in burrow'||now>f.until)){f.mode='peeking out';f.until=now+1.5+Math.random()*2;}
    else if(night)f.mode='sleeping in burrow';
    break;
   case 'peeking out':
    if(night||danger(.15)){f.mode='hidden in burrow';f.until=now+3;}
    else if(now>f.until)f.mode='emerging';
    if(now>f.gobyCycle+1.1){f.gobyCycle=now;f.look=f.homeYaw+(Math.random()-.5)*.9;}
    wantedYaw=f.look;
    break;
  }
  if(f.hidden){
   // Inside the burrow: head-first down the shaft, up to peek, then out.
   const targetY=f.mode==='peeking out'?peekY:f.mode==='emerging'?f.home.y+stance:burrowFloor,before=f.position.y;
   f.position.x=T.MathUtils.damp(f.position.x,f.home.x,10,dt);f.position.z=T.MathUtils.damp(f.position.z,f.home.z,10,dt);
   f.position.y=T.MathUtils.damp(f.position.y,targetY,f.mode==='emerging'?3:f.mode==='peeking out'?2.5:9,dt);
   wantedPitch=f.position.y<before-.0015?-.7:f.mode==='peeking out'||f.mode==='emerging'?.18:0;
   // Leave the shaft only at full stance: a body still below the sand clearance
   // would make every later step start inside the bed and be rejected.
   if(f.mode==='emerging'&&f.position.y>f.home.y+stance*.95){f.position.y=Math.max(f.position.y,f.home.y+stance);f.hidden=false;f.mode='returning to burrow';f.goal.copy(perch);}
   f.velocity.set(0,0,0);
  }else{
   const delta=f.goal.clone().sub(f.position),flat=Math.hypot(delta.x,delta.z);
   if(speed>0&&flat>.02)wantedYaw=Math.atan2(-delta.z,delta.x);
   if(lift)wantedPitch=T.MathUtils.clamp(Math.atan2(delta.y,Math.max(.01,flat)),-.35,.45);
   const turn=Math.atan2(Math.sin(wantedYaw-f.yaw),Math.cos(wantedYaw-f.yaw));
   // Pivot almost in place before moving: a target inside the turning circle
   // would otherwise be orbited forever at a constant heading error.
   speed*=Math.min(1,Math.max(flat,Math.abs(delta.y))/(size*.4))*Math.max(0,Math.cos(turn))**3;
   const forward=v(Math.cos(f.yaw),0,-Math.sin(f.yaw)).multiplyScalar(speed);
   if(lift)forward.y=T.MathUtils.clamp(delta.y*3,-size*.8,size*.8);
   f.velocity.lerp(forward,1-Math.exp(-dt*7));
   const next=f.position.clone().addScaledVector(f.velocity,dt),floor=sandHeight(next.x,next.z)+stance;
   // Ease over the sand, but never below it: on a rising slope a lagging height
   // would dip under the clearance and stall every step as blocked.
   if(!lift)next.y=Math.max(floor,T.MathUtils.damp(f.position.y,floor+(f.mode==='hopping'?.03:0),8,dt));else next.y=Math.max(next.y,floor);
   if(this.clearSegment(f.position,next,f.radius,f.clearance)&&others.every(o=>next.distanceToSquared(o.position)>(f.radius+o.radius)**2)){f.position.copy(next);f.blockedTime=0;}
   else{f.velocity.multiplyScalar(.4);f.blockedTime+=dt;if(f.blockedTime>.7){f.blockedTime=0;f.mode=f.mode==='retreating into burrow'?f.mode:'returning to burrow';f.goal.copy(perch);}}
   this.flexTurn(f,turn,dt,profile.turnRate,profile.curve);
   if(target){
    const mouth=f.mouth.position.clone().multiplyScalar(size).applyEuler(new T.Euler(0,f.yaw,f.pitch,'YXZ')).add(f.position);
    bite=Math.max(bite,Math.max(0,1-mouth.distanceTo(target.position)*4));
    if(mouth.distanceTo(target.position)<Math.max(.05,.14*size)){target.alive=false;this.eatCount++;f.hunger=Math.max(0,f.hunger-.13);f.energy=Math.min(1,f.energy+.055);f.food=null;f.feedingUntil=now+.6;f.mode='returning to burrow';f.goal.copy(perch);}
   }
  }
  if(f.hidden)this.flexTurn(f,Math.atan2(Math.sin(wantedYaw-f.yaw),Math.cos(wantedYaw-f.yaw)),dt,profile.turnRate,profile.curve);
  f.pitch=T.MathUtils.damp(f.pitch,wantedPitch,6,dt);
  f.coasting=speed===0;
  const moving=f.velocity.length()/size;
  f.group.position.copy(f.position);f.group.rotation.set(0,f.yaw,f.pitch,'YXZ');
  f.clock.value+=dt*(.5+moving*2.2);f.effort.value=T.MathUtils.damp(f.effort.value,Math.min(1.6,moving*.7),5,dt);
  f.waveGain.value=T.MathUtils.damp(f.waveGain.value,.25+Math.min(1.2,moving*1.6),6,dt);
  for(let j=0;j<f.pectoral.length;j++){
   // Broad pectorals fan steadily while it perches; the pelvic disc stays braced.
   const p=f.pectoral[j],angle=this.attachFin(f,p),pelvic=Boolean(p.userData.pelvic),side=Math.sign(p.userData.restZ);
   p.userData.flutterTime=(p.userData.flutterTime??f.phase+j*.87)+dt*2*Math.PI*profile.finHz*(pelvic?.25:1+moving*.4)*(1+j*.035);
   const phase=p.userData.flutterTime;
   // Pelvic fins splay outward and forward like feet that prop the goby up.
   p.rotation.y=angle+side*(pelvic?.22+.02*Math.sin(phase):.3+.14*Math.sin(phase));p.rotation.x=pelvic?-side*(.55+.03*Math.sin(phase)):Math.cos(phase*.9)*.06;
  }
  f.respiration+=dt*Math.PI*2*(night?.7:1);this.breathe(f,bite);
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
 anatomySnapshot(){return this.fish.map(f=>({species:f.species,model:f.group.userData.model,phase:f.clock.value,pectoral:f.pectoral.filter(p=>!p.userData.pelvic).map(p=>[p.rotation.x,p.rotation.y]),pelvic:f.pectoral.filter(p=>p.userData.pelvic).map(p=>[p.rotation.x,p.rotation.y]),gills:f.group.children.filter(o=>o.name==='gill').flatMap(g=>g.userData.pair?[g.userData.opening,-g.userData.opening]:[g.userData.opening]),mouth:f.mouth.scale.y,mouthOpening:f.mouthOpening.value,finFold:f.finFold.value,mottle:f.mottle.value}));}
 snapshot(){return {fish:this.fish.length,sandGrains:0,bites:this.eatCount,food:this.foods.filter(f=>f.alive).length,positions:this.fish.map(f=>({species:f.species,x:f.position.x,y:f.position.y,z:f.position.z,mode:f.mode,hostVisits:f.hostVisits,speed:f.velocity.length(),speedBL:f.velocity.length()/f.group.scale.x,energy:f.energy,hunger:f.hunger,coasting:f.coasting,heightAboveSand:f.position.y-sandHeight(f.position.x,f.position.z),pecks:f.pecks,goal:f.goal.toArray(),yaw:f.yaw,blocked:f.blockedTime})),obstacleOverlaps:this.fish.filter(f=>!f.hidden&&!this.free(f.position,f.radius,f.clearance)&&!this.inCorridor(f,f.position)).length,fishOverlaps:this.fish.reduce((n,f,i)=>n+(f.hidden?0:this.fish.slice(i+1).filter(o=>!o.hidden&&f.position.distanceToSquared(o.position)<(f.radius+o.radius-.01)**2).length),0)};}
}
