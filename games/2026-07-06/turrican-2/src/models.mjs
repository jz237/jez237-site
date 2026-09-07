import * as THREE from 'three';
import {shellGeometry,armorFinish,tube,pack} from './artisan.mjs';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';

const geometries=new Map(),materials=new Map();
export const mat=(color,metalness=.65,roughness=.32,emissive=0)=>{
  const key=[color,metalness,roughness,emissive].join('/');
  if(!materials.has(key))materials.set(key,new THREE.MeshStandardMaterial({color,metalness,roughness,map:emissive?null:armorFinish(),bumpMap:emissive?null:armorFinish(),bumpScale:.06,emissive:emissive?color:0,emissiveIntensity:emissive}));
  return materials.get(key);
};
export const metal=mat('#8faaa8',.68,.42),dark=mat('#101c2a'),silver=mat('#8dabc4',.85,.25),cyan=mat('#54efff',.4,.22,2.5),amber=mat('#ffb452',.5,.3,1.8),red=mat('#ff4f60',.4,.25,2);
function geo(key,fn){if(!geometries.has(key))geometries.set(key,fn());return geometries.get(key);}
function plateGeometry(size){
  const [w,h,d]=size,s=new THREE.Shape(),points=[[-.34,.5],[.25,.5],[.48,.27],[.43,-.22],[.20,-.5],[-.22,-.43],[-.48,-.12],[-.46,.27]];
  s.moveTo(points[0][0]*w,points[0][1]*h);points.slice(1).forEach(([x,y])=>s.lineTo(x*w,y*h));s.closePath();
  const g=new THREE.ExtrudeGeometry(s,{depth:d*.75,bevelEnabled:true,bevelSize:Math.min(w,h,d)*.1,bevelThickness:d*.12,bevelSegments:3,steps:1});g.translate(0,0,-d*.375);g.computeVertexNormals();return g;
}
export function part(parent,kind,size,material,pos=[0,0,0],rotation=[0,0,0]){
  const key=kind+size.join(',');const g=geo(key,()=>kind==='shell'?shellGeometry(...size):kind==='plate'?plateGeometry(size):kind==='box'?new RoundedBoxGeometry(...size,2,Math.min(...size)*.18):kind==='sphere'?new THREE.SphereGeometry(1,16,10):kind==='ico'?new THREE.IcosahedronGeometry(1,1):kind==='torus'?new THREE.TorusGeometry(size[0],size[1],8,32):kind==='cone'?new THREE.ConeGeometry(size[0],size[1],size[2]||8):new THREE.CylinderGeometry(size[0],size[1],size[2],12));
  const m=new THREE.Mesh(g,material);if(kind==='sphere'||kind==='ico')m.scale.set(...size);
  m.position.set(...pos);m.rotation.set(...rotation);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;
}
function joint(parent,pos){const g=new THREE.Group();g.position.set(...pos);parent.add(g);return g;}
function limb(root,pos,length,width,armor){
  const pivot=joint(root,pos);part(pivot,'sphere',[width*.58,width*.58,width*.58],dark);
  part(pivot,'shell',[width,length*.87,width*.9],armor,[0,-length*.43,0]);
  part(pivot,'box',[width*.5,length*.38,.5],silver,[0,-length*.4,width*.48]);
  const end=joint(pivot,[0,-length,0]);return {pivot,end};
}
export function soldier(){
  const root=new THREE.Group(),body=joint(root,[0,20.5,0]);
  part(body,'shell',[10.5,13,7.2],metal,[0,4,0],[0,0,-.06]);
  part(body,'plate',[7,7,1.8],silver,[.5,5,3.6],[0,0,-.1]);
  part(body,'plate',[4,7,1.1],metal,[-3.3,4.5,4.2],[0,0,.18]);
  for(let k=0;k<3;k++)part(body,'box',[2.6,.45,.7],dark,[-3.5,5-k*1.2,5]);
  part(body,'box',[1.1,4,1],cyan,[2,5,4.4]);
  part(body,'box',[5.8,8,4],dark,[-6,4,-.5]);
  for(const z of [-1.5,1.5]){part(body,'cylinder',[1.15,1.5,5],silver,[-7,1,z]);part(body,'sphere',[.8,.8,.8],cyan,[-7,-2,z]);}
  part(body,'box',[8,3.5,5.5],dark,[0,-3.5,0]);
  const head=joint(body,[.2,13,0]);
  part(head,'shell',[8.6,9.6,7.2],metal,[0,0,0],[0,.12,-.12]);
  part(head,'plate',[5,3,5.8],dark,[1.5,-2.7,.2],[0,0,.16]);
  part(head,'box',[4.8,2.3,5.9],dark,[2.1,.3,.1],[0,0,-.08]);
  part(head,'box',[1.5,1.65,5.4],cyan,[4.35,.65,.1],[0,0,-.1]);
  part(head,'box',[1.2,5.5,1.5],silver,[-1.5,2,3.3],[0,0,.2]);
  part(head,'sphere',[1.6,1.6,1],dark,[-2,-.2,3.4]);
  const legs=[];
  for(const z of [-2.6,2.6]){
    const hip=limb(body,[z<0?-1.5:1,-5,z],7.2,3.9,z<0?dark:metal);
    const knee=limb(hip.end,[0,0,0],7,3.2,metal);
    part(knee.end,'box',[6,2.3,4.3],dark,[1,-.25,0]);
    part(knee.pivot,'box',[3.2,3,1.2],silver,[.6,-1,2]);
    legs.push({hip:hip.pivot,knee:knee.pivot});
  }
  const arm=joint(body,[2,8,4.3]);
  part(arm,'shell',[7,6,6],metal,[0,.5,0],[0,0,-.2]);
  part(arm,'plate',[4.8,3,1],silver,[0,2.2,3.1],[0,0,-.2]);
  part(arm,'box',[7,3.6,3.7],metal,[3,-1,0],[0,0,-.16]);
  part(arm,'sphere',[2,2,2],dark,[6,-1.5,0]);
  part(arm,'box',[5,3.1,3.3],silver,[8,-1,0],[0,0,.12]);
  const gun=joint(arm,[11,-.5,0]);
  part(gun,'box',[12,4.5,4.2],dark,[3,0,0]);
  part(gun,'box',[9,2.8,3],silver,[7,.1,0]);
  part(gun,'box',[6,.65,4.3],cyan,[4,.7,0]);
  part(gun,'cylinder',[1.3,1.6,4.5],metal,[12,0,0],[0,0,Math.PI/2]);
  const muzzle=part(gun,'sphere',[2.5,1.3,1.3],amber,[14.5,0,0]);muzzle.visible=false;
  const backArm=limb(body,[1,7,-4],7,3,dark);backArm.pivot.rotation.z=.9;
  const ball=joint(root,[0,9,0]);
  part(ball,'sphere',[8.5,8.5,8.5],dark);
  const rings=[];
  for(let i=0;i<3;i++){const ring=part(ball,'torus',[8.8,.75],cyan,[0,0,0],[Math.PI*i/3,Math.PI*i/3,0]);rings.push(ring);}
  const shell=joint(ball,[0,0,0]);
  for(let i=0;i<8;i++){let a=i*Math.PI/4;part(shell,'box',[5.7,3.1,8.5],metal,[Math.cos(a)*7,Math.sin(a)*7,0],[0,0,a+Math.PI/2]);}
  ball.visible=false;
  // Layered rib armour, utility harness, cabling and fasteners follow the skeleton.
  const suit=new THREE.Group();body.add(suit);
  for(let side of [-1,1]){
    for(let k=0;k<4;k++)part(suit,'plate',[3.7,1.5,1.1],k%2?metal:silver,[side*2.4,1.3-k*1.25,3.4],[0,side*.16,side*.1]);
    part(suit,'box',[1.1,8,.8],dark,[side*3.3,6,3.8],[0,0,side*.13]);
    for(let k=0;k<3;k++)part(suit,'sphere',[.28,.28,.2],silver,[side*4.1,3.5+k*2.1,3.9]);
    part(suit,'box',[2,2.2,2.2],metal,[side*4.3,-3.7,1.4]);
  }
  suit.add(tube([[-5,7,2],[-7,6,3],[-6,0,3],[-3,-2,3]],.45,dark));pack(suit);
  const helmetDetail=new THREE.Group();head.add(helmetDetail);
  part(helmetDetail,'shell',[7.8,2.5,7.4],silver,[0,3.2,0]);
  part(helmetDetail,'plate',[3.2,2,1.1],amber,[-.8,1.6,3.8]);
  for(let k=0;k<3;k++)part(helmetDetail,'box',[1.8,.28,.4],silver,[2,-1.4-k*.7,3.4]);
  part(helmetDetail,'cylinder',[.45,.6,5],dark,[-3.4,4,1]);pack(helmetDetail);
  const weaponDetail=new THREE.Group();gun.add(weaponDetail);
  for(let k=0;k<5;k++)part(weaponDetail,'box',[.45,4.8,4.6],metal,[k*1.5,0,0]);
  part(weaponDetail,'box',[5,.8,1.4],dark,[4,3.1,0]);
  part(weaponDetail,'sphere',[.65,.65,.65],cyan,[7,3.1,0]);
  part(weaponDetail,'cylinder',[1.05,1.2,2],dark,[14,0,0],[0,0,Math.PI/2]);pack(weaponDetail);
  for(const leg of legs){const hardware=new THREE.Group();leg.knee.add(hardware);
    part(hardware,'shell',[3.3,5,3.4],silver,[0,-3,.3]);
    part(hardware,'box',[.65,3,.4],amber,[.9,-3,2]);
    for(let side of [-1,1])part(hardware,'cylinder',[.35,.45,4.6],silver,[side*1.7,-3,0]);pack(hardware);
  }
  // Fine hardware is attached to the existing articulated joints.
  const detail=new THREE.Group();body.add(detail);
  const ceramic=mat('#bbc1b4',.45,.48),seals=mat('#303b3b',.15,.8);
  for(let side of [-1,1]){
    for(let k=0;k<6;k++)part(detail,'box',[.7,.3,.35],ceramic,[side*3.6,2+k*1.1,4.7]);
    detail.add(tube([[side*4,-2,3.8],[side*5,0,4],[side*4.8,5,4]],.23,silver));
    for(let k=0;k<4;k++)part(detail,'box',[.8,.35,.2],seals,[side*2,7+k*.7,4.9]);
  }
  part(detail,'plate',[3.2,2.1,.4],ceramic,[0,7.4,4.9]);
  part(detail,'box',[1.7,.27,.2],dark,[0,7.5,5.2]);
  for(let k=0;k<3;k++)part(detail,'box',[.28,.9,.25],silver,[-.6+k*.6,-3.5,3.1]);
  pack(detail);
  const face=new THREE.Group();head.add(face);
  part(face,'torus',[1.35,.25],silver,[-2,-.2,4.35]);
  part(face,'sphere',[.6,.6,.2],dark,[-2,-.2,4.5]);
  for(let k=0;k<5;k++)part(face,'box',[.3,1.1,.3],dark,[-2.3+k*.8,3.5,3.8]);
  for(let side of [-1,1])part(face,'sphere',[.28,.28,.2],silver,[side*2.7,-2.3,3.7]);
  face.add(tube([[-2,-1.7,4],[-1,-3,4],[1.8,-3.1,3.7]],.21,seals));pack(face);
  for(const leg of legs){
    const d=new THREE.Group();leg.hip.add(d);
    for(let k=0;k<4;k++)part(d,'plate',[2.8,.8,.45],ceramic,[0,-2-k*.85,2]);
    part(d,'torus',[1.05,.22],silver,[0,0,2.2]);pack(d);
    const shin=new THREE.Group();leg.knee.add(shin);
    for(let k=0;k<5;k++)part(shin,'box',[1.8,.22,.3],dark,[0,-2-k*.7,2.2]);
    for(let side of [-1,1])part(shin,'sphere',[.25,.25,.2],silver,[side*.9,-1,2.3]);pack(shin);
  }
  const rail=new THREE.Group();gun.add(rail);
  for(let k=0;k<9;k++)part(rail,'box',[.35,.5,2.2],silver,[-1+k*1.1,2.7,0]);
  for(let k=0;k<4;k++)part(rail,'box',[.8,.6,.2],dark,[5+k*1.2,.2,1.6]);
  part(rail,'plate',[3.7,2,.4],ceramic,[0,0,2.4]);
  for(let k=0;k<3;k++)part(rail,'sphere',[.18,.18,.12],silver,[-1+k,0,2.7]);pack(rail);
  muzzle.userData.dynamic=true;pack(body);pack(head);pack(arm);pack(gun);for(const l of legs){pack(l.hip);pack(l.knee);}
  let morph=0,phase=0,wasGround=false,landing=0,previousVy=0;
  return {root,body,legs,arm,gun,ball,head,animate(p,dt,t){
    if(p.onGround&&!wasGround)landing=Math.min(1,Math.abs(previousVy)/400);wasGround=p.onGround;previousVy=p.vy||0;landing=THREE.MathUtils.damp(landing,0,11,dt);
    phase+=dt*Math.min(15,Math.abs(p.vx)*.055);
    morph=THREE.MathUtils.damp(morph,p.morph?1:0,22,dt||.016);
    body.visible=morph<.98;ball.visible=morph>.02;
    body.scale.setScalar(Math.max(.02,1-morph));body.position.y=20.5-13.5*morph;
    ball.scale.setScalar(Math.max(.02,morph));shell.rotation.z-=p.vx*dt*.1;
    rings.forEach((r,i)=>{r.rotation.y=t*(i+1)*.8;r.rotation.x=t*.9+i;});
    const size=1.22-.22*morph;root.scale.set(p.facing*size,size,size);root.rotation.y=-.22*p.facing;
    const run=p.onGround&&Math.abs(p.vx)>20;
    body.position.y-=landing*2.1;
    body.position.y+=(run?Math.abs(Math.sin(phase*2))*.65:Math.sin(t*2)*.15)-(p.crouch?6:0);
    body.rotation.z=p.inWater?-.45:p.crouch?-.16:run?-.05:0;
    legs.forEach((l,i)=>{const f=i?1:-1;
      const hipTarget=p.crouch?-1:!p.onGround?(i?.65:-.9):run?Math.sin(phase)*.85*f:0;
      l.hip.rotation.z=THREE.MathUtils.damp(l.hip.rotation.z,hipTarget,24,dt||.016);
      const kneeTarget=p.crouch?1.5:!p.onGround?1.1:run?Math.max(0,-Math.sin(phase)*f)*1.15:.08;
      l.knee.rotation.z=THREE.MathUtils.damp(l.knee.rotation.z,kneeTarget,24,dt||.016);
    });
    backArm.pivot.rotation.z=THREE.MathUtils.damp(backArm.pivot.rotation.z,run?.7+Math.sin(phase)*.24:.9,16,dt||.016);
    const aim=p.beamActive?-p.beamAngle:p.aimDir===-1?Math.PI/2:0;
    arm.rotation.z=THREE.MathUtils.damp(arm.rotation.z,aim,18,dt||.016);
    head.rotation.z=aim*.22;
    gun.position.x=11-Math.max(0,p.cooldown||0)*9;
    muzzle.visible=!p.morph&&p.weapon!=='beam'&&(p.cooldown||0)>.075;
    const muzzlePulse=.75+Math.sin(t*70)*.25;muzzle.scale.set(2.5*muzzlePulse,1.3*muzzlePulse,1.3*muzzlePulse);
  }};
}

