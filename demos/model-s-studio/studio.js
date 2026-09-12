import * as THREE from 'three';
import { OrbitControls } from './vendor/OrbitControls.js';
import { GLTFLoader } from './vendor/GLTFLoader.js';
import { RoomEnvironment } from './vendor/RoomEnvironment.js';
import { MeshoptDecoder } from './vendor/meshopt_decoder.module.js';

const $ = id => document.getElementById(id);
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const state = { ready:false, amount:0, target:0, sequence:false, sequenceTime:0, selected:null, isolated:false, system:'all', cabin:false, labels:false, paint:'#b50922', view:'hero' };
const parts = [], landmarks = [], raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2();
let renderer, controls, camera, scene, model, last=performance.now(), pointerStart=null, viewTween=null, lastAppliedAmount=-1;
const baseTarget = new THREE.Vector3(0,.7,0);
const views = {hero:[6,3.15,6.8],side:[9,1.8,0],front:[0,1.8,10],top:[.01,11,.01]};
const descriptions = {
 Body:'A painted exterior surface. The Model S silhouette is built from sculpted panels around a low, elongated passenger cabin.',
 Glass:'Glazing from the windshield, panoramic roof or side windows. Separating the glass reveals the shape and layout of the cabin.',
 Wheels:'A wheel, tire or braking surface. The four corner assemblies connect the vehicle to the road; these are visual meshes, not service part numbers.',
 Cabin:'A cabin surface or control. The model includes seating, dashboard, displays, steering controls, door furniture and interior trim.',
 Lighting:'An exterior light or reflector surface. The headlamps, indicators and rear lighting are separated into their visual layers.',
 Trim:'A trim, seal, surround or detail surface. These smaller elements complete the exterior and interior of the model.'
};

function category(material) {
 if(/Pearl_White/.test(material)) return 'Body';
 if(/Windows/.test(material)) return 'Glass';
 if(/Rims|tires|ceramic_brake|gris__/.test(material)) return 'Wheels';
 if(/gls_turn|RedMain|Reflectors|lights|fara_|shader_brake/.test(material)) return 'Lighting';
 if(/Interior|Stitch|carpet|button|pedal|speaker|scrn|speedomet|koja|alc__|carbon/.test(material)) return 'Cabin';
 return 'Trim';
}
function componentName(material, center, size) {
 const side = center.x > .2 ? 'Left' : center.x < -.2 ? 'Right' : 'Center';
 const end = center.z > .75 ? 'front' : center.z < -.75 ? 'rear' : 'cabin';
 if(/tires/.test(material))return `${side} ${end} tire`;
 if(/Rims/.test(material))return `${side} ${end} wheel detail`;
 if(/ceramic_brake/.test(material))return `${side} ${end} brake disc`;
 if(/gris__/.test(material))return `${side} ${end} brake hardware`;
 if(/midfntscrn/.test(material))return 'Center touchscreen';
 if(/rearmidscrn/.test(material))return 'Rear passenger display';
 if(/speedomet/.test(material))return 'Instrument panel';
 if(/Windows/.test(material))return center.y>1.36?'Panoramic roof glass':`${side} ${end} glazing`;
 if(/Pearl_White/.test(material)){
  if(center.z>1.45&&center.y>.65&&size.x>1)return 'Sculpted hood surface';
  if(center.z>1.9)return 'Front fascia surface';
  if(center.z<-1.9)return 'Rear fascia surface';
  if(center.z<-1.4&&center.y>.85&&size.x>1)return 'Rear liftgate surface';
  return `${side} ${end} body panel`;
 }
 if(/tires|Rims/.test(material))return `${side} ${end} wheel surface`;
 if(/RedMain|shader_brake/.test(material))return 'Rear light surface';
 if(/gls_turn|fara_/.test(material))return `${side} ${end} lamp lens`;
 if(/Reflectors/.test(material))return 'Rear reflector';
 if(/speaker/.test(material))return `${side} cabin speaker surface`;
 if(/koja/.test(material))return `${side} upholstery surface`;
 if(/Interior/.test(material))return `${side} ${end} interior surface`;
 if(/carbon/.test(material))return `${side} carbon trim`;
 if(/alc__/.test(material))return `${side} cabin lining`;
 if(/carpet/.test(material))return 'Cabin floor covering';
 if(/pedal/.test(material))return 'Pedal surface';
 if(/Stitch/.test(material))return 'Upholstery stitching';
 if(/button/.test(material))return `${side} cabin switch surface`;
 if(/License/.test(material))return 'License plate surfaces';
 return `${side} ${end} ${category(material)==='Lighting'?'lighting':'trim'} surface`;
}

