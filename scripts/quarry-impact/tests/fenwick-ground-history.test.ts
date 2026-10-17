import {restoreImpactMaterialBytes} from './impact-material-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readFenwickGroundPrevious,restoreFenwickGroundBytes,verifyFenwickGroundRevision} from './fenwick-ground-invariants';
const source=(file:string)=>restoreImpactMaterialBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('FenwickGround preserves every prior fixture, vehicle asset, control and camera input',verifyFenwickGroundRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/fenwick-ground/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreFenwickGroundBytes(file,bytes),readFenwickGroundPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreFenwickGroundBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreFenwickGroundBytes('src/unknown.ts',unknown),unknown);
});
