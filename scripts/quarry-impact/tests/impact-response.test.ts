import test from 'node:test';
import assert from 'node:assert/strict';
import {ImpactResponse,impactSoundLayers} from '../src/impact-response';
test('impact spring agrees at 30,60,144 Hz and settles without altering a paused state',()=>{
  const run=(hz:number)=>{const r=new ImpactResponse();r.kick({x:1,y:.2,z:-.4},20,.7,-.6);for(let i=0;i<hz;i++)r.step(1/hz);return r;};
  const a=run(30);for(const hz of [60,144]){const b=run(hz);for(const k of ['x','y','z']as const)assert.ok(Math.abs(a.offset[k]-b.offset[k])<1e-14);assert.ok(Math.abs(a.roll-b.roll)<1e-14);}
  assert.ok(Math.hypot(a.offset.x,a.offset.y,a.offset.z)<1e-5);const frozen=JSON.stringify(a);a.step(0);a.step(NaN);assert.equal(JSON.stringify(a),frozen);
});
test('pileup recoil is bounded, directional and repair clears every spring component',()=>{
  const r=new ImpactResponse();for(let i=0;i<1000;i++)r.kick({x:1,y:0,z:0},100,1,0);
  assert.ok(Math.hypot(r.velocity.x,r.velocity.y,r.velocity.z)<=2.200001);
  r.step(1/60);assert.ok(r.offset.x>0&&r.offset.x<.05);assert.equal(r.offset.y,0);assert.equal(r.offset.z,0);assert.ok(r.roll<0&&Math.abs(r.roll)<.025);assert.equal(r.pitch,0);
  r.reset();assert.deepEqual(r,new ImpactResponse());r.kick({x:0,y:1,z:0},.5,0,0);assert.deepEqual(r,new ImpactResponse());
});
test('impact audio layers follow severity and actual breakage, with bounded levels and short tails',()=>{
  assert.deepEqual([2,8,24].map(d=>impactSoundLayers(d)[0].id),['impact-light','impact-medium','impact-heavy']);
  assert.deepEqual(impactSoundLayers(24,true,true).map(l=>l.id),['impact-heavy','glass','debris']);
  for(const d of [0,3,9,20,1000])for(const l of impactSoundLayers(d,true,true)){
    assert.ok(l.volume>=0&&l.volume<1);assert.ok(l.rate>=.9&&l.rate<=1.02);assert.ok(l.duration>0&&l.duration<=1.75);assert.ok(l.delay>=0&&l.delay<.1);
  }
});
