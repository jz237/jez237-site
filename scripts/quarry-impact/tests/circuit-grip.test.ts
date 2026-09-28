import {assertWestWallEvolution} from './quarry-west-wall-invariants';
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { gunzipSync } from 'node:zlib';
import { circuitGrip, CircuitGripQuery } from '../src/circuit-grip';
import profile from '../src/circuit-grip-profile.json';
import { surfaceAt } from '../src/rules';
import { historicGripBytes } from './circuit-grip-invariants';
import { quarryColliderLayout } from '../src/quarry-layout';

const read=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
const base=JSON.parse(read('source/circuit-surface-base.json').toString());
const before=JSON.parse(read('tests/fixtures/circuit-grip-before.json').toString());
const raw=gunzipSync(read('public/assets/circuit-surface.rgba.gz'));
const hash=(b:Uint8Array|string)=>createHash('sha256').update(b).digest('hex');
const oracle=(s:number,d:number)=>{
  const x=((s/profile.mask.lengthMetres%1)+1)%1*2048-.5,y=Math.max(0,Math.min(127,(d+10)/20*128-.5));
  const x0=Math.floor(x),y0=Math.floor(y),fx=x-x0,fy=y-y0;
  const pixel=(ix:number,iy:number)=>raw[(iy*2048+((ix%2048)+2048)%2048)*4]/255;
  return pixel(x0,y0)*(1-fx)*(1-fy)+pixel(x0+1,y0)*fx*(1-fy)+pixel(x0,Math.min(y0+1,127))*(1-fx)*fy+pixel(x0+1,Math.min(y0+1,127))*fx*fy;
};

test('numeric grip profile reproduces deterministically and preserves every source red texel and old lane coordinate',async()=>{
  const manifest=JSON.parse(read('source/circuit-grip-manifest.json').toString());
  assert.equal(hash(read(manifest.output)),manifest.sha256);assert.equal(hash(read(manifest.mask)),before.maskSHA256);assert.equal(hash(read(manifest.base)),before.baseSHA256);
  const {createCircuitGripProfile}=await import('../tools/export-circuit-grip.mjs');
  assert.equal(hash(JSON.stringify(createCircuitGripProfile(base,raw))+'\n'),manifest.sha256);
  for(let x=0;x<2048;x++)for(let y=0;y<128;y++)assert.equal(circuitGrip.red[x*128+y],raw[(y*2048+x)*4]);
  for(let i=0;i<722;i++){
    const r=base.rows[Math.floor(i/2)],x=base.lane.positions[i*3],z=base.lane.positions[i*3+2];
    assert.deepEqual(profile.vertices.slice(i*4,i*4+4),[x,z,Math.fround(r.s),Math.fround((x-r.center.x)*r.lateral.x+(z-r.center.z)*r.lateral.z)]);
  }
  assert.equal(circuitGrip.red.byteLength,262144);assert.ok(read(manifest.output).length<100000);
  assert.equal(profile.mask.threshold,127.5);assert.equal(profile.mask.lengthMetres,Math.fround(base.lengthMetres));
  assert.deepEqual([profile.mask.lateralMinimum,profile.mask.lateralMaximum],[-10,10]);
  assert.deepEqual(profile.pavedCells,base.cells.filter((c:any)=>c.asphalt&&!c.authoredGravel).map((c:any)=>c.cell));
});

test('grip source evolution preserves all collision shapes, vehicle controls, checkpoint/AI/scoring bytes and prior Worker inputs',()=>{
  for(const row of before.workerInputs)assert.equal(hash(historicGripBytes(row.file,read(row.file))),row.expected,row.file);
  assert.equal(hash(historicGripBytes('src/vehicle.ts',read('src/vehicle.ts'))),before.vehicleSHA256);
  const colliders=assertWestWallEvolution(quarryColliderLayout()).map(s=>({id:s.id,sha256:hash(JSON.stringify(s))}));
  assert.equal(colliders.length,2287);assert.equal(hash(JSON.stringify(colliders)),before.colliderSHA256);
});

test('query removes all31 checkpoint-disc lane gaps and all1,936 sampled off-lane false asphalt classifications',()=>{
  const gaps=base.tractionSamples.filter((s:any)=>s.cell<360&&s.lateral===0&&base.cells[s.cell].asphalt&&s.surface==='gravel');
  assert.equal(gaps.length,31);
  for(const s of gaps)assert.equal(surfaceAt(s.x,s.z),'asphalt','paved center cell '+s.cell);
  const outside=base.tractionSamples.filter((s:any)=>s.cell<360&&Math.abs(s.lateral)>6&&s.surface==='asphalt');
  assert.equal(outside.length,1936);
  for(const s of outside)assert.equal(surfaceAt(s.x,s.z),'gravel','shoulder sample '+s.cell+'/'+s.lateral);
  for(const row of base.rows.slice(123,182))assert.equal(circuitGrip.query(row.center.x,row.center.z)?.surface,'gravel');
  for(const row of base.rows.slice(0,360))if(!base.cells[row.cell].asphalt)assert.notEqual(circuitGrip.query(row.center.x,row.center.z)?.surface,'asphalt');
  for(const p of [[0,0],[43,0],[0,-43],[500,500],[NaN,0],[Infinity,0]])assert.equal(circuitGrip.query(...p as [number,number]),null);
});

