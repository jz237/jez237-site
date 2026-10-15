import test from 'node:test';import assert from 'node:assert/strict';
import {createRace,stepRace,aiInput,handicapBoost,adjudicateGate,outsideCourse} from '../race-core.js';
import {getCourse,COURSES} from '../courses.js';
import {playerInput,splitViewports,splitPlayerAt,splitRenderViewports,createInputSampler} from '../player-input.js';
import {lensViewport} from '../finishing-effects.js';
import {initialSave,validateSave,exportSave,importSave} from '../race-records.js';
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
test('both gamepads support the full stunt modifier, dive and stick trim',()=>{const pad={axes:[0,-.5],buttons:Array.from({length:16},()=>({value:0,pressed:false}))};pad.buttons[4].pressed=true;for(const [button,trick] of [[3,'flip'],[2,'left'],[1,'right'],[12,'stand'],[15,'handstand'],[13,'backwards'],[0,'somersault']]){pad.buttons[button].pressed=true;for(const player of [0,1]){const i=playerInput({},pad,player,true);assert.equal(i.trick,trick);assert.equal(i.lean,.5);if(button===0)assert.equal(i.dampen,false);}pad.buttons[button].pressed=false;}pad.buttons[6].pressed=true;assert.equal(playerInput({},pad,0,true).dive,true);assert.equal(playerInput({},pad,1,true).dive,true);});

test('both split orientations cover odd physical pixels once at fractional DPI and target the matching camera',()=>{
 for(const [width,height,ratio] of [[1200,800,1],[1201,801,1],[1921,1081,1.25],[2561,1441,.789]])for(const layout of ['horizontal','vertical']){
  const w=Math.floor(width*ratio),h=Math.floor(height*ratio),views=splitViewports(w,h,layout),render=splitRenderViewports(w,h,layout,ratio),[a,b]=views;
  assert.equal(a.width*a.height+b.width*b.height,w*h);
  if(layout==='vertical'){assert.equal(a.x,0);assert.equal(a.x+a.width,b.x);assert.equal(b.x+b.width,w);assert.equal(a.height,h);assert.equal(b.height,h);}
  else{assert.equal(b.y,0);assert.equal(b.y+b.height,a.y);assert.equal(a.y+a.height,h);assert.equal(a.width,w);assert.equal(b.width,w);}
  for(const [i,v] of views.entries()){
   for(const key of ['x','y','width','height']){assert.equal(Math.round(render[i][key]*ratio),v[key]);assert.equal(Math.floor(render[i][key]*ratio),v[key],'shader and renderer must use the same physical pixels');}
   const top=h-v.y-v.height;
   assert.equal(splitPlayerAt(w,h,v.x+v.width/2,top+v.height/2,layout),i);
   const lens=lensViewport(v,w,h);assert.equal(lens.left,v.x/w*100);assert.equal(lens.top,top/h*100);assert.equal(lens.width,v.width/w*100);assert.equal(lens.height,v.height/h*100);
  }
  const boundary=layout==='vertical'?a.width:a.height;
  assert.equal(splitPlayerAt(w,h,layout==='vertical'?boundary-.01:w/2,layout==='vertical'?h/2:boundary-.01,layout),0);
  assert.equal(splitPlayerAt(w,h,layout==='vertical'?boundary:w/2,layout==='vertical'?h/2:boundary,layout),1);
 }
 assert.deepEqual(lensViewport({x:0,y:0,width:800,height:600},800,600),{left:0,top:0,width:100,height:100});
});

