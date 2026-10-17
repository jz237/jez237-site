import {restoreImpactPaintBytes} from './impact-paint-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readCrushedPaintPrevious,restoreCrushedPaintBytes,verifyCrushedPaintRevision} from './crushed-paint-invariants';
const source=(file:string)=>restoreImpactPaintBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('CrushedPaint preserves every prior fixture, vehicle asset, control and camera input',verifyCrushedPaintRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/crushed-paint/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreCrushedPaintBytes(file,bytes),readCrushedPaintPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreCrushedPaintBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreCrushedPaintBytes('src/unknown.ts',unknown),unknown);
});
