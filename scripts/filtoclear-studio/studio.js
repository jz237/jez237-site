import * as THREE from 'three';
import {OrbitControls} from './vendor/OrbitControls.js';
import {RoomEnvironment} from './vendor/RoomEnvironment.js';
import {buildFilter} from './model.js?v=cutaway-detail-3';
import {PARTS,GROUPS,LESSONS,smooth} from './data.js';
const $=id=>document.getElementById(id), reduced=matchMedia('(prefers-reduced-motion: reduce)');
const state={mode:'cutaway',amount:0,target:0,selected:null,isolated:false,system:'all',labels:false,paused:reduced.matches,rotate:false,sequence:false,sequenceTime:0,lesson:0,tab:'parts',ready:false,time:0};
let renderer,scene,camera,controls,filter,flowRoot,camTween,environment,resizeObserver;
const flowPaths=[],ray=new THREE.Raycaster(),pointer=new THREE.Vector2(),labelEls=new Map();
const stage=$('viewport'),status=$('scene-status');
let pointerStart=null,last=performance.now();
if(location.pathname.includes('/learn/filtoclear'))document.querySelectorAll('[data-pond]').forEach(a=>a.href='../../category/?cat=pond');

function options(){const query=$('part-search').value.toLowerCase().trim();const entries=PARTS.filter(p=>(p.name+' '+p.description+' '+p.detail+' '+GROUPS[p.group]).toLowerCase().includes(query));$('part-list').replaceChildren(new Option(entries.length?`Choose a component (${entries.length})`:'No matching components',''));for(const [key,label]of Object.entries(GROUPS)){const group=document.createElement('optgroup');group.label=label;for(const p of entries.filter(p=>p.group===key))group.append(new Option(p.name,p.id));if(group.children.length)$('part-list').append(group);}if(entries.some(p=>p.id===state.selected))$('part-list').value=state.selected;}
function tab(name){state.tab=name;document.querySelectorAll('[data-tab]').forEach(b=>{const active=b.dataset.tab===name;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;});for(const id of ['parts','learn','specs'])$('panel-'+id).hidden=id!==name;}
function selected(id,{showTab=true}={}){
 const p=PARTS.find(p=>p.id===id);state.selected=p?.id??null;state.isolated=false;
 $('part-group').textContent=p?GROUPS[p.group].toUpperCase():'START EXPLORING';$('part-title').textContent=p?.name??'A system within a system.';$('part-description').textContent=p?.description??'Select a component on the model or from the list to learn what it does.';$('part-detail').textContent=p?.detail??'Use the exploded view to reveal the hidden layers.';$('part-number').textContent=p?.number?'OASE reference: '+p.number:'';
 $('isolate').disabled=$('clear').disabled=!p;$('isolate').setAttribute('aria-pressed','false');$('isolate').textContent='Isolate part';if(p&&showTab)tab('parts');$('part-list').value=p?.id??'';styleParts();document.body.dataset.selected=p?.id??'';
}
function styleParts(){if(!filter)return;for(const p of filter.parts.values()){
 p.object.visible=(!state.isolated||p.id===state.selected)&&(state.system==='all'||p.group===state.system);
 for(const m of p.meshes){const base=m.userData.baseMaterial;m.material.color.copy(base.color);m.material.emissive.set(0);m.material.opacity=base.opacity;m.material.transparent=base.transparent;m.material.depthWrite=base.depthWrite;
  if(p.id===state.selected){m.material.emissive.set(0x466052);m.material.emissiveIntensity=.32;}
  if((state.mode==='flow'||state.mode==='cleaning')&&!state.isolated){if(p.group==='media'){m.material.transparent=true;m.material.opacity=p.id==='mesh'?.17:.53;m.material.depthWrite=false;}if(p.id==='lid'){m.material.transparent=true;m.material.opacity=.30;m.material.depthWrite=false;}}
  m.material.needsUpdate=true;
 }
}filter.alignment.visible=state.mode==='exploded'&&!state.isolated&&state.system==='all';}
function mode(name,{fit=true,stop=true}={}){
 state.mode=name;state.target=name==='exploded'?1:0;state.system='all';state.isolated=false;$('system').value='all';$('isolate').setAttribute('aria-pressed','false');$('isolate').textContent='Isolate part';
 if(stop)stopSequence();if(reduced.matches||state.paused)state.amount=state.target;
 document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===name)));
 document.body.dataset.mode=name;status.textContent=({assembled:'ASSEMBLED / 32 SELECTABLE ASSEMBLIES',exploded:'EXPLODED / EXPLORE EVERY ASSEMBLY',cutaway:'CUTAWAY / NESTED COMPONENTS',flow:'NORMAL FLOW / SCHEMATIC TRACES',cleaning:'EASY-CLEAN / WASTE ROUTE'})[name];
 styleParts();if(fit&&state.ready)fitView();
}
function stopSequence(){state.sequence=false;$('sequence').setAttribute('aria-pressed','false');$('sequence').textContent='▷ Play explosion';}
function setPause(value){state.paused=value;$('pause').setAttribute('aria-pressed',String(value));$('pause').textContent=value?'Resume motion':'Pause motion';}
function chapter(index){state.lesson=Math.max(0,Math.min(LESSONS.length-1,index));const l=LESSONS[state.lesson];tab('learn');$('lesson-tag').textContent=l.tag;$('lesson-title').textContent=l.title;$('lesson-body').textContent=l.body;$('lesson-count').textContent=`${state.lesson+1} / ${LESSONS.length}`;$('previous').disabled=state.lesson===0;$('next').disabled=state.lesson===LESSONS.length-1;document.querySelectorAll('[data-chapter]').forEach(b=>b.setAttribute('aria-current',Number(b.dataset.chapter)===state.lesson?'step':'false'));mode(l.mode);selected(l.part,{showTab:false});if(innerWidth<781)$('explorer').scrollIntoView({block:'start',behavior:reduced.matches?'instant':'smooth'});}
for(let i=0;i<LESSONS.length;i++){const b=document.createElement('button');b.textContent=String(i+1);b.dataset.chapter=i;b.setAttribute('aria-label',`Chapter ${i+1}: ${LESSONS[i].title}`);b.onclick=()=>chapter(i);$('lesson-progress').append(b);}
options();setPause(state.paused);
document.querySelectorAll('[data-tab]').forEach(b=>{b.onclick=()=>{tab(b.dataset.tab);if(b.dataset.tab==='learn')chapter(state.lesson);};b.onkeydown=e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const bs=[...document.querySelectorAll('[data-tab]')],i=bs.indexOf(b),n=e.key==='Home'?0:e.key==='End'?2:(i+(e.key==='ArrowRight'?1:2))%3;bs[n].click();bs[n].focus();};});
$('part-search').oninput=options;$('part-list').onchange=e=>{if(e.target.value)selected(e.target.value);};$('clear').onclick=()=>selected(null);
$('isolate').onclick=()=>{if(!state.selected)return;stopSequence();state.isolated=!state.isolated;state.system='all';$('system').value='all';$('isolate').setAttribute('aria-pressed',String(state.isolated));$('isolate').textContent=state.isolated?'Show all parts':'Isolate part';styleParts();fitView();};
$('system').onchange=e=>{stopSequence();state.system=e.target.value;state.isolated=false;$('isolate').setAttribute('aria-pressed','false');$('isolate').textContent='Isolate part';styleParts();fitView();};
$('labels-toggle').onclick=()=>{state.labels=!state.labels;$('labels-toggle').setAttribute('aria-pressed',String(state.labels));};
document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>mode(b.dataset.mode));
$('explode').oninput=e=>{stopSequence();state.mode=+e.target.value?'exploded':'assembled';state.target=+e.target.value/100;state.isolated=false;state.system='all';$('system').value='all';$('isolate').setAttribute('aria-pressed','false');$('isolate').textContent='Isolate part';if(reduced.matches||state.paused)state.amount=state.target;document.body.dataset.mode=state.mode;document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===state.mode)));styleParts();status.textContent='MANUAL EXPLOSION / DRAG TO EXPLORE';};
$('explode').onchange=()=>fitView();
$('sequence').onclick=()=>{if(state.sequence){stopSequence();return;}mode('exploded',{stop:false});state.sequence=true;state.sequenceTime=0;state.amount=0;state.target=0;state.paused=false;setPause(false);$('sequence').setAttribute('aria-pressed','true');$('sequence').textContent='■ Stop sequence';};
$('pause').onclick=()=>setPause(!state.paused);$('rotate').onclick=()=>{state.rotate=!state.rotate;$('rotate').setAttribute('aria-pressed',String(state.rotate));};
$('reset').onclick=()=>{selected(null);state.rotate=false;state.labels=false;$('rotate').setAttribute('aria-pressed','false');$('labels-toggle').setAttribute('aria-pressed','false');$('part-search').value='';options();mode('cutaway');cameraView('perspective');};
$('fit').onclick=()=>fitView();document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>cameraView(b.dataset.view));
$('tour-start').onclick=()=>chapter(0);$('previous').onclick=()=>chapter(state.lesson-1);$('next').onclick=()=>chapter(state.lesson+1);$('lesson-replay').onclick=()=>chapter(state.lesson);
$('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{status.textContent='Fullscreen is unavailable in this browser';}};
addEventListener('keydown',e=>{if(e.key==='Escape'){selected(null);state.system='all';$('system').value='all';styleParts();}});
reduced.addEventListener('change',e=>{if(e.matches){setPause(true);state.rotate=false;$('rotate').setAttribute('aria-pressed','false');stopSequence();}});

function bounds(){filter.pose(state.target,!state.isolated&&['cutaway','flow','cleaning'].includes(state.mode));filter.root.updateMatrixWorld(true);const box=new THREE.Box3();for(const p of filter.parts.values())if(p.object.visible)box.expandByObject(p.object);filter.pose(state.amount,!state.isolated&&['cutaway','flow','cleaning'].includes(state.mode));return box.isEmpty()?new THREE.Box3(new THREE.Vector3(-1,0,-1),new THREE.Vector3(1,3,1)):box;}
function fitView(direction){if(!camera||!filter)return;const box=bounds(),size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3());const aspect=stage.clientWidth/stage.clientHeight;const vfov=camera.fov*Math.PI/180,hfov=2*Math.atan(Math.tan(vfov/2)*aspect);const diagonal=Math.sqrt(size.x**2+size.z**2);const distance=Math.max(size.y/(2*Math.tan(vfov/2)),diagonal/(2*Math.tan(hfov/2)))*1.22+size.z*.25;
 const dir=direction??camera.position.clone().sub(controls.target).normalize();const pos=center.clone().addScaledVector(dir,Math.max(3.0,distance));center.y+=size.y*.025;
 camTween={from:camera.position.clone(),to:pos,start:controls.target.clone(),target:center,time:0};if(reduced.matches){camera.position.copy(pos);controls.target.copy(center);camTween=null;controls.update();}}