test('two-player Dolphin Park remains untimed with no laps, course-out penalties or catch-up assistance',()=>{
 const options={mode:'versus',course:getCourse('practice'),rider:2,secondRider:2,handicap:true},s=createRace(options);
 assert.equal(s.freeRide,true);assert.equal(s.phase,'running');assert.equal(s.racers.length,2);assert.ok(s.racers.every(r=>r.human&&r.power===5));
 assert.equal(s.course.freeStunts,true);assert.equal(s.course.ramps.length,4);assert.equal(s.course.rings.length,10);assert.deepEqual(s.course.checkpoints,[]);
 for(const r of s.racers)for(let circuit=0;circuit<4;circuit++)for(const g of s.course.gates){r.x=g.x+g.tx;r.z=g.z+g.tz;assert.equal(adjudicateGate(s,r,g.x-g.tx,g.z-g.tz),false);}
 const away=[[-300,-300],[300,300],[-280,200],[280,-200]].find(([x,z])=>s.course.ground(x,z)<-2&&outsideCourse(s.course,x,z));assert.ok(away,'park has open water outside the racing circuit');
 Object.assign(s.racers[1],{x:away[0],z:away[1]});
 for(let i=0;i<7200;i++)stepRace(s,[{},{}],1/60);
 assert.equal(s.phase,'running');assert.equal(s.result,null);assert.ok(s.time>119);
 for(const r of s.racers){assert.equal(r.stunt.remaining,38);assert.equal(r.stunt.complete,false);assert.equal(r.finishTime,null);assert.equal(r.lap,1);assert.equal(r.passed,0);assert.equal(r.misses,0);assert.equal(r.out,0);assert.equal(r.dq,'');assert.equal(handicapBoost(s,r),0);}
 s.phase='paused';const paused=JSON.stringify(s);stepRace(s,[{throttle:1},{throttle:1}],1/60);assert.equal(JSON.stringify(s),paused);
 s.racers.forEach(r=>{r.stunt.score=123;r.stunt.rings=2;});const restarted=createRace(options);assert.ok(restarted.racers.every(r=>r.stunt.score===0&&r.stunt.rings===0&&r.finishTime===null));
});

test('separate keyboard and gamepad stunt streams reach independent Dolphin Park physics',()=>{
 const sampler=createInputSampler(),keyboard={Digit1:true,KeyF:true,Numpad5:true,Quote:true};let pair=sampler(keyboard,{},[],true);
 assert.equal(pair[0].trick,'flip');assert.equal(pair[1].trick,'handstand');assert.ok(pair.every(i=>i.dive));
 pair=sampler({Numpad7:true,Quote:true},{},[],true);assert.equal(pair[0].trick,'');assert.equal(pair[0].dive,false);assert.equal(pair[1].trick,'somersault');assert.equal(pair[1].dive,true);
 const pad=()=>({axes:[0,0],buttons:Array.from({length:16},()=>({pressed:false,value:0}))}),pads=[pad(),pad()];pads[1].buttons[4].pressed=true;pads[1].buttons[3].pressed=true;pads[1].buttons[6].pressed=true;
 pair=sampler({}, {},pads,true);assert.equal(pair[0].trick,'');assert.equal(pair[0].dive,false);assert.equal(pair[1].trick,'flip');assert.equal(pair[1].dive,true);
 const s=createRace({mode:'versus',course:getCourse('practice'),seaState:'calm'});stepRace(s,[{},{}],1/60);
 // Both independent riders meet the native submarine speed/accelerator entry.
 for(const r of s.racers){Object.assign(r,{speed:20,vx:Math.sin(r.heading)*20,vz:Math.cos(r.heading)*20});Object.assign(r.hydro,{initialized:true,y:8,vy:-2,airborne:true,wet:0,intake:0});}pads.forEach(p=>{p.buttons[7].pressed=true;p.buttons[7].value=1;});pair=sampler({}, {},pads,true);
 stepRace(s,pair,1/60);assert.equal(s.racers[0].stunt.trick,null);assert.equal(s.racers[0].hydro.diveRemaining,0);assert.equal(s.racers[1].stunt.trick,'flip');assert.ok(s.racers[1].hydro.diveRemaining>1);
 pads[1].buttons[3].pressed=false;pads[1].buttons[6].pressed=false;pads[0].buttons[4].pressed=true;pads[0].buttons[2].pressed=true;pads[0].buttons[6].pressed=true;
 const secondAngle=s.racers[1].stunt.angle;stepRace(s,sampler({}, {},pads,true),1/60);assert.equal(s.racers[0].stunt.trick,'left');assert.ok(s.racers[0].hydro.diveRemaining>1);assert.equal(s.racers[1].stunt.angle,secondAngle);
});

test('display layout survives portable saves while legacy settings keep the horizontal default',()=>{
 const s=initialSave();s.versus={rider:1,tune:{},handicap:false,layout:'vertical'};assert.equal(importSave(exportSave(s)).versus.layout,'vertical');
 const legacy=structuredClone(s);delete legacy.versus.layout;assert.equal(validateSave(legacy).versus.layout??'horizontal','horizontal');s.versus.layout='diagonal';assert.throws(()=>validateSave(s),/two-player display/);
});
