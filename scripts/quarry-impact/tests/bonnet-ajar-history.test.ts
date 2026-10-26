import {restoreStoneChipsBytes} from './stone-chips-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readBonnetAjarPrevious,restoreBonnetAjarBytes,verifyBonnetAjarRevision} from './bonnet-ajar-invariants';
const source=(file:string)=>restoreStoneChipsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('BonnetAjar preserves every prior fixture, vehicle asset, venue art and history input',verifyBonnetAjarRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/bonnet-ajar/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreBonnetAjarBytes(file,bytes),readBonnetAjarPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreBonnetAjarBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreBonnetAjarBytes('src/unknown.ts',unknown),unknown);
});
