import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
// cat.js imports Three at module level, so the rota is checked through the source rather than an import
const src=readFileSync(new URL('../cat.js',import.meta.url),'utf8');
test('the dock cat rota names the three cats and rotates by the day of the year',()=>{
 for(const n of ['Luca','Cosmo','Taco'])assert.ok(src.includes(`name:'${n}'`),n);
 assert.match(src,/export function catOfTheDay\(dayOfYear\)\{return CATS\[\(\(Math\.floor\(dayOfYear\)%CATS\.length\)\+CATS\.length\)%CATS\.length\];\}/);
 const CATS=[{name:'Luca'},{name:'Cosmo'},{name:'Taco'}];const catOfTheDay=d=>CATS[((Math.floor(d)%CATS.length)+CATS.length)%CATS.length];
 assert.equal(catOfTheDay(1).name,'Cosmo');assert.equal(catOfTheDay(3).name,'Luca');assert.equal(catOfTheDay(257).name,'Taco');assert.equal(catOfTheDay(-1).name,'Taco');
 const seen=new Set();for(let d=1;d<=9;d++)seen.add(catOfTheDay(d).name);assert.equal(seen.size,3);
});
