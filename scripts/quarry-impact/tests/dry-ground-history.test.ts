import {restorePuddleWaterBytes} from './puddle-water-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDryGroundPrevious,restoreDryGroundBytes,verifyDryGroundRevision} from './dry-ground-invariants';
const source=(file:string)=>restorePuddleWaterBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('DryGround preserves every prior fixture, vehicle asset, venue art and history input',verifyDryGroundRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/dry-ground/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDryGroundBytes(file,bytes),readDryGroundPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDryGroundBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDryGroundBytes('src/unknown.ts',unknown),unknown);
});
