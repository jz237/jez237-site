import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNativeRaceRivalIndicators as prepare,nativeRaceVectorAngle as vectorAngle} from '../native-race-rival-indicators.js';
const data=new DataView(new ArrayBuffer(4)),F=Math.fround;
const bits=v=>{data.setFloat32(0,v,false);return data.getUint32(0,false);};
const hi=a=>(a-0x7788)/4,ri=(slot,o)=>(0x2938-0x1f94)/4+slot*222+o/4;
const op=(a,v)=>({kind:'hudWrite',byteOffset:a-0x7788,width:4,value:v>>>0});
const opsAt=(r,a)=>r.operations.filter(x=>x.byteOffset===a-0x7788);
function camera(v,index,fields){
 Object.assign(v.camerasByIndex[index],fields);
 // Camera DTOs are temporary views of the canonical HUD address range.
 for(const [offset,key]of [[0x4c,'field4c'],[0x54,'field54'],[0x7c,'field7c'],[0x84,'field84'],[0xf0,'fieldF0'],[0xf4,'fieldF4']])
  v.hudWords7788[hi(0x7c80+index*0x10c+offset)]=bits(v.camerasByIndex[index][key]);
}
function fixture(count=2,players=1){
 const v={raceWords1f94:Array(1693).fill(0),hudWords7788:Array(1442).fill(0),scene:{players,racerCount:count,primaryHumanIndex:0,secondaryHumanIndex:1},
  bodiesBySlot:Array.from({length:4},(_,i)=>({positionNativeXZ:{x:0,z:i*200}})),cameraIndicesByView:[0,1],
  camerasByIndex:Array.from({length:2},()=>({field4c:0,field54:0,field7c:0,field84:1000,fieldF0:0,fieldF4:-1})),
  // Synthetic, independently authored lookup values; no original data.
  angleTableWords6f08:Array(512).fill(bits(45)),sineTableWords4350:Array(4096).fill(bits(0))};
 v.angleTableWords6f08[0]=bits(90);v.angleTableWords6f08[511]=bits(0);
 v.sineTableWords4350[1024]=bits(1);v.sineTableWords4350[682]=bits(.5);v.sineTableWords4350[1706]=bits(.75);
 v.hudWords7788[hi(0x7a50)]=bits(2/3);
 for(let i=0;i<4;i++)v.raceWords1f94[ri(i,4)]=i;
 camera(v,0,{});camera(v,1,{});return v;
}

test('vector-angle helper preserves source axes, quadrants and zero early return',()=>{
 const table=Array(512).fill(bits(37.25));table[0]=bits(90);table[511]=bits(0);
 assert.equal(vectorAngle(0,-0),0);assert.equal(vectorAngle(1,0,table),90);assert.equal(vectorAngle(-1,0,table),270);
 assert.equal(vectorAngle(0,1,table),0);assert.equal(vectorAngle(0,-1,table),180);
 assert.equal(vectorAngle(1,1,table),37.25);assert.equal(vectorAngle(1,-1,table),142.75);
 assert.equal(vectorAngle(-1,-1,table),217.25);assert.equal(vectorAngle(-1,1,table),322.75);
 assert.throws(()=>vectorAngle(1,0),/512/);
});

test('centered rival writes active then vertical-angle-position source order',()=>{
 const v=fixture(),r=prepare(v),base=0x8b88+0x14;
 assert.deepEqual(r.operations,[op(0x8b88+16,0),op(base+16,0),op(base+16,1),op(base+4,bits(0)),op(base+8,bits(0)),op(base,bits(0))]);
 assert.equal(r.diagnostic.rivals[1].active,true);
});

test('self and filtered rivals clear only active, retaining previous float and neighbor words',()=>{
 const v=fixture();v.raceWords1f94[ri(1,4)]=0xffffffff;delete v.bodiesBySlot[1].positionNativeXZ;delete v.angleTableWords6f08;delete v.sineTableWords4350;
 const base=0x8b88+0x14;for(const off of [0,4,8,12,16])v.hudWords7788[hi(base+off)]=0x12345678+off;
 const before=structuredClone(v),r=prepare(v);
 assert.deepEqual(r.operations,[op(0x8b88+16,0),op(base+16,0)]);assert.deepEqual(v,before);
});

test('equal places remain eligible and no finish or DQ filter is invented',()=>{
 const v=fixture();v.raceWords1f94[ri(1,4)]=0;v.raceWords1f94[ri(1,0x2ec)]=1;v.raceWords1f94[ri(1,0x2f4)]=1;
 assert.equal(prepare(v).diagnostic.rivals[1].active,true);
});

test('range1024 and angle135 are inclusive source boundaries',()=>{
 const v=fixture();v.bodiesBySlot[1].positionNativeXZ={x:1024,z:0};v.angleTableWords6f08[0]=bits(135);
 assert.equal(prepare(v).diagnostic.rivals[1].active,true);
 v.bodiesBySlot[1].positionNativeXZ.x=F(1024.01);assert.equal(prepare(v).diagnostic.rivals[1].active,false);
 v.bodiesBySlot[1].positionNativeXZ.x=100;v.angleTableWords6f08[0]=bits(135.01);assert.equal(prepare(v).diagnostic.rivals[1].active,false);
});

