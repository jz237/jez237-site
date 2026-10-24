import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {TIP,tBoner,tipsOver,tipLift} from '../src/ride-up';
const car=(x:number,z:number,fx:number,fz:number,vx:number,vz:number)=>({c:{x,z},f:{x:fx,z:fz},v:{x:vx,z:vz},half:2.2});
test('a fast nose-first T-bone into a flank is a tip-over; end hits and slow taps are not',()=>{
 const broadside=car(0,0,1,0,0,0),ram=car(0,-3.2,0,1,0,14),flank={x:0,z:-.95};
 assert.equal(tBoner(TIP.closing,ram,broadside,flank),0);assert.equal(tBoner(TIP.closing,broadside,ram,flank),1,'either order');
 assert.equal(tBoner(TIP.closing-.1,ram,broadside,flank),-1,'too slow');
 assert.equal(tBoner(TIP.closing,ram,broadside,{x:2.1,z:-.5}),-1,'an end hit');
 assert.ok(tipLift(TIP.closing)===TIP.lift&&tipLift(TIP.closing+2)>TIP.lift&&tipLift(99)===TIP.maxLift,'harder hits roll it further, capped');
 let n=0;for(let s=0;s<400;s++)if(tipsOver(s))n++;assert.ok(Math.abs(n/400-TIP.chance)<.08);
});
test('the tip-over lifts the struck side at its sill, offline only, once per car per gap',()=>{
 const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
 assert.ok(main.includes('if(hitter&&victim&&elapsed-(tipAt.get(victim.id)??-1e9)>=TIP.gap&&tipsOver('));
 assert.ok(main.includes('const sill=victim.right.clone().multiplyScalar(flank*DEFINITIONS[victim.kind].halfWidth*.9).add(victim.current);sill.y-=.25;'),'the side that was hit');
 assert.ok(main.includes('victim.body.applyImpulseAtPoint({x:0,y:victim.body.mass()*tipLift(closing),z:0},{x:sill.x,y:sill.y,z:sill.z},true);'));
 assert.ok(main.includes('tipAt.clear();tipOvers=0;'),'reset each event');
 assert.ok(main.includes(' rollPops: c.rollPops, rolls: c.rolls,'),'rollovers are now visible to the QA probes');
});
