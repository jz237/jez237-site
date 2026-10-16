import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readOnlineArenasPrevious,restoreOnlineArenasBytes,verifyOnlineArenasRevision} from './online-arenas-invariants';
const source=(file:string)=>restoreOnlineSessionBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('OnlineArenas preserves every prior fixture, vehicle asset, control and camera input',verifyOnlineArenasRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/online-arenas/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreOnlineArenasBytes(file,bytes),readOnlineArenasPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreOnlineArenasBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreOnlineArenasBytes('src/unknown.ts',unknown),unknown);
});

import {restoreOnlineSessionBytes} from './online-session-invariants';
