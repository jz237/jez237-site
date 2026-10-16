import assert from 'node:assert/strict';import * as T from 'three';import {createReservoirShore} from '../src/reservoir-shore';import test from 'node:test';import {readReservoirWoodlandPrevious} from './reservoir-woodland-invariants';
test('clustered woodland preserves terrain and grounds every tree',async()=>{
const ts=await import('typescript');const previousSource=readReservoirWoodlandPrevious('src/reservoir-shore.ts').toString().replace("from 'three'","from '"+import.meta.resolve('three')+"'");const code=ts.transpileModule(previousSource,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;const {createReservoirShore:oldShore}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));

const current=createReservoirShore(),old=oldShore(),hill=current.root.children.find(o=>o instanceof T.Mesh) as T.Mesh,previous=old.root.children.find(o=>o instanceof T.Mesh) as T.Mesh;
for(const name of ['position','color','normal'])assert.deepEqual(hill.geometry.getAttribute(name).array,previous.geometry.getAttribute(name).array);assert.deepEqual(hill.geometry.index!.array,previous.geometry.index!.array);
hill.updateMatrixWorld(true);const ray=new T.Raycaster(),trees=current.root.userData.trees;assert.ok(trees.length>750&&trees.length<=1000);
for(const tree of trees){assert.ok([tree.x,tree.y,tree.z,tree.size].every(Number.isFinite));assert.ok(tree.z>430&&tree.size>=12&&tree.size<=28);ray.set(new T.Vector3(tree.x,100,tree.z),new T.Vector3(0,-1,0));const hit=ray.intersectObject(hill)[0];assert.ok(hit);assert.ok(Math.abs(hit.point.y-tree.y)<1e-6);}
let disposed=0;hill.geometry.addEventListener('dispose',()=>disposed++);current.dispose();current.dispose();assert.equal(disposed,1);old.dispose();console.log(JSON.stringify({trees:trees.length,previousTrees:old.root.userData.trees.length,terrainUnchanged:true,allTreeBasesOnActualMesh:true,minimumZ:Math.min(...trees.map((t:any)=>t.z)),idempotentDisposal:true}));

});
