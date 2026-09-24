import * as T from 'three';
import {reefPigmentNoise as noise} from './ReefMaterials.ts';
import {sandHeight} from './ReefOptics.ts';

/** Tiny attached sponge-like cups growing in irregular neighborhoods. Each
 * basal ring fits inside its real supporting triangle, so it cannot float
 * over a pore or bridge the mouth of a cave. No scene RNG or new material. */
export function rockMicroColonies(rocks:T.BufferGeometry[]){
 const palette=['#ee8a31','#eac86a','#69c6b9','#c377bf','#df638f'].map(c=>new T.Color(c));
 const positions:number[]=[],colors:number[]=[],uv:number[]=[],indices:number[]=[];
 const a=new T.Vector3(),b=new T.Vector3(),c=new T.Vector3(),center=new T.Vector3(),axis=new T.Vector3(),u=new T.Vector3(),v=new T.Vector3();
 const attachments:{center:number[];normal:number[];radius:number;inradius:number;rock:number}[]=[];
 for(let rock=0;rock<rocks.length;rock++){
  const p=rocks[rock].getAttribute('position'),idx=rocks[rock].index!;let count=0;
  // A coprime traversal distributes candidates over the whole rock without
  // changing its triangles or the established coral attachment bake.
  const faces=idx.count/3;
  for(let candidate=0;candidate<faces&&count<90;candidate++){
   const face=(candidate*7919+rock*503)%faces;
   a.fromBufferAttribute(p,idx.getX(face*3));b.fromBufferAttribute(p,idx.getX(face*3+1));c.fromBufferAttribute(p,idx.getX(face*3+2));
   center.copy(a).add(b).add(c).multiplyScalar(1/3);
   if(center.y<sandHeight(center.x,center.z)+.045)continue;
   axis.copy(b).sub(a).cross(v.copy(c).sub(a));const twiceArea=axis.length();axis.normalize();
   if(axis.y<-.35)continue;
   const patch=noise(center.x*6.8+37,center.y*6.8-19,center.z*6.8+11);
   if(patch<.60)continue;
   const inradius=twiceArea/(a.distanceTo(b)+b.distanceTo(c)+c.distanceTo(a));
   const radius=Math.min(.024,inradius*.75);
   if(radius<.006)continue;
   // The centroid's edge clearance is at least 2/3 of the inradius. Use an
   // incircle center to guarantee the full root stays on the source triangle.
   const wa=b.distanceTo(c),wb=a.distanceTo(c),wc=a.distanceTo(b);
   center.copy(a).multiplyScalar(wa).addScaledVector(b,wb).addScaledVector(c,wc).divideScalar(wa+wb+wc);
   u.copy(b).sub(a).normalize();v.crossVectors(axis,u).normalize();
   const phase=rock*1.91+face*.173,height=radius*(.75+.9*(.5+.5*Math.sin(phase))),aspect=.65+.30*(.5+.5*Math.cos(phase*1.7));
   const kind=noise(center.x*3.7-11,center.y*3.7+43,center.z*3.7+7),color=palette[Math.min(4,Math.floor(kind*5))];
   const start=positions.length/3;
   const append=(point:T.Vector3,shade:number)=>{positions.push(point.x,point.y,point.z);colors.push(color.r*shade,color.g*shade,color.b*shade);uv.push(point.x*12,point.z*12+point.y*12);};
   // Asymmetric rounded shoulders narrow to a recessed, off-center opening.
   for(let row=0;row<4;row++)for(let k=0;k<8;k++){
    const angle=k/8*Math.PI*2,r=radius*[1,.94,.46,.28][row],rise=[0,.57,1,.56][row];
    const lobe=row===0?1:1+.10*Math.sin(angle*3+phase);
    append(center.clone().addScaledVector(u,Math.cos(angle)*r*lobe+radius*.12*rise*Math.sin(phase)).addScaledVector(v,Math.sin(angle)*r*aspect*lobe).addScaledVector(axis,.0015+height*rise),[.76,1.15,1.28,.27][row]);
    if(row<3){const n=start+row*8+k,next=start+row*8+(k+1)%8;indices.push(n,next,n+8,next,next+8,n+8);}
   }
   const floor=positions.length/3;append(center.clone().addScaledVector(axis,.0015+height*.42),.14);
   for(let k=0;k<8;k++)indices.push(start+24+k,start+24+(k+1)%8,floor);
   attachments.push({center:center.toArray(),normal:axis.toArray(),radius,inradius,rock});count++;
  }
 }
 const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));geometry.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geometry.setIndex(indices);geometry.computeVertexNormals();
 return {geometry,attachments,stats:{cups:attachments.length,triangles:indices.length/3,rocks:new Set(attachments.map(a=>a.rock)).size}};
}
