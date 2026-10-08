import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readPackedDrawPrevious,restorePackedDrawBytes,verifyPackedDrawRevision} from './packed-draw-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('PackedDraw preserves every prior fixture, vehicle asset, control and camera input',verifyPackedDrawRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/packed-draw/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restorePackedDrawBytes(file,bytes),readPackedDrawPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restorePackedDrawBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restorePackedDrawBytes('src/unknown.ts',unknown),unknown);
});
