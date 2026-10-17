import {restoreFenwickMeadowBytes} from './fenwick-meadow-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readFenwickGaragesPrevious,restoreFenwickGaragesBytes,verifyFenwickGaragesRevision} from './fenwick-garages-invariants';
const source=(file:string)=>restoreFenwickMeadowBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('FenwickGarages preserves every prior fixture, vehicle asset, control and camera input',verifyFenwickGaragesRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/fenwick-garages/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreFenwickGaragesBytes(file,bytes),readFenwickGaragesPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreFenwickGaragesBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreFenwickGaragesBytes('src/unknown.ts',unknown),unknown);
});
