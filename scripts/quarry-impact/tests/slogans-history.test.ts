import {restoreTyreHissBytes} from './tyre-hiss-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readSlogansPrevious,restoreSlogansBytes,verifySlogansRevision} from './slogans-invariants';
const source=(file:string)=>restoreTyreHissBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('Slogans preserves every prior fixture, vehicle asset, venue art and history input',verifySlogansRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/slogans/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreSlogansBytes(file,bytes),readSlogansPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreSlogansBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreSlogansBytes('src/unknown.ts',unknown),unknown);
});
