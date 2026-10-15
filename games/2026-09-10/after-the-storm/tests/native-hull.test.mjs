import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeHull,stepNativeHull,applyNativeHullContact,NATIVE_HULL_STEP} from '../native-hull.js';

const close=(a,b,epsilon=1e-10)=>assert.ok(Math.abs(a-b)<=epsilon,`${a} ≠ ${b}`);
const vecClose=(a,b,epsilon=1e-10)=>{for(const axis of ['x','y','z'])close(a[axis],b[axis],epsilon);};
const dot=(a,b)=>a.x*b.x+a.y*b.y+a.z*b.z;
const cross=(a,b)=>({x:a.y*b.z-a.z*b.y,y:a.z*b.x-a.x*b.z,z:a.x*b.y-a.y*b.x});
const mean=(points,field)=>Object.fromEntries(['x','y','z'].map(axis=>
  [axis,points.reduce((sum,p)=>sum+p[field][axis],0)/points.length]));
const minus=(a,b)=>({x:a.x-b.x,y:a.y-b.y,z:a.z-b.z});

test('source point geometry has the requested center and distinct rider damping',()=>{
  const hull=createNativeHull({position:{x:10,y:3,z:-8}});
  vecClose(mean(hull.points,'position'),{x:10,y:3,z:-8});
  assert.equal(hull.points.length,12);
  assert.equal(hull.restLengths.length,66);
  close(hull.points[0].position.x,9.7);
  close(hull.points[0].position.y,2.825);
  close(hull.points[0].position.z,-8.9);
  // Radius-maximal upper bow/stern points use the outer rider coefficient.
  close(hull.points[1].damping,.57);
  close(createNativeHull({rider:1}).points[1].damping,.49);
  assert.ok(hull.points[8].damping>hull.points[1].damping);
  const other=createNativeHull();
  hull.points[0].velocity.x=100;
  assert.equal(other.points[0].velocity.x,0);
});

test('pair constraints preserve the centroid of independently predicted points',()=>{
  const hull=createNativeHull({position:{x:4,y:2,z:-10}});
  hull.points[3].velocity.y=12;
  hull.points[7].velocity.x=-7;
  hull.points[11].velocity.z=4;
  const initial=mean(hull.points,'position'),velocity=mean(hull.points,'velocity');
  stepNativeHull(hull,.01);
  vecClose(hull.center,{
    x:initial.x+.992*.01*velocity.x,
    y:initial.y+.992*.01*velocity.y,
    z:initial.z+.992*.01*velocity.z
  });
  // The fit actually changes individual points; a centroid-only translation
  // would preserve this predicted point, which the pair constraints correct.
  assert.ok(Math.abs(hull.points[3].position.y-(2-.175+12*.992*.01))>.001);
});

test('one point normal projection affects centroid motion by one twelfth of whole-hull projection',()=>{
  const options={velocity:{x:0,y:-2,z:20}},normal={x:0,y:.6,z:-.8};
  const baseline=createNativeHull(options),local=createNativeHull(options),whole=createNativeHull(options);
  let removed;
  stepNativeHull(baseline,.01);
  stepNativeHull(local,.01,{beforeIntegrate:h=>{removed=applyNativeHullContact(h,3,normal);}});
  stepNativeHull(whole,.01,{beforeIntegrate:h=>{
    for(let i=0;i<h.points.length;i++)applyNativeHullContact(h,i,normal);
  }});
  close(removed,17.2);
  const one=minus(local.center,baseline.center),all=minus(whole.center,baseline.center);
  for(const axis of ['x','y','z']){
    close(one[axis],.992*.01*removed*normal[axis]/12);
    close(all[axis],one[axis]*12);
  }
  assert.ok(local.motionVelocity.y<0,'a single bow contact must not give the entire hull an upward launch');
});

test('common depenetration changes pose without entering persistent point velocities',()=>{
  const options={velocity:{x:0,y:-2,z:20}},normal={x:0,y:.6,z:-.8},depth=.03;
  const unshifted=createNativeHull(options),shifted=createNativeHull(options);
  stepNativeHull(unshifted,.01,{beforeIntegrate:h=>applyNativeHullContact(h,3,normal,0)});
  stepNativeHull(shifted,.01,{beforeIntegrate:h=>applyNativeHullContact(h,3,normal,depth)});
  for(let i=0;i<12;i++)vecClose(shifted.points[i].velocity,unshifted.points[i].velocity);
  vecClose(shifted.velocity,unshifted.velocity);
  const push={x:normal.x*depth,y:normal.y*depth,z:normal.z*depth};
  vecClose(minus(shifted.center,unshifted.center),push);
  vecClose(minus(shifted.motionVelocity,unshifted.motionVelocity),{
    x:push.x/.01,y:push.y/.01,z:push.z/.01
  });
  vecClose(shifted.frame.up,unshifted.frame.up);
});

test('outgoing contact preserves velocities and tangential incoming velocity is retained',()=>{
  const hull=createNativeHull({velocity:{x:3,y:-2,z:4}});
  close(applyNativeHullContact(hull,0,{x:0,y:2,z:0},.02),2);
  vecClose(hull.points[0].velocity,{x:3,y:0,z:4});
  const position={...hull.points[0].position};
  close(applyNativeHullContact(hull,0,{x:0,y:1,z:0},.1),0);
  vecClose(hull.points[0].position,position);
  vecClose(hull.points[1].velocity,{x:3,y:-2,z:4});
});

