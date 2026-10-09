import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readCanalPassPrevious,restoreCanalPassBytes,verifyCanalPassRevision} from './canal-pass-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('CanalPass preserves every prior fixture, vehicle asset, control and camera input',verifyCanalPassRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/canal-pass/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreCanalPassBytes(file,bytes),readCanalPassPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreCanalPassBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreCanalPassBytes('src/unknown.ts',unknown),unknown);
});
