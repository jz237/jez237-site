import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {AQUA,aquaGrip} from '../src/aquaplaning';
import {BALD,treadFor,treadAquaGrip,wetTreadGrip} from '../src/bald-tyres';
const src=(f:string)=>readFileSync(new URL('../src/'+f,import.meta.url),'utf8');
const main=src('main.ts'),vehicle=src('vehicle.ts'),lettering=src('tyre-lettering.ts');
test('a young car runs on good tyres; on old ones they are worn to the canvas, now and then one axle on a newer pair',()=>{
  for(let id=0;id<40;id++)assert.equal(treadFor(id,BALD.age-.01),null);
  let n=0,pairs=0;
  for(let id=0;id<400;id++){const t=treadFor(id,.9);if(!t)continue;n++;assert.equal(t.length,4);
    const worn=t.filter(v=>v<=BALD.tread[1]+1e-9);assert.ok(worn.length>=2&&t.every(v=>v>=BALD.tread[0]-1e-9&&v<=1));
    if(worn.length===2){pairs++;assert.ok(t[0]===t[1]||t[2]===t[3],'a newer pair goes on one axle');}}
  assert.ok(Math.abs(n/400-BALD.share)<.08,`${n}`);assert.ok(Math.abs(pairs/n-BALD.pair)<.12,`${pairs}/${n}`);
  assert.deepEqual(treadFor(3,.8),treadFor(3,.8));assert.equal(treadFor(Number.NaN,Number.NaN),null);
});
test('dry, a bald tyre grips as well as any; on a wet road it keeps less, the balder the less',()=>{
  for(const t of [0,.3,1])assert.equal(wetTreadGrip(t,0),1);
  for(const w of [0,.5,1])assert.equal(wetTreadGrip(1,w),1,'full tread as before');
  assert.ok(Math.abs(wetTreadGrip(0,1)-(1-BALD.wet))<1e-12);
  assert.ok(wetTreadGrip(.1,1)<wetTreadGrip(.4,1)&&wetTreadGrip(.4,1)<1);assert.ok(BALD.wet>=.1&&BALD.wet<=.3,'a real but not a hopeless loss');
  assert.equal(wetTreadGrip(Number.NaN,Number.NaN),1);
});
test('in standing water a bald tyre rides up sooner and loses more; full tread is exactly the old aquaplaning',()=>{
  for(const water of [0,.3,.7,1])for(const speed of [0,8,12,15,18,24,30])assert.equal(treadAquaGrip(water,speed,1),aquaGrip(water,speed));
  const early=AQUA.speed*(1-BALD.early*.9)+1;
  assert.equal(aquaGrip(1,early),1,'a treaded tyre still grips there');assert.ok(treadAquaGrip(1,early,.1)<1,'a bald one is already riding up');
  assert.ok(treadAquaGrip(1,AQUA.full,.1)<aquaGrip(1,AQUA.full));assert.ok(treadAquaGrip(1,AQUA.full,0)>=1-BALD.loss-1e-12);
  assert.equal(treadAquaGrip(0,30,.1),1,'no water, no aquaplaning');
});
test('the Vehicle applies tread after the pinned grip lines, offline only, and full tread leaves them alone',()=>{
  assert.ok(vehicle.includes('this.waterGrip[i]=aquaGrip(water,this.speed);this.waterDrag[i]=waterDrag(water,this.speed);\n      // A bald tyre cannot clear the water'));
  assert.ok(vehicle.includes('if(this.tread[i]<1)this.waterGrip[i]=treadAquaGrip(water,this.speed,this.tread[i]);'));
  assert.ok(vehicle.includes('this.tyreGrip[i]=tyreHeatGrip(this.tyreTemp[i]);}\n      if(this.extendedDamage&&this.tread[i]<1)this.tyreGrip[i]*=wetTreadGrip(this.tread[i],currentWetness());'));
  assert.ok(vehicle.includes('readonly tread=[1,1,1,1];'));
});
test('main seeds it on offline rivals only, before the tyres are lettered, and the lettering shows the worn face',()=>{
  const seed=main.indexOf('const tread=treadFor(car.id,startingRust(car.id))'),letter=main.indexOf('letterTyres(car.wheels,type,car.id,car.root,car.tread)');
  assert.ok(seed>0&&letter>seed);assert.ok(main.slice(main.lastIndexOf('\n',seed),seed).includes('if(car.extendedDamage&&i!==0){'));
  assert.ok(lettering.includes('const worn=Math.max(0,Math.min(1,1-(tread?.[k]??1)));')&&lettering.includes('letterWorn:{value:worn}'));
  assert.ok(lettering.includes('roughnessFactor*=1.-${BALD.shine.toFixed(2)}*letterFace;')&&lettering.includes("-lettered-v2'"));
});
