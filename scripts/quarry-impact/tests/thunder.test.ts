import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {THUNDER,Storm,flashLevel} from '../src/thunder';
test('a lightning flash is a pulse, a dip and a second pulse, gone within its time',()=>{
  assert.equal(flashLevel(0),1);assert.ok(flashLevel(THUNDER.flash*.3)<.5);assert.ok(flashLevel(THUNDER.flash*.5)>.5);
  assert.equal(flashLevel(THUNDER.flash),0);assert.equal(flashLevel(-1),0);assert.equal(flashLevel(NaN),0);
  let last=1;for(let t=THUNDER.flash*.6;t<THUNDER.flash;t+=.005){const v=flashLevel(t);assert.ok(v<=last+1e-12);last=v;}
});
test('lightning strikes now and then; its thunder follows as far behind as it is away, a crack when close, a quieter rumble far off',()=>{
  const run=(rs:number[])=>{let i=0;const s=new Storm(()=>rs[i++%rs.length]);const log:{t:number;flash:number;clap:any}[]=[];for(let k=0;k<60*80;k++){const r=s.step(1/60);log.push({t:k/60,...r});}return {s,log};};
  // gap 0 → first strike at THUNDER.gap[0] s; distance 0 → the nearest strike.
  const near=run([0,0]),strike=near.log.find(l=>l.flash>0)!,clap=near.log.find(l=>l.clap)!;
  assert.ok(Math.abs(strike.t-THUNDER.gap[0])<.05,'after its gap');
  assert.ok(Math.abs(clap.t-strike.t-THUNDER.distance[0]/THUNDER.sound)<.05&&clap.clap.near&&clap.clap.volume===THUNDER.loud,'close: the crack, soon after');
  const far=run([0,1]),fs=far.log.find(l=>l.flash>0)!,fc=far.log.find(l=>l.clap)!;
  assert.ok(Math.abs(fc.t-fs.t-THUNDER.distance[1]/THUNDER.sound)<.05&&!fc.clap.near&&Math.abs(fc.clap.volume-THUNDER.far[1])<1e-9,'far: the rumble, late and quiet');
  assert.ok(near.s.strikes>=2&&near.s.claps>=near.s.strikes-1,'again and again');
  const s=new Storm(()=>.5);s.strikeNow();assert.ok(s.step(1/60).flash>0&&s.strikes===1,'a forced strike');assert.deepEqual(s.step(0),{flash:flashLevel(1/60),clap:null});
});
test('the thunder plays on the ambience; main storms over offline rain events and flashes the lightning',()=>{
  const audio=readFileSync(new URL('../src/audio.ts',import.meta.url),'utf8'),main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(audio.includes("const id=near?'thunder-near':'thunder-far';")&&audio.includes('source.connect(gain).connect(this.ambientBus);source.start();this.thunders++;return true;'));
  assert.ok(main.includes("storm=!online?.active&&eventLighting==='rain'?new Storm(Math.random):null;lightning.intensity=0;"));
  assert.ok(main.includes("const s=storm.step(dt);lightning.intensity=s.flash*THUNDER.light;if(s.clap)sound.thunder(s.clap.near,s.clap.volume);}")&&main.includes('else if(lightning.intensity)lightning.intensity=0;'));
  assert.ok(readFileSync(new URL('../tools/destruction-audio.py',import.meta.url),'utf8').includes(" ('thunder-near', 'Close thunder: a sharp loud crack"));
});
