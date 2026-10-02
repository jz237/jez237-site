// Explanatory flow overlays anchored to the real part registry, not simulated electrical telemetry.
import * as T from 'three';
import { h } from './dom.js';

export const SYSTEMS = {
  energy: { color: 0x32d8ff, title: 'Power distribution', note: 'Charge leaves the core and branches to the wing actuators and pollen collector.',
    links: [['power-core','wing-mount-r'],['power-core','wing-mount-l'],['power-core','pollination-module']],
    labels: {'power-core':'POWER CORE','wing-mount-r':'RIGHT ACTUATOR','wing-mount-l':'LEFT ACTUATOR','pollination-module':'COLLECTOR DRIVE'} },
  signals: { color: 0xb58bff, title: 'Sense → process → respond', note: 'Optical and antenna inputs converge at the processor; control packets return to both wings.',
    links: [['eye-r','neural-processor'],['eye-l','neural-processor'],['antenna-r','neural-processor'],['neural-processor','wing-mount-r'],['neural-processor','wing-mount-l']],
    labels: {'eye-r':'RIGHT OPTICS','eye-l':'LEFT OPTICS','antenna-r':'ANTENNA ARRAY','neural-processor':'NEURAL PROCESSOR','wing-mount-r':'RIGHT WING CONTROL','wing-mount-l':'LEFT WING CONTROL'} },
  pollen: { color: 0xffbd43, title: 'Collect → transfer → store', note: 'Grains move from the rear-leg brushes through the collection module into the abdomen.',
    links: [['leg-rear-r','pollination-module'],['leg-rear-l','pollination-module'],['pollination-module','abdomen-shell']],
    labels: {'leg-rear-r':'RIGHT LEG BRUSH','leg-rear-l':'LEFT LEG BRUSH','pollination-module':'POLLEN COLLECTOR','abdomen-shell':'ABDOMEN STORAGE'} },
};

