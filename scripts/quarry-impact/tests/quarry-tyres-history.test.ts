import {restorePropSyncBytes} from './prop-sync-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readQuarryTyresPrevious,restoreQuarryTyresBytes,verifyQuarryTyresRevision} from './quarry-tyres-invariants';
const source=(file:string)=>restorePropSyncBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('QuarryTyres preserves every prior fixture, vehicle asset, control and camera input',verifyQuarryTyresRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/quarry-tyres/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreQuarryTyresBytes(file,bytes),readQuarryTyresPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreQuarryTyresBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreQuarryTyresBytes('src/unknown.ts',unknown),unknown);
});
