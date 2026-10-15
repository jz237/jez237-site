import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../vendor/three.module.js';
import {createNativeWaterField,queryNativeWaterField} from '../native-water-field.js';
import {NATIVE_WATER_SURFACE_SCALE,sampleNativeWaterSurface,nativeWaterSurfaceGLSL,
  createNativeWaterSurface} from '../native-water-surface.js';

const F=Math.fround,S=.025,shear=F(1/Math.sqrt(3)),stretch=F(2/Math.sqrt(3));
const close=(a,b,e=1e-10)=>assert.ok(Math.abs(a-b)<=e,`${a} != ${b}`);
const sameSurface=(a,b,e=1e-10)=>{for(const k of ['height','slopeX','slopeZ'])close(a[k],b[k],e);};
function setWhole(f,entries){for(const [index,h]of entries)f.heightQ[index]=h*256;return f;}

test('independent asymmetric quad has different triangle gradients and barycentric heights',()=>{
  // Cell(0,0): A=8, B=40, C=-24, D=72. Source transformed integer
  // coordinates are(23,8) and(17,21), so these lie on opposite triangles.
  const f=setWhole(createNativeWaterField(),[[0,8],[1,40],[128,-24],[129,72]]);
  sameSurface(sampleNativeWaterSurface(f,19*S,7*S),{height:23.5*S,slopeX:.5,slopeZ:.5*(shear+stretch)});
  sameSurface(sampleNativeWaterSurface(f,7*S,19*S),{height:23*S,slopeX:1.5,slopeZ:1.5*shear-.5*stretch});
});

test('all four XZ quadrants use independent signed truncation and sheared-torus indices',()=>{
  const fixtures=[
    // x,z / manually selected storage indices / native barycentric height.
    {p:[19,7],indices:[0,1,129],height:19.5,du:.5,dv:1},
    {p:[-19,7],indices:[32895,0,128],height:33,du:.5,dv:1},
    {p:[19,-7],indices:[49024,0,1],height:42,du:1,dv:.5},
    {p:[-19,-7],indices:[32767,32895,0],height:69,du:1,dv:.5}
  ];
  for(const {p,indices,height,du,dv}of fixtures){
    const f=createNativeWaterField();indices.forEach((i,k)=>{f.heightQ[i]=[0,32,96][k]*256;});
    sameSurface(sampleNativeWaterSurface(f,p[0]*S,p[1]*S),
      {height:height*S,slopeX:du,slopeZ:shear*du+stretch*dv});
  }
});

test('negative fractions truncate toward zero before floor-cell selection',()=>{
  const f=setWhole(createNativeWaterField(),[[32895,-64],[0,0],[128,0]]);
  close(sampleNativeWaterSurface(f,-.9,0,{scale:1}).height,0);
  close(sampleNativeWaterSurface(f,-1,0,{scale:1}).height,-1);
  // The -1 native sample lies 63/64 along a negative-origin cell.
  close(sampleNativeWaterSurface(f,-1,0,{scale:1}).slopeX,1);
});

test('binary32 shear product rounds before addition at a transformed integer boundary',()=>{
  // xNative=-4922.19921875,zNative1457: rounded shear841.19921875,
  // U=-4081,V1682. Upper triangle fractions15/64,18/64. A fused
  // multiply-add can select U=-4080 and visibly change this height.
  const f=setWhole(createNativeWaterField(),[[36160,0],[36288,32],[36289,96]]);
  sameSurface(sampleNativeWaterSurface(f,-123.05498046875,36.425),
    {height:24*S,slopeX:1,slopeZ:shear+.5*stretch});
});

test('column seam carries128 rows and the full X period carries384 cells',()=>{
  const f=setWhole(createNativeWaterField(),[[127,8],[16384,24],[16512,90],[0,-100]]);
  close(sampleNativeWaterSurface(f,8160*S,0).height,16*S);
  close(sampleNativeWaterSurface(f,8192*S,0).height,24*S);
  // A naive128-column repeating texture would incorrectly use index0 here.
  close(sampleNativeWaterSurface(f,(8192+24576)*S,0).height,24*S);
  assert.notEqual(sampleNativeWaterSurface(f,0,0).height,24*S);
});

test('vertical signed remainder seam retains the correct shared rendered vertices',()=>{
  const f=setWhole(createNativeWaterField(),[[16320,0],[16448,32],[16449,96],[16577,-64]]);
  // z21283 selects cell(192,383), upper triangle, fractions9/64,63/64.
  // z21284 wraps V24576 to0 and selects cell(192,0), fraction10/64,0.
  close(sampleNativeWaterSurface(f,10*S,21283*S).height,40.5*S);
  close(sampleNativeWaterSurface(f,10*S,21284*S).height,42*S);
});

