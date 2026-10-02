// A reversible service demonstration using the real APX-9 assemblies.
import * as T from 'three';
import { h } from './dom.js';
import { VIEWS } from './rig.js';
export const REPAIR_DURATION=44;
const TIMES=[0,6,12,18,24,30,35,44];
const NAMES=['Diagnose','Open cover','Extract','Fit spare','Calibrate','Reassemble','Test flight','Ready'];
const NOTES=['R-07 · right wing stalls under load. Comparing actuator response.','Drive isolated. Lifting the thorax shell to reach the wing root.','Disconnecting the failed oscillation actuator from the reduction stage.','A fresh actuator follows the guide rails into its coupling.','Slow-motion gearbox check. Both wing channels now track together.','Securing the actuator and lowering the thorax cover.','Balanced wing response. Lift, hold, then settle back onto the workbench.','PASS · actuator replaced, calibration complete, flight check passed.'];
const ease=x=>{x=T.MathUtils.clamp(x,0,1);return x*x*(3-2*x);};
const ramp=(t,a,b)=>ease((t-a)/(b-a));
export function createRepair(app,parent){
 const {bee,rig,selection,stage}=app,poses=new Map(),materials=new Map();
 const state={active:false,step:-1,time:0,complete:false};
 const root=new T.Group();root.name='repair-service';root.visible=false;parent.add(root);
 const servo=bee.get('wing-mount-r/oscillation-servo'),cover=bee.get('thorax-armor'),mount=bee.get('wing-mount-r');
 const spare=servo.node.clone(true);spare.name='replacement-actuator';root.add(spare);spare.matrixAutoUpdate=false;
 spare.traverse(o=>{if(o.isMesh){o.layers.set(4);o.material=o.material.clone();if(o.material.color)o.material.color.lerp(new T.Color(0x5be7c0),.25);}});
 const rails=[-.35,.35].map(y=>{const line=new T.Line(new T.BufferGeometry(),new T.LineDashedMaterial({color:0x67dcbf,transparent:true,opacity:.4,dashSize:.12,gapSize:.09}));line.layers.set(4);line.userData.y=y;root.add(line);return line;});
 const signalMat=new T.MeshBasicMaterial({color:0xffad4c,transparent:true,opacity:.8,depthWrite:false});
 const ring=new T.Mesh(new T.TorusGeometry(1,.018,6,80),signalMat);ring.layers.set(4);root.add(ring);
 const halo=new T.Mesh(new T.RingGeometry(.96,1,80),new T.MeshBasicMaterial({color:0x5be7c0,transparent:true,opacity:.4,side:T.DoubleSide,depthWrite:false}));halo.layers.set(4);halo.rotation.x=-Math.PI/2;root.add(halo);
 const hud=h('svg:svg',{class:'repair-hud','aria-hidden':'true',hidden:true});
 const labels=['SERVICE TARGET / R-07','REPLACEMENT / READY'].map(text=>{const dot=h('svg:circle',{r:3}),line=h('svg:path'),label=h('svg:text',null,text),g=h('svg:g',null,dot,line,label);hud.append(g);return {g,dot,line,label};});
 document.getElementById('ui').append(hud);
 let ui=null,previousContext=null;
 function remember(p){if(p&&!poses.has(p))poses.set(p,{position:p.node.position.clone(),quaternion:p.node.quaternion.clone(),visible:p.node.visible});return p;}
 function restore(){for(const [p,v] of poses){p.node.position.copy(v.position);p.node.quaternion.copy(v.quaternion);p.node.visible=v.visible;}poses.clear();}
 function tint(on){
  if(on){for(const p of servo.walk())for(const m of p.meshes){if(materials.has(m))continue;materials.set(m,m.material);const a=m.material.clone();if(a.color)a.color.lerp(new T.Color(0xe97748),.48);m.material=a;}}
  else {for(const [m,a]of materials){m.material.dispose();m.material=a;}materials.clear();}
 }
 function activate(on){restore();state.active=on;root.visible=on;hud.toggleAttribute('hidden',!on);state.step=-1;previousContext=null;state.complete=false;tint(false);if(on)tint(true);else{selection.setIsolate(false);selection.clear();}app.invalidate(true);}
 function build(body,status,op,restart){
  const step=h('span',{class:'repair-step-label'}),elapsed=h('span'),header=h('div',{class:'repair-readout'},step,elapsed);
  const seek=h('input',{type:'range',min:0,max:440,value:0,'aria-label':'Repair sequence progress'});
  seek.addEventListener('input',()=>{op.repairT=+seek.value/10;op.paused=true;document.querySelector('.operate-panel footer button').textContent='Resume motion';app.invalidate();});
  const track=h('div',{class:'repair-track'},...NAMES.slice(0,7).map((s,i)=>h('span',{'data-stage':i},h('b',null,String(i+1).padStart(2,'0')),s)));
  const plot=h('svg:svg',{viewBox:'0 0 260 66','aria-label':'Illustrative left and right actuator response',role:'img'}),left=h('svg:path',{class:'response-left'}),right=h('svg:path',{class:'response-right'});
  plot.append(h('svg:path',{class:'response-grid',d:'M0 17H260 M0 49H260 M65 0V66 M130 0V66 M195 0V66'}),left,right);
  const chart=h('div',{class:'repair-response'},h('div',null,h('span',null,'L / REFERENCE'),h('span',{class:'repair-health'},'R / FAULT')),plot);
  body.append(header,seek,track,chart,h('button',{type:'button',onclick:restart},'Replay repair'),h('small',null,'Automatic service demonstration · slowed mechanics and illustrative response traces, not measured telemetry. Pause or scrub to inspect.'));
  ui={step,elapsed,seek,track,left,right,health:chart.querySelector('.repair-health'),status,op};
 }
 function context(macro){
  const key=macro?(state.time>=24?'calibration':'exchange'):'whole';if(previousContext===key)return;previousContext=key;
  selection.setIsolate(false);selection.clear();
  if(macro){for(const id of ['servo-gearbox','oscillation-servo','angle-sensor'])selection.select(bee.get('wing-mount-r/'+id),{additive:true});selection.setIsolate(true);app.ui.inspector.el.hidden=true;}
  clearTimeout(app.ui.state.panelTimer);frame(macro,app.operations?.state.paused?0:1600);
 }
 function frame(macro=state.time>=12&&state.time<30,ms=0){
  if(!state.active)return;
  if(ms===0)rig.tween=null;
  const points=[];
  if(macro){
   mount.node.updateWorldMatrix(true,false);
   const calibrated=state.time>=24;
   for(const x of calibrated?[-2.4,-.5]:[-7.2,-.5])for(const y of [-.9,.9])for(const z of calibrated?[-.9,.9]:[-2.3,2.9])points.push(mount.node.localToWorld(new T.Vector3(x,y,z)));
   const q=mount.node.getWorldQuaternion(new T.Quaternion()).multiply(new T.Quaternion().setFromAxisAngle(new T.Vector3(0,1,0),Math.PI*.30));
   rig.frameCorners(points,{ms,quat:q,margin:1.16,band:app.fitBand()});
  }else{
   // Fixed service volume prevents breathing as the cover and bee move.
   for(const x of [-30,30])for(const y of [-12,22])for(const z of [-29,29])points.push(new T.Vector3(x,y,z));
   rig.frameCorners(points,{ms,quat:VIEWS.hero(),margin:1.06,band:app.fitBand()});
  }
  app.state.framed=true;app.invalidate();
 }
 function update(t){
  if(!state.active)return;state.time=t;state.complete=t>=44;
  const next=TIMES.findIndex(v=>v>t),step=next<0?7:Math.max(0,next-1);state.step=step;
  const macro=t>=12&&t<30;context(macro);
  const lift=ramp(t,6,11)*(1-ramp(t,30,35));remember(cover);cover.node.position.y+=lift*9;
  const failed=remember(servo),base=failed.node.position.clone();
  const extraction=ramp(t,12,17),insert=ramp(t,18,23);
  servo.node.position.x-=extraction*4.8;servo.node.position.z-=ramp(t,17,20)*1.8;
  servo.node.visible=t<23.8||t>=24;
  if(t>=24){servo.node.position.copy(base);tint(false);}else if(!materials.size)tint(true);
  // Replacement shares the modeled servo geometry, but has its own transform/materials.
  const local=new T.Matrix4().compose(base.clone().add(new T.Vector3(-4.8*(1-insert),0,2.4*(1-ramp(t,18,20)))),servo.node.quaternion,servo.node.scale);
  servo.node.parent.updateWorldMatrix(true,false);spare.matrix.multiplyMatrices(servo.node.parent.matrixWorld,local);spare.visible=t>=12&&t<24;
  // Expose the brass planets by lifting the front carrier, retaining every original mesh.
  const carrier=remember(bee.get('wing-mount-r/servo-gearbox/carrier-front'));carrier.node.position.x+=.8*lift;
  for(const side of ['r','l']){const p=remember(bee.get('wing-'+side));const repaired=t>=24;const flutter=t<6?(side==='r'?-.22+Math.sin(t*12)*.035:Math.sin(t*8)*.13):t>=35&&t<43?Math.sin(t*18)*.30:repaired&&t<30?Math.sin(t*5)*.09:0;p.node.rotateY((side==='r'?1:-1)*flutter);}
  const flight=ramp(t,35,38)*(1-ramp(t,41,44));bee.root.position.y=flight*(6+Math.sin(t*2)*.25);
  bee.root.updateMatrixWorld(true);
  for(const line of rails){line.visible=macro&&t<24;line.geometry.setFromPoints([-7,-1.9].map(x=>mount.node.localToWorld(new T.Vector3(x,line.userData.y,0))));line.computeLineDistances();}
  ring.visible=t<12;ring.position.copy(mount.node.localToWorld(new T.Vector3(-1.5,0,0)));ring.quaternion.copy(stage.camera.quaternion);ring.scale.setScalar(2.5+Math.sin(t*3)*.2);signalMat.opacity=.55+.2*Math.sin(t*4);
  halo.visible=t>=35;halo.position.set(0,-10,0);halo.scale.setScalar(18);halo.material.opacity=.2+flight*.25;
  if(ui){ui.step.textContent=`${String(Math.min(7,step+1)).padStart(2,'0')} / ${NAMES[step]}`;ui.elapsed.textContent=`${Math.floor(t)} / 44 s`;ui.seek.value=Math.round(t*10);ui.status.textContent=NOTES[step];ui.track.querySelectorAll('span').forEach((s,i)=>{s.dataset.state=i<step?'done':i===step?'active':'pending';});ui.health.textContent=t<24?'R / FAULT':'R / SYNCHRONIZED';ui.health.classList.toggle('healthy',t>=24);
   const path=(bad,y)=>Array.from({length:81},(_,i)=>{const a=i/80*260,v=Math.sin(i*.26-t*5);return `${i?'L':'M'}${a.toFixed(1)},${(y+(bad?v*.9+Math.sin(i*1.8-t*15)*1.7:v*9)).toFixed(1)}`;}).join(' ');
   ui.left.setAttribute('d',path(false,17));ui.right.setAttribute('d',path(t<24,49));ui.right.classList.toggle('healthy',t>=24);
  }
  hud.setAttribute('viewBox',`0 0 ${stage.size.x} ${stage.size.y}`);
  const positions=[servo.node.localToWorld(servo.centerLocal.clone()),servo.centerLocal.clone().applyMatrix4(spare.matrix)];
  labels.forEach((l,i)=>{const v=positions[i].project(stage.camera),x=(v.x+1)*stage.size.x/2,y=(1-v.y)*stage.size.y/2,band=app.fitBand(),top=stage.size.y/2+band.cy-band.h/2,bottom=top+band.h;l.g.style.display=(i===1&&!spare.visible)||x<15||x>stage.size.x-15||y<top+20||y>bottom-25||Math.abs(v.z)>1?'none':'';l.dot.setAttribute('cx',x);l.dot.setAttribute('cy',y);const endX=T.MathUtils.clamp(x+(i?35:-145),stage.size.x<760?15:370,stage.size.x-190),endY=T.MathUtils.clamp(y+(i?40:-40),top+20,bottom-20);l.line.setAttribute('d',`M${x} ${y}L${endX} ${endY}h150`);l.label.setAttribute('x',endX);l.label.setAttribute('y',endY-6);l.label.textContent=i?'SPARE / ALIGNED':t>=24?'ACTUATOR / VERIFIED':'FAULTED ACTUATOR / R-07';});
  app.picker.valid=false;app.state.shadowDirty=true;
 }
 return {state,activate,restore,build,update,frame,spare,root};
}
