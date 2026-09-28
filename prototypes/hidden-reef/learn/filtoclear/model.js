import * as THREE from './vendor/three.module.js';
import {PARTS,explosionOffset} from './data.js';

const TAU=Math.PI*2;
const v=(x,y,z)=>new THREE.Vector3(x,y,z);
function noiseTexture(foam=false){
 const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d');
 let s=73;const rnd=()=>((s=(Math.imul(1664525,s)+1013904223)>>>0)/4294967296);
 x.fillStyle=foam?'#989898':'#9b9b9b';x.fillRect(0,0,512,512);
 for(let i=0;i<(foam?15500:24000);i++){const r=foam?(.6+rnd()*2.5):(.3+rnd()*.6);const gray=foam?30+Math.floor(rnd()*80):100+Math.floor(rnd()*100);x.fillStyle=`rgb(${gray},${gray},${gray})`;x.beginPath();x.ellipse(rnd()*512,rnd()*512,r,r*(.5+rnd()),rnd()*TAU,0,TAU);x.fill();}
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(foam?2:4,foam?2:4);t.anisotropy=4;return t;
}
function roundBox(w,h,d,r=.05){
 const s=new THREE.Shape(),a=-w/2,b=-h/2;r=Math.min(r,w/3,h/3);
 s.moveTo(a+r,b);s.lineTo(a+w-r,b);s.quadraticCurveTo(a+w,b,a+w,b+r);s.lineTo(a+w,b+h-r);s.quadraticCurveTo(a+w,b+h,a+w-r,b+h);s.lineTo(a+r,b+h);s.quadraticCurveTo(a,b+h,a,b+h-r);s.lineTo(a,b+r);s.quadraticCurveTo(a,b,a+r,b);
 const g=new THREE.ExtrudeGeometry(s,{depth:d,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.015,bevelThickness:.015,curveSegments:8});g.translate(0,0,-d/2);return g;
}
function ringShape(radius,inner,height,lobed=false,holes=false){
 const s=new THREE.Shape();for(let i=0;i<=128;i++){const a=i/128*TAU,r=radius*(lobed?1+.027*Math.cos(a*8):1),x=Math.cos(a)*r,z=Math.sin(a)*r;i?s.lineTo(x,z):s.moveTo(x,z);}
 const hole=new THREE.Path();hole.absarc(0,0,inner,0,TAU,true);s.holes.push(hole);
 if(holes)for(let j=0;j<8;j++){const a=j/8*TAU,h=new THREE.Path();h.absarc(Math.cos(a)*radius*.76,Math.sin(a)*radius*.76,.023,0,TAU,true);s.holes.push(h);}
 const g=new THREE.ExtrudeGeometry(s,{depth:height,bevelEnabled:false,curveSegments:12});g.rotateX(-Math.PI/2);g.translate(0,-height/2,0);return g;
}
export function buildFilter({textures=true}={}){
 const root=new THREE.Group(),parts=new Map(),pickables=[],fronts=[],foam=[],plates=[];
 const tex=textures?noiseTexture():null,porous=textures?noiseTexture(true):null;
 const mat=(color,roughness=.45,metalness=.0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
 const plastic=new THREE.MeshPhysicalMaterial({color:0x26343a,roughness:.42,metalness:.04,clearcoat:.24,clearcoatRoughness:.3,bumpMap:tex,bumpScale:.007});
 const dark=mat(0x111d24,.45),blue=mat(0x187aaf,.33),steel=mat(0x89989b,.28,.82),rubber=mat(0x244956,.85),blackRubber=mat(0x142226,.95),foamBlue=mat(0x197fc6,.97),foamRed=mat(0xae435c,.98),foamPurple=mat(0x7954a8,.98);
 for(const m of [foamBlue,foamRed,foamPurple]){m.map=porous;m.bumpMap=porous;m.bumpScale=.035;}
 const glass=new THREE.MeshPhysicalMaterial({color:0xc1e6e9,roughness:.08,metalness:.05,transparent:true,opacity:.29,side:THREE.DoubleSide,depthWrite:false});
 const clearPlastic=new THREE.MeshPhysicalMaterial({color:0xa8bcc0,roughness:.19,transparent:true,opacity:.72,metalness:.06,depthWrite:false});
 const lampMat=mat(0xcedbe3,.18,.12),gold=mat(0xc6aa73,.36,.65);
 function part(id,position,offset,delay=0){const data=PARTS.find(p=>p.id===id);if(!data)throw Error(id);const g=new THREE.Group();g.name=id;g.position.set(...position);root.add(g);const p={...data,object:g,base:v(...position),offset,delay,meshes:[]};parts.set(id,p);return p;}
 function mesh(p,g,m,pos=[0,0,0],rotation){const o=new THREE.Mesh(g,m.clone());o.position.set(...pos);if(rotation)o.rotation.set(...rotation);o.castShadow=!o.material.transparent;o.receiveShadow=true;o.userData.part=p.id;o.userData.baseMaterial={color:o.material.color.clone(),opacity:o.material.opacity,transparent:o.material.transparent,depthWrite:o.material.depthWrite};p.object.add(o);p.meshes.push(o);pickables.push(o);return o;}
 const torus=(p,r,t,m,pos=[0,0,0])=>mesh(p,new THREE.TorusGeometry(r,t,8,72),m,pos,[-Math.PI/2,0,0]);
 const cyl=(p,r,h,m,pos=[0,0,0],r2=r)=>mesh(p,new THREE.CylinderGeometry(r,r2,h,64),m,pos);
 const rod=(p,a,b,r,m)=>{const aa=v(...a),bb=v(...b),o=mesh(p,new THREE.CylinderGeometry(r,r,aa.distanceTo(bb),12),m);o.position.copy(aa).add(bb).multiplyScalar(.5);o.quaternion.setFromUnitVectors(v(0,1,0),bb.sub(aa).normalize());return o;};
 function hollow(p,r,h,m,pos=[0,0,0],thick=.035,cut=false){const profile=[[r,-h/2],[r,h/2],[r-thick,h/2],[r-thick,-h/2],[r,-h/2]].map(a=>new THREE.Vector2(...a));if(cut){mesh(p,new THREE.LatheGeometry(profile,64,Math.PI/3,Math.PI*4/3),m,pos);fronts.push(mesh(p,new THREE.LatheGeometry(profile,32,-Math.PI/3,Math.PI*2/3),m,pos));}else mesh(p,new THREE.LatheGeometry(profile,64),m,pos);}
 function disc(p,r=.72){torus(p,r,.018,dark);torus(p,.29,.021,dark);for(let i=0;i<24;i++){const a=i/24*TAU;rod(p,[Math.cos(a)*.30,0,Math.sin(a)*.30],[Math.cos(a)*r,0,Math.sin(a)*r],.013,dark);}torus(p,r*.72,.012,dark);}
 const vessel=part('vessel',[0,0,0],[-2.55,0,0]);
 const profile=[[0,.01],[.68,.01],[.72,.07],[.75,.17],[.85,2.20],[.90,2.30],[.9,2.40],[.83,2.40],[.80,2.27],[.70,.20],[0,.20]].map(a=>new THREE.Vector2(...a));
 mesh(vessel,new THREE.LatheGeometry(profile,96,Math.PI/3,Math.PI*4/3),plastic);fronts.push(mesh(vessel,new THREE.LatheGeometry(profile,48,-Math.PI/3,Math.PI*2/3),plastic));
 torus(vessel,.873,.023,dark,[0,2.22,0]);torus(vessel,.722,.019,dark,[0,.13,0]);
 for(let i=0;i<48;i++){const a=i/48*TAU;const rib=rod(vessel,[Math.sin(a)*.856,2.18,Math.cos(a)*.856],[Math.sin(a)*.862,2.27,Math.cos(a)*.862],.012,dark);if(Math.cos(a)>.5)fronts.push(rib);}
 const seal=part('seal',[0,2.39,0],[-2.55,1.45,0],.1);torus(seal,.852,.025,blue);
 const clamp=part('clamp',[0,2.42,0],[-2.55,2.1,0],.04);hollow(clamp,.917,.085,steel);mesh(clamp,roundBox(.18,.11,.12,.02),dark,[.86,0,.24]);rod(clamp,[.88,.0,.32],[.92,.01,.12],.02,steel);
 const lid=part('lid',[0,2.43,0],[0,3.10,0],.05);
 const dome=[[0,.25],[.24,.27],[.65,.17],[.83,.12],[.90,.025],[.90,-.02],[.77,-.02],[.72,.025],[0,.04]].map(a=>new THREE.Vector2(...a));mesh(lid,new THREE.LatheGeometry(dome,96),plastic);
 mesh(lid,roundBox(.68,.22,1.08,.09),plastic,[-.15,.24,-.04]);cyl(lid,.185,.19,plastic,[.43,.22,-.06]);
 for(let i=0;i<12;i++){const a=i/12*TAU;cyl(lid,.022,.018,steel,[Math.cos(a)*.80,.105,Math.sin(a)*.80]);}
 const ringRows=[['foam-purple',.46,foamPurple,.18],['foam-blue',.96,foamBlue,.22],['foam-red',1.46,foamRed,.26],['foam-top',1.96,foamBlue,.30]];
 for(const [id,y,m,delay] of ringRows){const p=part(id,[0,y,0],[0,.5+(y-.46)*.93,0],delay);mesh(p,ringShape(.70,.293,.42,true,true),m);foam.push(p);}
 [['spacer-purple',.71],['spacer-blue',1.21],['spacer-red',1.71],['spacer-top',2.21]].forEach(([id,y])=>{const p=part(id,[0,y,0],[0,.50+(y-.46)*.93,0],.23);disc(p);plates.push(p);for(let i=0;i<2;i++){const a=i*Math.PI+.3;rod(p,[.66*Math.cos(a),0,.66*Math.sin(a)],[.66*Math.cos(a),.31,.66*Math.sin(a)],.013,dark);}});
 const base=part('base-plate',[0,.215,0],[0,.19,0],.12);mesh(base,ringShape(.72,.286,.048),dark);torus(base,.60,.019,plastic);disc(base);
 const lip=part('lip-seal',[0,.186,0],[-1.4,.4,1.25],.28);torus(lip,.704,.026,blackRubber);
 const meshTube=part('mesh',[0,1.24,0],[1.6,1.0,-1.65],.14);
 for(let i=0;i<24;i++)torus(meshTube,.283,.010,dark,[0,-1.035+i*.09,0]);
 for(let i=0;i<24;i++){const a=i/24*TAU;rod(meshTube,[.281*Math.cos(a),-1.04,.281*Math.sin(a)],[.281*Math.cos(a),1.05,.281*Math.sin(a)],.009,dark);}
 const handle=part('handle',[0,0,-.39],[-1.8,3.1,-1.2],.08);
 rod(handle,[-.56,.23,0],[-.56,2.80,0],.025,steel);rod(handle,[.56,.23,0],[.56,2.80,0],.025,steel);
 const gripCurve=new THREE.CatmullRomCurve3([v(-.56,2.78,0),v(-.55,3.03,0),v(-.42,3.08,0),v(.42,3.08,0),v(.55,3.03,0),v(.56,2.78,0)]);
 mesh(handle,new THREE.TubeGeometry(gripCurve,40,.048,12,false),blue);
 for(let i=0;i<12;i++)mesh(handle,new THREE.BoxGeometry(.008,.016,.084),dark,[-.20+i*.036,3.097,0]);
 const head=part('uv-head',[-.14,2.89,.06],[2.48,3.10,.05],.1);mesh(head,roundBox(.57,.30,1.00,.12),plastic);mesh(head,roundBox(.19,.075,.025,.015),blue,[0,-.065,.51]);
 for(let i=0;i<10;i++)mesh(head,roundBox(.012,.022,.65,.005),dark,[-.20+i*.044,.161,0]);
 mesh(head,roundBox(.23,.021,.13,.005),dark,[0,.163,-.25]);
 const lamp=part('lamp',[0,1.5,0],[4.1,3.1,.15],.18);
 rod(lamp,[-.055,-.75,0],[-.055,.75,0],.032,lampMat);rod(lamp,[.055,-.75,0],[.055,.75,0],.032,lampMat);rod(lamp,[-.055,-.75,0],[.055,-.75,0],.032,lampMat);mesh(lamp,roundBox(.20,.13,.10,.02),dark,[0,.80,0]);for(let i=0;i<4;i++)rod(lamp,[-.05+i*.032,.865,0],[-.05+i*.032,.915,0],.007,gold);
 const quartz=part('quartz',[0,1.5,0],[3.18,.73,.72],.19);hollow(quartz,.141,1.76,glass);cyl(quartz,.136,.026,glass,[0,-.89,0]);torus(quartz,.152,.015,steel,[0,.88,0]);
 const qseal=part('quartz-seal',[0,2.425,0],[3.2,2.15,.72],.21);torus(qseal,.149,.014,rubber);
 const lock=part('uv-lock',[0,2.61,0],[3.2,2.45,.72],.15);hollow(lock,.212,.10,dark);for(let i=0;i<18;i++){let a=i/18*TAU;mesh(lock,new THREE.BoxGeometry(.022,.085,.028),plastic,[.21*Math.sin(a),0,.21*Math.cos(a)]);}
 const rotor=part('rotor',[0,1.5,0],[4.65,.1,0],.20);torus(rotor,.184,.022,blue,[0,-.86,0]);torus(rotor,.184,.021,blue,[0,.86,0]);
 const points=[];for(let i=0;i<=240;i++){const a=i/240*TAU*5;points.push(v(Math.cos(a)*.18,-.83+i/240*1.66,Math.sin(a)*.18));}
 mesh(rotor,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),220,.018,6,false),blue);rod(rotor,[.18,-.86,0],[.18,.86,0],.017,blue);rod(rotor,[-.18,-.86,0],[-.18,.86,0],.017,blue);
 const casing=part('uv-casing',[0,1.37,0],[2.05,-.04,1.0],.25);hollow(casing,.242,2.10,plastic,[0,0,0],.027,true);torus(casing,.25,.018,plastic,[0,1.05,0]);
 const end=part('uv-cap',[0,.295,0],[2.05,-.10,1.0],.27);cyl(end,.25,.08,dark);cyl(end,.09,.12,plastic,[0,.085,0]);
 const valve=part('valve',[.43,2.80,-.06],[-1.3,2.70,1.65],.13);cyl(valve,.16,.20,blue);mesh(valve,roundBox(.055,.21,.26,.025),blue,[0,.14,0]);
 const ports=[['inlet',[-.58,2.54,.48],[-.60,0,.8],[-2.30,2.10,1.55],plastic],['outlet',[.39,2.54,.65],[.18,0,.98],[1.0,2.75,2.15],clearPlastic],['waste',[.82,2.54,.08],[1,0,.05],[2.25,2.60,1.65],clearPlastic]];
 const portsData={};
 for(const [id,at,dir,offset,material] of ports){const p=part(id,at,offset,.13);const d=v(...dir).normalize(),q=new THREE.Quaternion().setFromUnitVectors(v(0,1,0),d);hollow(p,.117,.40,material,[0,0,0],.025);p.meshes.forEach(m=>m.quaternion.copy(q));
  for(let j=0;j<7;j++){const o=torus(p,.124-j*.001,.009,material);o.quaternion.setFromUnitVectors(v(0,0,1),d);o.position.copy(d).multiplyScalar(-.15+j*.050);}
  const n=part(id+'-nut',v(...at).addScaledVector(d,-.17).toArray(),offset.map((val,j)=>val+(j===0?-.18:j===2?.25:0)),.11);hollow(n,.158,.12,dark);n.meshes.forEach(m=>m.quaternion.copy(q));for(let j=0;j<24;j++){const a=j/24*TAU,o=mesh(n,new THREE.BoxGeometry(.018,.018,.10),plastic);o.position.set(Math.cos(a)*.157,Math.sin(a)*.157,0);o.rotation.z=a;o.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(v(0,0,1),d));}
  portsData[id]={at:v(...at),dir:d};
 }
 const cap=part('waste-cap',[1.115,2.54,.095],[3.1,2.6,1.65],.10);cyl(cap,.13,.08,dark);cap.meshes.forEach(m=>m.rotation.z=-Math.PI/2);for(let j=0;j<20;j++){const a=j/20*TAU;rod(cap,[-.04,.133*Math.sin(a),.133*Math.cos(a)],[.04,.133*Math.sin(a),.133*Math.cos(a)],.007,plastic);}
 const alignment=new THREE.Group();root.add(alignment);
 for(const id of ['lid','mesh','foam-top','uv-head','quartz']){const p=parts.get(id),g=new THREE.BufferGeometry().setFromPoints([p.base,p.base.clone()]),line=new THREE.Line(g,new THREE.LineDashedMaterial({color:0x92b7b0,transparent:true,opacity:.16,dashSize:.04,gapSize:.07}));alignment.add(line);p.guide=line;}
 function pose(amount,cut=false,clean=0,time=0,animateRotor=false){
  for(const p of parts.values()){p.object.position.copy(p.base).add(v(...explosionOffset(p.offset,amount,p.delay)));p.object.rotation.set(0,0,0);}
  fronts.forEach(m=>m.visible=!cut);
  if(clean>0){parts.get('handle').object.position.y+=clean*.39;parts.get('base-plate').object.position.y+=clean*.39;parts.get('lip-seal').object.position.y+=clean*.39;
   foam.forEach(p=>{p.object.scale.y=1-clean*.19;p.object.position.y+=(2.18-p.base.y)*clean*.19;});plates.forEach(p=>p.object.position.y+=(2.18-p.base.y)*clean*.19);
  }else foam.forEach(p=>p.object.scale.y=1);
  if(animateRotor)rotor.object.rotation.y=time*.9;
  alignment.visible=amount>.1;
  for(const p of parts.values())if(p.guide){const a=p.guide.geometry.attributes.position;a.setXYZ(0,...p.base.toArray());a.setXYZ(1,...p.object.position.toArray());a.needsUpdate=true;p.guide.computeLineDistances();}
 }
 pose(0);
 return {root,parts,pickables,fronts,pose,ports:portsData,foam,plates,alignment};
}
