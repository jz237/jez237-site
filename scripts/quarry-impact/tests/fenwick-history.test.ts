import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readFenwickPrevious,restoreFenwickBytes,verifyFenwickRevision} from './fenwick-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('Fenwick preserves every prior fixture, vehicle asset, control and camera input',verifyFenwickRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/fenwick/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreFenwickBytes(file,bytes),readFenwickPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreFenwickBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreFenwickBytes('src/unknown.ts',unknown),unknown);
});
