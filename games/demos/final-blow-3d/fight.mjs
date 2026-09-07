import {FightEffects} from './fight-effects.mjs?v=15';
import {referenceMaterial} from './reference-materials.mjs?v=10';
import {retargetMotion} from './retarget-motion.mjs?v=09';
import {detailMaterial} from './character-materials.mjs?v=07';
import {RenderPass} from '../../2026-08-20/final-blow/renderer/vendor/jsm/postprocessing/RenderPass.js';
import {EffectComposer} from '../../2026-08-20/final-blow/renderer/vendor/jsm/postprocessing/EffectComposer.js';
import {SSAOPass} from '../../2026-08-20/final-blow/renderer/vendor/jsm/postprocessing/SSAOPass.js';
import {OutputPass} from '../../2026-08-20/final-blow/renderer/vendor/jsm/postprocessing/OutputPass.js';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {RoomEnvironment} from '../../2026-08-20/final-blow/renderer/vendor/jsm/environments/RoomEnvironment.js';
import {Combat,MOVES} from './combat.mjs';
const $=s=>document.querySelector(s),canvas=$('#game');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(Math.max(devicePixelRatio,2),2.5));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.95;
const scene=new THREE.Scene();scene.background=new THREE.Color('#141d2a');scene.fog=new THREE.Fog('#141d2a',13,35);
const viewHeight=3.35;const camera=new THREE.OrthographicCamera(-viewHeight*16/18,viewHeight*16/18,viewHeight/2,-viewHeight/2,.1,70);camera.position.set(0,2.22,9);camera.lookAt(0,1.52,0);
const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment();scene.environment=pmrem.fromScene(room,.04).texture;room.dispose();pmrem.dispose();scene.environmentIntensity=.3;
scene.add(new THREE.HemisphereLight(0xc7e3ff,0x30303b,.55));
function light(color,power,x,y,z){const l=new THREE.DirectionalLight(color,power);l.position.set(x,y,z);scene.add(l);return l;}
const key=light(0xffe2b8,2.8,-3,5,5);key.castShadow=true;key.shadow.mapSize.set(4096,4096);Object.assign(key.shadow.camera,{left:-3.2,right:3.2,top:3.8,bottom:-2.6,near:.1,far:25});key.shadow.normalBias=.008;key.shadow.bias=-.00015;
light(0x73cfff,2.8,4,4,-3);light(0xff895d,1.4,-4,3,-2);
function material(color,roughness=.7,metalness=0){return new THREE.MeshStandardMaterial({color,roughness,metalness});}
function box(w,h,d,x,y,z,mat){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;scene.add(o);return o;}
const concrete=material('#303841',.87),steel=material('#293541',.46,.65),dark=material('#111b28'),brass=material('#956638',.4,.65);
// A physical arena: all scenery shares the same fixed camera as the fighters.
box(22,.25,17,0,-.16,-2,concrete);
for(let x=-10;x<=10;x+=2)box(.013,.008,15,x,-.026,-2,steel);
for(let z=-8;z<6;z+=1.5)box(20,.008,.012,0,-.025,z,steel);
box(9,.02,4.8,0,-.025,0,material('#35404a',.56,.08));
for(const x of [-4.45,4.45])box(.06,.012,4.8,x,-.01,0,brass);
for(const z of [-2.35,2.35])box(8.9,.012,.055,0,-.01,z,brass);
const canvasTex=(w,h,draw)=>{const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=renderer.capabilities.getMaxAnisotropy();return t;};
const brick=canvasTex(1024,512,(g,w,h)=>{g.fillStyle='#272d35';g.fillRect(0,0,w,h);let seed=12;const r=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};for(let y=0;y<h;y+=32)for(let x=-64;x<w;x+=128){const ox=x+(y/32%2)*64;const v=38+r()*20;g.fillStyle=`rgb(${v+5},${v+2},${v})`;g.fillRect(ox+2,y+2,124,28);for(let i=0;i<120;i++){g.fillStyle='rgba(0,0,0,.07)';g.fillRect(ox+r()*128,y+r()*32,2,2);}}});brick.wrapS=brick.wrapT=THREE.RepeatWrapping;brick.repeat.set(3,2);
box(22,8,.4,0,3.8,-5.1,new THREE.MeshStandardMaterial({map:brick,roughness:1}));
for(const x of [-7,-4.6,4.6,7]){box(.24,6,.3,x,2.8,-4.65,steel);for(let y=.5;y<5;y+=1.1)box(.34,.12,.34,x,y,-4.62,brass);}
box(17,.3,.6,0,4.4,-4.55,steel);
const sign=canvasTex(1536,384,(g,w,h)=>{g.fillStyle='#0c1925';g.fillRect(0,0,w,h);g.strokeStyle='#e1af68';g.lineWidth=5;g.strokeRect(18,18,w-36,h-36);g.textAlign='center';g.fillStyle='#fff0c8';g.font='900 136px Arial';g.fillText('SOMERSET',w/2,181);g.font='32px Arial';g.fillStyle='#85bbc9';g.fillText('F I G H T   C L U B   /   P H I L A D E L P H I A',w/2,273);});
const signMat=new THREE.MeshStandardMaterial({map:sign,emissiveMap:sign,emissive:0xffffff,emissiveIntensity:.4,roughness:.7});box(3.4,.85,.12,0,3.9,-4.75,signMat);
for(const x of [-3.2,3.2]){const m=new THREE.MeshStandardMaterial({color:0xffc47c,emissive:0xffc47c,emissiveIntensity:3});box(.8,.055,.12,x,4.05,-4.2,m);const p=new THREE.PointLight(0xffb56a,5,7,2);p.position.set(x,3.9,-3.8);scene.add(p);}
for(const x of [-6,6]){box(1.5,1.1,.8,x,.55,-3.8,dark);box(1.6,.08,.88,x,1.13,-3.8,steel);}
// Mesh chain-link fence, set behind combat so limbs are never occluded.
const verts=[];for(let x=-10;x<10;x+=.35){verts.push(x,.15,-3.75,x+1.5,2.1,-3.75,x,.15,-3.75,x-1.5,2.1,-3.75);}const fenceGeo=new THREE.BufferGeometry();fenceGeo.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));scene.add(new THREE.LineSegments(fenceGeo,new THREE.LineBasicMaterial({color:'#64717b',transparent:true,opacity:.09})));
brick.repeat.set(9,5);
scene.children.filter(o=>o.isMesh&&o.material?.map===brick).forEach(o=>{o.material.color.setScalar(.23);o.material.envMapIntensity=.12;});
for(const x of [-2.8,2.8]){box(.14,3.6,.18,x,1.8,-3.8,steel);box(.028,3.1,.035,x,1.8,-3.68,new THREE.MeshStandardMaterial({color:x<0?0xffaa66:0x66d5ff,emissive:x<0?0xff8844:0x44bbff,emissiveIntensity:3}));}

