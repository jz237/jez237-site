import {restoreCountyCoursesBytes} from './county-courses-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readKeyboardDefaultPrevious,restoreKeyboardDefaultBytes,verifyKeyboardDefaultRevision} from './keyboard-default-invariants';
const source=(file:string)=>restoreCountyCoursesBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('KeyboardDefault preserves every prior fixture, vehicle asset, control and camera input',verifyKeyboardDefaultRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/keyboard-default/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreKeyboardDefaultBytes(file,bytes),readKeyboardDefaultPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreKeyboardDefaultBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreKeyboardDefaultBytes('src/unknown.ts',unknown),unknown);
});