function fail(error) {
 console.error(error);$('loading').hidden=true;$('error').hidden=false;$('scene-status').textContent='STUDIO UNAVAILABLE';
 $('error-message').textContent='The 3D model could not load. Check your connection and that WebGL 2 / hardware acceleration is enabled, then try again.';
}

try { init(); await loadModel(); } catch(error) { fail(error); }

function init() {
 const host=$('viewport');scene=new THREE.Scene();scene.fog=new THREE.FogExp2('#090e14',.035);
 renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setClearColor('#090e14',0);
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.0;
 host.appendChild(renderer.domElement);
 camera=new THREE.PerspectiveCamera(36,1,.05,150);camera.position.fromArray(views.hero);
 controls=new OrbitControls(camera,renderer.domElement);controls.target.copy(baseTarget);controls.enableDamping=true;controls.dampingFactor=.065;
 controls.minDistance=2.5;controls.maxDistance=32;controls.maxPolarAngle=Math.PI*.49;controls.autoRotateSpeed=.65;controls.enablePan=true;
 controls.addEventListener('start',()=>{viewTween=null;document.querySelectorAll('[data-view]').forEach(b=>b.classList.remove('active'));});
 const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment();
 scene.environment=pmrem.fromScene(room,.04).texture;scene.environmentIntensity=.75;room.dispose();pmrem.dispose();
 scene.add(new THREE.HemisphereLight('#dcefff','#233139',.65));
 const key=new THREE.DirectionalLight('#e0eeff',2.5);key.position.set(3,7,5);key.castShadow=true;key.shadow.mapSize.set(2048,2048);key.shadow.camera.left=-7;key.shadow.camera.right=7;key.shadow.camera.top=7;key.shadow.camera.bottom=-7;key.shadow.normalBias=.025;key.shadow.bias=-.0002;scene.add(key);
 const rim=new THREE.DirectionalLight('#a6e5ff',1.8);rim.position.set(-5,3,-4);scene.add(rim);
 const fill=new THREE.DirectionalLight('#ffe5cc',.8);fill.position.set(4,2,-6);scene.add(fill);
 const platform=new THREE.Mesh(new THREE.CylinderGeometry(3.65,3.75,.13,128),new THREE.MeshStandardMaterial({color:'#0a1018',metalness:.2,roughness:.6,envMapIntensity:.12}));platform.position.y=-.095;platform.receiveShadow=true;scene.add(platform);
 const ring=new THREE.Mesh(new THREE.TorusGeometry(3.68,.012,8,192),new THREE.MeshBasicMaterial({color:'#80d7bc'}));ring.rotation.x=Math.PI/2;ring.position.y=-.06;scene.add(ring);
 const inner=new THREE.Mesh(new THREE.TorusGeometry(3.48,.0035,6,160),new THREE.MeshBasicMaterial({color:'#44525b'}));inner.rotation.x=Math.PI/2;inner.position.y=-.025;scene.add(inner);
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.MeshStandardMaterial({color:'#010204',roughness:.95,metalness:0,envMapIntensity:.04}));floor.rotation.x=-Math.PI/2;floor.position.y=-.18;floor.receiveShadow=true;scene.add(floor);
 const shadowCanvas=document.createElement('canvas');shadowCanvas.width=shadowCanvas.height=128;const ctx=shadowCanvas.getContext('2d'),gradient=ctx.createRadialGradient(64,64,10,64,64,64);gradient.addColorStop(0,'rgba(0,0,0,.65)');gradient.addColorStop(.5,'rgba(0,0,0,.4)');gradient.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=gradient;ctx.fillRect(0,0,128,128);
 const contact=new THREE.Mesh(new THREE.PlaneGeometry(3.5,6.5),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(shadowCanvas),transparent:true,depthWrite:false}));contact.rotation.x=-Math.PI/2;contact.position.y=-.024;scene.add(contact);
 // Fine radial calibration marks make the pedestal feel like an exhibit table.
 const positions=[];for(let i=0;i<96;i++){const a=i/96*Math.PI*2;const r=i%8===0?3.29:3.37;positions.push(Math.cos(a)*r,-.025,Math.sin(a)*r,Math.cos(a)*3.43,-.025,Math.sin(a)*3.43);}
 const marks=new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(positions,3)),new THREE.LineBasicMaterial({color:'#64717a',transparent:true,opacity:.32}));scene.add(marks);
 const resize=()=>{const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();if(state.ready)setView(state.view,true);};new ResizeObserver(resize).observe(host);resize();
 renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();fail(new Error('WebGL context lost'));});
 renderer.domElement.addEventListener('pointerdown',e=>pointerStart={x:e.clientX,y:e.clientY});
 renderer.domElement.addEventListener('pointerup',e=>{if(pointerStart&&Math.hypot(e.clientX-pointerStart.x,e.clientY-pointerStart.y)<6){const hit=pick(e);if(hit)selectPart(hit.userData.part);}pointerStart=null;});
 renderer.domElement.addEventListener('pointermove',e=>{if(e.buttons||!state.ready){$('tooltip').hidden=true;return;}const hit=pick(e);renderer.domElement.style.cursor=hit?'pointer':'grab';$('tooltip').hidden=!hit;if(hit){const r=host.getBoundingClientRect();$('tooltip').textContent=hit.userData.part.label;$('tooltip').style.left=`${Math.min(e.clientX-r.left+15,r.width-220)}px`;$('tooltip').style.top=`${e.clientY-r.top+18}px`;}});
 renderer.domElement.addEventListener('pointerleave',()=>{$('tooltip').hidden=true;pointerStart=null;});
 bindControls();renderer.setAnimationLoop(tick);
}

