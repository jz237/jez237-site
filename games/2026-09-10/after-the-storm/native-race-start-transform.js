// Reconstructed start-matrix arithmetic. These are transient native-coordinate
// values; existing hull points/frame remain the physical owners. No original
// matrix, rest geometry, animation or pose initialization is embedded here.
const F=Math.fround,MIN=-2147483648,LIMIT=2147483648;
const bitsView=new DataView(new ArrayBuffer(4));
function record(v,n){if(!v||typeof v!=='object'||Array.isArray(v))throw new TypeError(`Expected ${n}`);return v;}
function finite(v,n){if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new RangeError(`${n} requires finite float32 arithmetic`);return F(v);}
function vector(v,n){record(v,n);return {x:finite(v.x,n+'.x'),y:finite(v.y,n+'.y'),z:finite(v.z,n+'.z')};}
function freeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
function bits(v){bitsView.setFloat32(0,v,false);return bitsView.getUint32(0,false);}
function float(v){bitsView.setUint32(0,v,false);return bitsView.getFloat32(0,false);}
const mul=(a,b)=>finite(F(a*b),'source product'),sub=(a,b)=>finite(F(a-b),'source difference');
const add=(a,b)=>finite(F(a+b),'source sum');
const squared=v=>add(add(mul(v.x,v.x),mul(v.y,v.y)),mul(v.z,v.z));
function cross(a,b){return {x:sub(mul(a.y,b.z),mul(a.z,b.y)),y:sub(mul(a.z,b.x),mul(a.x,b.z)),z:sub(mul(a.x,b.y),mul(a.y,b.x))};}
function unit(v,lengthSquared){
 const reciprocal=finite(F(1/finite(F(Math.sqrt(lengthSquared)),'source sqrt')),'source reciprocal');
 return {x:mul(reciprocal,v.x),y:mul(reciprocal,v.y),z:mul(reciprocal,v.z)};
}
function rawWords(v){
 if(!Array.isArray(v)||v.length!==16)throw new RangeError('matrixWords requires16 unsigned words');
 return Array.from(v,x=>{if(!Number.isInteger(x)||x<0||x>0xffffffff)throw new RangeError('Invalid matrix word');return x;});
}

/** Complete numeric48854 with its47EE0 packer. Arguments are the actual native
 * position/forward/up call values, without an invented unit-vector input policy.
 * Source rows0/4/8/12 are right/up/forward/translation. Its second cross uses
 * the ORIGINAL forward and raw up-cross-forward, not the normalized axes.
 * Every multiply/add/subtract, sqrt result and reciprocal rounds to binary32.
 *
 * Returns source-ordered scratchFloatWrite word-bit patches and32 descending
 * matrixHalfwordWrite patches (integer half then fraction half per element).
 * A zero forward writes nothing; zero first/second cross length leaves only
 * the reached3/6 scratch words. Incomplete output arrays are null, preserving
 * the caller's actual untouched destination instead of inventing a matrix.
 * Unreached up/position inputs are not required. No incoming destination read.
 *
 * Complete floatWords/matrixWords are detached temporary results. The latter
 * is what62E50 consumes through decodeNativeRaceStartTransform; the pre-pack
 * frame must not be substituted for that quantized physical input. Translation
 * stays in native units; no world scale, velocity, actor or rest pose is set.
 * Unsupported nonfinite/FCSR or signed32 packing conversions reject atomically.
 */
export function prepareNativeRaceStartTransform(value){
 record(value,'start-transform inputs');const forward=vector(value.forwardNative,'forwardNative'),operations=[],scratch=Array(16);
 const write=(wordIndex,v)=>{const value=bits(v);scratch[wordIndex]=value;operations.push({kind:'scratchFloatWrite',wordIndex,value});};
 const axis=(index,v)=>{write(index,v.x);write(index+1,v.y);write(index+2,v.z);};
 function incomplete(stage){return freeze({complete:false,floatWords:null,matrixWords:null,operations,diagnostic:{stage}});}
 let length=squared(forward);if(length===0)return incomplete('zero-forward');
 axis(8,unit(forward,length));
 const up=vector(value.upNative,'upNative'),rightRaw=cross(up,forward);
 length=squared(rightRaw);if(length===0)return incomplete('zero-right');
 axis(0,unit(rightRaw,length));
 const upRaw=cross(forward,rightRaw);length=squared(upRaw);if(length===0)return incomplete('zero-up');
 axis(4,unit(upRaw,length));
 const position=vector(value.positionNative,'positionNative');write(12,position.x);write(13,position.y);
 write(3,0);write(7,0);write(11,0);write(15,1);write(14,position.z);
 const packed=new DataView(new ArrayBuffer(64));
 for(let i=15;i>=0;i--){
  const scaled=finite(F(float(scratch[i])*65536),'source fixed-point product');
  if(scaled<MIN||scaled>=LIMIT)throw new RangeError('Unsupported signed32 matrix conversion/FCSR domain');
  const fixed=Math.trunc(scaled)|0,high=(fixed>>>16)&65535,low=fixed&65535;
  packed.setUint16(i*2,high,false);operations.push({kind:'matrixHalfwordWrite',byteOffset:i*2,width:2,value:high});
  packed.setUint16(32+i*2,low,false);operations.push({kind:'matrixHalfwordWrite',byteOffset:32+i*2,width:2,value:low});
 }
 return freeze({complete:true,floatWords:scratch,matrixWords:Array.from({length:16},(_,i)=>packed.getUint32(i*4,false)),
  operations,diagnostic:{stage:'complete'}});
}

/** Actual47E78: join signed integer/unsigned fraction halves, cvt.s.w, then
 * binary32 divide65536. The intermediate signed integer conversion matters:
 * fixed0x7fffffff becomes native32768 after rounding. No axis normalization,
 * affine-matrix requirement, world scale or destination state is invented.
 *
 * floatWords retain all16 decoded elements; frameNative and positionNative
 * are temporary row views compatible with existing hull.frame axis names.
 * Operations preserve descending element stores. Do not persist parallel
 * packed/decoded matrices as additional physical state owners.
 */
export function decodeNativeRaceStartTransform(value){
 record(value,'packed start transform');const packed=rawWords(value.matrixWords),decoded=Array(16),operations=[];
 const half=index=>(packed[index>>>1]>>>(index&1?0:16))&65535;
 for(let i=15;i>=0;i--){
  const joined=((half(i)<<16)|half(i+16))|0,v=F(F(joined)/65536),word=bits(v);
  decoded[i]=word;operations.push({kind:'scratchFloatWrite',wordIndex:i,value:word});
 }
 const row=index=>({x:float(decoded[index]),y:float(decoded[index+1]),z:float(decoded[index+2])});
 return freeze({floatWords:decoded,frameNative:{right:row(0),up:row(4),forward:row(8)},positionNative:row(12),operations});
}
