import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace} from '../race-core.js';
import {stepNativeRaceHost} from '../native-race-host.js';
import {getCourse} from '../courses.js';
const race=()=>createRace({mode:'versus',physics:'native',course:getCourse('greyhaven'),waveSeed:123});
const controls=[{throttle:1,steer:.2},{throttle:1,steer:-.3}];
test('actual native sound packets observe preceding spray levels before the post-world producer',()=>{
 const r=race(),host=r.nativeHost;let changed=0,heard=0;
 assert.deepEqual(host.spray.levels(),[{left:0,right:0},{left:0,right:0}]);
 for(let i=0;i<180;i++){
  const previous=host.spray.levels();stepNativeRaceHost(host,.05,controls);
  const packets=r.nativeContactAudio.snapshot().packets,next=host.spray.levels();
  assert.deepEqual(packets.map(p=>p[17]),previous.map(s=>Math.max(s.left,s.right)));
  assert.equal(host.spray.snapshot().frame,host.world.frames);
  if(JSON.stringify(previous)!==JSON.stringify(next))changed++;
  if(packets.some(p=>p[17]>0))heard++;
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
