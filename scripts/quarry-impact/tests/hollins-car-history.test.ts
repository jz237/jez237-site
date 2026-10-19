import {restoreTrophyDecalsBytes} from './trophy-decals-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readHollinsCarPrevious,restoreHollinsCarBytes,verifyHollinsCarRevision} from './hollins-car-invariants';
const source=(file:string)=>restoreTrophyDecalsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('HollinsCar preserves every prior fixture, vehicle asset, venue art and history input',verifyHollinsCarRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/hollins-car/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreHollinsCarBytes(file,bytes),readHollinsCarPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreHollinsCarBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreHollinsCarBytes('src/unknown.ts',unknown),unknown);
});
