import * as T from 'three';

export type PlantLeaf={mesh:T.InstancedMesh;index:number;matrix:T.Matrix4;root:T.Vector3;motion:T.Vector3;flex:number;rows:number;cols:number;box:T.Box3;length:number;width:number};
type FernTriangle={triangle:T.Triangle;margin:number};
type PlantStem={a:T.Vector3;b:T.Vector3;radius:number;root:T.Vector3;flex:number;box:T.Box3};
export type LeafTrail={leaf:PlantLeaf;points:T.Vector2[];length:number};
const clamp=T.MathUtils.clamp;
/** CPU counterpart of PlantCurrent, evaluated only for nearby contact triangles. */
export function deformPlantPoint(p:T.Vector3,leaf:PlantLeaf,time:number){
 const m=leaf.motion,r=leaf.root,flow=r.x*.47+r.z*.71;
 const phase=time*m.z*2.25+m.x+.32*Math.sin(time*.43+flow),surge=.85+.15*Math.sin(time*.37+flow);
 const ripple=(1.12*Math.sin(phase-p.y*1.8)+.16*Math.sin(time*.63+flow-p.y*1.4)+.10*Math.sin(phase*2.7-p.y*5.5))*surge;
 const twist=.25*Math.sin(phase*.81-p.y*.6+1.2)+.08*Math.sin(phase*2.1-p.y*3),f=p.y*p.y*(2-p.y);
 p.z+=m.y*(ripple*f+p.x*p.y*twist);p.x+=m.y*.22*f*Math.sin(time*m.z*1.13+m.x*.73-p.y*2.2);
 p.applyMatrix4(leaf.matrix);
 const h=Math.max(0,p.y-r.y),x=p.x,z=p.z;
 p.x+=(Math.sin(time*.82+flow)*.035+Math.sin(time*1.19+flow*1.7)*.013)*h*h*leaf.flex*clamp((4.96-Math.abs(x))*2,0,1);
 p.z+=Math.sin(time*.67+flow+.8)*.029*h*h*leaf.flex*clamp((2.20-Math.abs(z))*2,0,1);
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
 private normal=new T.Vector3();private triangle=new T.Triangle();private closest=new T.Vector3();
 constructor(scene:T.Scene){
  // Alpha-cutout fern fronds are conservative collision surfaces, including
  // their small current envelope. Animals route around gaps rather than clip.
  scene.traverse(o=>{if(!(o instanceof T.Mesh)||o instanceof T.InstancedMesh)return;const materials=Array.isArray(o.material)?o.material:[o.material];if(!materials.some(m=>m.customProgramCacheKey().includes('scanned-fern-current')))return;
   const g=o.geometry,p=g.getAttribute('position'),idx=g.index,scale=new T.Vector3().setFromMatrixScale(o.matrixWorld).length();
   for(let i=0;i<(idx?.count??p.count);i+=3){const points=[0,1,2].map(j=>new T.Vector3().fromBufferAttribute(p,idx?idx.getX(i+j):i+j)),margin=.032*Math.max(...points.map(v=>Math.max(0,v.y)**2))*scale;points.forEach(v=>v.applyMatrix4(o.matrixWorld));const triangle=new T.Triangle(...points as [T.Vector3,T.Vector3,T.Vector3]),box=new T.Box3().setFromPoints(points).expandByScalar(margin),item={triangle,margin};
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
 nearby(p:T.Vector3,r:number){const found=new Set<PlantLeaf>();for(let x=Math.floor((p.x-r)/.5);x<=Math.floor((p.x+r)/.5);x++)for(let y=Math.floor((p.y-r)/.5);y<=Math.floor((p.y+r)/.5);y++)for(let z=Math.floor((p.z-r)/.5);z<=Math.floor((p.z+r)/.5);z++)for(const leaf of this.cells.get(`${x},${y},${z}`)||[])found.add(leaf);return found;}
 /** Body clearance, not just a point at the animal's feet. */
 clear(p:T.Vector3,n:T.Vector3,tangent:T.Vector3,snail:boolean,time:number,own?:PlantLeaf){
  const centers=(snail?[[-.04,.18,.145],[.12,.06,.055]]:[[-.15,.09,.064],[.035,.10,.066],[.13,.10,.048]]).map(([x,y,r])=>({p:p.clone().addScaledVector(tangent,x).addScaledVector(n,y),r}));
  const ferns=new Set<FernTriangle>();for(let x=Math.floor((p.x-.48)/.5);x<=Math.floor((p.x+.48)/.5);x++)for(let y=Math.floor((p.y-.48)/.5);y<=Math.floor((p.y+.48)/.5);y++)for(let z=Math.floor((p.z-.48)/.5);z<=Math.floor((p.z+.48)/.5);z++)for(const fern of this.ferns.get(`${x},${y},${z}`)||[])ferns.add(fern);
  for(const fern of ferns)for(const c of centers){fern.triangle.closestPointToPoint(c.p,this.closest);if(this.closest.distanceToSquared(c.p)<(c.r+fern.margin)**2)return false;}
  const stems=new Set<PlantStem>();for(let x=Math.floor((p.x-.48)/.5);x<=Math.floor((p.x+.48)/.5);x++)for(let y=Math.floor((p.y-.48)/.5);y<=Math.floor((p.y+.48)/.5);y++)for(let z=Math.floor((p.z-.48)/.5);z<=Math.floor((p.z+.48)/.5);z++)for(const stem of this.stems.get(`${x},${y},${z}`)||[])stems.add(stem);
  for(const stem of stems){const bend=(q:T.Vector3)=>{const h=Math.max(0,q.y-stem.root.y),phase=stem.root.x*.47+stem.root.z*.71;q.x+=(Math.sin(time*.82+phase)*.035+Math.sin(time*1.19+phase*1.7)*.013)*h*h*stem.flex*clamp((4.96-Math.abs(q.x))*2,0,1);q.z+=Math.sin(time*.67+phase+.8)*.029*h*h*stem.flex*clamp((2.20-Math.abs(q.z))*2,0,1);return q;};const line=new T.Line3(bend(stem.a.clone()),bend(stem.b.clone()));for(const c of centers){line.closestPointToPoint(c.p,true,this.closest);if(this.closest.distanceToSquared(c.p)<(c.r+stem.radius)**2)return false;}}
  for(const leaf of this.nearby(p,.48)){
   if(leaf===own)continue;
   if(!centers.some(c=>leaf.box.distanceToPoint(c.p)<c.r))continue;
   // Thin small leaves need only two triangles; large blades retain their cup
   // and arch in the contact mesh. This is collision data, never rendered LOD.
   const rows=leaf.length>.4?10:2,cols=leaf.width>.15?4:1,vertices:T.Vector3[]=[];
   for(let y=0;y<=rows;y++)for(let x=0;x<=cols;x++){const q=new T.Vector3();leafContact(leaf,x/cols,y/rows,time,q,this.normal);vertices.push(q);}
   for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){const k=y*(cols+1)+x;for(const ids of [[k,k+1,k+cols+1],[k+1,k+cols+2,k+cols+1]]){this.triangle.set(vertices[ids[0]],vertices[ids[1]],vertices[ids[2]]);for(const c of centers){this.triangle.closestPointToPoint(c.p,this.closest);if(this.closest.distanceToSquared(c.p)<c.r*c.r)return false;}}}
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