const groundTexture=canvasTex(1024,1024,(g,w,h)=>{g.fillStyle='#343c43';g.fillRect(0,0,w,h);let seed=237;const r=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};for(let i=0;i<45000;i++){const v=30+r()*70;g.fillStyle=`rgba(${v},${v},${v},.18)`;g.fillRect(r()*w,r()*h,1+r()*4,1+r()*4);}for(let i=0;i<120;i++){g.strokeStyle='rgba(10,12,14,.14)';g.lineWidth=.5+r()*2;g.beginPath();let x=r()*w,y=r()*h;g.moveTo(x,y);for(let k=0;k<6;k++){x+=(r()-.5)*32;y+=r()*20;g.lineTo(x,y);}g.stroke();}});
groundTexture.wrapS=groundTexture.wrapT=THREE.RepeatWrapping;groundTexture.repeat.set(3,2);
scene.children.filter(o=>o.isMesh&&o.geometry.parameters?.width===9).forEach(o=>{o.material.map=groundTexture;o.material.bumpMap=groundTexture;o.material.bumpScale=.018;o.material.color.set('#b0b4bb');o.material.roughness=.8;o.material.needsUpdate=true;});
const loader=new GLTFLoader(),visuals=[],modelBytes=[0,0];let loaded=0;
const clips=['jab','hook','uppercut','roundhouse','high_kick','walk_fwd','walk_back','block','dodge','hit_body','hit_face','ko','victory','sweep','stance_punch'];
async function buildFighter(id,index){
 const highSource=true,variant="frames-study";
 const files={jez:'jez-59a6df17.glb',benny:'benny-a0579bf4.glb'};
 const g=await loader.loadAsync(`https://pub-26279ae8f18243e38be5748fbfb75f4c.r2.dev/games/final-blow-3d/v12/${files[id]}`,event=>{
  modelBytes[index]=event.loaded;
  $('#progress').textContent=`Downloading detailed fighters… ${Math.round(modelBytes.reduce((a,b)=>a+b,0)/1048576)} MB received`;
 });const model=g.scene;model.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.frustumCulled=false;const mats=Array.isArray(o.material)?o.material:[o.material];for(const m of mats){if(m.map)m.map.anisotropy=renderer.capabilities.getMaxAnisotropy();m.emissive?.set(0);if(!m.roughnessMap)m.roughness=.77;if(m.normalScale)m.normalScale.set(.35,.35);m.envMapIntensity=.65;m.onBeforeCompile=shader=>{shader.fragmentShader=shader.fragmentShader.replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\nfloat blueCloth=smoothstep(1.15,1.65,diffuseColor.b/max(diffuseColor.r,0.001));\nfloat darkCloth=1.0-smoothstep(0.05,0.14,max(max(diffuseColor.r,diffuseColor.g),diffuseColor.b));\nroughnessFactor=mix(roughnessFactor,max(roughnessFactor,0.78),max(blueCloth,darkCloth));');};}}});
 if(highSource)model.traverse(o=>{if(o.isMesh)for(const m of (Array.isArray(o.material)?o.material:[o.material])){if(m.userData.frameMaterial){m.roughness=.24;m.envMapIntensity=.8;m.onBeforeCompile=()=>{};}else if(!m.userData.hairStrands)referenceMaterial(m,id);else{m.roughness=.52;m.onBeforeCompile=()=>{};}}});
 if(!highSource)model.traverse(o=>{if(o.isMesh)for(const m of (Array.isArray(o.material)?o.material:[o.material]))detailMaterial(m);});
 model.updateMatrixWorld(true);
 const targetRest=new Map(),targetParents=new Map();model.traverse(o=>{if(o.isBone){targetRest.set(o.name,o.getWorldQuaternion(new THREE.Quaternion()));targetParents.set(o.name,o.parent?.name);}});
 const bindPositions=new Map();model.traverse(o=>{if(o.isBone)bindPositions.set(o.name,o.position.clone());});
 const bounds=new THREE.Box3().setFromObject(model),scale=(2.22*1.25)/bounds.getSize(new THREE.Vector3()).y;model.scale.setScalar(scale);model.position.y=-bounds.min.y*scale;model.position.x=-(bounds.min.x+bounds.max.x)*scale/2;model.position.z=-(bounds.min.z+bounds.max.z)*scale/2;
 const pivot=new THREE.Group();pivot.add(model);pivot.rotation.y=index?-Math.PI/2:Math.PI/2;scene.add(pivot);
 const mixer=new THREE.AnimationMixer(model),actions={},durations={};
 const loadedClips=await Promise.all(clips.map(async name=>{const a=await loader.loadAsync(`../../2026-08-20/final-blow/3d/fighters/${id}/anim-${name}.glb`);$('#progress').textContent=`Loading movement ${++loaded} / ${clips.length*2}`;return [name,["exact-rig","grip-study","hair-study","groom-study","transplant-study","frames-study","clean-frames-study"].includes(variant)?retargetMotion(a.scene,a.animations[0],targetRest,targetParents):a.animations[0]];}));
 const hipOrigin=loadedClips.find(([n])=>n==='jab')[1].tracks.find(t=>t.name.includes('Hips')&&t.name.endsWith('.position'))?.values;
 for(const [name,original] of loadedClips){const clip=original.clone();clip.name=name;for(const tr of clip.tracks)if(tr.name.endsWith('.position')){const v=tr.values,boneName=tr.name.slice(0,-9),bind=bindPositions.get(boneName),hips=boneName==='Hips';if(bind){const originY=hipOrigin?.[1]??v[1];for(let i=0;i<v.length;i+=3){v[i]=bind.x;v[i+2]=bind.z;v[i+1]=hips?bind.y+(v[i+1]-originY):bind.y;}}}

  durations[name]=clip.duration;actions[name]=mixer.clipAction(clip);actions[name].setLoop(['walk_fwd','walk_back'].includes(name)?THREE.LoopRepeat:THREE.LoopOnce);actions[name].clampWhenFinished=true;
 }
 // The opening jab pose gives a coherent combat guard, rather than a casual idle.
 const guard=THREE.AnimationUtils.subclip(actions.jab.getClip(),'guard',0,5,30);actions.idle=mixer.clipAction(guard);actions.idle.setLoop(THREE.LoopPingPong);actions.idle.timeScale=.35;
 const contacts=[],bodySamples=[],point=new THREE.Vector3();model.updateMatrixWorld(true);model.traverse(o=>{if(!o.isSkinnedMesh)return;const n=o.geometry.attributes.position.count;for(let k=0;k<n;k+=12){o.getVertexPosition(k,point);point.applyMatrix4(o.matrixWorld);if(point.y<.25)contacts.push({mesh:o,index:k});if(k%120===0)bodySamples.push({mesh:o,index:k});}});
 const profiles={};for(const [move,m] of Object.entries(MOVES)){if(move==='doublejab')continue;const a=actions[m.clip];mixer.stopAllAction();a.reset().play();let best=-Infinity,peak=.3;const names=['kick','high','sweep'].includes(move)?['LeftFoot','RightFoot']:['LeftHand','RightHand'];const point=new THREE.Vector3();for(let k=0;k<=60;k++){a.time=a.getClip().duration*k/60;mixer.update(0);pivot.updateMatrixWorld(true);for(const name of names){const bone=model.getObjectByName(name);if(!bone)continue;bone.getWorldPosition(point);const reach=point.x*(index?-1:1);if(reach>best){best=reach;peak=k/60;}}}const clip=a.getClip(),oldDuration=clip.duration,contact=Math.max(.05,Math.min(.9,peak))*oldDuration;
 // Trim unused lead-in/tail motion, then resample a continuous-speed time map.
 // Preserve the contact instant without a sudden velocity change at impact.
 const foot=['kick','high','sweep'].includes(move),start=Math.max(0,contact-(foot?.48:.30)),end=Math.min(oldDuration,contact+(foot?.70:.45));
 const left=(contact-start)/m.hit,right=(end-contact)/(m.duration-m.hit),join=Math.min(left,right);
 const hermite=(u,y0,y1,d0,d1,span)=>(2*u*u*u-3*u*u+1)*y0+(u*u*u-2*u*u+u)*span*d0+(-2*u*u*u+3*u*u)*y1+(u*u*u-u*u)*span*d1;
 for(const track of clip.tracks){const interpolant=track.createInterpolant(),size=track.getValueSize(),count=73,times=new Float32Array(count),values=new track.values.constructor(count*size);
  for(let j=0;j<count;j++){const time=m.duration*j/(count-1);times[j]=time;const source=time<=m.hit?hermite(time/m.hit,start,contact,left,join,m.hit):hermite((time-m.hit)/(m.duration-m.hit),contact,end,join,right,m.duration-m.hit);values.set(interpolant.evaluate(source),j*size);}
  track.times=times;track.values=values;
 }
 clip.resetDuration();durations[m.clip]=clip.duration;
 profiles[move]={...m,range:Math.max(.85*1.25,Math.min(1.65*1.25,best+.28*1.25))};}
 // Chain two fully retargeted jabs, preserving each strike's contact timing.
 const doubleClip=actions.jab.getClip().clone();doubleClip.name='double_jab';
 for(const tr of doubleClip.tracks){const size=tr.getValueSize();for(let j=0;j<tr.times.length;j++){const x=Math.max(0,(tr.times[j]-.23)/.07),u=Math.min(1,x*x*(3-2*x));if(!u)continue;const offset=j*size;if(size===4&&tr.name.endsWith('.quaternion')){const q=new THREE.Quaternion().fromArray(tr.values,offset).slerp(new THREE.Quaternion().fromArray(tr.values,0),u);q.toArray(tr.values,offset);}else for(let c=0;c<size;c++)tr.values[offset+c]=THREE.MathUtils.lerp(tr.values[offset+c],tr.values[c],u);}const n=tr.times.length,times=new Float32Array(n*2),values=new tr.values.constructor(tr.values.length*2);times.set(tr.times);values.set(tr.values);for(let k=0;k<n;k++)times[n+k]=tr.times[k]+.30;values.set(tr.values,tr.values.length);tr.times=times;tr.values=values;}
 doubleClip.resetDuration();actions.double_jab=mixer.clipAction(doubleClip);actions.double_jab.setLoop(THREE.LoopOnce);actions.double_jab.clampWhenFinished=true;durations.double_jab=doubleClip.duration;profiles.doublejab={...MOVES.doublejab,range:profiles.jab.range};
 mixer.stopAllAction();const v={pivot,model,mixer,actions,durations,profiles,bones:(()=>{const bones=[];model.traverse(o=>{if(o.isBone)bones.push(o);});return bones;})(),current:null,serial:-1,state:null,id,contacts,bodySamples,groundSamples:[...contacts,...bodySamples],baseY:model.position.y,groundY:0};visuals[index]=v;return v;
}
// Blend from the actual displayed pose, including interrupted reactions.
// Only one mixer action owns the target pose; expired fades cannot accumulate.
function play(v,name,duration){
 const a=v.actions[name]||v.actions.idle;if(a===v.current&&['idle','walk_fwd','walk_back'].includes(name))return;
 v.poseFrom=v.bones.map(b=>({position:b.position.clone(),quaternion:b.quaternion.clone()}));
 v.blendTime=0;v.blendDuration=v.current?(Object.values(MOVES).some(m=>m.clip===name)?.10:name==='hit_body'?.09:.16):0;
 v.mixer.stopAllAction();
 const attack=Object.values(MOVES).some(m=>m.clip===name);
 const rate=attack?1:name==='idle'?.35:name==='ko'?v.durations[name]/2.4:name==='victory'?v.durations[name]/2:Math.min(1.25,duration?v.durations[name]/duration:1);
 a.reset().setEffectiveWeight(1).setEffectiveTimeScale(rate);a.enabled=true;a.play();v.current=a;
}
let battle=new Combat(237),accumulator=0,lastTime=0,paused=false,speed=1,eventLife=0,sound=false,audio=null;
const effects=new FightEffects(scene);
function impact(event){effects.impact(event,battle.fighters[event.target],MOVES[event.move]);if(sound&&audio){const t=audio.currentTime,osc=audio.createOscillator(),gain=audio.createGain();osc.type='triangle';osc.frequency.setValueAtTime(event.type==='block'?220:110,t);osc.frequency.exponentialRampToValueAtTime(40,t+.13);gain.gain.setValueAtTime(.12,t);gain.gain.exponentialRampToValueAtTime(.001,t+.14);osc.connect(gain).connect(audio.destination);osc.start();osc.stop(t+.15);}}
function renderActors(dt,alpha){for(let i=0;i<2;i++){const f=battle.fighters[i],v=visuals[i];if(v.serial!==f.serial||v.state!==f.state){const name=f.state==='attack'?MOVES[f.move].clip:({walk:'walk_fwd',back:'walk_back',hurt:'hit_body'})[f.state]||f.state;play(v,name,['attack','hurt','block','dodge'].includes(f.state)?f.duration:f.state==='ko'?2.4:f.state==='victory'?2:0);v.serial=f.serial;v.state=f.state;}
 v.pivot.position.x=THREE.MathUtils.lerp(f.previousX,f.x,alpha);v.mixer.update(dt);
 if(v.blendDuration>0&&v.blendTime<v.blendDuration){v.blendTime+=dt;const x=Math.min(1,v.blendTime/v.blendDuration),u=x*x*(3-2*x);for(let k=0;k<v.bones.length;k++){const b=v.bones[k],from=v.poseFrom[k];b.position.lerpVectors(from.position,b.position,u);b.quaternion.slerpQuaternions(from.quaternion,b.quaternion,u);}}
 // Filter residual keyframe jitter in the displayed pose, using seconds rather
 // than frames so playback stays consistent on 30, 60, and 120 Hz displays.
 if(!v.displayPose)v.displayPose=v.bones.map(b=>({position:b.position.clone(),quaternion:b.quaternion.clone()}));
 const follow=f.state==='ko'?1:1-Math.exp(-dt/(f.state==='attack'?.045:.065));
 for(let k=0;k<v.bones.length;k++){const b=v.bones[k],shown=v.displayPose[k];shown.position.lerp(b.position,follow);shown.quaternion.slerp(b.quaternion,follow);b.position.copy(shown.position);b.quaternion.copy(shown.quaternion);}
 // Ground the skinned shoe soles, rather than the static bind-pose bounds.
 v.model.position.y=v.baseY;v.pivot.updateMatrixWorld(true);let sole=Infinity;const point=new THREE.Vector3();for(const sample of v.groundSamples){sample.mesh.getVertexPosition(sample.index,point);point.applyMatrix4(sample.mesh.matrixWorld);sole=Math.min(sole,point.y);}if(Number.isFinite(sole)){v.model.position.y-=sole+.012;v.groundY=sole;}
 v.pivot.updateMatrixWorld(true);effects.trail(i,v,f,dt);
}}
function ui(){for(let i=0;i<2;i++){$(`#hp${i}`).style.width=`${battle.fighters[i].hp}%`;$(`#wins${i}`).textContent=Array.from({length:2},(_,n)=>n<battle.wins[i]?'●':'○').join(' ');}$('#timer').textContent=String(Math.ceil(battle.time)).padStart(2,'0');$('#round').textContent=`ROUND ${battle.round}`;
 $('#banner').innerHTML=battle.phase==='intro'?(battle.phaseTime>1?`ROUND ${battle.round}<small>CPU EXHIBITION</small>`:'FIGHT'):battle.phase==='outro'?(battle.winner<0?'DRAW':`${battle.winner===0?'JEZ':'BENNY'} WINS`)+`<small>${battle.wins.some(n=>n===2)?'MATCH COMPLETE · NEW MATCH SHORTLY':'NEXT ROUND SHORTLY'}</small>`:'';
}
const composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));composer.renderTarget1.samples=4;composer.renderTarget2.samples=4;const occlusion=new SSAOPass(scene,camera,1,1,16);occlusion.kernelRadius=.16;occlusion.minDistance=.0003;occlusion.maxDistance=.035;composer.addPass(occlusion);composer.addPass(new OutputPass());let maximumQuality=true;
function resize(){const r=canvas.parentElement.getBoundingClientRect();renderer.setSize(r.width,r.height,false);camera.left=-viewHeight*r.width/r.height/2;camera.right=-camera.left;camera.updateProjectionMatrix();composer.setSize(r.width,r.height);}addEventListener('resize',resize);resize();
$('#pause').onclick=()=>{paused=!paused;$('#pause').textContent=paused?'Resume fight':'Pause fight';};
$('#restart').onclick=()=>{battle=new Combat((battle.seed+1)>>>0,visuals.map(v=>v.profiles));accumulator=0;effects.clear();visuals.forEach(v=>{v.serial=-1;v.state=null;});};
$('#quality').onchange=e=>{maximumQuality=e.target.value==='maximum';renderer.setPixelRatio(maximumQuality?Math.min(Math.max(devicePixelRatio,2),2.5):Math.min(devicePixelRatio,1.5));composer.setPixelRatio(renderer.getPixelRatio());occlusion.enabled=maximumQuality;resize();};
$('#effects').onclick=()=>{effects.reduced=!effects.reduced;effects.clear();$('#effects').textContent=effects.reduced?'Effects: reduced':'Effects: full';};$('#effects').textContent=effects.reduced?'Effects: reduced':'Effects: full';
$('#testEffects').onclick=()=>{effects.clear();for(let i=0;i<2;i++)effects.impact({type:i?'block':'hit',target:i,move:'straight'},battle.fighters[i],MOVES.straight);};
$('#speed').onchange=e=>speed=Number(e.target.value);
$('#sound').onclick=async()=>{audio??=new AudioContext();await audio.resume();sound=!sound;$('#sound').textContent=sound?'Sound on':'Sound off';};
$('#full').onclick=()=>document.fullscreenElement?document.exitFullscreen():document.querySelector('main').requestFullscreen();
document.addEventListener('visibilitychange',()=>{lastTime=0;accumulator=0;});
try{await Promise.all([buildFighter('jez',0),buildFighter('benny',1)]);battle.profiles=visuals.map(v=>v.profiles);$('#loading').hidden=true;
 let frames=0,frameTime=0,slowWindows=0;renderer.setAnimationLoop(t=>{if(document.hidden)return;let realDt=lastTime?Math.min((t-lastTime)/1000,.05):0;lastTime=t;let dt=paused?0:realDt*speed;accumulator+=dt;while(accumulator>=1/60){battle.step(1/60);accumulator-=1/60;}
 for(const event of battle.events.splice(0)){if(event.type==='hit'||event.type==='block'){impact(event);$('#event').textContent=event.type==='block'?'GUARD':`${MOVES[event.move].label||event.move.toUpperCase()}${event.combo>1?' · 2 HITS':''} · ${event.damage} DAMAGE`;eventLife=1.2;}else if(event.type==='fight')$('#event').textContent='CPU VS CPU';}
 eventLife-=dt;if(eventLife<0)$('#event').textContent='CPU VS CPU';renderActors(dt,accumulator*60);effects.update(dt);
 ui();composer.render();frames++;frameTime+=realDt;if(frameTime>1){const fps=frames/frameTime;slowWindows=fps<48?slowWindows+1:0;if(!maximumQuality&&slowWindows>=3&&renderer.getPixelRatio()>1){renderer.setPixelRatio(Math.max(1,renderer.getPixelRatio()-.25));resize();slowWindows=0;}$('#status').textContent=`${Math.round(frames/frameTime)} FPS · ${maximumQuality?'MAXIMUM':'BALANCED'} · FIXED CAMERA`;frameTime=0;frames=0;}
 });
 window.__fight3d={effects,inspectDetail:(i,height,zoom,angle=.15)=>{paused=true;const v=visuals[i];v.pivot.rotation.y=angle;v.pivot.updateMatrixWorld(true);camera.position.set(v.pivot.position.x,height,4);camera.lookAt(v.pivot.position.x,height,0);camera.zoom=zoom;camera.updateProjectionMatrix();occlusion.enabled=false;composer.render();},inspectHand:(i,side,angle=0)=>{const v=visuals[i],hand=v.model.getObjectByName(side),point=hand.getWorldPosition(new THREE.Vector3());camera.position.copy(point).add(new THREE.Vector3(Math.sin(angle)*2.2,.05,Math.cos(angle)*2.2));camera.lookAt(point);camera.zoom=6;camera.updateProjectionMatrix();occlusion.enabled=false;composer.render();},renderGeometry:()=>{paused=true;return visuals.map((v,i)=>{v.mixer.stopAllAction();v.actions.idle.reset().play();v.mixer.update(0);v.pivot.rotation.y=i?-.22:.22;v.pivot.position.x=i?.78:-.78;v.model.position.y=v.baseY;v.pivot.updateMatrixWorld(true);for(const [name,child,dir] of [['LeftArm','LeftForeArm',[.5,-1,.05]],['RightArm','RightForeArm',[-.5,-1,.05]],['LeftForeArm','LeftHand',[.1,-1,.25]],['RightForeArm','RightHand',[-.1,-1,.25]]]){const bone=v.model.getObjectByName(name),tip=v.model.getObjectByName(child);const bp=bone.getWorldPosition(new THREE.Vector3()),tp=tip.getWorldPosition(new THREE.Vector3()),from=tp.sub(bp).normalize(),to=new THREE.Vector3(...dir).normalize().applyQuaternion(v.pivot.quaternion);const q=bone.getWorldQuaternion(new THREE.Quaternion()).premultiply(new THREE.Quaternion().setFromUnitVectors(from,to));const parent=bone.parent.getWorldQuaternion(new THREE.Quaternion()).invert();bone.quaternion.copy(parent.multiply(q));v.pivot.updateMatrixWorld(true);}const result=[];v.model.traverse(o=>{if(!o.isSkinnedMesh)return;const positions=[],normals=[],uv=Array.from(o.geometry.attributes.uv.array),p=new THREE.Vector3(),nm=new THREE.Matrix3(),blend=new THREE.Matrix4(),world=new THREE.Matrix4();const matrices=o.skeleton.bones.map((bone,k)=>new THREE.Matrix4().multiplyMatrices(bone.matrixWorld,o.skeleton.boneInverses[k]));const ji=o.geometry.attributes.skinIndex,jw=o.geometry.attributes.skinWeight;for(let k=0;k<o.geometry.attributes.position.count;k++){o.getVertexPosition(k,p);p.applyMatrix4(o.matrixWorld);positions.push(p.x,p.y,p.z);blend.elements.fill(0);for(let h=0;h<4;h++){const j=ji.getComponent(k,h),w=jw.getComponent(k,h),m=matrices[j];for(let q=0;q<16;q++)blend.elements[q]+=m.elements[q]*w;}world.copy(o.matrixWorld).multiply(o.bindMatrixInverse).multiply(blend).multiply(o.bindMatrix);nm.getNormalMatrix(world);p.fromBufferAttribute(o.geometry.attributes.normal,k).applyMatrix3(nm).normalize();normals.push(p.x,p.y,p.z);}result.push({material:o.material.name,positions,normals,uv,indices:Array.from(o.geometry.index.array)});});return {id:v.id,meshes:result};});},inspectPose:(index,name,ratio,x)=>{paused=true;const v=visuals[index];v.mixer.stopAllAction();const a=v.actions[name];a.reset().setEffectiveWeight(1).play();a.time=ratio*a.getClip().duration;v.mixer.update(0);v.pivot.position.x=x;v.model.position.y=v.baseY;v.pivot.updateMatrixWorld(true);let sole=Infinity;const p=new THREE.Vector3();for(const sample of ((name==='ko'||name==='sweep')?v.bodySamples:v.contacts)){sample.mesh.getVertexPosition(sample.index,p);p.applyMatrix4(sample.mesh.matrixWorld);sole=Math.min(sole,p.y);}if(Number.isFinite(sole))v.model.position.y-=sole+.012;v.pivot.updateMatrixWorld(true);composer.render();return window.__fight3d.bounds()[index];},get ready(){return true},snapshot:()=>({phase:battle.phase,time:battle.time,round:battle.round,hits:battle.hits,blocks:battle.blocks,fighters:battle.fighters.map(f=>({...f})),meshes:visuals.map(v=>{let skins=0;v.model.traverse(o=>{if(o.isSkinnedMesh)skins++;});return {id:v.id,skins,action:v.current?.getClip().name};}),camera:camera.matrixWorld.toArray(),render:renderer.info.render}),step:(seconds)=>{for(let i=0;i<seconds*60;i++)battle.step(1/60);},pause:()=>{paused=true;},profiles:()=>visuals.map(v=>v.profiles),bounds:()=>visuals.map(v=>{v.pivot.updateMatrixWorld(true);const p=new THREE.Vector3(),b={left:1,right:-1,top:-1,bottom:1,sole:Infinity};for(const sample of v.bodySamples){sample.mesh.getVertexPosition(sample.index,p);p.applyMatrix4(sample.mesh.matrixWorld);p.project(camera);b.left=Math.min(b.left,p.x);b.right=Math.max(b.right,p.x);b.top=Math.max(b.top,p.y);b.bottom=Math.min(b.bottom,p.y);}for(const sample of v.contacts){sample.mesh.getVertexPosition(sample.index,p);p.applyMatrix4(sample.mesh.matrixWorld);b.sole=Math.min(b.sole,p.y);}return b;}),renderer};
}catch(e){$('#progress').textContent=`Unable to load the exhibition: ${e.message}. Please reload to retry.`;console.error(e);}
