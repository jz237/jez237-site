import test from 'node:test';
import assert from 'node:assert/strict';
import {selectNativeAIPower} from '../native-ai-power.js';

// Numeric leaf fixtures, with all unknown source flags supplied explicitly.
// Comparisons remain own record versus SLOTZERO, never an assumed human rank.
const base={difficulty:0,role:0,avatar:0,own293c:10,slotZero293c:10,
 flagA4:0,flagB0:0,flag98:0,finished2c2c:0,markedBox15de:0,fieldC7c:1,counter90:0,courseIndex:1,rawXNative:0,previousPowerFactor:.73};
const select=patch=>selectNativeAIPower({...base,...patch});

test('difficulty0 role/record branches preserve equality and the B0 comparison bypass',()=>{
 for(const [role,override,lower,equal]of [[-1,.7599999904632568,.699999988079071,.8999999761581421],[0,.7599999904632568,.699999988079071,.8999999761581421],
  [1,.7300000190734863,.6000000238418579,.800000011920929],[2,.699999988079071,.5,.699999988079071]]){
  assert.equal(select({role,own293c:11}),override);
  assert.equal(select({role,own293c:9}),lower);
  assert.equal(select({role}),equal);
  assert.equal(select({role,own293c:11,flagB0:1}),equal);
  assert.equal(select({role,own293c:9,flagB0:-1,flagA4:-1}),override);
 }
 for(const [avatar,expected]of [[0,.5],[1,.5699999928474426],[2,.5],[3,.5]])assert.equal(select({role:2,own293c:9,avatar}),expected);
});

test('difficulty1 uses avatar only in its comparison-override branch and roles in the other branches',()=>{
 for(const avatar of [0,1,2,3]){
  assert.equal(select({difficulty:1,avatar,own293c:11}),avatar===1?.8600000143051147:.8799999952316284);
  assert.equal(select({difficulty:1,avatar,flagA4:1,own293c:-100}),avatar===1?.8600000143051147:.8799999952316284);
 }
 for(const [role,lower,equal]of [[-1,.8999999761581421,1],[0,.8999999761581421,1],[1,.800000011920929,.9300000071525574],[2,.699999988079071,.8500000238418579]]){
  assert.equal(select({difficulty:1,role,own293c:9}),lower);
  assert.equal(select({difficulty:1,role}),equal);
  assert.equal(select({difficulty:1,role,own293c:11,flagB0:1}),equal);
 }
});

test('difficulty2 keeps its own precedence and is never inferred from an unrecognized browser difficulty',()=>{
 for(const [role,expected]of [[-1,1],[0,1],[1,.949999988079071],[2,.8999999761581421]]){
  for(const own293c of [9,10])assert.equal(select({difficulty:2,role,own293c}),expected);
  assert.equal(select({difficulty:2,role,own293c:11,flagB0:1}),expected);
  assert.equal(select({difficulty:2,role,flagA4:1}),.949999988079071);
  assert.equal(select({difficulty:2,role,own293c:11}),.949999988079071);
 }
 assert.equal(select({difficulty:3,previousPowerFactor:.777}),.7770000100135803);
 assert.equal(select({difficulty:-1,previousPowerFactor:.777}),.7770000100135803);
});

test('finished record overrides the difficulty table but later physical flags still win',()=>{
 for(const difficulty of [0,1,2,3])for(const [avatar,expected]of [[0,.5],[1,.5699999928474426],[2,.5],[3,.5]]){
  assert.equal(select({difficulty,avatar,flagA4:1,finished2c2c:-1}),expected);
  assert.equal(select({difficulty,avatar,finished2c2c:1,flag98:1}),1);
  assert.equal(select({difficulty,avatar,finished2c2c:1,markedBox15de:1}),1.0499999523162842);
 }
});

test('the raw signed steering override is strictly |X|>56 and numeric98 independently selects1',()=>{
 for(const rawXNative of [-56,-55,0,55,56])assert.equal(select({rawXNative}),.8999999761581421);
 for(const rawXNative of [-128,-127,-57,57,127])assert.equal(select({rawXNative}),1);
 for(const flag98 of [-0x80000000,-1,1,0x7fffffff])assert.equal(select({flag98}),1);
 // Steering is raw source input, not normalized or curved human input.
 assert.throws(()=>select({rawXNative:.8}),/rawXNative/);
});

test('marked15de dominatesC7c-zero, counter16 dominates both, then course0 dominates every prior choice',()=>{
 assert.equal(select({rawXNative:70,fieldC7c:0}),1.2000000476837158);
 for(const markedBox15de of [-32768,-1,1,32767])assert.equal(select({markedBox15de,fieldC7c:0,flag98:1}),1.0499999523162842);
 for(const counter90 of [-1,0,15])assert.equal(select({counter90,fieldC7c:0}),1.2000000476837158);
 for(const counter90 of [16,17,0x7fffffff])assert.equal(select({counter90,fieldC7c:0,markedBox15de:-1}),1);
 for(const patch of [{fieldC7c:0},{finished2c2c:1},{markedBox15de:1},{difficulty:3,previousPowerFactor:1.8}])assert.equal(select({...patch,courseIndex:0}),1);
});

test('unrecognized difficulty retains prior binary32 before exact lower/upper clamps and overrides',()=>{
 for(const previousPowerFactor of [-2,0,.4,.5])assert.equal(select({difficulty:3,previousPowerFactor}),.5);
 assert.equal(select({difficulty:3,previousPowerFactor:1.2}),1.2000000476837158);
 assert.equal(select({difficulty:3,previousPowerFactor:2}),1.2000000476837158);
 assert.equal(select({difficulty:3,previousPowerFactor:2,markedBox15de:1}),1.0499999523162842);
 assert.equal(select({difficulty:3,previousPowerFactor:-2,counter90:16}),1);
});

test('signed record comparison, avatar identity and caller snapshots remain independent and immutable',()=>{
 const q={...base,own293c:-0x80000000,slotZero293c:0x7fffffff,role:1},before=structuredClone(q);Object.freeze(q);
 assert.equal(selectNativeAIPower(q),.6000000238418579);assert.deepEqual(q,before);
 assert.equal(select({own293c:0x7fffffff,slotZero293c:-0x80000000,role:1}),.7300000190734863);
 assert.equal(select({own293c:-5,slotZero293c:-5,role:1}),.800000011920929);
 for(let i=0;i<100;i++)assert.equal(selectNativeAIPower(q),.6000000238418579);
});

test('every source input is explicit and malformed or out-of-width fields reject',()=>{
 for(const key of Object.keys(base)){const q={...base};delete q[key];assert.throws(()=>selectNativeAIPower(q),key);}
 for(const [key,value]of [['difficulty',.5],['role',-2],['role',3],['avatar',4],['avatar',-1],['own293c',0x80000000],
  ['slotZero293c',-0x80000001],['flagA4',true],['flagB0',NaN],['flag98',Infinity],['finished2c2c',false],
  ['markedBox15de',32768],['fieldC7c',-1],['fieldC7c',65536],['counter90',1.5],['courseIndex',10],
  ['rawXNative',128],['rawXNative',-129],['previousPowerFactor',NaN],['previousPowerFactor',Infinity],['previousPowerFactor',1e40]])assert.throws(()=>select({[key]:value}),key);
 for(const q of [null,undefined,[],true])assert.throws(()=>selectNativeAIPower(q));
});
