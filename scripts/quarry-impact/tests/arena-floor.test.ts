import test from 'node:test';
import assert from 'node:assert/strict';
import { captureArenaFloor, arenaRead, arenaHash } from '../tools/arena-floor-audit';
import { quarryColliderLayout } from '../src/quarry-layout';
import { assertNorthForestEvolution, assertNorthForestLayoutSource, northForestBaseline } from './north-forest-invariants';

const baseline=JSON.parse(arenaRead('tests/fixtures/arena-floor-baseline.json').toString());
let current:ReturnType<typeof captureArenaFloor>|undefined;
const capture=()=>current??=captureArenaFloor();
const geometryOnly=({materials:_materials,name:_name,...geometry}:any)=>geometry;

test('arena appearance preserves its historical physics and cars through the explicitly additive forest milestone',async()=>{
  const result=await capture();
  assert.equal(result.workerInputs.length,17);
  assertNorthForestLayoutSource();assertNorthForestEvolution(quarryColliderLayout());
  assert.deepEqual(result.workerInputs.filter(i=>i.file!=='src/quarry-layout.ts'),baseline.workerInputs.filter((i:any)=>i.file!=='src/quarry-layout.ts'));
  const oldIds=new Set(baseline.colliders.map((s:any)=>s.id));
  assert.deepEqual(result.colliders.filter(s=>oldIds.has(s.id)),baseline.colliders,'all original1547 arena-era colliders stay exact');
  for(const [file,expected] of Object.entries(baseline.protectedFiles)){
    if(file==='src/scenery-surfaces.ts')continue; // Arena factory integration may edit this source; actual other material outputs are checked below.
    assert.equal(arenaHash(arenaRead(file)),expected,`${file} stays byte-identical`);
  }
});

test('actual arena, twelve water surfaces and twelve damp margins preserve every vertex, normal, alpha ring and transform',async()=>{
  const result=await capture();
  assert.deepEqual(geometryOnly(result.arena),geometryOnly(baseline.arena));
  assert.equal(result.puddles.length,24);
  for(let i=0;i<result.puddles.length;i++)assert.deepEqual(geometryOnly(result.puddles[i]),geometryOnly(baseline.puddles[i]),`actual puddle/margin${i} cannot move or be remeshed`);
  const water=result.puddles.filter(p=>p.role==='water'),wet=result.puddles.filter(p=>p.role==='wet');
  assert.equal(water.length,12);assert.equal(wet.length,12);
  for(let i=0;i<12;i++){
    assert.equal(water[i].matrix[13],.025);assert.equal(wet[i].matrix[13],.022);
    for(const entry of [water[i],wet[i]]){
      assert.equal(entry.rings.at(-1)!.alpha,0,'existing feather edge stays transparent');
      for(const ring of entry.rings)assert.equal(ring.points.length,193);
    }
  }
});

test('arena material change cannot add draw objects, alter other materials, or perturb the later scenery RNG',async()=>{
  const result=await capture();
  assert.equal(result.objects.length,baseline.objects.length);assert.equal(result.objects.length,231);
  const others=structuredClone(result.objects.filter(o=>o.role==='other'));
  const wearSHA='74fdab72e3510e26464697cbc7b2c61a7fecb58c99186f2c4193a369b51dcaf2';
  const wear=others.filter(o=>o.geometry.attributes.position.sha256===wearSHA);
  assert.equal(wear.length,1,'only the exact historical arena-wear mesh receives this opacity exception');
  assert.equal(wear[0].materials.length,1);assert.equal(wear[0].materials[0].opacity,.045);
  wear[0].materials[0].opacity=.22; // Approved visual refinement; all other fields below remain exact.
  // The later northern woodland changes only the shader of the exact existing
  // terrain mesh. Its physical vertices, material parameters and base shader
  // uniforms stay frozen; real new shader composition has separate CPU gates.
  const terrainSHA=northForestBaseline.physics.terrain.positions;
  const terrain=others.filter(o=>o.geometry.attributes.position.sha256===terrainSHA),oldTerrain=baseline.objects.filter((o:any)=>o.geometry.attributes.position.sha256===terrainSHA);
  assert.equal(terrain.length,1);assert.equal(oldTerrain.length,1);assert.equal(terrain[0].materials.length,1);
  const nextShader=terrain[0].materials[0].shader,oldShader=oldTerrain[0].materials[0].shader;
  assert.equal(nextShader.vertexSHA256,oldShader.vertexSHA256);assert.match(nextShader.programKey,/^north-woodland-floor-v/);
  for(const [key,value] of Object.entries(oldShader.uniforms))assert.deepEqual(nextShader.uniforms[key],value);
  terrain[0].materials[0].shader=oldShader;
  // The same later milestone adds the registered mineral transition to the
  // three exact pre-existing quarryRock consumers. Restore only their shader
  // descriptors for this historical comparison, after checking composition.
  const oldOthers=baseline.objects.filter((o:any)=>o.role==='other');let crestConsumers=0;
  for(let i=0;i<oldOthers.length;i++)for(let j=0;j<oldOthers[i].materials.length;j++){
    const original=oldOthers[i].materials[j].shader;if(original?.programKey!=='quarry-rock-v5')continue;
    const next=others[i].materials[j].shader;assert.equal(others[i].geometry.attributes.position.sha256,oldOthers[i].geometry.attributes.position.sha256);
    assert.equal(next.vertexSHA256,original.vertexSHA256);assert.match(next.programKey,/^north-woodland-crest-v/);
    for(const [key,value]of Object.entries(original.uniforms))assert.deepEqual(next.uniforms[key],value);
    others[i].materials[j].shader=original;crestConsumers++;
  }
  assert.equal(crestConsumers,3,'only the three historical rock-factory mesh consumers receive the crest wrapper');
  assert.deepEqual(others,baseline.objects.filter((o:any)=>o.role==='other'),
    'roads, walls, signs, props, every unrelated shader and existing instance matrices/colors remain exact; arena wear changes only opacity');
  assert.deepEqual(result.random,baseline.random);assert.deepEqual(result.random,{seed:1417743577,calls:3954});
});

test('actual floor and puddle UV frames retain their different world-space orientation',async()=>{
  const result=await capture();assert.equal(result.surfaceFrames.length,25);
  for(const frame of result.surfaceFrames){
    const expectedV=frame.role==='arena'?1:-1;
    assert.ok(Math.hypot(frame.u[0]-1,frame.u[1],frame.u[2])<1e-6,'U follows positive worldX');
    assert.ok(Math.hypot(frame.v[0],frame.v[1],frame.v[2]-expectedV)<1e-6,'V respects the actual rotated mesh and UV coordinates');
    assert.ok(Math.hypot(frame.normal[0],frame.normal[1]-1,frame.normal[2])<1e-6,'visible surface normal remains world-up');
    assert.equal(frame.handedness,frame.role==='arena'?-1:1,'worldXZ maps require their own frame on the rotated water mesh');
  }
});
