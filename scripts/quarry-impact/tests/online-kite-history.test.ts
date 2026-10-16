import {restoreDriverIdentityBytes} from './driver-identity-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readOnlineKitePrevious,restoreOnlineKiteBytes,verifyOnlineKiteRevision} from './online-kite-invariants';
const source=(file:string)=>restoreDriverIdentityBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('OnlineKite preserves every prior fixture, vehicle asset, control and camera input',verifyOnlineKiteRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/online-kite/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreOnlineKiteBytes(file,bytes),readOnlineKitePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreOnlineKiteBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreOnlineKiteBytes('src/unknown.ts',unknown),unknown);
});
