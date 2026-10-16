import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readSteeringEightPrevious,restoreSteeringEightBytes,verifySteeringEightRevision} from './steering-eight-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('SteeringEight preserves every prior fixture, vehicle asset, control and camera input',verifySteeringEightRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/steering-eight/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=restoreGarageDesignBytes(file,source(file));assert.deepEqual(restoreSteeringEightBytes(file,bytes),readSteeringEightPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreSteeringEightBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreSteeringEightBytes('src/unknown.ts',unknown),unknown);
});

import {restoreGarageDesignBytes} from './garage-design-invariants';
