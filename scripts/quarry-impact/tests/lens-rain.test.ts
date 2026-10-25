import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {LENS_RAIN,LensRain,LensRainPass,lensRate,dropAlpha,type LensDrop} from '../src/lens-rain';
// A steady pseudo-random sequence so counts are repeatable.
const seq=()=>{let s=.37;return()=>(s=(s*9301+.49297)%1);};
const run=(seconds:number,raining:boolean,view:'chase'|'hood'|'dashboard',speed:number,rain=new LensRain(seq()))=>{for(let i=0;i<Math.round(seconds*60);i++)rain.step(1/60,raining,view,speed);return rain;};
test('drops land on the chase and hood lenses in the rain, more on the hood the faster it goes; none behind the windscreen or in the dry',()=>{
  assert.equal(lensRate(false,'chase',10),0);assert.equal(lensRate(true,'dashboard',10),0);
  assert.equal(lensRate(true,'chase',0),lensRate(true,'chase',30),'the chase camera rides behind the car');
  assert.ok(lensRate(true,'hood',30)>lensRate(true,'hood',0)*4,'the hood camera drives into the rain');assert.equal(lensRate(true,'hood',NaN),LENS_RAIN.rate.hood);
  const chase=run(2,true,'chase',10);assert.ok(Math.abs(chase.landed-LENS_RAIN.rate.chase*2)<=1,'about the rate');
  assert.ok(run(2,true,'hood',25).landed>chase.landed*2);assert.equal(run(2,false,'chase',10).landed,0);assert.equal(run(2,true,'dashboard',10).landed,0);
  const flood=run(30,true,'hood',60);assert.ok(flood.drops.length<=LENS_RAIN.max,'capped');
  assert.ok(chase.drops.every(d=>d.size>=LENS_RAIN.size[0]&&d.size<=LENS_RAIN.size[1]&&d.u>0&&d.u<1&&d.v>0&&d.v<1));
});
test('drops evaporate, faster out of the rain; big ones slide down; at speed the air strips them toward the edges',()=>{
  const lens=new LensRain(seq()),small:LensDrop={u:.5,v:.5,size:LENS_RAIN.size[0],age:0,life:3,vu:0,vv:0},big:LensDrop={u:.3,v:.6,size:LENS_RAIN.size[1],age:0,life:3,vu:0,vv:0};lens.drops.push(small,big);
  for(let i=0;i<60;i++)lens.step(1/60,true,'chase',0);
  assert.ok(lens.drops.includes(small)&&lens.drops.includes(big)&&Math.abs(small.v-.5)<1e-9&&big.v<.6-.01,'small drop sits, big drop slides');
  for(let i=0;i<30;i++)lens.step(1/60,false,'chase',0);assert.ok(!lens.drops.includes(small)&&!lens.drops.includes(big),'dry air: gone well inside their life');
  const kept=new LensRain(()=>.99),stays:LensDrop={u:.5,v:.5,size:20,age:0,life:3,vu:0,vv:0};kept.drops.push(stays);for(let i=0;i<90;i++)kept.step(1/60,true,'chase',0);assert.ok(kept.drops.includes(stays),'still there in the rain');
  const blown=new LensRain(()=>.99),edge:LensDrop={u:.8,v:.5,size:20,age:0,life:30,vu:0,vv:0};blown.drops.push(edge);for(let i=0;i<60;i++)blown.step(1/60,true,'chase',LENS_RAIN.blow*2);
  assert.ok(edge.u>.85,'pushed out toward the edge');
  const d:LensDrop={u:0,v:0,size:20,age:0,life:4,vu:0,vv:0};assert.equal(dropAlpha(d),1);assert.ok(dropAlpha({...d,age:3.5})<.5&&dropAlpha({...d,age:4})===0,'fades out at the end');
  const safe=new LensRain(seq());safe.step(NaN,true,'chase',NaN);safe.clear();assert.equal(safe.drops.length,0);
});
test('ploughing through a puddle throws water over the lens, rain or not, more the harder; none behind the windscreen',()=>{
  const splash=(plough:number,view:'chase'|'hood'|'dashboard',seconds=.5)=>{const lens=new LensRain(seq());for(let i=0;i<Math.round(seconds*60);i++)lens.splash(plough,1/60,view);return lens;};
  const hard=splash(2,'hood'),light=splash(.5,'hood');assert.ok(Math.abs(hard.splashed-2*LENS_RAIN.splash.rate*.5)<=1,'about the rate');assert.ok(hard.splashed>light.splashed*3);
  assert.equal(splash(2,'dashboard').splashed,0,'behind the glass');assert.equal(splash(0,'chase').splashed,0,'dry tyres');
  assert.ok(Math.abs(splash(99,'chase').splashed-LENS_RAIN.splash.most*LENS_RAIN.splash.rate*.5)<=1,'capped');assert.equal(splash(NaN,'chase').splashed,0);
  assert.ok(hard.drops.every(d=>d.size>=LENS_RAIN.splash.size[0]&&d.size<=LENS_RAIN.splash.size[1]&&d.life<=LENS_RAIN.splash.life[1]),'big, short-lived drops');
  assert.ok(splash(2.5,'chase',30).drops.length<=LENS_RAIN.max,'never more than the lens holds');
});
test('the lens pass draws this frame\'s drops at the screen\'s scale and switches off on a dry lens',()=>{
  const pass=new LensRainPass(),u=pass.material.uniforms;pass.setSize(1280,720);
  pass.setDrops([]);assert.ok(!pass.enabled&&u.count.value===0);
  pass.setDrops([{u:.4,v:.6,size:36,age:0,life:4,vu:0,vv:0}]);const d=(u.drops.value as T.Vector4[])[0];
  assert.ok(pass.enabled&&u.count.value===1&&Math.abs(d.z-18*720/1080)<1e-9&&d.w===1,'radius in pixels at 720 lines');
  const log:unknown[]=[];const renderer={setRenderTarget:(t:unknown)=>log.push(t),render(){}} as unknown as T.WebGLRenderer,read=new T.WebGLRenderTarget(4,4),write=new T.WebGLRenderTarget(4,4);
  pass.render(renderer,write,read);assert.ok(u.tDiffuse.value===read.texture&&log[0]===write);
  assert.ok(pass.material.fragmentShader.includes('vec2 look=(c-q*d.z*1.8'),'each drop shows the world upside down');pass.dispose();
});
test('main lays the drops on the lens after the haze, offline, outside demos and replays, frozen while paused',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes('composer.addPass(heatHaze);\ncomposer.addPass(lensRainPass);\n')&&main.indexOf('composer.addPass(lensRainPass);')<main.indexOf('composer.addPass(new OutputPass());'),'after the haze, before the output');
  const frame=main.indexOf('  updateHeatHaze();\n  updateLensRain(dt);\n');assert.ok(frame>0&&main.indexOf('  composer.render();\n',frame)-frame<260,'laid out just before each frame is drawn');
  assert.ok(main.includes('  const p=cars[0];if(live&&p?.extendedDamage)lensRain.splash(p.waterDrag.reduce((a,b)=>a+b,0)/AQUA.drag,dt,drivingCamera);'),'water off the tyres');
  assert.ok(main.includes("  if(state==='menu'||state==='lobby'||online?.active||studio||demo){")&&main.includes("lensRain.step(state==='paused'||state==='inspect'?0:dt,live&&eventLighting==='rain',drivingCamera,Math.abs(cars[0]?.speed??0),shower);"));
});
