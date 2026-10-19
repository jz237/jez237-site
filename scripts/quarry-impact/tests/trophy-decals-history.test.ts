import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readTrophyDecalsPrevious,restoreTrophyDecalsBytes,verifyTrophyDecalsRevision} from './trophy-decals-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('TrophyDecals preserves every prior fixture, vehicle asset, venue art and history input',verifyTrophyDecalsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/trophy-decals/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreTrophyDecalsBytes(file,bytes),readTrophyDecalsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreTrophyDecalsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreTrophyDecalsBytes('src/unknown.ts',unknown),unknown);
});
