import test from 'node:test';
import assert from 'node:assert/strict';
import {BangerAggression,bangerRaceActive,BANGER} from '../src/banger-race';
import {readEventOptions} from '../src/event-rules';
import {readDemoOptions} from '../src/demo-session';
const car=(id:number,x:number,z:number,fz=1)=>({id,health:100,current:{x,z},forward:{x:0,z:fz}});
test('banger races apply to custom lap races only and never stack with other finish rules',()=>{
 const on={banger:true as const};
 assert.ok(bangerRaceActive('race',true,false,'laps',on,{}));assert.ok(bangerRaceActive('race',true,true,'laps',{},on));
 assert.ok(!bangerRaceActive('derby',true,false,'laps',on,{}));assert.ok(!bangerRaceActive('race',true,false,'laps',{banger:true,teams:true},{}));assert.ok(!bangerRaceActive('race',true,false,'laps',{banger:true,raceDuration:90},{}));
 for(const read of [readEventOptions,readDemoOptions] as const){assert.equal(read(JSON.stringify({version:1,banger:true})).banger,true);
  for(const clash of [{teams:true},{elimination:true},{raceDuration:120},{pursuit:true}])assert.equal(read(JSON.stringify({version:1,banger:true,...clash})).banger,undefined,JSON.stringify(clash));
  assert.ok(!('banger' in read(JSON.stringify({version:1}))));}
});
test('a driver rams the nearest rival close ahead in short bursts, then cools down',()=>{
 const a=new BangerAggression(),me=car(0,0,0),near=car(1,0,6),far=car(2,0,30),behind=car(3,0,-5);
 // time 0: rota slot for id 0 is floor(0/2+0)%3===0
 assert.equal(a.target(me,[me,near,far,behind],0),1,'the nearest rival ahead');
 assert.equal(a.target(me,[me,near,far,behind],1),1,'keeps at it during the burst');
 assert.equal(a.target(me,[me,near,far,behind],BANGER.burst+.01),-1,'burst over');
 assert.equal(a.target(me,[me,near,far,behind],BANGER.burst+1),-1,'cooling down');
 const b=new BangerAggression();assert.equal(b.target(me,[me,far,behind],0),-1,'nobody close ahead');
 assert.equal(b.target(car(1,0,0),[car(1,0,0),car(0,0,6)],0),-1,'not this driver\'s turn in the rota');
 const c=new BangerAggression();const wrecked={...near,health:0};assert.equal(c.target(me,[me,wrecked],0),-1,'wrecks are left alone');
});
