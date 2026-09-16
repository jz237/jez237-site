import test from 'node:test';
import assert from 'node:assert/strict';
import {registerHooks} from 'node:module';
registerHooks({resolve(s,c,n){try{return n(s,c)}catch(e){if(s.startsWith('.'))return n(s+'.ts',c);throw e}},load(u,c,n){if(u.endsWith('/LeafSurface.ts'))return {format:'module',shortCircuit:true,source:'export function leafSurfaceMaps(){return {color:null,bump:null,roughness:null}}'};return n(u,c)}});
const T=await import('three');
const {buildBotanicalPlants}=await import('../lib/BotanicalPlants.ts');
const {GrazerPlants,leafContact,leafCollisionSampler}=await import('../lib/GrazerPlants.ts');
test('shared leaf sampling preserves every contact point across species, motion and transforms',()=>{
 const scene=new T.Scene();buildBotanicalPlants(scene,()=>.4,{value:0});scene.updateMatrixWorld();const plants=new GrazerPlants(scene),species=new Map();
 for(const leaf of plants.leaves)if(!species.has(leaf.mesh.userData.plantSpecies))species.set(leaf.mesh.userData.plantSpecies,leaf);
 let points=0;const reference=new T.Vector3(),normal=new T.Vector3();
 for(const leaf of species.values())for(const [rows,cols] of [[2,1],[10,1],[2,4],[10,4]]){
  const vertices=Array.from({length:(rows+1)*(cols+1)},()=>new T.Vector3()),sample=leafCollisionSampler(leaf,rows,cols,vertices);
  for(const time of [0,.13,1.7,9.2,130]){
   sample(time);
   for(let y=0;y<=rows;y++)for(let x=0;x<=cols;x++){
    leafContact(leaf,x/cols,y/rows,time,reference,normal);
    assert.deepEqual(vertices[y*(cols+1)+x].toArray(),reference.toArray());points++;
   }
  }
 }
 assert.equal(species.size,8);assert.ok(points>3000);
});
