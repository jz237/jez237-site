// Rocks and driftwood along the waterline, for the Ultra tier. The bank in the concept art is not a
// clean line of grass: there are boulders half in the water and old logs lying where the lake put
// them. Seeded and instanced, placed by walking the shore and keeping the points where the bed rises
// through the waterline, so they always sit on the edge rather than floating or buried.
import * as T from './vendor/three.module.js';
import {rockMaterial,barkMaterial} from './land-materials.js';
import {rng} from './botany.js';

// pure: is this a good spot for a boulder? the bed must cross the waterline nearby
export function shorePoint(height,x,z,step=1.4){
 const here=height(x,z);
 if(here<-.9||here>1.1)return null;
 // the outward direction is downhill; a rock sits with its foot in the water
 const gx=height(x+step,z)-height(x-step,z),gz=height(x,z+step)-height(x,z-step);
 const g=Math.hypot(gx,gz);
 if(g<.02)return null;
 return {x,z,y:here,slope:g};
}
export function makeShoreRocks(scene,bathy,{seed=8821,rocks=260,logs=26,span=null}={}){
 const root=new T.Group();root.visible=false;scene.add(root);
 const random=rng(seed),S=span||bathy.span;
 const pts=[],logPts=[];
 for(let i=0;i<rocks*40&&pts.length<rocks;i++){
  const x=(random()-.5)*S*.86,z=(random()-.5)*S*.86;
  const p=shorePoint((a,b)=>bathy.height(a,b),x,z);
  if(p)pts.push({...p,r:.18+random()*.62,ry:random()*6.283,rx:random()*.6,tint:random()});
 }
 for(let i=0;i<logs*60&&logPts.length<logs;i++){
  const x=(random()-.5)*S*.8,z=(random()-.5)*S*.8;
  const p=shorePoint((a,b)=>bathy.height(a,b),x,z);
  if(p&&p.y>-.35)logPts.push({...p,len:1.6+random()*3.2,rad:.09+random()*.13,ry:random()*6.283,tilt:(random()-.5)*.35});
 }
 const d=new T.Object3D(),colour=new T.Color();
 const rockGeo=new T.IcosahedronGeometry(1,1);
 // squash each rock a little so none is a perfect ball
 const rockMat=rockMaterial();
 const rockMesh=new T.InstancedMesh(rockGeo,rockMat,Math.max(1,pts.length));
 rockMesh.instanceColor=new T.InstancedBufferAttribute(new Float32Array(Math.max(1,pts.length)*3).fill(1),3);
 pts.forEach((p,i)=>{
  d.position.set(p.x,p.y-p.r*.35,p.z);d.rotation.set(p.rx,p.ry,p.rx*.5);
  d.scale.set(p.r*(1+p.tint*.5),p.r*(.6+p.tint*.3),p.r*(1.1-p.tint*.3));d.updateMatrix();
  rockMesh.setMatrixAt(i,d.matrix);colour.setRGB(.78+p.tint*.34,.8+p.tint*.3,.82+p.tint*.26);rockMesh.setColorAt(i,colour);
 });
 rockMesh.instanceMatrix.needsUpdate=true;rockMesh.castShadow=true;rockMesh.receiveShadow=true;rockMesh.computeBoundingSphere();root.add(rockMesh);
 const logGeo=new T.CylinderGeometry(1,.82,1,7,1);
 const logMat=barkMaterial();
 const logMesh=new T.InstancedMesh(logGeo,logMat,Math.max(1,logPts.length));
 logPts.forEach((p,i)=>{
  d.position.set(p.x,p.y+p.rad*.7,p.z);d.rotation.set(Math.PI/2+p.tilt,p.ry,0,'YXZ');
  d.scale.set(p.rad,p.len,p.rad);d.updateMatrix();logMesh.setMatrixAt(i,d.matrix);
 });
 logMesh.instanceMatrix.needsUpdate=true;logMesh.castShadow=true;logMesh.receiveShadow=true;logMesh.computeBoundingSphere();root.add(logMesh);
 return {root,
  count:()=>root.visible?pts.length+logPts.length:0,
  setEnabled(on){root.visible=!!on;}};
}
