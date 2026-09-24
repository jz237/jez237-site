import * as T from 'three';

/** Rounded axial corallite with a recessed calice. Copy the actual end ring
 * instead of putting a disconnected hemisphere on an irregular branch. */
export function axialCorallite(tube:T.TubeGeometry,tipColor:T.Color,terminal:boolean){
 const {radialSegments:s,tubularSegments:steps,path}=tube.parameters,p=tube.getAttribute('position'),c=tube.getAttribute('color');
 const center=path.getPointAt(1),axis=path.getTangentAt(1),positions:number[]=[],colors:number[]=[],uv:number[]=[],indices:number[]=[];
 const radial=[1,terminal?1.04:.91,.64,.32],height=[0,.40,.94,.64],offset=steps*(s+1),v=new T.Vector3();
 let radius=0;for(let k=0;k<s;k++)radius+=v.fromBufferAttribute(p,offset+k).distanceTo(center);radius/=s;
 for(let row=0;row<4;row++)for(let k=0;k<=s;k++){
  v.fromBufferAttribute(p,offset+k).sub(center).multiplyScalar(radial[row]).add(center).addScaledVector(axis,height[row]*radius);
  positions.push(v.x,v.y,v.z);const base=new T.Color().fromBufferAttribute(c,offset+k);
  const color=row===0?base:base.lerp(tipColor,row===2?.96:row===1?.55:.35).multiplyScalar(row===3?.62:1);
  colors.push(color.r,color.g,color.b);uv.push(k/s,1-row*.16);
  if(row<3&&k<s){const a=row*(s+1)+k,b=a+s+1;indices.push(a,b,a+1,a+1,b,b+1);}
 }
 const top=positions.length/3;v.copy(center).addScaledVector(axis,radius*.59);positions.push(v.x,v.y,v.z);
 const color=tipColor.clone().multiplyScalar(.39);colors.push(color.r,color.g,color.b);uv.push(.5,.34);
 for(let k=0;k<s;k++){const a=3*(s+1)+k;indices.push(a,top,a+1);}
 const cap=new T.BufferGeometry();cap.name='Axial corallite';cap.setAttribute('position',new T.Float32BufferAttribute(positions,3));cap.setAttribute('color',new T.Float32BufferAttribute(colors,3));cap.setAttribute('uv',new T.Float32BufferAttribute(uv,2));cap.setIndex(indices);return cap;
}

/** Widen existing rings around real child insertions. No extra triangles or
 * per-frame work: the skeleton stays rigid and the connected skin shares normals. */
export function finishBranch(tube:T.TubeGeometry,cap:T.BufferGeometry,junctions:number[]){
 const {radialSegments:s,tubularSegments:steps,path}=tube.parameters,p=tube.getAttribute('position'),v=new T.Vector3();
 for(let row=1;row<steps;row++){
  const t=row/steps,center=path.getPointAt(t);let collar=0;
  for(const joint of junctions)collar+=Math.exp(-(((t-joint)/.105)**2));
  const scale=1+Math.min(.24,collar*.19)*Math.sin(Math.PI*t);
  for(let k=0;k<=s;k++){const i=row*(s+1)+k;v.fromBufferAttribute(p,i).sub(center).multiplyScalar(scale).add(center);p.setXYZ(i,v.x,v.y,v.z);}
 }
 tube.computeVertexNormals();cap.computeVertexNormals();const tn=tube.getAttribute('normal'),cn=cap.getAttribute('normal');
 for(const [n,rows] of [[tn,steps+1],[cn,4]] as const)for(let row=0;row<rows;row++){
  const a=row*(s+1),b=a+s;v.fromBufferAttribute(n,a).add(new T.Vector3().fromBufferAttribute(n,b)).normalize();n.setXYZ(a,v.x,v.y,v.z);n.setXYZ(b,v.x,v.y,v.z);
 }
 for(let k=0;k<=s;k++){
  const i=steps*(s+1)+k;v.fromBufferAttribute(tn,i).add(new T.Vector3().fromBufferAttribute(cn,k)).normalize();tn.setXYZ(i,v.x,v.y,v.z);cn.setXYZ(k,v.x,v.y,v.z);
 }
}


/** Sample the actual indexed tube skin, including its swollen junctions. The
 * triangle interpolation keeps a cup's footprint attached between axial rings. */
