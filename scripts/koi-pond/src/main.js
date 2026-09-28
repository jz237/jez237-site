import './style.css';
import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {Sky} from 'three/addons/objects/Sky.js';
import {buildPondScene} from './PondScene.js';
import {PondWater} from './PondWater.js';
import {KoiSchool} from './KoiMotion.js';
import {buildKoi} from './KoiModels.js';
import {inside} from './PondGeometry.js';
import {installGuide} from './Guide.js';
const $=s=>document.querySelector(s),container=$('#scene'),clock={value:0};
const renderer=new T.WebGLRenderer({antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.65));renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.0;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFShadowMap;renderer.shadowMap.autoUpdate=false;container.append(renderer.domElement);
const scene=new T.Scene();scene.background=new T.Color('#adbdad');scene.fog=new T.FogExp2('#758571',.018);
const camera=new T.PerspectiveCamera(46,1,.08,140);camera.position.set(5.4,6.8,7.4);
const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,-.1,0);controls.enableDamping=true;controls.dampingFactor=.065;controls.minDistance=1.3;controls.maxDistance=24;controls.maxPolarAngle=1.48;controls.minPolarAngle=.10;controls.enablePan=true;controls.maxTargetRadius=5;
const sky=new Sky();sky.scale.setScalar(120);sky.material.uniforms.turbidity.value=7;sky.material.uniforms.rayleigh.value=2;sky.material.uniforms.mieCoefficient.value=.004;const sunVector=new T.Vector3(-.6,.85,.3).normalize();sky.material.uniforms.sunPosition.value.copy(sunVector);scene.add(sky);
const envScene=new T.Scene();envScene.add(sky.clone());const pmrem=new T.PMREMGenerator(renderer);scene.environment=pmrem.fromScene(envScene,.04).texture;scene.environmentIntensity=.085;pmrem.dispose();
const sun=new T.DirectionalLight('#fff2d0',2.4);sun.position.set(-7,12,5);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-12;sun.shadow.camera.right=12;sun.shadow.camera.top=12;sun.shadow.camera.bottom=-12;sun.shadow.camera.near=1;sun.shadow.camera.far=35;sun.shadow.bias=-.0003;sun.shadow.normalBias=.035;scene.add(sun);const ambient=new T.HemisphereLight('#c4d5e2','#34402a',1.15);scene.add(ambient);
const garden=buildPondScene(scene,clock),school=new KoiSchool(),water=new PondWater(scene,camera,clock);
let koi,paused=matchMedia('(prefers-reduced-motion: reduce)').matches,evening=false,last=performance.now(),ready=false,raf=0,viewGoal=null,lookGoal=null,tracked=null,quality=1,fullQuality=false,slow=0,fast=0,warmup=4;
const foodMesh=new T.InstancedMesh(new T.SphereGeometry(.018,8,6),new T.MeshStandardMaterial({color:'#b38345',roughness:.85}),48);foodMesh.count=0;scene.add(foodMesh);const dummy=new T.Object3D();
const toast=text=>{const e=$('#toast');e.textContent=text;e.classList.add('visible');clearTimeout(toast.timer);toast.timer=setTimeout(()=>e.classList.remove('visible'),2800);};
function feed(){if(!ready)return;if(school.feed()){paused=false;$('#pause').textContent='Pause';$('#pause').setAttribute('aria-pressed','false');water.ripple(0,1,.55);toast('A few floating morsels. Watch who notices first.');wake();}else toast('Let the koi finish these morsels first.');}
function inspect(id){const f=school.fish[id];tracked=id;viewGoal=f.position.clone().add(new T.Vector3(.85,1.6,1.7));lookGoal=f.position.clone();$('#scene-label').textContent=f.variety.name+' · Watch the fins and traveling body wave';wake();}
const guide=installGuide({inspect,feed});
for(const b of document.querySelectorAll('[data-view]'))b.onclick=()=>{tracked=null;document.querySelector('.view-controls .selected')?.classList.remove('selected');b.classList.add('selected');const v=b.dataset.view;viewGoal=new T.Vector3(...(v==='overhead'?[.1,12,.7]:v==='waterline'?[1.1,1.12,3.0]:[5.4,6.8,7.4]));lookGoal=new T.Vector3(0,v==='waterline'?-.25:-.1,0);$('#scene-label').textContent='Seven koi. No two journeys alike.';wake();};
$('#quality').onclick=()=>{fullQuality=!fullQuality;quality=1;slow=fast=0;$('#quality').textContent=fullQuality?'Quality: full':'Quality: auto';$('#quality').setAttribute('aria-pressed',String(fullQuality));resize();};$('#feed').onclick=feed;$('#pause').onclick=()=>{paused=!paused;$('#pause').textContent=paused?'Resume':'Pause';$('#pause').setAttribute('aria-pressed',String(paused));wake();};$('#light').onclick=()=>{evening=!evening;$('#light').textContent=evening?'Daylight':'Evening';$('#light').setAttribute('aria-pressed',String(evening));renderer.shadowMap.needsUpdate=true;wake();};
$('#fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await $('#app').requestFullscreen();}catch{toast('Full screen is unavailable in this browser.');}};document.addEventListener('fullscreenchange',()=>{$('#fullscreen').textContent=document.fullscreenElement?'Exit full screen':'Full screen';$('#fullscreen').setAttribute('aria-pressed',String(Boolean(document.fullscreenElement)));resize();});
controls.addEventListener('start',()=>{viewGoal=lookGoal=null;tracked=null;wake();});controls.addEventListener('change',wake);
const ray=new T.Raycaster(),pointer=new T.Vector2(),plane=new T.Plane(new T.Vector3(0,1,0),0);let gesture;
renderer.domElement.addEventListener('pointerdown',e=>{gesture={x:e.clientX,y:e.clientY,id:e.pointerId,moved:false};});renderer.domElement.addEventListener('pointermove',e=>{if(gesture&&Math.hypot(e.clientX-gesture.x,e.clientY-gesture.y)>6)gesture.moved=true;});renderer.domElement.addEventListener('pointerup',e=>{const start=gesture;gesture=null;if(!start||start.id!==e.pointerId||start.moved||Math.hypot(e.clientX-start.x,e.clientY-start.y)>6)return;const rect=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);ray.setFromCamera(pointer,camera);const hits=koi?ray.intersectObjects(koi.groups.map(f=>f.root),true):[];if(hits.length){guide.show('koi',hits[0].object.userData.fishId);return;}const p=ray.ray.intersectPlane(plane,new T.Vector3());if(p&&inside(p.x,p.z)){water.ripple(p.x,p.z);wake();}});renderer.domElement.addEventListener('pointercancel',()=>gesture=null);
function resize(){const {width,height}=container.getBoundingClientRect();camera.aspect=width/height;camera.fov=width<700?57:46;camera.updateProjectionMatrix();renderer.setSize(width,height);const size=renderer.getDrawingBufferSize(new T.Vector2());water.resize(Math.round(size.x*quality),Math.round(size.y*quality));water.uniforms.size.value.copy(size);wake();}
new ResizeObserver(resize).observe(container);
function wake(){if(ready&&!raf&&!document.hidden)raf=requestAnimationFrame(animate);}
document.addEventListener('visibilitychange',()=>{last=performance.now();warmup=4;wake();});
function animate(now){raf=0;const raw=(now-last)/1000,dt=Math.min(raw,.04);last=now;if(document.hidden)return;
 if(!paused){clock.value+=dt;school.update(dt);koi.update();garden.update(clock.value);foodMesh.count=Math.min(48,school.food.length);school.food.slice(0,48).forEach((f,i)=>{dummy.position.copy(f.position);dummy.rotation.set(0,0,0);dummy.scale.setScalar(1);dummy.updateMatrix();foodMesh.setMatrixAt(i,dummy.matrix);});foodMesh.instanceMatrix.needsUpdate=true;}
 if(tracked!==null){const f=school.fish[tracked];viewGoal=f.position.clone().add(new T.Vector3(.75,1.65,1.9));lookGoal=f.position.clone();}
 if(viewGoal){camera.position.lerp(viewGoal,1-Math.exp(-dt*3.2));controls.target.lerp(lookGoal,1-Math.exp(-dt*3.2));if(tracked===null&&camera.position.distanceTo(viewGoal)<.015)viewGoal=lookGoal=null;}controls.update();
 sun.intensity=T.MathUtils.damp(sun.intensity,evening?1.10:2.4,3,dt);sun.color.lerp(new T.Color(evening?'#ffc995':'#fff2d0'),1-Math.exp(-dt*3));ambient.intensity=T.MathUtils.damp(ambient.intensity,evening?.60:1.15,3,dt);
 water.uniforms.evening.value=evening?1:0;scene.updateMatrixWorld(true);water.capture(renderer);renderer.render(scene,camera);renderer.shadowMap.needsUpdate=false;
 if(warmup>0)warmup-=dt;else if(!fullQuality&&!paused&&raw<.5){slow=raw>.045?slow+raw:Math.max(0,slow-raw);fast=raw<.021?fast+raw:0;if(slow>6&&quality> .64){quality=.64;slow=0;resize();}if(fast>18&&quality<1){quality=1;fast=0;resize();}}
 if(!paused||viewGoal||Math.abs(sun.intensity-(evening?1.10:2.4))>.001)wake();
}
try{koi=await buildKoi(scene,school);koi.update();renderer.shadowMap.needsUpdate=true;ready=true;$('#pause').textContent=paused?'Resume':'Pause';$('#pause').setAttribute('aria-pressed',String(paused));$('#loading').remove();resize();last=performance.now();wake();}catch(error){console.error(error);$('#loading').innerHTML='<p>The garden could not load.</p><small>Please reload in a browser with WebGL enabled.</small>';}
