import {installReefShowroom} from './ReefShowroom.ts';
import {installReefLearning,type Stocking} from './ReefLearning.ts';
import {ReefTourCamera} from './ReefTour.ts';
import {stabilizeFishPasses} from './StableFishPasses.ts';
import {yieldBuild} from './BuildYield.ts';
import {pickNote} from './ReefIdentification.ts';
import {accelerateReefPicking} from './ReefPicking.ts';
import './style.css';
import {reefDrawOrderReady,optimizeReefDrawOrder} from './ReefDrawOrder.ts';
import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {installRoomLighting} from '../lib/RoomLighting.ts';
import {AquariumWater} from '../lib/AquariumWater.ts';
import {buildAquariumGlass} from '../lib/AquariumGlass.ts';
import {ReefReflections} from './ReefReflections.ts';
import {reefBackGlass} from './ReefBackGlass.ts';
import {AquariumLighting} from '../lib/AquariumLighting.ts';
import {CaptureScheduler} from '../lib/CaptureScheduler.ts';
import {AdaptiveEffects,effectProfiles} from '../lib/AdaptiveEffects.ts';
import {installFullscreen} from '../lib/Fullscreen.ts';
import {buildReef,loadReefAssets,reefClock} from './ReefScene.ts';
import {ReefFish,defaultPopulation} from './ReefFish.ts';
import {reefSuspension} from './ReefSuspension.ts';
import {applyReefOptics} from './ReefOptics.ts';
import {configureReefWater} from './ReefWater.ts';
import {ReefFishShadows} from './ReefFishShadows.ts';
import {loadMarineModels,baseMarineSpecies,optionalMarineSpecies,type MarineSpecies} from './MarineModels.ts';
import {ReefCleaners,loadCleanerModel,cleanerRockSurface,cleanerNote} from './ReefCleaners.ts';

const app=document.querySelector<HTMLElement>('#app')!,container=document.querySelector<HTMLElement>('#scene')!;
const scene=new T.Scene();scene.background=new T.Color('#051525');scene.fog=new T.FogExp2('#071d32',.012);
const renderer=new T.WebGLRenderer({antialias:false,alpha:false,powerPreference:'high-performance',depth:false});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.03;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFShadowMap;renderer.shadowMap.autoUpdate=false;
container.appendChild(renderer.domElement);const camera=new T.PerspectiveCamera(31,1,.1,120);camera.position.set(0,3.25,17.7);
const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,2.67,0);controls.enableDamping=true;controls.dampingFactor=.08;controls.minDistance=7;controls.maxDistance=30;controls.minPolarAngle=.52;controls.maxPolarAngle=1.69;controls.maxAzimuthAngle=1.75;controls.minAzimuthAngle=-1.75;controls.enablePan=false;
installRoomLighting(renderer,scene,.04);scene.environmentIntensity=.24;
const ambient=new T.HemisphereLight('#c3d0ff','#202c43',.38);scene.add(ambient);
const key=new T.SpotLight('#eef2ff',300,26,.91,.52,1.7);key.position.set(-1.8,7.2,.15);key.target.position.set(-1,1,0);key.castShadow=true;key.shadow.mapSize.set(1536,1536);key.shadow.bias=-.00015;key.shadow.normalBias=.018;key.shadow.radius=4.5;key.shadow.intensity=.82;scene.add(key,key.target);
const blue=new T.SpotLight('#5087ff',90,24,.9,.6,1.7);blue.position.set(3,7.5,-.3);blue.target.position.set(1.5,1,0);scene.add(blue,blue.target);
const fill=new T.DirectionalLight('#b1cbea',.45);fill.position.set(1,4,7);scene.add(fill);
const reflections=new ReefReflections(),water=new AquariumWater(reflections);configureReefWater(water);scene.add(water);const glassStart=scene.children.length;buildAquariumGlass(scene,reflections);const glassObjects=scene.children.slice(glassStart);
// Under actinic reef light the polished pane edges and joints glow blue, as in
// a rimless reef tank. Reef-only copies leave the planted aquarium unchanged.
{const glow=new Map<T.Material,T.Material>(),actinic=(m:T.Material)=>{let g=glow.get(m);if(!g){const c=(m as T.MeshPhysicalMaterial).clone();c.color.set('#a9c8ff');c.emissive.set('#2f6dff');c.emissiveIntensity=1.6;c.attenuationColor.set('#5d8cff');glow.set(m,c);g=c;}return g;};
 for(const o of glassObjects)if(o instanceof T.Mesh){if(Array.isArray(o.material))o.material=o.material.map((m,i)=>i<4?actinic(m):m);else if(o.geometry instanceof T.BoxGeometry)o.material=actinic(o.material);}
 // Light piped along the glass makes every outer edge a bright blue line with
 // a soft halo: one merged core and two merged additive halo shells.
 const shells=[[.011,'#8ab8ff',1],[.032,'#3d78ff',.2],[.07,'#2a5cff',.08]] as const,X=5.125,Z=2.385,low=.03,high=5.57;
 const corners=[[-X,-Z],[X,-Z],[X,Z],[-X,Z]],segments:[T.Vector3,T.Vector3][]=[];
 for(let i=0;i<4;i++){const [x,z]=corners[i],[nx,nz]=corners[(i+1)%4];segments.push([new T.Vector3(x,low,z),new T.Vector3(x,high,z)]);for(const y of [low,high])segments.push([new T.Vector3(x,y,z),new T.Vector3(nx,y,nz)]);}
 for(const [radius,color,opacity] of shells){
  const parts=segments.map(([a,b])=>{const g=new T.CylinderGeometry(radius,radius,a.distanceTo(b)+radius*2,10,1,true),mid=a.clone().add(b).multiplyScalar(.5);g.applyQuaternion(new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),b.clone().sub(a).normalize()));g.translate(mid.x,mid.y,mid.z);return g;});
  const line=new T.Mesh(mergeGeometries(parts),new T.MeshBasicMaterial({color,transparent:opacity<1,opacity,blending:opacity<1?T.AdditiveBlending:T.NormalBlending,depthWrite:opacity===1,side:T.DoubleSide}));
  for(const g of parts)g.dispose();line.name='Actinic glass edge glow';line.renderOrder=9;scene.add(line);
 }}
