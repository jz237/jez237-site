import test from 'node:test';import assert from 'node:assert/strict';
import {createPractice,advancePractice} from './practice.js';
import {step,drainEvents,wd} from './sim.js?v=26';
const tick=(s,n=1)=>{for(let i=0;i<n;i++){step(s.world,1/60);drainEvents(s.world);advancePractice(s);}};
test('practice waits for real movement and shots, then completes a real catch and landing',()=>{
 const s=createPractice(),W=s.world,p=W.players[0];tick(s,600);assert.equal(s.stage,'move');assert.equal(W.enemies.length,0);
 p.input.mx=1;tick(s,90);assert.equal(s.stage,'fire');p.input.mx=0;p.input.fire=true;tick(s,80);assert.equal(s.stage,'catch');p.input.fire=false;
 for(let i=0;i<600&&s.stage==='catch';i++){
  const dx=wd(s.settler.x-p.x),dy=s.settler.y-p.y;
  p.input.mx=Math.abs(dx)>1?Math.sign(dx):0;p.input.my=Math.abs(dy)>1?Math.sign(dy):0;tick(s);
 }
 assert.equal(s.stage,'land');assert.equal(W.stats.caught,1);p.input.mx=0;p.input.my=-1;
 for(let i=0;i<600&&s.stage!=='done';i++)tick(s);
 assert.equal(s.stage,'done');assert.equal(W.stats.landed,1);assert.equal(W.over,false);assert.equal(W.enemies.length,0);
});
test('missing a catch resets the lesson and a fresh lesson starts clean',()=>{
 const s=createPractice(),p=s.world.players[0];p.input.mx=1;tick(s,90);p.input.mx=0;p.input.fire=true;tick(s,80);p.input.fire=false;
 const id=s.settler.id;s.settler.st='dead';tick(s);assert.equal(s.stage,'catch');assert.equal(s.settler.st,'fall');assert.equal(s.settler.id,id);
 const fresh=createPractice();assert.equal(fresh.stage,'move');assert.equal(fresh.world.stats.fired,0);assert.equal(fresh.world.stats.landed,0);
});
