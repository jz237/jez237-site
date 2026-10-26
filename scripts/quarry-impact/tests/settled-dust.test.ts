import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {SETTLE,TOP_DUST,settleStep} from '../src/settled-dust';
const run=(level:number,seconds:number,air:number,rain:number)=>{for(let i=0;i<seconds*60;i++)level=settleStep(level,1/60,air,rain);return level;};
test('the dust in the air settles on the cars over a minute or so, toward the most it holds',()=>{
  const minute=run(0,60,1,0);assert.ok(minute>SETTLE.max*.85&&minute<=SETTLE.max,'thick over a minute of thick dust');
  assert.ok(run(0,60,.3,0)<minute,'less in thinner dust');assert.equal(run(.2,30,0,0),.2,'clean air: it stays as it is');
});
test('the rain rinses it off',()=>{
  assert.ok(Math.abs(run(.5,20,0,1)-.5*Math.exp(-SETTLE.rinse*20))<1e-6,'at the rinse rate');assert.ok(run(.5,20,0,.3)>run(.5,20,0,1));
  assert.equal(settleStep(.4,NaN,1,1),.4,'no time, no change');assert.equal(settleStep(NaN,1/60,NaN,NaN),0);assert.equal(TOP_DUST.value,0,'clean to start');
});
test('the cars draw it on the faces that look up, and main settles it from the dust in the air offline',()=>{
  const surface=readFileSync(new URL('../src/vehicle-surface.ts',import.meta.url),'utf8'),main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(surface.includes('s.uniforms.carTopDust=TOP_DUST;')&&surface.includes('wakeDust=max(wakeDust,carTopDust*smoothstep(.35,.85,dot(normalize(vNormal),normalize((viewMatrix*vec4(0.,1.,0.,0.)).xyz)))'),'upward faces, the wake-dust film');
  assert.ok(main.includes("TOP_DUST.value=settleStep(TOP_DUST.value,dt,dustAir,eventLighting==='rain'?shower:0);"),'from the dust in the air, rinsed by the rain');
  assert.ok(main.includes('bodyRain.reset();TOP_DUST.value=0;'),'clean at the start of an event');
});
