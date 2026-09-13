import test from 'node:test';
import assert from 'node:assert/strict';
import {chemistryInitial,chemistryDefaults,addFeed,consumeFeed,advanceChemistry,nitrogenInventory,nitrogenError,nitrify,changeWater,ammoniaFraction,oxygenSaturation,speciate} from '../lib/TankChemistry.ts';
import {LearningModel} from '../lib/LearningModel.ts';
const near=(a,b,t=1e-9)=>assert.ok(Math.abs(a-b)<t,`${a} differs from ${b}`);
test('nitrification conserves N and spends the stoichiometric oxygen and alkalinity',()=>{
 const s=chemistryInitial();s.ammonia=1;s.nitrite=0;s.nitrate=0;s.oxygen=10;const alk=s.alkalinity;
 nitrify(s,1,1);near(s.ammonia,0);near(s.nitrite,0);near(s.nitrate,1);near(s.oxygen,10-4.57);near(s.alkalinity,alk-7.14);
 s.ammonia=1;s.nitrite=1;s.oxygen=.01;nitrify(s,5,5);assert.ok(s.oxygen>=-1e-12);assert.ok(s.ammonia>.99);
});
test('feeding and real bites move nitrogen into digestion without instant ammonia spikes',()=>{
 const s=chemistryInitial(),before=nitrogenInventory(s),tan=s.ammonia,n=addFeed(s,120);
 near(n,120*.07/180);near(nitrogenInventory(s)-before,n);near(s.ammonia,tan);
 const organic=s.waste;consumeFeed(s,n);near(s.waste,organic-n);near(s.digesting,n*.75);near(nitrogenError(s),0);
 advanceChemistry(s,chemistryDefaults(),1);assert.ok(s.digesting<n*.75);near(nitrogenError(s),0);
});
test('feeding, plant turnover, nitrification and repeated water changes conserve N for a week',()=>{
 const s=chemistryInitial(),e=chemistryDefaults();for(let hour=0;hour<168;hour++){
  if(hour%24===0){const n=addFeed(s,120);consumeFeed(s,n*.65);}if(hour===72||hour===144)changeWater(s,.3);
  advanceChemistry(s,e,1);near(nitrogenError(s),0,1e-9);
  for(const k of ['oxygen','carbon','ammonia','nitrite','nitrate','waste','digesting','plantN','fishN','alkalinity'])assert.ok(s[k]>=-1e-12,k);
 }
});
test('CO2 changes pH without consuming carbonate alkalinity; ammonia fraction tracks pH and temperature',()=>{
 const s=chemistryInitial(),alk=s.alkalinity,ph=s.ph;s.carbon+=1;speciate(s);assert.ok(s.ph<ph);near(s.alkalinity,alk);
 near(ammoniaFraction(7,25),.00564,.0001);assert.ok(ammoniaFraction(8,25)>ammoniaFraction(7,25));assert.ok(ammoniaFraction(8,30)>ammoniaFraction(8,20));
});
test('water changes dilute dissolved nutrients and mix gases, temperature and alkalinity, retaining attached life',()=>{
 const s=chemistryInitial();addFeed(s,1200);advanceChemistry(s,chemistryDefaults(),6);const before={...s};changeWater(s,.3);
 near(s.ammonia,before.ammonia*.7);near(s.nitrite,before.nitrite*.7);near(s.nitrate,before.nitrate*.7);
 near(s.oxygen,before.oxygen*.7+oxygenSaturation(24)*.3);near(s.waste,before.waste);near(s.bacteria,before.bacteria);near(s.plantN,before.plantN);near(nitrogenError(s),0);
});
test('warming reduces oxygen solubility and heater changes take time',()=>{
 near(oxygenSaturation(20),9.08,.15);near(oxygenSaturation(30),7.56,.15);assert.ok(oxygenSaturation(30)<oxygenSaturation(20));
 const s=chemistryInitial(),e=chemistryDefaults();e.temperature=30;advanceChemistry(s,e,1);assert.ok(s.temperature>24&&s.temperature<30);
});
test('chemistry clock is frame-rate independent to integration tolerance, and pause holds it',()=>{
 const a=new LearningModel(),b=new LearningModel();a.reset();b.reset();a.running=b.running=true;
 for(let i=0;i<600;i++)a.tick(1/60);for(let i=0;i<100;i++)b.tick(.1);
 near(a.state.hours,b.state.hours,1e-9);near(a.state.oxygen,b.state.oxygen,.002);near(a.state.ph,b.state.ph,.002);
 const saved=structuredClone(a.state);a.running=false;a.tick(.1);assert.deepEqual(a.state,saved);
});
test('old visual food cannot consume a freshly reset chemistry pool, and challenges are isolated',()=>{
 const tank=new LearningModel(),challenge=new LearningModel();tank.reset();const old=tank.generation;tank.reset();const saved=structuredClone(tank.state);
 tank.eat(.1,old);assert.deepEqual(tank.state,saved);challenge.reset('food');challenge.step(6);assert.deepEqual(tank.state,saved);
});
