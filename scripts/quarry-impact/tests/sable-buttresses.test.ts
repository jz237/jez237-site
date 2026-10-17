import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {sableCliffHeight,createSableLandscape} from '../src/sable-landscape';import {SABLE} from '../src/sable-course';
test('cliff roots join the driving terrain and retain an open southern valley',()=>{
 let north=0,south=0;const rises:number[]=[];
 for(let i=0;i<96;i++){
  const angle=i/96*Math.PI*2,dx=Math.cos(angle),dz=Math.sin(angle),edge=1/Math.max(Math.abs(dx)/220,Math.abs(dz)/180);
  assert.ok(Math.abs(sableCliffHeight(dx*edge,dz*edge)-(SABLE.height(dx*edge,dz*edge)-.06))<1e-8);
  const base=sableCliffHeight(dx*edge,dz*edge);let rise=0;
  for(let distance=0;distance<=265;distance+=2){const height=sableCliffHeight(dx*(edge+distance),dz*(edge+distance));assert.ok(Number.isFinite(height));assert.ok(height> -5&&height<130);if(!rise&&height-base>15)rise=distance;}
  if(dz>.5){north+=sableCliffHeight(dx*(edge+70),dz*(edge+70));rises.push(rise);}
  if(dz< -.5)south+=sableCliffHeight(dx*(edge+70),dz*(edge+70));
 }
 assert.ok(north>south*1.5);assert.ok(Math.max(...rises)-Math.min(...rises)>14,'distinct cliff setbacks around the enclosed section');
});
test('new shape retains topology, finite normals, and a closed azimuth seam',()=>{
 const landscape=createSableLandscape();try{const mesh=landscape.root.children[0] as T.Mesh,p=mesh.geometry.attributes.position,n=mesh.geometry.attributes.normal;
  assert.equal(p.count,20790);assert.ok(n.array.every(Number.isFinite));
  for(let ring=0;ring<54;ring++){const a=ring*385,b=a+384;assert.ok(Math.hypot(p.getX(a)-p.getX(b),p.getY(a)-p.getY(b),p.getZ(a)-p.getZ(b))<1e-4);}
 }finally{landscape.dispose();}
});
