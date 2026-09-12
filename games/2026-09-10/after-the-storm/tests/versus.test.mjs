import test from 'node:test';import assert from 'node:assert/strict';
import {createRace,stepRace,aiInput,handicapBoost} from '../race-core.js';
import {getCourse,COURSES} from '../courses.js';
import {playerInput,splitViewports} from '../player-input.js';
test('two players can select the same rider with independent tuning and inputs',()=>{
 const s=createRace({mode:'versus',rider:2,secondRider:2,tune:{engine:1},secondTune:{engine:-1}});s.phase='running';
 assert.equal(s.racers.length,2);assert.ok(s.racers.every(r=>r.human));assert.ok(s.racers[0].stats.speed>s.racers[1].stats.speed);
 for(let i=0;i<120;i++)stepRace(s,[{throttle:1},{}],1/60);
 assert.ok(s.racers[0].speed>s.racers[1].speed+3);
 const inputs=[playerInput({ArrowUp:true,ArrowLeft:true},null,0,true),playerInput({ArrowUp:true,ArrowLeft:true},null,1,true)];
 assert.equal(inputs[0].throttle,0);assert.equal(inputs[0].steer,0);assert.equal(inputs[1].throttle,1);assert.equal(inputs[1].steer,.8);
 assert.equal(playerInput({KeyW:true},null,1,true).throttle,0);
});
test('all competitive venues complete a head-to-head match through both control streams',()=>{
 for(const c of COURSES.filter(c=>c.id!=='practice')){const s=createRace({mode:'versus',course:getCourse(c.id),rider:0,secondRider:1,handicap:true});
 for(let i=0;i<36000&&s.phase!=='results';i++)stepRace(s,s.racers.map(r=>aiInput(s,r)),1/60);
 assert.equal(s.phase,'results',c.id);assert.equal(s.result.dq,'',c.id);assert.ok([0,1].includes(s.result.winner));assert.equal(s.racers[s.result.winner].passed,s.course.gates.length*3);}
});
test('catch-up assists only the trailing rider, is bounded and can be disabled',()=>{
 const s=createRace({mode:'versus',handicap:true}),[a,b]=s.racers;a.passed=5;b.passed=1;
 assert.equal(handicapBoost(s,a),0);assert.equal(handicapBoost(s,b),.12);s.handicap=false;assert.equal(handicapBoost(s,b),0);
});
test('a disqualification awards the other player; pause and restart reset both riders',()=>{
 const s=createRace({mode:'versus'});s.phase='running';s.racers[0].dq='Five missed buoys';stepRace(s,[{},{}],1/60);assert.equal(s.result.winner,1);
 const fresh=createRace({mode:'versus'});fresh.phase='paused';const before=JSON.stringify(fresh);stepRace(fresh,[{throttle:1},{throttle:1}],1/60);assert.equal(JSON.stringify(fresh),before);
 assert.ok(fresh.racers.every(r=>r.misses===0&&r.finishTime===null&&r.hydro.landingId===0));
});
test('split viewports cover both halves once, including odd-height windows',()=>{
 for(const h of [800,801]){const [top,bottom]=splitViewports(1200,h);assert.equal(bottom.y,0);assert.equal(top.y,bottom.height);assert.equal(top.y+top.height,h);assert.equal(top.width,1200);}
});
test('separate gamepad inputs keep analogue throttle and dead zones',()=>{
 const pad={axes:[.6],buttons:Array.from({length:10},()=>({value:0,pressed:false}))};pad.buttons[7].value=.4;
 const input=playerInput({},pad,1,true);assert.ok(input.steer<-.4&&input.steer>-.6,'mid-stick gives precise proportional steering');assert.equal(input.throttle,.4);assert.equal(playerInput({},null,0,true).throttle,0);
 pad.axes[0]=.05;assert.equal(playerInput({},pad,1,true).steer,0);
});
test('gamepad stunt modifier supports rotations, poses, dive and stick trim',()=>{const pad={axes:[0,-.5],buttons:Array.from({length:16},()=>({value:0,pressed:false}))};pad.buttons[4].pressed=true;for(const [button,trick] of [[3,'flip'],[2,'left'],[1,'right'],[12,'stand'],[15,'handstand'],[13,'backwards'],[0,'somersault']]){pad.buttons[button].pressed=true;const i=playerInput({},pad);assert.equal(i.trick,trick);assert.equal(i.lean,.5);if(button===0)assert.equal(i.dampen,false);pad.buttons[button].pressed=false;}pad.buttons[6].pressed=true;assert.equal(playerInput({},pad).dive,true);assert.equal(playerInput({},pad,1,true).trick,'');});
