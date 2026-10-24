import {restoreAiExtinguisherBytes} from './ai-extinguisher-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readExtinguisherPrevious,restoreExtinguisherBytes,verifyExtinguisherRevision} from './extinguisher-invariants';
const source=(file:string)=>restoreAiExtinguisherBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('Extinguisher preserves every prior fixture, vehicle asset, venue art and history input',verifyExtinguisherRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/extinguisher/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreExtinguisherBytes(file,bytes),readExtinguisherPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreExtinguisherBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreExtinguisherBytes('src/unknown.ts',unknown),unknown);
});
