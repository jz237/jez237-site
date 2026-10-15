import {restoreParkSceneryBytes} from './park-scenery-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readPortSceneryPrevious,restorePortSceneryBytes,verifyPortSceneryRevision} from './port-scenery-invariants';
const source=(file:string)=>restoreParkSceneryBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('PortScenery preserves every prior fixture, vehicle asset, control and camera input',verifyPortSceneryRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/port-scenery/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restorePortSceneryBytes(file,bytes),readPortSceneryPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restorePortSceneryBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restorePortSceneryBytes('src/unknown.ts',unknown),unknown);
});
