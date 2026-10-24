import {restorePinBytes} from './pin-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readBurntCreditPrevious,restoreBurntCreditBytes,verifyBurntCreditRevision} from './burnt-credit-invariants';
const source=(file:string)=>restorePinBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('BurntCredit preserves every prior fixture, vehicle asset, venue art and history input',verifyBurntCreditRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/burnt-credit/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreBurntCreditBytes(file,bytes),readBurntCreditPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreBurntCreditBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreBurntCreditBytes('src/unknown.ts',unknown),unknown);
});
