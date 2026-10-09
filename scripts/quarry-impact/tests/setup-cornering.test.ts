import test from 'node:test';import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';
import{CAR_KINDS}from'../src/rules';import{stockSetup}from'../src/garage';
import{simulateCornering,simulateCorneringTrial,corneringInput}from'../src/setup-cornering';
import{simulateSetup}from'../src/setup-benchmark';
await R.init();
function finish<T>(run:Generator<void,T>){let next=run.next();while(!next.done)next=run.next();return next.value;}
test('all thirteen stock chassis complete both-surface cornering searches with a living supported car',()=>{
 const values=[];for(const kind of CAR_KINDS)for(const surface of ['asphalt','gravel']as const){const value=finish(simulateCornering(kind,stockSetup(kind),surface));assert.ok(value!==null&&value>50&&value<145,`${kind} ${surface}: ${value}`);values.push({kind,surface,value});}console.log(JSON.stringify(values));
});
test('reported passes complete a full real circle in both directions and excess speed fails',()=>{
 for(const direction of [-1,1]as const){
  const value=finish(simulateCorneringTrial('coupe',stockSetup('coupe'),'asphalt',24,direction));assert.ok(value.completed);assert.ok(value.radians>=Math.PI*2);assert.ok(value.maxError<=4);assert.ok(value.seconds>9&&value.seconds<15);assert.ok(value.speed>80&&value.speed<90);
  assert.equal(finish(simulateCorneringTrial('coupe',stockSetup('coupe'),'gravel',40,direction)).completed,false);
 }
});
test('the shared physics exposes tyre and surface differences without manufacturing a tuning bonus',()=>{
 const stock=stockSetup('coupe'),tires=stockSetup('coupe');tires.tires=3;
 const asphalt=finish(simulateCornering('coupe',stock,'asphalt'))!,gravel=finish(simulateCornering('coupe',stock,'gravel'))!,upgraded=finish(simulateCornering('coupe',tires,'gravel'))!;
 assert.ok(asphalt>gravel+5);assert.ok(upgraded>gravel+3);assert.deepEqual(finish(simulateCornering('coupe',stock,'asphalt')),asphalt);
 const before=JSON.stringify(stock);const measured=finish(simulateSetup('coupe',stock,'asphalt'));assert.equal(measured.cornering,asphalt);assert.equal(JSON.stringify(stock),before);
});
test('closing during a cornering attempt frees its physics world, including nested comparison cancellation',()=>{
 const live=new Set<R.World>(),create=R.World.prototype.createCollider,free=R.World.prototype.free;
 R.World.prototype.createCollider=function(...args){live.add(this);return create.apply(this,args);};
 R.World.prototype.free=function(){assert.ok(live.delete(this),'World is freed exactly once');return free.call(this);};
 try{
  const attempt=simulateCorneringTrial('van',stockSetup('van'),'gravel',24,1);assert.equal(attempt.next().done,false);assert.equal(live.size,1);attempt.return({completed:false,speed:0,target:24,direction:1,radians:0,maxError:0,seconds:0});assert.equal(live.size,0);
  const full=simulateSetup('coupe',stockSetup('coupe'),'asphalt');for(let i=0;i<100;i++)assert.equal(full.next().done,false);assert.equal(live.size,2);full.return({acceleration:null,speed:0,braking:null,cornering:null});assert.equal(live.size,0);
 }finally{R.World.prototype.free=free;R.World.prototype.createCollider=create;}
});
test('cornering control uses only bounded ordinary controls and rejects invalid trial parameters',()=>{
 const body={translation:()=>({x:40,y:1,z:0}),rotation:()=>({x:0,y:0,z:0,w:1})};
 const input=corneringInput(body,12,24,1);assert.ok(input.steer<0&&input.steer>=-1);assert.equal(input.throttle,1);assert.equal(input.handbrake,false);assert.equal(corneringInput(body,30,24,1).brake,1);
 for(const target of [0,7,41,NaN])assert.throws(()=>simulateCorneringTrial('coupe',stockSetup('coupe'),'asphalt',target,1).next());
});
