import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {RAIN_FIRE,VehicleThermalState} from '../src/vehicle-thermal-state';
const zones={front:40,rear:0,left:0,right:0,roof:0};
const burnFor=(wet:boolean)=>{const s=new VehicleThermalState(100,.37);s.wet=wet;s.ignite();let t=0,lit=false;
  for(let i=0;i<60*120;i++){s.advance(50,1/60);t+=1/60;if(s.heat>.3)lit=true;if(lit&&s.heat<.05)return t;}return Infinity;};
test('in the rain a car fire burns through its fuel sooner and dies down sooner',()=>{
  const dry=burnFor(false),wet=burnFor(true);assert.ok(Number.isFinite(dry)&&Number.isFinite(wet),'both burn out');
  assert.ok(wet<dry*.8&&wet>dry/RAIN_FIRE.burn*.7,'sooner in the rain, by about its burn rate');
});
test('a primed fuel tank still goes up on time in the rain',()=>{
  const blast=(wet:boolean)=>{const s=new VehicleThermalState(100,.61);s.wet=wet;s.ignite();s.primeFuelBlast();for(let i=0;i<60*20;i++){if(s.advance(50,1/60))return +s.burnTime.toFixed(3);}return -1;};
  const dry=blast(false),wet=blast(true);assert.ok(dry>0&&dry===wet,'same moment');
});
test('a wrecked engine catches less often in the rain',()=>{
  const caught=(wet:boolean)=>{let n=0;for(let k=0;k<400;k++){const s=new VehicleThermalState(100,k/400+.0013);s.wet=wet;for(let i=0;i<60*13;i++)s.advance(10,1/60,0,zones);if(s.burning)n++;}return n;};
  const dry=caught(false),wet=caught(true);assert.ok(dry>40,'some catch in the dry');assert.ok(wet<dry*.8&&wet>dry*RAIN_FIRE.chance*.7,'about its share in the rain');
});
test('the fire layer marks offline cars wet in the rain and hisses steam off their flames; main tells it',()=>{
  const fire=readFileSync(new URL('../src/vehicle-fire.ts',import.meta.url),'utf8'),main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(fire.includes('state.wet=this.wet&&car.extendedDamage;')&&fire.indexOf('state.wet=this.wet')<fire.indexOf('const ignition=state.advance('),'set before the fire advances');
  assert.ok(fire.includes("if(state.wet&&state.burning&&state.heat>.1){e.steam=(e.steam??0)+dt*RAIN_FIRE.steam*state.heat;"),'steam off the flames');
  assert.ok(main.includes("if(vehicleFire)vehicleFire.wet=eventLighting==='rain'&&!online?.active;"),'offline rain only');
});
