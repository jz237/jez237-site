import * as THREE from 'three';
import {GLTFLoader} from './vendor/GLTFLoader.js';
import {MeshoptDecoder} from './vendor/meshopt_decoder.module.js';
import {finishMaterial,studioEnvironment} from './materials.js';
import {CockpitDisplay} from './cockpit-display.js';
const $=id=>document.getElementById(id),host=$('cockpit-viewport'),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let scene,renderer,camera,model,screenTexture,instrumentTexture,centerScreen,instrumentScreen,sky,fill,beam,airflow,software,view='driver',yaw=0,pitch=-.18,fov=65,transition=null,last=performance.now(),ready=false;
const presets={driver:{position:[.38,1.14,-.15],target:[.05,.91,1.2],fov:65,caption:'The view from behind the yoke.'},display:{position:[.02,1.02,.02],target:[0,.929,.59],fov:41,caption:'The center touchscreen. Click a control, or open the full display.'},yoke:{position:[.41,1.07,-.12],target:[.38,.87,.61],fov:43,caption:'The sculpted yoke and illuminated instruments.'},passenger:{position:[-.34,1.16,-.25],target:[.1,.86,.76],fov:72,caption:'Across the dashboard, console and front cabin.'}};
Object.assign(presets,{seats:{position:[.02,1.2,.48],target:[.38,.82,-.18],fov:57,caption:'Seat bolsters, headrest and upholstery seams.'},door:{position:[.32,1.02,-.03],target:[.76,.78,.35],fov:52,caption:'Driver’s door: armrest, trim and stitched surfaces.'},pedals:{position:[.32,.70,.10],target:[.42,.37,.77],fov:49,caption:'A closer look into the driver’s footwell.'},console:{position:[.33,1.02,-.1],target:[0,.67,.30],fov:49,caption:'The center console, storage surfaces and armrest.'}});
if(new URLSearchParams(location.search).has('tour'))document.documentElement.classList.add('tour-embed');
const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2(),pointers=new Map();let gesture=null,pinch=0;
const clusterCanvas=document.createElement('canvas');clusterCanvas.width=4096;clusterCanvas.height=512;const cluster=clusterCanvas.getContext('2d');
try{init();await load();}catch(error){console.error(error);$('cockpit-loading').hidden=true;$('cockpit-error').hidden=false;}
function init(){
 scene=new THREE.Scene();scene.background=new THREE.Color('#b6c9d4');scene.fog=new THREE.Fog('#b6c9d4',18,65);
 renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1;host.append(renderer.domElement);
 camera=new THREE.PerspectiveCamera(65,1,.012,100);scene.environment=studioEnvironment(renderer);scene.environmentIntensity=.6;
 sky=new THREE.HemisphereLight('#edf6ff','#54616c',1.8);scene.add(sky);fill=new THREE.PointLight('#f1f5ff',2.1,3.2,0);fill.position.set(.1,1.23,-.05);scene.add(fill);
 const sun=new THREE.DirectionalLight('#ffeed4',2.1);sun.position.set(-8,12,10);scene.add(sun);beam=new THREE.SpotLight('#c5defb',0,25,.6,.7,1);beam.position.set(0,.75,2.5);beam.target.position.set(0,0,12);scene.add(beam,beam.target);
 environment();software=new CockpitDisplay($('touchscreen-host'),applySoftware);
 screenTexture=new THREE.CanvasTexture(software.canvas);screenTexture.colorSpace=THREE.SRGBColorSpace;screenTexture.anisotropy=renderer.capabilities.getMaxAnisotropy();instrumentTexture=new THREE.CanvasTexture(clusterCanvas);instrumentTexture.colorSpace=THREE.SRGBColorSpace;instrumentTexture.anisotropy=8;
 new ResizeObserver(resize).observe(host);resize();bind();renderer.setAnimationLoop(tick);
}
function environment(){
 const pavement=new THREE.Mesh(new THREE.PlaneGeometry(160,160),new THREE.MeshStandardMaterial({color:'#687780',roughness:1}));pavement.rotation.x=-Math.PI/2;pavement.position.y=-.045;scene.add(pavement);
 const road=new THREE.Mesh(new THREE.PlaneGeometry(7,85),new THREE.MeshStandardMaterial({color:'#34414b',roughness:1}));road.rotation.x=-Math.PI/2;road.position.set(0,-.04,33);scene.add(road);
 for(let z=7;z<55;z+=5){const stripe=new THREE.Mesh(new THREE.BoxGeometry(.09,.006,2.3),new THREE.MeshBasicMaterial({color:'#d9decf'}));stripe.position.set(0,-.026,z);scene.add(stripe);}
 for(let i=0;i<12;i++){
  const side=i%2?1:-1,z=7+Math.floor(i/2)*7,x=side*(5.3+(i%3)*.3);
  const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.11,.16,2.6,10),new THREE.MeshStandardMaterial({color:'#5b5145',roughness:1}));trunk.position.set(x,1.3,z);scene.add(trunk);
  for(let j=0;j<14;j++){const a=j*2.39996+i,r=.8*Math.sqrt((j+1)/14),height=2.7+Math.sin(j*1.9+i)*.65;const foliage=new THREE.Mesh(new THREE.IcosahedronGeometry(.68,2),new THREE.MeshStandardMaterial({color:new THREE.Color().setHSL(.30+(j%3)*.013,.16,.25+(j%5)*.022),roughness:1}));foliage.position.set(x+Math.cos(a)*r,height,z+Math.sin(a)*r);foliage.scale.set(1,1.25,1);scene.add(foliage);}
 }
 for(const x of [-11,11]){const wall=new THREE.Mesh(new THREE.BoxGeometry(.4,2,44),new THREE.MeshStandardMaterial({color:'#a0aaac',roughness:.8}));wall.position.set(x,.97,18);scene.add(wall);}
 airflow=new THREE.Group();for(let i=0;i<16;i++){const m=new THREE.Mesh(new THREE.CylinderGeometry(.0014,.0024,.034,5),new THREE.MeshBasicMaterial({color:'#a5eaff',transparent:true,opacity:.25,depthWrite:false}));m.rotation.x=Math.PI/2;m.userData={phase:i/16,x:(i%8-3.5)*.11};airflow.add(m);}scene.add(airflow);
}
async function load(){
 const gltf=await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync('./model-s.glb?v=2');model=gltf.scene;model.updateMatrixWorld(true);
 model.traverse(mesh=>{if(!mesh.isMesh)return;const name=mesh.material.name,group=/Windows/.test(name)?'Glass':/Pearl_White/.test(name)?'Body':'Cabin';finishMaterial(mesh,{material:name,group},'#aeb7c2');
  if(group==='Cabin'&&!/scrn|speedomet|lights|RedMain|Reflectors|Pearl_White/.test(name)&&Math.min(mesh.material.color.r,mesh.material.color.g,mesh.material.color.b)>.5){mesh.material.color.set(/chrome|metal|silver|brake|pedal/i.test(name)?'#8b949b':'#626a70');mesh.material.roughness=Math.max(.35,mesh.material.roughness);}
  if(mesh.name==='Surface_003'){centerScreen=mesh;screenUV(mesh);mesh.material=new THREE.MeshBasicMaterial({map:screenTexture,toneMapped:false});}
  if(mesh.name==='Surface_006'){instrumentScreen=mesh;screenUV(mesh);mesh.material=new THREE.MeshBasicMaterial({map:instrumentTexture,toneMapped:false});}
 });
 scene.add(model);steeringDetails();ready=true;document.body.dataset.ready='true';$('cockpit-loading').hidden=true;$('open-screen').disabled=false;setCamera('driver',true);applySoftware(software.state);
 window.modelSCockpit={getState:()=>({ready,view,software:software.getState(),screenOpen:$('screen-dialog').open,camera:camera.position.toArray(),look:camera.quaternion.toArray(),triangles:renderer.info.render.triangles}),getScreenTargets:()=>screenTargets(),showView:name=>{if(!Object.hasOwn(presets,name))return false;setCamera(name);return true;},openScreen:()=>openScreen('navigation'),closeScreen:()=>$('screen-dialog').close()};
 const initialCamera=new URLSearchParams(location.search).get('view');if(Object.hasOwn(presets,initialCamera))setCamera(initialCamera,true);
 const initial=new URLSearchParams(location.search).get('app');if(['navigation','climate','charging','controls'].includes(initial))openScreen(initial);
}
function steeringDetails(){
 const decal=(label,position,normal,width,height)=>{const canvas=document.createElement('canvas');canvas.width=512;canvas.height=128;const c=canvas.getContext('2d');c.font='500 66px Arial';c.textAlign='center';c.fillStyle='#bdcbd3';c.fillText(label,256,91);const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;const mesh=new THREE.Mesh(new THREE.PlaneGeometry(width,height),new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2}));const n=new THREE.Vector3(...normal);mesh.position.set(...position).addScaledVector(n,.001);mesh.lookAt(mesh.position.clone().add(n));scene.add(mesh);};
 decal('T E S L A',[.37652,.94089,.38980],[.0039,.2715,-.9624],.054,.0135);
 decal('◀   ▶',[.47092,.94207,.40758],[-.1235,.2616,-.9572],.025,.0063);
 decal('≋   ◉',[.27009,.94163,.40729],[.1257,.2606,-.9572],.025,.0063);
}
function screenUV(mesh){
 const bounds=new THREE.Box3().setFromObject(mesh),size=bounds.getSize(new THREE.Vector3()),positions=mesh.geometry.attributes.position,uv=new Float32Array(positions.count*2),v=new THREE.Vector3();
 for(let i=0;i<positions.count;i++){v.fromBufferAttribute(positions,i).applyMatrix4(mesh.matrixWorld);uv[i*2]=(bounds.max.x-v.x)/size.x;uv[i*2+1]=(v.y-bounds.min.y)/size.y;}mesh.geometry.setAttribute('uv',new THREE.BufferAttribute(uv,2));
}
function drawCluster(s){
 const c=cluster;c.fillStyle='#08121a';c.fillRect(0,0,4096,512);
 // This material includes the full dashboard strip. Confine the readout to the actual driver's binnacle.
 const start=535;c.save();c.translate(start,78);c.fillStyle='#dceaf2';c.font='300 159px Arial';c.fillText('0',48,174);c.font='24px Arial';c.fillStyle='#8da3b0';c.fillText('MPH',74,217);c.fillStyle='#9bebcb';c.font='500 37px Arial';c.fillText('P',77,278);
 c.fillStyle='#a8b8c3';c.beginPath();c.roundRect(285,93,90,178,26);c.fill();c.fillStyle='#273f50';c.beginPath();c.roundRect(299,130,62,76,13);c.fill();c.strokeStyle='#2a6680';c.lineWidth=5;for(const x of [248,411]){c.beginPath();c.moveTo(x,300);c.lineTo(x+(x<300?14:-14),57);c.stroke();}
 c.fillStyle='#dceaf2';c.font='43px Arial';c.fillText(`${Math.floor(s.battery)}%`,489,136);c.fillStyle='#8ca9b9';c.font='24px Arial';c.fillText(s.charging?'CHARGING':'PARKED',489,181);c.fillText(s.locked?'DOORS LOCKED':'UNLOCKED',489,221);c.fillStyle='#4da787';c.fillRect(489,251,150*s.battery/100,6);c.restore();
 if(instrumentTexture)instrumentTexture.needsUpdate=true;
}
function applySoftware(s){
 if(screenTexture)screenTexture.needsUpdate=true;drawCluster(s);$('battery-stat').innerHTML=`${Math.floor(s.battery)}<small>%</small>`;
 if(!scene)return;scene.background.set(s.night?'#111f31':'#b6c9d4');scene.fog.color.copy(scene.background);sky.intensity=s.night?.3:1.8;fill.intensity=s.night?.42:2.1;scene.environmentIntensity=s.night?.18:.6;beam.intensity=s.lights==='On'||(s.lights==='Auto'&&s.night)?18:0;
 if(centerScreen)centerScreen.material.color.setScalar(.35+s.brightness*.0065);if(instrumentScreen)instrumentScreen.material.color.setScalar(s.night?.6:1);
 $('day-night').textContent=s.night?'☾ Night cabin':'☼ Daylight cabin';$('day-night').setAttribute('aria-pressed',s.night);
}
function resize(){if(!renderer)return;renderer.setSize(host.clientWidth,host.clientHeight);camera.aspect=host.clientWidth/host.clientHeight;camera.fov=camera.aspect<.85?Math.min(98,fov+18):fov;camera.updateProjectionMatrix();}
function constrainLook(){const p=presets[view],d=new THREE.Vector3(...p.target).sub(new THREE.Vector3(...p.position)).normalize(),baseYaw=Math.atan2(d.x,d.z),basePitch=Math.asin(d.y);yaw=THREE.MathUtils.clamp(yaw,baseYaw-1.15,baseYaw+1.15);pitch=THREE.MathUtils.clamp(pitch,Math.max(-1.4,basePitch-.55),Math.min(1.25,basePitch+.55));}
function aim(){const direction=new THREE.Vector3(Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),Math.cos(yaw)*Math.cos(pitch));camera.lookAt(camera.position.clone().add(direction));}
function setCamera(name,immediate=false){
 const p=presets[name];view=name;fov=p.fov;const dest=new THREE.Vector3(...p.position),target=new THREE.Vector3(...p.target),dir=target.clone().sub(dest).normalize();yaw=Math.atan2(dir.x,dir.z);pitch=Math.asin(dir.y);
 if(immediate||reduced){camera.position.copy(dest);aim();transition=null;}else transition={start:performance.now(),from:camera.position.clone(),to:dest,fromQ:camera.quaternion.clone(),toQ:new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().lookAt(dest,target,new THREE.Vector3(0,1,0)))};
 resize();document.querySelector('.cockpit-heading h1').textContent=({seats:'Seats & stitching.',door:'The door details.',pedals:'Into the footwell.',console:'The center console.'})[name]||'Take your seat.';$('camera-caption').textContent=p.caption;document.querySelectorAll('[data-camera]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.camera===name));
}
function openScreen(tab){if(!ready)return;if(tab)software.tab(tab);if(!$('screen-dialog').open)$('screen-dialog').showModal();}
function hit(event){const r=host.getBoundingClientRect();pointer.set((event.clientX-r.left)/r.width*2-1,-(event.clientY-r.top)/r.height*2+1);raycaster.setFromCamera(pointer,camera);return model?raycaster.intersectObject(model,true)[0]:null;}
function bind(){
 document.querySelectorAll('[data-camera]').forEach(b=>b.onclick=()=>{if(ready){setCamera(b.dataset.camera);if(b.closest('.interior-details')&&matchMedia('(max-width:760px)').matches)document.querySelector('.cockpit-stage').scrollIntoView({behavior:reduced?'instant':'smooth',block:'start'});}});document.querySelectorAll('[data-app]').forEach(b=>b.onclick=()=>openScreen(b.dataset.app));$('open-screen').onclick=()=>openScreen();$('close-screen').onclick=()=>$('screen-dialog').close();$('day-night').onclick=()=>software.change(s=>s.night=!s.night);
 $('cockpit-fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{$('cockpit-fullscreen').textContent='Fullscreen unavailable';}};
 const canvas=renderer.domElement;
 canvas.addEventListener('pointerdown',e=>{if(!ready)return;transition=null;canvas.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size===1)gesture={x:e.clientX,y:e.clientY,moved:false};if(pointers.size===2){const [a,b]=[...pointers.values()];pinch=Math.hypot(a.x-b.x,a.y-b.y);gesture.moved=true;}});
 canvas.addEventListener('pointermove',e=>{if(!ready)return;const prev=pointers.get(e.pointerId);if(!prev){canvas.style.cursor=hit(e)?.object===centerScreen?'pointer':'grab';return;}pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size===2){const [a,b]=[...pointers.values()],d=Math.hypot(a.x-b.x,a.y-b.y);fov=THREE.MathUtils.clamp(fov*pinch/d,32,85);pinch=d;resize();return;}const dx=e.clientX-prev.x,dy=e.clientY-prev.y;if(Math.hypot(e.clientX-gesture.x,e.clientY-gesture.y)>5)gesture.moved=true;yaw+=dx*.003;pitch+=dy*.0028;constrainLook();aim();});
 canvas.addEventListener('pointerup',e=>{if(gesture&&!gesture.moved&&pointers.size===1){const h=hit(e);if(h?.object===centerScreen){if(!software.activateUV(h.uv))openScreen();}}pointers.delete(e.pointerId);if(!pointers.size)gesture=null;});canvas.addEventListener('pointercancel',()=>{pointers.clear();gesture=null;});
 canvas.addEventListener('wheel',e=>{e.preventDefault();fov=THREE.MathUtils.clamp(fov+e.deltaY*.025,32,85);resize();},{passive:false});
 host.addEventListener('keydown',e=>{if(!ready)return;const keys={ArrowLeft:[-.07,0],ArrowRight:[.07,0],ArrowUp:[0,.05],ArrowDown:[0,-.05]};if(keys[e.key]){e.preventDefault();transition=null;yaw+=keys[e.key][0];pitch+=keys[e.key][1];constrainLook();aim();}if(e.key.toLowerCase()==='r')setCamera('driver');});
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();$('cockpit-error').hidden=false;});
}
function screenTargets(){
 if(!centerScreen)return [];const b=new THREE.Box3().setFromObject(centerScreen),v=new THREE.Vector3();camera.updateMatrixWorld();return software.targets.map(t=>{const u=(t.x+t.w/2)/1200,vy=1-(t.y+t.h/2)/760;v.set(b.max.x-u*(b.max.x-b.min.x),b.min.y+vy*(b.max.y-b.min.y),b.min.z+vy*(b.max.z-b.min.z)).project(camera);const r=host.getBoundingClientRect();return {label:t.label,x:r.left+(v.x+1)/2*r.width,y:r.top+(1-v.y)/2*r.height};});
}
function tick(now){
 const dt=Math.min(.05,(now-last)/1000);last=now;if(software)software.tick(dt);
 if(transition){const t=Math.min(1,(now-transition.start)/700),s=t*t*(3-2*t);camera.position.lerpVectors(transition.from,transition.to,s);camera.quaternion.slerpQuaternions(transition.fromQ,transition.toQ,s);if(t===1)transition=null;}
 if(airflow&&software){airflow.visible=ready&&software.state.tab==='climate'&&software.state.fan>0;for(const m of airflow.children){const phase=(m.userData.phase+(reduced?0:now*.00007*software.state.fan))%1;m.position.set(m.userData.x,1.007-phase*.065,.52-phase*.32);m.material.opacity=.21*Math.sin(phase*Math.PI);}}
 if(renderer)renderer.render(scene,camera);
}
