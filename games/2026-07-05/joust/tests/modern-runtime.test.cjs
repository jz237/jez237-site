const {test} = require('node:test');
const assert = require('node:assert/strict');
const {normalizeSave,defaults,capturePoses,interpolateSnapshot} = require('../modern/assets/runtime.js');
const {WORLD} = require('../retro/assets/data.js');
const {JoustEngine} = require('../retro/assets/engine.js');
const snap = e => ({players:[e],enemies:[],pteros:[],eggs:[]});

test('partial legacy saves preserve progress and recover every missing option',()=>{
  const s=normalizeSave({hi:9200,maxWave:8,opts:{sfx:.2,keys:{p1:{flap:'KeyZ'}}},stats:{kills:4}});
  assert.equal(s.hi,9200);assert.equal(s.maxWave,8);assert.equal(s.opts.quality,'high');assert.equal(s.opts.keys.p1.flap,'KeyZ');assert.equal(s.opts.keys.p2.flap,'KeyW');assert.equal(s.stats.deaths,0);assert.equal(s.stats.kills,4);
});
test('malformed saves cannot break audio, controls or option rendering',()=>{
  for(const raw of [null,[],{},'broken',{opts:{sfx:NaN,mus:-10,quality:'ultra',difficulty:4,lives:Infinity,keys:{p1:{flap:{}}}},stats:{kills:'oops'},scores:{}}]){
    const s=normalizeSave(raw);assert.ok(Number.isFinite(s.opts.sfx));assert.ok(s.opts.mus>=0&&s.opts.mus<=1);assert.equal(s.opts.quality,'high');assert.equal(s.opts.keys.p1.flap,'ArrowUp');assert.ok(Array.isArray(s.scores));
  }
});
test('one-time mount migration does not overwrite an intentional three-mount choice',()=>{
  assert.equal(normalizeSave({opts:{lives:3}}).opts.lives,5);
  assert.equal(normalizeSave({_rev2:true,opts:{lives:3}}).opts.lives,3);
});
test('scores are validated, sorted and capped',()=>{
  const s=normalizeSave({scores:[null,{initials:'invalid',score:3},...Array.from({length:15},(_,i)=>({initials:'AAA',score:i*100,wave:2}))]});
  assert.equal(s.scores.length,10);assert.equal(s.scores[0].score,1400);assert.equal(s.scores[9].score,500);
});
test('fresh default saves do not share nested controls or statistics',()=>{
  const a=defaults(),b=defaults();a.opts.keys.p1.flap='KeyZ';a.stats.kills=10;assert.equal(b.opts.keys.p1.flap,'ArrowUp');assert.equal(b.stats.kills,0);
});
test('render interpolation copies poses before the mutable engine snapshot advances',()=>{
  const e={id:1,x:100,y:100,alive:true,materializing:0};const s=snap(e);const prev=capturePoses(s);e.x=104;e.y=102;
  const r=interpolateSnapshot(s,prev,.25,WORLD);assert.equal(r.players[0].x,101);assert.equal(r.players[0].y,100.5);assert.equal(e.x,104);assert.equal(prev.get(1).x,100);
});
test('wrap interpolation crosses the seam in both directions, never the whole arena',()=>{
  for(const [x0,x1] of [[291,-9],[-9,291]]){
    const s=snap({id:1,x:x0,y:100,alive:true});const prev=capturePoses(s);s.players[0].x=x1;
    const x=interpolateSnapshot(s,prev,.5,WORLD).players[0].x;assert.ok(x<=-9||x>=291,`wrong seam position ${x}`);
  }
});
test('respawns and life transitions snap directly to the real simulation position',()=>{
  const s=snap({id:1,x:20,y:210,alive:false,materializing:0});const prev=capturePoses(s);
  s.players[0]={id:1,x:100,y:74,alive:true,materializing:60};assert.strictEqual(interpolateSnapshot(s,prev,.5,WORLD).players[0],s.players[0]);
});
test('interpolation cannot move the deterministic simulation at any display refresh rate',()=>{
  function run(hz){const e=new JoustEngine({seed:42,lives:5,holdUntilInput:false});let acc=0,tick=0;const step=1000/60.096154;
    for(let frame=0;frame<hz*8;frame++){acc+=1000/hz;let prev;while(acc+1e-8>=step){prev=capturePoses(e.snapshot());e.tick([{right:tick%180<90,left:tick%180>=90,flap:tick%7===0}]);tick++;acc-=step;}interpolateSnapshot(e.snapshot(),prev,acc/step,WORLD);}
    return {tick,players:e.players.map(p=>({x:p.x,y:p.y,lives:p.lives,score:p.score})),enemies:e.enemies.map(p=>({x:p.x,y:p.y,alive:p.alive}))};}
  assert.deepEqual(run(30),run(60));assert.deepEqual(run(60),run(144));
});