async function loadModel() {
 const loader=new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
 const gltf=await loader.loadAsync('./model-s.glb',progress=>{if(progress.total)$('load-progress').textContent=`Loading geometry · ${Math.round(progress.loaded/progress.total*100)}%`;});
 model=new THREE.Group();model.name='Model S visual components';scene.add(model);gltf.scene.updateMatrixWorld(true);
 const meshes=[];gltf.scene.traverse(o=>{if(o.isMesh)meshes.push(o);});
 const counts={};
 for(const mesh of meshes){
  model.attach(mesh);mesh.geometry.computeBoundingBox();const box=new THREE.Box3().setFromObject(mesh),center=box.getCenter(new THREE.Vector3()),size=box.getSize(new THREE.Vector3());
  const original=mesh.material,material=original.name,group=category(material),name=componentName(material,center,size);
  mesh.material=group==='Body'?new THREE.MeshPhysicalMaterial({color:state.paint,metalness:.5,roughness:.32,clearcoat:1,clearcoatRoughness:.2}):original.clone();const mat=mesh.material;
  const index=parts.length;counts[name]=(counts[name]||0)+1;
  const part={id:index,mesh,group,name,label:`${name} · ${String(index+1).padStart(3,'0')}`,base:mesh.position.clone(),center,size,material};
  mat.envMapIntensity=group==='Body'?1.1:.65;mat.roughness=THREE.MathUtils.clamp(mat.roughness,.2,.85);
  if(group==='Glass'){mat.color.set('#294450');mat.transparent=true;mat.opacity=.57;mat.metalness=.15;mat.roughness=.12;mat.depthWrite=false;mat.side=THREE.DoubleSide;}
  if(/tires/.test(material)){mat.color.set('#16191b');mat.roughness=.94;mat.metalness=.02;}
  if(/Rims/.test(material)){mat.color.set('#a5adb6');mat.metalness=.87;mat.roughness=.26;}
  if(/RedMain|shader_brake/.test(material)){mat.emissive.set('#a00a18');mat.emissiveIntensity=.9;}
  if(/gls_turn/.test(material)){mat.emissive.set('#d9f4ff');mat.emissiveIntensity=.8;}
  part.opacity=mat.opacity;part.transparent=mat.transparent;part.depthWrite=mat.depthWrite;part.emissive=mat.emissive.clone();part.emissiveIntensity=mat.emissiveIntensity;
  mesh.castShadow=group!=='Glass';mesh.receiveShadow=true;mesh.userData.part=part;
  // Spatial separation first; additional spreading only at the end of the slider.
  const side=center.x>=0?1:-1;
  let offset=new THREE.Vector3(center.x*1.05,center.y*.95,center.z*.65);
  if(group==='Body')offset.add(new THREE.Vector3(Math.abs(center.x)>.4?side*.55:0,.35,0));
  if(group==='Glass')offset.add(new THREE.Vector3(side*.1,1.2,0));
  if(group==='Wheels')offset.set(side*1.35,.12,center.z*.25);
  if(group==='Cabin')offset.add(new THREE.Vector3(0,.45,0));
  part.offset=offset;
  const angle=index*2.3999632297,vertical=((index%17)/16-.5);
  part.spread=new THREE.Vector3(Math.cos(angle)*.65,vertical*.85,Math.sin(angle)*.65);
  parts.push(part);
 }
 $('part-count').textContent=parts.length;state.ready=true;document.body.dataset.ready='true';$('loading').hidden=true;
 for(const id of ['explode-button','animate','reset'])$(id).disabled=false;
 for(const group of ['Body','Glass','Wheels','Cabin']){
  const part=parts.filter(p=>p.group===group).sort((a,b)=>b.size.length()-a.size.length())[0];
  if(part){const el=document.createElement('span');el.className='landmark';el.textContent=group==='Glass'?'PANORAMIC GLAZING':group==='Wheels'?'WHEEL ASSEMBLIES':group==='Body'?'SCULPTED BODY':'PASSENGER CABIN';$('labels').append(el);landmarks.push({el,part});}
 }
 updateList();updateUI();setView('hero',true);
 // Read-only diagnostics for geometry and interaction validation.
 window.modelSStudio={getState:()=>({ready:state.ready,pieces:parts.length,visible:parts.filter(p=>p.mesh.visible).length,amount:state.amount,target:state.target,selected:state.selected?.label??null,isolated:state.isolated,system:state.system,cabin:state.cabin,triangles:renderer.info.render.triangles,drawCalls:renderer.info.render.calls}),getParts:()=>parts.map(p=>({id:p.id,name:p.name,group:p.group,position:p.mesh.position.toArray(),base:p.base.toArray()}))};
}

