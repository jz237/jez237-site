import * as T from '../aquaclear-studio/vendor/three.module.js';
import { OrbitControls } from '../aquaclear-studio/vendor/OrbitControls.js';
import { studioEnvironment } from '../aquaclear-studio/realism.js?v=material-5';
import { buildTrickle } from './model.js?v=2';
import { PARTS, LESSONS, CARE, hydraulics } from './data.js?v=2';

import { createWaterOptics } from './optics.js?v=2';
const $=id=>document.getElementById(id), reduced=matchMedia('(prefers-reduced-motion: reduce)');
const state={mode:'cutaway',tab:'explore',amount:0,target:0,rate:70,fill:25,blocked:false,power:true,drainback:0,selected:'biomedia',isolated:false,paused:reduced.matches,rotate:false,labels:true,tour:-1,care:-1,sequence:false,sequenceTime:0,time:0,flowTime:0,arrowTime:0,rotorAngle:0,slow:false,ready:false};
let scene,camera,renderer,controls,filter,optics,studioFloor,camTween,last=0,down=null;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),smooth=t=>t*t*(3-2*t),v=(x,y,z)=>new T.Vector3(x,y,z);
const stage=$('viewport'),raycaster=new T.Raycaster(),pointer=new T.Vector2();
const labelNodes=new Map();
const leaderSvg=document.createElementNS('http://www.w3.org/2000/svg','svg');leaderSvg.setAttribute('class','leaders');$('labels').append(leaderSvg);
for(const p of PARTS){const o=document.createElement('option');o.value=p.id;o.textContent=`${p.number} · ${p.name}`;$('part-list').append(o);}
for(const [i,s] of CARE.entries()){const b=document.createElement('button');b.innerHTML=`<span>0${i+1}</span>${s.title}`;b.dataset.care=i;b.setAttribute('aria-pressed','false');b.addEventListener('click',()=>care(i));$('care-steps').append(b);}
for(const id of ['overflow','tray','biomedia','baffles','pump']){const p=PARTS.find(p=>p.id===id),el=document.createElement('div');el.className='part-label';el.innerHTML=`<b>${p.number}</b>${p.name}`;$('labels').append(el);const line=document.createElementNS('http://www.w3.org/2000/svg','path');leaderSvg.append(line);el.leader=line;labelNodes.set(id,el);}
function pressed(id,value){$(id).setAttribute('aria-pressed',String(value));}
function stopSequence(){state.sequence=false;pressed('sequence',false);$('sequence').textContent='▷ Explode & return';}
function select(id,{focus=false}={}){
  const p=PARTS.find(p=>p.id===id);if(!p)return;state.selected=id;$('part-list').value=id;
  $('part-group').textContent=p.group.toUpperCase();$('part-number').textContent=p.number;$('part-title').textContent=p.name;$('part-description').textContent=p.description;$('part-detail').textContent=p.detail;
  if(state.isolated||focus)fit();document.body.dataset.selected=id;
}
function tab(name,{syncMode=true}={}){
  state.tab=name;document.querySelectorAll('[data-tab]').forEach(b=>{const active=b.dataset.tab===name;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;});
  for(const id of ['explore','flow','care'])$('panel-'+id).hidden=id!==name;
  state.care=-1;
  if(name==='flow'&&syncMode){state.isolated=false;pressed('isolate',false);setMode('flow',{changeTab:false});}
  if(name==='care'){care(0);}
  else if(syncMode&&['care','pump','media'].includes(state.mode))setMode('cutaway',{changeTab:false});
}
function setMode(mode,{changeTab=true,fitView=true}={}){
  stopSequence();state.mode=mode;state.care=-1;state.isolated=false;pressed('isolate',false);$('isolate').textContent='Inspect alone';
  state.target=mode==='exploded'?1:0;
  if(changeTab){if(mode==='flow')tab('flow',{syncMode:false});else if(state.tab==='care'||state.tab==='flow')tab('explore',{syncMode:false});}
  document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));
  $('scene-status').textContent=({assembled:'ASSEMBLED / IN OPERATION',cutaway:'CUTAWAY / LOOK INSIDE',exploded:'EXPLODED / PUMP OFF',flow:'WATER PATH / DIRECTIONAL STUDY',care:'CARE / POWER DISCONNECTED',pump:'PUMP SECTION / SLOWED FOR STUDY',media:'BIOLOGICAL BED / OPEN RIB GEOMETRY'})[mode];
  document.body.dataset.mode=mode;pressed('pump-inspect',mode==='pump');$('pump-inspect').textContent=mode==='pump'?'← Return to water circuit':'Inspect the working impeller ↗';if(fitView)fit();
}
function care(i){
  stopSequence();state.care=i;state.mode='care';state.target=0;state.isolated=false;pressed('isolate',false);
  document.querySelectorAll('[data-care]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.care===i)));document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed','false'));
  $('care-title').textContent=CARE[i].title;$('care-text').textContent=CARE[i].text;$('scene-status').textContent='CARE / POWER DISCONNECTED';document.body.dataset.mode='care';select(CARE[i].part);fit();
}
function lesson(i){
  state.tour=clamp(i,0,LESSONS.length-1);const l=LESSONS[state.tour];$('tour-panel').hidden=false;$('parts-panel').hidden=true;$('tour').hidden=true;
  $('lesson-tag').textContent=l.tag;$('lesson-title').textContent=l.title;$('lesson-text').textContent=l.text;$('lesson-tip').textContent=l.tip;$('lesson-count').textContent=`${state.tour+1} / ${LESSONS.length}`;
  $('previous').disabled=$('stage-previous').disabled=state.tour===0;$('stage-count').textContent=`${state.tour+1} / ${LESSONS.length}`;$('stage-next').textContent=state.tour===LESSONS.length-1?'✓':'→';$('next').textContent=state.tour===LESSONS.length-1?'Finish ✓':'Next →';
  if(l.off){state.power=false;state.drainback=0;}else if(state.tour===0){state.power=true;state.drainback=0;}updateFlowText();
  setMode(l.mode,{changeTab:false});select(l.part);tab('explore',{syncMode:false});document.body.dataset.journey=String(state.tour);$('study-caption').textContent=l.tag+' · '+l.title;focusLesson();showMobileStage();
}
function endTour(){state.tour=-1;delete document.body.dataset.journey;$('tour-panel').hidden=true;$('parts-panel').hidden=false;$('tour').hidden=false;}
function updateFlowText(){
  const f=hydraulics(state);$('rate-value').textContent=state.rate+'%';$('fill-value').textContent=state.fill+'%';
  $('power').textContent=state.power?'Turn pump off · test drain-down':'Restart return pump';pressed('power',!state.power);
  let title='Room for the return.',note='The biological bed stays above the collected water. Spare sump space receives the upper circuit when power stops.';
  if(f.overflow){title='The reserve is exhausted.';note='The calculated level exceeds the rim. The surface stops at the rim; excess water would spill. Lower the fill and repeat the power-off test.';}
  else if(f.dry){title='Return level too low.';note='The illustrative protection stops the pump. Raise the sump fill before restarting.';}
  else if(!state.power){title=state.drainback<.995?'The upper circuit drains down.':'The circuit has settled.';note='The impeller is stopped. Gravity drainage and return-line backflow raise the sump until the finite upper volume is exhausted.';}
  else if(f.submerged){title='The wet/dry bed is flooding.';note='The elevated fill submerges the bottom of the media bed and reduces its open-air region. Reserve space also shrinks.';}
  else if(state.blocked){title='Less of the bed gets wet.';note='Only 21 of 63 distributor outlets are active in this study. Concentrated trickles and an amber side bypass show the changed route.';}
  for(const [id,value] of Object.entries({'hydraulic-title':title,'hydraulic-note':note,'power-status':state.care>=0?'CARE / POWER DISCONNECTED':f.running?'PUMP RUNNING':'PUMP STOPPED','reserve-value':f.overflow?'EXCEEDED':f.settled>3.02?'INSUFFICIENT':f.settled>2.7?'LIMITED':'AVAILABLE','coverage-value':(f.flow>.005?(state.blocked?'21 / 63':'63 / 63'):'0 / 63')})){if($(id).textContent!==value)$(id).textContent=value;}
  document.body.dataset.warning=String(f.overflow||f.dry||f.submerged);
}
function targetBounds(){
 const box=new T.Box3();filter.pose({...state,amount:state.target});
 for(const [id,p] of filter.parts){if(p.object.visible)box.union(new T.Box3().setFromObject(p.object));}
 filter.pose(state);return box;
}
function moveCamera(position,target){
  if(!camera)return;if(reduced.matches){camera.position.copy(position);controls.target.copy(target);controls.update();camTween=null;return;}
  camTween={from:camera.position.clone(),to:position,fromTarget:controls.target.clone(),target,elapsed:0};
}
function fit(view='hero'){
  if(!filter)return;
  document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===view)));
  if(state.mode==='pump'&&!state.isolated){focusRegion([2.65,.55,.3],1.0,view==='top'?[.01,5,.1]:[1.5,1.2,5]);return;}
  if(state.tour>0&&(LESSONS[state.tour].center||LESSONS[state.tour].mode==='media')){focusLesson();return;}const box=targetBounds(),size=box.getSize(v()),center=box.getCenter(v());
  const directions={hero:v(8,5.6,10).normalize(),front:v(0,1.2,12).normalize(),top:v(.01,14,.1).normalize()};
  const dir=directions[view]||directions.hero;
  const sphereRadius=size.length()*.5;const halfFov=T.MathUtils.degToRad(camera.fov/2);const limiting=Math.min(halfFov,Math.atan(Math.tan(halfFov)*camera.aspect));
  const distance=sphereRadius/Math.sin(limiting)*(state.isolated?1.05:1.02);
  // Leave breathing room for heading above and camera controls below the model.
  const target=center.clone().add(v(0,size.y*.06,0));moveCamera(target.clone().addScaledVector(dir,distance),target);
  document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===view)));
}
// Bound camera studies to a region so portrait screens retain the complete subject.
function focusRegion(center,radius,direction){
  if(!camera)return;const target=v(...center),half=T.MathUtils.degToRad(camera.fov/2);
  const limiting=Math.min(half,Math.atan(Math.tan(half)*camera.aspect));
  moveCamera(target.clone().addScaledVector(v(...direction).normalize(),radius/Math.sin(limiting)),target);
}
function focusLesson(){const l=LESSONS[state.tour];if(!l)return;if(l.center)focusRegion(l.center,l.radius,state.tour===2?[2,.75,6]:[3,1.8,6]);else if(l.mode==='media')focusRegion(filter?.mediaFocus||[-2.35,2.65,0],.55,[2,1.2,6]);}
function showMobileStage(){if(matchMedia('(max-width:760px)').matches)stage.parentElement.scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});}
function inspectPump(){endTour();setMode('pump',{changeTab:false});select('rotor');$('pump-inspect').setAttribute('aria-pressed','true');showMobileStage();}
$('pump-inspect').onclick=()=>state.mode==='pump'?setMode('flow',{changeTab:false}):inspectPump();
$('water-tour').onclick=()=>lesson(0);
for(const id of ['rate','fill'])$(id).oninput=e=>{state[id]=+e.target.value;updateFlowText();};
$('blocked').onchange=e=>{state.blocked=e.target.checked;updateFlowText();};
$('power').onclick=()=>{state.power=!state.power;updateFlowText();};
$('part-list').addEventListener('change',e=>{endTour();if(['pump','media'].includes(state.mode))setMode('cutaway');select(e.target.value);});
document.querySelectorAll('[data-part]').forEach(b=>b.addEventListener('click',()=>{endTour();tab('explore');setMode('exploded');select(b.dataset.part);}));
document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{endTour();setMode(b.dataset.mode);}));
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{endTour();fit(b.dataset.view);}));$('fit').onclick=()=>{endTour();fit();};
document.querySelectorAll('[data-tab]').forEach(b=>{b.onclick=()=>{endTour();tab(b.dataset.tab);};b.addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;e.preventDefault();const buttons=[...document.querySelectorAll('[data-tab]')],i=buttons.indexOf(b),n=e.key==='Home'?0:e.key==='End'?2:(i+(e.key==='ArrowRight'?1:2))%3;buttons[n].click();buttons[n].focus();});});
$('explode').addEventListener('input',e=>{endTour();stopSequence();const val=+e.target.value/100;if(state.mode!=='exploded')setMode('exploded',{fitView:false});state.target=val;fit();});
$('sequence').onclick=()=>{if(state.sequence){stopSequence();return;}endTour();setMode('exploded');state.sequence=true;state.sequenceTime=0;state.paused=false;pressed('pause',false);$('pause').textContent='Pause motion';pressed('sequence',true);$('sequence').textContent='■ Stop sequence';};
$('pause').onclick=()=>{state.paused=!state.paused;pressed('pause',state.paused);$('pause').textContent=state.paused?'Resume motion':'Pause motion';};
$('slow').onclick=()=>{state.slow=!state.slow;pressed('slow',state.slow);$('slow').textContent=state.slow?'Slow motion · ⅓×':'Slow motion';};
$('rotate').onclick=()=>{state.rotate=!state.rotate;pressed('rotate',state.rotate);};
$('labels-toggle').onclick=()=>{state.labels=!state.labels;pressed('labels-toggle',state.labels);};
$('isolate').onclick=()=>{state.isolated=!state.isolated;pressed('isolate',state.isolated);$('isolate').textContent=state.isolated?'Return to assembly':'Inspect alone';stopSequence();fit();};
$('clear').onclick=()=>{state.isolated=false;pressed('isolate',false);$('isolate').textContent='Inspect alone';fit();};
$('tour').onclick=()=>lesson(0);$('previous').onclick=()=>lesson(state.tour-1);$('next').onclick=()=>state.tour===LESSONS.length-1?endTour():lesson(state.tour+1);$('end-tour').onclick=endTour;$('stage-previous').onclick=()=>lesson(state.tour-1);$('stage-next').onclick=()=>state.tour===LESSONS.length-1?endTour():lesson(state.tour+1);
$('reset').onclick=()=>{endTour();Object.assign(state,{rate:70,fill:25,blocked:false,power:true,drainback:0,flowTime:0,arrowTime:0,rotorAngle:0,slow:false,rotate:false,paused:reduced.matches,labels:true,isolated:false});$('rate').value=70;$('fill').value=25;$('blocked').checked=false;pressed('slow',false);$('slow').textContent='Slow motion';pressed('rotate',false);pressed('pause',state.paused);pressed('labels-toggle',true);$('pause').textContent=state.paused?'Resume motion':'Pause motion';tab('explore',{syncMode:false});setMode('cutaway');select('biomedia');updateFlowText();};
$('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{$('fullscreen').textContent='Fullscreen unavailable';}};
document.addEventListener('fullscreenchange',()=>{$('fullscreen').setAttribute('aria-label',document.fullscreenElement?'Exit fullscreen':'Enter fullscreen');});
reduced.addEventListener('change',e=>{if(e.matches){state.paused=true;pressed('pause',true);$('pause').textContent='Resume motion';}});
pressed('pause',state.paused);if(state.paused)$('pause').textContent='Resume motion';select('biomedia');updateFlowText();
function labels(){
  const placed=[],w=stage.clientWidth,h=stage.clientHeight;
  for(const [id,el] of labelNodes){const p=filter.parts.get(id);let visible=state.labels&&!state.isolated&&state.care<0&&state.mode!=='assembled'&&!['pump','media'].includes(state.mode)&&state.tour<0;
    const point=p.center.clone().add(p.object.position).project(camera);const px=(point.x*.5+.5)*w,py=(-point.y*.5+.5)*h;
    const lw=el.offsetWidth||150,lh=25,left=id==='overflow'||id==='pump';let x=left?px-lw-65:px+65,y=py-10;
    x=clamp(x,12,w-lw-12);if(id==='biomedia')y+=23;
    for(const other of placed)if(Math.abs(other.y-y)<32&&x<other.x+other.w+8&&x+lw>other.x-8)y=other.y+34;
    const rect={x,y,w:lw,h:lh};
    if(point.z>1||point.z< -1||y<145||y>h-65||placed.some(r=>Math.abs(r.y-y)<29&&x<r.x+r.w+8&&x+lw>r.x-8))visible=false;
    if(visible){placed.push(rect);el.style.transform=`translate(${Math.round(x)}px,${Math.round(y)}px)`;const end=left?x+lw:x;el.leader.setAttribute('d',`M${px},${py} L${left?end+12:end-12},${y+12} L${end},${y+12}`);}el.style.opacity=visible?'1':'0';el.leader.style.opacity=visible?'1':'0';
  }
}
function intersect(e){const r=stage.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);raycaster.setFromCamera(pointer,camera);return raycaster.intersectObjects(filter.pickables,false).find(hit=>{let o=hit.object;while(o){if(!o.visible)return false;o=o.parent;}return true;});}
async function init(){
  try{
    renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.transmissionResolutionScale=stage.clientWidth<760?.5:.8;renderer.setSize(stage.clientWidth,stage.clientHeight);renderer.setClearColor('#10242c',1);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFShadowMap;stage.append(renderer.domElement);
    scene=new T.Scene();const backdrop=document.createElement('canvas');backdrop.width=backdrop.height=512;const bg=backdrop.getContext('2d'),gradient=bg.createRadialGradient(300,240,20,256,256,410);gradient.addColorStop(0,'#233c43');gradient.addColorStop(.6,'#142b33');gradient.addColorStop(1,'#0a1a22');bg.fillStyle=gradient;bg.fillRect(0,0,512,512);const background=new T.CanvasTexture(backdrop);background.colorSpace=T.SRGBColorSpace;scene.background=background;camera=new T.PerspectiveCamera(36,stage.clientWidth/stage.clientHeight,.1,150);camera.position.set(10,8,13);controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.075;controls.minDistance=.6;controls.maxDistance=70;controls.maxPolarAngle=Math.PI*.82;controls.target.set(0,2,0);controls.addEventListener('start',()=>{camTween=null;});
    const environment=studioEnvironment(renderer);scene.environment=environment.texture;scene.environmentIntensity=1.0;
    scene.add(new T.HemisphereLight('#e4e8eb','#171b20',.28));
    const key=new T.DirectionalLight('#fff0db',3.1);key.position.set(-5,9,8);key.castShadow=true;key.shadow.mapSize.set(innerWidth<760?2048:4096,innerWidth<760?2048:4096);Object.assign(key.shadow.camera,{left:-10,right:10,top:12,bottom:-7,near:.5,far:35});key.shadow.normalBias=.025;key.shadow.bias=-.0001;key.shadow.radius=2.5;scene.add(key);
    const rim=new T.DirectionalLight('#b9e4f6',2.6);rim.position.set(6,6,-4);scene.add(rim);const fill=new T.DirectionalLight('#f0f2f0',.65);fill.position.set(1,2,10);scene.add(fill);
    studioFloor=new T.Mesh(new T.PlaneGeometry(26,20),new T.ShadowMaterial({color:'#02070a',opacity:.25,depthWrite:false}));studioFloor.rotation.x=-Math.PI/2;studioFloor.position.y=-.34;studioFloor.receiveShadow=true;scene.add(studioFloor);
    filter=buildTrickle();scene.add(filter.root);optics=createWaterOptics(renderer,scene,camera,filter.water,filter.opticsExcluded);
    renderer.domElement.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY};});
    renderer.domElement.addEventListener('pointerup',e=>{if(down&&Math.hypot(e.clientX-down.x,e.clientY-down.y)<6){const hit=intersect(e);if(hit){endTour();if(state.mode==='care')setMode('cutaway',{changeTab:false});tab('explore',{syncMode:false});select(hit.object.userData.part);}}down=null;});
    renderer.domElement.addEventListener('pointermove',e=>{if(down)return;const hit=intersect(e);$('tooltip').hidden=!hit;renderer.domElement.style.cursor=hit?'pointer':'grab';if(hit){$('tooltip').textContent=filter.parts.get(hit.object.userData.part).name;const r=stage.getBoundingClientRect();$('tooltip').style.left=clamp(e.clientX-r.left+15,12,r.width-220)+'px';$('tooltip').style.top=clamp(e.clientY-r.top-30,10,r.height-35)+'px';}});
    renderer.domElement.addEventListener('pointerleave',()=>{$('tooltip').hidden=true;down=null;});renderer.domElement.addEventListener('pointercancel',()=>{down=null;});
    renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();state.ready=false;$('error').hidden=false;$('error').querySelector('b').textContent='The 3D view was interrupted. Reload to restore it.';});
    new ResizeObserver(()=>{if(!stage.clientWidth||!stage.clientHeight)return;renderer.transmissionResolutionScale=stage.clientWidth<760?.5:.8;camera.aspect=stage.clientWidth/stage.clientHeight;camera.updateProjectionMatrix();renderer.setSize(stage.clientWidth,stage.clientHeight);fit();}).observe(stage);
    filter.pose(state);state.ready=true;$('loading').hidden=true;document.body.dataset.ready='true';select('biomedia');fit();renderer.setAnimationLoop(frame);
    // Read-only diagnostics for repeatable browser checks; no hidden mutation API.
    window.trickleStudio={snapshot:()=>({...state,partCount:filter.parts.size,drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,camera:camera.position.toArray(),effects:filter.snapshot(),optics:optics.snapshot()})};
  }catch(err){console.error('Trickle studio:',err);$('loading').hidden=true;$('error').hidden=false;}
}
function frame(now){
  const dt=Math.min((now-last)/1000,.05);last=now;if(!state.ready||document.hidden)return;
  if(!state.paused){const step=dt*(state.slow?1/3:1);state.time+=step;const h=hydraulics(state);if(state.care<0&&state.amount<.02&&!state.isolated){if(h.flow>.005){state.flowTime+=step*(.55+h.flow*.55);state.arrowTime+=step*.07*Math.max(.3,h.flow);}if(h.running)state.rotorAngle+=step*(2+h.setting*5);const target=state.power?0:1;state.drainback=clamp(state.drainback+(target?1:-1)*step*.35,0,1);}if(state.sequence){state.sequenceTime+=dt;const t=state.sequenceTime;state.target=t<3?smooth(t/3):t<5?1:t<8?1-smooth((t-5)/3):0;if(t>=8){stopSequence();setMode('assembled');}}}
  state.amount+= (state.target-state.amount)*(reduced.matches?1:Math.min(1,dt*5));if(Math.abs(state.target-state.amount)<.0001)state.amount=state.target;
  filter.pose(state,dt);studioFloor.visible=!state.isolated&&!['pump','media'].includes(state.mode);studioFloor.position.y=-.34-state.amount*1.4;updateFlowText();
  if(camTween){camTween.elapsed+=dt;const t=smooth(Math.min(1,camTween.elapsed/.8));camera.position.lerpVectors(camTween.from,camTween.to,t);controls.target.lerpVectors(camTween.fromTarget,camTween.target,t);if(t>=1)camTween=null;}
  controls.autoRotate=state.rotate&&!state.paused;controls.autoRotateSpeed=.5;controls.update();labels();optics.capture(state.time);renderer.render(scene,camera);
  if(document.activeElement!==$('explode'))$('explode').value=Math.round(state.amount*100);$('explode-value').textContent=Math.round(state.amount*100)+'%';document.body.dataset.explosion=String(Math.round(state.amount*100));document.body.dataset.motion=state.paused?'paused':'running';
}
init();
