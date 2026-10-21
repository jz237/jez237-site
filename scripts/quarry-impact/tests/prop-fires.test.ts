import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {PropFires,propKind,PROP_FIRE,type PropPoint} from '../src/prop-fires';
import {FluidSlicks} from '../src/fluid-leaks';
// Boolean assertions only around Three.js objects.
test('tyres and drums burn, other props do not',()=>{
 assert.equal(propKind('TorusGeometry'),'tyre');assert.equal(propKind('CylinderGeometry'),'drum');assert.equal(propKind('BoxGeometry'),null);assert.equal(propKind(undefined),null);
});
test('a tyre stack beside burning fuel catches, passes the fire up the stack, lights puddles round it and goes out',()=>{
 const s=new FluidSlicks(new T.Scene()),fires=new PropFires(),lit:number[]=[];fires.onIgnite=i=>lit.push(i);
 try{
  const props:PropPoint[]=[{x:.6,y:.13,z:0,kind:'tyre'},{x:.6,y:.4,z:0,kind:'tyre'},{x:.6,y:.67,z:0,kind:'tyre'},{x:8,y:.4,z:0,kind:'drum'},{x:.4,y:.2,z:.5,kind:null}];
  s.drip(0,0,0,2,.5);s.drip(.9,0,.6,0,.3);
  fires.update(0,props,s);assert.equal(fires.burning.size,0,'nothing burning yet');
  s.igniteAt(0,0,.02,true);let t=0;
  for(;t<1;t+=.1){s.advance(.1);fires.update(s.clock,props,s);}
  assert.ok(fires.burning.has(0)&&!fires.burning.has(3)&&!fires.burning.has(4),'the bottom tyre caught; the far drum and the box did not');
  for(;t<4;t+=.1){s.advance(.1);fires.update(s.clock,props,s);}
  assert.ok(fires.burning.has(1)&&fires.burning.has(2),'the fire climbed the stack');
  assert.ok(s.stats.burning+s.stats.burnt>=2,'the oil beside the stack caught from the tyres');
  props[0]={...props[0],x:3,z:2};const f=fires.fires(s.clock,props).find(x=>Math.abs(x.x-3)<1e-9&&Math.abs(x.z-2)<1e-9);assert.ok(f,'the flames follow a knocked tyre');
  assert.deepEqual(lit,[0,1,2]);
  for(;t<PROP_FIRE.tyre.burn+5;t+=.5){s.advance(.5);fires.update(s.clock,props,s);}
  assert.equal(fires.fires(s.clock,props).length,0,'burnt out');
 }finally{s.dispose();}
});
test('replays apply recorded prop ignitions at their times and rebuild after seeking back',async()=>{
 const {ReplaySlicks}=await import('../src/replay-slicks');
 const play=new ReplaySlicks([{time:2,position:[1,.4,1],kind:4,seed:.003},{time:5,position:[2,.4,1],kind:4,seed:.001}],new T.Scene());
 try{
  play.propKinds=['tyre','drum',null,'tyre'];
  play.update(3);assert.ok(play.props.burning.has(3)&&!play.props.burning.has(1));
  play.update(6);assert.equal(play.props.burning.get(1)?.kind,'drum');
  play.update(1);assert.equal(play.props.burning.size,0,'seeking back rebuilds');
 }finally{play.dispose();}
});
test('a burning drum blows up once at its own fixed time: a fireball, nearby puddles and props lit; replays show the same fireball',async()=>{
 const {DRUM_BLAST,drumBlastTime}=await import('../src/prop-fires');
 const s=new FluidSlicks(new T.Scene()),fires=new PropFires();
 try{
  const props:PropPoint[]=[{x:0,y:.44,z:0,kind:'drum'},{x:2,y:.13,z:0,kind:'tyre'}];s.drip(-2,0,1,0,.4);
  fires.ignite(0,'drum',0,props[0]);const at=drumBlastTime(0,0);
  assert.ok(at>=DRUM_BLAST.after&&at<=DRUM_BLAST.after+DRUM_BLAST.spread);
  let blasts=0,t=0;for(;t<at+3;t+=.1){s.advance(.1);blasts+=fires.update(s.clock,props,s).length;if(Math.abs(s.clock-at-.5)<.06)assert.ok(fires.fires(s.clock,props).some(f=>f.radius===DRUM_BLAST.size),'fireball');}
  assert.equal(blasts,1,'one blast');assert.ok(fires.burning.has(1),'the tyre beside it caught');assert.ok(s.stats.burning+s.stats.burnt>=1,'the oil 2 m away caught');
  const replay=new PropFires();replay.simulate=false;replay.ignite(0,'drum',0);
  assert.deepEqual(replay.update(at+.2,props,s),[],'replays never blow up on their own');
  assert.ok(replay.fires(at+.5,props).some(f=>f.radius===DRUM_BLAST.size),'but draw the same fireball');
 }finally{s.dispose();}
});
