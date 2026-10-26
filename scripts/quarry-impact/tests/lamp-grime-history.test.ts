import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readLampGrimePrevious,restoreLampGrimeBytes,verifyLampGrimeRevision} from './lamp-grime-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('LampGrime preserves every prior fixture, vehicle asset, venue art and history input',verifyLampGrimeRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/lamp-grime/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreLampGrimeBytes(file,bytes),readLampGrimePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreLampGrimeBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreLampGrimeBytes('src/unknown.ts',unknown),unknown);
});
