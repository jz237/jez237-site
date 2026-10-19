const F=Math.fround,axes=['x','y','z'];
const freeze=v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
function finite(v,n){if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new RangeError('Invalid '+n);return F(v);}
function integer(v,n,min=-2147483648,max=2147483647){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError('Invalid '+n);return v;}
function vector(v,n){return Object.fromEntries(axes.map(k=>[k,finite(v?.[k],n+'.'+k)]));}
const norm=v=>finite(Math.sqrt(F(F(F(v.x*v.x)+F(v.y*v.y))+F(v.z*v.z))),'frame speed');
export function nativeFrameReferencePoint(positionNative,upNative,forwardNative){
 const c=vector(positionNative,'position'),u=vector(upNative,'up'),f=vector(forwardNative,'forward');
 // The source multiplies and adds these two constants in double precision,
 // then stores each component once as binary32.
 return Object.fromEntries(axes.map(k=>[k,finite((c[k]+.1806645*u[k])+(-26.9998535)*f[k],'reference point')]));
}

/** Complete65DDC..65FF8 movement, contact-drive counter and reference history.
 * Called after the wrapping stage and before wet/contact/actor decisions.
 * Held simulation retains movement/reference fields, but still evaluates
 * contact-drive counting against the retained speed and sampled engine mask.
 */
export function prepareNativeFrameKinematics(previous,input){
 const active=integer(input?.simulation648,'simulation648')!==0,operations=[];
 const next={displacementNative:vector(previous?.displacementNative,'retained displacement'),
  displacementChangeNative:vector(previous?.displacementChangeNative,'retained displacement change'),
  speedNative:finite(previous?.speedNative,'retained speed'),maxSpeedNative:finite(previous?.maxSpeedNative,'retained maximum speed'),
  referencePositionNative:vector(previous?.referencePositionNative,'retained reference position'),
  referenceDisplacementNative:vector(previous?.referenceDisplacementNative,'retained reference displacement'),
  referenceChangeNative:vector(previous?.referenceChangeNative,'retained reference change'),
  contactDriveFrames:integer(previous?.contactDriveFrames,'contact-drive frames')};
 const floor=finite(input.floorImpactNative,'floor impact'),box=finite(input.boxImpactNative,'box impact'),engine=integer(input.engineMaskC66,'engine mask',0,65535);
 const bits=new DataView(new ArrayBuffer(4)),store=(offset,v)=>{bits.setFloat32(0,finite(v,'kinematic store'));operations.push({byteOffset:offset,width:4,value:bits.getUint32(0)});};
 let position;
 if(active){
  position=vector(input.positionNative,'position');const prior=vector(input.priorPositionNative,'previous position');
  for(const [i,k]of axes.entries()){
   const value=finite(F(position[k]-prior[k]),'frame displacement'),change=finite(F(value-next.displacementNative[k]),'frame acceleration');
   next.displacementNative[k]=value;next.displacementChangeNative[k]=change;store(0xb78+i*4,value);store(0xb84+i*4,change);
  }
  next.speedNative=norm(next.displacementNative);store(0xb90,next.speedNative);
  if(next.maxSpeedNative<next.speedNative){next.maxSpeedNative=next.speedNative;store(0xb94,next.speedNative);}
 }
 if((floor===0&&box===0)||engine===0){next.contactDriveFrames=0;operations.push({byteOffset:0x16b4,width:4,value:0});}
 else if(next.contactDriveFrames<40&&next.speedNative<2.777777910232544){next.contactDriveFrames=(next.contactDriveFrames+1)|0;operations.push({byteOffset:0x16b4,width:4,value:next.contactDriveFrames>>>0});}
 if(active){
  const reference=nativeFrameReferencePoint(position,input.upNative,input.forwardNative);
  for(const [i,k]of axes.entries()){
   const displacement=finite(F(reference[k]-next.referencePositionNative[k]),'reference displacement'),change=finite(F(displacement-next.referenceDisplacementNative[k]),'reference acceleration');
   next.referencePositionNative[k]=reference[k];next.referenceDisplacementNative[k]=displacement;next.referenceChangeNative[k]=change;
   store(0xc14+i*4,reference[k]);store(0xc20+i*4,displacement);store(0xc2c+i*4,change);
  }
 }
 return freeze({state:next,bodyWordWrites:operations});
}
