// Fishing cover placed from the cove's feature list: the dock with its pilings, two laydowns, the
// riprap point, a milfoil bed on the south flat, lily pads in the creek shallows and old stumps.
// Everything is a normal scene mesh, so it reflects, refracts and shadows.
import * as T from './vendor/three.module.js';
import {Shape,rng} from './botany.js';
import {rockMaterial,barkMaterial} from './land-materials.js';
import {COVE_FEATURES,shorePoint,worldFromFrame,halfWidth,coveHeight} from './lake-shape.js';
import {floatingPose} from './course-environment.js';
export function makeCover(scene,bathy){
 const random=rng(2026),root=new T.Group();scene.add(root);const dynamic=[],features=[];
 const wood=new T.MeshStandardMaterial({color:0x8d8272,roughness:.92}),darkWood=new T.MeshStandardMaterial({color:0x4a3f33,roughness:.95}),bark=barkMaterial(),rock=rockMaterial();
 const box=(x,y,z,w,h,d,mat,parent,ry=0)=>{const m=new T.Mesh(new T.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.rotation.y=ry;m.castShadow=m.receiveShadow=true;parent.add(m);return m;};
 const cylinder=(x,y,z,r,h,mat,parent)=>{const m=new T.Mesh(new T.CylinderGeometry(r,r,h,10),mat);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;parent.add(m);return m;};
 // --- the dock: from the south bank straight out over the flat
 {const f=COVE_FEATURES.dock,bank=shorePoint(f.u,f.side,-2),out=shorePoint(f.u,f.side,14);const dx=out.x-bank.x,dz=out.z-bank.z,len=Math.hypot(dx,dz),yaw=Math.atan2(dx,dz);
  const g=new T.Group();g.position.set(bank.x,.45,bank.z);g.rotation.y=yaw;root.add(g);
  box(0,0,len/2,2.2,.12,len,wood,g);for(let i=.3;i<len;i+=.32)box(0,.07,i,2.2,.02,.05,darkWood,g);
  for(const side of [-1,1])for(let i=1;i<=len;i+=4){const px=side*.95,pz=i;const wx=bank.x+Math.sin(yaw)*pz+Math.cos(yaw)*px,wz=bank.z+Math.cos(yaw)*pz-Math.sin(yaw)*px;const bed=bathy.height(wx,wz);const h=.9-bed;cylinder(px,-.45+bed+h/2,pz,.13,h,darkWood,g);cylinder(px,.55,pz,.07,.9,darkWood,g);}
  box(0,.36,len-.15,2.4,.06,.3,darkWood,g);
  features.push({type:'dock',x:(bank.x+out.x)/2,z:(bank.z+out.z)/2,r:9});}
 // --- laydowns: fallen trees from the bank into the water
 for(const l of COVE_FEATURES.laydowns){const base=shorePoint(l.u,l.side,-3),tip=shorePoint(l.u,l.side,13);const s=new Shape();
  const y0=coveHeight(base.x,base.z)+.3,y1=Math.max(-2.2,coveHeight(tip.x,tip.z)+.15);
  s.tube([0,0,0],[tip.x-base.x,y1-y0,tip.z-base.z],.36,.10,9);
  const dir=new T.Vector3(tip.x-base.x,y1-y0,tip.z-base.z);const len=dir.length();dir.normalize();
  for(let i=0;i<7;i++){const t=.3+i*.1,a=i*2.4;const at=dir.clone().multiplyScalar(len*t);const side=new T.Vector3(Math.cos(a)*1.6,.9+Math.sin(a*1.7)*.5,Math.sin(a)*1.6);s.tube(at.toArray(),at.clone().add(side).toArray(),.07,.015,5);}
  const m=new T.Mesh(s.geometry(),bark);m.position.set(base.x,y0,base.z);m.castShadow=m.receiveShadow=true;root.add(m);
  features.push({type:'laydown',x:(base.x+tip.x)/2,z:(base.z+tip.z)/2,r:8});}
 // --- riprap along the north point
 {const f=COVE_FEATURES.riprap,pts=[];for(let i=0;i<180;i++){const u=f.u-f.length/2+random()*f.length;const w=halfWidth(u,-1);const v=-(w+(random()-.5)*5);const p=worldFromFrame(u,v);const y=coveHeight(p.x,p.z);if(y<-2.2||y>2.2)continue;pts.push({x:p.x,y:y-.15,z:p.z,s:.3+random()*random()*1.1});}
  const geo=new T.IcosahedronGeometry(1,2),pp=geo.attributes.position;for(let i=0;i<pp.count;i++){const x=pp.getX(i),y=pp.getY(i),z=pp.getZ(i),k=.85+.14*Math.sin(x*7+z*5)*Math.cos(y*6);pp.setXYZ(i,x*k,y*k*.7,z*k);}geo.computeVertexNormals();
  const mesh=new T.InstancedMesh(geo,rock,pts.length),d=new T.Object3D();pts.forEach((p,i)=>{d.position.set(p.x,p.y,p.z);d.rotation.set(random()*.6,random()*6.28,random()*.6);d.scale.set(p.s*(1+random()*.5),p.s,p.s*(1+random()*.5));d.updateMatrix();mesh.setMatrixAt(i,d.matrix);});mesh.castShadow=mesh.receiveShadow=true;root.add(mesh);
  const c=worldFromFrame(f.u,-halfWidth(f.u,-1)+6);features.push({type:'riprap',x:c.x,z:c.z,r:35});}
 // --- the milfoil bed: tapered blades reaching toward the surface on the south flat
 {const f=COVE_FEATURES.weedFlat,pts=[];for(let i=0;i<2600;i++){const u=f.u0+random()*(f.u1-f.u0),w=halfWidth(u,1),v=w*(.34+random()*.56);const p=worldFromFrame(u,v);const d=-coveHeight(p.x,p.z);if(d<1.2||d>4)continue;if(Math.sin(u*.05)*Math.cos(v*.07)<-.35)continue;pts.push({x:p.x,z:p.z,d,h:Math.min(d-.25,.7+random()*2.6)});}
  const blade=new T.PlaneGeometry(.14,1,1,6);blade.translate(0,.5,0);const bp=blade.attributes.position;for(let i=0;i<bp.count;i++){const y=bp.getY(i);bp.setX(i,bp.getX(i)*(.3+Math.sin(Math.PI*y)*.7)*(1-y*.4));bp.setZ(i,Math.sin(y*Math.PI)*.05);}blade.computeVertexNormals();
  const mat=new T.MeshStandardMaterial({color:0x4f6b2a,roughness:.85,side:T.DoubleSide});const timeU={value:0};
  mat.onBeforeCompile=s=>{Object.assign(s.uniforms,{weedTime:timeU});s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nuniform float weedTime;').replace('#include <begin_vertex>',`#include <begin_vertex>
vec3 base=(instanceMatrix*vec4(0.,0.,0.,1.)).xyz;float sway=position.y*position.y;transformed.x+=sin(weedTime*.7+base.x*.5+base.z*.3)*sway*.14;transformed.z+=sin(weedTime*.55+base.z*.4)*sway*.11;`);};
  const mesh=new T.InstancedMesh(blade,mat,pts.length),d=new T.Object3D();pts.forEach((p,i)=>{d.position.set(p.x,-p.d,p.z);d.rotation.set(0,random()*6.28,0);d.scale.set(.8+random()*.8,p.h,1);d.updateMatrix();mesh.setMatrixAt(i,d.matrix);mesh.setColorAt(i,new T.Color().setHSL(.24+random()*.08,.45,.22+random()*.14));});mesh.receiveShadow=true;root.add(mesh);
  dynamic.push(t=>{timeU.value=t;});const c=worldFromFrame((f.u0+f.u1)/2,halfWidth(150,1)*.6);features.push({type:'weedbed',x:c.x,z:c.z,r:70});}
 // --- lily pads in the creek shallows; each one rides the surface
 {const f=COVE_FEATURES.lilyPads,pads=[];for(let i=0;i<220;i++){const u=f.u0+random()*(f.u1-f.u0),w=halfWidth(u,1),v=(random()*2-1)*w*.92;const p=worldFromFrame(u,v);const d=-coveHeight(p.x,p.z);if(d<.3||d>1.4)continue;pads.push({x:p.x,z:p.z,r:.16+random()*.16,a:random()*6.28});}
  const shape=new T.Shape();for(let i=0;i<=28;i++){const a=i/28*Math.PI*2*.92+.25;shape.lineTo(Math.cos(a),Math.sin(a));}shape.lineTo(0,0);
  const geo=new T.ShapeGeometry(shape,12);geo.rotateX(-Math.PI/2);
  const mat=new T.MeshStandardMaterial({color:0x2f5a1f,roughness:.6,side:T.DoubleSide});const mesh=new T.InstancedMesh(geo,mat,pads.length),d=new T.Object3D();mesh.receiveShadow=true;root.add(mesh);
  pads.forEach((p,i)=>{mesh.setColorAt(i,new T.Color().setHSL(.27+random()*.06,.5,.2+random()*.12));});
  dynamic.push((t,surface)=>{pads.forEach((p,i)=>{const pose=floatingPose(p.x,p.z,t,surface,p.r,p.a);d.position.set(p.x,pose.y+.01,p.z);d.rotation.set(pose.pitch,p.a,pose.roll);d.scale.set(p.r,1,p.r);d.updateMatrix();mesh.setMatrixAt(i,d.matrix);});mesh.instanceMatrix.needsUpdate=true;});
  const c=worldFromFrame((f.u0+f.u1)/2,0);features.push({type:'pads',x:c.x,z:c.z,r:50});}
 // --- stumps near the old channel
 for(const s of COVE_FEATURES.stumps){const p=worldFromFrame(s.u,s.v);const bed=coveHeight(p.x,p.z),top=Math.min(.35,bed+1.4+random()*1.2);const h=top-bed;const stump=new Shape();stump.tube([0,0,0],[0,h,0],.42,.3,9);for(let i=0;i<4;i++){const a=i*1.6+random();stump.tube([Math.cos(a)*.3,0,Math.sin(a)*.3],[Math.cos(a)*.9,-.1,Math.sin(a)*.9],.12,.03,5);}
  const m=new T.Mesh(stump.geometry(),bark);m.position.set(p.x,bed,p.z);m.castShadow=m.receiveShadow=true;root.add(m);features.push({type:'stump',x:p.x,z:p.z,r:2});}
 return {root,features,update(t,surface){for(const fn of dynamic)fn(t,surface);}};
}
