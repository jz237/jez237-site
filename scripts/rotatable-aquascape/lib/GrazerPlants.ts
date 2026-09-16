import * as T from 'three';
import {sphereMayReachBox,CollisionCandidates} from './CollisionBounds.ts';
import {grazerBody,type BodySphere} from './GrazerCollision.ts';

export type PlantLeaf={mesh:T.InstancedMesh;index:number;matrix:T.Matrix4;root:T.Vector3;motion:T.Vector3;flex:number;rows:number;cols:number;box:T.Box3;length:number;width:number};
type FernTriangle={triangle:T.Triangle;margin:number;box:T.Box3};
type CollisionLeaf={rows:number;cols:number;vertices:T.Vector3[];triangles:{triangle:T.Triangle;box:T.Box3}[];time:number};
type PlantStem={a:T.Vector3;b:T.Vector3;radius:number;root:T.Vector3;flex:number;box:T.Box3;line?:T.Line3;time?:number};
export type LeafTrail={leaf:PlantLeaf;points:T.Vector2[];length:number};
const clamp=T.MathUtils.clamp;
type CurrentPhase={time:number;mx:number;mz:number;rx:number;rz:number;flow:number;phase:number;surge:number;side:number;currentX:number;currentZ:number};
const currentPhases=new WeakMap<PlantLeaf,CurrentPhase>();
/** A contacted blade's vertices share the same temporal phase and rooted current.
 * Cache only those common scalars; all vertex-dependent bends remain exact. */
function currentPhase(leaf:PlantLeaf,time:number){
 const m=leaf.motion,r=leaf.root;let c=currentPhases.get(leaf);
 if(!c||c.time!==time||c.mx!==m.x||c.mz!==m.z||c.rx!==r.x||c.rz!==r.z){
  const flow=r.x*.47+r.z*.71;
  c={time,mx:m.x,mz:m.z,rx:r.x,rz:r.z,flow,phase:time*m.z*2.25+m.x+.32*Math.sin(time*.43+flow),surge:.85+.15*Math.sin(time*.37+flow),side:time*m.z*1.13+m.x*.73,currentX:Math.sin(time*.82+flow)*.035+Math.sin(time*1.19+flow*1.7)*.013,currentZ:Math.sin(time*.67+flow+.8)*.029};
  currentPhases.set(leaf,c);
 }
 return c;
}
/** CPU counterpart of PlantCurrent, evaluated only for nearby contact triangles. */
export function deformPlantPoint(p:T.Vector3,leaf:PlantLeaf,time:number){
 const m=leaf.motion,r=leaf.root,c=currentPhase(leaf,time),{flow,phase,surge}=c;
 const ripple=(1.12*Math.sin(phase-p.y*1.8)+.16*Math.sin(time*.63+flow-p.y*1.4)+.10*Math.sin(phase*2.7-p.y*5.5))*surge;
 const twist=.25*Math.sin(phase*.81-p.y*.6+1.2)+.08*Math.sin(phase*2.1-p.y*3),f=p.y*p.y*(2-p.y);
 p.z+=m.y*(ripple*f+p.x*p.y*twist);p.x+=m.y*.22*f*Math.sin(c.side-p.y*2.2);
 p.applyMatrix4(leaf.matrix);
 const h=Math.max(0,p.y-r.y),x=p.x,z=p.z;
 p.x+=c.currentX*h*h*leaf.flex*clamp((4.96-Math.abs(x))*2,0,1);
 p.z+=c.currentZ*h*h*leaf.flex*clamp((2.20-Math.abs(z))*2,0,1);
 return p.applyMatrix4(leaf.mesh.matrixWorld);
}
const va=new T.Vector3(),vb=new T.Vector3(),vc=new T.Vector3(),edge=new T.Vector3();
/** Barycentric contact on the actual rendered blade, including its current. */
export function leafContact(leaf:PlantLeaf,u:number,v:number,time:number,p:T.Vector3,n:T.Vector3){
 const x=clamp(u,0,.999999)*leaf.cols,y=clamp(v,0,.999999)*leaf.rows,col=Math.floor(x),row=Math.floor(y),a=x-col,b=y-row,k=row*(leaf.cols+1)+col,attr=leaf.mesh.geometry.getAttribute('position');
 if(a+b<=1){deformPlantPoint(va.fromBufferAttribute(attr,k),leaf,time);deformPlantPoint(vb.fromBufferAttribute(attr,k+1),leaf,time);deformPlantPoint(vc.fromBufferAttribute(attr,k+leaf.cols+1),leaf,time);p.copy(va).multiplyScalar(1-a-b).addScaledVector(vb,a).addScaledVector(vc,b);}
 else{deformPlantPoint(va.fromBufferAttribute(attr,k+leaf.cols+2),leaf,time);deformPlantPoint(vb.fromBufferAttribute(attr,k+leaf.cols+1),leaf,time);deformPlantPoint(vc.fromBufferAttribute(attr,k+1),leaf,time);p.copy(va).multiplyScalar(a+b-1).addScaledVector(vb,1-a).addScaledVector(vc,1-b);}
 n.copy(vb).sub(va).cross(edge.copy(vc).sub(va)).normalize();
}

