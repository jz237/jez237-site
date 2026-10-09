import {restoreEasyTuningBytes} from './easy-tuning-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readHeathCanyonPrevious,restoreHeathCanyonBytes,verifyHeathCanyonRevision} from './heath-canyon-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('HeathCanyon preserves every prior fixture, vehicle asset, control and camera input',verifyHeathCanyonRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/heath-canyon/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=restoreEasyTuningBytes(file,source(file));assert.deepEqual(restoreHeathCanyonBytes(file,bytes),readHeathCanyonPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreHeathCanyonBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreHeathCanyonBytes('src/unknown.ts',unknown),unknown);
});
