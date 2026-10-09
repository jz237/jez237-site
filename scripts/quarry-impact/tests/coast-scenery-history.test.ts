import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readCoastSceneryPrevious,restoreCoastSceneryBytes,verifyCoastSceneryRevision} from './coast-scenery-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('CoastScenery preserves every prior fixture, vehicle asset, control and camera input',verifyCoastSceneryRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/coast-scenery/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreCoastSceneryBytes(file,bytes),readCoastSceneryPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreCoastSceneryBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreCoastSceneryBytes('src/unknown.ts',unknown),unknown);
});