test('scale changes height/positions together while triangle world slopes stay invariant',()=>{
  const f=setWhole(createNativeWaterField(),[[0,0],[1,32],[129,96]]);
  for(const scale of [.025,.05,.125,1]){
    const v=sampleNativeWaterSurface(f,19*scale,7*scale,{scale});
    sameSurface(v,{height:19.5*scale,slopeX:.5,slopeZ:.5*shear+stretch});
  }
  assert.equal(NATIVE_WATER_SURFACE_SCALE,.025);
});

test('datum addition wraps each signed whole vertex before interpolation',()=>{
  const f=setWhole(createNativeWaterField({datumNative:32767}),[[0,0],[1,1],[129,0]]);
  const v=sampleNativeWaterSurface(f,32*S,0);
  close(v.height,-.5*S);close(v.slopeX,-65535/64);
  close(v.slopeZ,-65535/64*shear+65535/64*stretch);
  // Wrapping after interpolation, or clamping to an amplitude20 bound, gives
  // neither this half-native-unit height nor this deliberate signed seam.
  const lower=createNativeWaterField({datumNative:-32768});lower.heightQ.fill(-1);
  sameSurface(sampleNativeWaterSurface(lower,0,0),{height:32767*S,slopeX:0,slopeZ:0});
});

test('low Q8.8 bits floor signed values and raw physical query remains distinct',()=>{
  const f=createNativeWaterField();f.heightQ[0]=-1;f.heightQ[1]=64*256;f.heightQ[129]=64*256;
  const rendered=sampleNativeWaterSurface(f,32*S,0);
  close(rendered.height,31.5*S);
  const raw=queryNativeWaterField(f,32,0);
  assert.ok(Math.abs(raw.sourcePlaneQueryNative-raw.renderHeightNative)>30);
  close(rendered.height,raw.renderHeightNative*S);
});

test('CPU presentation agrees with the original rendered-height query across a dense sampling grid',()=>{
  const f=createNativeWaterField({datumNative:-173});
  for(let i=0;i<f.heightQ.length;i++)f.heightQ[i]=((i*8737+127)&65535)-32768;
  // Arbitrarily dense sampling is supported; no source-grid mesh or reduced
  // renderer tessellation is required. Include far positive/negative seams.
  for(let iz=-16;iz<=16;iz++)for(let ix=-16;ix<=16;ix++){
    const x=ix*19.219*S,z=iz*1489.73*S;
    const nativeX=F(F(x)*F(1/S)),nativeZ=F(F(z)*F(1/S));
    close(sampleNativeWaterSurface(f,x,z).height,
      queryNativeWaterField(f,nativeX,nativeZ).renderHeightNative*S);
  }
});

test('texture adapter begins explicitly inactive and preserves modern fallback exactly',()=>{
  const bridge=createNativeWaterSurface(),modern={height:3,slopeX:-.2,slopeZ:NaN};
  assert.equal(bridge.enabled,false);assert.equal(bridge.ready,false);assert.equal(bridge.revision,0);
  assert.equal(bridge.uniforms.nativeWaterActive.value,0);
  assert.equal(bridge.sampleOr(NaN,Infinity,modern),modern);
  sameSurface(bridge.sample(NaN,Infinity),{height:0,slopeX:0,slopeZ:0});
  assert.throws(()=>bridge.setEnabled(true),/Sync/);
  bridge.sync(createNativeWaterField());assert.equal(bridge.enabled,false);
  bridge.setEnabled(true);assert.notEqual(bridge.sampleOr(0,0,modern),modern);
  bridge.setEnabled(false);assert.equal(bridge.sampleOr(0,0,modern),modern);
  bridge.dispose();
});

