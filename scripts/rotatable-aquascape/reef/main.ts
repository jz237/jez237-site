import './style.css';
import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {AquariumWater} from '../lib/AquariumWater.ts';
import {buildAquariumGlass} from '../lib/AquariumGlass.ts';
import {ReflectionPool} from '../lib/ReflectionPool.ts';
import {AquariumLighting} from '../lib/AquariumLighting.ts';
import {CaptureScheduler} from '../lib/CaptureScheduler.ts';
import {AdaptiveEffects,effectProfiles} from '../lib/AdaptiveEffects.ts';
import {installFullscreen} from '../lib/Fullscreen.ts';
import {buildReef,reefClock} from './ReefScene.ts';
import {ReefFish} from './ReefFish.ts';

const app=document.querySelector<HTMLElement>('#app')!,container=document.querySelector<HTMLElement>('#scene')!;
const scene=new T.Scene();scene.background=new T.Color('#051525');scene.fog=new T.FogExp2('#071d32',.012);
const renderer=new T.WebGLRenderer({antialias:false,alpha:false,powerPreference:'high-performance',depth:false});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.shadowMap.autoUpdate=false;
container.appendChild(renderer.domElement);const camera=new T.PerspectiveCamera(31,1,.1,120);camera.position.set(0,4.05,17.7);
const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,2.67,0);controls.enableDamping=true;controls.dampingFactor=.08;controls.minDistance=7;controls.maxDistance=30;controls.minPolarAngle=.52;controls.maxPolarAngle=1.69;controls.maxAzimuthAngle=1.75;controls.minAzimuthAngle=-1.75;controls.enablePan=false;
const env=new T.PMREMGenerator(renderer),room=new RoomEnvironment();scene.environment=env.fromScene(room,.04).texture;scene.environmentIntensity=.32;room.dispose();env.dispose();
const ambient=new T.HemisphereLight('#b1d5ff','#303c52',.92);scene.add(ambient);
const key=new T.SpotLight('#c5d9ff',190,26,.91,.52,1.7);key.position.set(-3,8,3.5);key.target.position.set(-1,1,0);key.castShadow=true;key.shadow.mapSize.set(1536,1536);key.shadow.bias=-.00015;key.shadow.normalBias=.018;scene.add(key,key.target);
const blue=new T.SpotLight('#5289ff',165,24,.9,.6,1.7);blue.position.set(3,7.5,-.3);blue.target.position.set(1.5,1,0);scene.add(blue,blue.target);
const fill=new T.DirectionalLight('#96b9f3',.78);fill.position.set(1,4,7);scene.add(fill);
const reflections=new ReflectionPool(),water=new AquariumWater(reflections);scene.add(water);buildAquariumGlass(scene,reflections);
const reef=buildReef(scene),fish=new ReefFish(scene,reef.obstacles,reef.hosts);
const back=new T.Mesh(new T.PlaneGeometry(10.04,5.2),new T.ShaderMaterial({uniforms:{time:reefClock},vertexShader:'varying vec2 v;void main(){v=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:`varying vec2 v;uniform float time;void main(){
 float glow=pow(max(0.,1.-length((v-vec2(.5,.83))*vec2(1.,.65))),2.);
 float rays=pow(max(0.,sin(v.x*68.+v.y*8.+sin(time*.23)*.5)),14.)*v.y*.05;
 vec3 col=mix(vec3(.002,.008,.018),vec3(.008,.065,.17),glow)+vec3(.018,.07,.12)*rays;
 gl_FragColor=vec4(col,1.);#include <tonemapping_fragment>
 #include <colorspace_fragment>
}`.replace(';#include',';\n#include')}));back.position.set(0,2.8,-2.325);scene.add(back);

const cabinet=new T.Mesh(new T.BoxGeometry(10.46,.55,4.94),new T.MeshStandardMaterial({color:'#07131d',roughness:.3,metalness:.4}));cabinet.position.y=-.17;scene.add(cabinet);
const lower=new T.Mesh(new T.BoxGeometry(10.65,.09,5.08),new T.MeshStandardMaterial({color:'#173150',metalness:.75,roughness:.23}));lower.position.y=-.43;scene.add(lower);
const floor=new T.Mesh(new T.PlaneGeometry(150,150),new T.MeshStandardMaterial({color:'#06111b',roughness:.55,metalness:.2}));floor.rotation.x=-Math.PI/2;floor.position.y=-.5;scene.add(floor);
const lightBar=new T.Mesh(new T.BoxGeometry(9.7,.1,.64),new T.MeshStandardMaterial({color:'#192a38',metalness:.8,roughness:.3}));lightBar.position.set(0,5.89,-.25);scene.add(lightBar);
const emitter=new T.Mesh(new T.BoxGeometry(9.35,.014,.5),new T.MeshBasicMaterial({color:'#b9d7ff'}));emitter.position.set(0,5.835,-.25);scene.add(emitter);
// Soft volume shafts only: no solid cones or opaque blue overlay over the corals.
const shaftGroup=new T.Group();scene.add(shaftGroup);
for(let i=0;i<9;i++){
 const geo=new T.PlaneGeometry(.4+Math.random()*.3,4.75);const mat=new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,side:T.DoubleSide,uniforms:{time:reefClock},vertexShader:'varying vec2 v;void main(){v=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec2 v;uniform float time;void main(){float a=pow(sin(v.x*3.14159),2.)*smoothstep(0.,.9,v.y)*.023;gl_FragColor=vec4(.23,.47,.92,a);}' });
 const mesh=new T.Mesh(geo,mat);mesh.position.set(-4.2+i,3.06,-1.92);mesh.rotation.z=-.17;shaftGroup.add(mesh);
}
const lighting=new AquariumLighting(scene,camera),scheduler=new CaptureScheduler(),adaptive=new AdaptiveEffects();let paused=false,night=false,time=0,last=performance.now(),revision=0,frame=0,ready=false,effectMode='auto';let cameraGoal:T.Vector3|null=null;
const $=<E extends HTMLElement>(selector:string)=>document.querySelector<E>(selector)!;
const resize=()=>{const {width,height}=container.getBoundingClientRect();renderer.setSize(width,height);camera.aspect=width/height;
 // Frame tank itself, rather than header/footer already outside this canvas.
 const vfov=2*Math.atan(Math.max(3.52,5.9/camera.aspect)/17.7)*180/Math.PI;camera.fov=Math.max(24,vfov);camera.updateProjectionMatrix();lighting.resize(Math.round(width*renderer.getPixelRatio()),Math.round(height*renderer.getPixelRatio()));scheduler.invalidate();};
new ResizeObserver(resize).observe(container);resize();
function applyEffects(){const p=effectProfiles[effectMode==='full'?0:adaptive.level];lighting.setEffects(p.aoScale,p.contact,p.samples);reflections.setEffects(p.reflectionScale,p.samples);water.advancedReflections.value=p.waterTrace?1:0;scheduler.invalidate();$('#effects option[value="auto"]').textContent=`Auto · ${p.name.toLowerCase()}`;}
$('#effects').addEventListener('change',e=>{effectMode=(e.target as HTMLSelectElement).value;adaptive.reset();applyEffects();});
$('#feed').onclick=()=>{if(paused){paused=false;$('#pause').textContent='Pause';$('#pause').setAttribute('aria-pressed','false');}if(fish.feed())$('#status').textContent='Feeding · Watch for individual approaches and bites';};
$('#pause').onclick=()=>{paused=!paused;$('#pause').textContent=paused?'Resume':'Pause';$('#pause').setAttribute('aria-pressed',String(paused));};
$('#light').onclick=()=>{night=!night;$('#light').textContent=night?'Daylight':'Blue hour';$('#light').setAttribute('aria-pressed',String(night));revision++;};
installFullscreen(app,$<HTMLButtonElement>('#fullscreen'));
for(const button of Array.from(document.querySelectorAll<HTMLButtonElement>('[data-view]')))button.onclick=()=>{controls.target.set(0,2.67,0);controls.minDistance=7;document.querySelector('[data-view].active')?.classList.remove('active');button.classList.add('active');cameraGoal=new T.Vector3(...(button.dataset.view==='angle'?[11,6,17.5]:button.dataset.view==='side'?[20,4,4]:[0,4.05,17.7]) as [number,number,number]);};
controls.addEventListener('start',()=>{cameraGoal=null;});
const raycaster=new T.Raycaster(),pointer=new T.Vector2();let down=[0,0];renderer.domElement.addEventListener('pointerdown',e=>{down=[e.clientX,e.clientY];});
renderer.domElement.addEventListener('pointerup',e=>{
 if(Math.hypot(e.clientX-down[0],e.clientY-down[1])>5)return;const r=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);raycaster.setFromCamera(pointer,camera);
 const hits=raycaster.intersectObjects([...fish.notes,...reef.notes],true);for(const hit of hits){let o:T.Object3D|null=hit.object;while(o&&!o.userData.note)o=o.parent;if(o?.userData.note){const note=o.userData.note;$('#detail h2').textContent=note.title;$('#detail p').textContent=note.description;$('#detail').hidden=false;break;}}
});$('#close-detail').onclick=()=>{$('#detail').hidden=true;};
const sampleMs:number[]=[];let triangles=0;
function animate(now:number){requestAnimationFrame(animate);const elapsed=now-last;last=now;if(document.hidden)return;const dt=Math.min(elapsed/1000,.04);
 if(cameraGoal){camera.position.lerp(cameraGoal,1-Math.exp(-dt*4));if(camera.position.distanceTo(cameraGoal)<.025)cameraGoal=null;}controls.update();
 if(!paused){time+=dt;reefClock.value=time;fish.update(dt,night);}
 const l=night?.42:1;ambient.intensity=T.MathUtils.damp(ambient.intensity,.92*l,5,dt);key.intensity=T.MathUtils.damp(key.intensity,190*l,5,dt);blue.intensity=T.MathUtils.damp(blue.intensity,night?135:165,5,dt);fill.intensity=T.MathUtils.damp(fill.intensity,.78*l,5,dt);water.update(time,camera.position.y,l);
 scene.updateMatrixWorld(true);const ids=reflections.visible(camera).map(o=>o.uuid),selected=scheduler.select(ids,camera,String(revision),true,adaptive.level>1?2:1);renderer.shadowMap.needsUpdate=frame===0||frame%30===0;reflections.prepare(renderer,scene,camera,selected);scheduler.complete(selected);triangles=lighting.render(renderer,null);frame++;
 if(ready&&!paused&&effectMode==='auto'&&adaptive.observe(elapsed))applyEffects();sampleMs.push(elapsed);if(sampleMs.length>120)sampleMs.shift();
 if(frame%120===0&&fish.snapshot().food===0)$('#status').textContent=`${fish.fish.length} inhabitants · Living coral gardens`;
}
// Release diagnostics. Close-up inspection changes only the camera, not scene detail.
Object.assign(window,{reefQA:{snapshot:()=>({...fish.snapshot(),time,paused,ready,triangles,effects:effectProfiles[adaptive.level].name,fps:1000/(sampleMs.reduce((a,b)=>a+b,0)/sampleMs.length),drawCalls:renderer.info.render.calls,anemoneTentacles:reef.anemone.tentacles}),feed:()=>fish.feed(),inspectAnemones:()=>{cameraGoal=null;controls.minDistance=2;controls.target.set(3.05,1.56,.82);camera.position.set(3.15,2.45,4.8);controls.update();scheduler.invalidate();},inspectCorals:()=>{cameraGoal=null;controls.minDistance=3;controls.target.set(-2.85,2.6,-.1);camera.position.set(-2.85,3.45,4.9);controls.update();scheduler.invalidate();}}});
lighting.prepare(renderer).then(()=>{ready=true;$('#loading').remove();last=performance.now();requestAnimationFrame(animate);}).catch(e=>{$('#loading').textContent='The reef could not start. Please reload with WebGL enabled.';console.error(e);});

