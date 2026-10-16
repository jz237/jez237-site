// Original48A88 scaled basis and49A94 Euler matrix consumers. Outputs remain
// transient presentation data and never replace hull/controller state.
const F=Math.fround,MIN=-2147483648,LIMIT=2147483648,d=new DataView(new ArrayBuffer(4));
function finite(v,n){if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new RangeError(`Invalid ${n}`);return F(v);}
function vector(v,n){if(!v||typeof v!=='object')throw new TypeError(`Expected ${n}`);return {x:finite(v.x,n),y:finite(v.y,n),z:finite(v.z,n)};}
function bits(v){d.setFloat32(0,v);return d.getUint32(0);}
function float(v){if(!Number.isInteger(v)||v<0||v>0xffffffff)throw new RangeError('Invalid matrix input word');d.setUint32(0,v);return finite(d.getFloat32(0),'retained matrix float');}
function freeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
const mul=(a,b)=>finite(F(a*b),'matrix product'),add=(a,b)=>finite(F(a+b),'matrix sum'),sub=(a,b)=>finite(F(a-b),'matrix difference');
const squared=v=>add(add(mul(v.x,v.x),mul(v.y,v.y)),mul(v.z,v.z));
const cross=(a,b)=>({x:sub(mul(a.y,b.z),mul(a.z,b.y)),y:sub(mul(a.z,b.x),mul(a.x,b.z)),z:sub(mul(a.x,b.y),mul(a.y,b.x))});
function fixed(v){v=finite(v,'matrix conversion');if(v<MIN||v>=LIMIT)throw new RangeError('Unsupported signed32 matrix conversion');return Math.trunc(v)|0;}

/** Source48A88 packs directly in source word-store order. Its scale is
 * multiplied by65536 BEFORE division by each original-axis length. Reusing
 * a normalized float matrix and scaling it later changes the quantized bits.
 * Early zero axes preserve all unvisited destination words: matrixWords is
 * null and operations contain only the reached partial writes. */
export function prepareNativeScaledBasisMatrix(input){
 const forward=vector(input?.forwardNative,'forwardNative'),operations=[],packed=Array(16);
 const write=(index,value)=>{packed[index]=value>>>0;operations.push({kind:'matrixWordWrite',wordIndex:index,value:value>>>0});};
 const incomplete=stage=>freeze({complete:false,matrixWords:null,operations,diagnostic:{stage}});
 const encode=(v,length,factor)=>{
  const ratio=finite(F(factor/F(Math.sqrt(length))),'matrix axis ratio');
  return ['x','y','z'].map(k=>fixed(mul(v[k],ratio)));
 };
 const pair=(x,y)=>((x&0xffff0000)|(y>>>16))>>>0,frac=(x,y)=>((x<<16)|(y&65535))>>>0;
 let length=squared(forward);if(length===0)return incomplete('zero-forward');
 const factor=mul(finite(input.scale,'matrix scale'),65536),[fx,fy,fz]=encode(forward,length,factor);
 write(4,pair(fx,fy));write(5,fz&0xffff0000);write(12,frac(fx,fy));write(13,fz<<16);
 const up=vector(input.upNative,'upNative'),right=cross(up,forward);
 length=squared(right);if(length===0)return incomplete('zero-right');
 const [rx,ry,rz]=encode(right,length,factor);
 write(0,pair(rx,ry));write(8,frac(rx,ry));write(1,rz&0xffff0000);write(9,rz<<16);
 const actualUp=cross(forward,right);length=squared(actualUp);if(length===0)return incomplete('zero-up');
 const [ux,uy,uz]=encode(actualUp,length,factor);
 write(2,pair(ux,uy));write(10,frac(ux,uy));write(3,uz&0xffff0000);write(11,uz<<16);
 const position=vector(input.positionNative,'positionNative'),[x,y,z]=['x','y','z'].map(k=>fixed(mul(65536,position[k])));
 write(6,pair(x,y));write(14,frac(x,y));write(7,(z&0xffff0000)|1);write(15,z<<16);
 return freeze({complete:true,matrixWords:packed,operations,diagnostic:{stage:'complete'}});
}

/** Source49A94 uses the retained4096-entry sine table, including the source
 * +0.5/truncate/index-mask behavior for negative angles. Each axis has its own
 * readonly angle-period input. The47EE0 packing stage retains descending
 * element order and integer/fraction stores. No Math.sin substitution occurs. */
export function prepareNativeEulerMatrix(input){
 const angles=vector(input?.anglesRadians,'anglesRadians'),table=input.sineTableWords4350,periods=input.anglePeriodWords9254;
 if(!Array.isArray(table)||table.length!==4096)throw new RangeError('sineTableWords4350 requires4096 words');
 if(!Array.isArray(periods)||periods.length!==3)throw new RangeError('anglePeriodWords9254 requires3 words');
 const operations=[],scratch=Array(16),indices=[];
 const write=(i,v)=>{scratch[i]=bits(v);operations.push({kind:'scratchFloatWrite',wordIndex:i,value:scratch[i]});};
 function axis(k,index){
  const phase=add(finite(F(mul(angles[k],4096)/float(periods[index])),'matrix angle division'),.5),n=fixed(phase);
  indices.push(n&4095);return [float(table[n&4095]),float(table[(n+1024)&4095])];
 }
 const [sx,cx]=axis('x',0);write(9,F(-sx));
 const [sy,cy]=axis('y',1);write(8,mul(cx,sy));write(10,mul(cy,cx));
 const [sz,cz]=axis('z',2);write(1,mul(sz,cx));write(5,mul(cz,cx));
 const sySz=mul(sy,sz),cyCz=mul(cy,cz);write(0,add(cyCz,mul(sx,sySz)));
 const syCz=mul(sy,cz),szCy=mul(sz,cy);
 write(4,sub(mul(sx,syCz),szCy));write(2,sub(mul(sx,szCy),syCz));write(6,add(mul(sx,cyCz),sySz));
 const p=vector(input.positionNative,'positionNative');write(12,p.x);write(13,p.y);write(3,0);write(7,0);write(11,0);write(15,1);write(14,p.z);
 const packed=new DataView(new ArrayBuffer(64));
 for(let i=15;i>=0;i--){const v=fixed(mul(float(scratch[i]),65536)),high=v>>>16,low=v&65535;
  packed.setUint16(i*2,high);operations.push({kind:'matrixHalfwordWrite',byteOffset:i*2,width:2,value:high});
  packed.setUint16(32+i*2,low);operations.push({kind:'matrixHalfwordWrite',byteOffset:32+i*2,width:2,value:low});}
 return freeze({complete:true,floatWords:scratch,matrixWords:Array.from({length:16},(_,i)=>packed.getUint32(i*4)),operations,diagnostic:{sineIndices:indices}});
}
