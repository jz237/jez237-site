import {restoreFluidLeaksBytes} from './fluid-leaks-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRealisticCrumplePrevious,restoreRealisticCrumpleBytes,verifyRealisticCrumpleRevision} from './realistic-crumple-invariants';
const source=(file:string)=>restoreFluidLeaksBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('RealisticCrumple preserves every prior fixture, vehicle asset, venue art and history input',verifyRealisticCrumpleRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/realistic-crumple/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRealisticCrumpleBytes(file,bytes),readRealisticCrumplePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRealisticCrumpleBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRealisticCrumpleBytes('src/unknown.ts',unknown),unknown);
});
