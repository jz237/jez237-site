import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace} from '../race-core.js';
import {stepNativeRaceHost} from '../native-race-host.js';
import {getCourse} from '../courses.js';
import {consumeNativeSprayAudio} from '../native-engine-audio.js';
const race=()=>createRace({mode:'versus',physics:'native',course:getCourse('greyhaven'),waveSeed:123});
const controls=[{throttle:1,steer:.2},{throttle:1,steer:-.3}];
test('actual native sound packets observe preceding spray levels before the post-world producer',()=>{
 const r=race(),host=r.nativeHost;let changed=0,heard=0;
 const owner=r.nativeContactAudio,advance=owner.advance;let produced;
 owner.advance=(adapters,field,records)=>{produced={left:[...records.sprayLeft1c5c],right:[...records.sprayRight1c60]};return advance(adapters,field,records);};
 assert.deepEqual(host.spray.levels(),[{left:0,right:0},{left:0,right:0}]);
 for(let i=0;i<180;i++){
  const previous=host.spray.levels();stepNativeRaceHost(host,.05,controls);
  const snapshot=owner.snapshot(),packets=snapshot.packets,next=host.spray.levels(),commands=owner.drain();
  assert.deepEqual(produced,{left:previous.map(s=>s.left),right:previous.map(s=>s.right)});
  for(let player=0;player<2;player++){
   const level=Math.max(previous[player].left,previous[player].right)&255;
   if(snapshot.globals[player?'secondaryMuted':'primaryMuted']){assert.equal(packets[player][17],level);continue;}
   assert.equal(packets[player][17],0,'source consumer clears the produced level');
   const packet=[...packets[player]];packet[16]=1;packet[17]=level;
   const expected=consumeNativeSprayAudio(packet,{channel:player,mixerLane:player?3:0,alternateEngine:0,courseIndex:1,random4562c:(Math.imul(snapshot.frame,1664525)+1013904223)>>>0}).commands.find(c=>c.consumer==='c0044');
   if(expected){
    const issued=commands.find(c=>c.player===player&&c.consumer==='c0044')??snapshot.effectPoll[player].spray;
    assert.deepEqual(issued.arguments,expected.arguments);heard++;
   }
  }
  assert.equal(host.spray.snapshot().frame,host.world.frames);
  if(JSON.stringify(previous)!==JSON.stringify(next))changed++;
 }
 assert.ok(changed>0);assert.ok(heard>0);
 const snapshot=host.spray.snapshot();snapshot.states[0].left=999;assert.notEqual(host.spray.levels()[0].left,999);
});
test('source spray levels and activity counter agree at30,60 and144Hz; inactive browser steps retain both',()=>{
 const histories=[];
 for(const hz of [30,60,144]){
  const r=race(),host=r.nativeHost;
  for(let i=0;i<hz*6;i++)stepNativeRaceHost(host,1/hz,controls);
  const before={spray:host.spray.snapshot(),scene:r.nativeLaunch.sprayInputs()};
  stepNativeRaceHost(host,1,controls,{active:false});
  assert.deepEqual({spray:host.spray.snapshot(),scene:r.nativeLaunch.sprayInputs()},before);
  histories.push(before);
 }
 assert.deepEqual(histories[0],histories[1]);assert.deepEqual(histories[1],histories[2]);
 assert.equal(histories[0].scene.frameCounter,120);
});