// The black tang and fish stocking run in the gallery and in Hidden Reef alike.
const stockLimit=36;
const fishSpecies:MarineSpecies[]=[...baseMarineSpecies,'rostratum'];
const population:[MarineSpecies,number][]=[defaultPopulation[0],['rostratum',1],...defaultPopulation.slice(1)];
const fishModelsPending=loadMarineModels(fishSpecies);
const cleanerModelPending=loadCleanerModel();
const reefAssets=loadReefAssets();
const bakeRockLife=new URLSearchParams(location.search).has('bakeRockLife');
const rockLifeAttachments=bakeRockLife?undefined:await fetch(new URL('./assets/rock-life/attachments.json',import.meta.url)).then(r=>{if(!r.ok)throw Error('Live-rock attachment data could not load');return r.json();});
performance.mark('reef-construction-start');
await yieldBuild();
const reef=await buildReef(scene,rockLifeAttachments,reefAssets);
performance.measure('reef-construction','reef-construction-start');
await reefDrawOrderReady;
performance.mark('reef-draw-order-start');
const drawOrderStats={meshes:0,triangles:0};
for(const object of reef.group.children){await yieldBuild();const stats=optimizeReefDrawOrder(object);drawOrderStats.meshes+=stats.meshes;drawOrderStats.triangles+=stats.triangles;}
performance.measure('reef-draw-order','reef-draw-order-start');
performance.mark('reef-picking-start');
const pickingStats={meshes:0,blocks:0,bytes:0};
for(const object of reef.group.children){await yieldBuild();const stats=accelerateReefPicking(object);pickingStats.meshes+=stats.meshes;pickingStats.blocks+=stats.blocks;pickingStats.bytes+=stats.bytes;}
performance.measure('reef-picking','reef-picking-start');
const fishModels=await fishModelsPending.catch(error=>{document.querySelector('#loading')!.textContent='The fish models could not load. Please reload to try again.';throw error;});
const cleaners=new ReefCleaners(scene,await cleanerModelPending,cleanerRockSurface(reef.group.getObjectByName('Porous living reef rock') as T.Mesh));
const fish=new ReefFish(scene,[...reef.obstacles,...cleaners.obstacles],reef.anemone.behavior.hosts.map(h=>h.center),fishModels,reef.anemone.behavior.hosts[0].scale,population);
const anemoneVisitors=fish.fish.filter(f=>f.species==='clown');
const reefDaylight={value:1};const fishShadows=new ReefFishShadows(fish,key.position,reefDaylight,stockLimit);scene.add(fishShadows.mesh);scene.add(reefSuspension(reefClock,reefDaylight));
const applyOptics=(o:T.Object3D)=>{if(o instanceof T.Mesh)for(const material of Array.isArray(o.material)?o.material:[o.material])if(material instanceof T.MeshStandardMaterial)applyReefOptics(material,reefClock,reefDaylight);};
reef.group.traverse(applyOptics);for(const inhabitant of fish.fish)inhabitant.group.traverse(applyOptics);
for(const cleaner of cleaners.animals)cleaner.root.traverse(applyOptics);
const fishPassStats=stabilizeFishPasses(scene);
const back=reefBackGlass(reflections,reefClock,reefDaylight);scene.add(back);

