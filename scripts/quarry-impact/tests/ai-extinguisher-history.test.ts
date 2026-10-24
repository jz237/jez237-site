import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readAiExtinguisherPrevious,restoreAiExtinguisherBytes,verifyAiExtinguisherRevision} from './ai-extinguisher-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('AiExtinguisher preserves every prior fixture, vehicle asset, venue art and history input',verifyAiExtinguisherRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/ai-extinguisher/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreAiExtinguisherBytes(file,bytes),readAiExtinguisherPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreAiExtinguisherBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreAiExtinguisherBytes('src/unknown.ts',unknown),unknown);
});
