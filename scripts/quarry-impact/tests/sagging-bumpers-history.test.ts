import {restoreBonnetAjarBytes} from './bonnet-ajar-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readSaggingBumpersPrevious,restoreSaggingBumpersBytes,verifySaggingBumpersRevision} from './sagging-bumpers-invariants';
const source=(file:string)=>restoreBonnetAjarBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('SaggingBumpers preserves every prior fixture, vehicle asset, venue art and history input',verifySaggingBumpersRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/sagging-bumpers/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreSaggingBumpersBytes(file,bytes),readSaggingBumpersPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreSaggingBumpersBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreSaggingBumpersBytes('src/unknown.ts',unknown),unknown);
});
