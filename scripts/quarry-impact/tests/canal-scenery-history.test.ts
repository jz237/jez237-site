import {restorePassSceneryBytes} from './pass-scenery-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readCanalSceneryPrevious,restoreCanalSceneryBytes,verifyCanalSceneryRevision} from './canal-scenery-invariants';
const source=(file:string)=>restorePassSceneryBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('CanalScenery preserves every prior fixture, vehicle asset, control and camera input',verifyCanalSceneryRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/canal-scenery/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreCanalSceneryBytes(file,bytes),readCanalSceneryPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreCanalSceneryBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreCanalSceneryBytes('src/unknown.ts',unknown),unknown);
});
