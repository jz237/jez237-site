import {restoreFenwickLandscapeBytes} from './fenwick-landscape-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readFenwickFairgroundPrevious,restoreFenwickFairgroundBytes,verifyFenwickFairgroundRevision} from './fenwick-fairground-invariants';
const source=(file:string)=>restoreFenwickLandscapeBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('FenwickFairground preserves every prior fixture, vehicle asset, control and camera input',verifyFenwickFairgroundRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/fenwick-fairground/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreFenwickFairgroundBytes(file,bytes),readFenwickFairgroundPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreFenwickFairgroundBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreFenwickFairgroundBytes('src/unknown.ts',unknown),unknown);
});