export function ship(friendly=true){
  const root=new THREE.Group(),armor=friendly?metal:mat('#6d344f');
  part(root,'shell',[11,31,12],armor,[0,0,0],[0,0,-Math.PI/2]);
  part(root,'cone',[5,17,4],silver,[10,0,0],[0,0,-Math.PI/2]);
  part(root,'sphere',[6,2.4,4],friendly?cyan:red,[3,3,1]);
  const wings=[];
  for(const side of [-1,1]){
    wings.push(part(root,'box',[16,1.7,9],armor,[-4,0,side*7],[side*.1,side*.3,0]));
    part(root,'cylinder',[2.1,2.7,8],dark,[-9,0,side*7],[0,0,Math.PI/2]);
    part(root,'sphere',[2.2,1.8,1.8],amber,[-14,0,side*7]);
  }
  const detailing=new THREE.Group();root.add(detailing);
  for(let side of [-1,1]){
    part(detailing,'plate',[22,2.5,13],armor,[-4,0,side*7],[side*.1,side*.35,0]);
    for(let k=0;k<4;k++)part(detailing,'box',[.6,2.8,4],silver,[-9+k*1.8,1,side*7]);
    part(detailing,'plate',[7,9,1],dark,[-9,4,side*8],[0,side*.2,-.2]);
    part(detailing,'cylinder',[.8,1,15],silver,[5,-1,side*9],[0,0,Math.PI/2]);
  }pack(detailing);
  return {root,animate(p,dt,t){root.rotation.x=THREE.MathUtils.damp(root.rotation.x,-p.vy*.0018,7,dt||.016);root.rotation.z=THREE.MathUtils.damp(root.rotation.z,-p.vy*.0005,7,dt||.016);wings.forEach((a,i)=>a.rotation.x=Math.sin(t*15+i)*.05);}};
}

