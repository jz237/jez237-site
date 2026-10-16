import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readNoRespawnDerbyPrevious,restoreNoRespawnDerbyBytes,verifyNoRespawnDerbyRevision} from './no-respawn-derby-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('NoRespawnDerby preserves every prior fixture, vehicle asset, control and camera input',verifyNoRespawnDerbyRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/no-respawn-derby/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreNoRespawnDerbyBytes(file,bytes),readNoRespawnDerbyPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreNoRespawnDerbyBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreNoRespawnDerbyBytes('src/unknown.ts',unknown),unknown);
});
