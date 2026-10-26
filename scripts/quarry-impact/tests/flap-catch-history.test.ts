import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readFlapCatchPrevious,restoreFlapCatchBytes,verifyFlapCatchRevision} from './flap-catch-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('FlapCatch preserves every prior fixture, vehicle asset, venue art and history input',verifyFlapCatchRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/flap-catch/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreFlapCatchBytes(file,bytes),readFlapCatchPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreFlapCatchBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreFlapCatchBytes('src/unknown.ts',unknown),unknown);
});