const cabinet=new T.Mesh(new T.BoxGeometry(10.46,.55,4.94),new T.MeshStandardMaterial({color:'#07131d',roughness:.3,metalness:.4}));cabinet.position.y=-.17;scene.add(cabinet);
const lower=new T.Mesh(new T.BoxGeometry(10.65,.09,5.08),new T.MeshStandardMaterial({color:'#173150',metalness:.75,roughness:.23}));lower.position.y=-.43;scene.add(lower);
const floor=new T.Mesh(new T.PlaneGeometry(150,150),new T.MeshStandardMaterial({color:'#06111b',roughness:.55,metalness:.2}));floor.rotation.x=-Math.PI/2;floor.position.y=-.5;scene.add(floor);
const lightBar=new T.Mesh(new T.BoxGeometry(9.7,.1,.64),new T.MeshStandardMaterial({color:'#192a38',metalness:.8,roughness:.3}));lightBar.position.set(0,5.89,-.25);scene.add(lightBar);
const emitter=new T.Mesh(new T.BoxGeometry(9.35,.014,.5),new T.MeshBasicMaterial({color:'#b9d7ff'}));emitter.position.set(0,5.835,-.25);scene.add(emitter);
// Soft volume shafts only: no solid cones or opaque blue overlay over the corals.
const shaftGroup=new T.Group();scene.add(shaftGroup);
for(let i=0;i<9;i++){
 const geo=new T.PlaneGeometry(.4+Math.random()*.3,4.75);const mat=new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,side:T.DoubleSide,uniforms:{time:reefClock,daylight:reefDaylight,phase:{value:i*2.399}},vertexShader:'varying vec2 v;void main(){v=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec2 v;uniform float time,daylight,phase;void main(){float center=.5+.08*sin(v.y*3.+time*.20+phase)*(1.-v.y);float envelope=exp(-pow((v.x-center)*4.,2.))*(1.-smoothstep(.30,.5,abs(v.x-.5)));float pulse=.73+.27*sin(v.y*5.-time*.28+phase);float a=envelope*smoothstep(0.,.9,v.y)*.1*pulse*daylight;gl_FragColor=vec4(.3,.5,.95,a);}' });
 const mesh=new T.Mesh(geo,mat);mesh.position.set(-4.2+i,3.06,-1.92);mesh.rotation.z=-.17;shaftGroup.add(mesh);
}
const lighting=new AquariumLighting(scene,camera),scheduler=new CaptureScheduler(),adaptive=new AdaptiveEffects();let paused=false,night=false,time=0,last=performance.now(),revision=0,frame=0,ready=false,effectMode='auto';let cameraGoal:T.Vector3|null=null;let suspended=false,contextLost=false,raf=0,idleFrames=6;
function requestFrame(){if(ready&&!raf&&!suspended&&!contextLost&&!document.hidden)raf=requestAnimationFrame(animate);}
function wake(){idleFrames=6;requestFrame();}
const tourCamera=new ReefTourCamera(camera.position,controls.target);
function cancelTourCamera(){tourCamera.cancel();controls.enableDamping=true;}
function visitTourStop(stop:number){
 cameraGoal=null;controls.enableDamping=false;controls.update();controls.minDistance=.8;
 document.querySelector('[data-view].active')?.classList.remove('active');
 tourCamera.start(stop,matchMedia('(prefers-reduced-motion: reduce)').matches);
 controls.update();scheduler.invalidate();wake();
}
const inspectReef=(subject:string)=>{
 cancelTourCamera();
 const qa=(window as any).reefQA;
 if(subject==='cleaners'){
  cameraGoal=null;controls.minDistance=.35;const center=cleaners.animals[0].home.clone().add(cleaners.animals[1].home).multiplyScalar(.5).add(new T.Vector3(0,.14,0));
  controls.target.copy(center);camera.position.copy(center).add(new T.Vector3(.22,.43,1.65));controls.update();scheduler.invalidate();wake();return;
 }
 const methods:Record<string,string>={anemones:'inspectAnemones',corals:'inspectCorals',outcrops:'inspectOutcrops',sand:'inspectSand',water:'inspectWater',polyps:'inspectPolyps',plates:'inspectPlates'};
 if(methods[subject])qa[methods[subject]]();else if(subject in fishNames&&fish.count(subject as MarineSpecies))qa.inspectFish(subject);wake();
};
const fishNames:Record<MarineSpecies,string>={rostratum:'Black tang',strigosus:'Kole tang',vulpinus:'Foxface rabbitfish',bispinosa:'Coral beauty angelfish',loricula:'Flame angelfish',hexataenia:'Six-line wrasse',cinctus:'Yellow watchman goby',tang:'Blue tang',semilarvatus:'Golden butterflyfish',clown:'Clownfish',anthias:'Anthias',chromis:'Blue-green chromis',gramma:'Royal gramma',goby:'Mandarin dragonet'};
const stockInfo:[MarineSpecies,string,number][]=[['rostratum','Zebrasoma rostratum',3],['strigosus','Ctenochaetus strigosus',3],['vulpinus','Siganus vulpinus',2],['bispinosa','Centropyge bispinosa',2],['loricula','Centropyge loricula',2],['hexataenia','Pseudocheilinus hexataenia',3],['cinctus','Cryptocentrus cinctus',2],['tang','Paracanthurus hepatus',3],['semilarvatus','Chaetodon semilarvatus',3],['clown','Amphiprion ocellaris',4],['anthias','Pseudanthias squamipinnis',12],['chromis','Chromis viridis',14],['gramma','Gramma loreto',3],['goby','Synchiropus splendidus',2]];
/** New animals join every per-scene system the original stocking was wired into. */
function restock(){
 anemoneVisitors.splice(0,anemoneVisitors.length,...fish.fish.filter(f=>f.species==='clown'));
 solidTargets.splice(0,solidTargets.length,...fish.notes,...cleaners.notes,...reef.notes,cabinet,lower,lightBar,emitter);
 fishShadows.update();$('#status').textContent=`${fish.fish.length} fish · 2 cleaner shrimp · Living coral gardens`;wake();
}
function addFish(s:MarineSpecies){const f=fish.add(s);if(f){f.group.traverse(applyOptics);if(f.burrow)f.burrow.traverse(applyOptics);stabilizeFishPasses(f.group);restock();}return f;}
/** Gallery options download their model on first use, once. */
const optionLoads=new Map<MarineSpecies,Promise<void>>();
function loadOption(s:MarineSpecies){
 if(fish.has(s))return Promise.resolve();
 let load=optionLoads.get(s);
 if(!load){load=loadMarineModels([s]).then(t=>fish.addTemplates(t));load.catch(()=>optionLoads.delete(s));optionLoads.set(s,load);}
 return load;
}
const stocking:Stocking={
 limit:stockLimit,total:()=>fish.fish.length,
 rows:()=>stockInfo.map(([id,latin,max])=>({id,name:fishNames[id],latin,count:fish.count(id),max})),
 add:id=>{const s=id as MarineSpecies,max=stockInfo.find(x=>x[0]===s)![2],name=fishNames[s].toLowerCase();
  if(fish.fish.length>=stockLimit)return `The display holds up to ${stockLimit} fish.`;
  if(fish.count(s)>=max)return `Up to ${max} × ${name} in this display.`;
  const place=()=>addFish(s)?s==='cinctus'?`Added a ${name}. Look for its burrow in the sand.`:s==='goby'?`Added a ${name}. Look for it near the bottom.`:`Added a ${name}. Look for it near the surface.`:`No clear water near the surface right now. Try again in a moment.`;
  return fish.has(s)?place():loadOption(s).then(place);},
 remove:id=>{const s=id as MarineSpecies;if(!fish.remove(s))return `No ${fishNames[s].toLowerCase()} to remove.`;restock();return `Removed a ${fishNames[s].toLowerCase()}.`;},
 reset:()=>{let missing=0;
  for(const [s] of stockInfo){const target=population.find(x=>x[0]===s)?.[1]??0;while(fish.count(s)>target)fish.remove(s);for(let n=fish.count(s);n<target;n++)if(!addFish(s))missing++;}
  restock();return missing?`Original stocking restored except ${missing} fish waiting for clear water.`:'Original stocking restored.';}
};
const learning=installReefLearning({stocking,present:subject=>!(subject in fishNames)||fish.count(subject as MarineSpecies)>0,inspect:inspectReef,note:subject=>subject==='cleaners'?cleanerNote:fish.fish.find(f=>f.species===subject)?.group.userData.note,view:()=>document.querySelector<HTMLButtonElement>('[data-view="front"]')!.click(),feed:()=>document.querySelector<HTMLButtonElement>('#feed')!.click(),light:value=>{if(night!==value)document.querySelector<HTMLButtonElement>('#light')!.click();},night:()=>night,tour:visitTourStop,cancelTour:cancelTourCamera});
const showroom=installReefShowroom({visibility:visible=>{suspended=!visible;last=performance.now();sampleMs.length=0;wake();},explore:subject=>{
 inspectReef(subject);
}});
document.addEventListener('visibilitychange',()=>{last=performance.now();sampleMs.length=0;wake();});
controls.addEventListener('change',wake);
function resumeEntry(){paused=false;if(parent===window)suspended=false;last=performance.now();sampleMs.length=0;document.querySelector('#pause')!.textContent='Pause';document.querySelector('#pause')!.setAttribute('aria-pressed','false');cancelAnimationFrame(raf);raf=0;wake();}
window.addEventListener('pageshow',event=>{if(event.persisted)resumeEntry();});
renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();contextLost=true;cancelAnimationFrame(raf);raf=0;});
renderer.domElement.addEventListener('webglcontextrestored',()=>{contextLost=false;frame=0;last=performance.now();scheduler.invalidate();wake();});
const $=<E extends HTMLElement>(selector:string)=>document.querySelector<E>(selector)!;
const resize=()=>{const {width,height}=container.getBoundingClientRect();renderer.setSize(width,height);camera.aspect=width/height;
 // Frame tank itself, rather than header/footer already outside this canvas.
 const vfov=2*Math.atan(Math.max(3.52,5.9/camera.aspect)/17.7)*180/Math.PI;camera.fov=Math.max(24,vfov);camera.updateProjectionMatrix();lighting.resize(Math.round(width*renderer.getPixelRatio()),Math.round(height*renderer.getPixelRatio()));scheduler.invalidate();wake();};
