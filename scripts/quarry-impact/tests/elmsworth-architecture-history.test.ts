import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readElmsworthArchitecturePrevious,restoreElmsworthArchitectureBytes,verifyElmsworthArchitectureRevision} from './elmsworth-architecture-invariants';
const source=(file:string)=>restoreElmsworthSpectatorsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('ElmsworthArchitecture preserves every prior fixture, vehicle asset, control and camera input',verifyElmsworthArchitectureRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/elmsworth-architecture/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreElmsworthArchitectureBytes(file,bytes),readElmsworthArchitecturePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreElmsworthArchitectureBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreElmsworthArchitectureBytes('src/unknown.ts',unknown),unknown);
});

import {restoreElmsworthSpectatorsBytes} from './elmsworth-spectators-invariants';
