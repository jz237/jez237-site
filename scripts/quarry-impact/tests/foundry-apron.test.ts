import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';import {createFoundryIndustrial} from '../src/foundry-industrial';import {foundryHeight} from '../src/foundry-arena';
test('outer apron closes the original ground edge and supports the industrial backdrop',()=>{
 const detail=createFoundryIndustrial();try{const apron=detail.root.getObjectByName('foundry_outer_apron')as T.Mesh;assert.ok(apron);const p=apron.geometry.getAttribute('position');let boundary=0;
 for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i),edge=Math.max(Math.abs(x),Math.abs(z));assert.ok(Number.isFinite(p.getY(i)));if(edge<=80){assert.ok(Math.abs(p.getY(i)-(foundryHeight(x,z)-.03))<1e-5);if(edge===80)boundary++;}}
 const index=apron.geometry.index!;for(let i=0;i<index.count;i+=3)assert.ok([index.getX(i),index.getX(i+1),index.getX(i+2)].some(id=>Math.max(Math.abs(p.getX(id)),Math.abs(p.getZ(id)))>80),'no backdrop triangles overlap existing terrain');
 assert.ok(boundary>100);apron.geometry.computeBoundingBox();assert.equal(apron.geometry.boundingBox!.min.x,-160);assert.equal(apron.geometry.boundingBox!.max.z,160);
 }finally{detail.dispose();}
});
