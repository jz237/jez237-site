import test from 'node:test';
import assert from 'node:assert/strict';
import {ControllerRumble,type RumbleMotion,type RumblePad} from '../src/controller-rumble';
import {defaultControls,readControls} from '../src/driving-controls';
const road:RumbleMotion={speed:20,slip:0,grounded:true,surface:'gravel',scraping:0};
function fixture(index=0){const effects:GamepadEffectParameters[]=[],resets:number[]=[];
 const pad:RumblePad={index,id:'Pad '+index,connected:true,axes:[],buttons:[],vibrationActuator:{playEffect(type,params){assert.equal(type,'dual-rumble');effects.push(params!);return Promise.resolve('complete');},reset(){resets.push(1);return Promise.resolve('complete');}}};
 return{pad,effects,resets,rumble:new ControllerRumble()};}
test('vibration strength migrates old saves, clamps hostile values and preserves off',()=>{
 const legacy={...defaultControls()}as any;delete legacy.rumble;assert.equal(readControls(JSON.stringify(legacy)).rumble,.65);
 for(const [value,expected]of [[0,0],[.3,.3],[-1,0],[2,1],['bad',.65],[null,.65]]as const)assert.equal(readControls(JSON.stringify({...legacy,rumble:value})).rumble,expected);
 assert.equal(readControls(JSON.stringify({...legacy,rumble:0})).rumble,0);
});
test('road and tyre feedback require rolling contact and stop in the air or at rest',()=>{
 const f=fixture(),r=f.rumble;r.update(f.pad,0,1,road);assert.equal(f.effects.length,1);
 r.update(f.pad,60,1,{...road,grounded:false});assert.equal(f.resets.length,1);
 r.update(f.pad,120,1,{...road,speed:0,slip:20});assert.equal(f.effects.length,1);
 r.update(f.pad,180,1,{...road,surface:'asphalt',slip:8});assert.ok(f.effects.at(-1)!.weakMagnitude!>.2);
 r.update(f.pad,240,1,{...road,surface:'asphalt',slip:0});assert.equal(f.resets.length,2);
});
test('strongest contact survives rough-road mixing, decays and respects command-rate limits',()=>{
 const f=fixture(),r=f.rumble;r.update(f.pad,0,.5,road);r.impact(.8);r.impact(.1);
 for(let t=1;t<=60;t++)r.update(f.pad,t,.5,road);
 assert.equal(f.effects.length,2);assert.ok(f.effects[1].strongMagnitude!>.25);
 for(let t=61;t<=500;t++)r.update(f.pad,t,.5,road);
 assert.ok(f.effects.length<=9);assert.ok(f.effects.at(-1)!.strongMagnitude!<.03);
 for(const effect of f.effects){assert.equal(effect.duration,100);assert.equal(effect.startDelay,0);for(const k of ['strongMagnitude','weakMagnitude']as const)assert.ok(effect[k]!>=0&&effect[k]!<=.5);}
});
test('off, inactive screens, disconnect and controller switches cancel the previous motor',()=>{
 for(const end of ['off','inactive','disconnect','switch']as const){const f=fixture(),other=fixture(1);f.rumble.update(f.pad,0,1,road);f.rumble.impact(1);
  f.rumble.update(end==='switch'?other.pad:end==='disconnect'?undefined:f.pad,70,end==='off'?0:1,end==='inactive'?null:road);
  assert.equal(f.resets.length,1,end);f.rumble.update(f.pad,140,1,{...road,speed:0});assert.equal(f.effects.length,1,'old impact must not leak after '+end);
 }
});
test('unsupported hardware and rejected effects cannot break driving or repeatedly retry',async()=>{
 const f=fixture();f.pad.vibrationActuator!.playEffect=()=>Promise.reject(Error('unsupported'));
 f.rumble.update(f.pad,0,1,road);await Promise.resolve();await Promise.resolve();
 for(let i=0;i<30;i++)f.rumble.update(f.pad,i*60+60,1,road);assert.equal(f.resets.length,1);
 f.rumble.update({...f.pad,vibrationActuator:undefined},3000,1,road);
 f.pad.vibrationActuator!.playEffect=()=>{throw Error('synchronous failure');};assert.doesNotThrow(()=>f.rumble.update(f.pad,3100,1,road));
 f.pad.vibrationActuator!.reset=()=>Promise.reject(Error('reset failed'));assert.doesNotThrow(()=>f.rumble.stop());await Promise.resolve();
});
test('late rejection from an old controller does not disable the replacement',async()=>{
 const first=fixture(),second=fixture(1);let reject!:(reason:Error)=>void;
 first.pad.vibrationActuator!.playEffect=()=>new Promise((_resolve,no)=>{reject=no;});
 first.rumble.update(first.pad,0,1,road);first.rumble.update(second.pad,60,1,road);reject(Error('old failure'));await Promise.resolve();await Promise.resolve();
 first.rumble.update(second.pad,120,1,road);assert.equal(second.effects.length,2);assert.equal(second.resets.length,0);
});
test('nonfinite samples and backward clocks never produce invalid motor commands',()=>{
 const f=fixture();f.rumble.update(f.pad,100,1,{...road,speed:NaN,slip:Infinity,scraping:NaN});assert.equal(f.effects.length,0);
 f.rumble.update(f.pad,200,1,road);f.rumble.impact(NaN);f.rumble.update(f.pad,10,1,road);assert.equal(f.resets.length,1);assert.equal(f.effects.length,2);
 f.rumble.update(f.pad,NaN,1,road);assert.equal(f.resets.length,2);
});

test('a later light scrape cannot refresh an old heavy impact at full strength',()=>{
 const f=fixture(),quiet={...road,speed:0};f.rumble.update(f.pad,0,1,quiet);f.rumble.impact(1);f.rumble.update(f.pad,1,1,quiet);
 f.rumble.impact(.1);f.rumble.update(f.pad,151,1,quiet);assert.ok(f.effects.at(-1)!.strongMagnitude!<.2);
});

test('signed pre-vibration save files still import, while new backups preserve vibration off',async()=>{
 const {createHash}=await import('node:crypto');const {SAVE_KEYS,readSave,exportSave,restoreSave}=await import('../src/save-backup');const {CONTROLS_KEY}=await import('../src/driving-controls');
 const legacy:any=defaultControls();delete legacy.rumble;legacy.keys.throttle=['KeyE'];
 const canonical=(v:unknown)=>JSON.stringify(v,(_key,x)=>x&&typeof x==='object'&&!Array.isArray(x)?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
 const entries=Object.fromEntries(SAVE_KEYS.map(k=>[k,k===CONTROLS_KEY?canonical(legacy):null]));
 const body={format:'quarry-impact-save',version:1,created:'2026-10-08T00:00:00.000Z',entries};
 const oldFile=JSON.stringify({...body,checksum:createHash('sha256').update(canonical(body)).digest('hex')});
 const old=await readSave(oldFile),data=new Map<string,string>(),store={getItem:(k:string)=>data.get(k)??null,setItem:(k:string,v:string)=>{data.set(k,v);},removeItem:(k:string)=>{data.delete(k);}};
 await restoreSave(store,old);assert.equal(readControls(store.getItem(CONTROLS_KEY)).rumble,.65);assert.deepEqual(readControls(store.getItem(CONTROLS_KEY)).keys.throttle,['KeyE']);
 store.setItem(CONTROLS_KEY,JSON.stringify({...readControls(store.getItem(CONTROLS_KEY)),rumble:0}));
 const current=await readSave(await exportSave(store));assert.equal(readControls(current.entries[CONTROLS_KEY]).rumble,0);
});
