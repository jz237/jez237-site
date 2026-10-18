import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {prepareNativeHullLandingShape} from '../native-hull-landing-shape.js';
const reference=JSON.parse(readFileSync(new URL('./fixtures/native-hull-landing-shape-reference.json',import.meta.url)));

test('landing shape side checks and all twelve rebuilt positions match original routine execution',()=>{
 let reset=0,retained=0;
 for(const c of reference.cases){
  const before=structuredClone(c.input),out=prepareNativeHullLandingShape(c.input);
  assert.deepEqual(out,c.expected);assert.deepEqual(c.input,before);
  if(out.reset)reset++;else retained++;
 }
 assert.ok(reset>50&&retained>50);
});

test('zero plane boundaries pass and middle-point deformation alone does not cause landing repair',()=>{
 const c=reference.cases[0].input;
 assert.equal(prepareNativeHullLandingShape(c).reset,false);
 const ordinary=structuredClone(reference.cases[1].input);
 for(let i=6;i<12;i++)ordinary.pointsNative[i]={x:5000+i,y:-10000-i,z:9000-i};
 assert.deepEqual(prepareNativeHullLandingShape(ordinary),{reset:false,pointsNative:ordinary.pointsNative});
});

test('landing repair requires explicit finite geometry and leaves input untouched on validation failure',()=>{
 const c=structuredClone(reference.cases[1].input),before=structuredClone(c);
 assert.throws(()=>prepareNativeHullLandingShape({...c,localPointsNative:undefined}));
 assert.throws(()=>prepareNativeHullLandingShape({...c,pointsNative:c.pointsNative.slice(0,6)}));
 assert.throws(()=>prepareNativeHullLandingShape({...c,frame:{...c.frame,right:{x:Infinity,y:0,z:0}}}));
 assert.deepEqual(c,before);
});
