import {restoreDebeadBytes} from './debead-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRoofDuckPrevious,restoreRoofDuckBytes,verifyRoofDuckRevision} from './roof-duck-invariants';
const source=(file:string)=>restoreDebeadBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('RoofDuck preserves every prior fixture, vehicle asset, venue art and history input',verifyRoofDuckRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/roof-duck/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRoofDuckBytes(file,bytes),readRoofDuckPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRoofDuckBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRoofDuckBytes('src/unknown.ts',unknown),unknown);
});
