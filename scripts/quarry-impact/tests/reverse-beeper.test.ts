import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {REVERSE_BEEPER,beeperOn,beeperWanted} from '../src/audio';
test('a van, a utility truck or the shuttle backing up with its electrics working sounds its alarm; cars do not',()=>{
  for(const kind of REVERSE_BEEPER.kinds)assert.equal(beeperWanted(kind,-2,true),true,kind);
  assert.equal(beeperWanted('coupe',-2,true),false,'a car has none');assert.equal(beeperWanted('van',2,true),false,'going forward');
  assert.equal(beeperWanted('van',-REVERSE_BEEPER.speed/2,true),false,'barely rolling');assert.equal(beeperWanted('van',-2,false),false,'dead electrics');assert.equal(beeperWanted('van',NaN,true),false);
});
test('it beeps: on for half of each second, each truck on its own beat',()=>{
  let on=0,edges=0,last=beeperOn(0,2);for(let i=1;i<=6000;i++){const b=beeperOn(i/1000,2);if(b)on++;if(b!==last)edges++;last=b;}
  assert.ok(Math.abs(on/6000-REVERSE_BEEPER.duty)<.01,'half the time');assert.ok(Math.abs(edges/2-6*REVERSE_BEEPER.hz)<=1,'once a second');
  assert.notDeepEqual(Array.from({length:20},(_,i)=>beeperOn(i/10,0)),Array.from({length:20},(_,i)=>beeperOn(i/10,1)),'out of step');
});
test('the audio keys the recorded alarm on and off while it backs up, and the clip is recorded',()=>{
  const audio=readFileSync(new URL('../src/audio.ts',import.meta.url),'utf8');
  assert.ok(audio.includes("this.driveLoops(this.beepers,'reverse-beeper',cars,listener,now,car=>beeperWanted(car.kind,car.speed,!car.electricalCut&&!car.batteryOut)&&beeperOn(now,car.id)?1:0,()=>1,REVERSE_BEEPER.level);"),'keyed by the beat');
  const manifest=JSON.parse(readFileSync(new URL('../public/audio/manifest.json',import.meta.url),'utf8')) as {id:string;loop?:boolean}[];
  assert.ok(manifest.some(a=>a.id==='reverse-beeper'),'recorded');
});
