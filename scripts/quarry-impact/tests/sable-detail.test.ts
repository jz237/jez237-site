import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {readFileSync} from 'node:fs';
import {createSableWorld} from '../src/sable-world';
import {SABLE} from '../src/sable-course';
test('detailed Sable integrates the landscape, venue and landmarks without freezing gameplay markers',async()=>{
 let ready=0;const world=createSableWorld(()=>ready++),marker=new T.Group();world.root.add(marker);
 await world.ready;assert.equal(ready,1);assert.equal(marker.matrixAutoUpdate,true);assert.equal(marker.matrixWorldAutoUpdate,true);
 for(const name of ['sable-continuous-canyon','sable-quarry-landmarks','sable-detailed-paddock'])assert.ok(world.root.getObjectByName(name));
 const matrix=new T.Matrix4();let nearest=Infinity;
 world.root.traverse(o=>{if(!(o instanceof T.InstancedMesh)||!o.name.startsWith('quarry-plant-'))return;o.geometry.computeBoundingBox();for(let i=0;i<o.count;i++){o.getMatrixAt(i,matrix);matrix.premultiply(o.matrixWorld);const b=o.geometry.boundingBox!.clone().applyMatrix4(matrix);for(let x=b.min.x;x<=b.max.x+.5;x+=.5)for(let z=b.min.z;z<=b.max.z+.5;z+=.5)nearest=Math.min(nearest,SABLE.distance(x,z)-Math.SQRT1_2);}});
 assert.ok(nearest>20);world.dispose();world.dispose();
});
test('disposed Sable does not notify or reattach after pending scenery completes',async()=>{let callbacks=0;const world=createSableWorld(()=>callbacks++);world.dispose();await world.ready;assert.equal(callbacks,0);assert.equal(world.root.children.length,0);});
test('parked scenery GLBs have bounded geometry and preserve distinct car models',()=>{
 for(const kind of ['coupe','hatch','sedan']){
 const bytes=readFileSync(new URL('../public/models/scenery/'+kind+'-parked.glb',import.meta.url));assert.equal(bytes.readUInt32LE(0),0x46546c67);assert.equal(bytes.readUInt32LE(8),bytes.length);
 const gltf=JSON.parse(bytes.subarray(20,20+bytes.readUInt32LE(12)).toString());let triangles=0;
 for(const mesh of gltf.meshes)for(const p of mesh.primitives){assert.equal(p.mode??4,4);triangles+=(gltf.accessors[p.indices??p.attributes.POSITION].count)/3;}
 assert.ok(triangles>1000&&triangles<25000,kind+' '+triangles);assert.ok(gltf.materials.length>5);
 }
});
