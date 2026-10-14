import test from 'node:test';
import assert from 'node:assert/strict';
import {FrameDriver,type FrameHost} from '../lib/FrameDriver';

function clock(rafPeriod:number){
  let time=0,id=0,visible=true;
  const pending=new Map<number,{time:number;run:()=>void}>();
  const schedule=(run:()=>void,ms:number)=>{pending.set(++id,{time:time+ms,run});return id;};
  const host:FrameHost={now:()=>time,visible:()=>visible,request:f=>schedule(()=>f(time),rafPeriod),cancel:i=>{pending.delete(i);},delay:schedule,clear:i=>{pending.delete(i);}};
  return {host,setVisible:(v:boolean)=>visible=v,setRaf:(v:number)=>rafPeriod=v,advance:(duration:number)=>{
    const end=time+duration;
    while(true){const next=[...pending].sort((a,b)=>a[1].time-b[1].time)[0];if(!next||next[1].time>end)break;pending.delete(next[0]);time=next[1].time;next[1].run();}
    time=end;
  }};
}
test('a visible embedded view with 1 Hz animation callbacks still receives smooth frames',()=>{
  const c=clock(1000),frames:number[]=[],driver=new FrameDriver(t=>frames.push(t),c.host);driver.start();c.advance(5000);driver.stop();
  assert.ok(frames.length>=285,`${frames.length} frames over five seconds`);
  const gaps=frames.slice(1).map((t,i)=>t-frames[i]);assert.ok(Math.max(...gaps)<26);
  const count=frames.length;c.advance(2000);assert.equal(frames.length,count,'stop cancels both scheduling sources');
});
test('healthy animation callbacks retain display cadence without duplicate timer renders',()=>{
  for(const fps of [30,60,120]){
    const c=clock(1000/fps),frames:number[]=[],driver=new FrameDriver(t=>frames.push(t),c.host);driver.start();c.advance(2000);driver.stop();
    assert.ok(Math.abs(frames.length-fps*2)<=1,`${fps} Hz has ${frames.length} frames`);
    frames.slice(1).forEach((t,i)=>assert.ok(Math.abs(t-frames[i]-1000/fps)<1e-6));
  }
});
test('hidden views suspend drawing and a recovered rAF returns to display cadence',()=>{
  const c=clock(1000),frames:number[]=[],driver=new FrameDriver(t=>frames.push(t),c.host);driver.start();c.advance(2000);
  c.setVisible(false);const count=frames.length;c.advance(2000);assert.equal(frames.length,count);
  c.setVisible(true);c.setRaf(1000/60);c.advance(2000);
  const healthy=frames.filter(t=>t>5000);assert.ok(healthy.length>=58 && healthy.length<=61);driver.stop();
});
