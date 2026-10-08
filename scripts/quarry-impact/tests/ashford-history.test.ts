import {restoreAshfordSurfaceBytes} from './ashford-surface-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readAshfordPrevious,restoreAshfordBytes,verifyAshfordRevision} from './ashford-invariants';
const source=(file:string)=>restoreAshfordSurfaceBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('Ashford preserves every prior fixture, vehicle asset, control and camera input',verifyAshfordRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/ashford/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreAshfordBytes(file,bytes),readAshfordPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreAshfordBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreAshfordBytes('src/unknown.ts',unknown),unknown);
});
