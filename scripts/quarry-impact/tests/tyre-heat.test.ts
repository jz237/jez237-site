import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {TYRE_HEAT,TYRE_STEAM,tyreHeatStep,tyreHeatGrip,tyreSteamRate} from '../src/tyre-heat';
const run=(seconds:number,speed:number,slip:number,wet=false,start:number=TYRE_HEAT.start)=>{let t=start;for(let i=0;i<seconds*60;i++)t=tyreHeatStep(t,speed,slip,wet,1/60);return t;};
test('tyres start cool, warm into their window as they roll, faster when they spin, and cool toward the air',()=>{
  assert.ok(tyreHeatGrip(TYRE_HEAT.start)<1&&tyreHeatGrip(TYRE_HEAT.start)>1-TYRE_HEAT.cold,'a cold start costs a little grip');
  const rolled=run(25,15,0);assert.ok(rolled>=TYRE_HEAT.ideal[0]&&rolled<=TYRE_HEAT.ideal[1]&&tyreHeatGrip(rolled)===1,`rolling at 15 m/s for 25 s: ${rolled}`);
  assert.ok(run(10,15,8)>run(10,15,0)+.1,'spinning wheels heat far faster');assert.ok(run(10,15,4)<run(10,15,8),'more slip, more heat');
  assert.ok(Math.abs(run(400,0,0,false,.9)-TYRE_HEAT.air)<.01&&Math.abs(run(400,0,0,true,.9)-TYRE_HEAT.wetAir)<.01,'parked, back to the air (cooler in the rain)');
  assert.equal(tyreHeatStep(.5,10,0,false,0),.5);assert.equal(tyreHeatStep(NaN,10,0,false,1/60)>0,true);assert.ok(tyreHeatStep(.99,40,30,false,10)<=1);
});
test('in their window they grip fully; overcooked by a long burnout they lose some',()=>{
  const [lo,hi]=TYRE_HEAT.ideal;assert.ok(tyreHeatGrip(lo)===1&&tyreHeatGrip(hi)===1&&tyreHeatGrip((lo+hi)/2)===1);
  assert.ok(Math.abs(tyreHeatGrip(0)-(1-TYRE_HEAT.cold))<1e-9&&Math.abs(tyreHeatGrip(1)-(1-TYRE_HEAT.hot))<1e-9,'the extremes');
  const burnout=run(40,3,10);assert.ok(burnout>hi&&tyreHeatGrip(burnout)<1,`a 40 s burnout: ${burnout}`);
});
test('every offline car warms its tyres as it goes and grips by them',()=>{
  const vehicle=readFileSync(new URL('../src/vehicle.ts',import.meta.url),'utf8'),physics=readFileSync(new URL('../src/vehicle-physics.ts',import.meta.url),'utf8');
  assert.ok(vehicle.includes('if(this.extendedDamage){this.tyreTemp[i]=tyreHeatStep(this.tyreTemp[i],this.speed,this.wheelSlips[i],currentWetness()>.5,dt);this.tyreGrip[i]=tyreHeatGrip(this.tyreTemp[i]);}'));
  assert.ok(physics.includes('*(state.waterGrip?.[i]??1)*(state.tyreGrip?.[i]??1));')&&physics.includes('*(state.waterGrip?.[i]??1)*(state.tyreGrip?.[i]??1)*(state.tractionScale??1));'),'sideways and along');
});
test('in the rain a hot tyre steams at the tread, harder the hotter it is; a cool one does not',()=>{
  assert.equal(tyreSteamRate(TYRE_STEAM.from),0);assert.equal(tyreSteamRate(.4),0);assert.equal(tyreSteamRate(NaN),0);
  assert.ok(tyreSteamRate(.9)>tyreSteamRate(.7)&&tyreSteamRate(1)===TYRE_STEAM.rate,'harder when overcooked');
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes("clocks[i]+=tyreSteamRate(c.tyreTemp[i])*dt;if(clocks[i]<1)continue;clocks[i]%=1;tyrePuffs++;w.getWorldPosition(steamAt).y-=TYRE_STEAM.drop;fx.emit(steamAt,1,5,.3);"),'at the tread');
  assert.ok(main.includes("  if(eventLighting==='rain'&&(state==='playing'||state==='wrecked'))for(const c of cars){if(!c.extendedDamage)continue;const clocks=tyreSteamClocks.get(c)"),'offline rain only');
});