new ResizeObserver(resize).observe(container);resize();
function applyEffects(){wake();const p=effectProfiles[effectMode==='full'?0:adaptive.level];lighting.setEffects(p.aoScale,p.contact,p.samples);water.advancedReflections.value=p.waterTrace?1:0;reflections.setEffects(p.reflectionScale,p.samples);scheduler.invalidate();$('#effects option[value="auto"]').textContent=`Auto \u00b7 ${p.name.toLowerCase()}`;}
$('#effects').addEventListener('change',e=>{effectMode=(e.target as HTMLSelectElement).value;adaptive.reset();applyEffects();});
const feedReef=()=>fish.feed(reef.anemone.behavior.hosts.flatMap(h=>[h.strands[30].tip,h.strands[100].tip]));
$('#feed').onclick=()=>{wake();if(paused){paused=false;$('#pause').textContent='Pause';$('#pause').setAttribute('aria-pressed','false');}if(feedReef())$('#status').textContent='Feeding \u00b7 Watch fish bites and sinking anemone morsels';};
$('#pause').onclick=()=>{wake();paused=!paused;$('#pause').textContent=paused?'Resume':'Pause';$('#pause').setAttribute('aria-pressed',String(paused));};
$('#light').onclick=()=>{wake();night=!night;$('#light').textContent=night?'Daylight':'Blue hour';$('#light').setAttribute('aria-pressed',String(night));revision++;};
installFullscreen(app,$<HTMLButtonElement>('#fullscreen'));
for(const button of Array.from(document.querySelectorAll<HTMLButtonElement>('[data-view]')))button.onclick=()=>{cancelTourCamera();wake();controls.target.set(0,2.67,0);controls.minDistance=7;document.querySelector('[data-view].active')?.classList.remove('active');button.classList.add('active');cameraGoal=new T.Vector3(...(button.dataset.view==='angle'?[11,6,17.5]:button.dataset.view==='side'?[20,4,4]:[0,3.25,17.7]) as [number,number,number]);};
controls.addEventListener('start',()=>{cameraGoal=null;cancelTourCamera();});
const label=(object:T.Object3D,title:string,description:string)=>{object.userData.note={title,description};};
label(water,'Water surface','Ripples catch the aquarium lights and reflect the reef below. The water surface and its reflections change with your viewing angle.');
for(const glass of glassObjects)label(glass,'Aquarium water and glass','Clear glass encloses the water. Blue light scatters through suspended particles; the side panes reflect the reef and its inhabitants. Look through the glass and click a fish or colony to identify it.');
label(back,'Reflective rear glass','The back pane shows a subdued reflection of the reef. Reflected fish fade as they move toward the front of the aquarium.');
for(const o of [cabinet,lower])label(o,'Aquarium base and trim','The dark support and lower trim frame the glass aquarium.');
label(floor,'Surrounding room','The dark surface outside the aquarium provides a quiet backdrop for the illuminated reef.');
for(const o of [lightBar,emitter])label(o,'Reef aquarium light','An overhead light fixture illuminates the coral canopy and sends rippled light across the sand.');
const solidTargets:T.Object3D[]=[...fish.notes,...cleaners.notes,...reef.notes,cabinet,lower,lightBar,emitter];
const transparentTargets=[water,back,...glassObjects,floor];
const raycaster=new T.Raycaster(),pointer=new T.Vector2();
let gesture:{id:number;x:number;y:number;dragged:boolean}|null=null;
renderer.domElement.addEventListener('pointerdown',e=>{
 if(gesture){gesture.dragged=true;return;}if(!e.isPrimary||e.button!==0)return;
 gesture={id:e.pointerId,x:e.clientX,y:e.clientY,dragged:false};
});
renderer.domElement.addEventListener('pointermove',e=>{if(gesture&&Math.hypot(e.clientX-gesture.x,e.clientY-gesture.y)>5)gesture.dragged=true;});
renderer.domElement.addEventListener('pointercancel',()=>{gesture=null;});
renderer.domElement.addEventListener('pointerup',e=>{
 if(!gesture||gesture.id!==e.pointerId)return;const g=gesture;gesture=null;
 if(g.dragged||Math.hypot(e.clientX-g.x,e.clientY-g.y)>5||e.button!==0)return;
 const r=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);raycaster.setFromCamera(pointer,camera);
 const note=pickNote(raycaster,solidTargets,transparentTargets)||{title:'Open water and aquarium surroundings',description:'Blue-lit water and the dark surroundings frame the living reef. Click a visible animal, colony, rock, sand bank or aquarium feature for its field note.'};
 learning.close();$('#detail h2').textContent=note.title;$('#detail p').textContent=note.description;$('#detail').hidden=false;showroom.context(note.title);
});
$('#close-detail').onclick=()=>{$('#detail').hidden=true;};
document.addEventListener('keydown',e=>{if(e.key==='Escape')$('#detail').hidden=true;});
const sampleMs:number[]=[];let triangles=0;
function animate(now:number){raf=0;const elapsed=now-last;last=now;if(document.hidden||suspended)return;const dt=Math.min(elapsed/1000,.04);
 if(tourCamera.active){tourCamera.update(dt);if(!tourCamera.active)controls.enableDamping=true;}
 if(cameraGoal){camera.position.lerp(cameraGoal,1-Math.exp(-dt*4));if(camera.position.distanceTo(cameraGoal)<.025)cameraGoal=null;}controls.update();
 if(!paused){time+=dt;reefClock.value=time;fish.update(dt,night);cleaners.update(dt,fish.fish,night);reef.anemone.behavior.update(time,fish.foods,anemoneVisitors);fishShadows.update();}
 const l=night?.42:1;reefDaylight.value=T.MathUtils.damp(reefDaylight.value,night?.24:1,5,dt);ambient.intensity=T.MathUtils.damp(ambient.intensity,.34*l,5,dt);key.intensity=T.MathUtils.damp(key.intensity,245*l,5,dt);blue.intensity=T.MathUtils.damp(blue.intensity,night?95:115,5,dt);fill.intensity=T.MathUtils.damp(fill.intensity,.45*l,5,dt);water.update(time,camera.position.y,l);
 scene.updateMatrixWorld(true);
 // Cache only stationary reef geometry. Fish are omitted from this capture;
 // their broad sand penumbras follow them every frame in one instanced draw.
 if(frame===0){
  for(const inhabitant of fish.fish)inhabitant.group.visible=false;
  // Let a normal render initialize Three's light/render state before the shadow
  // pass. Calling shadowMap.render directly breaks after a context restoration.
  renderer.shadowMap.needsUpdate=true;
  try{lighting.render(renderer,null,false);}
  finally{for(const inhabitant of fish.fish)inhabitant.group.visible=true;}
 }
 const ids=reflections.visible(camera).map(o=>o.uuid),selected=scheduler.select(ids,camera,String(revision),true,adaptive.level>1?2:1);renderer.shadowMap.needsUpdate=false;reflections.prepare(renderer,scene,camera,selected);scheduler.complete(selected);triangles=lighting.render(renderer,null);frame++;
 idleFrames--;
 const settling=tourCamera.active||!!cameraGoal||Math.abs(reefDaylight.value-(night?.24:1))>.00001;
 if(!paused||settling||idleFrames>0)requestFrame();
 if(ready&&!paused&&effectMode==='auto'&&adaptive.observe(elapsed))applyEffects();sampleMs.push(elapsed);if(sampleMs.length>120)sampleMs.shift();
 if(frame%120===0&&fish.snapshot().food===0)$('#status').textContent=`${fish.fish.length} fish \u00b7 2 cleaner shrimp \u00b7 Living coral gardens`;
}
// Release diagnostics. Close-up inspection changes only the camera, not scene detail.
Object.assign(window,{reefQA:{snapshot:()=>({...fish.snapshot(),cleaners:cleaners.snapshot(),tourCamera:{moving:tourCamera.active,position:camera.position.toArray(),target:controls.target.toArray()},time,paused,suspended,renderFrames:frame,ready,triangles,drawOrderStats,pickingStats,fishPassStats,effects:effectProfiles[adaptive.level].name,fps:1000/(sampleMs.reduce((a,b)=>a+b,0)/sampleMs.length),drawCalls:renderer.info.render.calls,shadows:fishShadows.snapshot(),anemoneTentacles:reef.anemone.tentacles,hosts:reef.anemone.behavior.hosts.map(h=>({x:h.center.x,y:h.center.y,z:h.center.z,scale:h.scale})),rearGlass:{visible:back.visible,width:back.getRenderTarget().width,height:back.getRenderTarget().height},anemoneBehavior:reef.anemone.behavior.snapshot(),anemoneBackdropStats:reef.anemoneBackdropStats,rockLifeStats:reef.rockLifeStats,microLifeStats:reef.microLifeStats,footStats:reef.footStats,canopyStats:reef.canopyStats,polypStats:reef.polypStats,buttressStats:reef.buttressStats,rockStats:reef.rockStats,crustStats:reef.crustStats,flankStats:reef.flankStats,infillStats:reef.infillStats,optics:{time:reefClock.value,daylight:reefDaylight.value},anatomy:fish.anatomySnapshot()}),feed:feedReef,anemoneContactStudy:()=>{const b=reef.anemone.behavior,s=b.hosts[0].strands[40],p=b.tipAt(0,s,time,new T.Vector3());fish.foods.push({position:p,alive:true,age:0});},respirationStudy:(species='tang',phase=0,isolate=false)=>{if(isolate){const subject=fish.fish.find(f=>f.species===species)!;for(const f of fish.fish)f.group.visible=f===subject;reef.group.visible=false;fishShadows.mesh.visible=false;subject.position.set(0,3,1);subject.group.position.copy(subject.position);subject.yaw=subject.pitch=0;subject.group.rotation.set(0,0,0);cameraGoal=null;controls.minDistance=.5;controls.target.copy(subject.position);camera.position.copy(subject.position).add(new T.Vector3(0,.08,1.8));controls.update();scheduler.invalidate();}paused=true;$('#pause').textContent='Resume';$('#pause').setAttribute('aria-pressed','true');fish.respirationStudy(species as Parameters<typeof fish.respirationStudy>[0],phase);},studyView:(species='rostratum',azimuth=0,elevation=0,distance=1.6,offset:[number,number,number]=[0,0,0],height=2.6)=>{
  // Diagnostics: an isolated fish, centred in the tank, seen from any angle
  // (offset moves the camera's aim along the fish, for close-ups of the snout or
  // tail; height raises the fish, for example to just under the water surface).
  const subject=fish.fish.find(f=>f.species===species);if(!subject)return;
  subject.position.set(0,height,0);subject.group.position.copy(subject.position);subject.yaw=subject.pitch=0;subject.group.rotation.set(0,0,0);
  for(const f of fish.fish)f.group.visible=f===subject;reef.group.visible=false;fishShadows.mesh.visible=false;
  cameraGoal=null;controls.minDistance=.1;controls.minPolarAngle=0;controls.maxPolarAngle=Math.PI;controls.minAzimuthAngle=-Infinity;controls.maxAzimuthAngle=Infinity;
  controls.target.copy(subject.position).add(new T.Vector3(...offset));camera.position.copy(controls.target).add(new T.Vector3(Math.sin(azimuth)*Math.cos(elevation),Math.sin(elevation),Math.cos(azimuth)*Math.cos(elevation)).multiplyScalar(distance));
  controls.update();scheduler.invalidate();wake();
 },stock:()=>stocking?.rows(),addFish:(species:string)=>stocking?.add(species),removeFish:(species:string)=>stocking?.remove(species),resetStock:()=>stocking?.reset(),inspectFish:(species='clown')=>{const subject=fish.fish.find(f=>f.species===species);if(!subject)return;if(species==='cinctus'){
  // A burrow-dweller facing open water: a raised three-quarter front view.
  const ahead=new T.Vector3(Math.cos(subject.yaw),0,-Math.sin(subject.yaw)),side=new T.Vector3(ahead.z,0,-ahead.x);
  cameraGoal=null;controls.minDistance=.4;controls.target.copy(subject.position);camera.position.copy(subject.position).addScaledVector(ahead,.75).addScaledVector(side,.4).add(new T.Vector3(0,.32,0));controls.update();scheduler.invalidate();return;}
 cameraGoal=null;controls.minDistance=.55;controls.target.copy(subject.position);camera.position.copy(subject.position).add(new T.Vector3(Math.sin(subject.yaw)*1.6,.19,Math.cos(subject.yaw)*1.6));controls.update();scheduler.invalidate();},inspectAnemones:()=>{cameraGoal=null;controls.minDistance=2;controls.target.set(3.05,1.56,.82);camera.position.set(3.15,2.45,4.8);controls.update();scheduler.invalidate();},inspectOutcrops:()=>{cameraGoal=null;controls.minDistance=.5;controls.target.set(2.92,.48,1.56);camera.position.set(2.92,1.65,3.5);controls.update();scheduler.invalidate();},inspectPolyps:()=>{cameraGoal=null;controls.minDistance=.5;controls.target.set(2.18,.88,1.63);camera.position.set(2.18,1.8,3.4);controls.update();scheduler.invalidate();},inspectWater:()=>{cameraGoal=null;controls.minDistance=1;controls.target.set(0,4.6,0);camera.position.set(7,9,10);controls.update();scheduler.invalidate();},inspectSand:()=>{cameraGoal=null;controls.minDistance=1;controls.target.set(0,.2,1);camera.position.set(.1,2.9,4.8);controls.update();scheduler.invalidate();},inspectRear:()=>{cameraGoal=null;controls.minDistance=1;controls.target.set(-.45,1.2,-1.6);camera.position.set(-.35,2.6,3.4);controls.update();scheduler.invalidate();},inspectFlanks:()=>{cameraGoal=null;controls.minDistance=.5;controls.target.set(-3.02,2.68,-.1);camera.position.set(-2.7,3.25,2.1);controls.update();scheduler.invalidate();},inspectPlates:()=>{cameraGoal=null;controls.minDistance=.5;controls.target.set(-2.9,1.94,.48);camera.position.set(-2.9,1.62,3.35);controls.update();scheduler.invalidate();},inspectCorals:()=>{cameraGoal=null;controls.minDistance=3;controls.target.set(-2.85,2.6,-.1);camera.position.set(-2.85,3.45,4.9);controls.update();scheduler.invalidate();}}});
Promise.all([reef.assetsReady,lighting.prepare(renderer)]).then(()=>{ready=true;$('#loading').remove();last=performance.now();learning.ready();showroom.ready();resumeEntry();}).catch(e=>{$('#loading').textContent='The reef could not start. Please reload with WebGL enabled.';console.error(e);});
