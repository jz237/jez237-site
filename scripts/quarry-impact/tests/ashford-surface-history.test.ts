import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readAshfordSurfacePrevious,restoreAshfordSurfaceBytes,verifyAshfordSurfaceRevision} from './ashford-surface-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('AshfordSurface preserves every prior fixture, vehicle asset, control and camera input',verifyAshfordSurfaceRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/ashford-surface/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreAshfordSurfaceBytes(file,bytes),readAshfordSurfacePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreAshfordSurfaceBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreAshfordSurfaceBytes('src/unknown.ts',unknown),unknown);
});
