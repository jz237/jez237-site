import test from 'node:test';
import assert from 'node:assert/strict';
import {mechanicalReport} from '../src/wreck-report';
test('a dropped engine reads as dropped out, not merely seized',()=>{
 const out=mechanicalReport({engineOut:true,seized:true,diffBroken:true});
 assert.match(out,/engine dropped out/);assert.doesNotMatch(out,/engine seized/);
 assert.match(mechanicalReport({seized:true}),/engine seized/);
});
