import {restoreArenaHornBytes} from './arena-horn-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readLitterCrunchPrevious,restoreLitterCrunchBytes,verifyLitterCrunchRevision} from './litter-crunch-invariants';
const source=(file:string)=>restoreArenaHornBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('LitterCrunch preserves every prior fixture, vehicle asset, venue art and history input',verifyLitterCrunchRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/litter-crunch/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreLitterCrunchBytes(file,bytes),readLitterCrunchPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreLitterCrunchBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreLitterCrunchBytes('src/unknown.ts',unknown),unknown);
});
