import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readLampDanglePrevious,restoreLampDangleBytes,verifyLampDangleRevision} from './lamp-dangle-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('LampDangle preserves every prior fixture, vehicle asset, venue art and history input',verifyLampDangleRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/lamp-dangle/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreLampDangleBytes(file,bytes),readLampDanglePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreLampDangleBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreLampDangleBytes('src/unknown.ts',unknown),unknown);
});
