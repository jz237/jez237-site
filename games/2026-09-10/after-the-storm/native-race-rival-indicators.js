import {nativeRaceLookupAngle} from './native-race-direction-warning.js';
// Source rival-indicator numeric consumer. Readonly numeric tables remain
// caller inputs; neither original artwork nor a guessed trigonometric table
// is embedded. The output is canonical HUD state, not a graphics command list.
const F=Math.fround,MIN=-2147483648,MAX=2147483647,HUD_BASE=0x7788,RACE_BASE=0x1f94;
const data=new DataView(new ArrayBuffer(4));
function record(v,n){if(!v||typeof v!=='object'||Array.isArray(v))throw new TypeError(`Expected ${n}`);return v;}
function integer(v,n,min=MIN,max=MAX){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${n}`);return v||0;}
function scalar(v,n){if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new RangeError(`${n} must fit finite float32`);return F(v);}
function words(v,n,count){if(!Array.isArray(v)||v.length!==count)throw new RangeError(`${n} requires${count} unsigned words`);
 return Array.from(v,x=>integer(x,`${n} word`,0,0xffffffff));}
function freeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
function float(bits){data.setUint32(0,bits,false);return data.getFloat32(0,false);}
function floatBits(value){data.setFloat32(0,scalar(value,'source HUD float'),false);return data.getUint32(0,false);}
function vectorAngle(f12,f14,getTable){
 const x=scalar(f12,'source vector f12'),y=scalar(f14,'source vector f14');if(y===0&&x===0)return 0;
 const negativeY=y<0,negativeX=x<0,a=negativeX?F(-x):x,b=negativeY?F(-y):y,
  length=F(Math.sqrt(F(F(b*b)+F(a*a)))),first=b<=a,ratio=F((first?b:a)/length),scaled=F(ratio*511);
 if(!Number.isFinite(scaled)||scaled<MIN||scaled>=2147483648)throw new RangeError('Unsupported source vector-angle conversion/FCSR domain');
 const index=Math.trunc(scaled);if(index<0||index>511)throw new RangeError('Source vector angle indexes outside supplied512-word table');
 const lookup=scalar(float(getTable()[index]),'selected source angle table value');let angle=first?lookup:F(90-lookup);
 // These are the original cvt.d.s + F64 quadrant operations, followed by
 // cvt.s.d. JS numbers hold every incoming binary32 value exactly.
 if(negativeY&&!negativeX)angle=F(180-angle);
 else if(negativeY&&negativeX)angle=F(angle+180);
 else if(!negativeY&&negativeX)angle=F(360-angle);
 return angle;
}
/** Complete readonlyED154 vector-angle helper, including both-zero early
 * return and its original F32 normalization/table index/F64 quadrants. This
 * intentionally uses direct table indexing, not ED090's out-of-range guard.
 * Supply actual512 readonlyu32 angle words when a table read is reached.
 */
export function nativeRaceVectorAngle(f12,f14,angleTableWords6f08){
 let table;return vectorAngle(f12,f14,()=>table??=words(angleTableWords6f08,'angleTableWords6f08',512));
}
function context(v){record(v,'rival-indicator sample');record(v.scene,'source rival scene');return {value:v,scene:{...v.scene},hud:null,race:null,
 angle:null,sine:null,operations:[],rivals:[]};}
const s=(c,key,min=MIN,max=MAX)=>integer(c.scene[key],`scene.${key}`,min,max);
function race(c,slot){c.race??=words(c.value.raceWords1f94,'raceWords1f94',1693);return c.race[(0x293c+slot*0x378-RACE_BASE)/4]|0;}
function write(c,address,value){c.hud??=words(c.value.hudWords7788,'hudWords7788',1442);const bits=value>>>0;c.hud[(address-HUD_BASE)/4]=bits;
 c.operations.push({kind:'hudWrite',byteOffset:address-HUD_BASE,width:4,value:bits});}
function hudFloat(c,address){c.hud??=words(c.value.hudWords7788,'hudWords7788',1442);
 return scalar(float(c.hud[(address-HUD_BASE)/4]),'selected source HUD constant');}
function getAngle(c){return c.angle??=words(c.value.angleTableWords6f08,'angleTableWords6f08',512);}
function angle(c,cosine){return nativeRaceLookupAngle(cosine,cosine>=-1&&cosine<=1?getAngle(c):undefined);}
function sine(c,index){c.sine??=words(c.value.sineTableWords4350,'sineTableWords4350',4096);return scalar(float(c.sine[index&4095]),'selected source sine table value');}
function position(c,slot){const rows=c.value.bodiesBySlot;if(!Array.isArray(rows)||rows.length>4)throw new RangeError('Supply actual bodiesBySlot');
 const p=record(record(rows[slot],'source rival body').positionNativeXZ,'body.positionNativeXZ');return {x:scalar(p.x,'body.position.x'),z:scalar(p.z,'body.position.z')};}
function one(c,view,count){
 const human=s(c,view===0?'primaryHumanIndex':'secondaryHumanIndex',0,3),indices=c.value.cameraIndicesByView,cameras=c.value.camerasByIndex;
 if(!Array.isArray(indices)||indices.length>2||!Array.isArray(cameras)||cameras.length>2)throw new RangeError('Supply actual source camera selectors/views');
 const cameraIndex=integer(indices[view],'camera view index',0,1),cam=record(cameras[cameraIndex],'source rival camera');
 const cx=scalar(cam.field4c,'camera.field4c'),cz=scalar(cam.field54,'camera.field54'),
  axisX=F(-scalar(cam.fieldF0,'camera.fieldF0')),axisZ=F(-scalar(cam.fieldF4,'camera.fieldF4')),
  vx=F(scalar(cam.field7c,'camera.field7c')-cx),vz=F(scalar(cam.field84,'camera.field84')-cz);
 // The original performs this guarded-input sqrt before even checking racer
 // count; its result is not subsequently used. Keep its actual input reads.
 F(Math.sqrt(F(F(vx*vx)+F(vz*vz))));
 for(let slot=0;slot<count;slot++){
  const base=0x8b88+view*0x50+slot*0x14,diag={viewIndex:view,racerIndex:slot,cameraIndex,active:false,reason:null};c.rivals.push(diag);
  write(c,base+16,0);
  if(slot===human){diag.reason='selected-human';continue;}
  if(race(c,slot)<race(c,human)){diag.reason='smaller-source-place';continue;}
  const p=position(c,slot),x=F(p.x-cx),z=F(p.z-cz),lateral=F(F(x*axisZ)+F(z*F(-axisX))),depth=F(F(x*axisX)+F(z*axisZ));
  const distance=F(Math.sqrt(F(F(x*x)+F(z*z))));let cosine=depth;
  if(distance>0)cosine=F(F(F(x/distance)*axisX)+F(F(z/distance)*axisZ));
  const lookAngle=angle(c,cosine);
  if(distance>1024||lookAngle>135){diag.reason='source-range-or-angle';continue;}
  const clampedDepth=depth<0?0:depth,denominator=F(F(F(clampedDepth*F(1/1024))*1024)+60),ratio=F(lateral/denominator);
  let clipped=ratio,bend=0;
  if(ratio>1){bend=vectorAngle(F(ratio-1),F(depth/denominator),()=>getAngle(c));clipped=1;}
  else if(ratio<-1){bend=vectorAngle(F(ratio+1),F(depth/denominator),()=>getAngle(c));clipped=-1;}
  if(bend>180)bend=F(bend-360);
  const magnitude=bend>=0?bend:F(-bend),direction=bend===0?0:bend>0?1:-1;
  let easedAngle=magnitude,cornerX=0,vertical=0;
  if(magnitude>0){
   easedAngle=F(magnitude*hudFloat(c,0x7a50));if(easedAngle>90)easedAngle=90;
   const raw=F(F(easedAngle/360)*4096);
   if(!Number.isFinite(raw)||raw<MIN||raw>=2147483648)throw new RangeError('Unsupported source sine-index conversion/FCSR domain');
   const index=Math.trunc(raw);cornerX=F(F(sine(c,index)*direction)*32);vertical=F(F(-F(1-sine(c,(index+1024)|0)))*24);
  }
  write(c,base+16,1);write(c,base+4,floatBits(vertical));write(c,base+8,floatBits(F(direction*easedAngle)));
  write(c,base,floatBits(F(F(clipped*94)+cornerX)));diag.active=true;
 }
}

/** Complete originalF9EA0..FA3C0, once per source call. scene contains actual
 * players/racerCount and selected human slots. Camera selectors3930/3934 are
 * independent; each supplied camera uses actual address-named scalar fields
 *4c/54,7c/84,F0/F4. The latter raw axis is negated WITHOUT normalization;
 * direction-warning64/6c or a modern presentation heading is not equivalent.
 * Rival bodies expose only actual44/4c positionNativeXZ, read after the source
 * selected-human and signed-place filters. No actor/finish/DQ filter is added.
 *
 * Camera DTOs are temporary views of the source fields inside the broad HUD
 * span, not another persistent owner. The reached corner coefficient7a50
 * (normallyF32(2/3)) is also read directly from that canonical HUD owner.
 * Readonly actual angleTableWords6f08[512] and sineTableWords4350[4096] are
 * required only on reached lookups. There is no Math.sin/acos/atan2 fallback
 * or original table embedded here. Finite F32/signed conversion domain only;
 * unsupported nonfinite/FCSR/table-index cases reject atomically.
 *
 * Returns ordered canonical hudWrite width4 bit patches: active+10 resets
 * even for hidden/self entries, while rejected entries retain prior floats.
 * Qualified entries write active1 then offsets4/8/0 in original order. The
 * existing HUD span remains sole retained owner. No rendering, callbacks,
 * body/camera/record/RNG/clock mutation, or whole79528 caller gate is implied.
 */
export function prepareNativeRaceRivalIndicators(value){
 const c=context(value),players=s(c,'players');if(players>2)throw new RangeError('Source rival views exceed2');
 for(let view=0;view<players;view++){
  const count=s(c,'racerCount');if(count>4)throw new RangeError('Source rival racers exceed4');one(c,view,count);
 }
 return freeze({operations:c.operations,diagnostic:{rivals:c.rivals}});
}
