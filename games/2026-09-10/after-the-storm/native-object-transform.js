import {prepareNativePackedMatrix} from './native-widget-transform.js';

// Object/collision transforms from EE6F4, EDD90, EDC60 and EDD04. Values stay
// in native coordinates; returned matrices are temporary initialization or
// presentation values, not another owner of a live object's position/angles.
const F=Math.fround,view=new DataView(new ArrayBuffer(4));
function scalar(v,n){if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new RangeError(`Invalid ${n}`);return F(v);}
function vector(v,n){if(!v||typeof v!=='object')throw new TypeError(`Supply ${n}`);return Object.fromEntries(['x','y','z'].map(k=>[k,scalar(v[k],`${n}.${k}`)]));}
function word(v){view.setFloat32(0,scalar(v,'transform result'));return view.getUint32(0);}
function float(v){if(!Number.isInteger(v)||v<0||v>0xffffffff)throw new RangeError('Invalid transform word');view.setUint32(0,v);return scalar(view.getFloat32(0),'transform float');}
function freeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
const mul=(a,b)=>scalar(F(a*b),'transform product'),add=(a,b)=>scalar(F(a+b),'transform sum'),sub=(a,b)=>scalar(F(a-b),'transform difference');

/** Complete numeric EE6F4 followed by EDD90. Each degree angle is divided by
 * 360, multiplied by4096, truncated and masked; there is no half-step rounding.
 * The source's intermediate multiplication order differs from the HUD Euler
 * helper. EDD90 has the same descending halfword packing as47EE0, verified
 * independently against its original unrolled instructions.
 *
 * The readonly sine words must come from the actual initialized source table.
 * Callers retain their own object/matrix owners and apply the returned writes.
 * Unsupported nonfinite or signed32 conversion inputs reject atomically.
 */
export function prepareNativeObjectTransform(input){
 const prepared=prepareNativeObjectFloatTransform(input),packed=prepareNativePackedMatrix({floatWords:prepared.floatWords});
 return freeze({...prepared,matrixWords:packed.matrixWords,operations:[...prepared.operations,...packed.operations]});
}

/** EE6F4 alone. The post-motion6E0F4 caller writes float matrices without
 * invoking EDD90 or touching the separate packed-matrix array. */
export function prepareNativeObjectFloatTransform(input){
 const angles=vector(input?.anglesDegrees,'anglesDegrees'),position=vector(input.positionNative,'positionNative'),table=input.sineTableWords4350;
 if(!Array.isArray(table)||table.length!==4096)throw new RangeError('Supply sineTableWords4350[4096]');
 const indices=[],floatWords=Array(16),operations=[];
 const write=(wordIndex,value)=>{floatWords[wordIndex]=word(value);operations.push({kind:'scratchFloatWrite',wordIndex,value:floatWords[wordIndex]});};
 const axis=k=>{
  const phase=mul(scalar(F(angles[k]/360),'angle division'),4096);
  if(phase< -2147483648||phase>=2147483648)throw new RangeError('Unsupported source angle conversion');
  const i=Math.trunc(phase)&4095;indices.push(i);return [float(table[i]),float(table[(i+1024)&4095])];
 };
 const [sx,cx]=axis('x'),[sy,cy]=axis('y'),[sz,cz]=axis('z');
 const sxSy=mul(sx,sy),sxCy=mul(sx,cy);
 write(0,add(mul(sxSy,sz),mul(cy,cz)));
 write(4,sub(mul(sxSy,cz),mul(cy,sz)));
 write(8,mul(cx,sy));write(1,mul(cx,sz));write(9,F(-sx));write(5,mul(cx,cz));
 write(12,position.x);write(13,position.y);
 write(2,sub(mul(sxCy,sz),mul(sy,cz)));
 write(10,mul(cx,cy));write(6,add(mul(sxCy,cz),mul(sy,sz)));
 write(3,0);write(7,0);write(11,0);write(15,1);write(14,position.z);
 return freeze({floatWords,operations,diagnostic:{sineIndices:indices}});
}

/** EDC60 transforms a collision-plane origin; EDD04 transforms each direction
 * without translation. Preserve the source addition order and float32 stores.
 * Output pointers in the actual object initializer are disjoint from its
 * input matrix. This value API deliberately does not emulate pointer aliasing.
 */
export function prepareNativeObjectVectorTransform(input){
 const words=input?.floatWords;
 if(!Array.isArray(words)||words.length!==16)throw new RangeError('Supply floatWords[16]');
 if(typeof input.directionOnly!=='boolean')throw new TypeError('Supply directionOnly');
 const matrix=words.map(float),p=vector(input.vectorNative,'vectorNative'),out={};
 for(const [j,k]of ['x','y','z'].entries()){
  const xy=add(mul(matrix[j],p.x),mul(matrix[4+j],p.y)),z=mul(matrix[8+j],p.z);
  out[k]=input.directionOnly?add(z,xy):add(matrix[12+j],add(xy,z));
 }
 return freeze({vectorNative:out,words:['x','y','z'].map(k=>word(out[k]))});
}
