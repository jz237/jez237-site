import {NATIVE_PRESENTATION_EFFECT_WORDS} from './native-presentation-effects.js';
const F=Math.fround,b=new DataView(new ArrayBuffer(4));
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
function integer(v,name,min,max){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${name}`);return v;}
function words(v,n,name){if(!Array.isArray(v)||v.length!==n)throw new RangeError(`Supply ${name}[${n}]`);return v.map(w=>integer(w,name,0,0xffffffff));}
function finite(v){if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new RangeError('Nonfinite spray particle motion');return F(v);}
const number=w=>{b.setUint32(0,w);return finite(b.getFloat32(0));},bits=v=>{b.setFloat32(0,finite(v));return b.getUint32(0);};

/** B08F8's retained-particle motion phase B0F10..B1390, before new emission.
 * Caller owns the preceding visibility/wet-state setup and following emission,
 * audio levels and wake insertion. This is not a complete scene-frame update.
 * Uses actual retained pointers; inactive records keep their numeric storage.
 */
export function prepareNativeSprayParticleMotion(input){
 const effectWords0790=words(input?.effectWords0790,NATIVE_PRESENTATION_EFFECT_WORDS,'effectWords0790'),
  effectControlWords6d60=words(input.effectControlWords6d60,22,'effectControlWords6d60'),operations=[];
 const slot=integer(input.racerIndex,'effect racer',0,3),primary=integer(input.primaryHumanIndex,'primary human',0,3);
 const index=a=>integer((a-0x790)/4,'effect storage offset',0,NATIVE_PRESENTATION_EFFECT_WORDS-1),read=a=>effectWords0790[index(a)],f=a=>number(read(a));
 const pointer=a=>{const v=effectControlWords6d60[(a-0x6d60)/4];index(v-0x801d0000);return v-0x801d0000;};
 const put=(a,v)=>{const value=v>>>0;effectWords0790[index(a)]=value;operations.push({kind:'presentationEffectWrite',byteOffset:a-0x790,width:4,value});};
 const sf=(a,v)=>put(a,bits(v));
 const control=(a,v)=>{const value=v>>>0;effectControlWords6d60[(a-0x6d60)/4]=value;operations.push({kind:'presentationEffectControlWrite',byteOffset:a-0x6d60,width:4,value});};
 const entry=pointer(0x6d60);
 control(0x6d64,0x801d0000+pointer(0x6d68)+0xfc0);
 for(let i=63;i>=0;i--){
  const row=pointer(0x6d64);
  if(read(row+0x38)!==0){
   const alpha=Math.max(0,(255-Math.imul(read(row+0x3c),24))|0);put(row+0x3c,read(row+0x3c)+1);
   sf(row+0x30,F(f(row+0x30)+f(row+0x34)));if(f(row+0x30)>128)sf(row+0x30,128);
   sf(row+0x20,F(f(row+0x20)+f(row+0x2c)));
   sf(row,F(F(F(f(row+0x18)*f(0x79ec))+f(0x79bc))+F(f(row+0x20)*f(0x79e0))));
   sf(row+8,F(F(F(f(row+0x18)*f(0x79f4))+f(0x79c4))+F(f(row+0x20)*f(0x79e8))));
   sf(row+12,F(F(f(row+0x24)*f(0x79ec))+F(F(f(row+0x2c)*.5)*f(0x79e0))));
   sf(row+20,F(F(f(row+0x24)*f(0x79f4))+F(F(f(row+0x2c)*.5)*f(0x79e8))));
   if(read(entry+0x1c54)!==0){sf(row+4,F(F(f(0x79c0)+4)-f(row+0x34)));sf(row+16,F(f(row+16)-.5));}
   else sf(row+16,F(f(row+16)-1));
   if(f(row+4)<F(f(0x7a00)-16)&&f(row+16)<0||f(row+16)<=0||alpha===0)put(row+0x38,0);
  }
  control(0x6d64,0x801d0000+row-64);
 }
 if(slot===primary){
  control(0x6d6c,0x801d0000+pointer(0x6d70)+0x9d8);
  for(let i=63;i>=0;i--){
   const row=pointer(0x6d6c);
   if(read(row+0x20)!==0){
    put(row+0x24,read(row+0x24)+1);sf(row,F(f(row)+F(f(row+12)+f(0x79f8))));sf(row+4,F(f(row+4)+f(row+16)));
    if(f(row+4)<f(0x7a00))put(row+0x20,0);
    sf(row+8,F(f(row+8)+F(f(row+20)+f(0x79fc))));sf(row+16,F(f(row+16)-1));
   }
   control(0x6d6c,0x801d0000+row-40);
  }
 }
 control(0x6d74,0x801d0000+pointer(0x6d78)+0x78);
 for(let i=3;i>=0;i--){
  const row=pointer(0x6d74);
  if(read(row+0x20)!==0){
   sf(row,F(f(row)+F(f(row+12)+f(0x79f8))));sf(row+4,F(f(row+4)+f(row+16)));sf(row+8,F(f(row+8)+F(f(row+20)+f(0x79fc))));
   put(row+0x24,read(row+0x24)+1);if((read(row+0x24)|0)>=8)put(row+0x20,0);
  }
  control(0x6d74,0x801d0000+row-40);
 }
 for(let i=7;i>=0;i--){
  const selected=((read(entry+0x1c38)|0)+i)|0,row=pointer(0x6d80)+(selected%8)*48;
  control(0x6d7c,0x801d0000+row);put(row+0x28,read(row+0x28)+1);
  for(const [to,velocity]of [[0,0x18],[8,0x20],[12,0x18],[20,0x20]])sf(row+to,F(f(row+to)+f(row+velocity)));
 }
 return freeze({effectWords0790,effectControlWords6d60,operations,diagnostic:{phase:'retained-particle-motion',emissionExecuted:false,graphicsExecuted:false}});
}
