import {test} from 'node:test';
import assert from 'node:assert/strict';
import {soundFrames} from '../src/DefenderSound.ts';
test('event synthesis is bounded, distinct and has click-free one-shot envelopes',()=>{
 const events=['fire','explosion','abduct','catch','delivery','hyperspace','credit','thrust'];const signatures=[];
 for(const event of events){const samples=soundFrames(event);assert(samples.length>=2000&&samples.length<20000);assert(samples.every(x=>Number.isFinite(x)&&Math.abs(x)<.87));assert(samples.some(x=>Math.abs(x)>.1));if(event!=='thrust'){assert.equal(samples[0],0);assert(Math.abs(samples.at(-1))<.01);}signatures.push(samples.reduce((a,b,i)=>a+b*(i%29),0).toFixed(3));}
 assert.equal(new Set(signatures).size,events.length);
});
