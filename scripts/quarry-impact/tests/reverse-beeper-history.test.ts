import {restoreBrakeDustBytes} from './brake-dust-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readReverseBeeperPrevious,restoreReverseBeeperBytes,verifyReverseBeeperRevision} from './reverse-beeper-invariants';
const source=(file:string)=>restoreBrakeDustBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('ReverseBeeper preserves every prior fixture, vehicle asset, venue art and history input',verifyReverseBeeperRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/reverse-beeper/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreReverseBeeperBytes(file,bytes),readReverseBeeperPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreReverseBeeperBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreReverseBeeperBytes('src/unknown.ts',unknown),unknown);
});
