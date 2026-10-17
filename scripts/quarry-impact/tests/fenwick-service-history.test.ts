import {restoreFenwickGaragesBytes} from './fenwick-garages-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readFenwickServicePrevious,restoreFenwickServiceBytes,verifyFenwickServiceRevision} from './fenwick-service-invariants';
const source=(file:string)=>restoreFenwickGaragesBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('FenwickService preserves every prior fixture, vehicle asset, control and camera input',verifyFenwickServiceRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/fenwick-service/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreFenwickServiceBytes(file,bytes),readFenwickServicePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreFenwickServiceBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreFenwickServiceBytes('src/unknown.ts',unknown),unknown);
});
