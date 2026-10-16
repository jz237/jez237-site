import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readContactAbsPrevious,restoreContactAbsBytes,verifyContactAbsRevision} from './contact-abs-invariants';
const source=(file:string)=>restoreDerbyReconnectBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('ContactAbs preserves every prior fixture, vehicle asset, control and camera input',verifyContactAbsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/contact-abs/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreContactAbsBytes(file,bytes),readContactAbsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreContactAbsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreContactAbsBytes('src/unknown.ts',unknown),unknown);
});

import {restoreDerbyReconnectBytes} from './derby-reconnect-invariants';
