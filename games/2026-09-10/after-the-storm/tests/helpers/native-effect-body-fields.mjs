// Independent fixture decoding, not a synthetic production body owner.
export function effectBodyFields(words){
 if(words===undefined)return undefined;
 const bytes=new DataView(new ArrayBuffer(words.length*4));words.forEach((v,i)=>bytes.setUint32(i*4,v));
 const vector=o=>({x:bytes.getFloat32(o),y:bytes.getFloat32(o+4),z:bytes.getFloat32(o+8)});
 return {positionNative:vector(0x44),frameDisplacementNative:vector(0xb78),forwardNative:vector(0x6c),rightNative:vector(0x84),
  referenceVelocityNative:vector(0x1618),tickDisplacementNative:vector(0x50),boundaryDriftNative:{x:bytes.getFloat32(0xbf0),z:bytes.getFloat32(0xbf4)},
  floorImpactNative:bytes.getFloat32(0xc4c),alternate16cc:bytes.getUint16(0x16cc),stumbleCountdown16e0:bytes.getUint16(0x16e0),engineMaskC66:bytes.getUint16(0xc66)};
}
export function structuredEffectBodies(input){const {bodyWordsBySlot,...rest}=input;return {...rest,bodyFieldsBySlot:bodyWordsBySlot?.map(effectBodyFields)};}
