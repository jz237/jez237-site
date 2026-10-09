import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readCoastForestPrevious,restoreCoastForestBytes,verifyCoastForestRevision} from './coast-forest-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('CoastForest preserves every prior fixture, vehicle asset, control and camera input',verifyCoastForestRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/coast-forest/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreCoastForestBytes(file,bytes),readCoastForestPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreCoastForestBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreCoastForestBytes('src/unknown.ts',unknown),unknown);
});
