import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {MIRRORS,hangingDamage,mirrorStateFor} from '../src/tired-mirrors';
import {MIRROR_HANG} from '../src/wreck-attachments';
const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
test('a young car keeps both mirrors; old ones hang one by its wire or have lost one, each its own side',()=>{
  for(let id=0;id<40;id++)assert.deepEqual(mirrorStateFor(id,MIRRORS.age-.01),{hanging:null,loose:0,gone:null});
  let hanging=0,gone=0;const sides=new Set<string>();
  for(let id=0;id<400;id++){const st=mirrorStateFor(id,.9);assert.ok(!(st.hanging&&st.gone),'one mirror or the other, not both');
    if(st.hanging){hanging++;sides.add(st.hanging);assert.ok(st.loose>=MIRRORS.loose[0]&&st.loose<=MIRRORS.loose[1]);}
    if(st.gone){gone++;sides.add(st.gone);}}
  assert.ok(Math.abs(hanging/400-MIRRORS.hang)<.08,`hanging ${hanging}`);assert.ok(Math.abs(gone/400-MIRRORS.gone)<.06,`gone ${gone}`);
  assert.deepEqual([...sides].sort(),['left','right']);
  assert.deepEqual(mirrorStateFor(7,.8),mirrorStateFor(7,.8),'the same car the same every time');
  assert.deepEqual(mirrorStateFor(Number.NaN,Number.NaN),{hanging:null,loose:0,gone:null});
});
test('the damage that leaves a mirror that loose is the knocked-mirror damage, short of falling off',()=>{
  for(const loose of [.55,.7,.9]){const d=hangingDamage(loose);assert.ok(Math.abs((d-MIRROR_HANG.start)/MIRROR_HANG.span-loose)<1e-9);}
  assert.ok(hangingDamage(5)<MIRROR_HANG.start+MIRROR_HANG.span,'never past fully hanging');assert.equal(hangingDamage(Number.NaN),MIRROR_HANG.start);
});
test('main wires it to offline rivals only, on their own mirrors, the gone one taken off quietly (no debris)',()=>{
  const at=main.indexOf('const st=mirrorStateFor(car.id,startingRust(car.id))'),line=main.slice(main.lastIndexOf('\n',at),main.indexOf('\n',main.indexOf('\n',at)+1));
  assert.ok(line.includes('if(car.extendedDamage&&i!==0){'),'offline, never the player');
  assert.ok(line.includes("a.name.startsWith('mirror')&&a.name.endsWith(side)"));
  assert.ok(line.includes('hang.damage=hangingDamage(st.loose);hang.loose=st.loose;'),'hangs as a knocked mirror does');
  assert.ok(line.includes('car.ripAssembly(gone.name,true)'),'gone before the start, not thrown off');
});
