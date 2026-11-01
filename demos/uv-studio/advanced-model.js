import * as T from '../aquaclear-studio/vendor/three.module.js';
const TAU=Math.PI*2;
export function buildAdvanced({mesh,box,cyl,ring,pipe,text,mat,glass,flowMat,shell}){
 const comparison=new T.Group(),shielding=new T.Group(),dummy=new T.Object3D();
 const black=mat('#17242c'),rim=mat('#4e6169','steel'),ceramic=mat('#e4e2cf','ivory'),violet=new T.MeshStandardMaterial({color:'#d6c9f0',emissive:'#9779c1',emissiveIntensity:.4,roughness:.24});
 const amber=new T.MeshStandardMaterial({color:'#ffd19a',emissive:'#d5a365',emissiveIntensity:.55,roughness:.25});
 const lanes=[];
 for(let i=0;i<2;i++){
  const root=new T.Group();comparison.add(root);box(root,5.9,.13,1.65,[0,.4,0],black);
  mesh(root,shell(.63,.72,5,Math.PI,Math.PI),black,[0,1.7,0]);
  for(const x of [-2.5,2.5]){ring(root,.68,.06,[x,1.7,0],rim);cyl(root,.72,.12,[x,1.7,0],black);box(root,.38,.48,.8,[x*.7,.65,0],black);}
  mesh(root,shell(.35,.39,4.8),glass,[0,1.7,0]);mesh(root,shell(.41,.62,4.8),flowMat,[0,1.7,0]);
  for(const z of [-.12,.12])cyl(root,.085,4.4,[0,1.7,z],violet);box(root,.15,.28,.43,[2.28,1.7,0],ceramic);
  text(root,(i?'B':'A')+'  /  EXPOSURE STUDY',[0,.38,.85],4.5);
  const tracer=mesh(root,new T.SphereGeometry(.095,18,12),amber);tracer.castShadow=false;
  const particles=new T.InstancedMesh(new T.ConeGeometry(.045,.16,8),new T.MeshBasicMaterial({color:i?'#e3aed0':'#93ded3'}),18);root.add(particles);
  const dirt=new T.InstancedMesh(new T.SphereGeometry(.032,6,4),mat('#aa9b73','rubber'),180);root.add(dirt);
  for(let j=0;j<180;j++){const a=j*2.399;dummy.position.set(-2.2+(j*37%181)/181*4.4,1.7+Math.cos(a)*.398,Math.sin(a)*.398);dummy.scale.set(1,.5,1.5);dummy.rotation.set(a,0,a);dummy.updateMatrix();dirt.setMatrixAt(j,dummy.matrix);}
  const rays=new T.Group();root.add(rays);const rayMaterial=new T.LineBasicMaterial({color:'#bca0ef',transparent:true,opacity:.3});
  const points=[];for(let j=0;j<22;j++){const x=-2.1+j/21*4.2,a=j*2.2;points.push(x,1.7+Math.cos(a)*.18,Math.sin(a)*.18,x,1.7+Math.cos(a)*.6,Math.sin(a)*.6);}rays.add(new T.LineSegments(new T.BufferGeometry().setAttribute('position',new T.Float32BufferAttribute(points,3)),rayMaterial));
  lanes.push({root,tracer,particles,dirt,rays,rayMaterial});
 }
 // This magnified scene distinguishes an attached organism from one that stays
 // in the water. Capturing a particle moves its attached organism with it.
 const board=box(shielding,6.3,.13,1.8,[0,.18,0],black);text(shielding,'PREFILTER  →  UV CHAMBER',[0,.17,.92],5.8);
 const screen=new T.Group();shielding.add(screen);box(screen,.18,2.9,1.4,[-2.65,1.75,0],mat('#526e70','rubber'));
 for(let i=0;i<11;i++)box(screen,.03,2.65,.025,[-2.54,1.75,-.6+i*.12],rim);
 text(shielding,'MECHANICAL',[-2.6,3.48,.15],1.6);text(shielding,'INVISIBLE UV-C',[-1.1,3.48,.15],1.8);
 box(shielding,.12,2.8,.8,[-1.7,1.9,-.55],violet);
 const aggregate=new T.Group();shielding.add(aggregate);
 const debrisMat=mat('#a08f6c','rubber'),debris=mesh(aggregate,new T.IcosahedronGeometry(.42,2),debrisMat);
 const attached=mesh(aggregate,new T.CapsuleGeometry(.10,.24,6,12),mat('#d8b27c','ivory'),[.36,0,0],[0,0,Math.PI/2]);
 for(let i=0;i<16;i++){const a=i*2.4;mesh(aggregate,new T.SphereGeometry(.04+i%3*.012,6,4),debrisMat,[Math.cos(a)*.34,Math.sin(a)*.32,Math.sin(a*.6)*.25]);}
 const free=new T.Group();shielding.add(free);free.position.set(.9,1,0);mesh(free,new T.CapsuleGeometry(.14,.4,8,18),mat('#8ec9bf','ivory'),[0,0,0],[0,0,Math.PI/2]);
 const freeBands=[];for(let i=0;i<4;i++)freeBands.push(ring(free,.145,.012,[-.18+i*.12,0,0],amber));
 const photons=new T.InstancedMesh(new T.SphereGeometry(.026,8,6),new T.MeshBasicMaterial({color:'#c6b0f1'}),64);shielding.add(photons);
 const attachedLabel=text(shielding,'PARTICLE + ATTACHED ORGANISM',[1.05,2.94,.2],2.9),capturedLabel=text(shielding,'PARTICLE + ORGANISM RETAINED',[-1.65,2.98,.3],2.7);text(shielding,'FREE-FLOATING ORGANISM',[1.05,.55,.2],2.8);
 const water=new T.Group();shielding.add(water);const waterArrows=[];for(let i=0;i<8;i++){const arrow=mesh(water,new T.ConeGeometry(.06,.21,8),new T.MeshBasicMaterial({color:'#89d7e2'}));arrow.rotation.z=-Math.PI/2;waterArrows.push(arrow);}
 let lastComparison,lastShield;
 return {comparison,shielding,render(state,s,paired){
  comparison.visible=state.study==='compare';shielding.visible=state.study==='shield';violet.emissiveIntensity=s.lamp?.4:0;
  if(comparison.visible){lastComparison=paired;
   lanes.forEach((lane,i)=>{const p=paired.lanes[i];lane.root.position.set(state.narrow?0:(i?3.25:-3.25),state.narrow?(i?-.7:2.45):0,0);
    const a=p.progress*TAU*1.25;lane.tracer.position.set(-2.2+4.4*p.progress,1.7+Math.cos(a)*.48,Math.sin(a)*.48);lane.dirt.count=Math.floor(180*p.settings.fouling/100);lane.rays.visible=state.field&&p.lamp;lane.rayMaterial.opacity=.08+p.intensity*.45;
    lane.particles.visible=state.arrows&&p.flow>.01;lane.particles.count=state.quality==='light'?8:18;
    for(let j=0;j<18;j++){const t=(j/18+p.travel*.12)%1,angle=t*TAU*1.25;dummy.position.set(-2.2+t*4.4,1.7+Math.cos(angle)*.51,Math.sin(angle)*.51);dummy.scale.setScalar(.8);dummy.rotation.set(0,0,-Math.PI/2);dummy.updateMatrix();lane.particles.setMatrixAt(j,dummy.matrix);}lane.particles.instanceMatrix.needsUpdate=true;
   });
  }
  if(shielding.visible){const mix=state.shieldMix||0;attachedLabel.visible=mix<.5;capturedLabel.visible=mix>=.5;aggregate.position.set(-.02-2.26*mix,2.3+.32*mix,.1);aggregate.rotation.x=Math.sin(s.time*.3)*.08;screen.visible=mix>.01;freeBands.forEach((o,i)=>o.visible=s.lamp&&i<3);lastShield={captured:mix>.98,attachedPosition:attached.getWorldPosition(new T.Vector3()).toArray(),freeRemains:free.visible};
   for(let i=0;i<64;i++){const t=(i/64+s.time*.25)%1,y=.8+(i%8)*.27,blocked=mix<.5&&y>1.88&&y<2.73;dummy.position.set(-1.57+t*(blocked?1.14:4.1),y,-.18+(i%3)*.12);dummy.scale.setScalar(s.lamp&&state.field?1:0);dummy.rotation.set(0,0,0);dummy.updateMatrix();photons.setMatrixAt(i,dummy.matrix);}photons.instanceMatrix.needsUpdate=true;photons.count=state.quality==='light'?32:64;
   waterArrows.forEach((o,i)=>{o.position.set(-2.9+((i/8+s.travel*.13)%1)*5.9,.45,.4);o.visible=state.arrows&&s.flow>.01;});
  }
 },snapshot:()=>({comparison:lastComparison?.lanes.map(l=>({progress:l.progress,exposure:l.exposure})),shield:lastShield})};
}
