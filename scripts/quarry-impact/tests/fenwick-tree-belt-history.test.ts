import {restoreRookvaleTerminalBytes} from './rookvale-terminal-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readFenwickTreeBeltPrevious,restoreFenwickTreeBeltBytes,verifyFenwickTreeBeltRevision} from './fenwick-tree-belt-invariants';
const source=(file:string)=>restoreRookvaleTerminalBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('FenwickTreeBelt preserves every prior fixture, vehicle asset, control and camera input',verifyFenwickTreeBeltRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/fenwick-tree-belt/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreFenwickTreeBeltBytes(file,bytes),readFenwickTreeBeltPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreFenwickTreeBeltBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreFenwickTreeBeltBytes('src/unknown.ts',unknown),unknown);
});