function cameraView(name){document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===name)));const views={perspective:new THREE.Vector3(4.8,2.8,7).normalize(),front:new THREE.Vector3(.001,.14,1).normalize(),top:new THREE.Vector3(.001,1,.001).normalize()};fitView(views[name]);}
function buildFlow(){flowRoot=new THREE.Group();scene.add(flowRoot);const c={inlet:0xe5b265,return:0x83e3c4,uv:0xbba7ff,waste:0xe79265};
 const add=(points,color,type,count=15)=>{const curve=new THREE.CatmullRomCurve3(points.map(a=>new THREE.Vector3(...a)));const line=new THREE.Mesh(new THREE.TubeGeometry(curve,100,.012,6,false),new THREE.MeshBasicMaterial({color:c[color],transparent:true,opacity:.20,depthWrite:false}));flowRoot.add(line);const pointsMesh=new THREE.InstancedMesh(new THREE.SphereGeometry(.025,8,6),new THREE.MeshBasicMaterial({color:c[color],transparent:true,opacity:.95,depthTest:true}),count);pointsMesh.frustumCulled=false;flowRoot.add(pointsMesh);flowPaths.push({curve,line,mesh:pointsMesh,count,type,phase:0});};
 add([[-1.6,1.7,1.15],[-1.1,2.18,.96],[-.74,2.54,.72],[-.6,2.4,.42],[-.70,1.8,.12],[-.66,.5,.08]],'inlet','both',23);
 for(const y of [.46,.96,1.46,1.96])add([[-.66,y,.10],[-.45,y,.20],[-.29,y,.1],[0,y,.27]],'return','normal',8);
 add([[0,.52,.26],[.16,.8,.12],[.16,1.35,.03],[.12,2.05,.12],[0,2.39,.24]],'uv','normal',14);
 add([[0,.52,.30],[.28,1.05,.05],[.28,1.7,.05],[.20,2.25,.14],[0,2.39,.24]],'return','normal',6);
 add([[0,2.39,.24],[.38,2.54,.55],[.48,2.54,1.13],[1.35,2.80,1.48],[2.0,3.0,1.45]],'return','normal',22);
 add([[.20,.35,.35],[.58,.65,.36],[.65,1.7,.28],[.6,2.35,.15],[1.15,2.54,.1],[2.25,2.15,.1],[2.7,1.0,.12]],'waste','clean',28);
}
function updateFlow(){const active=['flow','cleaning'].includes(state.mode)&&state.amount<.035&&!state.isolated&&state.system==='all';flowRoot.visible=active;if(!active)return;const dummy=new THREE.Object3D();for(const p of flowPaths){const show=p.type==='both'||p.type===(state.mode==='cleaning'?'clean':'normal');p.line.visible=p.mesh.visible=show;if(!show)continue;for(let i=0;i<p.count;i++){const t=(state.time*.14+i/p.count)%1;dummy.position.copy(p.curve.getPointAt(t));dummy.updateMatrix();p.mesh.setMatrixAt(i,dummy.matrix);}p.mesh.instanceMatrix.needsUpdate=true;}}
function animateLabels(){const visible=[];const w=stage.clientWidth,h=stage.clientHeight;const important=['vessel','lid','foam-top','foam-purple','uv-head','quartz','rotor','valve'];const candidates=state.selected?[state.selected,...important.filter(x=>x!==state.selected)]:important;for(const id of candidates){const p=filter.parts.get(id),el=labelEls.get(id);if(!el)continue;if(!p.object.visible||(!state.labels&&state.selected!==id)){el.hidden=true;continue;}const box=new THREE.Box3().setFromObject(p.object),pt=box.getCenter(new THREE.Vector3()).project(camera),x=(pt.x*.5+.5)*w,y=(-pt.y*.5+.5)*h;const collision=visible.some(a=>Math.abs(a.x-x)<150&&Math.abs(a.y-y)<30);el.hidden=pt.z>1||pt.z<0||x<70||x>w-70||y<15||y>h-30||collision;if(!el.hidden){el.style.left=x+'px';el.style.top=y+'px';el.classList.toggle('selected',id===state.selected);visible.push({x,y});}}
 for(const [id,el]of labelEls)if(!candidates.includes(id))el.hidden=true;
}
function intersect(event){const rect=renderer.domElement.getBoundingClientRect();pointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);ray.setFromCamera(pointer,camera);return ray.intersectObjects(filter.pickables.filter(m=>m.visible&&m.parent.visible),false)[0];}
async function init(){try{
 renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(stage.clientWidth,stage.clientHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;stage.append(renderer.domElement);
 scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(37,stage.clientWidth/stage.clientHeight,.05,120);camera.position.set(5.5,3.8,7.5);
 controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.085;controls.minDistance=1.3;controls.maxDistance=35;controls.maxPolarAngle=Math.PI*.9;controls.target.set(0,1.5,0);controls.addEventListener('start',()=>camTween=null);
 const pmrem=new THREE.PMREMGenerator(renderer);environment=pmrem.fromScene(new RoomEnvironment(),.025);scene.environment=environment.texture;scene.environmentIntensity=.6;pmrem.dispose();
 scene.add(new THREE.HemisphereLight(0xc5e9f1,0x0c1824,2.5));const key=new THREE.DirectionalLight(0xe5f6ec,4);key.position.set(-3,8,5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-7,right:7,top:9,bottom:-5,near:.5,far:25});key.shadow.bias=-.001;scene.add(key);const rim=new THREE.DirectionalLight(0x68d0cc,2.6);rim.position.set(5,4,-3);scene.add(rim);const fill=new THREE.DirectionalLight(0xe9ddc7,2.2);fill.position.set(-5,2.3,3);scene.add(fill);
 const floor=new THREE.Mesh(new THREE.CircleGeometry(14,96),new THREE.ShadowMaterial({opacity:.21}));floor.rotation.x=-Math.PI/2;floor.position.y=-.04;floor.receiveShadow=true;scene.add(floor);
 for(let i=1;i<6;i++){const ring=new THREE.Mesh(new THREE.TorusGeometry(i*.85,.003,4,100),new THREE.MeshBasicMaterial({color:0x80beb2,transparent:true,opacity:.035}));ring.rotation.x=-Math.PI/2;ring.position.y=-.02;scene.add(ring);}
 filter=buildFilter();scene.add(filter.root);buildFlow();for(const p of PARTS){const el=document.createElement('span');el.className='part-label';el.textContent=p.name;el.hidden=true;$('labels').append(el);labelEls.set(p.id,el);}
 renderer.domElement.addEventListener('pointerdown',e=>pointerStart={x:e.clientX,y:e.clientY});renderer.domElement.addEventListener('pointerup',e=>{if(pointerStart&&Math.hypot(e.clientX-pointerStart.x,e.clientY-pointerStart.y)<6){const hit=intersect(e);if(hit)selected(hit.object.userData.part);}pointerStart=null;});
 renderer.domElement.addEventListener('pointermove',e=>{const hit=intersect(e);const el=$('tooltip');el.hidden=!hit||!!pointerStart;renderer.domElement.style.cursor=hit?'pointer':'grab';if(hit){el.textContent=filter.parts.get(hit.object.userData.part).name;const r=stage.getBoundingClientRect();el.style.left=Math.min(e.clientX-r.left+14,stage.clientWidth-210)+'px';el.style.top=Math.max(10,e.clientY-r.top-35)+'px';}});renderer.domElement.addEventListener('pointerleave',()=>{$('tooltip').hidden=true;pointerStart=null;});
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();$('error').hidden=false;state.ready=false;});
 resizeObserver=new ResizeObserver(()=>{const w=stage.clientWidth,h=stage.clientHeight;if(!w||!h)return;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h);});resizeObserver.observe(stage);
 state.ready=true;document.body.dataset.ready='true';document.body.dataset.partCount=PARTS.length;$('loading').hidden=true;mode('cutaway',{fit:false});filter.pose(0,true);cameraView('perspective');renderer.setAnimationLoop(frame);
 }catch(error){console.error('Filter studio:',error);$('loading').hidden=true;$('error').hidden=false;status.textContent='TEXT EXPLORER AVAILABLE';}
}
function frame(now){const dt=Math.min((now-last)/1000,.05);last=now;if(!state.ready||document.hidden)return;
 if(!state.paused){state.time+=dt;if(state.sequence){state.sequenceTime+=dt;const t=state.sequenceTime;if(t<4)state.target=smooth(t/4);else if(t<7)state.target=1;else if(t<11)state.target=1-smooth((t-7)/4);else{stopSequence();mode('assembled',{fit:true});}}}
 if(!state.paused)state.amount+= (state.target-state.amount)*(reduced.matches?1:Math.min(1,dt*6));if(Math.abs(state.amount-state.target)<.0001)state.amount=state.target;
 const cut=!state.isolated&&['cutaway','flow','cleaning'].includes(state.mode),clean=state.mode==='cleaning'?(Math.sin(state.time*2.0)*.5+.5):0;
 filter.pose(state.amount,cut,clean,state.time,state.mode==='flow');if(state.mode==='cleaning'){filter.parts.get('valve').object.rotation.y=Math.PI/2;filter.parts.get('waste-cap').object.position.x+=.5;filter.parts.get('waste-cap').object.position.y-=.5;}
 filter.alignment.visible=state.mode==='exploded'&&!state.isolated&&state.system==='all';
 if(camTween){camTween.time+=dt;const t=smooth(Math.min(1,camTween.time/.8));camera.position.lerpVectors(camTween.from,camTween.to,t);controls.target.lerpVectors(camTween.start,camTween.target,t);if(t>=1)camTween=null;}
 controls.autoRotate=state.rotate&&!state.paused;controls.autoRotateSpeed=.7;controls.update();updateFlow();animateLabels();renderer.render(scene,camera);
 $('explode').value=Math.round(state.amount*100);$('amount').textContent=Math.round(state.amount*100)+'%';document.body.dataset.explosion=String(Math.round(state.amount*100));document.body.dataset.motion=state.paused?'paused':'running';
}
init();
