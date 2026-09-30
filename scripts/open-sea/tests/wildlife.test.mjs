import test from 'node:test';import assert from 'node:assert/strict';
import { WildlifeMotion } from '../../../demos/open-sea/js/wildlife-motion.js';
const yacht={x:0,z:0,psi:.4},env={U:10,windDir:.55};
test('gulls have independent effort cycles and keep clear of the rig',()=>{
  const m=new WildlifeMotion();let flap=false,glide=false;
  for(let i=0;i<6000;i++){m.update(.05,yacht,env);for(const g of m.gulls){assert.ok(Math.hypot(g.x,g.z)>37);assert.ok(g.y>3);assert.ok(Math.abs(g.flap)<.6);flap ||= Math.abs(g.flap)>.3;glide ||= g.flap===-.07;}}
  assert.ok(flap&&glide);assert.ok(new Set(m.gulls.map(g=>g.phase.toFixed(3))).size>10);
});
test('encounters remain finite and bounded across hitches and repeat dives',()=>{
  const m=new WildlifeMotion();for(let i=0;i<10000;i++){m.update(i%67===0?20:.08,yacht,env);for(const w of m.whales){for(const k of ['x','y','z','phase','pitch','strength'])assert.ok(Number.isFinite(w[k]),k);assert.ok(w.y>=-29&&w.y<4);assert.ok(w.strength>=0&&w.strength<=.85);}}
  assert.ok(m.whales[0].events>5);assert.notEqual(m.whales[0].phase,m.whales[1].phase);
});
test('spray rings retain their world origin and decay, with brief rare breaches',()=>{
  const m=new WildlifeMotion();m.update(.01,yacht,env);const w=m.whales[0];w.events=2;w.age=12.15;m.update(.1,yacht,env);const origin=[...w.ringOrigin],strength=w.strength;
  for(let i=0;i<30;i++)m.update(.1,yacht,env);
  assert.deepEqual(w.ringOrigin,origin);assert.ok(w.strength<strength);assert.ok(w.y<0);assert.ok(m.rings({x:0,z:0}).every(Number.isFinite));
});
