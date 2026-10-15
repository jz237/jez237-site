import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readHeathSceneryPrevious,restoreHeathSceneryBytes,verifyHeathSceneryRevision} from './heath-scenery-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('HeathScenery preserves every prior fixture, vehicle asset, control and camera input',verifyHeathSceneryRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/heath-scenery/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreHeathSceneryBytes(file,bytes),readHeathSceneryPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreHeathSceneryBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreHeathSceneryBytes('src/unknown.ts',unknown),unknown);
});
