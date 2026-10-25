import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readAiAquaplanePrevious,restoreAiAquaplaneBytes,verifyAiAquaplaneRevision} from './ai-aquaplane-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('AiAquaplane preserves every prior fixture, vehicle asset, venue art and history input',verifyAiAquaplaneRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/ai-aquaplane/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreAiAquaplaneBytes(file,bytes),readAiAquaplanePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreAiAquaplaneBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreAiAquaplaneBytes('src/unknown.ts',unknown),unknown);
});
