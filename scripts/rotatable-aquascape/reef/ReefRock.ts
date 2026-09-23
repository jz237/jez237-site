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
 const phase=x*2.31+y*3.17+z*1.73;
 for(let i=0;i<p.count;i++){
  const a=p.getX(i),b=p.getY(i),c=p.getZ(i);
  let n=1+.095*Math.sin(a*5+c*3+phase)*Math.cos(b*6-a*2+phase*.7)
   +.055*Math.sin(c*13+b*9-phase)*Math.sin(a*11-b*4)
   +.022*Math.sin(a*37+c*29+phase)*Math.cos(b*33-phase);
  // Eroded seams break smooth egg-shaped silhouettes without expanding bounds.
  n-=.065*Math.pow(.5+.5*Math.sin(a*7+b*3+c*5+phase),6);
  for(const pore of pores){
   const d=((a-pore.a)**2+(b-pore.b)**2+(c-pore.c)**2)/(pore.r*pore.r);
   if(d<1)n-=pore.depth*Math.pow(1-d,1.45);
  }
  n=Math.max(.50,n);p.setXYZ(i,a*n*sx+x,b*n*sy+y,c*n*sz+z);
 }
 geometry.computeVertexNormals();return geometry;
}
