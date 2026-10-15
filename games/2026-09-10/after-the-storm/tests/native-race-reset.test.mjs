import test from 'node:test';
import assert from 'node:assert/strict';
import {NATIVE_RACE_RESET_WORD_COUNT,createNativeRaceResetState,nativeRaceResetSnapshot,
 createNativeRaceResetLayout,prepareNativeRaceReset} from '../native-race-reset.js';

const at=a=>(a-0x1f94)/4;
const bits=v=>{const b=new DataView(new ArrayBuffer(4));b.setFloat32(0,v,false);return b.getUint32(0,false);};
const number=v=>{const b=new DataView(new ArrayBuffer(4));b.setUint32(0,v,false);return b.getFloat32(0,false);};
function fixture(){
 const raceWords1f94=Array.from({length:NATIVE_RACE_RESET_WORD_COUNT},(_,i)=>0x17000000+i);
 [2,0,3,1].forEach((v,i)=>raceWords1f94[at(0x26c0)+i]=v);
 return {state:{raceWords1f94,cold8224:0,clockStopped817c:0},
  layout:{nodes:Array.from({length:4},(_,i)=>({sourceRow:i,referenceNativeXZ:{x:(i-1)*1000,z:(i%3-1)*1200},
   classification98:i===0?3:0,checkpointFlag9c:i===0?1:0,nextSourceRowA0:(i+1)%4,
   alternateNextSourceRowA4:-1,previousSourceRowB4:(i+3)%4})),boundaryNativeXZ:[],objectKinds4c:[0,2,3],
   checkpointSeconds:90,checkpointSlackNative:256,recordTimeTemplateWords:[599999,0,0,0,0x494e4900],
   stuntTemplateWords:[0,0,0,0x494e4900]},
  input:{primaryCount:4,racerCount:4,courseIndex:1,mode620:0,main638:1,finishSourceRow:0,difficulty:1,
   reverseDab68:0,stateE6f8:0,forceFirst8228:0,primaryHumanIndex:0,demoOffset5438:0}};
}
const run=c=>prepareNativeRaceReset(createNativeRaceResetLayout(c.layout),createNativeRaceResetState(c.state),c.input);
const word=(r,a)=>r.state.raceWords1f94[at(a)];

test('selective reset retains all unwritten record history and inactive slots bit for bit',()=>{
 const c=fixture();c.input.racerCount=2;const before=structuredClone(c.state),r=run(c);
 assert.deepEqual(c.state,before);assert.deepEqual(r.diagnostic.recordWrittenCounts,[143,143]);
 for(let i=0;i<2;i++){
  const base=i*0x378;
  for(const a of [0x294c,0x2950,0x2ad8,0x2c04,0x2c0c,0x2c84,0x2c90])
   assert.equal(word(r,a+base),before.raceWords1f94[at(a+base)]);
  assert.equal(word(r,0x2964+base),0);assert.equal(word(r,0x2974+base),before.raceWords1f94[at(0x2974+base)]);
  assert.equal(word(r,0x2aa8+base),599999);assert.equal(word(r,0x2bfc+base),90000);
  assert.equal(word(r,0x2c88+base),0x801aee20);assert.equal(word(r,0x2954+base),0xffffffff);
 }
 assert.deepEqual(r.state.raceWords1f94.slice(at(0x2938+2*0x378),at(0x3718)),before.raceWords1f94.slice(at(0x2938+2*0x378),at(0x3718)));
 for(const a of [0x3780,0x3784,0x3788,0x3990,0x399c,0x39a0,0x39ac])assert.equal(word(r,a),before.raceWords1f94[at(a)]);
 assert.equal(r.state.clockStopped817c,1);assert.deepEqual(r.effects,[{kind:'externalCall',consumer:'startupOverlayEed70'}]);
 assert(Object.isFrozen(r.state.raceWords1f94)&&Object.isFrozen(r.writeFootprint.raceWordIndices));
});

