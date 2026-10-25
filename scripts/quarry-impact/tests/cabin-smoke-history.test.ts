import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readCabinSmokePrevious,restoreCabinSmokeBytes,verifyCabinSmokeRevision} from './cabin-smoke-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('CabinSmoke preserves every prior fixture, vehicle asset, venue art and history input',verifyCabinSmokeRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/cabin-smoke/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreCabinSmokeBytes(file,bytes),readCabinSmokePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreCabinSmokeBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreCabinSmokeBytes('src/unknown.ts',unknown),unknown);
});
