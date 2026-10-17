import {restoreRookvaleGroundBytes} from './rookvale-ground-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRookvaleTerminalPrevious,restoreRookvaleTerminalBytes,verifyRookvaleTerminalRevision} from './rookvale-terminal-invariants';
const source=(file:string)=>restoreRookvaleGroundBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('RookvaleTerminal preserves every prior fixture, vehicle asset, control and camera input',verifyRookvaleTerminalRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/rookvale-terminal/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRookvaleTerminalBytes(file,bytes),readRookvaleTerminalPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRookvaleTerminalBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRookvaleTerminalBytes('src/unknown.ts',unknown),unknown);
});
