import test from 'node:test';import assert from 'node:assert/strict';
import {AdaptiveGraphics,graphicsChoice}from'../src/adaptive-graphics';
import {exportSave,readSave}from'../src/save-backup';
const run=(g:AdaptiveGraphics,ms:number,seconds:number,active=true)=>{let changes=0;for(let t=0;t<seconds;t+=ms/1000)if(g.sample(ms,active))changes++;return changes;};
test('sustained slow driving lowers render cost; a brief stall does not; minimum level is bounded',()=>{
 const g=new AdaptiveGraphics();assert.equal(g.quality,'high');run(g,16.7,4);g.sample(500,true);run(g,16.7,2);assert.equal(g.quality,'high');assert.equal(run(g,40,5),1);assert.equal(g.quality,'medium');assert.equal(run(g,100,60),0);assert.equal(g.quality,'medium');
});
test('upgrades need sustained headroom and each switch has a warm-up period',()=>{
 const g=new AdaptiveGraphics();run(g,40,8);assert.equal(g.quality,'medium');run(g,16.7,18);assert.equal(g.quality,'medium');run(g,16.7,8);assert.equal(g.quality,'high');run(g,16.7,8);assert.equal(g.quality,'high');run(g,16.7,20);assert.equal(g.quality,'ultra');assert.equal(run(g,16.7,40),0);
});
test('menus, pause, hidden tabs, startup stalls and invalid samples cannot change levels',()=>{
 for(const invalid of [NaN,Infinity,0,-1,1000,5000]){const g=new AdaptiveGraphics();run(g,40,5);g.sample(invalid,true);run(g,40,2);assert.equal(g.quality,'high');}
 const g=new AdaptiveGraphics();run(g,40,5);run(g,40,60,false);run(g,40,2);assert.equal(g.quality,'high');
});
test('explicit settings stay fixed, selection restores manual levels and automatic state never becomes a preference',()=>{
 for(const quality of ['ultra','high','medium']as const){const g=new AdaptiveGraphics();g.configure(quality);assert.equal(run(g,100,60)+run(g,16,60),0);assert.equal(g.quality,quality);g.configure('auto');assert.equal(g.quality,'high');}
 for(const value of [undefined,null,17,'bad','auto'])assert.equal(graphicsChoice(value),'auto');
});
test('portable saves round-trip Auto and all older manual settings without changing their values',async()=>{
 for(const quality of ['auto','ultra','high','medium']){const storage={getItem:(key:string)=>key==='quarry-impact-v1'?JSON.stringify({quality,engine:.7}):null};const restored=await readSave(await exportSave(storage));assert.equal(JSON.parse(restored.entries['quarry-impact-v1']!).quality,quality);}
});
