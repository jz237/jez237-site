import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {prepareNativeActorPresentation as prepare} from '../native-actor-presentation.js';
import {prepareNativeActorDisplayFrame} from '../native-actor-display-frame.js';
import {createNativeRaceMemory} from '../native-race-memory.js';
const e=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-presentation-actor-display.json.gz',import.meta.url))));
const digest=words=>{const b=Buffer.alloc(words.length*4);words.forEach((w,i)=>b.writeUInt32BE(w,i*4));return createHash('sha256').update(b).digest('hex');};
const effects=operations=>operations.filter(o=>/^presentation(?:Actor(?:Matrix|Part|Material|Surface|RetainedMatrix)|Light|Fog|GraphicsSync)/.test(o.kind));
const initial=()=>({matrixBuffers:Array.from({length:2},()=>Array.from({length:192},()=>[...e.baseMatrixWords]).flat()),lightBuffers:Array.from({length:2},()=>[...e.baseLightBytes])});

test('actor presentation retains every original graphics-buffer write and emits ordered source parts',()=>{
 assert.equal(e.cases.length,96);
 for(const [i,c]of e.cases.entries()){
  const state=initial(),before=structuredClone(state),ops=effects(c.operations),q=prepare(state,ops,{worldScale:.05});
  assert.deepEqual(q.matrixBuffers.map(digest),c.matrixSHA256,'matrices '+i);assert.deepEqual(q.lightBuffers,c.lightBuffers,'lights '+i);
  assert.deepEqual(q.draws.map(d=>[d.actorIndex,d.resourceIndex,d.partOffset]),ops.filter(o=>o.kind==='presentationActorPartDraw').map(o=>[o.actorIndex,o.resourceIndex,o.partOffset]));
  assert.deepEqual(state,before);assert.ok(Object.isFrozen(q.draws));
 }
});

function packed(values){const words=Array(16).fill(0);values.forEach((v,i)=>{const fixed=Math.trunc(v*65536)|0,shift=i%2?0:16;words[i>>>1]=(words[i>>>1]|((fixed>>>16)<<shift))>>>0;words[8+(i>>>1)]=(words[8+(i>>>1)]|((fixed&65535)<<shift))>>>0;});return words;}
const identity=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
function setup(){
 const state={matrixBuffers:Array.from({length:2},()=>Array(192*16).fill(0)),lightBuffers:Array.from({length:2},()=>Array(96).fill(0))};
 state.matrixBuffers[0].splice(0,16,...packed([2,0,0,0,0,3,0,0,0,0,4,0,10,20,30,1]));
 state.matrixBuffers[0].splice(16,16,...packed([0,0,-1,0,0,1,0,0,1,0,0,0,1,2,3,1]));
 state.lightBuffers[0].splice(8,3,255,128,0);state.lightBuffers[0].splice(16,3,255,127,128);state.lightBuffers[0].splice(48,3,64,32,16);
 const ops=[{kind:'presentationLightCount',count:1},{kind:'presentationLightBind',slot:0,bufferIndex:0,viewIndex:0,lightIndex:0,byteOffset:8},{kind:'presentationLightBind',slot:1,bufferIndex:0,viewIndex:0,lightIndex:1,byteOffset:0},
  {kind:'presentationFogColor',rgba:[10,20,30,255]},{kind:'presentationFogFactors',packedWord:0x0080ffc0},{kind:'presentationActorMaterial',preset:'actor'},
  {kind:'presentationActorMatrixBind',bufferIndex:0,actorIndex:2,matrixIndex:0},{kind:'presentationActorPartBind',bufferIndex:0,actorIndex:2,matrixIndex:1,parentMatrixIndex:0}];
 const draw={kind:'presentationActorPartDraw',bufferIndex:0,actorIndex:2,resourceIndex:0,partOffset:8};
 return {state,ops,draw};
}
test('root, child and retained transforms compose before world scaling and popping restores the root',()=>{
 const {state,ops,draw}=setup(),translated=[...identity];translated[12]=5;
 const q=prepare(state,[...ops,draw,{kind:'presentationActorSurface',preset:'actor13-final'},
  {kind:'presentationActorRetainedMatrixMultiply',bufferIndex:0,actorIndex:2,matrixWords:packed(translated)},draw,
  {kind:'presentationActorMatrixPop',bufferIndex:0},draw],{worldScale:.05});
 const point=(m,p)=>[0,1,2].map(i=>m[i]*p[0]+m[i+4]*p[1]+m[i+8]*p[2]+m[i+12]);
 const near=(actual,expected)=>actual.forEach((v,i)=>assert.ok(Math.abs(v-expected[i])<1e-12));
 near(point(q.draws[0].matrixWorld,[1,2,3]),[.9,1.6,1.9]);near(point(q.draws[1].matrixWorld,[0,0,0]),[.6,1.3,1.1]);near(point(q.draws[2].matrixWorld,[0,0,0]),[.5,1,1.5]);
 assert.equal(q.draws[0].surface,null);assert.equal(q.draws[1].surface,'actor13-final');
 assert.deepEqual(q.draws[0].lighting,{ambient:[64/255,32/255,16/255],directional:[{color:[1,128/255,0],direction:[-1/127,1,-128/127]}]});
 assert.deepEqual(q.draws[0].fog,{color:[10,20,30,255],packedWord:0x0080ffc0,multiplier:128,offset:-64});
});
test('late stack, binding or write errors leave both retained buffers unchanged',()=>{
 const {state,ops,draw}=setup(),before=structuredClone(state),write={kind:'presentationActorMatrixWrite',bufferIndex:0,matrixIndex:1,byteOffset:0,width:2,value:65535};
 for(const tail of [[draw],[{kind:'presentationActorMatrixPop',bufferIndex:1}],[{...draw,actorIndex:3}],[{...write,byteOffset:63}],[{kind:'unhandled'}]])assert.throws(()=>prepare(state,[...ops,write,...tail],{worldScale:.05}));
 assert.deepEqual(state,before);
});

