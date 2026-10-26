import {restoreReverseBeeperBytes} from './reverse-beeper-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRevLimiterPrevious,restoreRevLimiterBytes,verifyRevLimiterRevision} from './rev-limiter-invariants';
const source=(file:string)=>restoreReverseBeeperBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('RevLimiter preserves every prior fixture, vehicle asset, venue art and history input',verifyRevLimiterRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/rev-limiter/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRevLimiterBytes(file,bytes),readRevLimiterPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRevLimiterBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRevLimiterBytes('src/unknown.ts',unknown),unknown);
});
