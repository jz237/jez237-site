import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDriverFigurePrevious,restoreDriverFigureBytes,verifyDriverFigureRevision} from './driver-figure-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('DriverFigure preserves every prior fixture, vehicle asset, venue art and history input',verifyDriverFigureRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/driver-figure/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDriverFigureBytes(file,bytes),readDriverFigurePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDriverFigureBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDriverFigureBytes('src/unknown.ts',unknown),unknown);
});