function pick(e){const rect=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(pointer,camera);return raycaster.intersectObjects(parts.filter(p=>p.mesh.visible).map(p=>p.mesh),false)[0]?.object;}
function setView(name,immediate=false){
 state.view=name;const aspectFactor=Math.max(1,Math.sqrt(1.4/camera.aspect)),factor=(1+state.target*.65)*aspectFactor;
 const target=baseTarget.clone().add(new THREE.Vector3(0,state.target*.6,0));
 const destination=new THREE.Vector3().fromArray(views[name]).sub(baseTarget).multiplyScalar(factor).add(target);
 if(immediate||reducedMotion){camera.position.copy(destination);controls.target.copy(target);viewTween=null;}else viewTween={start:performance.now(),from:camera.position.clone(),to:destination,fromTarget:controls.target.clone(),toTarget:target};
 document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===name));
}
function setAmount(value,{fit=true,manual=true}={}){if(!state.ready)return;if(manual)stopSequence();state.target=THREE.MathUtils.clamp(value,0,1);if(reducedMotion)state.amount=state.target;updateUI();if(fit)setView(state.view);}
function updateUI(){
 $('explode').value=Math.round(state.target*100);$('amount').innerHTML=`${String(Math.round(state.target*100)).padStart(3,'0')}<span>%</span>`;
 $('assembly-state').textContent=state.target<.01?'Beautifully assembled.':state.target<.4?'Beneath the surface.':state.target<.8?'A study in separation.':'Every piece, revealed.';
 $('explode-button').innerHTML=state.target>.5?'↙ Reassemble':'<span aria-hidden="true">↗</span> Explode model';
 $('scene-status').textContent=state.isolated?'ISOLATED COMPONENT':state.cabin?'CABIN STUDY':state.system!=='all'?`${state.system.toUpperCase()} STUDY`:state.target>.01?'EXPLODED STUDY':'LIVE 3D / MODEL S PLAID';
}
function updateList(){
 const search=$('search').value.toLowerCase();const options=parts.filter(p=>(state.system==='all'||p.group===state.system)&&(!state.cabin||!['Body','Glass'].includes(p.group))&&`${p.label} ${p.group}`.toLowerCase().includes(search));
 $('part-list').replaceChildren(new Option(options.length?'Select a component…':'No matching components',''),...options.map(p=>new Option(`${p.group} / ${p.label}`,p.id)));
 $('part-list').value=state.selected?String(state.selected.id):'';
}
function updateVisibility(){
 for(const p of parts){const selected=p===state.selected,mat=p.mesh.material;
  p.mesh.visible=(state.system==='all'||p.group===state.system)&&(!state.cabin||!['Body','Glass'].includes(p.group))&&(!state.isolated||selected);
  mat.opacity=p.opacity;mat.transparent=p.transparent;mat.depthWrite=p.depthWrite;
  mat.emissive.copy(selected?new THREE.Color('#49c8a3'):p.emissive);mat.emissiveIntensity=selected?.45:p.emissiveIntensity;
 }
 $('isolate').disabled=!state.selected;$('clear').disabled=!state.selected;$('isolate').textContent=state.isolated?'Show surrounding pieces':'Isolate piece';$('isolate').setAttribute('aria-pressed',state.isolated);
 updateUI();
}
function selectPart(part){
 const wasIsolated=state.isolated;state.selected=part??null;if(!part)state.isolated=false;
 $('part-category').textContent=part?`${part.group.toUpperCase()} / PIECE ${String(part.id+1).padStart(3,'0')}`:'NO PIECE SELECTED';
 $('part-title').textContent=part?part.name:'Curiosity starts with a click.';
 $('part-description').textContent=part?descriptions[part.group]:'Select directly on the car or choose from the list. Each piece can be viewed on its own.';
 $('part-meta').textContent=part?'Artist mesh · illustrative component grouping':'';
 $('part-list').value=part?String(part.id):'';updateVisibility();
 if(state.isolated)focusSelected();else if(wasIsolated){controls.minDistance=2.5;setView(state.view);}
}
function focusSelected(){
 if(!state.selected)return;stopSequence();model.updateMatrixWorld(true);
 const box=new THREE.Box3().setFromObject(state.selected.mesh),center=box.getCenter(new THREE.Vector3()),size=box.getSize(new THREE.Vector3());
 const radius=Math.max(.12,size.length()/2),distance=radius/Math.sin(THREE.MathUtils.degToRad(camera.fov/2))*Math.max(1,1/camera.aspect)*1.15;
 const direction=camera.position.clone().sub(controls.target).normalize();controls.minDistance=.15;
 viewTween={start:performance.now(),from:camera.position.clone(),to:center.clone().addScaledVector(direction,distance),fromTarget:controls.target.clone(),toTarget:center};
}
function stopSequence(){state.sequence=false;$('animate').textContent='▷ Play sequence';}
function reset(){stopSequence();controls.minDistance=2.5;state.target=0;state.system='all';state.cabin=false;state.isolated=false;state.labels=false;state.view='hero';controls.autoRotate=false;$('system').value='all';$('search').value='';for(const id of ['cabin','rotate','label-toggle'])$(id).setAttribute('aria-pressed','false');selectPart(null);updateList();updateUI();setView('hero');}
function bindControls(){
 $('explode').addEventListener('input',e=>setAmount(Number(e.target.value)/100));
 $('explode-button').onclick=()=>setAmount(state.target>.5?0:1);
 $('animate').onclick=()=>{if(state.sequence){stopSequence();return;}state.sequence=true;state.sequenceTime=0;state.isolated=false;selectPart(null);$('animate').textContent='Ⅱ Pause sequence';};
 $('reset').onclick=reset;
 document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>setView(b.dataset.view));
 document.querySelectorAll('[data-color]').forEach(b=>b.onclick=()=>{state.paint=b.dataset.color;parts.filter(p=>p.group==='Body').forEach(p=>p.mesh.material.color.set(state.paint));$('paint-name').textContent=b.getAttribute('aria-label');document.querySelectorAll('[data-color]').forEach(s=>{s.classList.toggle('active',s===b);s.setAttribute('aria-pressed',s===b);});});
 $('system').onchange=e=>{state.system=e.target.value;state.cabin=false;$('cabin').setAttribute('aria-pressed','false');selectPart(null);updateList();};
 $('search').oninput=updateList;
 $('part-list').onchange=e=>selectPart(e.target.value===''?null:parts[Number(e.target.value)]);
 $('isolate').onclick=()=>{state.isolated=!state.isolated;updateVisibility();if(state.isolated)focusSelected();else{controls.minDistance=2.5;setView(state.view);}};$('clear').onclick=()=>selectPart(null);
 $('cabin').onclick=()=>{state.cabin=!state.cabin;state.system='all';$('system').value='all';$('cabin').setAttribute('aria-pressed',state.cabin);selectPart(null);updateList();};
 $('rotate').onclick=()=>{controls.autoRotate=!controls.autoRotate;$('rotate').setAttribute('aria-pressed',controls.autoRotate);};
 $('label-toggle').onclick=()=>{state.labels=!state.labels;$('label-toggle').setAttribute('aria-pressed',state.labels);};
 $('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{ $('fullscreen').textContent='Fullscreen unavailable'; }};
 document.addEventListener('fullscreenchange',()=>{$('fullscreen').textContent=document.fullscreenElement?'⛶ Exit fullscreen':'⛶ Fullscreen';});
 document.addEventListener('keydown',e=>{if(/INPUT|SELECT|TEXTAREA|BUTTON/.test(e.target.tagName)||e.ctrlKey||e.metaKey||e.altKey||!state.ready)return;if(e.key.toLowerCase()==='e')setAmount(state.target>.5?0:1);if(e.key.toLowerCase()==='r')reset();if(e.key==='Escape')selectPart(null);});
}
function tick(now){
 const dt=Math.min((now-last)/1000,.05);last=now;
 if(state.sequence){state.sequenceTime+=dt;const t=state.sequenceTime;const v=t<1?0:t<6?(t-1)/5:t<9?1:t<14?1-(t-9)/5:0;state.target=v;updateUI();if(t>=15)stopSequence();
  const target=baseTarget.clone().add(new THREE.Vector3(0,v*.6,0));const direction=camera.position.clone().sub(controls.target).normalize();const distance=new THREE.Vector3().fromArray(views[state.view]).sub(baseTarget).length()*(1+v*.65)*Math.max(1,Math.sqrt(1.4/camera.aspect));controls.target.lerp(target,.05);camera.position.lerp(target.addScaledVector(direction,distance),.05);
 }
 const old=state.amount;state.amount=THREE.MathUtils.damp(state.amount,state.target,reducedMotion?1000:5,dt);if(Math.abs(state.amount-state.target)<.0001)state.amount=state.target;
 if(state.ready&&lastAppliedAmount!==state.amount){for(const p of parts){
  const t=state.amount;const spread=THREE.MathUtils.smoothstep(t,.55,1);
  p.mesh.position.copy(p.base).addScaledVector(p.offset,t).addScaledVector(p.spread,spread);
 }lastAppliedAmount=state.amount;}
 if(viewTween){const t=Math.min(1,(now-viewTween.start)/900),s=t*t*(3-2*t);camera.position.lerpVectors(viewTween.from,viewTween.to,s);controls.target.lerpVectors(viewTween.fromTarget,viewTween.toTarget,s);if(t===1)viewTween=null;}
 controls.update(dt);
 for(const {el,part} of landmarks){el.hidden=!state.labels||!part.mesh.visible;if(el.hidden)continue;const p=part.center.clone().add(part.mesh.position).sub(part.base).project(camera);el.hidden=Math.abs(p.x)>.92||Math.abs(p.y)>.92||p.z>1;el.style.left=`${(p.x*.5+.5)*renderer.domElement.clientWidth}px`;el.style.top=`${(-p.y*.5+.5)*renderer.domElement.clientHeight}px`;}
 renderer.render(scene,camera);
}

