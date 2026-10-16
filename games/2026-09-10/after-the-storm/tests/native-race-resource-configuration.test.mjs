import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNativeRaceRiderResourceConfiguration as rider,prepareNativeRaceCourseResourceConfiguration as course} from '../native-race-resource-configuration.js';
const rw=(owner,byteOffset,width,value)=>({kind:'resourceWrite',owner,byteOffset,width,value:value>>>0});
const unused=()=>{throw new Error('unreached resource data');};
const atHud=a=>(a-0x7788)/4;
function fixture(){
 const value={resourceWordsB330:Array.from({length:20},(_,i)=>0xb1230000+i),resourceWordsB538:Array.from({length:8},(_,i)=>0xc1230000+i),
  resourceWordsE73c:Array.from({length:43},(_,i)=>0xa1230000+i),hudWords7788:Array.from({length:1442},(_,i)=>0xd1230000+i)};
 const views={riderDescriptorRowsABD0:Array.from({length:16},(_,i)=>[100+i,200+i,300+i,400+i]),
  avatarLookupWordsACD0:Array.from({length:8},(_,id)=>Array.from({length:51},(_,i)=>id*1000+i)),
  mode0BaseWordsAB90:[10,20,30,40],mode2BaseWordsABA0:[90,100,110,120],mode4BaseWordsABC0:[50,60,70,80],
  courseDescriptorRowsB4a8:Array.from({length:9},(_,i)=>[1000+i,2000+i,7,4000+i]),
  courseByteLengthWordsCE18:[0,1,63,64,65,127,128,0xffffffff,0x80000000]};
 return {value,views};
}
function apply(value,operations){
 const v=structuredClone(value);for(const o of operations){
  const words=v[o.kind==='hudWrite'?'hudWords7788':o.owner],i=o.byteOffset>>2;
  if(o.width===4)words[i]=o.value;else{const shift=o.byteOffset&2?0:16;words[i]=((words[i]&~(65535<<shift))|(o.value<<shift))>>>0;}
 }return v;
}
const field=(v,offset)=>v.resourceWordsE73c[offset/4]>>>0;
const descriptorOps=q=>q.operations.filter(o=>o.owner==='resourceWordsB330');
const hudBlocks=v=>Array.from({length:7},(_,i)=>v.hudWords7788.slice(atHud(0x7a60)+i*17,atHud(0x7a60)+(i+1)*17));

test('rider preparation writes all eight flags before reverse selector order and kind-specific clears',()=>{
 const {value,views}=fixture(),q=rider(value,{kind:4,avatarIndices:[0,1,2,3]},views);
 assert.deepEqual(q.operations.slice(0,13),[
  ...Array.from({length:8},(_,i)=>rw('resourceWordsE73c',6+i*4,2,1)),rw('resourceWordsE73c',40,4,0xffffffff),
  rw('resourceWordsE73c',36,4,0xffffffff),rw('resourceWordsE73c',0,4,4),rw('resourceWordsE73c',10,2,0),rw('resourceWordsE73c',6,2,0)]);
 const next=apply(value,q.operations);assert.equal(field(next,32),0xa1230001); // Unselected slot7 ID preserved, flag set.
 assert.deepEqual(value.resourceWordsE73c[8],0xa1230008);
});

test('logical IDs stay unshifted while variant flags select the separate descriptor+8 bank',()=>{
 const {value,views}=fixture();let q=rider(value,{kind:0,avatarIndices:[1,2,3,0]},views),n=apply(value,q.operations);
 assert.deepEqual([0,1,2,3].map(i=>n.resourceWordsB330[i*4]),[101,110,111,108]);
 assert.deepEqual([0,1,2,3].map(i=>n.resourceWordsE73c[1+i]>>>16),[1,2,3,0]);
 q=rider(value,{kind:4,avatarIndices:[1,2,3,0]},views);n=apply(value,q.operations);
 assert.deepEqual([0,1,2,3].map(i=>n.resourceWordsB330[i*4]),[101,102,111,108]);
});

test('descriptor word2 and word3 duplicate writes precede the four-word terminator',()=>{
 const {value,views}=fixture(),q=rider(value,{kind:0,avatarIndices:[0,1,2,3]},views),ops=descriptorOps(q);
 assert.deepEqual(ops.slice(0,6),[rw('resourceWordsB330',0,4,100),rw('resourceWordsB330',4,4,200),
  rw('resourceWordsB330',8,4,300),rw('resourceWordsB330',8,4,4),rw('resourceWordsB330',12,4,400),rw('resourceWordsB330',12,4,10)]);
 assert.deepEqual(ops.slice(-4),[64,68,72,76].map(offset=>rw('resourceWordsB330',offset,4,0)));
});

