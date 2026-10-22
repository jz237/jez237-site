import {restoreHeadlightAimBytes} from './headlight-aim-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readHudWarningsPrevious,restoreHudWarningsBytes,verifyHudWarningsRevision} from './hud-warnings-invariants';
const source=(file:string)=>restoreHeadlightAimBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('HudWarnings preserves every prior fixture, vehicle asset, venue art and history input',verifyHudWarningsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/hud-warnings/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreHudWarningsBytes(file,bytes),readHudWarningsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreHudWarningsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreHudWarningsBytes('src/unknown.ts',unknown),unknown);
});
