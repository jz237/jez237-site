const {test} = require('node:test');
const assert = require('node:assert/strict');
const {JoustEngine} = require('../retro/assets/engine.js');
const {WORLD, PHYS} = require('../retro/assets/data.js');
const {ModernJoustEngine} = require('../modern/assets/flight.js');

function arena(Engine = ModernJoustEngine, mode = '1p') {
  const e = new Engine({seed:42, holdUntilInput:false, mode});
  e.platforms = [];
  const p = e.players[0];
  Object.assign(p, {x:140, y:185, vx:0, vy:0, vxi:0, onGround:false, safe:false, materializing:0});
  return {e, p};
}
function advance(e, p, input, ticks = 1) {
  let flaps = 0;
  for (let i = 0; i < ticks; i++) {
    e.events = [];
    e.controlPlayer(p, input);
    e.integrate(p);
    flaps += e.events.filter(x => x.type === 'flap').length;
  }
  return flaps;
}

test('air steering accelerates without flapping and reverses in under 200 ms', () => {
  const {e,p} = arena();
  advance(e,p,{right:true},12);
  assert.ok(p.vx >= 1.2);
  advance(e,p,{left:true},8);
  assert.ok(p.vx < 0);
  const old = arena(JoustEngine);
  advance(old.e,old.p,{right:true},12);
  assert.equal(old.p.vx,0, 'the original Retro controls must remain unchanged');
});
test('releasing direction stops drift within half a second and 16 native pixels', () => {
  const {e,p} = arena(); p.vx = 1.65;
  const x = p.x;
  advance(e,p,{},30);
  assert.ok(Math.abs(p.vx) < .08);
  assert.ok(p.x-x < 16);
});
test('held flap is slower, lifts gently, and rapid edges cannot bypass the rate limit', () => {
  const modern = arena(), retro = arena(JoustEngine), rapid = arena();
  const modernCount = advance(modern.e,modern.p,{flapHeld:true},60);
  const retroCount = advance(retro.e,retro.p,{flapHeld:true},60);
  assert.equal(modernCount,6); assert.equal(retroCount,10);
  assert.ok(modern.p.y > 145 && modern.p.y < 175);
  assert.ok(retro.p.y < 110);
  assert.ok(advance(rapid.e,rapid.p,{flap:true,flapHeld:true},60) <= 8);
});
test('sustained climb stays capped and releasing flap arrests the climb', () => {
  const {e,p} = arena();
  for(let i=0;i<300;i++) {
    p.y = 140; advance(e,p,{flapHeld:true});
    assert.ok(p.vy >= -1.6);
  }
  advance(e,p,{},60);
  assert.ok(p.vy > 0 && p.alive);
});
test('two strokes catch a fast fall while retaining a gentle rise', () => {
  const {e,p} = arena(); p.y = 120; p.vy = 3;
  advance(e,p,{flapHeld:true},11);
  assert.ok(p.vy < .3); assert.ok(p.y < 138); assert.ok(p.alive);
});
test('real platform side impact stays damped on subsequent physics ticks', () => {
  const {e,p} = arena();
  e.platforms = new JoustEngine().platforms.filter(x => x.id === 'midTop');
  Object.assign(p,{x:76,y:80.5,vx:1.65,vy:0,vxi:8,flapHeld:true});
  e.integrate(p);
  assert.ok(e.events.some(x=>x.type==='cthud' && x.platform==='midTop'));
  assert.ok(p.vx < 0 && p.vx >= -.28);
  const x = p.x;
  advance(e,p,{},12);
  assert.ok(Math.abs(p.x-x) < 3);
  assert.ok(Math.abs(p.vx) < .1);
});
test('platform underside and ceiling contacts produce a small vertical rebound', () => {
  const {e,p} = arena();
  e.platforms = new JoustEngine().platforms.filter(x => x.id === 'midTop');
  Object.assign(p,{x:174.5,y:88.5,vy:-1.6,flapHeld:true});
  e.integrate(p);
  assert.ok(e.events.some(x=>x.type==='cthud'));
  assert.ok(p.vy > 0 && p.vy <= .22);
  e.platforms=[];p.y=WORLD.CEIL+.3;p.vy=-1.6;
  e.integrate(p);
  assert.equal(p.y,WORLD.CEIL);assert.ok(p.vy > 0 && p.vy <= .18);
});
test('equal-height rider contact separates both masks without launching either player', () => {
  const {e,p} = arena(ModernJoustEngine,'2p'), q=e.players[1];
  Object.assign(p,{x:140,y:120,vx:1.65});
  Object.assign(q,{x:143,y:120,vx:-1.65,onGround:false,materializing:0,safe:false});
  e.bounce(p,q);
  assert.ok(!e.birdsOverlap(p,q));
  for(const bird of [p,q]) assert.ok(Math.abs(bird.vx) <= .45);
  advance(e,p,{right:true},3);
  assert.ok(p.vx > 0, 'steering can immediately recover from the knockback');
});
test('respawn resets the flap cooldown and allows an immediate takeoff', () => {
  const {e,p} = arena();
  p.flapCooldown=8;
  e.placeBird(p,100,204,1);
  e.controlPlayer(p,{flap:true});
  assert.equal(p.onGround,false);assert.ok(p.vy < 0);
});
test('a low rider can still escape the lava troll with held flap', () => {
  const {e,p} = arena();
  p.x=80;p.y=WORLD.FLOOR-18;p.vy=.3;
  p.grabbed={pull:PHYS.TROLL_PULL_BASE,t:0,x:p.x};
  e.trolls=[{bird:p}];
  for(let i=0;i<120 && p.grabbed && p.alive;i++) {
    advance(e,p,{flapHeld:true});e.updateTrolls();
  }
  assert.ok(p.alive && !p.grabbed);
});
test('enemies retain the same flight and flap behavior', () => {
  const modern=arena(), retro=arena(JoustEngine);
  const a={...modern.p,kind:'enemy',wingDown:0}, b={...retro.p,kind:'enemy',wingDown:0};
  for(let i=0;i<30;i++) {
    for(const [e,p] of [[modern.e,a],[retro.e,b]]) {
      if(i%7===0)e.doFlap(p,1);e.airMove(p,1,2);e.integrate(p);
    }
  }
  for(const key of ['x','y','vx','vy','vxi','wingDown']) assert.equal(a[key],b[key]);
});
test('modern control outcomes are identical at 30, 60 and 144 display Hz', () => {
  function run(hz) {
    const e = new ModernJoustEngine({seed:42,lives:5,holdUntilInput:false});
    let acc=0,tick=0;const step=1000/PHYS.TICK_HZ;
    for(let frame=0;frame<hz*8;frame++) {
      acc+=1000/hz;
      while(acc+1e-8>=step) {
        e.tick([{right:tick%180<90,left:tick%180>=90,flapHeld:tick%60<35}]);
        tick++;acc-=step;
      }
    }
    return {tick,players:e.players.map(p=>({x:p.x,y:p.y,lives:p.lives,score:p.score})),enemies:e.enemies.map(p=>({x:p.x,y:p.y,alive:p.alive}))};
  }
  assert.deepEqual(run(30),run(60));assert.deepEqual(run(60),run(144));
});
