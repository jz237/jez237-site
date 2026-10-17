import {restoreFenwickWheelBytes} from './fenwick-wheel-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readGroundRotationPrevious,restoreGroundRotationBytes,verifyGroundRotationRevision} from './ground-rotation-invariants';
const source=(file:string)=>restoreFenwickWheelBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('GroundRotation preserves every prior fixture, vehicle asset, control and camera input',verifyGroundRotationRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/ground-rotation/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreGroundRotationBytes(file,bytes),readGroundRotationPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreGroundRotationBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreGroundRotationBytes('src/unknown.ts',unknown),unknown);
});