export function enemy(type,world=1){
  const root=new THREE.Group(),color=world===5?'#815265':world===2?'#336f77':world===4?'#766451':'#776476';
  const armor=mat(color,.6,.38),eye=world===5?mat('#b5ff58',.3,.3,2):red;
  const limbs=[],rotors=[];let head;
  if(['flyer','drifter','spinner'].includes(type)){
    part(root,'shell',[17,11,12],armor,[0,9,0],[0,0,Math.PI/2]);
    head=part(root,'sphere',[2.7,2,1.9],eye,[-5,9,4]);
    for(const a of [-1,1]){
      part(root,'box',[5,3,4],dark,[a*10,9,0]);
      const r=joint(root,[a*11,11,0]);part(r,'torus',[5,.5],silver,[0,0,0],[Math.PI/2,0,0]);
      part(r,'box',[10,.5,1],silver);part(r,'box',[1,.5,10],silver);rotors.push(r);
      part(root,'sphere',[1.5,2,1.5],amber,[a*10,6,0]);
    }
    if(type==='spinner')for(let i=0;i<4;i++){const a=i*Math.PI/2;part(root,'cone',[2.3,8,6],silver,[Math.cos(a)*10,9+Math.sin(a)*10,0],[0,0,a-Math.PI/2]);}
  }else if(type==='turret'){
    part(root,'cylinder',[8,10,5],dark,[0,2.5,0]);
    part(root,'cylinder',[5,7,4],silver,[0,6,0]);head=joint(root,[0,11,0]);
    part(head,'box',[13,8,9],armor);part(head,'sphere',[2.4,1.4,1],eye,[-5,2,4.8]);
    for(const z of [-2.5,2.5])part(head,'cylinder',[1.25,1.8,13],silver,[-10,0,z],[0,0,Math.PI/2]);
  }else if(['spawner','egg'].includes(type)){
    part(root,'sphere',[10,13,8],armor,[0,12,0]);
    part(root,'sphere',[5,7,3],eye,[0,12,6]);
    for(let i=0;i<5;i++){const a=i*Math.PI*2/5;part(root,'cone',[2.5,10,6],silver,[Math.cos(a)*9,12+Math.sin(a)*9,2],[0,0,a-Math.PI/2]);}
    head=root.children[1];
  }else{
    part(root,'shell',[18,11,12],armor,[0,9,0],[0,0,Math.PI/2]);
    for(let i=0;i<3;i++)part(root,'shell',[5,6.5,12],armor,[-5+i*5,11,0],[0,0,.1*(i-1)]);
    head=part(root,'sphere',[4.5,4,4],dark,[-8,8,0]);
    for(const z of [-2.5,2.5])part(root,'sphere',[1.6,1.5,1.2],eye,[-10.5,9,z]);
    for(let i=0;i<6;i++){
      const side=i<3?-1:1,j=i%3;
      const l=joint(root,[-5+j*5,7,side*4]);
      part(l,'cylinder',[.7,1.2,7],silver,[0,-1.8,side*2],[side*.8,0,.3-j*.3]);
      part(l,'cone',[1,7,5],armor,[0,-5.3,side*4],[side*.25,0,Math.PI]);limbs.push(l);
    }
    if(type==='eel'){root.scale.x=1.5;root.scale.y=.6;}
  }
  const trim=new THREE.Group();root.add(trim);
  for(let side of [-1,1]){for(let i=0;i<3;i++)part(trim,'box',[1.5,.5,.7],silver,[-3+i*2.8,12,side*5.7]);
    part(trim,'sphere',[.65,.65,.5],eye,[side*5,10,5.6]);}
  pack(trim);let hit=0;
  return {root,head,limbs,animate(e,dt,t){
    root.scale.x=(e.facing||-1)===1?-1:1;
    if(type==='eel')root.scale.x*=1.5;
    limbs.forEach((l,i)=>{l.rotation.x=Math.sin(t*10+i*2)*.3;l.rotation.z=Math.cos(t*10+i*2)*.25;});
    rotors.forEach(r=>r.rotation.y=t*40);
    if(type==='spinner')root.rotation.z=t*3;
    if(type==='turret')head.rotation.y=Math.sin(t)*.12;
    if(['egg','spawner'].includes(type)){const k=1+Math.sin(t*4)*.06;head.scale.set(5*k,7*k,3*k);}
    hit=THREE.MathUtils.damp(hit,e.hitFlash>0?1:0,20,dt||.016);root.rotation.z=type==='spinner'?root.rotation.z:Math.sin(t*35)*hit*.14;root.rotation.y=-.18;
  }};
}

