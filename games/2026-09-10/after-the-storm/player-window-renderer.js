import {setRaceWater} from './race-water.js';
// Presentation only. This module never creates/steps a race or writes saves.
import * as T from './vendor/three.module.js';
import {makeSky,makeOcean,shared,skyColors} from './ocean.js';
import {makeCourseWorld} from './course-world.js';
import {getCourse} from './courses.js';
import {stuntCourse,rampCameraHeight} from './stunts.js';
import {makeJetSki} from './jetski.js';
import {makeStuntRider} from './stunt-rider.js';
import {makeCraftBeads} from './water-beads.js';
import {riderColourIndex} from './race-feedback.js';
import {ridingAttitude} from './rider-pose.js';
import {wipeoutPose} from './rider-actions.js';
import {chaseFrame,translateFollow} from './chase-camera.js';
import {barrierCamera} from './course-barriers.js';
import {passageCamera} from './course-passages.js';
import {mooredBoatCamera} from './moored-boats.js';
import {wave,waterLevel,craftFields} from './simulation.js';
import {wakeTrail} from './wake-field.js';
import {impactWaves} from './surface-impulses.js';
import {setLocalWater} from './local-water.js';
import {setWaterCharacter} from './water-character.js';
import {setCourseWaveTrain} from './course-wave-train.js';
import {frontEnabled,frontAt} from './weather-front.js';
import {surfStrength,surfSeed} from './surf-waves.js';
import {windSea} from './wave-model.js';
import {weatherUniforms,cloudScene} from './weather-light.js';
import {shadowDue,refractionSize} from './render-budget.js';
import {updateCraftLOD} from './mesh-lod.js';
import {makeFinishingEffects} from './finishing-effects.js';
import {makeShoreWash} from './shore-wash.js';
import {makeCrestSpray} from './crest-spray.js';
import {makeCurlingBreakers} from './curling-breakers.js';
import {makeBeachBreak} from './beach-break.js';
import {makeSpraySheets} from './spray-sheets.js';
import {sprayUniforms,sprayVertex,sprayFragment} from './spray-light.js';
import {sprayLaunch} from './hull-spray.js';
import {advanceSpray} from './spray-physics.js';
import {createWakeSampler} from './wake-sampler.js';
import {validDisplaySize} from './player-window-protocol.js';

// Display palette only. Importing race-core merely for these colors would
// load the simulation host and native solvers into this presentation window.
const riderColors=[0xe69344,0x4eb9da,0xe96479,0xb4d56b];

// Kept separate from WebGL so the actual high-resolution rider and complete
// parent transform can be checked without creating a second simulation. The
// physical DTO is already in craft-local WORLD units: apply yaw on boat and
// actual pitch/roll on body once, without modern bank, stunt or fall offsets.
export function updatePlayerWindowCraft(v,q,{time=0,dt=0}={}){
 const h=q.hydro,physical=!!q.nativeRiderPose,attitude=physical?{pitch:h.pitch,roll:h.roll}:ridingAttitude(v.ridingMotion,h,q.turn,q.speed,dt);
 v.boat.visible=true;v.boat.position.set(q.x,h.y,q.z);
 if(physical){v.boat.rotation.set(0,q.heading,0);v.body.rotation.set(attitude.pitch,0,attitude.roll);}
 else{v.boat.rotation.y=q.heading;v.body.rotation.x=attitude.pitch;v.body.rotation.z=attitude.roll;
  if(q.stunt.trick==='flip')v.body.rotation.x-=q.stunt.angle;else if(q.stunt.trick)v.body.rotation.z+=q.stunt.angle;}
 const movement={targetPose:q.nativeRiderPose,time,speed:q.speed,turn:q.turn,yawVelocity:q.yawVelocity,impact:h.impact,sprayExposure:q.sprayExposure||0,anticipation:h.anticipation,compression:h.compression,load:h.load,lean:q.riderLean||0,airborne:h.airborne,airTime:h.airTime,verticalSpeed:h.vy,pitch:h.pitch,roll:h.roll,rollVelocity:h.rollVelocity,pitchVelocity:h.pitchVelocity,waveLook:q.waveReading?.offset||0,wet:h.wet,dt,steering:q.turn*.3,wipeoutAmount:physical?0:Math.abs(wipeoutPose(q.wipeout).x)/1.65};
 v.stuntRig.update(physical?'':q.stunt.pose,q.stunt.poseTime,q.turn,movement);v.rider.visible=physical||!q.stunt.pose;v.updateRider?.(movement);
 v.handlebars.rotation.y=v.rider.userData.riderMotion?.steering??q.turn*.3;v.prop.rotation.y=-q.turn*.4;
 const fallen=physical?{x:0,y:0,z:0,pitch:0,roll:0}:wipeoutPose(q.wipeout);
 v.rider.position.set(fallen.x,fallen.y,fallen.z);v.rider.rotation.set(fallen.pitch,0,fallen.roll);
 return movement;
}

