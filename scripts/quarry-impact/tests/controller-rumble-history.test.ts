import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readControllerRumblePrevious,restoreControllerRumbleBytes,verifyControllerRumbleRevision} from './controller-rumble-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('ControllerRumble preserves every prior fixture, vehicle asset, control and camera input',verifyControllerRumbleRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/controller-rumble/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreControllerRumbleBytes(file,bytes),readControllerRumblePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreControllerRumbleBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreControllerRumbleBytes('src/unknown.ts',unknown),unknown);
});
