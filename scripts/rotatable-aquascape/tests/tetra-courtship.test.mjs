import {swimPhase} from '../lib/TetraKinematics.ts';
import test from 'node:test';
import assert from 'node:assert/strict';
import {TetraCourtship,advanceCourtshipSwim} from '../lib/TetraCourtship.ts';
import {createTetraSwim} from '../lib/TetraSwimming.ts';
import {swimForFood} from '../lib/TetraFeeding.ts';
const pair=()=>{const a=createTetraSwim(1),b=createTetraSwim(2);Object.assign(a,{x:900,y:320,z:.2});Object.assign(b,{x:900,y:320,z:.6});return [a,b];};
test('only an aligned adjacent pair displays, with pause, interruption and a long independent cooldown',()=>{
 const fish=pair(),c=new TetraCourtship(55);c.remaining=0;c.update(0,fish,false);assert.equal(fish[0].courtship,0);
 c.update(.02,fish,false);assert.ok(fish.every(s=>s.courtship>1));assert.ok(c.remaining>=55);
 for(let i=0;i<120;i++){for(const s of fish)advanceCourtshipSwim(s,1/60);c.update(1/60,fish,false);assert.ok(Math.abs(fish[0].z-fish[1].z)*180>58);}
 c.update(.02,fish,true);assert.ok(fish.every(s=>s.courtship===0));
 c.remaining=0;c.update(.02,fish,true);assert.equal(fish[0].courtship,0);assert.ok(c.remaining>=18);
});
test('no display for head-on, crowded, feeding or startled fish',()=>{
 for(const change of [f=>f[1].yaw=Math.PI,f=>f[1].z=.25,f=>f[0].feedingPhase='pause',f=>f[0].startleRemaining=1]){const f=pair(),c=new TetraCourtship(7);change(f);c.remaining=0;c.update(.02,f,false);assert.equal(f[0].courtship,0);}
});
test('post-bite departure uses quiet propulsion, not a courtship body stroke',()=>{
 const s=createTetraSwim();Object.assign(s,{feedingPhase:'pause',effort:.04,speed:0});
 for(let i=0;i<30;i++)swimForFood(s,1/60,undefined,{food:[],neighbors:[],daylight:1},false);
 assert.equal(s.feedingPhase,'depart');assert.ok(s.effort<.06);assert.ok(s.speed<=24);assert.equal(s.courtship,0);
});
test('courtship schedules vary by session and cannot consume food',()=>{
 assert.notEqual(new TetraCourtship(1).remaining,new TetraCourtship(2).remaining);
 const s=pair()[0];s.courtship=1.8;for(let i=0;i<100;i++)advanceCourtshipSwim(s,1/60);
 assert.equal(s.brain.consumedFood,null);assert.equal(s.yaw,0);assert.ok(s.effort<1.4);
});

test('paired display stops forward travel and holds several rapid body cycles before gliding',()=>{
 const f=pair(),c=new TetraCourtship(77);c.remaining=0;c.update(.02,f,false);assert.ok(f[0].courtship>=3.8);
 for(let i=0;i<45;i++)advanceCourtshipSwim(f[0],1/60);assert.ok(f[0].speed<.1);assert.ok(f[0].effort>1.2);
 for(let i=0;i<150;i++)advanceCourtshipSwim(f[0],1/60);assert.ok(f[0].courtship>0);assert.ok(f[0].speed<.01);
 for(let i=0;i<120;i++)advanceCourtshipSwim(f[0],1/60);assert.equal(f[0].courtship,0);assert.ok(f[0].effort<.06);
});

test('courtship doubles body-wave frequency without accelerating swimming or the display clock',()=>{
 for(const dt of [1/60,.05,.1]){const normal=swimPhase(2,dt,1.35)-2,display=swimPhase(2,dt,1.35,true)-2;assert.ok(Math.abs(display-normal*2)<1e-10);}
 assert.equal(swimPhase(2,0,1.35,true),2);
});

test('one partner begins first and the other responds after a short delay',()=>{
 const f=pair(),c=new TetraCourtship(23);c.remaining=0;c.update(.02,f,false);
 const lead=f.find(s=>s.courtshipDelay===0),follow=f.find(s=>s.courtshipDelay>0);assert.ok(lead&&follow);assert.ok(follow.courtshipDelay>=.15&&follow.courtshipDelay<=.25);
 for(const s of f){s.effort=.025;advanceCourtshipSwim(s,.1);}
 assert.ok(lead.courtshipAge>.09);assert.equal(follow.courtshipAge,0);assert.ok(lead.effort>follow.effort);
 for(let i=0;i<20;i++)advanceCourtshipSwim(follow,1/60);assert.ok(follow.courtshipAge>0);
});
