import {restoreFeedWheelsBytes} from './feed-wheels-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readPropCcdPrevious,restorePropCcdBytes,verifyPropCcdRevision} from './prop-ccd-invariants';
const source=(file:string)=>restoreFeedWheelsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('PropCcd preserves every prior fixture, vehicle asset, venue art and history input',verifyPropCcdRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/prop-ccd/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restorePropCcdBytes(file,bytes),readPropCcdPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restorePropCcdBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restorePropCcdBytes('src/unknown.ts',unknown),unknown);
});
