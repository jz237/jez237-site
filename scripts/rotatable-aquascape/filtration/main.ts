import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {makeFiltration,type Part} from './model.ts';
import {systems,descriptions,type System} from './content.ts';
import './style.css';

const $=<E extends HTMLElement=HTMLElement>(id:string)=>document.getElementById(id) as E;
const all=<E extends HTMLElement=HTMLElement>(s:string)=>Array.from(document.querySelectorAll<E>(s));
const store=/\/showroom\/filtration\/?$/.test(location.pathname);
if(!store){$<HTMLAnchorElement>('reef-link').href='../reef-aquarium/';$<HTMLAnchorElement>('home').href='../../';$('home').innerHTML='JEZ237 <span>/ FILTRATION STUDIO</span>';}
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let system:System='system',lesson=0,selected:string|null=null,isolate=false,labels=false,flow=true,paused=reduced.matches,explosion=0,targetExplosion=0,time=0,sequence=false,sequenceTime=0,experimentTime=-1,view='perspective',dirty=true;
const model=makeFiltration();
$('explorer').insertBefore(document.querySelector('.inspector')!,document.querySelector('.lesson'));
let onScreen=true;
let renderer:T.WebGLRenderer|undefined,controls:OrbitControls|undefined;
const scene=new T.Scene(),camera=new T.PerspectiveCamera(36,1,.05,100);
scene.add(model.root);scene.add(new T.HemisphereLight(0xc3e8fa,0x122e39,1.25));
const key=new T.DirectionalLight(0xffffff,1.7);key.position.set(-4,9,8);scene.add(key);const rim=new T.DirectionalLight(0x6fdaf0,1.1);rim.position.set(4,5,-5);scene.add(rim);
const ground=new T.Mesh(new T.PlaneGeometry(2000,2000),new T.MeshBasicMaterial({color:0x112733}));ground.rotation.x=-Math.PI/2;ground.position.y=-.55;scene.add(ground);
const grid=new T.GridHelper(26,26,0x456471,0x456471);grid.position.y=-.54;(grid.material as T.Material).transparent=true;(grid.material as T.Material).opacity=.16;scene.add(grid);
const selection=new T.Box3Helper(new T.Box3(),0xa6ffe3);selection.visible=false;scene.add(selection);
const viewport=$('viewport'),slider=$<HTMLInputElement>('explode');
new IntersectionObserver(entries=>{onScreen=entries[0].isIntersecting;dirty=true;},{threshold:0}).observe(viewport);
function changed(){dirty=true;}
function fit(){
 if(!controls)return;
 model.root.updateMatrixWorld(true);const box=new T.Box3(),bounds:T.Box3[]=[];
 for(const p of model.parts)if(p.group.parent?.visible&&p.group.visible){const b=new T.Box3().setFromObject(p.group);box.union(b);bounds.push(b);}
 if(box.isEmpty())return;
 const center=box.getCenter(new T.Vector3());
 const dir=view==='front'?new T.Vector3(0,.055,1):view==='top'?new T.Vector3(.001,1,.001):new T.Vector3(.7,.48,1).normalize();
 dir.normalize();const right=new T.Vector3().crossVectors(new T.Vector3(0,1,0),dir).normalize(),up=new T.Vector3().crossVectors(dir,right).normalize(),tanV=Math.tan(T.MathUtils.degToRad(camera.fov/2)),tanH=tanV*camera.aspect;let distance=1;
 for(const b of bounds)for(const x of [b.min.x,b.max.x])for(const y of [b.min.y,b.max.y])for(const z of [b.min.z,b.max.z]){const corner=new T.Vector3(x,y,z).sub(center),depth=corner.dot(dir);distance=Math.max(distance,Math.abs(corner.dot(right))/(tanH*.92)+depth,Math.abs(corner.dot(up))/(tanV*.85)+depth);}
 distance*=1.03;
 controls.target.copy(center);camera.position.copy(center).addScaledVector(dir,distance);camera.near=Math.max(.03,distance/200);camera.far=Math.max(100,distance*6);camera.updateProjectionMatrix();controls.update();changed();
}
function lessonUI(){const a=systems[system],l=a.lessons[lesson];$('lesson-count').textContent=`HOW IT WORKS / ${lesson+1} OF ${a.lessons.length}`;$('lesson-title').textContent=l[0];$('lesson-text').textContent=l[1];$<HTMLButtonElement>('lesson-prev').disabled=lesson===0;$<HTMLButtonElement>('lesson-next').disabled=lesson===a.lessons.length-1;}
function status(){let t=paused?'Motion paused. Orbit and inspect at your own pace.':system==='system'?'Gravity down. Pumped return up. Water paths are illustrative.':system==='roller'?experimentTime<0?'Fleece stationary · normal filtration':experimentTime<4?'Debris builds up · upstream water rises':experimentTime<6?'Sensor triggered · advancing fresh fleece':'Fresh section in place · motor stopped':system==='skimmer'?'Air enters below; foam leaves above. Water exits separately.':system==='biology'?'Enlarged habitat · amber ammonia step → teal nitrite step.':'Impeller turning at a slowed inspection speed.';
 if(explosion>.04)t='Parts separated · water paths hidden until reassembled.';
 if(isolate)t='Isolated component · choose Clear selection to restore the assembly.';
 if($('operation-status').textContent!==t)$('operation-status').textContent=t;
}
function inspect(id:string|null){
 selected=id;isolate=false;model.isolate(null);const d=id?descriptions[id]:null;$<HTMLSelectElement>('parts').value=id||'';
 $('part-kind').textContent=d?.kind||'LOOK CLOSER';$('part-title').textContent=d?.title||'Every part has a purpose.';$('part-description').textContent=d?.description||'Select a piece in the model or choose it above. Separate the assembly to reveal what sits inside.';$('part-care').textContent=d?.care||'';
 $<HTMLButtonElement>('isolate').disabled=!id;$<HTMLButtonElement>('clear').disabled=!id;$('isolate').setAttribute('aria-pressed','false');selection.visible=!!id;changed();status();
}
function changeSystem(next:System){system=next;lesson=0;inspect(null);model.setView(system);experimentTime=-1;sequence=false;explosion=targetExplosion=0;model.setExplosion(0);view='perspective';
 all<HTMLButtonElement>('[data-system]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.system===system)));all<HTMLButtonElement>('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===view)));
 const d=systems[system];$('system-title').textContent=d.title;$('system-description').textContent=d.text;$('scene-name').textContent=d.name.toUpperCase();$('experiment').textContent=d.experiment;
 const parts=model.parts.filter(p=>system==='system'?p.system!=='biology':p.system===system);$('part-count').textContent=`${parts.length} SELECTABLE COMPONENTS`;
 $<HTMLSelectElement>('parts').innerHTML='<option value="">Select a component…</option>'+parts.map(p=>`<option value="${p.id}">${descriptions[p.id].title}</option>`).join('');
 lessonUI();explosionUI();buildLabels();fit();status();history.replaceState(null,'',`#${system}`);
}
function explosionUI(){slider.value=String(Math.round(explosion*100));$('amount').textContent=`${Math.round(explosion*100)}%`;$('assembly-state').textContent=explosion<.02?'Everything connected.':explosion>.98?'Every layer revealed.':'Opening the assembly.';$('explode-button').textContent=targetExplosion>.5?'Reassemble model ↙':'Explode assembly ↗';$('sequence').setAttribute('aria-pressed',String(sequence));$('sequence').textContent=sequence?'Stop assembly sequence':'Play assembly sequence';}
function setExplosionTarget(v:number){targetExplosion=v;if(reduced.matches){explosion=v;model.setExplosion(v);explosionUI();fit();}changed();}
let labelNodes:{part:Part;node:HTMLElement}[]=[];
function buildLabels(){const host=$('labels');host.replaceChildren();labelNodes=[];for(const p of model.parts){if(system==='system'?!['overflow','roller-frame','reaction-body','baffle-1','pump-motor','return-pipe'].includes(p.id):p.system!==system)continue;const n=document.createElement('span');n.className='part-label';n.textContent=descriptions[p.id].title;host.append(n);labelNodes.push({part:p,node:n});}}
function placeLabels(){const w=viewport.clientWidth,h=viewport.clientHeight,occupied:{x:number;y:number;w:number;h:number}[]=[];$('labels').hidden=!labels;for(const {part:p,node:n} of labelNodes){if(!labels||!p.group.visible){n.hidden=true;continue;}const v=p.group.localToWorld(p.label.clone()).project(camera),x=(v.x*.5+.5)*w,y=(-v.y*.5+.5)*h,bw=n.offsetWidth||140,bh=n.offsetHeight||25;let hide=v.z>1||v.z<0||x<bw/2||x>w-bw/2||y<bh||y>h-65;for(const a of occupied)if(Math.abs(x-a.x)<(bw+a.w)/2+5&&Math.abs(y-a.y)<(bh+a.h)/2+5)hide=true;n.hidden=hide;if(!hide){n.style.left=x+'px';n.style.top=y+'px';occupied.push({x,y,w:bw,h:bh});}}}
all<HTMLButtonElement>('[data-system]').forEach(b=>b.addEventListener('click',()=>changeSystem(b.dataset.system as System)));
all<HTMLButtonElement>('[data-view]').forEach(b=>b.addEventListener('click',()=>{view=b.dataset.view!;all('[data-view]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));fit();}));
$('fit').onclick=fit;
slider.oninput=()=>{sequence=false;targetExplosion=explosion=Number(slider.value)/100;model.setExplosion(explosion);explosionUI();fit();status();};
$('explode-button').onclick=()=>{sequence=false;setExplosionTarget(targetExplosion>.5?0:1);explosionUI();};
$('sequence').onclick=()=>{sequence=!sequence;sequenceTime=0;if(sequence){setPaused(false);inspect(null);}explosionUI();changed();};
$('reset').onclick=()=>{setPaused(reduced.matches);labels=false;flow=true;model.setFlow(true);$('flow').textContent='Flow on';$('flow').setAttribute('aria-pressed','true');$('labels-toggle').setAttribute('aria-pressed','false');time=0;changeSystem(system);};
$('flow').onclick=()=>{flow=!flow;model.setFlow(flow);$('flow').textContent=flow?'Flow on':'Flow off';$('flow').setAttribute('aria-pressed',String(flow));changed();};
$('labels-toggle').onclick=()=>{labels=!labels;$('labels-toggle').setAttribute('aria-pressed',String(labels));changed();};
function setPaused(v:boolean){paused=v;$('pause').textContent=paused?'Resume motion':'Pause motion';$('pause').setAttribute('aria-pressed',String(paused));status();changed();}
$('pause').onclick=()=>setPaused(!paused);
$('lesson-prev').onclick=()=>{lesson=Math.max(0,lesson-1);lessonUI();};$('lesson-next').onclick=()=>{lesson=Math.min(systems[system].lessons.length-1,lesson+1);lessonUI();};
$<HTMLSelectElement>('parts').onchange=()=>inspect($<HTMLSelectElement>('parts').value||null);
$('clear').onclick=()=>{const was=isolate;inspect(null);if(was)fit();};
$('isolate').onclick=()=>{isolate=!isolate;model.isolate(isolate?selected:null);$('isolate').setAttribute('aria-pressed',String(isolate));fit();status();};
$('experiment').onclick=()=>{if(system==='roller'){experimentTime=0;setExplosionTarget(0);setPaused(false);inspect('sensor');}else{lesson=(lesson+1)%systems[system].lessons.length;lessonUI();if(system==='skimmer')inspect('venturi');else if(system==='return')inspect('pump-rotor');else if(system==='biology')inspect(lesson<2?'ammonia':'nitrite');else inspect(['overflow','roller-frame','baffle-1','return-pipe'][lesson]);setExplosionTarget(0);flow=true;model.setFlow(true);$('flow').setAttribute('aria-pressed','true');$('flow').textContent='Flow on';setPaused(false);}};
document.addEventListener('keydown',e=>{if(e.key==='Escape'){inspect(null);sequence=false;explosionUI();}});
document.addEventListener('visibilitychange',changed);
const initialHash=location.hash.slice(1);changeSystem(initialHash in systems?initialHash as System:'system');setPaused(reduced.matches);
try{
 renderer=new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setClearColor(0x07151e,0);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.04;viewport.append(renderer.domElement);
 const env=new RoomEnvironment(),pmrem=new T.PMREMGenerator(renderer);scene.environment=pmrem.fromScene(env,.04).texture;scene.environmentIntensity=.55;env.dispose();pmrem.dispose();
 controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.09;controls.maxPolarAngle=Math.PI*.49;controls.minDistance=1.4;controls.maxDistance=70;controls.addEventListener('change',changed);
 const resize=()=>{const w=viewport.clientWidth,h=viewport.clientHeight;renderer!.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();fit();};new ResizeObserver(resize).observe(viewport);resize();
 const ray=new T.Raycaster(),mouse=new T.Vector2();let down:{x:number;y:number}|null=null;
 function hit(e:PointerEvent){const b=renderer!.domElement.getBoundingClientRect();mouse.set((e.clientX-b.left)/b.width*2-1,-(e.clientY-b.top)/b.height*2+1);ray.setFromCamera(mouse,camera);const selectable=model.parts.filter(p=>p.group.visible&&p.group.parent?.visible).map(p=>p.group);const hits=ray.intersectObjects(selectable,true);for(const h of hits){let o:T.Object3D|null=h.object;while(o&&!o.userData.part)o=o.parent;if(o?.userData.part)return o.userData.part as string;}return null;}
 renderer.domElement.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY};});renderer.domElement.addEventListener('pointerup',e=>{if(down&&Math.hypot(e.clientX-down.x,e.clientY-down.y)<6){const id=hit(e);if(id)inspect(id);}down=null;});renderer.domElement.addEventListener('pointercancel',()=>down=null);
 renderer.domElement.addEventListener('pointermove',e=>{if(e.pointerType==='touch'||e.buttons)return;const id=hit(e);const tip=$('tooltip');tip.hidden=!id;renderer!.domElement.style.cursor=id?'pointer':'grab';if(id){tip.textContent=descriptions[id].title;const b=viewport.parentElement!.getBoundingClientRect();tip.style.left=Math.min(e.clientX-b.left+12,b.width-220)+'px';tip.style.top=e.clientY-b.top+16+'px';}});renderer.domElement.addEventListener('pointerleave',()=>{$('tooltip').hidden=true;down=null;});
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();$('fallback').hidden=false;setPaused(true);});renderer.domElement.addEventListener('webglcontextrestored',()=>location.reload());
 $('loading').hidden=true;
 let last=performance.now(),frames=0;
 renderer.setAnimationLoop(now=>{const dt=Math.max(0,Math.min(.04,(now-last)/1000));last=now;if(document.hidden||!onScreen)return;let moving=false;
  if(!paused){time+=dt;if(experimentTime>=0)experimentTime+=dt;model.update(time,dt,experimentTime);if(sequence){sequenceTime+=dt;const p=sequenceTime%10;targetExplosion=p<4?1:p<5?1:0;}moving=true;}
  if(Math.abs(targetExplosion-explosion)>.0004){explosion=T.MathUtils.damp(explosion,targetExplosion,4,dt);model.setExplosion(explosion);explosionUI();fit();moving=true;}else if(explosion!==targetExplosion){explosion=targetExplosion;model.setExplosion(explosion);explosionUI();moving=true;}
  controls!.update();if(selected){const p=model.parts.find(p=>p.id===selected)!;selection.box.setFromObject(p.group);}
  if(dirty||moving){scene.updateMatrixWorld(true);placeLabels();renderer!.render(scene,camera);frames++;dirty=false;}status();
 });
 (window as any).filtrationQA={snapshot:()=>({...model.snapshot(),system,paused,selected,isolate,time,experimentTime,sequence,frames,triangles:renderer!.info.render.triangles,calls:renderer!.info.render.calls,ready:true}),project:(id:string)=>{const p=model.parts.find(p=>p.id===id)!;const box=new T.Box3().setFromObject(p.group),v=box.getCenter(new T.Vector3()).project(camera),b=viewport.getBoundingClientRect();return{x:b.x+(v.x*.5+.5)*b.width,y:b.y+(-v.y*.5+.5)*b.height};}};
}catch(error){console.error(error);$('loading').hidden=true;$('fallback').hidden=false;}
