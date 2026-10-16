import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {createFoundryIndustrial} from '../src/foundry-industrial';import {createFoundryWorld} from '../src/foundry-world';import {FOUNDRY_BARRIERS} from '../src/foundry-arena';
test('industrial landmarks stay beyond the arena, with bounded batches and triangle cost',()=>{
 const detail=createFoundryIndustrial();let batches=0,instances=0,triangles=0;const quadrants=new Set<string>();
 try{detail.root.updateMatrixWorld(true);detail.root.traverse(o=>{if(!(o instanceof T.InstancedMesh))return;batches++;instances+=o.count;triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3*o.count;
  o.geometry.computeBoundingBox();for(let i=0;i<o.count;i++){const m=new T.Matrix4();o.getMatrixAt(i,m);const box=o.geometry.boundingBox!.clone().applyMatrix4(m);assert.ok(box.max.x< -58||box.min.x>58||box.max.z< -50||box.min.z>50,o.name+' intrudes into driving area');const center=box.getCenter(new T.Vector3());if(center.x< -58)quadrants.add('west');if(center.x>58)quadrants.add('east');if(center.z< -50)quadrants.add('north');if(center.z>50)quadrants.add('south');}}
 );assert.equal(quadrants.size,4);assert.ok(instances>500);assert.ok(batches<=16);assert.ok(triangles<50000);console.log({batches,instances,triangles});}finally{detail.dispose();}
});
test('world keeps its collision records and releases every detail resource exactly once',()=>{
 const world=createFoundryWorld();assert.equal(world.root.userData.solidRecords,FOUNDRY_BARRIERS);const detail=world.root.getObjectByName('foundry_industrial_backdrop')!;assert.ok(detail);
 const resources=new Set<T.BufferGeometry|T.Material>();detail.traverse(o=>{if(o instanceof T.Mesh){resources.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])resources.add(m);}assert.equal(o.matrixAutoUpdate,false);});
 let disposed=0;for(const resource of resources)resource.addEventListener('dispose',()=>disposed++);world.dispose();world.dispose();assert.equal(disposed,resources.size);assert.equal(world.root.children.length,0);
});
