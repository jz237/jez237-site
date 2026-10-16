import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareNativeDisplayListRelocation as list,prepareNativeRiderResourceRelocation as rider} from '../native-rider-resource-relocation.js';
import {prepareNativeRaceRiderResourceConfiguration as configure} from '../native-race-resource-configuration.js';
function fixture(kind=0,avatar=0,variant=0,slot=0){
 const resourceWordsE73c=Array(43).fill(0);resourceWordsE73c[0]=kind;resourceWordsE73c[slot+1]=(avatar<<16)|variant;
 const loadedAssetWords=Array.from({length:51},(_,i)=>[0x04000000,0xffffffff,0xfd000000,i,0x06000000,123,0xb8000000,99]).flat();
 const views={avatarLookupWordsACD0:Array.from({length:8},()=>Array.from({length:51},(_,i)=>(0x08000000+i*32)>>>0)),
  mode0BaseWordsAB90:[1,2,3,4],mode2BaseWordsABA0:[5,6,7,8,9,10,11,12],mode4BaseWordsABC0:[9,10,11,12]};
 return {value:{resourceWordsE73c,loadedAssetWords},input:{slot},views};
}
test('relocates only vertex/texture operands, wraps u32, stops at first B8, preserves the input',()=>{
 const words=[0x04000000,0xffffffff,0xfd000000,0x80000000,0x06000000,13,0xb8000000,9,0x04000000,40],before=[...words];
 const q=list({loadedAssetWords:words},{byteOffset:0,baseWord:2});
 assert.deepEqual(q.operations,[{kind:'loadedAssetWrite',byteOffset:4,width:4,value:1},{kind:'loadedAssetWrite',byteOffset:12,width:4,value:0x80000002}]);
 assert.deepEqual(words,before);assert.equal(q.diagnostic.terminatorByteOffset,24);assert.ok(Object.isFrozen(q.operations[0]));assert.equal(Object.isFrozen(words),false);
});
test('allows a word-aligned start and a terminator without an unused operand',()=>{
 assert.deepEqual(list({loadedAssetWords:[9,0xb8000000]},{byteOffset:4,baseWord:0}).operations,[]);
});
test('missing terminator or operand rejects without partial caller mutation',()=>{
 for(const words of [[0x04000000,3],[0xfd000000],[0x06000000,8]]){
  const before=[...words];assert.throws(()=>list({loadedAssetWords:words},{byteOffset:0,baseWord:1}),RangeError);assert.deepEqual(words,before);
 }
 assert.throws(()=>list({loadedAssetWords:[0xb8000000]},{byteOffset:2,baseWord:0}),/aligned/);
});
test('variants select part0 or parts1+2, and only avatars2/6 select the extra five lists',()=>{
 for(let avatar=0;avatar<8;avatar++)for(const variant of [0,1]){
  const f=fixture(0,avatar,variant),q=rider(f.value,f.input,f.views),per=avatar===2||avatar===6?17:12;
  assert.equal(q.diagnostic.lists.length,per*(variant+1));assert.equal(q.operations.length,per*(variant+1)*2);
  assert.deepEqual([...new Set(q.diagnostic.lists.map(v=>v.part))],variant?[1,2]:[0]);
 }
});
test('selects the source bank for every kind and supports all eight menu slots',()=>{
 for(let kind=0;kind<5;kind++)for(let slot=0;slot<(kind===3?8:kind===1?2:4);slot++){
  const f=fixture(kind,2,0,slot),q=rider(f.value,f.input,f.views);
  assert.equal(q.diagnostic.lists[0].baseWord,(kind===4?9:kind>=2?5:1)+slot);
 }
});
test('shared lists relocate repeatedly against earlier writes',()=>{
 const f=fixture();f.views.avatarLookupWordsACD0[0].fill(0);
 const q=rider(f.value,f.input,f.views);
 assert.deepEqual(q.operations.filter(v=>v.byteOffset===4).map(v=>v.value),Array.from({length:12},(_,i)=>i));
 assert.equal(f.value.loadedAssetWords[1],0xffffffff);
});
test('unselected rows, parts and base banks are not read',()=>{
 const f=fixture(1,2,0,1),rows=Array(8);rows[2]=Array(51);rows[2].fill(0,0,17);
 for(let i=17;i<51;i++)Object.defineProperty(rows[2],i,{get(){throw Error('unused part');}});
 const views={avatarLookupWordsACD0:rows,mode0BaseWordsAB90:[undefined,3],get mode2BaseWordsABA0(){throw Error('unused bank');}};
 assert.equal(rider(f.value,f.input,views).operations.length,34);
});
test('invalid late lookup, unsupported selectors and sparse decoded memory reject atomically',()=>{
 const f=fixture(0,2),before=structuredClone(f.value);f.views.avatarLookupWordsACD0[2][16]=0x00fffffc;
 assert.throws(()=>rider(f.value,f.input,f.views),/terminator/);assert.deepEqual(f.value,before);
 f.value.resourceWordsE73c[1]=2;assert.throws(()=>rider(f.value,f.input,f.views),/variant/);
 f.value.resourceWordsE73c[1]=8<<16;assert.throws(()=>rider(f.value,f.input,f.views),/avatar/);
 f.value.resourceWordsE73c[1]=0;delete f.value.loadedAssetWords[5];assert.throws(()=>rider(f.value,f.input,f.views),/loadedAssetWords/);
});
test('kind3 initializer selectors feed all eight rider fixups without changing logical identities',()=>{
 const f=fixture(3);Object.assign(f.value,{resourceWordsB330:Array(36).fill(0),hudWords7788:Array(1442).fill(0)});
 f.views.riderDescriptorRowsABD0=Array.from({length:16},()=>[0,0,0,0]);
 const setup=configure(f.value,{kind:3,avatarIndices:[3,1,2,0]},f.views);
 for(const op of setup.operations){
  const target=f.value[op.kind==='hudWrite'?'hudWords7788':op.owner],i=op.byteOffset>>>2;
  if(op.width===4)target[i]=op.value;
  else{const shift=op.byteOffset&2?0:16;target[i]=((target[i]&~(65535<<shift))|(op.value<<shift))>>>0;}
 }
 const results=Array.from({length:8},(_,slot)=>rider(f.value,{slot},f.views));
 assert.deepEqual(results.map(q=>q.diagnostic.avatar),[3,1,2,0,7,5,6,4]);
 assert.deepEqual(results.map(q=>q.diagnostic.lists.length),[12,12,17,12,12,12,17,12]);
 assert.ok(results.every(q=>q.diagnostic.variant===0));
});
