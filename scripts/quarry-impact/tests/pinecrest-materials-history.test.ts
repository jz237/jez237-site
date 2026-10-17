import {restoreConiferSprayBytes} from './conifer-spray-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readPinecrestMaterialsPrevious,restorePinecrestMaterialsBytes,verifyPinecrestMaterialsRevision} from './pinecrest-materials-invariants';
const source=(file:string)=>restoreConiferSprayBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('PinecrestMaterials preserves every prior fixture, vehicle asset, control and camera input',verifyPinecrestMaterialsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/pinecrest-materials/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restorePinecrestMaterialsBytes(file,bytes),readPinecrestMaterialsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restorePinecrestMaterialsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restorePinecrestMaterialsBytes('src/unknown.ts',unknown),unknown);
});
