import * as T from '../aquaclear-studio/vendor/three.module.js';
import {detailedServicePose} from './transport.js?v=3';
const V=(...p)=>new T.Vector3(...p),TAU=Math.PI*2;
function random(){let n=91273;return()=>((n=(n*1664525+1013904223)>>>0)/4294967296);}
function spurGeometry(radius,teeth){
 const shape=new T.Shape();for(let k=0;k<teeth;k++)for(const [f,r] of [[0,radius-.016],[.20,radius-.016],[.30,radius+.016],[.70,radius+.016],[.80,radius-.016],[1,radius-.016]]){const a=(k+f)/teeth*TAU,x=Math.cos(a)*r,y=Math.sin(a)*r;if(k===0&&f===0)shape.moveTo(x,y);else shape.lineTo(x,y);}shape.closePath();
 if(radius>.1)for(let k=0;k<4;k++){const a=k/4*TAU,h=new T.Path();h.absarc(Math.cos(a)*radius*.55,Math.sin(a)*radius*.55,radius*.16,0,TAU,true);shape.holes.push(h);}
 return new T.ExtrudeGeometry(shape,{depth:.065,bevelEnabled:true,bevelSize:.002,bevelThickness:.002,bevelSegments:2,steps:1,curveSegments:16}).translate(0,0,-.0325);
}

export function addRollLayers(spools){
 const r=random(),details=[];
 for(let side=0;side<2;side++){
  const spool=spools[side];
  // The cylinder axis is local Y before the existing rotation into Z.
  const geo=new T.CylinderGeometry(1,1,1.8,128,20),p=geo.attributes.position;
  for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),radius=Math.hypot(x,z),a=Math.atan2(z,x);if(radius>.9){const bulge=(side?.011:.004)*Math.sin(a*13+y*17)*Math.sin(a*7-y*11);p.setXYZ(i,x*(1+bulge),y+Math.pow(Math.abs(y)/.9,10)*Math.sin(a*21+side)*.008,z*(1+bulge));}}
  geo.computeVertexNormals();spool.drum.geometry.dispose();spool.drum.geometry=geo;
  spool.ends.filter(o=>o.geometry.type==='TorusGeometry').forEach(o=>o.visible=false);
  const vertices=[],seeds=[];
  for(const edge of [-1,1])for(let layer=0;layer<60;layer++)for(let k=0;k<96;k++)for(const step of [0,1]){const a=(k+step)/96*TAU;seeds.push({a,f:layer/60,edge});vertices.push(0,0,0);}
  const layerGeo=new T.BufferGeometry();layerGeo.setAttribute('position',new T.Float32BufferAttribute(vertices,3));const layers=new T.LineSegments(layerGeo,new T.LineBasicMaterial({color:side?'#362a19':'#b1aa8b',transparent:true,opacity:side?.58:.44}));spool.rot.add(layers);layers.frustumCulled=false;
  const lintSeeds=Array.from({length:160},()=>({a:r()*TAU,z:(r()-.5)*1.8,size:side?.004+r()*.012:.002+r()*.004}));const lint=new T.InstancedMesh(new T.IcosahedronGeometry(1,0),new T.MeshStandardMaterial({color:side?'#6f552c':'#eee9d7',roughness:.9}),160);spool.rot.add(lint);lint.frustumCulled=false;
  details.push({seeds,layerGeo,layers,lint,lintSeeds,rad:-1});
 }
 const dummy=new T.Object3D();return {update(s){for(let i=0;i<2;i++){const d=details[i],rad=i?s.dirty:s.clean;d.layers.visible=d.lint.visible=rad>.195;if(rad===d.rad)continue;d.rad=rad;const p=d.layerGeo.attributes.position;d.seeds.forEach((v,k)=>{const rr=.192+(rad-.192)*v.f+Math.sin(v.a*7+v.f*12)*.0025*v.f;p.setXYZ(k,Math.cos(v.a)*rr,Math.sin(v.a)*rr,v.edge*(.922+Math.sin(v.a*11+v.f*22)*.003));});p.needsUpdate=true;d.lintSeeds.forEach((v,k)=>{const rr=rad+.004;dummy.position.set(Math.cos(v.a)*rr,4e-3+Math.sin(v.a)*rr,v.z);dummy.rotation.set(v.a,v.a*.7,v.a);dummy.scale.set(v.size,v.size*.5,v.size*2);dummy.updateMatrix();d.lint.setMatrixAt(k,dummy.matrix);});d.lint.instanceMatrix.needsUpdate=true;}},layerCount:60};
}

