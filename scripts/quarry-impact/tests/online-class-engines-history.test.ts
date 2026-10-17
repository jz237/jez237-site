import {restoreGarageEnginesBytes} from './garage-engines-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readOnlineClassEnginesPrevious,restoreOnlineClassEnginesBytes,verifyOnlineClassEnginesRevision} from './online-class-engines-invariants';
const source=(file:string)=>restoreGarageEnginesBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('OnlineClassEngines preserves every prior fixture, vehicle asset, control and camera input',verifyOnlineClassEnginesRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/online-class-engines/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreOnlineClassEnginesBytes(file,bytes),readOnlineClassEnginesPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreOnlineClassEnginesBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreOnlineClassEnginesBytes('src/unknown.ts',unknown),unknown);
});
