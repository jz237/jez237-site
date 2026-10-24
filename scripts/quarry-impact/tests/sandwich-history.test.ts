import {restoreThrottleCableBytes} from './throttle-cable-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readSandwichPrevious,restoreSandwichBytes,verifySandwichRevision} from './sandwich-invariants';
const source=(file:string)=>restoreThrottleCableBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('Sandwich preserves every prior fixture, vehicle asset, venue art and history input',verifySandwichRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/sandwich/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreSandwichBytes(file,bytes),readSandwichPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreSandwichBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreSandwichBytes('src/unknown.ts',unknown),unknown);
});
