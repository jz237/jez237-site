import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readWiperArcsPrevious,restoreWiperArcsBytes,verifyWiperArcsRevision} from './wiper-arcs-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('WiperArcs preserves every prior fixture, vehicle asset, venue art and history input',verifyWiperArcsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/wiper-arcs/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreWiperArcsBytes(file,bytes),readWiperArcsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreWiperArcsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreWiperArcsBytes('src/unknown.ts',unknown),unknown);
});
