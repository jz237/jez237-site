import test,{type TestContext} from 'node:test';
import assert from 'node:assert/strict';
import {Sound} from '../src/audio';

class AudioNodeFixture {
  gain={value:0};
  threshold={value:0};
  knee={value:0};
  ratio={value:0};
  loop=false;
  buffer:unknown;
  starts=0;
  connect<T>(next:T):T{return next;}
  start(){this.starts++;}
}
class AudioContextFixture {
  state:'suspended'|'running'|'closed'='suspended';
  destination=new AudioNodeFixture();
  sources:AudioNodeFixture[]=[];
  resumeCalls=0;
  suspendCalls=0;
  decodeCalls=0;
  failDecode=false;
  mode:'pending'|'reject'|'allowed'='allowed';
  pending:(()=>void)[]=[];
  deferSuspend=false;
  pendingSuspends:(()=>void)[]=[];
  options:unknown;
  createGain(){return new AudioNodeFixture();}
  createDynamicsCompressor(){return new AudioNodeFixture();}
  createPanner(){return new AudioNodeFixture();}
  createBufferSource(){const source=new AudioNodeFixture();this.sources.push(source);return source;}
  async decodeAudioData(_data:ArrayBuffer){
    this.decodeCalls++;
    if(this.failDecode)throw new Error('Invalid clip');
    return {duration:8} as AudioBuffer;
  }
  resume(){
    this.resumeCalls++;
    if(this.mode==='reject')return Promise.reject(new Error('Activation unavailable'));
    if(this.mode==='pending')return new Promise<void>(resolve=>this.pending.push(()=>{this.state='running';resolve();}));
    this.state='running';return Promise.resolve();
  }
  suspend(){
    this.suspendCalls++;
    if(this.deferSuspend)return new Promise<void>(resolve=>this.pendingSuspends.push(()=>{this.state='suspended';resolve();}));
    this.state='suspended';return Promise.resolve();
  }
}
function fixture(t:TestContext,mode:AudioContextFixture['mode']='allowed'){
  const context=new AudioContextFixture();context.mode=mode;
  const previous=Object.getOwnPropertyDescriptor(globalThis,'AudioContext');
  Object.defineProperty(globalThis,'AudioContext',{configurable:true,value:class {
    constructor(options:unknown){context.options=options;return context;}
  }});
  t.after(()=>{if(previous)Object.defineProperty(globalThis,'AudioContext',previous);else Reflect.deleteProperty(globalThis,'AudioContext');});
  const sound=new Sound();
  const preload=t.mock.method(sound,'preload',async()=>[{id:'ambience',data:new ArrayBuffer(8)}]);
  return {context,sound,preload};
}
const turn=()=>new Promise<void>(resolve=>setImmediate(resolve));

test('controller-only startup decodes and becomes ready while browser resume remains pending',async t=>{
  const {sound,context}=fixture(t,'pending');
  const ready=await Promise.race([sound.init().then(()=>true),turn().then(()=>false)]);
  assert.equal(ready,true,'An activation-bound promise must not hold event preparation');
  assert.equal(sound.ready,true);assert.equal(context.state,'suspended');
  assert.equal(context.resumeCalls,1);assert.equal(context.pending.length,1);
  assert.equal(context.decodeCalls,1);assert.equal(context.sources[0].starts,1);
  context.mode='allowed';sound.unlock();await turn();
  assert.equal(context.resumeCalls,2);assert.equal(context.state,'running');
  assert.equal(context.decodeCalls,1,'A real gesture only retries activation, not the clip load');
});

test('rejected activation does not reject init or become unhandled and a later gesture can retry',async t=>{
  const {sound,context}=fixture(t,'reject');
  await sound.init();await turn();
  assert.equal(sound.ready,true);assert.equal(context.state,'suspended');
  sound.unlock();await turn();assert.equal(context.resumeCalls,2);
  context.mode='allowed';sound.unlock();await turn();
  assert.equal(context.resumeCalls,3);assert.equal(context.state,'running');
});

test('pause intent survives creation and trusted gestures until explicitly resumed',async t=>{
  const {sound,context}=fixture(t);
  await sound.pause(true);sound.unlock();await sound.init();sound.unlock();await turn();
  assert.equal(sound.ready,true);assert.equal(context.resumeCalls,0);assert.equal(context.state,'suspended');
  await sound.pause(false);await turn();
  assert.equal(context.resumeCalls,1);assert.equal(context.state,'running');
  await sound.pause(true);sound.unlock();await turn();
  assert.equal(context.resumeCalls,1);assert.equal(context.state,'suspended');
});

test('late activation cannot override a newer Pause and a pending unpause stays nonblocking',async t=>{
  const {sound,context}=fixture(t,'pending');
  await sound.init();await sound.pause(true);
  context.pending.shift()!();await turn();
  assert.equal(context.state,'suspended');assert.equal(context.suspendCalls,2);
  sound.unlock();assert.equal(context.resumeCalls,1);
  const returned=await Promise.race([sound.pause(false).then(()=>true),turn().then(()=>false)]);
  assert.equal(returned,true);assert.equal(context.resumeCalls,2);
  context.pending.shift()!();await turn();assert.equal(context.state,'running');
});

test('ordinary allowed init preserves buses, clip decoding and the single ambient loop',async t=>{
  const {sound,context,preload}=fixture(t);
  await sound.init();await sound.init();
  assert.deepEqual(context.options,{latencyHint:'interactive'});
  assert.equal(context.resumeCalls,1);assert.equal(context.decodeCalls,1);assert.equal(preload.mock.callCount(),1);
  assert.equal(context.sources.length,1);assert.equal(context.sources[0].loop,true);
  assert.equal(sound.master!.gain.value,.75);assert.equal(sound.engineBus!.gain.value,.72);
  assert.equal(sound.fxBus!.gain.value,.8);assert.equal(sound.ambientBus!.gain.value,.45);
  assert.equal(sound.ambient!.gain.gain.value,.45);
});

test('a quick Resume wins over a suspension that finishes after the resume gesture',async t=>{
  const {sound,context}=fixture(t);await sound.init();context.deferSuspend=true;
  const pausing=sound.pause(true);await sound.pause(false);
  assert.equal(context.state,'running');assert.equal(context.resumeCalls,1);
  context.pendingSuspends.shift()!();await pausing;await turn();
  assert.equal(context.state,'running');assert.equal(context.resumeCalls,2);
});

test('actual asset decode failures still reject initialization and remain retryable',async t=>{
  const {sound,context,preload}=fixture(t);context.failDecode=true;
  await assert.rejects(sound.init(),/Invalid clip/);assert.equal(sound.ready,false);
  context.failDecode=false;await sound.init();
  assert.equal(sound.ready,true);assert.equal(context.decodeCalls,2);assert.equal(preload.mock.callCount(),2);
  assert.equal(context.sources.length,1);
});
