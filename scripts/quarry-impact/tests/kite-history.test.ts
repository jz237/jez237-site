import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readKitePrevious,restoreKiteBytes,verifyKiteRevision} from './kite-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('Kite preserves every prior fixture, vehicle asset, control and camera input',verifyKiteRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/kite/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreKiteBytes(file,bytes),readKitePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreKiteBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreKiteBytes('src/unknown.ts',unknown),unknown);
});