export function createSystems(app, parent) {
  const {bee,stage}=app, group=new T.Group();group.name='system-flow-network';parent.add(group);group.visible=false;
  const svg=h('svg:svg',{class:'systems-hud',hidden:true,'aria-hidden':'true'});document.getElementById('ui').append(svg);
  const paths=[],nodes=[],originals=new Map(),cache=new Map();
  const state={mode:'energy',focus:-1,context:true,active:false,revision:0};
  const sphere=new T.SphereGeometry(1,12,8), grain=new T.IcosahedronGeometry(.19,1), packet=new T.BoxGeometry(.65,.20,.20),cone=new T.ConeGeometry(.28,.78,8);
  const axis=new T.Vector3(0,1,0), identity=new T.Vector3(1,0,0);
  const glowCanvas=document.createElement('canvas');glowCanvas.width=glowCanvas.height=64;
  const c=glowCanvas.getContext('2d'),gradient=c.createRadialGradient(32,32,0,32,32,32);gradient.addColorStop(0,'#ffffff');gradient.addColorStop(.20,'#ffffffa0');gradient.addColorStop(1,'#ffffff00');c.fillStyle=gradient;c.fillRect(0,0,64,64);const glowTexture=new T.CanvasTexture(glowCanvas);
  function basic(color,opacity=1){return new T.MeshBasicMaterial({color,transparent:opacity<1,opacity,depthWrite:false,depthTest:false,toneMapped:false});}
  function mesh(geo,mat,parent=group){const m=new T.Mesh(geo,mat);m.layers.set(4);m.renderOrder=15;parent.add(m);return m;}
  function anchor(id){return bee.get(id).node.localToWorld(bee.get(id).centerLocal.clone());}
  const record=new Map();for(const p of bee.parts)for(const m of p.meshes)record.set(m,p);
  function restore(){for(const [m,material]of originals)m.material=material;originals.clear();}
  function material(base,lit){
    const key=base.uuid+':'+(lit?state.mode:'dim');if(cache.has(key))return cache.get(key);
    const clone=base.clone();if(clone.color){if(lit)clone.color.lerp(new T.Color(SYSTEMS[state.mode].color),.56);else clone.color.multiplyScalar(.30);}
    if(clone.emissive){clone.emissive.setHex(lit?SYSTEMS[state.mode].color:0);clone.emissiveIntensity=lit?.40:0;}
    if(!lit&&'envMapIntensity'in clone)clone.envMapIntensity=.24;
    cache.set(key,clone);return clone;
  }
  function highlight(){
    restore();if(!state.active||!state.context)return;
    const cfg=SYSTEMS[state.mode],links=state.focus<0?cfg.links:[cfg.links[state.focus]],active=new Set();
    for(const id of links.flat())for(const p of bee.get(id).walk())active.add(p);
    for(const [m,p]of record){originals.set(m,m.material);m.material=Array.isArray(m.material)?m.material.map(b=>material(b,active.has(p))):material(m.material,active.has(p));}
    app.invalidate();
  }
  function disposeNetwork(){
    for(const p of paths){p.tube.geometry.dispose();p.halo.geometry.dispose();p.tube.material.dispose();p.halo.material.dispose();p.particleMat.dispose();p.arrowMat.dispose();}
    for(const n of nodes){n.ring.geometry.dispose();n.ring.material.dispose();n.ripple.geometry.dispose();n.ripple.material.dispose();n.sprite.material.dispose();}
    group.clear();paths.length=nodes.length=0;svg.replaceChildren();
  }
  function build(mode){
    restore();disposeNetwork();state.mode=mode;state.focus=-1;state.revision++;
    const cfg=SYSTEMS[mode],color=new T.Color(cfg.color);svg.style.setProperty('--flow-color','#'+color.getHexString());
    cfg.links.forEach(([from,to],i)=>{
      const tubeMaterial=new T.ShaderMaterial({transparent:true,depthTest:false,depthWrite:false,uniforms:{time:{value:0},color:{value:color},emphasis:{value:1},kind:{value:mode==='energy'?0:mode==='signals'?1:2}},
        vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
        fragmentShader:`varying vec2 vUv;uniform float time,emphasis,kind;uniform vec3 color;void main(){float t=fract(vUv.x*6.-time*.65);float pulse=pow(max(0.,1.-abs(t-.5)*2.),9.);float base=kind<.5?.32:.13;gl_FragColor=vec4(mix(color,vec3(1.),pulse*.8),(base+pulse*.65)*emphasis);}`});
      const tube=mesh(new T.BufferGeometry(),tubeMaterial),halo=mesh(new T.BufferGeometry(),basic(cfg.color,.075));
      const particleMat=basic(mode==='energy'?0xd8faff:cfg.color),arrowMat=basic(cfg.color,.8);
      const count=mode==='pollen'?30:mode==='signals'?15:9;
      const particles=Array.from({length:count},()=>mesh(mode==='pollen'?grain:mode==='signals'?packet:sphere,particleMat));
      if(mode==='energy')particles.forEach(m=>m.scale.set(.16,.16,.16));
      const arrows=Array.from({length:3},()=>mesh(cone,arrowMat));
      paths.push({from,to,tube,halo,particles,particleMat,arrowMat,arrows,curve:null,last:''});
    });
    [...new Set(cfg.links.flat())].forEach((id,i)=>{
      const ring=mesh(new T.TorusGeometry(1,.035,5,48),basic(cfg.color,.86));
      const ripple=mesh(new T.TorusGeometry(1,.023,5,48),basic(cfg.color,.32));
      const sprite=new T.Sprite(new T.SpriteMaterial({map:glowTexture,color:cfg.color,transparent:true,opacity:.5,depthTest:false,depthWrite:false,toneMapped:false}));sprite.layers.set(4);sprite.renderOrder=14;group.add(sprite);
      const rect=h('svg:rect',{rx:5,width:156,height:34}),text=h('svg:text'),dot=h('svg:circle',{r:3}),line=h('svg:path');
      const label=h('svg:g',null,line,rect,text,dot);svg.append(label);text.textContent=cfg.labels[id];
      nodes.push({id,ring,ripple,sprite,label,rect,text,dot,line,index:i,position:new T.Vector3()});
    });
    highlight();
  }
  function setFocus(index){state.focus=index;highlight();app.invalidate();}
  function setContext(on){state.context=on;highlight();app.invalidate();}
  function activate(on){state.active=on;group.visible=on;svg.toggleAttribute('hidden',!on);if(on)highlight();else restore();}
  function update(mode,time){
    if(mode!==state.mode||!paths.length)build(mode);
    const cfg=SYSTEMS[mode],visibleNodes=new Set((state.focus<0?cfg.links:[cfg.links[state.focus]]).flat());
    paths.forEach((p,i)=>{
      const a=anchor(p.from),b=anchor(p.to),signature=[...a.toArray(),...b.toArray()].map(n=>n.toFixed(3)).join(',');
      if(signature!==p.last){
        p.last=signature;const middle=a.clone().lerp(b,.5);middle.y+=4+i*.9;middle.z+=(i%2?1:-1)*(4+i*.4);
        p.curve=new T.QuadraticBezierCurve3(a,middle,b);
        p.tube.geometry.dispose();p.halo.geometry.dispose();p.tube.geometry=new T.TubeGeometry(p.curve,64,.095,6,false);p.halo.geometry=new T.TubeGeometry(p.curve,64,.32,6,false);
      }
      const active=state.focus<0||state.focus===i;p.tube.material.uniforms.time.value=time;p.tube.material.uniforms.emphasis.value=active?1:.1;p.halo.material.opacity=active?.065:.01;
      p.particles.forEach((m,k)=>{
        m.visible=active;const f=(time*(mode==='signals'?.32:.16)+k/p.particles.length)%1;
        m.position.copy(p.curve.getPoint(f));const tangent=p.curve.getTangent(f);
        if(mode==='pollen'){m.position.add(new T.Vector3(Math.sin(k*8+time)*.32,Math.cos(k*5+time)*.32,Math.sin(k*3)*.3));m.rotation.set(time+k,k*.5,time*.7);m.scale.setScalar(.65+(k%4)*.2);}
        else if(mode==='signals'){m.quaternion.setFromUnitVectors(identity,tangent);m.scale.x=k%3===0?1.4:.65;}
      });
      p.arrows.forEach((m,k)=>{m.visible=active;const f=.18+k*.30;m.position.copy(p.curve.getPoint(f));m.quaternion.setFromUnitVectors(axis,p.curve.getTangent(f));});
    });
    const W=stage.size.x,H=stage.size.y,band=app.fitBand(),left=W/2+band.cx-band.w/2,right=left+band.w,top=H/2+band.cy-band.h/2;
    svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
    const candidates=[];
    nodes.forEach(n=>{
      n.position.copy(anchor(n.id));const pulse=(time*.5+n.index*.17)%1,active=visibleNodes.has(n.id);
      const radius=n.id==='power-core'?3:n.id==='neural-processor'?2.4:n.id.startsWith('leg')?2.1:1.9;
      for(const m of [n.ring,n.ripple]){m.position.copy(n.position);m.quaternion.copy(stage.camera.quaternion);m.visible=active;}
      n.ring.scale.setScalar(radius);n.ripple.scale.setScalar(radius*(1+pulse*.7));n.ripple.material.opacity=(1-pulse)*.45;
      n.sprite.position.copy(n.position);n.sprite.scale.setScalar(radius*2.3);n.sprite.visible=active;
      const p=n.position.clone().project(stage.camera),x=(p.x+1)*W/2,y=(1-p.y)*H/2;
      n.label.style.display='none';if(active&&Math.abs(p.z)<1&&y>top-30&&y<top+band.h+30)candidates.push({n,x,y});
    });
    // Label gutters keep the animated machinery clear; mobile shows the focused route or three landmarks.
    const shown=W<760&&state.focus<0?candidates.filter((_,i)=>i<3):candidates;
    const sideGroups=[shown.filter(p=>p.x<(left+right)/2),shown.filter(p=>p.x>=(left+right)/2)];
    sideGroups.forEach((items,side)=>{
      items.sort((a,b)=>a.y-b.y);items.forEach(({n,x,y},i)=>{
        const width=W<760?116:156,height=W<760?26:34;
        const bx=side?right-width-5:left+5,by=top+25+i*(W<760?36:46);
        n.label.style.display='';n.rect.setAttribute('x',bx);n.rect.setAttribute('y',by);n.rect.setAttribute('width',width);n.rect.setAttribute('height',height);
        n.text.setAttribute('x',bx+8);n.text.setAttribute('y',by+height/2+3);n.text.setAttribute('font-size',W<760?'7.5':'9');
        n.dot.setAttribute('cx',x);n.dot.setAttribute('cy',y);n.line.setAttribute('d',`M ${x} ${y} L ${side?bx:bx+width} ${by+height/2}`);
      });
    });
  }
  return {group,state,paths,nodes,activate,update,setFocus,setContext,config:SYSTEMS};
}