test('canonical actor update and rendering buffers prepare together across every original display case',()=>{
 for(const [i,c]of e.cases.entries()){
  const a=c.input,state=structuredClone(createNativeRaceMemory({racers:[{lap:0,grid:0,power:0,misses:0}],courseIndex:a.courseIndex,players:1,mode620:4}));
  state.actorWordsF060=[...e.baseActorWords];for(const [at,w]of a.actorOverrides)state.actorWordsF060[at]=w;
  state.actorControlWords62c4=[...a.actorControlWords62c4];state.hudWords7788=[...e.baseHudWords];state.courseDisplayWordsB058=[...e.baseDisplayWords];state.resourceWordsE73c=[...e.resourceWordsE73c];
  state.graphicsCorners.renderBufferIndex=a.bufferIndex;Object.assign(state.scene,{fieldAb2c:a.viewIndex,displayCamera3930:a.cameraIndex,activity624:a.activity624,championshipCountAa00:a.championshipCountAa00,actorDisplayPhase62c0:a.actorDisplayPhase62c0});
  state.aiWords3c60[(a.viewIndex*0xe8+0x78)/4]=a.aiLightActive78;
  const input={animationsByResourceIndex:Object.fromEntries(Array.from({length:8},(_,j)=>[j,e.animationsByIndex]))},buffers=initial(),before=structuredClone({state,buffers});
  const q=prepareNativeActorDisplayFrame(state,buffers,input,{worldScale:.05});
  assert.deepEqual(q.operations,c.operations,'ordered complete frame '+i);assert.equal(digest(q.state.actorWordsF060),c.actorSHA256,'canonical pool '+i);
  assert.deepEqual(q.presentation.matrixBuffers.map(digest),c.matrixSHA256,'retained renderer '+i);assert.deepEqual(q.presentation.lightBuffers,c.lightBuffers);
  assert.equal(q.presentation.draws.length,c.operations.filter(o=>o.kind==='presentationActorPartDraw').length);
  assert.throws(()=>prepareNativeActorDisplayFrame(state,{...buffers,lightBuffers:[[]]},input,{worldScale:.05}),/light buffers/);
  assert.deepEqual({state,buffers},before);
 }
});
