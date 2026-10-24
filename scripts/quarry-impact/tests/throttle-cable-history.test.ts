import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readThrottleCablePrevious,restoreThrottleCableBytes,verifyThrottleCableRevision} from './throttle-cable-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('ThrottleCable preserves every prior fixture, vehicle asset, venue art and history input',verifyThrottleCableRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/throttle-cable/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreThrottleCableBytes(file,bytes),readThrottleCablePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreThrottleCableBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreThrottleCableBytes('src/unknown.ts',unknown),unknown);
});