function skinPoint(tube:T.TubeGeometry,t:number,angle:number){
 const {radialSegments:s,tubularSegments:steps}=tube.parameters,p=tube.getAttribute('position');
 const row=Math.min(steps-1,Math.floor(t*steps)),u=t*steps-row,turn=((angle/(Math.PI*2))%1+1)%1*s,k=Math.floor(turn),v=turn-k,a=row*(s+1)+k,b=a+s+1,d=a+1,c=b+1;
 const out=new T.Vector3(),point=new T.Vector3();
 for(const [index,weight] of u+v<=1?[[a,1-u-v],[b,u],[d,v]]:[[b,1-v],[c,u+v-1],[d,1-u]])out.addScaledVector(point.fromBufferAttribute(p,index),weight);
 return out;
}

/** Small projecting side cups, including the fine branchlets. Fine branchlet lips
 * use six segments and broad stem cups retain eight; existing maps retain fine tissue and septal detail. */
export function radialCorallites(tube:T.TubeGeometry,level:number,seed:number,base:T.Color,tip:T.Color){
 const result:T.BufferGeometry[]=[],count=level===0?10:level===1?5:4,{path}=tube.parameters,length=path.getLength();
 for(let i=0;i<count;i++){
  // Staggered projecting cups interrupt the smooth twig silhouette. Unequal
  // lip heights and elliptical mouths avoid identical round buttons. This
  // deterministic local pattern does not reshuffle later scene organisms.
  const t=.14+i/count*.73+.012*Math.sin(seed*1.7+i*2.3),angle=seed+i*2.399+.21*Math.sin(i*3.7+seed);
  const center=skinPoint(tube,t,angle),axis=path.getTangentAt(t),out=center.clone().sub(path.getPointAt(t)).normalize(),radius=center.distanceTo(path.getPointAt(t)),r=radius*(.38+.07*Math.sin(seed+i*1.9)),rise=r*(1.35+.25*Math.sin(seed*1.3+i));
  const across=new T.Vector3().crossVectors(axis,out).normalize(),positions:number[]=[],colors:number[]=[],uv:number[]=[],indices:number[]=[],sides=level<2?8:6;
  // Tube rings wind opposite to the path tangent; sample their actual skin.
  for(let row=0;row<3;row++)for(let k=0;k<=sides;k++){
   const a=k/sides*Math.PI*2,rr=r*[1,.81,.42][row],elongation=1.18;let point:T.Vector3;
   if(row===0)point=skinPoint(tube,t+Math.sin(a)*r*elongation/length,angle-Math.cos(a)*r/radius);
   else point=center.clone().addScaledVector(across,Math.cos(a)*rr).addScaledVector(axis,Math.sin(a)*rr*elongation+rise*.32).addScaledVector(out,rise*(row===1?1+.17*Math.sin(a):.58));
   positions.push(point.x,point.y,point.z);const color=base.clone().lerp(tip,row===1?.56:.08).multiplyScalar(row===2?.59:1);colors.push(color.r,color.g,color.b);uv.push(k/sides,row*.33);
   if(row<2&&k<sides){const n=row*(sides+1)+k,b=n+sides+1;indices.push(n,n+1,b,n+1,b+1,b);}
  }
  const end=positions.length/3,point=center.clone().addScaledVector(axis,rise*.28).addScaledVector(out,rise*.55);positions.push(point.x,point.y,point.z);const dark=base.clone().multiplyScalar(.51);colors.push(dark.r,dark.g,dark.b);uv.push(.5,1);
  for(let k=0;k<sides;k++){const n=2*(sides+1)+k;indices.push(n,n+1,end);}
  const cup=new T.BufferGeometry();cup.name='Radial corallite';cup.setAttribute('position',new T.Float32BufferAttribute(positions,3));cup.setAttribute('color',new T.Float32BufferAttribute(colors,3));cup.setAttribute('uv',new T.Float32BufferAttribute(uv,2));cup.setIndex(indices);cup.computeVertexNormals();const n=cup.getAttribute('normal'),smooth=new T.Vector3();
  for(let row=0;row<3;row++){const a=row*(sides+1),b=a+sides;smooth.fromBufferAttribute(n,a).add(new T.Vector3().fromBufferAttribute(n,b)).normalize();n.setXYZ(a,smooth.x,smooth.y,smooth.z);n.setXYZ(b,smooth.x,smooth.y,smooth.z);}
  result.push(cup);
 }
 return result;
}
