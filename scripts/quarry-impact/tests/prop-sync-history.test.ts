import {restoreLivePropsBytes} from './live-props-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readPropSyncPrevious,restorePropSyncBytes,verifyPropSyncRevision} from './prop-sync-invariants';
const source=(file:string)=>restoreLivePropsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('PropSync preserves every prior fixture, vehicle asset, control and camera input',verifyPropSyncRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/prop-sync/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restorePropSyncBytes(file,bytes),readPropSyncPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restorePropSyncBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restorePropSyncBytes('src/unknown.ts',unknown),unknown);
});
