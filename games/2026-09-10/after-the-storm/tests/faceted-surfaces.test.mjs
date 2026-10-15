import test from 'node:test';
import assert from 'node:assert/strict';
import {facetedSurface,surfaceMeshPositions} from '../faceted-surfaces.js';

const triangles=[[[11,1,-1],[13,3,-1],[11,2,1]],[[13,3,-1],[13,4,1],[11,2,1]]];
const close=(a,b,tolerance=1e-6)=>assert.ok(Math.abs(a-b)<tolerance,`${a} != ${b}`);

test('inclined facets interpolate height across spatial bins and share finite edges',()=>{
 const p=facetedSurface('inclined',triangles);
 for(const [x,z] of [[11,-1],[13,1],[12,0],[11.5,.5],[12.5,-.5]]){
  const q=p.sample(x,z);assert.ok(q);close(q.height,1+(x-11)+(z+1)/2);close(q.sx,1);close(q.sz,.5);
 }
 assert.equal(p.heightAt(10.99,0),null);assert.equal(p.heightAt(13.01,0),null);assert.equal(p.heightAt(12,1.01),null);
});
test('independent scenery tessellation lies on collision planes with bounded edge lengths',()=>{
 const maxEdge=.6,vertices=surfaceMeshPositions(triangles,maxEdge);
 assert.ok(vertices instanceof Float32Array&&vertices.length>18);
 for(let i=0;i<vertices.length;i+=9){
  const points=[...Array(3)].map((_,j)=>Array.from(vertices.slice(i+j*3,i+j*3+3)));
  for(const [x,y,z]of points)close(y,1+(x-11)+(z+1)/2,2e-6);
  for(let j=0;j<3;j++)assert.ok(Math.hypot(...points[j].map((v,k)=>v-points[(j+1)%3][k]))<=maxEdge+2e-6);
 }
});
test('degenerate vertical triangles require the separate wall-contact path',()=>{
 assert.throws(()=>facetedSurface('wall',[[[0,0,0],[0,1,0],[0,0,1]]]),/Degenerate/);
});
