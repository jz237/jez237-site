import {eventGridSetup} from '../src/grid-setup';
import test from 'node:test';import assert from 'node:assert/strict';
import {CAR_KINDS,DEFINITIONS} from '../src/rules';
import {readGarage,stockSetup,setupPhysics} from '../src/garage';
import {readEventOptions} from '../src/event-rules';
import {readDemoOptions,demoCarKind,demoVehicleSetup} from '../src/demo-session';
import {GRID_LINEUPS,gridPool,gridCarKind,vehicleDrivetrain,vehicleWeightClass,gridRecordKey} from '../src/grid-rules';
test('every selected vehicle builds a full valid 24-car class, drive and same-model field',()=>{
 for(const kind of CAR_KINDS)for(const lineup of Object.keys(GRID_LINEUPS)as (keyof typeof GRID_LINEUPS)[]){
  const pool=gridPool(kind,lineup),field=Array.from({length:24},(_,i)=>gridCarKind(i,kind,lineup));assert.equal(field[0],kind);assert.equal(field.length,24);assert.ok(field.every(k=>pool.includes(k)));
  if(lineup==='selected')assert.ok(field.every(k=>k===kind));if(lineup==='weight')assert.ok(field.every(k=>vehicleWeightClass(k)===vehicleWeightClass(kind)));if(lineup==='drivetrain')assert.ok(field.every(k=>vehicleDrivetrain(k)===vehicleDrivetrain(kind)));
  assert.equal(new Set(field).size,pool.length);for(let i=0;i<24;i++)assert.ok(pool.includes(demoCarKind(i,kind,lineup)));
 }
 assert.deepEqual(gridPool('sedan','drivetrain'),['sedan','hatch']);assert.deepEqual(gridPool('tern','drivetrain'),['tern']);assert.deepEqual(gridPool('buggy','weight'),['compact','tern','marten','buggy']);
});
test('factory and matched fields enforce actual physical upgrades without mutating saved garage or sharing setup state',()=>{
 const garage=readGarage();garage.cars.tern.setup={...stockSetup('tern'),paint:0x123456,engine:3,armor:2,tires:1,tune:{gearing:.7,suspension:-.2,steering:.4,brakeBias:.1,differential:.9}};const before=JSON.stringify(garage);
 for(const kind of CAR_KINDS){
  const stock=eventGridSetup(kind,'tern',garage,'stock',false,0x456789)!,match=eventGridSetup(kind,'tern',garage,'matched',false,0x456789)!;
  assert.deepEqual(setupPhysics(kind,stock),setupPhysics(kind,stockSetup(kind)));assert.equal(stock.paint,0x456789);assert.equal(match.engine,3);assert.equal(match.armor,2);assert.equal(match.tires,1);assert.deepEqual(match.tune,garage.cars.tern.setup.tune);assert.ok(setupPhysics(kind,match).force>DEFINITIONS[kind].force);
  match.tune.gearing=-1;assert.equal(garage.cars.tern.setup.tune.gearing,.7);
  const demo=demoVehicleSetup(kind,{setups:'matched'},garage,'tern')!;assert.equal(demo.engine,3);assert.equal(demo.paint,garage.cars[kind].setup.paint);
 }
 const player=eventGridSetup('tern','tern',garage,'stock',true)!;assert.equal(player.paint,0x123456);assert.equal(player.engine,0);assert.equal(JSON.stringify(garage),before);
 assert.equal(eventGridSetup('coupe','tern',garage),undefined);
});
test('older preferences and records retain their defaults; restricted categories are separate and malformed options cannot enter the grid',()=>{
 const old=readEventOptions();assert.equal(old.lineup,undefined);assert.equal(old.performance,undefined);assert.equal(gridRecordKey('race','tern'),'race');
 assert.equal(readEventOptions('{"version":1,"lineup":"__proto__","performance":"constructor"}').lineup,undefined);
 const opts=readEventOptions('{"version":1,"lineup":"weight","performance":"matched"}');assert.equal(opts.lineup,'weight');assert.equal(opts.performance,'matched');
 assert.equal(readDemoOptions('{"version":1,"lineup":"drivetrain","setups":"matched"}').setups,'matched');
 assert.notEqual(gridRecordKey('race','tern','weight','stock'),gridRecordKey('race','buggy','weight','stock'));assert.notEqual(gridRecordKey('race','tern','mixed','matched'),'race');
});
