import {NATIVE_PRESENTATION_ACTOR_WORDS} from './native-presentation-actor-pool.js';
const F=Math.fround,bits=new DataView(new ArrayBuffer(4));
const freeze=v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
function integer(v,name,min,max){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ice actor audio ${name}`);return v;}
function number(w){integer(w,'float word',0,0xffffffff);bits.setUint32(0,w);const v=bits.getFloat32(0);if(!Number.isFinite(v))throw new RangeError('Nonfinite ice actor audio input');return v;}
function scalar(v){if(typeof v!=='number'||!Number.isFinite(F(v)))throw new RangeError('Supply finite ice actor distance');return F(v);}
/** Complete A5C74 nearest-actor pass and C1DA8/C1DEC/C1B98/C1E0C controls.
 * Source stop requests are ordered effects, including the deliberate second
 * stop when the distance pass has already cleared the shared scene latch. */
export function prepareNativeIceActorAudio(input={}){
 let audioScene7c9c=integer(input.audioScene7c9c,'scene latch',-2147483648,2147483647);
 const operations=[],emit=(consumer,port,value)=>operations.push({kind:'externalCall',consumer,arguments:[port,value>>>0]});
 const latch=value=>{audioScene7c9c=value;operations.push({kind:'sourceWordWrite',field:'audioScene7c9c',value});};
 const stop=()=>{latch(0);emit('800c53d4',0x06000700,0xffffffff);emit('800c53d4',0x06000704,0xffffffff);};
 function distance(value){
  if(audioScene7c9c===0){stop();return;}
  const d=scalar(value),volume=d>=50?0:d<=2?1:F(F(50-d)/48);
  bits.setFloat32(0,volume);emit('800c538c',0x01000700,bits.getUint32(0));latch(5);
 }
 if(input.entry==='800c1da8'){
  if(integer(input.audioMode,'mode',0,255)===7){latch(5);emit('800c53d4',0x06000700,18);}
 }else if(input.entry==='800c1dec'||input.entry==='800c1b98')stop();
 else if(input.entry==='800c1e0c')distance(input.distanceNative);
 else if(input.entry==='800a5c74'){
  const pool=input.actorWordsF060,hud=input.hudWords7788,camera=integer(input.cameraIndex,'camera selector',0,1);
  if(!Array.isArray(pool)||pool.length!==NATIVE_PRESENTATION_ACTOR_WORDS)throw new RangeError('Supply complete ice actor pool');
  let nearest=1600000;
  for(let slot=0;slot<30;slot++){
   const base=slot*47,type=integer(pool[base],'actor type word',0,0xffffffff);
   if(type!==1)continue;
   if(!Array.isArray(hud)||hud.length!==1442)throw new RangeError('Supply actual ice actor camera words');
   const at=(0x7c80+camera*0x10c-0x7788)/4;
   const dx=F(number(hud[at+0x4c/4])-number(pool[base+0xc/4])),dz=F(number(hud[at+0x54/4])-number(pool[base+0x14/4]));
   const d=F(Math.sqrt(F(F(dx*dx)+F(dz*dz))));if(d<nearest)nearest=d;
  }
  const d=F(nearest/40);if(d>50)stop();distance(d);
 }else throw new RangeError('Unknown ice actor audio entry');
 return freeze({audioScene7c9c,operations});
}
