import {prepareNativeRaceFadeSlotInitialization} from './native-race-fade-initialization.js';

// Original5470 updates five shared44-byte HUD slots, in ascending order.
// A slot freed/reallocated by6074 is visible to subsequent iterations.
const HUD=0x7788,BASE=0x8930,F=Math.fround,view=new DataView(new ArrayBuffer(4));
function integer(v,n,min=-2147483648,max=2147483647){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${n}`);return v;}
function words(v,n,count){if(!Array.isArray(v)||v.length!==count)throw new RangeError(`${n} requires ${count} words`);return Array.from(v,x=>integer(x,n,0,0xffffffff));}
function freeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
function bits(v){if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new RangeError('Nonfinite widget float');view.setFloat32(0,v);return view.getUint32(0);}
function float(v){view.setUint32(0,v);const n=view.getFloat32(0);if(!Number.isFinite(n))throw new RangeError('Nonfinite retained widget float');return n;}
function trunc(v){if(!Number.isFinite(v)||v<-2147483648||v>=2147483648)throw new RangeError('Undefined signed widget conversion');return Math.trunc(v)|0;}
// Source62A8 uses the compiler's unsigned conversion sequence, including -1
// on invalid conversion. A negative fractional value truncated to0 is valid.
function unsigned(v){const n=Math.trunc(v);return Number.isFinite(n)&&n>=0&&n<4294967296?n>>>0:0xffffffff;}
function context(input){
 if(!input||typeof input!=='object')throw new TypeError('Expected retained HUD input');
 const hud=words(input.hudWords7788,'hudWords7788',1442),operations=[];
 const half=a=>{const o=a-HUD;return (hud[o>>>2]>>>(o&2?0:16))&65535;};
 const word=a=>hud[(a-HUD)/4]|0;
 const apply=op=>{const o=op.byteOffset,i=o>>>2,shift=o&2?0:16;
  hud[i]=op.width===4?op.value:((hud[i]&~(65535<<shift))|(op.value<<shift))>>>0;operations.push(op);};
 const put=(a,width,value)=>apply({kind:'hudWrite',byteOffset:a-HUD,width,value:width===2?value&65535:value>>>0});
 const call=(consumer,args)=>operations.push({kind:'externalCall',consumer,arguments:args});
 return {hud,operations,half,word,put,call,apply};
}

/** Full numeric5470/6074/62A8/66F4/68EC updates. Matrix and sound calls
 * remain ordered effects. Null argument1 in48854/49A94 explicitly denotes
 * their caller-local temporary float matrix, not an invented RAM address.
 * frameBufferBase is the actual presentation owner; other dependencies are
 * required only on reached branches. No GPU memory or input is mutated. */
export function prepareNativeRaceWidgetUpdate(input){
 const c=context(input),{half,word,put,call}=c,activeSlots=[];
 const target=base=>{
  const frame=integer(input.frameBufferBase,'frameBufferBase',0,0xffffffff),address=frame+0x900+half(base+4)*64;
  if(frame%4||address>0xffffffff-63)throw new RangeError('Invalid widget matrix range/alignment');return address;
 };
 const matrix=(base,scale)=>call('80048a88',[target(base),0,0,bits(1),0,bits(1),0,bits(F(word(base+8))),bits(F(word(base+12))),0,bits(scale)]);
 const settled=base=>call('80048854',[target(base),null,0,0,bits(1),0,bits(1),0,bits(F(word(base+8))),bits(F(word(base+12))),0]);
 const allocate=selector=>{
  const p=prepareNativeRaceFadeSlotInitialization({hudWords7788:c.hud,slotTemplateWords6c50:input.slotTemplateWords6c50,type:2,selector});
  p.operations.forEach(c.apply);
 };
 for(let slot=0;slot<5;slot++){
  const b=BASE+slot*44,kind=half(b),stage=half(b+2);
  if(kind<1||kind>4)continue;
  activeSlots.push(slot);put(b+6,2,1);
  if(kind===1||kind===2){
   if(stage===0){
    const scale=F(F(F(word(b+24))/F(5))*F(1.5)),left=F(1-scale),alternate=kind===2&&word(b+40)!==0;
    const x=F(F(left*(kind===1?74:alternate?102:38))+(kind===1?80:alternate?58:120));
    const y=F(F(left*(alternate?15:20))+93),convert=kind===1?trunc:unsigned;
    put(b+8,4,convert(x));put(b+12,4,convert(y));matrix(b,scale);
    const next=(word(b+24)+1)|0;put(b+24,4,next);
    if(next>=6){put(b+2,2,1);put(b+8,4,kind===1?80:alternate?58:120);put(b+12,4,93);put(b+24,4,0);}
   }else if(stage===1){
    settled(b);const next=(word(b+24)+1)|0;put(b+24,4,next);
    if(kind===2){if(next>=31)put(b,2,0);}
    else{
     const mode=integer(input.mode608,'mode608');
     if(next>=11&&(mode===0||mode===4)){
      put(b,2,0);
      if(mode===4)allocate(0);
      else if(integer(input.recordPlace2650,'recordPlace2650')===1)allocate(1);
     }
    }
   }
  }else if(kind===3){
   if(stage!==0&&stage!==1)continue;
   if(stage===1&&integer(input.activity624,'activity624',-32768,32767)===-1){put(b,2,0);continue;}
   const phase=F(F(word(b+24))/F(40));
   if(stage===0){
    const base=integer(input.menuBase6bd0,'menuBase6bd0'),index=integer(input.menuIndex6ee4,'menuIndex6ee4');
    put(b+12,4,(base+Math.imul(index,20)+6)|0);
   }else put(b+12,4,(word(b+36)+Math.imul(input.activity624,15))|0);
   const coefficient=float(integer(input[stage===0?'rotationWord6c80':'rotationWord6c84'],'rotation word',0,0xffffffff));
   const angle=F(F(phase+phase)*coefficient);
   call('80049a94',[target(b),null,bits(angle),bits(angle),0,bits(F(word(b+8))),bits(F(word(b+12))),0]);
   const next=(word(b+24)+1)|0;put(b+24,4,next);if(next>=40)put(b+24,4,(next-40)|0);
   put(b+32,4,(word(b+32)+4)|0);
  }else if(stage===0){
   const counter=word(b+24),t=F(counter);put(b+24,4,(counter+1)|0);
   const y=(trunc(F(F(t*3)*t))-40)|0;put(b+12,4,y);
   if(y>=63){put(b+2,2,1);put(b+12,4,63);put(b+24,4,1);put(b+28,4,1);put(b+20,4,bits(16));call('800c30bc',[]);}
  }else if(stage===1){
   const counter=word(b+24),t=F(counter),velocity=float(word(b+20)>>>0);put(b+24,4,(counter+1)|0);
   const y=(63-trunc(F(velocity*t))+trunc(F(F(F(1.5)*t)*t)))|0;put(b+12,4,y);
   if(y>=64){
    put(b+12,4,63);const damping=float(integer(input.bounceWord6c88,'bounceWord6c88',0,0xffffffff));
    put(b+24,4,1);put(b+28,4,(word(b+28)+1)|0);put(b+20,4,bits(F(velocity*damping)));
    if(float(word(b+20)>>>0)<1.5){put(b+2,2,2);put(b+28,4,0);put(b+24,4,0);}
   }
  }
 }
 return freeze({operations:c.operations,diagnostic:{activeSlots}});
}

/** OriginalAFB4 four-frame HUD animation clock, after widget updates and
 * before the fade update. Its period/counter belong to the same HUD span. */
export function prepareNativeRaceHUDAnimationUpdate(input){
 const c=context(input),{half,word,put}=c;
 if(half(0x8a78)!==0){
  const next=(word(0x8a7c)+1)|0;put(0x8a7c,4,next);
  if(next>=word(0x8a80)){put(0x8a7c,4,0);put(0x8a7a,2,half(0x8a7a)+1);if(half(0x8a7a)===4)put(0x8a7a,2,0);}
 }
 return freeze({operations:c.operations});
}
