import {restoreNumberPlatesBytes} from './number-plates-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readSlipstreamPrevious,restoreSlipstreamBytes,verifySlipstreamRevision} from './slipstream-invariants';
const source=(file:string)=>restoreNumberPlatesBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('Slipstream preserves every prior fixture, vehicle asset, venue art and history input',verifySlipstreamRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/slipstream/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreSlipstreamBytes(file,bytes),readSlipstreamPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreSlipstreamBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreSlipstreamBytes('src/unknown.ts',unknown),unknown);
});
