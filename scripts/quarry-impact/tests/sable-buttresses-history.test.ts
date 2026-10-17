import {restoreDemoDirectionBytes} from './demo-direction-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readSableButtressesPrevious,restoreSableButtressesBytes,verifySableButtressesRevision} from './sable-buttresses-invariants';
const source=(file:string)=>restoreDemoDirectionBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('SableButtresses preserves every prior fixture, vehicle asset, control and camera input',verifySableButtressesRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/sable-buttresses/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreSableButtressesBytes(file,bytes),readSableButtressesPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreSableButtressesBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreSableButtressesBytes('src/unknown.ts',unknown),unknown);
});
