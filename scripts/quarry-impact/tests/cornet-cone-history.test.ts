import {restoreFeatureBadgesBytes} from './feature-badges-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readCornetConePrevious,restoreCornetConeBytes,verifyCornetConeRevision} from './cornet-cone-invariants';
const source=(file:string)=>restoreFeatureBadgesBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('CornetCone preserves every prior fixture, vehicle asset, venue art and history input',verifyCornetConeRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/cornet-cone/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreCornetConeBytes(file,bytes),readCornetConePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreCornetConeBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreCornetConeBytes('src/unknown.ts',unknown),unknown);
});
