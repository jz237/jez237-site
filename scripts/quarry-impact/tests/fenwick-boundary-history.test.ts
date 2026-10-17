import {restoreQuarryTyresBytes} from './quarry-tyres-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readFenwickBoundaryPrevious,restoreFenwickBoundaryBytes,verifyFenwickBoundaryRevision} from './fenwick-boundary-invariants';
const source=(file:string)=>restoreQuarryTyresBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('FenwickBoundary preserves every prior fixture, vehicle asset, control and camera input',verifyFenwickBoundaryRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/fenwick-boundary/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreFenwickBoundaryBytes(file,bytes),readFenwickBoundaryPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreFenwickBoundaryBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreFenwickBoundaryBytes('src/unknown.ts',unknown),unknown);
});
