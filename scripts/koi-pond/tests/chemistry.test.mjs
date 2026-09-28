import test from 'node:test';
import assert from 'node:assert/strict';
import {PondChemistry,ammoniaFraction,oxygenSaturation} from '../src/PondChemistry.js';
test('ammonia speciation responds to both pH and temperature',()=>{
 assert.ok(ammoniaFraction(25,8)>ammoniaFraction(25,7)*8);
 assert.ok(ammoniaFraction(30,8)>ammoniaFraction(15,8));
 assert.ok(Math.abs(ammoniaFraction(25,8)-.0537)<.001);
 assert.ok(oxygenSaturation(30)<oxygenSaturation(15));
});

test('nitrogen conversions conserve mass after modeled input and plant uptake',()=>{
 const lab=new PondChemistry(),total=s=>s.ammonia+s.nitrite+s.nitrate+s.organic;
 const before=total(lab.state);lab.advance(1);
 assert.ok(Math.abs(total(lab.state)-(before+.0025-.003))<1e-10);
 assert.ok(lab.state.alkalinity<110,'nitrification consumes alkalinity');
});

test('filter and aeration comparisons produce meaningful teaching outcomes',()=>{
 const working=new PondChemistry(),failed=new PondChemistry();failed.filter=false;
 working.feed();failed.feed();working.advance(24);failed.advance(24);
 assert.ok(failed.state.ammonia>working.state.ammonia*5);
 const air=new PondChemistry(),still=new PondChemistry();air.state.temperature=still.state.temperature=30;still.aeration=false;air.advance(24);still.advance(24);
 assert.ok(still.state.oxygen<5);assert.ok(air.state.oxygen>5);
});

test('water changes dilute waste and long scenarios remain finite and nonnegative',()=>{
 const lab=new PondChemistry();lab.filter=false;lab.feed();lab.advance(24);const before={...lab.state};lab.waterChange();
 for(const key of ['ammonia','nitrite','nitrate','organic'])assert.ok(Math.abs(lab.state[key]-before[key]*.75)<1e-10);
 lab.state.temperature=32;lab.aeration=false;lab.filter=true;lab.advance(720);
 for(const value of Object.values(lab.state)){assert.ok(Number.isFinite(value));assert.ok(value>=0);}
 lab.reset();assert.equal(lab.hours,0);assert.equal(lab.state.oxygen,8);assert.equal(lab.history.length,1);
});
