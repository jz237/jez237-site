import {restorePuddleMirrorBytes} from './puddle-mirror-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readCrispDetailPrevious,restoreCrispDetailBytes,verifyCrispDetailRevision} from './crisp-detail-invariants';
const source=(file:string)=>restorePuddleMirrorBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('CrispDetail preserves every prior fixture, vehicle asset, venue art and history input',verifyCrispDetailRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/crisp-detail/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreCrispDetailBytes(file,bytes),readCrispDetailPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreCrispDetailBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreCrispDetailBytes('src/unknown.ts',unknown),unknown);
});