test('kind0 copies seven source parts and relocates only twelve ordinary words',()=>{
 const {value,views}=fixture(),q=rider(value,{kind:0,avatarIndices:[0,1,3,1]},views),n=apply(value,q.operations),blocks=hudBlocks(n);
 assert.deepEqual(blocks.map(b=>b[0]),[10,1037,1054,3047,3064,1057,1074]);
 assert.deepEqual(blocks.map(b=>b[12]),[12,1029,1046,3029,3046,1029,1046]);
 assert.equal(q.diagnostic.presentationBlockCount,7);assert.equal(n.hudWords7788[atHud(0x7c3c)],value.hudWords7788[atHud(0x7c3c)]);
});

test('kind4 block order uses both leading parts then interleaves secondary parts and retains the seventh block',()=>{
 const {value,views}=fixture(),q=rider(value,{kind:4,avatarIndices:[0,1,3,0]},views),n=apply(value,q.operations),blocks=hudBlocks(n);
 assert.deepEqual(blocks.slice(0,6).map(b=>b[0]),[50,1060,3087,97,3104,114]);
 assert.deepEqual(blocks[6],hudBlocks(value)[6]);assert.equal(q.diagnostic.presentationBlockCount,6);
});

test('special logical IDs2/6 relocate all seventeen words and duplicate selectors keep the last match',()=>{
 const {value,views}=fixture();let q=rider(value,{kind:0,avatarIndices:[2,6,2,6]},views),n=apply(value,q.operations);
 assert.equal(field(n,36),3);assert.equal(field(n,40),5);
 assert.deepEqual(hudBlocks(n).map(b=>b[16]),[2026,6053,6070,2063,2080,6073,6090]);
 q=rider(value,{kind:4,avatarIndices:[2,2,6,6]},views);n=apply(value,q.operations);
 assert.equal(field(n,36),1);assert.equal(field(n,40),0xffffffff);
});

test('relocation adds modulo32 even to zero words and does not treat them as null exceptions',()=>{
 const {value,views}=fixture();views.mode0BaseWordsAB90[0]=0xffffffff;views.avatarLookupWordsACD0[0][0]=0;views.avatarLookupWordsACD0[0][1]=3;
 const n=apply(value,rider(value,{kind:0,avatarIndices:[0,1,2,3]},views).operations);
 assert.equal(n.hudWords7788[atHud(0x7a60)],0xffffffff);assert.equal(n.hudWords7788[atHud(0x7a64)],2);
});

test('negative signed avatars clamp to0 while unsupported positive IDs and kinds reject',()=>{
 const {value,views}=fixture(),q=rider(value,{kind:0,avatarIndices:[-2147483648,-1,2,3]},views);
 assert.deepEqual(q.diagnostic.logicalAvatarIndices,[0,0,2,3]);
 assert.throws(()=>rider(value,{kind:0,avatarIndices:[8,0,0,0]},views),/avatarIndices/);
 for(const kind of [-1,1,3,5])assert.throws(()=>rider(value,{kind,avatarIndices:[0,1,2,3]},views),/kinds/);
});

test('rider reads only selected source rows/parts/bank and does not read the course descriptor owner',()=>{
 const {value,views}=fixture();Object.defineProperty(value,'resourceWordsB538',{get:unused});Object.defineProperty(views,'mode4BaseWordsABC0',{get:unused});
 for(let row=1;row<8;row++)Object.defineProperty(views.avatarLookupWordsACD0,row,{get:unused});
 // ID0 is used in slots1..3 too, so all three parts are reached in this case.
 assert.doesNotThrow(()=>rider(value,{kind:0,avatarIndices:[0,0,0,0]},views));
 const v=fixture();for(let i=17;i<51;i++)Object.defineProperty(v.views.avatarLookupWordsACD0[0],i,{get:unused});
 assert.doesNotThrow(()=>rider(v.value,{kind:0,avatarIndices:[0,1,1,1]},v.views));
});

test('two course sentinels retain old leading descriptor words and do not read any source tables',()=>{
 const {value}=fixture(),q=course(value,{baseWord:0x08060000,resourceIndices:[-1,-1]}),n=apply(value,q.operations);
 assert.deepEqual(q.operations,[rw('resourceWordsE73c',156,4,0xffffffff),rw('resourceWordsE73c',160,4,0x08060000),
  rw('resourceWordsB538',8,4,0),rw('resourceWordsB538',12,4,0),rw('resourceWordsE73c',164,4,0xffffffff),
  rw('resourceWordsE73c',168,4,0x08060000),rw('resourceWordsB538',24,4,0),rw('resourceWordsB538',28,4,0)]);
 assert.deepEqual(n.resourceWordsB538,[0xc1230000,0xc1230001,0,0,0xc1230004,0xc1230005,0,0]);
 assert.equal(q.diagnostic.finalCursorWord,0x08060000);assert.deepEqual(n.hudWords7788,value.hudWords7788);
});

