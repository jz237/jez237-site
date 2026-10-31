import assert from 'node:assert/strict';
import {returnProfile,sheetPoint} from '../../demos/biowheel-studio/water.js';

// Keep the falling sheet attached to the spillway and to the live water level.
for(const level of [1.92,2.0376,2.592,2.76])for(const flow of [.02,.15,.65,1]){
 const p=returnProfile(flow,level),lip=sheetPoint(.5,.52,0,p),landing=sheetPoint(.5,1,0,p);
 assert(Math.abs(landing[1]-level)<1e-8,'Sheet must reach the current water surface.');
 assert(Math.abs(landing[2]-p.impactZ)<1e-8,'Impact effects must follow the sheet.');
 assert(Math.abs(lip[2]-p.edgeZ)<.015,'Water must leave the modeled lip.');
 for(let i=0;i<=100;i++){
  const v=i/100,point=sheetPoint(.5,v,0,p);
  assert(point.every(Number.isFinite));
  if(point[2]>=1.36&&point[2]<=1.78){
   const plasticTop=2.96+.035/Math.cos(.28)-(point[2]-1.57)*Math.tan(.28);
   assert(point[1]>plasticTop,'Water must not disappear inside the plastic spillway.');
  }
 }
}
assert(returnProfile(.65,1.92).fallTime>returnProfile(.65,2.76).fallTime);
assert(returnProfile(.65,1.92).impactZ>returnProfile(.65,2.76).impactZ);
const low=returnProfile(.03,2.592),high=returnProfile(.65,2.592);
assert(sheetPoint(1,.8,0,low)[0]-sheetPoint(0,.8,0,low)[0]<sheetPoint(1,.8,0,high)[0]-sheetPoint(0,.8,0,high)[0]);
console.log('PASS: return clears the spillway, lands at every modeled water height, and narrows with reduced delivery.');