export function createPlayerWindowRenderer(canvas){
 const renderer=new T.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
 renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.shadowMap.autoUpdate=false;
 const scene=new T.Scene();scene.fog=new T.FogExp2(0xa3b7b6,.0018);
 const camera=new T.PerspectiveCamera(58,16/9,.15,1800),look=new T.Vector3(),goal=new T.Vector3(),target=new T.Vector3();
 const sun=new T.DirectionalLight(0xffedcc,3),ambient=new T.HemisphereLight(0xbad6e0,0x565039,1.25);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-125,right:125,top:125,bottom:-125,near:1,far:450});sun.shadow.bias=-.0003;sun.shadow.normalBias=.15;scene.add(sun,sun.target,ambient);
 const sky=makeSky(scene),envScene=new T.Scene();envScene.add(sky.clone());const pmrem=new T.PMREMGenerator(renderer);
 const ocean=makeOcean(renderer,scene,camera),finishing=makeFinishingEffects(scene),shoreWash=makeShoreWash(scene),crestSpray=makeCrestSpray(scene),breakers=makeCurlingBreakers(scene),beachBreak=makeBeachBreak(scene,ocean),forward=new T.Vector3();breakers.nearshore=false;
 const sheets=[makeSpraySheets(scene),makeSpraySheets(scene)],vessels=new Map(),wakeSampler=createWakeSampler();
 const count=2400,xyz=new Float32Array(count*3),alpha=new Float32Array(count),sizes=new Float32Array(count),particles=Array.from({length:count},()=>({life:0}));let cursor=0;
 const sprayGeo=new T.BufferGeometry();sprayGeo.setAttribute('position',new T.BufferAttribute(xyz,3));sprayGeo.setAttribute('alpha',new T.BufferAttribute(alpha,1));sprayGeo.setAttribute('size',new T.BufferAttribute(sizes,1));
 const sprayMat=new T.ShaderMaterial({uniforms:sprayUniforms,transparent:true,depthWrite:false,vertexShader:sprayVertex,fragmentShader:sprayFragment}),spray=new T.Points(sprayGeo,sprayMat);spray.frustumCulled=false;spray.userData.skipRefraction=true;scene.add(spray);
 const rainCount=900,rainPositions=new Float32Array(rainCount*6);for(let i=0;i<rainCount;i++){const x=(Math.random()-.5)*65,y=Math.random()*35,z=(Math.random()-.5)*65;rainPositions.set([x,y,z,x-.18,y+.45,z+.07],i*6);}
 const rainGeo=new T.BufferGeometry();rainGeo.setAttribute('position',new T.BufferAttribute(rainPositions,3));const rainMat=new T.LineBasicMaterial({color:0xc2dbe1,transparent:true,opacity:0,depthWrite:false}),rain=new T.LineSegments(rainGeo,rainMat);rain.userData.skipRefraction=true;rain.frustumCulled=false;scene.add(rain);
 let descriptor=null,course=null,world=null,environment=null,environmentTime=-Infinity,environmentStorm=-1,quality='high',lastTime=null,localWater=null,chase={},tracking={},renderCount=0,orbit=0,pitch=.22,zoom=8,cameraMode=0;
 function vessel(r){
  const key=riderColourIndex(r,descriptor.swapColours,descriptor.roster[0]===descriptor.roster[1]);if(vessels.has(key))return vessels.get(key);
  const index=key%4,color=key>=4?new T.Color(riderColors[index]).offsetHSL(.5,0,0).getHex():riderColors[index],v=makeJetSki(scene,{salvage:false,riderIndex:index});v.cargo.visible=false;v.winch.visible=false;
  const materials=new Map();v.boat.traverse(o=>{if(o.isMesh&&o.material.color&&[0xd95b24,0xb9542d].includes(o.material.color.getHex())){if(!materials.has(o.material)){const m=o.material.clone();m.color.setHex(color);materials.set(o.material,m);}o.material=materials.get(o.material);}});
  v.stuntRig=makeStuntRider(v.body,color,index);v.beads=makeCraftBeads(v.boat);v.ridingMotion={};v.landingId=null;vessels.set(key,v);return v;
 }
 function graphics(g){
  if(!g||!validDisplaySize(g)||!['high','medium','low'].includes(g.quality))return false;
  quality=g.quality;renderer.setPixelRatio(1);renderer.setSize(g.width,g.height,false);camera.aspect=g.width/g.height;camera.updateProjectionMatrix();ocean.setQuality(quality);
  const size=refractionSize(g.width,g.height,quality);ocean.refract.setSize(size.width,size.height);const dim=quality==='high'?1024:quality==='medium'?768:512;ocean.reflect.setSize(dim,dim);sky.material.uniforms.skySteps.value=quality==='high'?32:quality==='medium'?24:20;return true;
 }
 function clearEffects(){for(const p of particles)p.life=0;for(const v of vessels.values()){v.landingId=null;v.ridingMotion={};v.beads.reset();}ocean.resetFoam();if(course){finishing.reset(course);shoreWash.reset(course);crestSpray.reset();breakers.reset(course);beachBreak.reset(course);}}
 function init(value){
  if(!value||!['course','surf','calm','chop','storm'].includes(value.seaState)||!Array.isArray(value.roster)||value.roster.length!==2||value.roster.some(i=>!Number.isInteger(i)||i<0||i>3)||!Number.isInteger(value.difficulty)||value.difficulty<0||value.difficulty>3||!graphics(value.graphics))throw new Error('Invalid player view setup.');
  descriptor=value;course=getCourse(value.course,value.difficulty);if(course.id!==value.course)throw new Error('Unknown player view course.');if(value.freeRide)course=stuntCourse(course,{freeRide:true});
  if(course.geometryForPlayers)course={...course,...course.geometryForPlayers(2)};
  if(course.sourceObjectSelection)course={...course,playerCount:2,rocks:course.hazardsForPlayers(2),sourceDecorations:course.decorationsForPlayers?course.decorationsForPlayers(2):course.sourceDecorations};
  if(course.contactVolumesForRamps)course={...course,contactVolumes:course.contactVolumesForRamps(course.ramps)};
  setRaceWater(null);setWaterCharacter(course);setCourseWaveTrain(course.waveTrain);surfSeed.value=value.waveSeed;surfStrength.value=value.seaState==='surf'?1:0;windSea.value=['chop','storm'].includes(value.seaState)?1:0;frontEnabled.value=['surf','storm'].includes(value.seaState)?1:0;
  world?.dispose();world=makeCourseWorld(scene,course,ocean,{freeRide:!!value.freeRide});ocean.setVenue(course);chase={};tracking={};lastTime=null;localWater=null;orbit=0;cameraMode=0;environmentTime=-Infinity;clearEffects();
 }
 function spawn(r,kind,side){const i=cursor++%count,p=particles[i],q=sprayLaunch(r,kind,side);xyz.set([q.x,q.y,q.z],i*3);Object.assign(p,{mist:q.mist,atomize:q.atomize,initialSize:q.size,vx:q.vx,vy:q.vy,vz:q.vz,size:q.size,life:q.life,max:q.life});}
 function draw(frame){
  if(!world||!frame)return;const time=frame.time,dt=lastTime===null||frame.phase==='paused'||frame.phase==='results'?0:Math.max(0,Math.min(.1,time-lastTime)),first=lastTime===null;lastTime=time;
  const w=frame.water;setRaceWater(w.native??null);if(w.local)localWater=w.local;setLocalWater(localWater);waterLevel.value=w.level;
  wakeTrail.forEach((p,i)=>Object.assign(p,w.wake[i]??{power:0,time:-100}));impactWaves.forEach((p,i)=>Object.assign(p,w.impacts[i]??{amplitude:0,time:-100}));craftFields.forEach((p,i)=>Object.assign(p,w.craft[i]??{power:0}));
  const r=frame.racers[1],weather=frame.weather,storm=weather.storm,front=frontAt(camera.position.x,camera.position.z,time);
  shared.time.value=time;shared.storm.value=storm;shared.seaLevel.value=w.level;weatherUniforms.weatherTime.value=time;weatherUniforms.weatherStorm.value=storm;weatherUniforms.weatherSun.value.copy(skyColors.skySun.value);
  scene.fog.density=weather.fog+front*.0009;scene.fog.color.setHex(course.sky[0]);sun.color.setHex(course.theme==='resort'?0xffc782:0xffedcc);sun.intensity=weather.night?.22:(3.5-storm*2)*(1-front*.32);ambient.intensity=weather.night?.66:.78-storm*.12-front*.08;scene.environmentIntensity=weather.night?.45:.62;renderer.toneMappingExposure=weather.night?1.4:1.06;
  if(!environment||Math.abs(storm-environmentStorm)>.12||time-environmentTime>45){environment?.dispose();environment=pmrem.fromScene(envScene,.04,.1,2000);scene.environment=environment.texture;environmentTime=time;environmentStorm=storm;}
  for(const v of vessels.values())v.boat.visible=false;
  for(const q of frame.racers){
   const v=vessel(q),h=q.hydro;updatePlayerWindowCraft(v,q,{time,dt});v.beads.update(q,storm,dt);v.updateDash(q.speed,100);
   updateCraftLOD(v.boat,Math.hypot(camera.position.x-q.x,camera.position.y-h.y,camera.position.z-q.z),quality);
   if(v.landingId!==null&&v.landingId!==h.landingId&&dt>0){for(let i=0;i<Math.min(180,h.impact*22);i++)spawn(q,i%3===0?'landingMist':'impact',Math.random()<.5?-1:1);finishing.landing(q,camera.position,0);}v.landingId=h.landingId;
   if(dt>0&&q.speed>2&&frame.phase==='running'&&h.wet>.1){const n=Math.min(quality==='low'?18:40,Math.ceil(dt*q.speed*(quality==='low'?20:30)*h.wet));for(let i=0;i<n;i++){const jet=i%3===0;if(jet&&h.intake<.1)continue;spawn(q,jet?'jet':i%5===0?'mist':'chine',Math.random()<.5?-1:1);}}
  }
  if(first){camera.position.set(r.x-Math.sin(r.heading)*11,4,r.z-Math.cos(r.heading)*11);look.set(r.x+Math.sin(r.heading)*4,1,r.z+Math.cos(r.heading)*4);}
  translateFollow(tracking,r,camera.position,look);const cf=chaseFrame(chase,r,dt,{orbit,zoom:r.nativeCamera?zoom:cameraMode===1?6:cameraMode===2?19:zoom,pitch});goal.set(cf.position.x,cf.position.y,cf.position.z);target.set(cf.target.x,cf.target.y,cf.target.z);camera.position.lerp(goal,first?1:1-Math.exp(-dt*4));look.lerp(target,first?1:1-Math.exp(-dt*5));camera.fov+=(cf.fov-camera.fov)*(first?1:1-Math.exp(-dt*2.5));camera.updateProjectionMatrix();
  camera.position.y=Math.max(camera.position.y,wave(camera.position.x,camera.position.z,time,storm)+.85,rampCameraHeight(camera.position,course,time,storm));camera.position.copy(barrierCamera(course.crossbars,{x:r.x,y:r.hydro.y+.15,z:r.z},passageCamera(course.passage,look,camera.position,time,frame.passageOpenedAt)));camera.position.copy(mooredBoatCamera(course.mooredBoats,{x:r.x,y:r.hydro.y+.15,z:r.z},camera.position,time,storm));camera.up.fromArray(r.nativeCamera?.up??[0,1,0]);camera.lookAt(look);
  sky.position.copy(camera.position);sun.position.set(r.x+skyColors.skySun.value.x*260,skyColors.skySun.value.y*260,r.z+skyColors.skySun.value.z*260);sun.target.position.set(r.x,0,r.z);renderer.shadowMap.needsUpdate=shadowDue(renderCount,quality);
  world.update(time,storm,null,frame.passageOpenedAt,frame.racers,[1,camera.position,null],frame.breakables,frame.primaryBuoys??null);
  finishing.update(time,storm,camera.position,quality);shoreWash.update(time,storm,camera.position,quality);crestSpray.update(time,storm,camera.position,quality);breakers.update(time,storm,camera.position,quality);beachBreak.update(time,storm,camera.position,quality,camera.getWorldDirection(forward));sheets.forEach((sheet,i)=>sheet.update(frame.racers[i],time,storm));
  if(renderCount%60===0)cloudScene(scene);rain.position.set(camera.position.x,0,camera.position.z);const rainFactor=Math.max(0,(storm-.45)/.55,front*.85);rainMat.opacity=rainFactor*.3;rainGeo.setDrawRange(0,Math.floor(rainCount*rainFactor)*2);
  for(let i=0;i<rainCount;i++){const k=i*6;rainPositions[k]-=dt*(4+storm*8);rainPositions[k+1]-=dt*25;rainPositions[k+2]+=dt*3;if(rainPositions[k+1]<0){rainPositions[k]=(Math.random()-.5)*65;rainPositions[k+1]=35;rainPositions[k+2]=(Math.random()-.5)*65;}rainPositions[k+3]=rainPositions[k]-.18;rainPositions[k+4]=rainPositions[k+1]+.45;rainPositions[k+5]=rainPositions[k+2]+.07;}rainGeo.attributes.position.needsUpdate=true;
  wakeSampler.prepare(time,storm);for(let i=0;i<count;i++){const p=particles[i];if(p.life>0){p.life-=dt;advanceSpray(p,xyz,i*3,dt,storm,(x,z,wind)=>wave(x,z,time,storm,wind,wakeSampler.height)+.02,time);alpha[i]=Math.max(0,p.life/p.max)*(p.mist?.3:.8);sizes[i]=p.size;}else alpha[i]=0;}for(const a of Object.values(sprayGeo.attributes))a.needsUpdate=true;
  ocean.syncWake();ocean.updateFoam(dt,r.x,r.z);ocean.mat.uniforms.craft.value.set(r.x,r.z,r.heading,Math.min(1,r.speed/18)*r.hydro.wet);sprayUniforms.sprayProjection.value=canvas.height/(2*Math.tan(camera.fov*Math.PI/360));ocean.render();renderCount++;
 }
 return {init,graphics,draw,reset:clearEffects,camera(){cameraMode=(cameraMode+1)%3;orbit=0;},orbit(dx,dy){orbit-=dx*.005;pitch=Math.max(.08,Math.min(.9,pitch+dy*.003));},zoom(delta){zoom=Math.max(6,Math.min(25,zoom+delta*.01));},
  get details(){return {width:canvas.width,height:canvas.height,quality,course:course?.id,camera:camera.position.toArray(),drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,
   primaryBuoys:world?.root.userData.primaryBuoys??null,riders:[...vessels.entries()].filter(([,v])=>v.boat.visible).map(([color,v])=>({color,nativePhysical:!!v.rider.userData.nativePhysical}))};},
  dispose(){world?.dispose();finishing.dispose();ocean.dispose();environment?.dispose();pmrem.dispose();scene.traverse(o=>{o.geometry?.dispose();if(o.material){for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose?.();}});renderer.dispose();}};
}
