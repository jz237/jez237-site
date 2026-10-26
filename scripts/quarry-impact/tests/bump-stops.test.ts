import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {BUMP,bumpStrike} from '../src/bump-stops';
const dt=1/60,floor=.12,slam=(speed:number,gap:number,age=0)=>bumpStrike(floor+gap+speed*dt,floor+gap,floor,dt,true,true,age);
test('a corner closing fast onto its bump stop clunks, louder the faster; any car',()=>{
  const soft=slam(BUMP.speed+.1,.01),hard=slam(BUMP.full,.01),harder=slam(BUMP.full*3,0);
  assert.ok(soft.stop&&soft.volume>BUMP.volume[0]&&soft.volume<hard.volume,'louder the faster');assert.equal(hard.volume,BUMP.volume[1]);assert.equal(harder.volume,BUMP.volume[1],'capped');
  assert.equal(slam(BUMP.speed-.1,.01).volume,0,'eased onto it');assert.equal(slam(BUMP.full,BUMP.near+.02).volume,0,'well short of the stop, on a sound car');
});
test('not a landing, not in the air, nothing from bad numbers',()=>{
  assert.equal(bumpStrike(.2,.12,floor,dt,true,false).volume,0,'just landed (the landing has its own thump)');assert.equal(bumpStrike(.2,.12,floor,dt,false,true).volume,0,'in the air');
  assert.equal(bumpStrike(NaN,.12,floor,dt,true,true).volume,0);assert.equal(bumpStrike(.2,.12,NaN,dt,true,true).volume,0);assert.equal(bumpStrike(.2,.12,floor,0,true,true).volume,0);
  assert.equal(bumpStrike(.12,.2,floor,dt,true,true,1).volume,0,'opening up');
});
test('an old banger’s worn bushes knock on any sharp compression, quieter than the stop and more the older',()=>{
  const mid=slam(BUMP.knock+.4,.1,.6),old=slam(BUMP.knock+.4,.1,1);
  assert.ok(!old.stop&&old.volume>0&&old.volume<=BUMP.knockVolume[1],'a worn knock');assert.ok(mid.volume<old.volume,'more the older');
  assert.equal(slam(BUMP.knock+.4,.1,BUMP.worn-.01).volume,0,'not worn yet');assert.equal(slam(BUMP.knock-.1,.1,1).volume,0,'eased down');
  assert.ok(slam(BUMP.full,.1,1).volume<=BUMP.knockVolume[1]&&BUMP.knockVolume[1]<BUMP.volume[1],'never as loud as the stop');
});
test('main clunks offline cars’ corners with the recorded takes, once a corner per gap, with a QA count',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8'),manifest=JSON.parse(readFileSync(new URL('../public/audio/manifest.json',import.meta.url),'utf8')) as {id:string}[];
  assert.ok(BUMP.clips.every(id=>manifest.some(m=>m.id===id)),'the three takes are recorded');
  assert.ok(main.includes('floor=(c.controller.wheelSuspensionRestLength(i)??NaN)-(c.controller.wheelMaxSuspensionTravel(i)??NaN);'),'fully compressed is rest less travel');
  assert.ok(main.includes('const strike=bumpStrike(b.len[i],now,floor,dt,grounded,b.ground[i],c.surfaceFinish.rustAge);'),'by the car’s age');
  assert.ok(main.includes('if(strike.volume>0&&clock-b.at[i]>=BUMP.gap){b.at[i]=clock;')&&main.includes('sound.clip(BUMP.clips[bumpTake++%BUMP.clips.length],steamAt,strike.volume,BUMP.duration);'),'rotating takes, at the wheel');
  assert.ok(main.includes("if(state==='playing')for(const c of cars){if(!c.extendedDamage||c.health<=0)continue;let b=bumpState.get(c);"),'offline, running cars');
});
