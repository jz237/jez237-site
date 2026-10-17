import {restoreGroundRotationBytes} from './ground-rotation-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDemoDirectionPrevious,restoreDemoDirectionBytes,verifyDemoDirectionRevision} from './demo-direction-invariants';
const source=(file:string)=>restoreGroundRotationBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('DemoDirection preserves every prior fixture, vehicle asset, control and camera input',verifyDemoDirectionRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/demo-direction/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDemoDirectionBytes(file,bytes),readDemoDirectionPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDemoDirectionBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDemoDirectionBytes('src/unknown.ts',unknown),unknown);
});
