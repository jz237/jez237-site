import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readGameDesignPrevious,restoreGameDesignBytes,verifyGameDesignRevision} from './game-design-invariants';
const source=(file:string)=>restoreSteeringNineBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('GameDesign preserves every prior fixture, vehicle asset, control and camera input',verifyGameDesignRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/game-design/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreGameDesignBytes(file,bytes),readGameDesignPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreGameDesignBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreGameDesignBytes('src/unknown.ts',unknown),unknown);
});

import {restoreSteeringNineBytes} from './steering-nine-invariants';
