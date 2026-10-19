import {NATIVE_PRESENTATION_EFFECT_WORDS} from './native-presentation-effects.js';
const F=Math.fround,b=new DataView(new ArrayBuffer(4));
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
function integer(v,name,min,max){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${name}`);return v;}
function words(v,n,name){if(!Array.isArray(v)||v.length!==n)throw new RangeError(`Supply ${name}[${n}]`);return v.map(w=>integer(w,name,0,0xffffffff));}
function finite(v){if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new RangeError('Nonfinite effect geometry');return F(v);}
const number=w=>{b.setUint32(0,w);return finite(b.getFloat32(0));};
function normalized(v){const length=F(Math.sqrt(F(F(F(v[0]*v[0])+F(v[1]*v[1]))+F(v[2]*v[2]))));return length>0?v.map(x=>finite(F(x/length))):v;}
function cross(a,b){return normalized([F(F(a[1]*b[2])-F(a[2]*b[1])),F(F(a[2]*b[0])-F(a[0]*b[2])),F(F(a[0]*b[1])-F(a[1]*b[0]))]);}

/** Complete AFBD0, including normalized-cross and square-root callees.
 * Uses the retained pointers installed by B2ABC and camera records in HUD
 * storage. Vertex writes target the selected original buffer; consuming them
 * in the high-resolution renderer remains a separate operation.
 */
export function prepareNativeEffectGeometry(input){
 const effectWords0790=words(input?.effectWords0790,NATIVE_PRESENTATION_EFFECT_WORDS,'effectWords0790'),
  effectControlWords6d60=words(input.effectControlWords6d60,22,'effectControlWords6d60'),operations=[];
 const slot=integer(input.racerIndex,'effect racer',0,3),players=integer(input.players,'players',1,2),
  racerCount=integer(input.racerCount,'physical racer count',1,4),primary=integer(input.primaryHumanIndex,'primary human',0,3),bufferIndex=integer(input.bufferIndex,'effect graphics buffer',0,1);
 const index=a=>integer((a-0x790)/4,'effect storage offset',0,NATIVE_PRESENTATION_EFFECT_WORDS-1),read=a=>effectWords0790[index(a)],f=a=>number(read(a)),vector=a=>[f(a),f(a+4),f(a+8)];
 const pointer=a=>{const v=effectControlWords6d60[(a-0x6d60)/4];index(v-0x801d0000);return v-0x801d0000;};
 const put=(a,v)=>{const value=v>>>0;effectWords0790[index(a)]=value;operations.push({kind:'presentationEffectWrite',byteOffset:a-0x790,width:4,value});};
 const control=(a,v)=>{const value=v>>>0;effectControlWords6d60[(a-0x6d60)/4]=value;operations.push({kind:'presentationEffectControlWrite',byteOffset:a-0x6d60,width:4,value});};
 const vertex=(byteOffset,width,value)=>{integer(byteOffset,'effect vertex offset',0,0xb2f0-width);operations.push({kind:'presentationEffectVertexWrite',bufferIndex,byteOffset,width,value:value&(width===1?255:65535)});};
 const coordinate=(offset,value)=>vertex(offset,2,integer(Math.trunc(finite(value)),'effect vertex coordinate',-2147483648,2147483647));
 function point(offset,v,alpha){coordinate(offset,v[0]);coordinate(offset+2,v[1]);if(alpha!==undefined)vertex(offset+15,1,alpha);coordinate(offset+4,v[2]);}
 let hud;
 function camera(address){
  const p=read(address),view=integer((p-0x80227c80)/0x10c,'effect camera pointer',0,1);
  hud??=words(input.hudWords7788,1442,'hudWords7788');return [0x4c,0x50,0x54].map(o=>number(hud[(0x7c80+view*0x10c+o-0x7788)/4]));
 }
 const entry=pointer(0x6d60),extra=read(0x7a08)!==0&&slot===racerCount;
 put(entry+0x1c20,0);
 for(let view=0;view<players;view++){
  let out=(view===0?0x51c0:0x69c0)+slot*0xc00;
  control(0x6d64,0x801d0000+pointer(0x6d68)+0xfc0);
  for(let i=63;i>=0;i--){
   const row=pointer(0x6d64);
   if(read(row+0x38)!==0){
    const alpha=Math.max(0,(255-Math.imul(read(row+0x3c),24))|0),position=vector(row),direction=normalized(vector(row+12));
    let scale=f(row+0x30);if(view===0&&extra)scale=F(scale+scale);
    if(view===1)vertex(out+15,1,alpha);
    const tipScale=F(scale*F(1.2));point(out,position.map((v,j)=>F(v+F(tipScale*direction[j]))),alpha);
    const eye=camera(view===0?0x796c:0x7970),side=cross(position.map((v,j)=>F(v-eye[j])),direction),half=F(scale*.5),delta=side.map(v=>F(half*v));
    point(out+16,position.map((v,j)=>F(delta[j]+v)),alpha);point(out+32,position.map((v,j)=>F(v-delta[j])),alpha);out+=48;
    if(view===0)put(entry+0x1c20,read(entry+0x1c20)+1);
   }
   control(0x6d64,0x801d0000+row-64);
  }
 }
 put(entry+0x1c24,0);
 if(slot===primary){
  let out=0x81c0;control(0x6d6c,0x801d0000+pointer(0x6d70)+0x9d8);
  for(let i=63;i>=0;i--){
   const row=pointer(0x6d6c);
   if(read(row+0x20)!==0){
    const position=vector(row),scale=f(row+0x18),alpha=Math.max(0,(255-(read(row+0x24)<<5))|0);
    point(out,position,alpha);
    for(let j=0;j<2;j++){const axis=vector(0x7980+j*12);point(out+16+j*16,position.map((v,k)=>F(F(axis[k]*scale)+v)),alpha);}
    out+=48;put(entry+0x1c24,read(entry+0x1c24)+1);
   }
   control(0x6d6c,0x801d0000+row-40);
  }
 }
 for(let view=0;view<players;view++){
  let out=(view===0?0x8dc0:0x8fc0)+slot*256;control(0x6d74,0x801d0000+pointer(0x6d78));
  for(let i=0;i<4;i++){
   const row=pointer(0x6d74);
   if(read(row+0x20)!==0){
    let scale=f(row+0x18);if(view===0&&extra)scale=F(scale+scale);
    const axis=vector(view===0?0x7980:0x79a4),other=vector(view===0?0x798c:0x79b0),sum=axis.map((v,j)=>F(v+other[j])),half=F(scale/2),
     start=vector(row).map((v,j)=>F(v-F(half*sum[j])));
    point(out,start);point(out+16,start.map((v,j)=>F(F(scale*axis[j])+v)));
    point(out+32,start.map((v,j)=>F(F(sum[j]*scale)+v)));point(out+48,start.map((v,j)=>F(F(scale*other[j])+v)));out+=64;
   }
   control(0x6d74,0x801d0000+row+40);
  }
 }
 let out=0x91c0+slot*256;
 for(let i=7;i>=0;i--){
  const selected=((read(entry+0x1c38)|0)+i)|0,row=pointer(0x6d80)+(selected%8)*48;
  control(0x6d7c,0x801d0000+row);point(out,vector(row),255);point(out+16,vector(row+12),255);out+=32;
  put(row+0x28,read(row+0x28)+1);
 }
 return freeze({effectWords0790,effectControlWords6d60,operations,diagnostic:{triangles:read(entry+0x1c20),sharedTriangles:read(entry+0x1c24),graphicsExecuted:false}});
}