export function buildDrive({drive,mesh,box,cyl,torus,steel,red,dark,motorMaterial}){
 const housing=box(drive,1.02,.68,.18,[1.72,4.25,1.17],red),cover=box(drive,1.02,.68,.06,[1.72,4.25,1.57],red),gears=[];
 const motor=new T.Group();motor.position.set(1.97,4.25,1.93);motor.userData.part='drive';drive.add(motor);cyl(motor,.17,.8,[0,0,0],motorMaterial);for(let i=0;i<6;i++)torus(motor,.17,.012,[0,0,-.31+i*.11],steel);const rotor=new T.Group();motor.add(rotor);cyl(rotor,.035,.6,[0,0,-.5],steel);box(rotor,.015,.07,.02,[0,.03,-.49],red);
 for(const [x,rad,teeth] of [[1.34,.28,40],[1.76,.14,20],[1.97,.07,10]]){
  const g=new T.Group();g.position.set(x,4.25,1.40);g.userData.part='drive';drive.add(g);mesh(g,spurGeometry(rad,teeth),steel);torus(g,.042,.007,[0,0,.038],steel);
  cyl(g,.035,.1,[0,0,.03],dark,12);box(g,.018,rad*.62,.018,[0,rad*.52,.055],red);gears.push(g);
 }
 const coupling=new T.Group();coupling.position.set(1.34,4.25,1.26);coupling.userData.part='drive';drive.add(coupling);cyl(coupling,.13,.2,[0,0,0],steel);for(let i=0;i<3;i++){const a=i/3*TAU;box(coupling,.04,.06,.17,[Math.cos(a)*.12,Math.sin(a)*.12,0],dark);}
 return {cover,update(angle,state,pose){cover.visible=!state.mechanics||state.mode==='assembled';gears[0].rotation.z=angle;gears[1].rotation.z=-angle*2+Math.PI/20;gears[2].rotation.z=angle*4;rotor.rotation.z=angle*4;coupling.rotation.z=angle;coupling.position.z=1.26+(pose?.clip||0)*.22;},snapshot:()=>({gearAngles:gears.map(g=>g.rotation.z),gearTeeth:[40,20,10],reduction:4})};
}

export function buildService({groups,spools,mesh,box,cyl,steel,red}){
 const clips=[];for(const x of [-1.34,1.34]){const clip=new T.Group();clip.position.set(x-.16,4.25,1.08);clip.userData.part='housing';groups.housing.add(clip);box(clip,.34,.055,.09,[.16,.21,0],red);box(clip,.055,.25,.09,[.31,.09,0],red);cyl(clip,.04,.1,[0,0,0],steel);clips.push(clip);}
 return {update(s,ex){const p=detailedServicePose(s.serviceProgress);clips.forEach(o=>o.rotation.z=p.clip*1.35);spools.forEach((spool,i)=>{spool.g.position.set((i?1:-1)*(ex*.45+p.shift),ex*.7+p.lift,p.shift*.6);spool.g.visible=p.visible;});return p;}};
}

export function addWetContact({machine,groups}){
 const r=random(),dummy=new T.Object3D(),mat=new T.MeshPhysicalMaterial({color:'#b8ebeb',transparent:true,opacity:.6,roughness:.08,metalness:.12,clearcoat:1,depthWrite:false});
 const beads=new T.InstancedMesh(new T.SphereGeometry(1,10,8),mat,100);groups.housing.add(beads);beads.frustumCulled=false;const seeds=Array.from({length:100},()=>({x:(r()-.5)*3.6,y:1+r()*2.2,z:1.112,size:.008+r()*.017}));seeds.forEach((a,i)=>{dummy.position.set(a.x,a.y,-a.z);dummy.scale.set(a.size,a.size*1.5,a.size*.4);dummy.updateMatrix();beads.setMatrixAt(i,dummy.matrix);});beads.instanceMatrix.needsUpdate=true;
 const pendant=new T.InstancedMesh(new T.SphereGeometry(1,10,8),mat,54);machine.add(pendant);pendant.frustumCulled=false;
 const wetLines=[];for(let side=0;side<2;side++){const geo=new T.BufferGeometry();geo.setAttribute('position',new T.BufferAttribute(new Float32Array(42*3),3));const line=new T.Line(geo,new T.LineBasicMaterial({color:'#b0e6db',transparent:true,opacity:.62}));machine.add(line);wetLines.push(line);}
 return {update(s,sample,length,visible){beads.visible=pendant.visible=visible;wetLines.forEach(o=>o.visible=visible);if(!visible)return;
  for(let side=0;side<2;side++){let best=0,error=Infinity;for(let k=0;k<=70;k++){const u=side?.55+k/70*.42:.03+k/70*.39,p=sample(u*length,0).p,e=Math.abs(p.y-s.level);if(e<error){error=e;best=u;}}const a=wetLines[side].geometry.attributes.position;for(let j=0;j<42;j++){const {p,n}=sample(best*length,(j/41-.5)*1.8);p.addScaledVector(n,.014);p.y+=Math.sin(j*.8)*.005;a.setXYZ(j,p.x,p.y,p.z);}a.needsUpdate=true;}
  for(let i=0;i<54;i++){const u=i<36?.38+(i%9)/9*.24:.82+(i%9)/9*.10,z=i<36?(Math.floor(i/9)/3-.5)*1.72:(i%2?-.88:.88),{p}=sample(u*length,z),phase=(s.waterPhase*.48+i*.131)%1,grow=phase<.7?.35+phase:.99,fall=phase>.7?(phase-.7)**2*7:0;p.y-=.026+fall;dummy.position.copy(p);dummy.scale.set(.014*grow,.018*grow+fall*.025,.014*grow);if(p.y<s.outside||s.velocity===0)dummy.scale.setScalar(0);dummy.updateMatrix();pendant.setMatrixAt(i,dummy.matrix);}pendant.instanceMatrix.needsUpdate=true;
 },snapshot:()=>({acrylicBeads:100,pendantDrops:54})};
}
