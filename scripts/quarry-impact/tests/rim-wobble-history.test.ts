import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRimWobblePrevious,restoreRimWobbleBytes,verifyRimWobbleRevision} from './rim-wobble-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('RimWobble preserves every prior fixture, vehicle asset, venue art and history input',verifyRimWobbleRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/rim-wobble/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRimWobbleBytes(file,bytes),readRimWobblePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRimWobbleBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRimWobbleBytes('src/unknown.ts',unknown),unknown);
});
