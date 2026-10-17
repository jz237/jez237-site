import {restoreFenwickBoundaryBytes} from './fenwick-boundary-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readFenwickMeadowPrevious,restoreFenwickMeadowBytes,verifyFenwickMeadowRevision} from './fenwick-meadow-invariants';
const source=(file:string)=>restoreFenwickBoundaryBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('FenwickMeadow preserves every prior fixture, vehicle asset, control and camera input',verifyFenwickMeadowRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/fenwick-meadow/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreFenwickMeadowBytes(file,bytes),readFenwickMeadowPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreFenwickMeadowBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreFenwickMeadowBytes('src/unknown.ts',unknown),unknown);
});
