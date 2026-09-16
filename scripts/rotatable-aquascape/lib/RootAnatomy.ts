import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

const V=(x=0,y=0,z=0)=>new T.Vector3(x,y,z);
export type RootBranch={curve:T.CatmullRomCurve3;radius:number;parent:number;attachment:number;order:number};
export function rootBranches(seed=733):RootBranch[]{
 const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const branches:RootBranch[]=[];
 for(let i=0;i<19;i++){
  const side=i%2?1:-1,reach=(.18+random()*.95)*side,depth=.75+random()*.9;
  const start=V((random()-.5)*.12,0,(random()-.5)*.10);
  const bend=(random()-.5)*.48,phase=random()*6,spreadPower=.65+random()*1.25,dropPower=.75+random()*.9;
  const curve=new T.CatmullRomCurve3(Array.from({length:9},(_,j)=>{const t=j/8;return V(start.x*(1-t)+reach*Math.pow(t,spreadPower)+bend*Math.sin(t*Math.PI)+.065*Math.sin(t*11+phase)*Math.sin(t*Math.PI),-depth*Math.pow(t,dropPower),.03+start.z*(1-t)+.065*t+.045*Math.sin(t*9+phase)*Math.sin(t*Math.PI));}));
  const parent=branches.length;branches.push({curve,radius:.016+random()*.012,parent:-1,attachment:0,order:0});
  for(let j=0;j<8;j++){
   const t=.14+j*.10+random()*.065,point=curve.getPoint(t),spread=(.16+random()*.40)*(j%2?1:-1),drop=.07+random()*.28;
   const lateral=new T.CatmullRomCurve3([point,point.clone().add(V(spread*.2,-drop*.35,.018)),point.clone().add(V(spread*.63,-drop*.48-.035*Math.sin(i+j),-.012)),point.clone().add(V(spread,-drop,(random()-.5)*.09))]);
   const index=branches.length;branches.push({curve:lateral,radius:.004+random()*.0025,parent,attachment:t,order:1});
   for(let k=0;k<3;k++){
    const at=.28+k*.22,p=lateral.getPoint(at),dx=(random()-.5)*.20;
    branches.push({curve:new T.CatmullRomCurve3([p,p.clone().add(V(dx*.6,-.055,.012)),p.clone().add(V(dx,-.10-random()*.07,(random()-.5)*.05))]),radius:.0016+random()*.0008,parent:index,attachment:at,order:2});
   }
  }
 }
 return branches;
}
export function taperedRoot(branch:RootBranch){
 const segments=branch.order===0?28:branch.order===1?12:6,sides=branch.order===0?7:5;
 const g=new T.TubeGeometry(branch.curve,segments,1,sides,false),p=g.getAttribute('position'),color:number[]=[];
 for(let j=0;j<=segments;j++){
  const t=j/segments,center=branch.curve.getPointAt(t),radius=branch.radius*(.10+.90*Math.pow(1-t,.72));
  for(let k=0;k<=sides;k++){
   const index=j*(sides+1)+k,point=V().fromBufferAttribute(p,index).sub(center).multiplyScalar(radius).add(center);p.setXYZ(index,point.x,point.y,point.z);
   const shade=.84+.12*t+.025*Math.sin(j*1.7+k);color.push(shade,shade*.91,shade*.72);
  }
 }
 g.setAttribute('color',new T.Float32BufferAttribute(color,3));g.computeVertexNormals();return g;
}
/** Shared root anatomy for the cutaway, root specimen and separated tank layers. */
export function buildRootSystem(seed=733){
 const group=new T.Group(),branches=rootBranches(seed),pieces=branches.map(taperedRoot),geometry=mergeGeometries(pieces)!;pieces.forEach(g=>g.dispose());
 const mat=new T.MeshStandardMaterial({color:0xdacdae,vertexColors:true,roughness:.78});
 const roots=new T.Mesh(geometry,mat);group.add(roots);
 const hairs:number[]=[];
 branches.forEach((branch,i)=>{if(branch.order===0)return;for(let j=0;j<5;j++){
  const t=.2+j*.14,p=branch.curve.getPoint(t),a=i*2.399+j*1.5,length=.016+.007*Math.sin(i+j);
  hairs.push(p.x,p.y,p.z,p.x+Math.cos(a)*length,p.y-.012,p.z+Math.sin(a)*length);
 }});
 const hairMesh=new T.LineSegments(new T.BufferGeometry().setAttribute('position',new T.Float32BufferAttribute(hairs,3)),new T.LineBasicMaterial({color:0xc6b68f,transparent:true,opacity:.48}));group.add(hairMesh);
 group.userData.rootTemplate=true;return group;
}

/** Unfolded exposure wraps continuously around both corners of the soil slice.
 * Apply the same mapping to branches and hairs so no roots become detached. */
export function wrapCutawayRoots(group:T.Group,crown:T.Vector3,width:number,height:number){
 group.traverse(object=>{
  if(!(object instanceof T.Mesh||object instanceof T.Line))return;
  const g=object.geometry,p=g.getAttribute('position');
  for(let i=0;i<p.count;i++){
   const x=crown.x+p.getX(i)*width,overflow=Math.max(0,Math.abs(x)-2.48);
   p.setXYZ(i,T.MathUtils.clamp(x,-2.48,2.48)+Math.sign(x)*overflow*.025,
    crown.y+p.getY(i)*height,1.07+p.getZ(i)*.40-overflow);
  }
  if(object instanceof T.Mesh)g.computeVertexNormals();
  g.computeBoundingBox();g.computeBoundingSphere();
 });
 return group;
}
