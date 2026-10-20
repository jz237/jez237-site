import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readSmashedLampsPrevious,restoreSmashedLampsBytes,verifySmashedLampsRevision} from './smashed-lamps-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('SmashedLamps preserves every prior fixture, vehicle asset, venue art and history input',verifySmashedLampsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/smashed-lamps/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreSmashedLampsBytes(file,bytes),readSmashedLampsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreSmashedLampsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreSmashedLampsBytes('src/unknown.ts',unknown),unknown);
});