test('cold reset touches the three course tails and selects their new records immediately',()=>{
 for(const reverseDab68 of [0,-1]){
  const c=fixture();c.state.cold8224=-1;c.input.courseIndex=10;c.input.reverseDab68=reverseDab68;
  const r=run(c);assert.equal(r.state.cold8224,0);assert.equal(word(r,0x1fe4),599999);
  assert.equal(word(r,0x1fe8),reverseDab68===0?599999:0);assert.equal(word(r,0x1fe0),word(r,0x1fe8));
  for(const a of [0x220c,0x2248,0x22ac,0x2374,0x239c,0x2464,0x248c])assert.equal(word(r,a),599999);
  assert.equal(word(r,0x221c),0x494e4900);assert.equal(word(r,0x25e4),0xffffffff);assert.equal(word(r,0x264c),0xffffffff);
  assert.equal(word(r,0x28a4),0x494e4900);assert.equal(word(r,0x2924),0x494e4900);
  assert.equal(word(r,0x2208),c.state.raceWords1f94[at(0x2208)]);
  assert.deepEqual(r.state.raceWords1f94.slice(at(0x26c0),at(0x26d0)),[3,2,1,0]);
 }
});

test('warm reset retains actual table and grid history without inferring image defaults',()=>{
 const c=fixture();c.input.reverseDab68=-1;const r=run(c);
 assert.equal(word(r,0x1fe4),c.state.raceWords1f94[at(0x23b0+20)]);
 assert.equal(word(r,0x1fe0),0);assert.equal(word(r,0x220c),c.state.raceWords1f94[at(0x220c)]);
 assert.deepEqual(r.writeFootprint.externalFields,['clockStopped817c']);
 assert.deepEqual(r.state.raceWords1f94.slice(at(0x26c0),at(0x26d0)),[2,0,3,1]);
});

test('extent fallback and source reference coordinates include the complete boundary family',()=>{
 const c=fixture();let r=run(c);
 for(const a of [0x1f9c,0x1fa4])assert.equal(number(word(r,a)),-4096);
 for(const a of [0x1fa0,0x1fa8])assert.equal(number(word(r,a)),4096);
 c.layout.boundaryNativeXZ=[{x:-7000,z:6000}];r=run(c);
 assert.equal(number(word(r,0x1f94)),7000);assert.equal(number(word(r,0x1f9c)),-7000);
 assert.equal(number(word(r,0x1fa0)),2000);assert.equal(number(word(r,0x1fa8)),6000);
 assert.equal(word(r,0x1f98),bits(Math.fround(160/Math.fround(14000))));
 assert.equal(word(r,0x1fb4),bits(Math.fround(Math.fround(7000*Math.fround(1.414199948310852))+2048)));
});

test('strict source extrema retain signed zero and the original sentinels for outlying coordinates',()=>{
 const c=fixture();c.layout.nodes.forEach((n,i)=>n.referenceNativeXZ={x:40000+i*100,z:i===0?-0:0});
 const r=run(c);assert.equal(number(word(r,0x1f9c)),32767);
 assert.equal(word(r,0x1fa4),bits(-0));assert.equal(word(r,0x1fa8),bits(-0));
 assert.equal(number(word(r,0x1fac)),7533);
});

test('incoming branches collapse nested route lists while untouched list tails survive',()=>{
 const c=fixture();c.layout.nodes[1].classification98=6;c.layout.nodes[1].alternateNextSourceRowA4=3;
 const r=run(c);assert.deepEqual(r.diagnostic.routeRows,[0,1,3]);assert.equal(word(r,0x378c),3);
 assert.deepEqual(r.state.raceWords1f94.slice(at(0x3890),at(0x38a0)),[0,0,0,1]);
 assert.equal(word(r,0x379c),c.state.raceWords1f94[at(0x379c)]);
});

test('checkpoint count accepts exactly signed word1, rather than truthy flags',()=>{
 const c=fixture();[1,2,-1,0].forEach((v,i)=>c.layout.nodes[i].checkpointFlag9c=v);
 assert.equal(word(run(c),0x1fc0),1);
});