test('asymmetric forces retain a finite orthonormal right-handed fitted frame',()=>{
  const hull=createNativeHull({heading:.7,pitch:.2,roll:-.3,velocity:{x:2,y:0,z:8}});
  for(let i=0;i<80;i++){
    stepNativeHull(hull,.01,{beforeIntegrate:(h,dt)=>{
      h.points[0].velocity.y+=2*dt;
      h.points[5].velocity.x-=3*dt;
    }});
    const {forward,up,right}=hull.frame;
    for(const v of [forward,up,right])close(dot(v,v),1,1e-9);
    close(dot(forward,up),0,1e-9);close(dot(forward,right),0,1e-9);close(dot(up,right),0,1e-9);
    vecClose(cross(forward,right),up,1e-9);
    assert.ok(hull.points.every(p=>Object.values(p.position).every(Number.isFinite)));
  }
});

test('the fitted frame follows a rotated point hull without adding center movement',()=>{
  const hull=createNativeHull(),angle=.4,s=Math.sin(angle),c=Math.cos(angle);
  // Change the hull points while leaving the previous frame upright. A fit
  // which only preserves/normalizes that old frame would miss the new roll.
  for(const point of hull.points){
    const {x,y}=point.position;
    point.position.x=c*x-s*y;point.position.y=s*x+c*y;
  }
  stepNativeHull(hull,.01);
  vecClose(hull.center,{x:0,y:0,z:0});
  vecClose(hull.frame.forward,{x:0,y:0,z:1});
  vecClose(hull.frame.right,{x:c,y:s,z:0});
  vecClose(hull.frame.up,{x:-s,y:c,z:0});
});

test('100Hz scheduling retains fractional time and invokes forces once per physical tick',()=>{
  const hull=createNativeHull({velocity:{x:10,y:0,z:0}});
  let calls=0;
  const beforeIntegrate=(_,dt)=>{calls++;assert.equal(dt,NATIVE_HULL_STEP);};
  stepNativeHull(hull,.004,{beforeIntegrate});
  assert.equal(calls,0);assert.equal(hull.ticks,0);close(hull.remainder,.004);
  vecClose(hull.center,{x:0,y:0,z:0});
  stepNativeHull(hull,.006,{beforeIntegrate});
  assert.equal(calls,1);assert.equal(hull.ticks,1);close(hull.remainder,0);
  close(hull.center.x,.0992);
  close(hull.velocity.x,9.92);
  stepNativeHull(hull,0,{beforeIntegrate});
  assert.equal(calls,1);
});

test('render cadence does not alter a second of constant physical acceleration',()=>{
  const one=createNativeHull({velocity:{x:3,y:0,z:8}});
  const sixty=createNativeHull({velocity:{x:3,y:0,z:8}});
  const oneTwenty=createNativeHull({velocity:{x:3,y:0,z:8}});
  const options={acceleration:{x:1,y:-.3,z:2}};
  stepNativeHull(one,1,options);
  for(let i=0;i<60;i++)stepNativeHull(sixty,1/60,options);
  for(let i=0;i<120;i++)stepNativeHull(oneTwenty,1/120,options);
  for(const hull of [one,sixty,oneTwenty]){
    assert.equal(hull.ticks,100);close(hull.simulationTime,1);close(hull.remainder,0);
    vecClose(hull.center,one.center);vecClose(hull.velocity,one.velocity);
    hull.points.forEach((p,i)=>vecClose(p.velocity,one.points[i].velocity));
  }
});

test('uniform drift has the analytic per-second damping and produces no rotation',()=>{
  const hull=createNativeHull({velocity:{x:0,y:0,z:10}});
  stepNativeHull(hull,1);
  const gain=.992,ticks=100;
  close(hull.velocity.z,10*gain**ticks,1e-9);
  close(hull.center.z,10*.01*gain*(1-gain**ticks)/(1-gain),1e-9);
  vecClose(hull.frame.forward,{x:0,y:0,z:1});
  vecClose(hull.frame.up,{x:0,y:1,z:0});
  assert.ok(hull.velocity.z<10&&hull.velocity.z>0);
});

test('invalid scheduling and contact inputs fail before changing the hull',()=>{
  const hull=createNativeHull(),snapshot=JSON.stringify(hull);
  for(const dt of [-.01,Infinity,NaN,2])assert.throws(()=>stepNativeHull(hull,dt),RangeError);
  assert.throws(()=>stepNativeHull(hull,.01,{acceleration:{x:0,y:NaN,z:0}}),TypeError);
  assert.throws(()=>applyNativeHullContact(hull,12,{x:0,y:1,z:0}),RangeError);
  assert.throws(()=>applyNativeHullContact(hull,0,{x:0,y:0,z:0}),RangeError);
  assert.throws(()=>applyNativeHullContact(hull,0,{x:0,y:1,z:0},-1),RangeError);
  assert.equal(JSON.stringify(hull),snapshot);
});
