import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readGarageDesignPrevious,restoreGarageDesignBytes,verifyGarageDesignRevision} from './garage-design-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('GarageDesign preserves every prior fixture, vehicle asset, control and camera input',verifyGarageDesignRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/garage-design/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=restoreControlSaveBytes(file,source(file));assert.deepEqual(restoreGarageDesignBytes(file,bytes),readGarageDesignPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreGarageDesignBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreGarageDesignBytes('src/unknown.ts',unknown),unknown);
});

import {restoreControlSaveBytes} from './control-save-invariants';
