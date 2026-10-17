import {restoreFenwickGroundBytes} from './fenwick-ground-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readFenwickWheelPrevious,restoreFenwickWheelBytes,verifyFenwickWheelRevision} from './fenwick-wheel-invariants';
const source=(file:string)=>restoreFenwickGroundBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('FenwickWheel preserves every prior fixture, vehicle asset, control and camera input',verifyFenwickWheelRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/fenwick-wheel/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreFenwickWheelBytes(file,bytes),readFenwickWheelPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreFenwickWheelBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreFenwickWheelBytes('src/unknown.ts',unknown),unknown);
});
