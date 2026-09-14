import test from 'node:test';import assert from 'node:assert/strict';
import {SPECIES,ROSTER} from '../species.js';
import {lengthForSlider,sliderForLength,classBounds,galleryCard,FIELD_MARKS,CLASS_ORDER,sizeClass,galleryList} from '../gallery.js';
test('the slider walks every species through its four size classes in order',()=>{
 for(const id of ROSTER){const sp=SPECIES[id];let prev=-1;
  for(let t=0;t<=1.0001;t+=.05){const L=lengthForSlider(sp,t);assert.ok(L>=prev-1e-9,id+' monotonic at '+t);prev=L;
   const expect=CLASS_ORDER[Math.min(3,Math.floor(t*4))];if(t>0&&t<1&&Math.abs(t*4-Math.round(t*4))>1e-6)assert.equal(sizeClass(sp,L),expect,id+' class at t='+t);}
  assert.ok(lengthForSlider(sp,0)>=sp.sizeRange[0]-1e-9);assert.ok(lengthForSlider(sp,1)>=sp.sizeRange[1]-1e-9,id+' legend top covers the size range');
  const [a,b,c]=classBounds(sp);assert.ok(sp.sizeRange[0]<a&&a<b&&b<c,id+' bounds nest');}
});
test('sliderForLength inverts lengthForSlider',()=>{
 for(const id of ROSTER){const sp=SPECIES[id];for(const t of [.05,.3,.55,.8,.97]){const L=lengthForSlider(sp,t);assert.ok(Math.abs(sliderForLength(sp,L)-t)<1e-6,id+' t='+t);}}
});
test('every species has three field marks and a complete card',()=>{
 assert.equal(galleryList().length,12);
 for(const id of ROSTER){assert.equal((FIELD_MARKS[id]||[]).length,3,id+' marks');
  const c=galleryCard(id,lengthForSlider(SPECIES[id],.6),{catches:[{species:id,lengthIn:12.5},{species:'other',lengthIn:20}]});
  assert.equal(c.sizeClass,'trophy');assert.ok(c.sizeText.includes('Trophy'));assert.ok(c.holds.length>3&&c.takes.length>3);assert.equal(c.caught,1);assert.equal(c.best,'12.5 in');}
 const m=galleryCard('musky',1.0,{catches:[]});assert.ok(m.notes.some(n=>/wire/.test(n))&&m.notes.some(n=>/Follows/.test(n)));assert.equal(m.best,null);
 assert.ok(galleryCard('crappie',.3,null).notes.some(n=>/Paper mouth/.test(n)));
});
