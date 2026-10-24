import {restoreTankDropBytes} from './tank-drop-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readPileUpPrevious,restorePileUpBytes,verifyPileUpRevision} from './pile-up-invariants';
const source=(file:string)=>restoreTankDropBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('PileUp preserves every prior fixture, vehicle asset, venue art and history input',verifyPileUpRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/pile-up/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restorePileUpBytes(file,bytes),readPileUpPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restorePileUpBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restorePileUpBytes('src/unknown.ts',unknown),unknown);
});