/** A spatial broad phase avoids raycasting all 30,000 blades during animation. */
export class GrazerPlants{
 readonly leaves:PlantLeaf[]=[];private cells=new Map<string,PlantLeaf[]>();private stems=new Map<string,PlantStem[]>();private ferns=new Map<string,FernTriangle[]>();private shrimpTrails=new Map<PlantLeaf,LeafTrail|null>();private snailTrails=new Map<PlantLeaf,LeafTrail|null>();
 private leafCandidates=new CollisionCandidates(this.cells);private stemCandidates=new CollisionCandidates(this.stems);private fernCandidates=new CollisionCandidates(this.ferns);
 private leafCollisionCache=new Map<PlantLeaf,CollisionLeaf>();
 private envelopeCollisionCache=new Map<PlantLeaf,CollisionLeaf>();
 private normal=new T.Vector3();private closest=new T.Vector3();
 private solidCheck?:(p:T.Vector3,n:T.Vector3,f:T.Vector3,snail:boolean)=>boolean;
 constructor(scene:T.Scene,solidCheck?:(p:T.Vector3,n:T.Vector3,f:T.Vector3,snail:boolean)=>boolean){
  this.solidCheck=solidCheck;
  // Alpha-cutout fern fronds are conservative collision surfaces, including
  // their small current envelope. Animals route around gaps rather than clip.
  scene.traverse(o=>{if(!(o instanceof T.Mesh)||o instanceof T.InstancedMesh)return;const materials=Array.isArray(o.material)?o.material:[o.material];if(!o.userData.grazerEquipment&&!materials.some(m=>m.customProgramCacheKey().includes('scanned-fern-current')))return;
   const g=o.geometry,p=g.getAttribute('position'),idx=g.index,scale=new T.Vector3().setFromMatrixScale(o.matrixWorld).length();
   for(let i=0;i<(idx?.count??p.count);i+=3){const points=[0,1,2].map(j=>new T.Vector3().fromBufferAttribute(p,idx?idx.getX(i+j):i+j)),margin=(o.userData.grazerEquipment?0:.032)*Math.max(...points.map(v=>Math.max(0,v.y)**2))*scale;points.forEach(v=>v.applyMatrix4(o.matrixWorld));const triangle=new T.Triangle(...points as [T.Vector3,T.Vector3,T.Vector3]),box=new T.Box3().setFromPoints(points).expandByScalar(margin),item={triangle,margin,box};
    for(let x=Math.floor(box.min.x/.5);x<=Math.floor(box.max.x/.5);x++)for(let y=Math.floor(box.min.y/.5);y<=Math.floor(box.max.y/.5);y++)for(let z=Math.floor(box.min.z/.5);z<=Math.floor(box.max.z/.5);z++){const key=`${x},${y},${z}`,cell=this.ferns.get(key);if(cell)cell.push(item);else this.ferns.set(key,[item]);}
   }
  });
  scene.traverse(o=>{if(!(o instanceof T.InstancedMesh)||o.geometry.getAttribute('leafMotion'))return;const roots=o.geometry.getAttribute('plantRoot'),flex=o.geometry.getAttribute('plantFlex');if(!roots||!flex)return;
   for(let i=0;i<o.count;i++){const m=new T.Matrix4();o.getMatrixAt(i,m);const scale=new T.Vector3().setFromMatrixScale(m),a=new T.Vector3(0,-.5,0).applyMatrix4(m),b=new T.Vector3(0,.5,0).applyMatrix4(m),root=new T.Vector3().fromBufferAttribute(roots,i),radius=Math.max(scale.x,scale.z),box=new T.Box3().setFromPoints([a,b]).expandByScalar(radius+.065*Math.max(a.y-root.y,b.y-root.y)**2*flex.getX(i));const stem={a,b,root,radius,box,flex:flex.getX(i)};
    for(let x=Math.floor(box.min.x/.5);x<=Math.floor(box.max.x/.5);x++)for(let y=Math.floor(box.min.y/.5);y<=Math.floor(box.max.y/.5);y++)for(let z=Math.floor(box.min.z/.5);z<=Math.floor(box.max.z/.5);z++){const key=`${x},${y},${z}`,cell=this.stems.get(key);if(cell)cell.push(stem);else this.stems.set(key,[stem]);}
   }
  });
  scene.traverse(o=>{if(!(o instanceof T.InstancedMesh)||!o.userData.plantSpecies)return;
   const g=o.geometry,motion=g.getAttribute('leafMotion'),roots=g.getAttribute('plantRoot'),flex=g.getAttribute('plantFlex'),uv=g.getAttribute('uv');if(!motion||!roots||!uv)return;
   let cols=0;while(cols+1<uv.count&&uv.getY(cols+1)===0)cols++;const rows=uv.count/(cols+1)-1;if(!Number.isInteger(rows))return;
   g.computeBoundingBox();for(let i=0;i<o.count;i++){
    const matrix=new T.Matrix4();o.getMatrixAt(i,matrix);const scale=new T.Vector3().setFromMatrixScale(matrix),root=new T.Vector3().fromBufferAttribute(roots,i);
    const box=g.boundingBox!.clone().applyMatrix4(matrix).applyMatrix4(o.matrixWorld);
    const margin=motion.getY(i)*scale.y*1.6+.065*Math.max(0,box.max.y-root.y)**2*flex.getX(i);box.expandByScalar(margin+.025);
    const leaf:PlantLeaf={mesh:o,index:i,matrix,root,motion:new T.Vector3().fromBufferAttribute(motion,i),flex:flex.getX(i),rows,cols,box,length:scale.y,width:scale.x};this.leaves.push(leaf);
    for(let x=Math.floor(box.min.x/.5);x<=Math.floor(box.max.x/.5);x++)for(let y=Math.floor(box.min.y/.5);y<=Math.floor(box.max.y/.5);y++)for(let z=Math.floor(box.min.z/.5);z<=Math.floor(box.max.z/.5);z++){const key=`${x},${y},${z}`,cell=this.cells.get(key);if(cell)cell.push(leaf);else this.cells.set(key,[leaf]);}
   }
  });
 }
 nearby(p:T.Vector3,r:number){return this.leafCandidates.nearby(p,r);}
 /** Body clearance, not just a point at the animal's feet. */
 clear(p:T.Vector3,n:T.Vector3,tangent:T.Vector3,snail:boolean,time:number,own?:PlantLeaf){
  if(this.solidCheck&&!this.solidCheck(p,n,tangent,snail))return false;
  return this.clearBody(p,grazerBody(p,n,tangent,snail,snail?.84:.88),time,own);
 }
 clearBody(p:T.Vector3,body:BodySphere[],time:number,own?:PlantLeaf,envelope=false,queryRadius=.48){
  const cache=envelope?this.envelopeCollisionCache:this.leafCollisionCache;if(envelope)time=0;
  const centers=body;
  // Reject an entire surface against the complete body before testing its
  // individual spheres. This only skips surfaces no body sphere can reach.
  let minX=Infinity,minY=Infinity,minZ=Infinity,maxX=-Infinity,maxY=-Infinity,maxZ=-Infinity;
  for(const {center:c,radius:r} of body){minX=Math.min(minX,c.x-r);minY=Math.min(minY,c.y-r);minZ=Math.min(minZ,c.z-r);maxX=Math.max(maxX,c.x+r);maxY=Math.max(maxY,c.y+r);maxZ=Math.max(maxZ,c.z+r);}
  const mayReach=(box:T.Box3,extra=0)=>{extra+=1e-12;return maxX+extra>=box.min.x&&minX-extra<=box.max.x&&maxY+extra>=box.min.y&&minY-extra<=box.max.y&&maxZ+extra>=box.min.z&&minZ-extra<=box.max.z;};
  for(const fern of this.fernCandidates.nearby(p,queryRadius)){if(!mayReach(fern.box,fern.margin))continue;for(const c of centers){if(!sphereMayReachBox(c.center,c.radius+fern.margin,fern.box))continue;fern.triangle.closestPointToPoint(c.center,this.closest);if(this.closest.distanceToSquared(c.center)<(c.radius+fern.margin)**2)return false;}}
  const stems=this.stemCandidates.nearby(p,queryRadius);
  for(const stem of stems){
   const extra=envelope?.13*Math.max(stem.a.y-stem.root.y,stem.b.y-stem.root.y)**2*stem.flex:0;
   // The stored box already encloses the full current sweep and stem radius.
   // Distant stems need neither a deformed segment nor an exact distance test.
   if(!mayReach(stem.box,extra)||!centers.some(c=>sphereMayReachBox(c.center,c.radius+extra,stem.box)))continue;
   if(stem.time!==time||!stem.line){const bend=(q:T.Vector3)=>{const h=Math.max(0,q.y-stem.root.y),phase=stem.root.x*.47+stem.root.z*.71;q.x+=(Math.sin(time*.82+phase)*.035+Math.sin(time*1.19+phase*1.7)*.013)*h*h*stem.flex*clamp((4.96-Math.abs(q.x))*2,0,1);q.z+=Math.sin(time*.67+phase+.8)*.029*h*h*stem.flex*clamp((2.20-Math.abs(q.z))*2,0,1);return q;};stem.line??=new T.Line3();bend(stem.line.start.copy(stem.a));bend(stem.line.end.copy(stem.b));stem.time=time;}
   for(const c of centers){stem.line.closestPointToPoint(c.center,true,this.closest);if(this.closest.distanceToSquared(c.center)<(c.radius+stem.radius+extra)**2)return false;}
  }
  for(const leaf of this.nearby(p,queryRadius)){
   if(leaf===own)continue;
   if(!mayReach(leaf.box)||!centers.some(c=>sphereMayReachBox(c.center,c.radius,leaf.box)))continue;
   // Thin small leaves need only two triangles; large blades retain their cup
   // and arch in the contact mesh. This is collision data, never rendered LOD.
   const extra=envelope?leaf.motion.y*new T.Vector3().setFromMatrixScale(leaf.matrix).y*3.4+.13*Math.max(0,leaf.box.max.y-leaf.root.y)**2*leaf.flex:0;
   let cached=cache.get(leaf);if(!cached){
    const rows=leaf.length>.4?10:2,cols=leaf.width>.15?4:1,vertices:T.Vector3[]=[],triangles:CollisionLeaf['triangles']=[];
    for(let i=0;i<(rows+1)*(cols+1);i++)vertices.push(new T.Vector3());
    for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){const k=y*(cols+1)+x;for(const ids of [[k,k+1,k+cols+1],[k+1,k+cols+2,k+cols+1]]){const triangle=new T.Triangle(vertices[ids[0]],vertices[ids[1]],vertices[ids[2]]);triangles.push({triangle,box:new T.Box3()});}}
    cached={rows,cols,vertices,triangles,time:NaN};
    // Moving contacts reuse vectors and bounds instead of allocating them every frame.
    if(!envelope&&cache.size>=512)cache.delete(cache.keys().next().value!);
    cache.set(leaf,cached);
   }
   if(cached.time!==time){
    const {rows,cols,vertices}=cached;for(let y=0;y<=rows;y++)for(let x=0;x<=cols;x++)leafContact(leaf,x/cols,y/rows,time,vertices[y*(cols+1)+x],this.normal);
    for(const {triangle,box} of cached.triangles)box.makeEmpty().expandByPoint(triangle.a).expandByPoint(triangle.b).expandByPoint(triangle.c);
    cached.time=time;
   }
   for(const {triangle,box} of cached.triangles){if(!mayReach(box,extra))continue;for(const c of centers){if(!sphereMayReachBox(c.center,c.radius+extra,box))continue;triangle.closestPointToPoint(c.center,this.closest);if(this.closest.distanceToSquared(c.center)<(c.radius+extra)**2)return false;}}

  }
  return true;
 }
 trail(center:T.Vector3,snail:boolean,used:Set<PlantLeaf>):LeafTrail|undefined{
  const p=new T.Vector3(),n=new T.Vector3(),q=new T.Vector3(),tangent=new T.Vector3();
  const candidates=this.leaves.filter(l=>!used.has(l)&&l.length>(snail?.75:.65)&&l.width>(snail?.20:.17)).sort((a,b)=>a.box.getCenter(p).distanceToSquared(center)-b.box.getCenter(q).distanceToSquared(center));
  const cache=snail?this.snailTrails:this.shrimpTrails;
  for(const leaf of candidates){if(cache.has(leaf)){const cached=cache.get(leaf);if(cached){used.add(leaf);return cached;}continue;}for(const [mid,span] of [[.70,.10],[.55,.10],[.82,.055],[.42,.07]]){
   const points:T.Vector2[]=[],positions:T.Vector3[]=[];let okay=true;
   for(let j=0;j<48;j++){
    const angle=j/48*Math.PI*2,u=.5+.10*Math.sin(angle),v=mid+span*Math.cos(angle);leafContact(leaf,u,v,0,p,n);leafContact(leaf,.5+.10*Math.sin(angle+.01),mid+span*Math.cos(angle+.01),0,q,tangent);tangent.copy(q).sub(p).normalize();
    if(n.y<.08||!this.clear(p,n,tangent,snail,0,leaf)){okay=false;break;}
    points.push(new T.Vector2(u,v));positions.push(p.clone());
   }
   if(okay){const lengths=[0];for(let j=0;j<48;j++)lengths.push(lengths[j]+positions[j].distanceTo(positions[(j+1)%48]));const length=lengths[48],uniform:T.Vector2[]=[];let k=0;for(let j=0;j<128;j++){const d=j/128*length;while(k<47&&lengths[k+1]<d)k++;uniform.push(points[k].clone().lerp(points[(k+1)%48],(d-lengths[k])/(lengths[k+1]-lengths[k])));}used.add(leaf);const trail={leaf,points:uniform,length};cache.set(leaf,trail);return trail;}
  }cache.set(leaf,null);}
 }
}
