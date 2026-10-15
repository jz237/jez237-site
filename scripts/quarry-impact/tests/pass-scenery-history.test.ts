import {restoreStadiumSceneryBytes} from './stadium-scenery-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readPassSceneryPrevious,restorePassSceneryBytes,verifyPassSceneryRevision} from './pass-scenery-invariants';
const source=(file:string)=>restoreStadiumSceneryBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('PassScenery preserves every prior fixture, vehicle asset, control and camera input',verifyPassSceneryRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/pass-scenery/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restorePassSceneryBytes(file,bytes),readPassSceneryPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restorePassSceneryBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restorePassSceneryBytes('src/unknown.ts',unknown),unknown);
});
