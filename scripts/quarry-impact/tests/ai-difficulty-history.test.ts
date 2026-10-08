import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readAIDifficultyPrevious,restoreAIDifficultyBytes,verifyAIDifficultyRevision} from './ai-difficulty-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('AI difficulty preserves every prior fixture, vehicle asset, control and camera input',verifyAIDifficultyRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/ai-difficulty/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreAIDifficultyBytes(file,bytes),readAIDifficultyPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreAIDifficultyBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreAIDifficultyBytes('src/unknown.ts',unknown),unknown);
});