test('course pair stores full cursor but descriptor gets low24 bits after all four copied words',()=>{
 const {value,views}=fixture(),q=course(value,{baseWord:0x08060000,resourceIndices:[1,-1]},views),n=apply(value,q.operations);
 assert.deepEqual(q.operations.slice(3,8),[rw('resourceWordsB538',0,4,1001),rw('resourceWordsB538',4,4,2001),
  rw('resourceWordsB538',8,4,7),rw('resourceWordsB538',12,4,4001),rw('resourceWordsB538',12,4,0x60000)]);
 assert.equal(field(n,160),0x08060000);assert.equal(field(n,168),0x08060040);assert.equal(q.diagnostic.finalCursorWord,0x08060040);
});

test('equal course indices overwrite slot-map0 then1, preserving neighboring halfword and all other map entries',()=>{
 const {value,views}=fixture(),q=course(value,{baseWord:0,resourceIndices:[3,3]},views),n=apply(value,q.operations);
 assert.deepEqual(q.operations.filter(o=>o.owner==='resourceWordsE73c'&&o.width===2),[
  rw('resourceWordsE73c',50,2,0),rw('resourceWordsE73c',50,2,1)]);
 assert.equal(n.resourceWordsE73c[12]>>>16,value.resourceWordsE73c[12]>>>16);assert.equal(n.resourceWordsE73c[12]&65535,1);
 assert.equal(n.resourceWordsE73c[13],value.resourceWordsE73c[13]);
});

test('course alignment wraps unsigned32 with zero/odd/huge lengths and source sentinel does not advance',()=>{
 const {value,views}=fixture();
 assert.equal(course(value,{baseWord:0xffffffff,resourceIndices:[0,-1]},views).diagnostic.finalCursorWord,0);
 assert.equal(course(value,{baseWord:0,resourceIndices:[2,-1]},views).diagnostic.finalCursorWord,64);
 assert.equal(course(value,{baseWord:0,resourceIndices:[3,-1]},views).diagnostic.finalCursorWord,64);
 assert.equal(course(value,{baseWord:0x80000000,resourceIndices:[8,-1]},views).diagnostic.finalCursorWord,0);
 assert.equal(course(value,{baseWord:0,resourceIndices:[7,-1]},views).diagnostic.finalCursorWord,0);
 assert.equal(course(value,{baseWord:0x08000001,resourceIndices:[-1,-1]}).diagnostic.finalCursorWord,0x08000001);
});

test('course source reads are lazy by selected index and do not require rider/HUD owners',()=>{
 const {value,views}=fixture();for(const key of ['resourceWordsB330','hudWords7788'])Object.defineProperty(value,key,{get:unused});
 for(const key of ['riderDescriptorRowsABD0','avatarLookupWordsACD0','mode0BaseWordsAB90','mode4BaseWordsABC0'])Object.defineProperty(views,key,{get:unused});
 for(let i=1;i<9;i++){Object.defineProperty(views.courseDescriptorRowsB4a8,i,{get:unused});Object.defineProperty(views.courseByteLengthWordsCE18,i,{get:unused});}
 assert.doesNotThrow(()=>course(value,{baseWord:0,resourceIndices:[0,-1]},views));
});

test('late bad data and sparse raw owners reject atomically, without aliases or implicit zeros',()=>{
 const {value,views}=fixture(),before=structuredClone(value);views.avatarLookupWordsACD0[3][50]=NaN;
 const beforeViews=structuredClone(views);assert.throws(()=>rider(value,{kind:0,avatarIndices:[0,1,2,3]},views),/lookup/);
 assert.deepEqual(value,before);assert.deepEqual(views,beforeViews);
 for(const key of ['resourceWordsB330','resourceWordsE73c','hudWords7788']){
  const v=fixture();delete v.value[key][0];assert.throws(()=>rider(v.value,{kind:0,avatarIndices:[0,1,2,3]},v.views),/Invalid/);
 }
 const v=fixture();delete v.value.resourceWordsB538[1];assert.throws(()=>course(v.value,{baseWord:0,resourceIndices:[-1,-1]}),/Invalid/);
});

