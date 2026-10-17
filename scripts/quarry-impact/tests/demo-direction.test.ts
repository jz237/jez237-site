import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import vm from 'node:vm';import ts from 'typescript';
import {readDemoOptions,demoRaceDirection} from '../src/demo-session';import {directionForCar} from '../src/event-rules';import {courseGridSlot,getRaceCourse,courseRoute} from '../src/race-course';
import {exportSave,readSave} from '../src/save-backup';
test('demo direction is optional for old saves, persists valid choices and rejects invalid values',async()=>{
 for(const value of [undefined,'bad',3,null]){const options=readDemoOptions(JSON.stringify({version:1,direction:value}));assert.equal(options.direction,undefined);assert.equal(demoRaceDirection(options),'forward');}
 for(const direction of ['forward','reverse','opposing']as const){const options=readDemoOptions(JSON.stringify({version:1,direction}));assert.equal(options.direction,direction);assert.deepEqual(readDemoOptions(JSON.stringify(options)),options);
 const backup=await readSave(await exportSave({getItem:key=>key==='quarry-impact-demo-v1'?JSON.stringify(options):null}));assert.equal(JSON.parse(backup.entries['quarry-impact-demo-v1']!).direction,direction);}
 assert.equal(demoRaceDirection({direction:'reverse',race:'free'}),'forward');assert.equal(demoRaceDirection({direction:'opposing',pursuit:true}),'forward');assert.equal(demoRaceDirection({direction:'reverse',pursuit:true}),'reverse');
});
test('real main direction resolver keeps solo and demo independent and assigns opposing car routes',()=>{
 const source=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8'),start=source.indexOf('const sessionDirection='),end=source.indexOf('const raceRoute=',start),code=ts.transpile(source.slice(start,end),{target:ts.ScriptTarget.ES2022});
 const context:any={demo:true,demoOptions:{direction:'reverse'},eventOptions:{direction:'opposing'},demoRaceDirection,directionForCar,pursuitSelected:()=>false,raceFormat:()=> 'laps',onlineRules:()=>null,clubRound:()=>null,activeTimeTrial:null,activeChallenge:null,customEvent:()=>true};vm.createContext(context);vm.runInContext(code,context);
 assert.equal(vm.runInContext('raceDirection(0)',context),'reverse');assert.equal(vm.runInContext('raceDirection(1)',context),'reverse');
 context.demoOptions.direction='opposing';assert.equal(vm.runInContext('raceDirection(0)',context),'forward');assert.equal(vm.runInContext('raceDirection(1)',context),'reverse');
 context.demo=false;context.eventOptions.direction='reverse';context.demoOptions.direction='forward';assert.equal(vm.runInContext('raceDirection(0)',context),'reverse');
 // Exercise the actual createCars grid expression with real course grid/route functions.
 const match=source.match(/const spawn=(courseGridSlot\([^\r\n]+\));/)!;assert.ok(match);
 Object.assign(context,{courseGridSlot,activeVenue:{course:getRaceCourse('rookvale-yard-v1')},pursuitGrid:null,waypointRace:null,i:0});context.demo=true;context.demoOptions.direction='reverse';
 const gridCode=ts.transpile('var slot='+match[1],{target:ts.ScriptTarget.ES2022});vm.runInContext(gridCode,context);
 assert.deepEqual(context.slot,courseGridSlot(context.activeVenue.course,0,'reverse'));
 assert.deepEqual(courseRoute(context.activeVenue.course,vm.runInContext('raceDirection(0)',context)),courseRoute(context.activeVenue.course,'reverse'));
});
