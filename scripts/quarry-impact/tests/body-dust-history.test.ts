import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readBodyDustPrevious,restoreBodyDustBytes,verifyBodyDustRevision} from './body-dust-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('BodyDust preserves every prior fixture, vehicle asset, venue art and history input',verifyBodyDustRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/body-dust/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreBodyDustBytes(file,bytes),readBodyDustPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreBodyDustBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreBodyDustBytes('src/unknown.ts',unknown),unknown);
});
