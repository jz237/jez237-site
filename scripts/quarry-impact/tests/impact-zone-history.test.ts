import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readImpactZonePrevious,restoreImpactZoneBytes,verifyImpactZoneRevision} from './impact-zone-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('ImpactZone preserves every prior fixture, vehicle asset, venue art and history input',verifyImpactZoneRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/impact-zone/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreImpactZoneBytes(file,bytes),readImpactZonePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreImpactZoneBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreImpactZoneBytes('src/unknown.ts',unknown),unknown);
});