test('real triangle barycentrics agree with independent base-level mask sampling across the circuit and both painted edges',()=>{
  let samples=0,asphalt=0,gravel=0;
  for(let cell=0;cell<360;cell++)for(const tri of [[cell*2,cell*2+2,cell*2+1],[cell*2+1,cell*2+2,cell*2+3]]){
    const p=tri.map(id=>profile.vertices.slice(id*4,id*4+4));
    for(const w of [[.2,.3,.5],[.98,.01,.01],[.01,.98,.01],[.01,.01,.98],[.05,.45,.5],[.45,.05,.5]]){
      const value=[0,1,2,3].map(k=>p.reduce((sum,v,i)=>sum+v[k]*w[i],0));
      const hit=circuitGrip.query(value[0],value[1]);assert.ok(hit,'query must cover every actual lane triangle');
      assert.ok(Math.abs(hit.s-value[2])<2e-9);assert.ok(Math.abs(hit.lateral-value[3])<2e-10);
      const coverage=oracle(value[2],value[3]);assert.ok(Math.abs(hit.coverage-coverage)<1e-9);
      const expected=profile.pavedCells.includes(cell)&&coverage>=.5?'asphalt':'gravel';assert.equal(hit.surface,expected);
      if(hit.surface==='asphalt')asphalt++;else gravel++;samples++;
    }
  }
  assert.equal(samples,4320);assert.ok(asphalt>0&&gravel>0);
  for(let x=0;x<2048;x+=7)for(const d of [-5.9,-5.6,-5.3,0,5.3,5.6,5.9]){
    const s=(x+.25)/2048*profile.mask.lengthMetres;assert.ok(Math.abs(circuitGrip.coverageAt(s,d)-oracle(s,d))<1e-12);
  }
});

test('segment joins and periodic endpoints are stable without history or camera-dependent mip sampling',()=>{
  for(let cell=0;cell<=360;cell++)for(const t of [.05,.25,.5,.75,.95]){
    const a=profile.vertices.slice(cell*8,cell*8+4),b=profile.vertices.slice(cell*8+4,cell*8+8),p=a.map((v,i)=>v*(1-t)+b[i]*t);
    const hit=circuitGrip.query(p[0],p[1]);assert.ok(hit,'shared cross-section remains covered');
    for(let repeat=0;repeat<3;repeat++)assert.deepEqual(circuitGrip.query(p[0],p[1]),hit,'tie result cannot depend on prior vehicle history');
    assert.ok(Math.abs(hit.coverage-oracle(p[2],p[3]))<2e-9);
  }
  for(const d of [-10,-5.5,0,5.5,10])assert.equal(circuitGrip.coverageAt(0,d),circuitGrip.coverageAt(profile.mask.lengthMetres,d));
  assert.equal(circuitGrip.coverageAt(0,-100),circuitGrip.coverageAt(0,-10));assert.equal(circuitGrip.coverageAt(0,100),circuitGrip.coverageAt(0,10));
  const broken=structuredClone(profile);broken.mask.redRuns[0]=0;assert.throws(()=>new CircuitGripQuery(broken),/Invalid/);
});

test('both actual pavement edges classify correctly one millimetre either side of the independent red contour',()=>{
  const pointAt=(cell:number,s:number,d:number)=>{
    for(const ids of [[cell*2,cell*2+2,cell*2+1],[cell*2+1,cell*2+2,cell*2+3]]){
      const p=ids.map(i=>profile.vertices.slice(i*4,i*4+4)),u=[p[1][2]-p[0][2],p[1][3]-p[0][3]],v=[p[2][2]-p[0][2],p[2][3]-p[0][3]],q=[s-p[0][2],d-p[0][3]],det=u[0]*v[1]-u[1]*v[0];
      const b=(q[0]*v[1]-q[1]*v[0])/det,c=(u[0]*q[1]-u[1]*q[0])/det,a=1-b-c;
      if(Math.min(a,b,c)<-1e-10)continue;
      return [0,1].map(k=>p[0][k]*a+p[1][k]*b+p[2][k]*c) as [number,number];
    }
    throw new Error('Contour point must lie within the original lane');
  };
  let edges=0;
  for(const cell of profile.pavedCells){
    const s=(profile.vertices[cell*8+2]+profile.vertices[(cell+1)*8+2])*.5;
    if(oracle(s,0)<.5)continue;
    for(const side of [-1,1]){
      let inner=0,outer=6;
      for(let n=0;n<45;n++){const d=(inner+outer)*.5;if(oracle(s,d*side)>=.5)inner=d;else outer=d;}
      const boundary=(inner+outer)*.5;
      assert.equal(surfaceAt(...pointAt(cell,s,(boundary-.001)*side)),'asphalt');
      assert.equal(surfaceAt(...pointAt(cell,s,(boundary+.001)*side)),'gravel');edges++;
    }
  }
  assert.equal(edges,414);
});