test('main8 uses B4 and retains the last candidate when its search budget expires',()=>{
 for(const kind of [1,2]){
  const c=fixture();c.input.main638=8;c.input.racerCount=1;
  c.layout.nodes.forEach((n,i)=>{n.classification98=kind;n.previousSourceRowB4=[2,3,1,0][i];});
  const r=run(c);assert.equal(word(r,0x2944),kind===2?3:0);assert.equal(word(r,0x2948),kind===1?3:0);
  assert.equal(word(r,0x2c48),word(r,0x2944));assert.equal(r.diagnostic.main8Cursors[0].foundSourceRow,-1);
 }
});

test('grid is copied directly into record places and a forced primary swap changes that same owner',()=>{
 const c=fixture();c.input.forceFirst8228=4;c.input.primaryHumanIndex=1;const r=run(c);
 assert.deepEqual(r.state.raceWords1f94.slice(at(0x26c0),at(0x26d0)),[2,3,0,1]);
 assert.deepEqual(Array.from({length:4},(_,i)=>word(r,0x293c+i*0x378)),[2,3,0,1]);
 assert.deepEqual(r.state.raceWords1f94.slice(at(0x3990),at(0x39a0)),c.state.raceWords1f94.slice(at(0x3990),at(0x39a0)));
 c.input.courseIndex=0;assert.deepEqual(Array.from({length:4},(_,i)=>word(run(c),0x293c+i*0x378)),[0,0,0,0]);
});

test('special grid, mode11 and course3 apply only their actual reset branches',()=>{
 const c=fixture();c.input.stateE6f8=1;c.input.mode620=11;c.input.courseIndex=3;
 c.layout.objectKinds4c=[2,0,2];let r=run(c);
 assert.deepEqual(r.state.raceWords1f94.slice(at(0x26c0),at(0x26d0)),[3,0,1,2]);
 assert.equal(word(r,0x39c0),0);assert.equal(word(r,0x2660),0);assert.equal(word(r,0x26bc),0);
 assert.equal(word(r,0x26d0),0);assert.equal(word(r,0x3a04),0);assert.equal(word(r,0x2a64),5);assert.equal(word(r,0x2a9c),1);
 c.layout.objectKinds4c=[];r=run(c);assert.equal(word(r,0x39c0),0);
 c.input.courseIndex=2;r=run(c);assert.equal(word(r,0x39c0),c.state.raceWords1f94[at(0x39c0)]);
});

test('an active empty prefix still needs the explicit finish row used by the source walk',()=>{
 const c=fixture();c.input.primaryCount=0;c.input.racerCount=0;const r=run(c);
 assert.equal(word(r,0x1fc0),0);assert.equal(word(r,0x3718),0);assert.deepEqual(r.diagnostic.routeRows,[0,1,2,3]);
 assert.deepEqual(r.diagnostic.recordWrittenCounts,[]);
});

test('raw state copies are detached and unsupported graphs or numeric domains reject atomically',()=>{
 const c=fixture(),s=createNativeRaceResetState(c.state),copy=nativeRaceResetSnapshot(s);copy.raceWords1f94[0]=0;
 assert.equal(s.raceWords1f94[0],c.state.raceWords1f94[0]);
 c.layout.nodes[2].nextSourceRowA0=1;assert.throws(()=>run(c),/does not close/);
 assert.deepEqual(c.state,s);
 const bad=fixture();bad.layout.nodes[0].referenceNativeXZ.x=Infinity;assert.throws(()=>run(bad),/finite float32/);
 bad.layout.nodes[0].referenceNativeXZ.x=0;bad.input.reverseDab68=65535;assert.throws(()=>run(bad),/reverseDab68/);
 bad.input.reverseDab68=0;bad.state.raceWords1f94[2]=-1;assert.throws(()=>run(bad),/raceWords1f94/);
 const sparse=fixture();delete sparse.state.raceWords1f94[12];assert.throws(()=>run(sparse),/raceWords1f94/);
 assert.throws(()=>createNativeRaceResetLayout({...fixture().layout,nodes:[]}),/stored source primary rows/);
});
