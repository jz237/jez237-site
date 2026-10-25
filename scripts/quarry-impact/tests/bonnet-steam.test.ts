import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {BONNET_STEAM,bonnetHeat,steamRate} from '../src/bonnet-steam';
const run=(h:number,seconds:number,running:boolean,throttle:number,rpm:number)=>{for(let i=0;i<Math.round(seconds*60);i++)h=bonnetHeat(h,running,throttle,rpm,1/60);return h;};
test('an engine worked hard heats up within seconds, idling barely warms it, and a stopped one cools slowly',()=>{
  const hard=run(BONNET_STEAM.start,10,true,1,BONNET_STEAM.revs);assert.ok(hard>BONNET_STEAM.from+.15,'hot after ten seconds flat out');
  assert.ok(run(hard,600,true,1,BONNET_STEAM.revs)<=1,'never past 1');
  const idle=run(BONNET_STEAM.start,30,true,0,900);assert.ok(idle<BONNET_STEAM.from,'idling half a minute does not steam');
  const cooled=run(.8,60,false,1,0);assert.ok(Math.abs(cooled-(.8-BONNET_STEAM.cool*60))<1e-6,'cools at its rate once stopped');
  assert.equal(run(.01,100,false,0,0),0);assert.equal(bonnetHeat(NaN,true,1,7000,0),BONNET_STEAM.start);assert.equal(bonnetHeat(.5,true,NaN,NaN,0),.5);
  assert.ok(bonnetHeat(.5,true,NaN,NaN,1)<.5+BONNET_STEAM.idle,'unreadable pedal or revs count as idle');
});
test('rain on a hot bonnet steams harder the hotter it is',()=>{
  assert.equal(steamRate(BONNET_STEAM.from),0);assert.equal(steamRate(BONNET_STEAM.start),0);assert.ok(Math.abs(steamRate(1)-BONNET_STEAM.rate)<1e-9);
  assert.ok(steamRate(.8)>steamRate(.6)&&steamRate(.6)>0);assert.equal(steamRate(NaN),0);
});
test('main heats every offline engine and steams hot bonnets only in the rain',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes("const heat=bonnetHeat(bonnetHeats.get(c)??BONNET_STEAM.start,c.health>0&&!(c.engineStall!>0)&&!c.engineOut,c.input?.throttle??0,c.rpm??0,dt);bonnetHeats.set(c,heat);if(!wet)continue;"));
  assert.ok(main.includes("steamAt.set((Math.random()-.5)*.5,.6,(isRearEngineKind(c.kind)?-1:1)*DEFINITIONS[c.kind].halfLength*.45).applyQuaternion(c.root.quaternion).add(c.root.position);fx.emit(steamAt,1,5,.35);"),'over the engine, front or rear');
});
