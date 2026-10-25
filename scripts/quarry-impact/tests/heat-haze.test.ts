import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {HAZE,exhaustHaze,bonnetHaze,fireHaze,hazeColumn,HeatHazePass,type HeatSource} from '../src/heat-haze';
const camera=()=>{const c=new T.PerspectiveCamera(52,16/9,.1,850);c.position.set(0,1,0);c.lookAt(0,1,-1);c.updateMatrixWorld(true);return c;};
const fire=(z:number,x=0):HeatSource=>({x,y:.8,z,radius:HAZE.fire.radius,rise:HAZE.fire.rise,pixels:HAZE.fire.pixels});
test('tailpipes shimmer harder under throttle and faintly in the rain; hot bonnets past their threshold; fires strongest',()=>{
  assert.ok(Math.abs(exhaustHaze(0,true,false)-HAZE.exhaust.pixels*HAZE.exhaust.idle)<1e-9,'tickover');
  assert.ok(Math.abs(exhaustHaze(1,true,false)-HAZE.exhaust.pixels)<1e-9,'full throttle');
  assert.ok(Math.abs(exhaustHaze(1,true,true)-HAZE.exhaust.pixels*HAZE.exhaust.rain)<1e-9,'rain');
  assert.equal(exhaustHaze(1,false,false),0,'dead engine');assert.equal(exhaustHaze(NaN,true,false),exhaustHaze(0,true,false));
  assert.equal(bonnetHaze(HAZE.bonnet.from,false),0);assert.ok(Math.abs(bonnetHaze(1,false)-HAZE.bonnet.pixels)<1e-9);assert.ok(bonnetHaze(.8,true)<bonnetHaze(.8,false)*.5);
  assert.equal(fireHaze(1,false),0);assert.equal(fireHaze(1,true),HAZE.fire.pixels);assert.ok(fireHaze(.05,true)>0,'a fresh fire already shimmers');
  assert.ok(HAZE.fire.pixels>HAZE.exhaust.pixels&&HAZE.exhaust.pixels>HAZE.bonnet.pixels*.9);
});
test('a heat column lands over its source on screen, weaker with distance; none behind the camera, off screen or too far',()=>{
  const cam=camera(),near=hazeColumn(fire(-8),cam)!,far=hazeColumn(fire(-30),cam)!;
  assert.ok(near&&far);assert.ok(Math.abs(near.u-.5)<1e-6&&near.v>.5,'centred, rising above the base');
  assert.ok(Math.abs(near.depth-8)<1e-6&&near.height>far.height*3&&near.width>far.width*3,'nearer, bigger');
  assert.ok(near.pixels>far.pixels&&Math.abs(near.pixels-HAZE.fire.pixels*(1-8/HAZE.far))<1e-9,'fades with distance');
  for(const s of [fire(5),fire(-HAZE.far-1),fire(-8,40),{...fire(-8),pixels:0},{...fire(-8),x:NaN}])assert.equal(hazeColumn(s,cam),null);
});
test('the pass lays out the nearest columns, switches off with nothing hot in view, and never samples the target it draws to',()=>{
  let aoOn=true;const pass=new HeatHazePass(()=>aoOn),u=pass.material.uniforms,cam=camera();pass.setSize(1920,1080);
  pass.setSources([],cam,1);assert.ok(!pass.enabled&&pass.columns===0,'nothing hot, no pass');
  pass.setSources(Array.from({length:HAZE.max+5},(_,i)=>fire(-6-i*2)),cam,2);
  assert.ok(pass.enabled&&pass.columns===HAZE.max&&u.count.value===HAZE.max,'capped');
  assert.ok((u.info.value as T.Vector4[])[0].y<(u.info.value as T.Vector4[])[1].y,'nearest first');
  const log:unknown[]=[];const renderer={setRenderTarget:(t:unknown)=>log.push(t),render(){}} as unknown as T.WebGLRenderer;
  const make=()=>new T.WebGLRenderTarget(4,4,{depthTexture:new T.DepthTexture(4,4)}),read=make(),write=make();
  pass.render(renderer,write,read);
  assert.ok(u.tDiffuse.value===read.texture&&u.tDepth.value===write.depthTexture,'with ambient occlusion on, the scene depth is in the other buffer');
  assert.ok(log.length===2&&log[0]!==write&&log[0]!==read&&log[1]===write,'drawn to its own target first, then copied on');
  aoOn=false;log.length=0;pass.render(renderer,write,read);assert.ok(u.tDepth.value===read.depthTexture,'without it, in the buffer being read');
  assert.ok(pass.material.fragmentShader.includes('float behind=smoothstep(')&&pass.material.fragmentShader.includes('perspectiveDepthToViewZ'),'things in front stay sharp');
  pass.dispose();
});
test('main runs the haze after ambient occlusion, from fires, tailpipes and hot bonnets, offline only',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes('composer.addPass(ao);\ncomposer.addPass(heatHaze);\ncomposer.addPass(new OutputPass());'));
  assert.ok(main.includes('  updateHeatHaze();\n  composer.render();'));
  assert.ok(main.includes("if(!hazeOff&&!online?.active&&!studio&&['countdown','playing','paused','wrecked','result','inspect'].includes(state))for(const c of cars){if(!c.extendedDamage)continue;"));
  assert.ok(main.includes('pixels:fireHaze(c.fireHeat??1,true)')&&main.includes('pixels:exhaustHaze(c.input?.throttle??0,true,wet)')&&main.includes('const hot=bonnetHaze(bonnetHeats.get(c)??0,wet);'));
});
