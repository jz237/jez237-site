import {restoreFenwickFairgroundBytes} from './fenwick-fairground-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readHudInitialStatePrevious,restoreHudInitialStateBytes,verifyHudInitialStateRevision} from './hud-initial-state-invariants';
const source=(file:string)=>restoreFenwickFairgroundBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('HudInitialState preserves every prior fixture, vehicle asset, control and camera input',verifyHudInitialStateRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/hud-initial-state/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreHudInitialStateBytes(file,bytes),readHudInitialStatePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreHudInitialStateBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreHudInitialStateBytes('src/unknown.ts',unknown),unknown);
});
