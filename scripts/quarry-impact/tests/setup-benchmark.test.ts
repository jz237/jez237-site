import test from 'node:test';
import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';
import {CAR_KINDS,type CarKind} from '../src/rules';
import {stockSetup,type Setup} from '../src/garage';
import {benchmarkKey,benchmarkSetup,simulateSetup,type BenchmarkSurface} from '../src/setup-benchmark';
await R.init();
function measure(kind:CarKind,setup=stockSetup(kind),surface:BenchmarkSurface='asphalt'){
 const run=simulateSetup(kind,setup,surface);let step=run.next();while(!step.done)step=run.next();return step.value;
}
test('every vehicle completes physical acceleration, speed and braking on both surfaces',()=>{
 const measurements=[];
 for(const kind of CAR_KINDS)for(const surface of ['asphalt','gravel']as const){
  const value=measure(kind,stockSetup(kind),surface);measurements.push({kind,surface,...value});
  assert.ok(value.acceleration!==null&&value.acceleration>1&&value.acceleration<40,JSON.stringify({kind,surface,value}));
  assert.ok(value.speed>100&&value.speed<240);assert.ok(value.braking!==null&&value.braking>3&&value.braking<200);
 }
 console.log(JSON.stringify(measurements));
});
test('actual tests expose the engine, armor and gearing tradeoffs and are reproducible',()=>{
 const stock=measure('coupe'),engine=stockSetup('coupe');engine.engine=3;
 const powerful=measure('coupe',engine);assert.ok(powerful.acceleration!<stock.acceleration!);assert.ok(powerful.speed>stock.speed);
 const armor=stockSetup('coupe');armor.armor=3;const heavy=measure('coupe',armor);assert.ok(heavy.acceleration!>stock.acceleration!);
 const short=stockSetup('coupe');short.tune.gearing=1;const geared=measure('coupe',short);assert.ok(geared.acceleration!<stock.acceleration!);assert.ok(geared.speed<stock.speed);
 assert.deepEqual(measure('coupe'),stock);
 console.log(JSON.stringify({stock,powerful,heavy,geared}));
});
test('comparison keys ignore cosmetic changes but distinguish every physical tuning field',()=>{
 const stock=stockSetup('van'),key=benchmarkKey('van',stock,'asphalt');
 const painted=structuredClone(stock);painted.paint=1;painted.trim=2;
 assert.equal(benchmarkKey('van',painted,'asphalt'),key);
 for(const field of ['engine','tires','armor']as const){const s=structuredClone(stock);s[field]=1;assert.notEqual(benchmarkKey('van',s,'asphalt'),key);}
 for(const field of Object.keys(stock.tune)as(keyof Setup['tune'])[]){const s=structuredClone(stock);s.tune[field]=.5;assert.notEqual(benchmarkKey('van',s,'asphalt'),key);}
 assert.notEqual(benchmarkKey('van',stock,'gravel'),key);
});
test('cooperative tests cancel safely before and during work and return isolated cached results',async()=>{
 const abort=new AbortController();abort.abort();await assert.rejects(benchmarkSetup('tern',stockSetup('tern'),'asphalt',abort.signal),{name:'AbortError'});
 const mid=new AbortController(),pending=benchmarkSetup('van',stockSetup('van'),'gravel',mid.signal);setTimeout(()=>mid.abort(),5);await assert.rejects(pending,{name:'AbortError'});
 const active=new AbortController(),a=await benchmarkSetup('compact',stockSetup('compact'),'asphalt',active.signal),expected={...a};a.speed=0;
 const b=await benchmarkSetup('compact',stockSetup('compact'),'asphalt',active.signal);assert.deepEqual(b,expected);
});

test('measurements match the rendered Vehicle driving path rather than a separate estimate',async()=>{
 const T=await import('three'),{templates}=await import('../src/assets'),{Vehicle}=await import('../src/vehicle');
 const model=new T.Group();for(const name of ['FL','FR','RL','RR']){const wheel=new T.Group();wheel.name='wheel_'+name;model.add(wheel);}
 templates.set('coupe',model);
 const setup=stockSetup('coupe');setup.engine=2;setup.armor=1;setup.tune.gearing=.4;
 const measured=measure('coupe',setup),world=new R.World({x:0,y:-9.81,z:0});world.timestep=1/60;
 world.createCollider(R.ColliderDesc.cuboid(50,.5,10000).setTranslation(0,-.5,0));
 const car=new Vehicle(0,'coupe',0xffffff,new T.Scene(),world,{emit(){},mark(){},detach(){}}as any,setup,{height:()=>0,surface:()=> 'asphalt'});
 try{
  car.body.setTranslation({x:0,y:1.2,z:0},true);
  const step=()=>{car.preStep(1/60);world.step();car.postStep(1/60,0);return car.body.linvel().z;};
  for(let i=0;i<180;i++)step();car.input.throttle=1;let acceleration:number|null=null,previous=0,speed=0;
  for(let i=0;i<2400;i++){speed=step();if(acceleration===null&&speed>=100/3.6)acceleration=(i+(100/3.6-previous)/(speed-previous))/60;previous=speed;}
  assert.ok(Math.abs(acceleration!-measured.acceleration!)<.001);assert.ok(Math.abs(speed*3.6-measured.speed)<.001);
 }finally{car.dispose();world.free();}
});