test('direct angle lookup precedes the distance rejection',()=>{
 const v=fixture();v.bodiesBySlot[1].positionNativeXZ.z=10000;delete v.angleTableWords6f08;
 assert.throws(()=>prepare(v),/angleTableWords/);
});

test('source rawF0/F4 axis is negated without normalization or modern-heading substitution',()=>{
 const v=fixture();camera(v,0,{fieldF4:-2});delete v.angleTableWords6f08;delete v.sineTableWords4350;
 // The source dot2 is outside ED090's domain and returns0 without a table.
 assert.equal(prepare(v).diagnostic.rivals[1].active,true);
 v.camerasByIndex[0].directionXZ={x:0,z:-1};assert.equal(prepare(v).diagnostic.rivals[1].active,true);
});

test('authored source table views control curved side coordinates and signed angle',()=>{
 for(const direction of [1,-1]){
  const v=fixture();v.bodiesBySlot[1].positionNativeXZ={x:direction*500,z:0};const r=prepare(v),base=0x8b88+0x14;
  assert.deepEqual(opsAt(r,base+4),[op(base+4,bits(-6))]);
  assert.deepEqual(opsAt(r,base+8),[op(base+8,bits(direction*60))]);
  assert.deepEqual(opsAt(r,base),[op(base,bits(direction*110))]);
 }
});

test('corner coefficient comes from canonical7a50 and keeps a zero-scale lookup branch',()=>{
 const v=fixture();v.bodiesBySlot[1].positionNativeXZ={x:500,z:0};v.hudWords7788[hi(0x7a50)]=bits(0);
 const base=0x8b88+0x14,r=prepare(v);
 assert.deepEqual(opsAt(r,base),[op(base,bits(94))]);assert.deepEqual(opsAt(r,base+4),[op(base+4,bits(-0))]);
 delete v.sineTableWords4350;assert.throws(()=>prepare(v),/sineTableWords/);
});

test('zero bend leaves sine table and corner coefficient genuinely unread',()=>{
 const v=fixture();delete v.sineTableWords4350;v.hudWords7788[hi(0x7a50)]=bits(NaN);
 assert.equal(prepare(v).diagnostic.rivals[1].active,true);
});

test('human slot and source camera indices are independent for two views',()=>{
 const v=fixture(3,2);v.scene.primaryHumanIndex=2;v.scene.secondaryHumanIndex=0;v.cameraIndicesByView=[1,0];camera(v,1,{field4c:100});
 const r=prepare(v);assert.equal(r.diagnostic.rivals[0].cameraIndex,1);assert.equal(r.diagnostic.rivals[3].cameraIndex,0);
 assert.equal(r.diagnostic.rivals.find(x=>x.viewIndex===0&&x.racerIndex===2).reason,'selected-human');
 assert.equal(r.diagnostic.rivals.find(x=>x.viewIndex===1&&x.racerIndex===0).reason,'selected-human');
});

test('zero racers still requires real camera7c84 read but no canonical row or lookup input',()=>{
 const v=fixture(0);delete v.raceWords1f94;delete v.hudWords7788;delete v.angleTableWords6f08;delete v.sineTableWords4350;delete v.bodiesBySlot;
 assert.deepEqual(prepare(v).operations,[]);delete v.camerasByIndex[0].field7c;assert.throws(()=>prepare(v),/field7c/);
 assert.deepEqual(prepare({scene:{players:0}}),{operations:[],diagnostic:{rivals:[]}});
});

test('sparse raw spans and reached lookup holes reject explicitly',()=>{
 const v=fixture();delete v.hudWords7788[6];assert.throws(()=>prepare(v),/word/);
 const w=fixture();delete w.angleTableWords6f08[6];assert.throws(()=>prepare(w),/word/);
 const x=fixture();x.bodiesBySlot[1].positionNativeXZ={x:500,z:0};delete x.sineTableWords4350[6];assert.throws(()=>prepare(x),/word/);
});

test('failed late sine preparation is atomic and successful results detach from all owners',()=>{
 const v=fixture();v.bodiesBySlot[1].positionNativeXZ={x:500,z:0};delete v.sineTableWords4350;const before=structuredClone(v);
 assert.throws(()=>prepare(v),/sineTableWords/);assert.deepEqual(v,before);
 const w=fixture(),r=prepare(w),saved=structuredClone(r);w.hudWords7788.fill(0);w.raceWords1f94.fill(7);w.camerasByIndex[0].fieldF4=0;
 assert.deepEqual(r,saved);assert.equal(Object.isFrozen(r.operations),true);assert.equal(Object.isFrozen(r.diagnostic.rivals[0]),true);
});