test('Float32 whole-height snapshot has nearest R32F orientation and atomic explicit sync',()=>{
  const f=createNativeWaterField({datumNative:31});f.heightQ[0]=-1;f.velocityQ.fill(72);
  const bridge=createNativeWaterSurface(),t=bridge.texture,uniforms=bridge.uniforms,initialVersion=t.version;
  assert.equal(t.isDataTexture,true);assert.equal(t.type,T.FloatType);assert.equal(t.format,T.RedFormat);
  assert.equal(t.internalFormat,'R32F');assert.equal(t.minFilter,T.NearestFilter);assert.equal(t.magFilter,T.NearestFilter);
  assert.equal(t.generateMipmaps,false);assert.equal(t.flipY,false);assert.equal(t.unpackAlignment,1);
  assert.equal(t.wrapS,T.ClampToEdgeWrapping);assert.equal(t.wrapT,T.ClampToEdgeWrapping);
  assert.equal(t.colorSpace,T.NoColorSpace);
  assert.ok(t.image.data instanceof Float32Array);assert.equal(t.image.width,128);assert.equal(t.image.height,384);
  bridge.sync(f).setEnabled(true);
  assert.equal(bridge.uniforms,uniforms);assert.equal(bridge.texture,t);assert.equal(t.version,initialVersion+1);
  assert.equal(t.image.data[0],-1);close(bridge.sample(0,0).height,30*S);
  f.heightQ[0]=256;f.datumNative=99;
  close(bridge.sample(0,0).height,30*S); // Snapshot does not follow later writes.
  bridge.sync(f);close(bridge.sample(0,0).height,100*S);assert.equal(bridge.enabled,true);
  assert.equal(f.velocityQ[0],72);assert.equal(f.patchUpdates,0);assert.equal(f.forcingCalls,0);
  const revision=bridge.revision;
  assert.throws(()=>bridge.sync(f,{datumNative:32768}),RangeError);
  assert.equal(bridge.revision,revision);close(bridge.sample(0,0).height,100*S);
  bridge.dispose();
});

test('reset disables/clears data and disposal releases its resource once',()=>{
  const f=createNativeWaterField();f.heightQ.fill(1024);
  const bridge=createNativeWaterSurface().sync(f).setEnabled(true),t=bridge.texture;
  let disposals=0;t.addEventListener('dispose',()=>{disposals++;});
  bridge.reset();assert.equal(bridge.ready,false);assert.equal(bridge.enabled,false);
  assert.equal(t.image.data.some(x=>x!==0),false);assert.equal(bridge.uniforms.nativeWaterDatumNative.value,0);
  assert.throws(()=>bridge.setEnabled(true),/Sync/);
  bridge.sync(f).setEnabled(true);close(bridge.sample(0,0).height,4*S);
  bridge.dispose();bridge.dispose();assert.equal(disposals,1);assert.equal(bridge.disposed,true);
  assert.equal(bridge.texture,null);assert.equal(bridge.uniforms.nativeWaterHeights.value,null);
  assert.equal(bridge.uniforms.nativeWaterActive.value,0);
  assert.throws(()=>bridge.sync(f),/disposed/);assert.throws(()=>bridge.reset(),/disposed/);
  assert.throws(()=>bridge.setEnabled(true),/disposed/);assert.throws(()=>bridge.sample(0,0),/disposed/);
});

test('independent view/replay snapshots do not share texture, enable, datum or reset state',()=>{
  const f=createNativeWaterField({datumNative:10}),a=createNativeWaterSurface().sync(f).setEnabled(true);
  const b=createNativeWaterSurface({scale:.125}).sync(f,{datumNative:-8}).setEnabled(true);
  assert.notEqual(a.texture,b.texture);assert.notEqual(a.uniforms,b.uniforms);
  close(a.sample(0,0).height,.25);close(b.sample(0,0).height,-1);
  a.reset();assert.equal(b.enabled,true);close(b.sample(0,0).height,-1);
  a.dispose();b.dispose();
});

test('invalid dimensions, datums, scales and coordinates fail before presenting partial data',()=>{
  const f=createNativeWaterField();
  for(const scale of [0,-1,NaN,Infinity,1e-50,1e-40,1e40])assert.throws(()=>createNativeWaterSurface({scale}),RangeError);
  assert.throws(()=>sampleNativeWaterSurface({heightQ:new Int16Array(4)},0,0),TypeError);
  assert.throws(()=>sampleNativeWaterSurface(f,0,0,{datumNative:.5}),RangeError);
  assert.throws(()=>sampleNativeWaterSurface(f,NaN,0),TypeError);
  assert.throws(()=>sampleNativeWaterSurface(f,1e20,0),RangeError);
  const b=createNativeWaterSurface();assert.throws(()=>b.setEnabled(1),TypeError);b.dispose();
});

test('shader has the matching per-instance uniform contract and an explicit modern fallback',()=>{
  const b=createNativeWaterSurface();
  const names=[...nativeWaterSurfaceGLSL.matchAll(/uniform highp \w+ (\w+);/g)].map(m=>m[1]).sort();
  assert.deepEqual(names,Object.keys(b.uniforms).sort());
  assert.match(nativeWaterSurfaceGLSL,/vec3 nativeWaterSurface\(vec2 worldXZ\)/);
  assert.match(nativeWaterSurfaceGLSL,/vec3 nativeWaterSurfaceOr\(vec2 worldXZ, vec3 modernSurface\)/);
  assert.match(nativeWaterSurfaceGLSL,/nativeWaterActive == 0\) return modernSurface/);
  assert.match(nativeWaterSurfaceGLSL,/texelFetch/);b.dispose();
});
