// Slow-motion kinematics of existing real mesh parts. No duplicate decorative gear overlay.
import * as T from 'three';
import { h } from './dom.js';
import { VIEWS, anglesQuat } from './rig.js';
import { LAY, LINK, linkPose, CAM } from './assemblies/flight-motor-lay.js';

export function initMechanisms(app) {
  const {bee,selection,rig,stage}=app,poses=new Map(),x=new T.Vector3(1,0,0),y=new T.Vector3(0,1,0),z=new T.Vector3(0,0,1);
  const state={active:false,paused:matchMedia('(prefers-reduced-motion: reduce)').matches,clock:0,speed:1,focus:null};
  const focusViews=new Map();
  let macro=false,savedLabels=null,savedExplode=0;
  const initial=linkPose(), motor='flight-motor/';
  const button=(text,fn)=>h('button',{type:'button',onclick:fn},text);
  const pause=button(state.paused?'Resume mechanisms':'Pause mechanisms',()=>{state.paused=!state.paused;pause.textContent=state.paused?'Resume mechanisms':'Pause mechanisms';app.invalidate();});
  const opacity=h('input',{type:'range',min:0,max:30,value:9,'aria-label':'X-ray shell opacity'});
  opacity.addEventListener('input',()=>{for(const material of selection.ghosts.values())material.opacity=+opacity.value/100;app.invalidate();});
  const speed=h('input',{type:'range',min:25,max:200,value:100,'aria-label':'Mechanism playback speed'});speed.addEventListener('input',()=>{state.speed=+speed.value/100;});
  function gearboxView(){bee.root.updateMatrixWorld(true);return bee.get('wing-mount-r').node.getWorldQuaternion(new T.Quaternion()).multiply(new T.Quaternion().setFromAxisAngle(y,Math.PI*.42));}
  function focus(id,view){
    focusViews.set(id,view);state.focus=id;const previous=app.getExplode();app.setExplode(0,0);
    selection.select(bee.get(id));selection.setIsolate(true);macro=true;app.ui.inspector.el.hidden=true;const points=[];bee.worldCorners([...bee.get(id).walk()],points);
    rig.frameCorners(points,{ms:1200,quat:view,margin:1.35,band:app.fitBand()});app.state.framed=true;app.setExplode(previous,0);app.setExplode(0,1200);app.invalidate();
  }
  const card=h('section',{class:'xray-mechanisms panel','aria-label':'Working internal mechanisms',hidden:true},
    h('span',{class:'op-eyebrow'},'APX-9 / LIVE CUTAWAY'),h('h2',null,'Inside the mechanism.'),
    h('p',null,'Explore coordinated optical irises, sensor gimbals, six linked coolant pistons, helical pollen transport, flight gearing and a telescoping probe.'),
    h('div',{class:'op-choices'},button('Flight drive',()=>focus('flight-motor',anglesQuat(12,-64))),button('Wing gearbox',()=>focus('wing-mount-r/servo-gearbox',gearboxView())),button('Optical head',()=>focus('head-frame/optical-drive-r',anglesQuat(0,-8))),button('Cooling pumps',()=>focus('power-core/coolant-bank',anglesQuat(8,-12))),button('Pollen drive',()=>focus('pollination-module',anglesQuat(28,-22))),button('Sampling jaws',()=>focus('mandibles',anglesQuat(25,-10))),button('Tail probe',()=>focus('stinger',anglesQuat(-10,-8))),button('Whole unit',()=>{macro=false;state.focus=null;selection.setIsolate(false);selection.clear();app.frameAll({ms:1200,quat:VIEWS.hero(),margin:1.2});})),
    h('label',null,'Shell opacity',opacity),h('label',null,'Slow-motion speed',speed),pause,
    h('small',null,'Illustrative slow-motion mechanics. Gear ratios and slider-crank motion follow the modeled geometry; this is not a flight simulation.'));
  const content=h('div',{class:'xray-content'});while(card.firstChild)content.append(card.firstChild);pause.remove();card.append(content,h('footer',null,pause));
  document.getElementById('ui').append(card);
  const oldFit=app.fitBand;
  app.fitBand=()=>{if(card.hidden)return oldFit?.();const W=stage.size.x,H=stage.size.y;if(W<760){const top=card.getBoundingClientRect().top;return {w:W-20,h:Math.max(100,top-105),cx:0,cy:(105+top)/2-H/2};}return {w:W-380,h:H-170,cx:160,cy:5};};
  function restore(){for(const [p,s]of poses){p.node.position.copy(s.p);p.node.quaternion.copy(s.q);}poses.clear();}
  function save(p){if(p&&!poses.has(p))poses.set(p,{p:p.node.position.clone(),q:p.node.quaternion.clone()});return p;}
  function rotate(id,axis,angle,pivot=[0,0,0]){
    const p=save(bee.get(id));if(!p)return;
    const v=new T.Vector3(...pivot).multiply(p.node.scale),old=v.clone().applyQuaternion(p.node.quaternion);
    p.node.quaternion.multiply(new T.Quaternion().setFromAxisAngle(axis,angle));p.node.position.add(old.sub(v.applyQuaternion(p.node.quaternion)));
  }
  function move(id,dx,dz=0){const p=save(bee.get(id));if(p){p.node.position.x+=dx;p.node.position.z+=dz;}}
  function pose(expanded=true){
    const drive=state.clock*2.0,compound=-drive*10/16,crank=drive*100/256;
    rotate(motor+'gear-train/pinion',y,drive,[LAY.g1,0,0]);
    rotate(motor+'gear-train/compound-gear',y,compound,[LAY.g2,0,0]);
    rotate(motor+'gear-train/crank-gear',y,crank,[LAY.g3,0,0]);
    rotate(motor+'cam/cam-disc',y,compound,[LAY.g2,0,0]);
    rotate(motor+'cam/follower',y,Math.sin(compound)*.065,[CAM.pivot[0],0,CAM.pivot[1]]);
    const theta=LAY.crankA*Math.PI/180-crank,cx=LAY.g3+Math.cos(theta)*LAY.crankR,cz=Math.sin(theta)*LAY.crankR;
    const sx=cx+Math.sqrt(LINK.L*LINK.L-cz*cz),oldAngle=Math.atan2(-initial.cz,initial.sx-initial.cx),newAngle=Math.atan2(-cz,sx-cx);
    rotate(motor+'crank-linkage/conrod',y,-(newAngle-oldAngle),[initial.cx,0,initial.cz]);
    move(motor+'crank-linkage/conrod',cx-initial.cx,cz-initial.cz);move(motor+'crank-linkage/crank-cap',cx-initial.cx,cz-initial.cz);
    for(const id of ['slider','output-rod'])move(motor+'crank-linkage/'+id,sx-initial.sx);
    for(const side of ['r','l']){
      const base=`wing-mount-${side}/`,sign=side==='r'?1:-1,input=drive*sign,carrier=input/4;
      rotate(base+'servo-gearbox/sun-gear',x,input);
      for(const id of ['carrier-front','carrier-rear'])rotate(base+'servo-gearbox/'+id,x,carrier);
      rotate(base+'angle-sensor/encoder-disc',x,carrier);
      for(let i=0;i<4;i++){
        const id=base+`servo-gearbox/planets/planet-${i}`,a=i*Math.PI/2,p=save(bee.get(id));if(!p)continue;
        const centre=new T.Vector3(0,Math.cos(a)*.4,Math.sin(a)*.4*sign),orbit=new T.Quaternion().setFromAxisAngle(x,carrier),spin=new T.Quaternion().setFromAxisAngle(x,-input/2);
        const delta=centre.clone().applyQuaternion(orbit).sub(centre.clone().applyQuaternion(spin));
        p.node.position.add(delta.applyQuaternion(p.node.quaternion));p.node.quaternion.multiply(spin);
      }
    }
    if(expanded){
      const t=state.clock;
      for(const side of ['r','l']){
        const b=`head-frame/optical-drive-${side}/yaw-ring`,sgn=side==='r'?1:-1;
        rotate(b,y,Math.sin(t*.8)*.13);rotate(b+'/pitch-ring',x,Math.sin(t*.65+.5)*.12);
        const lens=save(bee.get(b+'/pitch-ring/focus-carriage'));if(lens)lens.node.translateZ(Math.sin(t*1.2)*.09);
        for(let i=0;i<6;i++)rotate(b+'/pitch-ring/iris-'+i,z,(.5+.5*Math.sin(t*.9))*.68);
        rotate('head-frame/cooling-'+side+'/rotor',z,t*3.2*sgn);
        rotate('mandibles/jaw-'+side,z,Math.sin(t*1.1)*.10,[12.05,-2.1,sgn*.85]);
      }
      for(let i=0;i<6;i++){
        const b='power-core/coolant-bank/pump-'+i,a=t*2.2+i*Math.PI/3,cy=.22*Math.cos(a),cz=.22*Math.sin(a),sy=cy+Math.sqrt(.72*.72-cz*cz);
        rotate(b+'/eccentric',x,a);rotate(b+'/conrod',x,Math.atan2(-cz,sy-cy));
        const rod=save(bee.get(b+'/conrod'));if(rod){rod.node.position.y+=(cy+sy)/2-.58;rod.node.position.z+=cz/2;}
        const piston=save(bee.get(b+'/piston'));if(piston)piston.node.position.y+=sy-.94;
      }
      for(const side of ['r','l'])rotate('power-core/coolant-bank/radiator-'+side+'/rotor',z,t*2.6);
      for(const id of ['collection-chamber/auger','distribution-vanes','drive-motor/motor-shaft','pollen-brush'])rotate('pollination-module/'+id,x,t*1.7);
      const extension=(1-Math.cos(t*.8))*.5;
      for(let i=1;i<=7;i++){const p=save(bee.get('stinger/sheath/seg-'+i));if(p)p.node.translateY(extension*i*.045);}
      for(const [id,d]of [['needle',.48],['sampling-tube',.22],['joint-3',.30]]){const p=save(bee.get('stinger/'+id));if(p)p.node.translateY(extension*d);}
    }
    state.articulatedParts=poses.size;
    bee.root.updateMatrixWorld(true);app.picker.valid=false;app.state.shadowDirty=true;
  }
  const oldTick=app.tick;
  app.tick=(dt,now)=>{
    restore();const prior=oldTick?.(dt,now),on=selection.xray;
    if(app.operations.state.mode==='repair'){card.hidden=true;state.active=false;macro=false;state.focus=null;savedLabels=null;const t=app.operations.state.repairT;if(t>=24&&t<30){const clock=state.clock;state.clock=t-24;pose(false);state.clock=clock;}return prior;}
    const was=state.active;state.active=on;
    const touring=app.ui.state.tour>=0;
    card.hidden=!on||touring;
    if(!card.hidden){const dock=document.querySelector('.dock').getBoundingClientRect();card.style.bottom=stage.size.x<760?`${stage.size.y-dock.top+10}px`:'';}
    if(!on){if(was){if(macro){macro=false;state.focus=null;if(!touring&&app.operations.state.mode==='inspect'){app.setExplode(savedExplode,0);selection.setIsolate(false);selection.clear();app.frameAll({ms:1000,quat:VIEWS.hero(),margin:1.2});}}if(savedLabels!==null){if(!touring&&app.operations.state.mode==='inspect')app.ui.setLabels(savedLabels);savedLabels=null;}bee.setExplode(app.getExplode(),true);app.invalidate(true);}return prior;}
    if(!was&&!touring){savedExplode=app.getExplode();savedLabels=app.ui.state.labelsOn;if(savedLabels)app.ui.setLabels(false);requestAnimationFrame(()=>app.frameAll({ms:1000,quat:rig.quat,margin:1.2}));}
    const moving=!state.paused&&!(touring&&app.ui.state.tourPaused);
    if(moving)state.clock+=dt*state.speed;
    bee.setExplode(app.getExplode(),true);pose();
    return moving||prior;
  };
  window.addEventListener('resize',()=>requestAnimationFrame(()=>requestAnimationFrame(()=>{if(!state.active||app.ui.state.tour>=0)return;if(state.focus)focus(state.focus,focusViews.get(state.focus)||anglesQuat(12,-64));else app.frameAll({ms:350,quat:rig.quat,margin:1.2});})));
  app.mechanisms={state,focus,restore,gearboxView};
}
