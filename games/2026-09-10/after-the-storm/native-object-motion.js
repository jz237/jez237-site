// Generic half of7DBC0 after the primary-buoy pass. Native positions and
// velocities are binary32; damping/spring/lift products use source doubles.
const F=Math.fround,bits=new DataView(new ArrayBuffer(4));
function integer(v,n,min,max){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${n}`);return v;}
function finite(v,n){if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new RangeError(`Invalid ${n}`);return F(v);}
function read(w){bits.setUint32(0,w);return finite(bits.getFloat32(0),'object motion float');}
function word(v){bits.setFloat32(0,finite(v,'object motion result'));return bits.getUint32(0);}
function freeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}

/** One reached ascending pass. Only motion58==4 moves, independently of kind,
 * render, collected/broken state. The pure queryNative callback supplies the
 * original4D30C plane result at the OLD X/Z, not the rendered water height.
 * All results stage before returning; invalid late data never mutate input.
 * The caller owns activity624 gating and prior primary-buoy evolution.
 */
export function prepareNativeObjectMotion({objectWordsC940,objectCountFa40,queryNative}={}){
 if(!Array.isArray(objectWordsC940)||objectWordsC940.length!==3136)throw new RangeError('Supply objectWordsC940[3136]');
 const objects=Array.from(objectWordsC940,v=>integer(v,'object word',0,0xffffffff)),count=integer(objectCountFa40,'objectCountFa40',-2147483648,64),queries=[];
 for(let i=0;i<count;i++){
  const base=i*49;if(objects[base+0x58/4]!==4)continue;
  if(typeof queryNative!=='function')throw new TypeError('Moving objects require the source plane query');
  const f=a=>read(objects[base+a/4]),put=(a,v)=>objects[base+a/4]=word(v),x=f(0),z=f(8);
  // Subtraction rounds to single before multiplication by double coefficients.
  const vx=F(f(0x18)*.9+.001*F(f(0x24)-x)),vz=F(f(0x20)*.9+.001*F(f(0x2c)-z));
  let vy=F(f(0x1c)*.8-4);put(0x18,vx);put(0x20,vz);put(0x1c,vy);
  const heightNative=finite(queryNative(x,z,i),'source plane height'),y=f(4),depth=F(heightNative-y);
  queries.push({objectIndex:i,x,z,heightNative});
  if(depth>0){vy=F(vy+.3*Math.min(depth,30));put(0x1c,vy);}
  put(0,F(x+vx));put(4,F(y+vy));put(8,F(z+vz));
 }
 return freeze({objectWordsC940:objects,diagnostic:{queries}});
}
