import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRivalHonksPrevious,restoreRivalHonksBytes,verifyRivalHonksRevision} from './rival-honks-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('RivalHonks preserves every prior fixture, vehicle asset, venue art and history input',verifyRivalHonksRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/rival-honks/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRivalHonksBytes(file,bytes),readRivalHonksPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRivalHonksBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRivalHonksBytes('src/unknown.ts',unknown),unknown);
});
