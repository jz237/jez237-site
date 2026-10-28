import * as T from './vendor/three.module.js';
import { PARTS, flowModel } from './data.js';
const V=(x=0,y=0,z=0)=>new T.Vector3(x,y,z), TAU=Math.PI*2;
const mat=(color,roughness=.5,metalness=0)=>new T.MeshStandardMaterial({color,roughness,metalness});
function roundedBox(w,h,d,r=.08){
  r=Math.min(r,w/3,h/3,d/3);const x=-w/2,y=-h/2,s=new T.Shape();
  s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);
  const g=new T.ExtrudeGeometry(s,{depth:Math.max(.001,d-r),bevelEnabled:true,bevelSize:r/2,bevelThickness:r/2,bevelSegments:3,curveSegments:8});g.translate(0,0,-(d-r)/2);return g;
}
function porousTexture(seed,base,dark,spacing){
  const canvas=document.createElement('canvas');canvas.width=canvas.height=512;const c=canvas.getContext('2d');
  let n=seed;const random=()=>((n=(Math.imul(n,1664525)+1013904223)>>>0)/4294967296);
  c.fillStyle=base;c.fillRect(0,0,512,512);
  for(let y=-spacing;y<520;y+=spacing)for(let x=-spacing;x<520;x+=spacing){const px=x+random()*spacing*.8,py=y+random()*spacing*.8,rx=spacing*(.18+random()*.25);c.beginPath();c.ellipse(px,py,rx,rx*(.6+random()*.4),random()*TAU,0,TAU);c.fillStyle=dark;c.fill();c.strokeStyle='#ffffff35';c.lineWidth=.8;c.stroke();}
  const tex=new T.CanvasTexture(canvas);tex.colorSpace=T.SRGBColorSpace;tex.wrapS=tex.wrapT=T.RepeatWrapping;tex.anisotropy=4;return tex;
}
function textPlate(text,w,h,bg='#152c31',fg='#cae0db'){
  const c=document.createElement('canvas');c.width=1024;c.height=160;const ctx=c.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,1024,160);ctx.fillStyle=fg;ctx.font='600 64px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,512,82);const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;
  return new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshStandardMaterial({map:tex,roughness:.65,side:T.DoubleSide}));
}
export function buildFilter(){
  const root=new T.Group(),parts=new Map(),pickables=[],cutSurfaces=[],guides=new T.Group();root.add(guides);
  const shell=mat('#132329',.29,.12),edge=mat('#344c4f',.3,.2),black=mat('#0a1014',.52),rubber=mat('#182328',.95),copper=mat('#ce9255',.37,.5),ceramic=mat('#d4cdb0',.91);
  const foamTex=porousTexture(75,'#ada987','#444a34',18),spongeTex=porousTexture(115,'#293131','#080e12',14),grainTex=porousTexture(5,'#d9d6ba','#aaa992',5);
  const foamMat=new T.MeshStandardMaterial({map:foamTex,bumpMap:foamTex,bumpScale:.045,roughness:.97});ceramic.bumpMap=grainTex;ceramic.bumpScale=.016;
  const spongeMat=new T.MeshStandardMaterial({map:spongeTex,bumpMap:spongeTex,bumpScale:.03,roughness:1});
  const tubeMat=new T.MeshPhysicalMaterial({color:'#91b0b2',roughness:.14,metalness:.07,transparent:true,opacity:.38,side:T.DoubleSide,depthWrite:false});
  const offsets={case:[0,0,0],lid:[0,4.6,0],basket:[3,.1,0],foam:[3,3.5,0],carbon:[3,4.2,-.7],biomax:[3,4.2,.7],utube:[-1.8,1.6,0],extension:[-2.1,.9,0],stem:[-2.1,-.1,0],prefilter:[-2.1,-.8,.65],impeller:[-1.2,-1.1,0],motor:[-1.2,-2.0,0],seal:[-1.2,-.55,0],'impeller-cover':[-1.2,1.45,0],leveler:[2.8,-1.0,0]};
  function part(id){const group=new T.Group();root.add(group);const p={...PARTS.find(p=>p.id===id),object:group,offset:V(...offsets[id]),center:V()};parts.set(id,p);return group;}
  function mesh(g,geometry,material,x=0,y=0,z=0){const m=new T.Mesh(geometry,material);m.position.set(x,y,z);m.castShadow=!material.transparent;m.receiveShadow=true;g.add(m);return m;}
  const box=(g,w,h,d,x,y,z,m=shell,r=.08)=>mesh(g,roundedBox(w,h,d,r),m,x,y,z);
  const cyl=(g,r1,r2,h,x,y,z,m=black,n=48)=>mesh(g,new T.CylinderGeometry(r1,r2,h,n),m,x,y,z);
  const tube=(g,points,r=.14,m=tubeMat)=>mesh(g,new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>V(...p)),false,'centripetal'),80,r,16,false),m);
  const caseGroup=part('case');
  box(caseGroup,4.28,.16,2.62,0,.15,0,shell);
  box(caseGroup,4.28,3.45,.14,0,1.9,-1.3,shell);
  cutSurfaces.push(box(caseGroup,.15,3.45,2.6,-2.08,1.9,0,shell));
  cutSurfaces.push(box(caseGroup,.15,3.45,2.6,2.08,1.9,0,shell));
  cutSurfaces.push(box(caseGroup,4.28,2.95,.13,0,1.65,1.3,shell));
  // Narrow inlet well is separated from the wider media chamber.
  box(caseGroup,.1,2.9,2.5,-.98,1.95,0,edge);
  for(let z of [-1.37,1.37])box(caseGroup,4.4,.12,.13,0,3.65,z,edge,.035);
  for(let x of [-2.17,2.17])box(caseGroup,.13,.12,2.76,x,3.65,0,edge,.035);
  for(let x=-1.8;x<2;x+=.45)box(caseGroup,.05,2.9,.045,x,1.85,-1.4,edge,.012);
  // Spillway is a shallow sloping tray, not a pipe.
  const lip=box(caseGroup,2.9,.1,1.03,.55,3.12,1.76,edge,.04);lip.rotation.x=.14;
  for(let x of [-.91,2.0])box(caseGroup,.07,.22,1.0,x,3.22,1.76,shell,.02);
  const badge=textPlate('AC70',.57,.12);badge.position.set(-1.53,3.18,1.378);caseGroup.add(badge);
  const lid=part('lid');box(lid,4.5,.2,2.86,0,3.85,0,shell,.1);box(lid,3.35,.06,1.9,0,3.98,0,black,.1);
  for(let i=0;i<18;i++)box(lid,.07,.025,.8,-1.4+i*.166,4.02,-.42,edge,.01);
  box(lid,.94,.12,.19,.25,4.07,.89,edge,.045);const logo=textPlate('FLUVAL  /  AquaClear',2.0,.3);logo.rotation.x=-Math.PI/2;logo.position.set(.1,4.026,.3);lid.add(logo);
  const basket=part('basket');
  for(let z of [-1.1,1.06])for(let i=0;i<16;i++) {const b=box(basket,.065,2.63,.06,-.73+i*.173,1.86,z,black,.012);if(z>0)cutSurfaces.push(b);}
  for(let x of [-.84,1.97])for(let i=0;i<12;i++)box(basket,.06,2.63,.065,x,1.86,-1.0+i*.184,black,.012);
  for(let y of [.55,1.0,1.45,3.18]){
    box(basket,2.86,.075,.08,.57,y,-1.1,edge,.012);const b=box(basket,2.86,.075,.08,.57,y,1.06,edge,.012);if(y<3)cutSurfaces.push(b);
    for(let x of [-.84,1.97])box(basket,.08,.075,2.2,x,y,-.02,edge,.012);
  }
  for(let i=0;i<15;i++)box(basket,.06,.07,2.15,-.71+i*.18,.54,-.02,edge,.012);
  box(basket,2.72,1.6,.055,.57,2.35,-.06,black,.015);
  for(let x of [-.7,1.8]){box(basket,.08,.5,.1,x,3.38,-.02,edge,.025);}
  box(basket,2.58,.1,.12,.55,3.63,-.02,edge,.025);
  const maxLabel=textPlate('BIOMAX FRONT  ·  MAX FILL',1.85,.12);maxLabel.position.set(.56,3.22,1.115);basket.add(maxLabel);
  const foam=part('foam');box(foam,2.65,.94,1.98,.56,1.07,-.02,foamMat,.09);
  // Ring-shaped ceramic pieces use instancing and real holes (not painted dots).
  const biomax=part('biomax'), carbon=part('carbon');
  let seed=341;const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
  const ringShape=new T.Shape();ringShape.absarc(0,0,.095,0,TAU,false);const hole=new T.Path();hole.absarc(0,0,.042,0,TAU,true);ringShape.holes.push(hole);
  const ringGeo=new T.ExtrudeGeometry(ringShape,{depth:.145,bevelEnabled:true,bevelSize:.008,bevelThickness:.008,bevelSegments:2,curveSegments:8});ringGeo.center();
  const rings=new T.InstancedMesh(ringGeo,ceramic,360),dummy=new T.Object3D();
  for(let i=0;i<360;i++){dummy.position.set(-.65+random()*2.42,1.65+random()*1.34,.15+random()*.76);dummy.rotation.set(random()*3,random()*3,random()*3);dummy.updateMatrix();rings.setMatrixAt(i,dummy.matrix);}rings.castShadow=true;rings.receiveShadow=true;biomax.add(rings);
  const beads=new T.InstancedMesh(new T.IcosahedronGeometry(.07,1),mat('#263337',.95),650);
  for(let i=0;i<650;i++){dummy.position.set(-.63+random()*2.4,1.64+random()*1.36,-.95+random()*.74);dummy.rotation.set(random()*3,random()*3,random()*3);dummy.scale.setScalar(.75+random()*.5);dummy.updateMatrix();beads.setMatrixAt(i,dummy.matrix);}beads.castShadow=true;beads.receiveShadow=true;carbon.add(beads);
  const meshBag=mat('#c1c7b8',.9);meshBag.transparent=true;meshBag.opacity=.16;meshBag.wireframe=true;mesh(carbon,new T.BoxGeometry(2.56,1.49,.9,20,12,8),meshBag,.55,2.29,-.58);
  const u=part('utube');const intakePath=[[-1.5,1.5,2.44],[-1.5,3.83,2.44],[-1.5,4.2,2.18],[-1.5,4.25,.9],[-1.5,4.02,-.24],[-1.5,3.55,-.32],[-1.5,.6,-.32]];tube(u,intakePath,.16);
  for(let y of [1.57,3.62])cyl(u,.19,.19,.12,-1.5,y,2.44,edge);
  box(u,.62,.12,.22,-1.5,4.45,1.27,edge,.04);const lever=box(u,.15,.16,.3,-1.5,4.52,1.27,copper,.04);
  const extension=part('extension');cyl(extension,.145,.145,1.65,-1.5,.67,2.44,tubeMat);cyl(extension,.175,.175,.12,-1.5,-.1,2.44,edge);
  const stem=part('stem');cyl(stem,.12,.12,.86,-1.5,-.6,2.44,black);
  for(let i=0;i<14;i++){const angle=i/14*TAU;box(stem,.035,.74,.035,-1.5+Math.cos(angle)*.23,-.62,2.44+Math.sin(angle)*.23,edge,.009);}for(let y of [-.99,-.22])cyl(stem,.25,.25,.065,-1.5,y,2.44,edge);
  const prefilter=part('prefilter');const preShape=new T.Shape();preShape.absarc(0,0,.43,0,TAU,false);const preHole=new T.Path();preHole.absarc(0,0,.26,0,TAU,true);preShape.holes.push(preHole);const pg=new T.ExtrudeGeometry(preShape,{depth:.97,bevelEnabled:true,bevelSize:.04,bevelThickness:.04,bevelSegments:3,curveSegments:24});pg.rotateX(Math.PI/2);pg.translate(-1.5,-.19,2.44);mesh(prefilter,pg,spongeMat);
  const motor=part('motor');cyl(motor,.49,.46,.91,-1.5,-.37,-.32,black);cyl(motor,.52,.52,.12,-1.5,.1,-.32,edge);
  box(motor,1.08,.66,.78,-1.5,-.45,-.4,black,.16);
  for(let i=0;i<10;i++)box(motor,.06,.52,.06,-1.95+i*.1,-.45,-.82,edge,.015);
  tube(motor,[[-1.88,-.42,-.6],[-2.3,-.7,-.9],[-2.4,-1.3,-1.4],[-2.2,-1.7,-1.8],[-1.7,-1.35,-1.85]],.036,rubber);
  const impeller=part('impeller');cyl(impeller,.17,.17,.48,-1.5,.18,-.32,mat('#3e4b4f',.35,.6));cyl(impeller,.035,.035,.82,-1.5,.33,-.32,ceramic);
  const rotor=new T.Group();rotor.position.set(-1.5,.48,-.32);impeller.add(rotor);cyl(rotor,.28,.28,.065,0,0,0,edge);
  for(let i=0;i<6;i++){const g=new T.Group();g.rotation.y=i/6*TAU;rotor.add(g);box(g,.19,.14,.035,.17,.08,0,mat('#b7d2cc',.3,.2),.012);}
  const seal=part('seal');const ring=mesh(seal,new T.TorusGeometry(.4,.036,12,64),copper,-1.5,.17,-.32);ring.rotation.x=Math.PI/2;
  const cover=part('impeller-cover');cyl(cover,.42,.47,.14,-1.5,.7,-.32,edge);cyl(cover,.21,.21,.21,-1.5,.84,-.32,tubeMat);
  const leveler=part('leveler');box(leveler,.23,.3,.5,.8,.65,1.49,black);const knob=cyl(leveler,.22,.22,.16,.8,.63,1.82,edge);knob.rotation.x=Math.PI/2;for(let i=0;i<12;i++){const a=i/12*TAU;box(leveler,.045,.045,.13,.8+Math.cos(a)*.23,.63+Math.sin(a)*.23,1.82,black,.008);}
  // Aquarium context: a cropped rear glass panel and a water surface under the return.
  const context=new T.Group();root.add(context);const glass=new T.MeshPhysicalMaterial({color:'#79c2c1',roughness:.2,transparent:true,opacity:.1,side:T.DoubleSide,depthWrite:false});
  box(context,7,4.2,.065,0,.18,1.98,glass,.01);box(context,7,.12,.13,0,2.31,1.98,edge,.02);
  const waterMat=new T.MeshPhysicalMaterial({color:'#4bc3c8',transparent:true,opacity:.18,roughness:.16,metalness:.3,side:T.DoubleSide,depthWrite:false});
  const surface=mesh(context,new T.PlaneGeometry(7,4.5,42,30),waterMat,0,2.27,4.25);surface.rotation.x=-Math.PI/2;const surfaceBase=surface.geometry.attributes.position.array.slice();
  const returnGroup=new T.Group();root.add(returnGroup);const waterfall=new T.Mesh(new T.PlaneGeometry(2.65,1.1,32,24),new T.MeshPhysicalMaterial({color:'#99e7d8',transparent:true,opacity:.3,roughness:.16,metalness:.15,side:T.DoubleSide,depthWrite:false}));waterfall.position.set(.56,2.7,2.32);returnGroup.add(waterfall);const fallBase=waterfall.geometry.attributes.position.array.slice();
  const rippleMaterial=new T.MeshBasicMaterial({color:'#a1ebe0',transparent:true,opacity:.2,side:T.DoubleSide,depthWrite:false});const ripples=[];
  for(let i=0;i<4;i++){const r=mesh(context,new T.RingGeometry(.5,.507,80),rippleMaterial.clone(),.55,2.285,3);r.rotation.x=-Math.PI/2;r.scale.y=.6;ripples.push(r);}
  const traceGroup=new T.Group();root.add(traceGroup);const flowPaths=[];
  const chamberWater=mesh(traceGroup,new T.BoxGeometry(.88,1,2.22),new T.MeshBasicMaterial({color:'#62ced9',transparent:true,opacity:.08,depthWrite:false}),-1.53,1.7,-.03);
  function path(points,color,kind='main',count=32){const curve=new T.CatmullRomCurve3(points.map(p=>V(...p)),false,'centripetal');const line=new T.Line(new T.BufferGeometry().setFromPoints(curve.getPoints(140)),new T.LineBasicMaterial({color,transparent:true,opacity:.24,depthTest:false}));line.renderOrder=9;traceGroup.add(line);const dots=new T.InstancedMesh(new T.SphereGeometry(.032,8,6),new T.MeshBasicMaterial({color,depthTest:false}),count);dots.renderOrder=10;traceGroup.add(dots);flowPaths.push({curve,line,dots,kind,count});}
  path([[-1.5,-1.1,2.44],...intakePath,[-1.5,.42,-.32],[-.4,.4,-.32],[.5,.45,-.3]],'#64dff2','intake',38);
  // A deliberately schematic connection between the actual rear/front media compartments.
  path([[.5,.45,-.3],[.5,1.1,-.3],[.5,1.72,-.57],[.5,2.72,-.57],[.5,2.9,.55],[.5,3.18,.8],[.5,3.18,1.7],[.5,3.06,2.2],[.5,2.28,2.53],[.5,2.25,3.6]],'#a8f4d4','return',40);
  path([[.5,3.07,.76],[-.65,3.14,.75],[-1.25,2.8,.65],[-1.4,.6,.4],[.5,.45,-.3],[.5,1.1,-.3]],'#efa865','recirculation',23);
  path([[-1.5,.5,-.32],[-1.5,2.7,.5],[-1.3,3.32,1.1],[-1.3,3.15,1.8],[-1.3,2.3,2.5]],'#efa865','bypass',20);
  const guideMaterial=new T.LineDashedMaterial({color:'#8dbfb8',transparent:true,opacity:.25,dashSize:.09,gapSize:.09});
  for(const [id,p] of parts){
    p.object.traverse(m=>{if(m.isMesh){m.userData.part=id;pickables.push(m);}});p.center=new T.Box3().setFromObject(p.object).getCenter(V());
    p.baseCenter=p.center.clone();const line=new T.Line(new T.BufferGeometry().setFromPoints([p.center,p.center.clone().add(p.offset)]),guideMaterial);line.computeLineDistances();guides.add(line);
  }
  parts.get('utube').baseCenter.set(-1.5,4.3,1.27);
  parts.get('carbon').baseCenter.set(.55,2.98,-.6);
  parts.get('biomax').baseCenter.set(.55,2.98,.6);
  function pose(amount,mode,time,flow,restricted,selected,isolated,careStep=-1,dt=.05,snap=false){
    for(const [id,p] of parts){
      let o=p.offset.clone().multiplyScalar(amount);
      if(careStep>=0){o.set(0,0,0);if(careStep>=1){if(id==='lid')o.y=3.7;if(['basket','foam','carbon','biomax'].includes(id)){o.x=2.8;o.y=2.0;}}if(careStep===2&&['motor','impeller','seal','impeller-cover'].includes(id)){o.copy(p.offset);}}
      p.object.position.lerp(o,snap?1:1-Math.exp(-dt*12));p.object.visible=!isolated||id===selected;
    }
    const cut=['cutaway','flow'].includes(mode)&&amount<.015&&!isolated&&careStep<0;
    for(const m of cutSurfaces)m.visible=!cut;parts.get('lid').object.visible=(!isolated||selected==='lid')&&(!cut||selected==='lid');
    parts.get('impeller-cover').object.visible=(!isolated||selected==='impeller-cover')&&(!cut||selected==='impeller-cover');
    context.visible=!isolated&&amount<.02&&careStep<0&&mode!=='cutaway';
    guides.visible=amount>.1&&!isolated&&careStep<0;
    const running=amount<.01&&!isolated&&careStep<0;rotor.rotation.y=running?time*5:0;
    const hydraulics=flowModel(flow,restricted);lever.position.x=-1.7+hydraulics.setting*.4;
    returnGroup.visible=running&&mode!=='cutaway';traceGroup.visible=mode==='flow'&&running;
    const waterHeight=restricted?3.05:2.52;chamberWater.scale.y=waterHeight;chamberWater.position.y=.25+waterHeight/2;
    for(const p of flowPaths){const active=p.kind==='recirculation'?flow<95:p.kind==='bypass'?restricted:true;p.line.visible=p.dots.visible=active;if(!active)continue;
      const speed=p.kind==='return'?hydraulics.delivery:.8;
      for(let i=0;i<p.count;i++){const t=(i/p.count+time*.075*speed)%1;dummy.position.copy(p.curve.getPointAt(t));dummy.rotation.set(0,0,0);dummy.scale.setScalar(p.kind==='recirculation'?.8+hydraulics.recirculation:1);dummy.updateMatrix();p.dots.setMatrixAt(i,dummy.matrix);}p.dots.instanceMatrix.needsUpdate=true;
    }
    const a=surface.geometry.attributes.position;for(let i=0;i<a.count;i++){const x=surfaceBase[i*3],y=surfaceBase[i*3+1];a.setZ(i,Math.sin(x*3.5+time*1.3)*Math.cos(y*3-time)*.012);}a.needsUpdate=true;
    const f=waterfall.geometry.attributes.position;for(let i=0;i<f.count;i++){f.setZ(i,Math.sin(fallBase[i*3]*19+time*3)*.012+Math.sin(fallBase[i*3+1]*7+time*5)*.018);}f.needsUpdate=true;waterfall.material.opacity=.16+hydraulics.delivery*.18;
    ripples.forEach((r,i)=>{const phase=(time*.3+i/4)%1;r.scale.set(1+phase*2.3, .6+phase*1.4,1);r.material.opacity=(1-phase)*.22;});
  }
  return {root,parts,pickables,pose,context,guides};
}
