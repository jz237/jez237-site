import {restoreSableSettlingWorksBytes} from './sable-settling-works-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readSableScrubBedsPrevious,restoreSableScrubBedsBytes,verifySableScrubBedsRevision} from './sable-scrub-beds-invariants';
const source=(file:string)=>restoreSableSettlingWorksBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('SableScrubBeds preserves every prior fixture, vehicle asset, control and camera input',verifySableScrubBedsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/sable-scrub-beds/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreSableScrubBedsBytes(file,bytes),readSableScrubBedsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreSableScrubBedsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreSableScrubBedsBytes('src/unknown.ts',unknown),unknown);
});
