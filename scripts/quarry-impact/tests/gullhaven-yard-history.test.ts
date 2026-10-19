import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readGullhavenYardPrevious,restoreGullhavenYardBytes,verifyGullhavenYardRevision} from './gullhaven-yard-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('GullhavenYard preserves every prior fixture, vehicle asset, venue art and history input',verifyGullhavenYardRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/gullhaven-yard/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreGullhavenYardBytes(file,bytes),readGullhavenYardPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreGullhavenYardBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreGullhavenYardBytes('src/unknown.ts',unknown),unknown);
});
