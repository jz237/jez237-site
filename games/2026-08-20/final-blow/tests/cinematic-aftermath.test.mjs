import test from 'node:test';
import assert from 'node:assert/strict';
import {cinematicLanding,settleCinematicParticle} from '../engine/cinematic-aftermath.mjs';

function advance(p,dt) {
 p.life-=dt;p.vy+=p.gravity*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;
 p.vx*=p.drag;p.rotation=(p.rotation||0)+(p.spin||0)*dt;
 settleCinematicParticle(p);
}
test('all arenas use their own floor material; wet landings have no dry dust or chips',()=>{
 const materials={somerset:'water',cruise:'water',janney:'soil',vet:'grit',wildwood:'wood',buffet:'tile'};
 for(const [stage,material] of Object.entries(materials)) {
  const landing=cinematicLanding(stage,640,700,{random:()=>.5});
  assert.equal(landing.surface.material,material);
  assert.ok(landing.particles.some(p=>p.cinematicMaterial===material));
  if(material==='water') {
   assert.ok(landing.ripple);
   assert.ok(landing.particles.every(p=>p.kind==='sweat'));
  }else assert.equal(landing.ripple,null);
 }
});
test('solid debris bounces once and remains stationary above the floor at multiple tick rates',()=>{
 for(const dt of [1/30,1/60,1/120])for(const stage of ['janney','vet','wildwood','buffet']) {
  const chips=cinematicLanding(stage,640,700,{random:()=>.9}).particles.filter(p=>p.kind==='debris');
  for(let t=0;t<2;t+=dt)for(const p of chips){advance(p,dt);assert.ok(p.y<=p.groundY);}
  for(const p of chips) {
   assert.equal(p.bounced,true);assert.equal(p.resting,true);assert.ok(p.life>3);
   const location={x:p.x,y:p.y,rotation:p.rotation};
   for(let n=0;n<30;n++)advance(p,dt);
   assert.deepEqual({x:p.x,y:p.y,rotation:p.rotation},location);
  }
 }
});
test('water droplets disappear at contact without bouncing or sinking through the floor',()=>{
 for(const p of cinematicLanding('somerset',640,700,{random:()=>.5}).particles) {
  for(let n=0;n<90&&p.life>0;n++)advance(p,1/60);
  assert.ok(p.life<=0);assert.equal(p.y,p.groundY);assert.equal(p.bounced,false);
 }
});
test('reduced motion and quality limits suppress flying debris',()=>{
 for(const stage of ['somerset','janney']) {
  const reduced=cinematicLanding(stage,640,700,{reducedMotion:true});
  assert.deepEqual(reduced.particles,[]);
  if(reduced.ripple)assert.equal(reduced.ripple.still,true);
  assert.deepEqual(cinematicLanding(stage,640,700,{quality:0}).particles,[]);
  assert.ok(cinematicLanding(stage,640,700,{quality:.5}).particles.length<cinematicLanding(stage,640,700).particles.length);
 }
});