test('invalid course index/length rejects after detached preparation and never changes supplied owners',()=>{
 const {value,views}=fixture(),before=structuredClone(value);views.courseByteLengthWordsCE18[1]=NaN;
 assert.throws(()=>course(value,{baseWord:0x08060000,resourceIndices:[0,1]},views),/courseByteLength/);assert.deepEqual(value,before);
 for(const index of [-2,9,0xffffffff])assert.throws(()=>course(value,{baseWord:0,resourceIndices:[index,-1]},views),/resourceIndices/);
 assert.throws(()=>course(value,{baseWord:-1,resourceIndices:[-1,-1]}),/baseWord/);
});

test('both leaves return deeply frozen detached numeric patches with no load/queue/RNG effects',()=>{
 for(const scope of ['rider','course']){
  const {value,views}=fixture(),before=structuredClone(value),beforeViews=structuredClone(views),q=scope==='rider'?
   rider(value,{kind:4,avatarIndices:[0,1,0,1]},views):course(value,{baseWord:0x08060000,resourceIndices:[0,1]},views);
  assert.deepEqual(Object.keys(q),['operations','diagnostic']);assert.equal(Object.isFrozen(q),true);assert.equal(Object.isFrozen(q.operations[0]),true);
  assert.ok(q.operations.every(o=>['resourceWrite','hudWrite'].includes(o.kind)));assert.equal(q.diagnostic.loaderExecuted,false);
  assert.equal(q.diagnostic.queueCalls,0);assert.equal(q.diagnostic.rngCalls,0);assert.equal(q.diagnostic.physicalInitialization,false);
  assert.deepEqual(value,before);assert.deepEqual(views,beforeViews);assert.equal(Object.isFrozen(value.resourceWordsE73c),false);
 }
});


test('result-menu kind2 clears four variants in order and uses four unshifted descriptors',()=>{
 const {value,views}=fixture(),q=rider(value,{kind:2,avatarIndices:[0,1,2,3]},views),n=apply(value,q.operations);
 assert.deepEqual(q.operations.slice(11,15),[6,10,14,18].map(offset=>rw('resourceWordsE73c',offset,2,0)));
 assert.deepEqual([0,1,2,3].map(i=>n.resourceWordsB330[i*4]),[100,101,102,103]);
 assert.deepEqual([0,1,2,3].map(i=>n.resourceWordsB330[i*4+3]),[90,100,110,120]);
 assert.deepEqual([0,1,2,3].map(i=>n.resourceWordsE73c[1+i]&65535),[0,0,0,0]);
 assert.deepEqual(hudBlocks(n).slice(0,4).map(b=>b[0]),[90,1100,2110,3120]);
 assert.deepEqual(hudBlocks(n).slice(0,4).map(b=>b[16]),[16,1016,2126,3016]);
 assert.deepEqual(hudBlocks(n).slice(4),hudBlocks(value).slice(4));
 assert.equal(q.diagnostic.presentationBlockCount,4);
});

test('kind2 special selectors use the last matching physical slot, with modulo32 relocation',()=>{
 const {value,views}=fixture();views.mode2BaseWordsABA0[3]=0xffffffff;
 const q=rider(value,{kind:2,avatarIndices:[2,6,2,6]},views),n=apply(value,q.operations);
 assert.equal(field(n,36),2);assert.equal(field(n,40),3);
 assert.deepEqual(hudBlocks(n).slice(0,4).map(b=>b[16]),[2106,6116,2126,6015]);
 views.avatarLookupWordsACD0[6][0]=0;
 const z=apply(value,rider(value,{kind:2,avatarIndices:[2,6,2,6]},views).operations);
 assert.equal(hudBlocks(z)[3][0],0xffffffff);
});

test('kind2 reads no secondary parts, variant rows, or other base banks',()=>{
 const {value,views}=fixture();
 for(const bank of ['mode0BaseWordsAB90','mode4BaseWordsABC0'])Object.defineProperty(views,bank,{get:unused});
 for(let row=4;row<16;row++)Object.defineProperty(views.riderDescriptorRowsABD0,row,{get:unused});
 for(let row=0;row<4;row++)for(let j=17;j<51;j++)Object.defineProperty(views.avatarLookupWordsACD0[row],j,{get:unused});
 assert.doesNotThrow(()=>rider(value,{kind:2,avatarIndices:[0,1,2,3]},views));
});

test('kind2 late invalid presentation data rejects without modifying retained owners',()=>{
 const {value,views}=fixture(),before=structuredClone(value);views.avatarLookupWordsACD0[3][16]=NaN;
 assert.throws(()=>rider(value,{kind:2,avatarIndices:[0,1,2,3]},views),/lookup/);
 assert.deepEqual(value,before);
});
