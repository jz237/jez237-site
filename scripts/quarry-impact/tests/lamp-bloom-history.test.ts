import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readLampBloomPrevious,restoreLampBloomBytes,verifyLampBloomRevision} from './lamp-bloom-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('LampBloom preserves every prior fixture, vehicle asset, venue art and history input',verifyLampBloomRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/lamp-bloom/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreLampBloomBytes(file,bytes),readLampBloomPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreLampBloomBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreLampBloomBytes('src/unknown.ts',unknown),unknown);
});