export function boss(key){
  const root=new THREE.Group(),parts=[],armor=mat(key==='queen'||key==='maw'?'#664254':'#4c596a',.75,.3),glow=key==='queen'?mat('#b2ff61',.4,.3,3):red;
  const flying=key==='gunship',organic=['queen','maw'].includes(key);
  if(organic){
    part(root,'sphere',[.32,.36,.17],armor,[.5,.5,-.06]);
    for(let side of [-1,1])for(let i=0;i<3;i++)part(root,'plate',[.19,.27,.15],armor,[.5+side*(.23-i*.025),.35+i*.19,.13],[0,side*.4,side*(.25+i*.14)]);
  }else{
    part(root,'shell',[.62,.72,.44],armor,[.5,.5,0]);
    part(root,'plate',[.43,.25,.10],silver,[.5,.76,.24]);
  }
  const core=part(root,'sphere',[.12,.16,.06],glow,[.5,.52,.22]);
  for(const side of [-1,1]){
    const shoulder=joint(root,[.5+side*.32,.7,0]);
    part(shoulder,'sphere',[.18,.16,.18],armor);
    if(flying){part(shoulder,'box',[.45,.08,.38],silver,[side*.14,0,0]);}
    else{
      part(shoulder,'box',[.15,.35,.17],armor,[side*.04,-.2,0],[0,0,side*.18]);
      part(shoulder,'cone',[.07,.26,6],silver,[side*.12,-.43,0],[0,0,Math.PI+side*.3]);
    }
    part(shoulder,'cylinder',[.045,.065,.28],dark,[side*.13,-.01,.18],[Math.PI/2,0,0]);parts.push(shoulder);
    if(!flying){
      const leg=joint(root,[.5+side*.18,.28,0]);
      part(leg,'box',[.17,.3,.2],armor,[0,-.12,0]);part(leg,'box',[.23,.08,.3],dark,[side*.03,-.25,.06]);parts.push(leg);
    }
  }
  if(organic){
    for(let i=0;i<10;i++){const a=i*Math.PI/5;part(root,'cone',[.025,.11,5],silver,[.5+Math.cos(a)*.16,.55+Math.sin(a)*.18,.25],[0,0,a-Math.PI/2]);}
    for(let i=0;i<6;i++){const side=i<3?-1:1;const a=joint(root,[.5+side*.22,.3+(i%3)*.16,-.1]);part(a,'cone',[.05,.45,6],armor,[side*.2,0,0],[0,0,side*Math.PI/2]);parts.push(a);}
  }else{
    part(root,'plate',[.32,.23,.25],armor,[.5,.89,0]);
    part(root,'box',[.22,.035,.04],glow,[.5,.91,.14]);
    for(let i=0;i<4;i++)part(root,'box',[.03,.16,.06],silver,[.37+i*.085,.6,.21]);
  }
  // Each guardian has a recognisable silhouette and bespoke weapon assemblies.
  if(key==='warden'){
    part(root,'plate',[.28,.62,.13],silver,[.12,.48,.18],[0,0,-.12]);
    for(let i=0;i<3;i++)part(root,'cylinder',[.035,.045,.32],dark,[.88,.65+i*.075,.04],[0,0,Math.PI/2]);
  }else if(key==='colossus'){
    part(root,'plate',[.37,.26,.25],armor,[.05,.86,0],[0,0,.2]);
    part(root,'plate',[.37,.26,.25],armor,[.95,.86,0],[0,0,-.2]);
    part(root,'box',[.15,.45,.16],silver,[.98,.34,.15],[0,0,-.18]);
    part(root,'plate',[.32,.18,.3],armor,[1.02,.1,.16]);
  }else if(key==='machine'){
    for(let side of [-1,1])for(let k=0;k<3;k++){
      part(root,'plate',[.18,.15,.24],armor,[.5+side*(.26+k*.08),.8+k*.1,-.04]);
      part(root,'cylinder',[.03,.045,.33],silver,[.5+side*.37,.44+k*.11,.22],[Math.PI/2,0,0]);
    }
    part(root,'torus',[.19,.028],glow,[.5,.51,.27]);
  }else if(key==='queen'){
    for(let side of [-1,1]){part(root,'plate',[.3,.5,.12],armor,[.5+side*.25,.96,-.06],[0,0,-side*.5]);part(root,'cone',[.055,.4,8],silver,[.5+side*.43,.3,.15],[0,0,side*.8]);}
  }else if(key==='maw'){
    for(let i=0;i<3;i++)part(root,'torus',[.18+i*.055,.032],armor,[.5,.52,.27-i*.04],[0,0,.1*i]);
  }else if(key==='gunship'){
    for(let side of [-1,1]){part(root,'plate',[.45,.16,.4],armor,[.5+side*.49,.56,-.08],[0,side*.35,side*.14]);part(root,'cylinder',[.055,.065,.25],dark,[.5+side*.32,.3,.22],[Math.PI/2,0,0]);}
  }
  const machinery=new THREE.Group();root.add(machinery);
  for(let side of [-1,1]){
    for(let k=0;k<5;k++)part(machinery,'plate',[.18,.065,.065],organic?armor:silver,[.5+side*.22,.31+k*.077,.25],[0,side*.25,side*.12]);
    machinery.add(tube([[.5+side*.2,.75,.16],[.5+side*.34,.68,.26],[.5+side*.3,.38,.26],[.5+side*.22,.25,.12]],.025,dark));
    for(let k=0;k<3;k++)part(machinery,'sphere',[.018,.018,.018],silver,[.5+side*.31,.43+k*.1,.23]);
  }
  part(machinery,'torus',[.175,.018],silver,[.5,.52,.285]);
  part(machinery,'torus',[.145,.012],dark,[.5,.52,.29]);pack(machinery);
  const shutters=[];
  for(let i=0;i<6;i++){const a=i*Math.PI/3;const shutter=joint(root,[.5+Math.cos(a)*.14,.52+Math.sin(a)*.17,.30]);part(shutter,'plate',[.075,.14,.035],armor,[0,0,0],[0,0,a]);shutters.push({shutter,a});}
  core.userData.dynamic=true;pack(root);for(const limb of parts)pack(limb);
  let opening=0,lastHp=null,impact=0;
  return {root,core,animate(b,dt,t){if(lastHp!==null&&b.hp<lastHp)impact=1;lastHp=b.hp;impact=THREE.MathUtils.damp(impact,0,10,dt||.016);root.rotation.z=Math.sin(t*30)*impact*.035;opening=THREE.MathUtils.damp(opening,b.open?1:0,9,dt||.016);shutters.forEach(({shutter,a})=>{shutter.position.x=.5+Math.cos(a)*(.10+opening*.105);shutter.position.y=.52+Math.sin(a)*(.13+opening*.105);shutter.rotation.z=opening*.35;});parts.forEach((p,i)=>p.rotation.z=Math.sin(t*2+i)*(i<2?.09:.04));const k=b.open?1.1+Math.sin(t*8)*.08:.62;core.scale.set(.12*k,.16*k,.06*k);root.rotation.y=-.15;}};
}

export function crystal(){
  const root=new THREE.Group();
  const gem=mat('#39bdcf',.3,.17,.55);
  part(root,'cone',[4.3,9,5],gem,[0,3,0]);part(root,'cone',[4.3,6,5],gem,[0,-4.5,0],[Math.PI,0,0]);
  part(root,'cone',[1,5,5],mat('#a5eff6',.4,.2,.3),[1.8,2,1]);return root;
}
