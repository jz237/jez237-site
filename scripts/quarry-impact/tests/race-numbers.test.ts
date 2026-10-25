import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {withRaceNumbers,SPONSORS} from '../src/race-numbers';
import {normalizeLivery} from '../src/livery-data';
import {newLayer,LIVERY_LIMIT} from '../src/livery-data';
test('a rival without a number gets a white roundel with its number on both doors and the roof',()=>{
 const l=withRaceNumbers([],7)!;
 assert.equal(l.length,10);assert.deepEqual(l.filter(x=>x.shape==='number').map(x=>x.face).sort(),['left','right','top']);
 assert.ok(l.filter(x=>x.shape==='number').every(x=>x.text==='7'));assert.equal(l.filter(x=>x.shape==='circle').length,3);
 const own=[newLayer('stripe','left')];assert.equal(withRaceNumbers(own,3)!.length,11,'added on top of its own livery');
});
test('an own number or lettering, a full livery or a bad number leaves the livery alone',()=>{
 assert.equal(withRaceNumbers([newLayer('number','left')],3),null);assert.equal(withRaceNumbers([newLayer('text','top')],3),null);
 assert.equal(withRaceNumbers(Array.from({length:LIVERY_LIMIT-2},()=>newLayer('stripe','left')),3),null,'no room');
 assert.equal(withRaceNumbers([],0),null);assert.equal(withRaceNumbers([],1.5),null);
 assert.ok(readFileSync(new URL('../src/main.ts',import.meta.url),'utf8').includes("if(!attract&&!online?.active&&i>0&&mode==='derby'){const numbered=withRaceNumbers(car.setup.livery,i+1);if(numbered)car.livery.set(numbered);"),'derby rivals only, offline; the player keeps their own livery');
});
test('each rival carries a fictional local sponsor on both rear flanks, short enough to survive the livery limits',()=>{
 const l=withRaceNumbers([],3)!,s=l.filter(x=>x.name==='SPONSOR');
 assert.deepEqual(s.map(x=>x.face).sort(),['left','right']);assert.ok(s.every(x=>x.shape==='text'&&x.text===SPONSORS[2]));
 assert.equal(s[0].x+s[1].x,1,'mirrored so both sit at the same end of the car');
 const panels=l.filter(x=>x.name==='SPONSOR PANEL');assert.ok(panels.length===2&&panels.every(p=>p.shape==='stripe'&&p.color===0xf4f2ea&&s.some(t=>t.face===p.face&&t.x===p.x&&p.width>t.width&&l.indexOf(p)<l.indexOf(t))),'black lettering on a white sticker so it reads on any paint');
 assert.ok(SPONSORS.every(n=>n.length<=16&&n===n.toUpperCase()));assert.deepEqual(normalizeLivery(s),s,'survives the livery normaliser unchanged');
 assert.equal(withRaceNumbers([],SPONSORS.length+3)!.find(x=>x.name==='SPONSOR')!.text,SPONSORS[2],'wraps round the list');
});
test('each rival has a sprayed slogan across its bonnet, in a colour that shows on its paint, read by whoever it is coming at',async()=>{
 const {withSlogan,SLOGANS,SLOGAN}=await import('../src/race-numbers');
 const dark=withSlogan([],2,0x1d2f6b)!,s=dark.at(-1)!;assert.ok(s.face==='top'&&s.shape==='text'&&s.name==='SLOGAN'&&s.text===SLOGANS[1]);
 assert.equal(s.color,SLOGAN.light,'spray yellow on dark paint');assert.equal(withSlogan([],2,0xf1e05a)!.at(-1)!.color,SLOGAN.dark,'black on light paint');
 assert.ok(s.y>.7&&s.rotation===0,'at the foot of the top face (the bonnet), upright for someone in front');assert.ok(SLOGANS.every(t=>t.length<=16&&t===t.toUpperCase()));
 assert.equal(withSlogan([{...s,name:'OWN'}],2,0),null,'a roof face with lettering of its own is left alone');assert.equal(withSlogan([],0,0),null);
 const {normalizeLivery}=await import('../src/livery-data');assert.deepEqual(normalizeLivery([s]),[s],'survives the livery normaliser');
 assert.ok(readFileSync(new URL('../src/main.ts',import.meta.url),'utf8').includes("{const sloganed=withSlogan(numbered??car.setup.livery,i+1,car.paintColor.getHex());if(sloganed)car.livery.set(sloganed);}"));
});
