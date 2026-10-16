import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readControlSavePrevious,restoreControlSaveBytes,verifyControlSaveRevision} from './control-save-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('ControlSave preserves every prior fixture, vehicle asset, control and camera input',verifyControlSaveRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/control-save/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=restoreGameDesignBytes(file,source(file));assert.deepEqual(restoreControlSaveBytes(file,bytes),readControlSavePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreControlSaveBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreControlSaveBytes('src/unknown.ts',unknown),unknown);
});

import {restoreGameDesignBytes} from './game-design-invariants';
