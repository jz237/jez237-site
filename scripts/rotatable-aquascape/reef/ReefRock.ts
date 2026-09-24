import * as T from 'three';
import {mergeVertices} from 'three/addons/utils/BufferGeometryUtils.js';

/** Volumetric eroded stone; cavities are geometry, not painted dark circles. */
export function erodedRock(x:number,y:number,z:number,sx:number,sy:number,sz:number,random:()=>number){
 const pick=(a:number,b:number)=>a+(b-a)*random();
 const original=new T.IcosahedronGeometry(1,22);original.deleteAttribute('normal');
 const geometry=mergeVertices(original),p=geometry.getAttribute('position');original.dispose();
 // Keep the random draw count stable so changing the rock does not reshuffle coral.
 const pores=Array.from({length:31},()=>{
  const theta=pick(0,Math.PI*2),vertical=pick(-.93,.93),horizontal=Math.sqrt(1-vertical*vertical);
  return {a:Math.cos(theta)*horizontal,b:vertical,c:Math.sin(theta)*horizontal,r:pick(.13,.30),depth:pick(.13,.31)};
 });
 const phase=x*2.31+y*3.17+z*1.73,cavities=new Float32Array(p.count);
 const chambers=pores.map((p,j)=>({...p,ca:Math.cos(phase+j*2.39996),sa:Math.sin(phase+j*2.39996),aspect:.65+.25*(.5+.5*Math.sin(j*3.71+phase)),strength:1.15+.25*Math.sin(j*2.1+phase)}));
 // Smaller, uneven borings interrupt the smooth spaces between major cavities.
 // A separate deterministic spherical distribution preserves the scene stream.
 const borings=Array.from({length:89},(_,j)=>{
  const b=1-2*(j+.5)/89,angle=j*2.399963+phase,h=Math.sqrt(1-b*b);
  return {a:h*Math.cos(angle),b,c:h*Math.sin(angle),r:.075+.065*(.5+.5*Math.sin(j*3.73+phase)),depth:.035+.065*(.5+.5*Math.cos(j*2.31-phase))};
 });
 // Broad phase only: each cell contains every boring whose bounding box
 // touches it. The exact curved profile below is unchanged at cell seams.
 const cell=(v:number)=>Math.max(0,Math.min(8,Math.floor((v+1)*4)));
 const boringCells=Array.from({length:729},()=>[] as typeof borings);
 for(const hole of borings)for(let i=cell(hole.a-hole.r);i<=cell(hole.a+hole.r);i++)
  for(let j=cell(hole.b-hole.r);j<=cell(hole.b+hole.r);j++)
   for(let k=cell(hole.c-hole.r);k<=cell(hole.c+hole.r);k++)boringCells[i+j*9+k*81].push(hole);
 for(let i=0;i<p.count;i++){
  const a=p.getX(i),b=p.getY(i),c=p.getZ(i);
  let n=1+.095*Math.sin(a*5+c*3+phase)*Math.cos(b*6-a*2+phase*.7)
   +.055*Math.sin(c*13+b*9-phase)*Math.sin(a*11-b*4)
   +.022*Math.sin(a*37+c*29+phase)*Math.cos(b*33-phase);
  // Dissolution follows intersecting weak layers. Broad cutaways interrupt the
  // round boulder envelope; narrow flutes remain part of the same sealed mesh.
  const seam=.5+.5*Math.sin(a*7+b*3+c*5+phase);
  const cross=.5+.5*Math.sin(a*3-b*6+c*4-phase*.7);
  n-=.15*Math.pow(seam,6)+.10*Math.pow(cross,8);
  let erosion=0;
  for(const pore of chambers){
   const dx=a-pore.a,dy=b-pore.b,dz=c-pore.c,ca=pore.ca,sa=pore.sa;
   // Both chambers fit inside 1.34r. Most surface vertices are far outside;
   // reject those before evaluating the rotated asymmetric cavity profile.
   if(dx*dx+dy*dy+dz*dz>pore.r*pore.r*1.8)continue;
   // Asymmetric connected chambers, not identical circular dimples. These
   // use no extra scene random numbers, preserving every coral placement seed.
   const u=(dx*ca+dz*sa)/pore.r,v=dy/pore.r,w=(-dx*sa+dz*ca)/pore.r;
   const aspect=pore.aspect;
   const d=u*u+v*v/(aspect*aspect)+w*w;
   const chamber=(u-.28)*(u-.28)*1.6+(v+.17)*(v+.17)*1.5+w*w;
   const field=Math.min(d,chamber);
   if(field<1){const t=1-field,lip=t*t*(3-2*t);erosion+=pore.depth*lip*pore.strength;}
  }
  let fineErosion=0;
  for(const hole of boringCells[cell(a)+cell(b)*9+cell(c)*81]){
   const d=((a-hole.a)**2+(b-hole.b)**2+(c-hole.c)**2)/(hole.r*hole.r);
   if(d<1){const t=1-d;fineErosion+=hole.depth*t*t*(3-2*t);}
  }
  n-=erosion+fineErosion;cavities[i]=Math.min(1,erosion*2.8+fineErosion*4+Math.pow(seam,6)*.2);
  n=Math.max(.50,n);p.setXYZ(i,a*n*sx+x,b*n*sy+y,c*n*sz+z);
 }
 // Temporary bake input: consumed by encrustRock, never sent to the GPU.
 geometry.setAttribute('rockCavity',new T.BufferAttribute(cavities,1));
 geometry.computeVertexNormals();return geometry;
}
