import {restoreFenwickTreeBeltBytes} from './fenwick-tree-belt-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readFenwickLandscapePrevious,restoreFenwickLandscapeBytes,verifyFenwickLandscapeRevision} from './fenwick-landscape-invariants';
const source=(file:string)=>restoreFenwickTreeBeltBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('FenwickLandscape preserves every prior fixture, vehicle asset, control and camera input',verifyFenwickLandscapeRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/fenwick-landscape/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreFenwickLandscapeBytes(file,bytes),readFenwickLandscapePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreFenwickLandscapeBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreFenwickLandscapeBytes('src/unknown.ts',unknown),unknown);
});
