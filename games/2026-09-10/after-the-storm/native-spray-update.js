import {NATIVE_PRESENTATION_EFFECT_WORDS} from './native-presentation-effects.js';
import {prepareNativeSprayParticleMotion} from './native-spray-particle-motion.js';
import {nativeRaceVectorAngle} from './native-race-rival-indicators.js';
const F=Math.fround,b=new DataView(new ArrayBuffer(4));
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
function integer(v,name,min,max){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError(`Invalid ${name}`);return v;}
function words(v,n,name){if(!Array.isArray(v)||v.length!==n)throw new RangeError(`Supply ${name}[${n}]`);return v.map(w=>integer(w,name,0,0xffffffff));}
function finite(v){if(!Number.isFinite(v)||!Number.isFinite(F(v)))throw new RangeError('Nonfinite spray update');return F(v);}
const number=w=>{b.setUint32(0,w);return finite(b.getFloat32(0));},bits=v=>{b.setFloat32(0,finite(v));return b.getUint32(0);};
const length2=(x,z)=>F(Math.sqrt(F(F(x*x)+F(z*z)))),length3=v=>F(Math.sqrt(F(F(F(v[0]*v[0])+F(v[1]*v[1]))+F(v[2]*v[2]))));

/** Complete B08F8 numeric scene-particle update. B2ABC owns activity gating
 * and AE210 inputs. Source camera/plane data and readonly tables are retained
 * numeric inputs; rendering and playback are separate consumers.
 */
export function prepareNativeSprayUpdate(input){
 let effectWords0790=words(input?.effectWords0790,NATIVE_PRESENTATION_EFFECT_WORDS,'effectWords0790'),effectControlWords6d60=words(input.effectControlWords6d60,22,'effectControlWords6d60');
 const operations=[],slot=integer(input.racerIndex,'effect racer',0,3),primary=integer(input.primaryHumanIndex,'primary human',0,3),secondary=integer(input.secondaryHumanIndex,'secondary human',0,3),
  players=integer(input.players,'players',1,2),main=integer(input.main638,'main scene',-2147483648,2147483647),count=integer(input.racerCount,'physical racer count',1,4),frame=integer(input.frameCounter,'spray frame',-2147483648,2147483647);
 let seed6f00=integer(input.seed6f00,'effect random seed',0,65535),sine;
 const index=a=>integer((a-0x790)/4,'effect storage offset',0,NATIVE_PRESENTATION_EFFECT_WORDS-1),read=a=>effectWords0790[index(a)],f=a=>number(read(a)),vec=a=>[f(a),f(a+4),f(a+8)];
 const pointer=a=>{const v=effectControlWords6d60[(a-0x6d60)/4];index(v-0x801d0000);return v-0x801d0000;};
 const put=(a,v)=>{const value=v>>>0;effectWords0790[index(a)]=value;operations.push({kind:'presentationEffectWrite',byteOffset:a-0x790,width:4,value});},sf=(a,v)=>put(a,bits(v));
 const control=(a,v)=>{const value=v>>>0;effectControlWords6d60[(a-0x6d60)/4]=value;operations.push({kind:'presentationEffectControlWrite',byteOffset:a-0x6d60,width:4,value});};
 const random=range=>{seed6f00=(seed6f00*5+1)&65535;operations.push({kind:'sourceHalfwordWrite',field:'seed6f00',value:seed6f00});return finite(F(F(seed6f00*finite(range))/65536));};
 const sin=i=>{sine??=words(input.sineTableWords4350,4096,'sineTableWords4350');return number(sine[i&4095]);};
 const angle=(x,z)=>nativeRaceVectorAngle(x,z,input.angleTableWords6f08),entry=pointer(0x6d60),human=slot===primary||players===2&&slot===secondary,specialScene=main===4||main===10,split=players===2&&main===1;
 const hud=words(input.hudWords7788,1442,'hudWords7788'),view=integer((read(0x7968)-0x80227c80)/0x10c,'effect camera pointer',0,1),eye=[0x4c,0x50,0x54].map(o=>number(hud[(0x7c80+view*0x10c+o-0x7788)/4])),
  position=vec(0x79bc),velocity=vec(0x79c8),forward=vec(0x79e0),delta=position.map((v,i)=>F(v-eye[i])),distance=length3(delta);
 let detail=0;put(entry+0x1c4c,0);
 if(split){detail=1;put(entry+0x1c4c,1);}
 else if(distance<800&&distance>16){
  const d=delta.map(v=>F(v/distance)),camera=vec(0x7974),facing=F(F(F(d[0]*camera[0])+F(d[1]*camera[1]))+F(d[2]*camera[2]));
  if(players===2||F(.707107)<facing){
   put(entry+0x1c4c,1);
   if(specialScene||players===1&&slot===primary&&integer(input.record2f4,'racer record2f4',-2147483648,2147483647)!==0)detail=distance<200?3:distance<400?2:1;
   else detail=distance<200||main===0?2:distance<400?1:0;
  }
 }
 if(specialScene)detail=3;if(read(0x7a08)!==0&&slot===count&&detail<2)detail=2;
 let lateral=[1,0,0];if(velocity[0]!==0||velocity[2]!==0){lateral=[F(-velocity[2]),0,velocity[0]];const n=length3(lateral);if(n>0)lateral=lateral.map(v=>F(v/n));}
 length2(f(0x79ec),f(0x79f4));const fl=length2(forward[0],forward[2]),vl=length2(velocity[0],velocity[2]),forwardXZ=fl>0?[F(forward[0]/fl),F(forward[2]/fl)]:[0,0],
  alignment=fl>0&&vl>0?F(F(F(F(forward[0]*velocity[0])+F(forward[2]*velocity[2]))/fl)/vl):1,absAlignment=alignment>=0?alignment:F(-alignment),speed=f(0x79d4);
 let adjustedAlignment=alignment;if(speed<8)adjustedAlignment=Math.min(1,F(F(f(0x79dc)*F(8-speed))+alignment));
 put(entry+0x1c30,read(entry+0x1c2c));put(entry+0x1c2c,specialScene?1:Number(position[1]<=f(0x7a00)));
 const entered=read(entry+0x1c30)===0&&read(entry+0x1c2c)!==0;put(entry+0x1c34,Number(entered));
 if(read(entry+0x1c2c)!==0)put(entry+0x1c3c,0);else if((read(entry+0x1c3c)|0)<32767)put(entry+0x1c3c,read(entry+0x1c3c)+1);
 const motion=prepareNativeSprayParticleMotion({effectWords0790,effectControlWords6d60,racerIndex:slot,primaryHumanIndex:primary});
 effectWords0790=[...motion.effectWords0790];effectControlWords6d60=[...motion.effectControlWords6d60];operations.push(...motion.operations);
 const baseSpeed=speed<10?F(speed*(specialScene?5:3)):F(F(F(speed-10)*F(.6))+(specialScene?50:30)),jet=specialScene||!human?0:Math.max(0,F(F(F(8-speed)*7.5)*f(0x79dc))),change=Math.abs(F(speed-f(entry+0x1c68)));
 sf(entry+0x1c64,F(F(F(F(change*1.5)+baseSpeed)+F(f(0x79d8)+f(0x79d8)))+jet));sf(entry+0x1c68,speed);
 let strength=F(F(f(entry+0x1c64)/50)*4);
 if(read(entry+0x1c2c)===0||read(entry+0x1c4c)===0){put(entry+0x1c44,0);strength=0;}
 else if(entered&&Math.abs(velocity[1])>1){put(entry+0x1c40,0);strength=F(strength+strength);put(entry+0x1c44,velocity[1]<0?4:2);}
 else if(f(entry+0x1c70)<0&&velocity[1]>0)put(entry+0x1c40,2);
 else if(f(entry+0x1c70)>0&&velocity[1]<0){put(entry+0x1c40,0);strength=F(strength*F(1.2));}
 if(read(entry+0x1c54)!==0){strength=F(strength*F(1.2));if(slot<count&&integer(input.bodyC66,'body C66',0,65535)!==0)put(entry+0x1c44,1);}
 sf(entry+0x1c70,velocity[1]);if(read(entry+0x1c40)!==0){put(entry+0x1c40,read(entry+0x1c40)-1);strength=F(strength*.5);}
 let emit=split?(frame&1)===0:detail>1||(frame&1)===0;if(!entered&&position[1]<F(f(0x7a00)-16))emit=false;
 const square=F(alignment*alignment),turn= square<1?F(Math.sqrt(F(1-square))):0,cross=F(F(forward[2]*velocity[0])-F(forward[0]*velocity[2])),leftFraction=cross>=0?F(F(turn*.5)+.5):F(.5-F(turn*.5)),rightFraction=F(1-leftFraction),
  a=F(strength*leftFraction),d=F(strength*rightFraction),leftStrength=F(a+a),rightStrength=F(d+d);
 if(strength>F(.1)&&emit&&detail!==0){
  const emitCount=!split&&detail===3?6:4,half=emitCount/2;
  if(human)for(const [offset,value]of [[0x1c5c,leftStrength],[0x1c60,rightStrength]]){
   if(value>4){const level=Math.trunc(F(F(value*.125)*127));put(entry+offset,level);if(level>=128)put(entry+offset,127);}else put(entry+offset,0);
  }
  let unusedAngle=F(angle(forward[2],forward[0])-90);unusedAngle=F(unusedAngle+F(random(32)-16));
  control(0x6d64,0x801d0000+pointer(0x6d68)+0xfc0);strength=leftStrength;let emitted=0;
  for(let i=63;i>=0;i--){
   const row=pointer(0x6d64);
   if(read(row+0x38)===0){
    put(row+0x38,1);put(row+0x3c,0);
    const oneMinus=F(1-adjustedAlignment),growth=F(strength*F(1.2)),backwardShift=F(F(oneMinus*16)*.5),lateralSpeed=F(F(strength/F(1.6))*F(3.2)),upBase=F(strength/1.5),misalign=F(F(F(1-absAlignment)*strength)*.5),
     backward=F(F(F(oneMinus*8)*.5)-6),ratio=F((emitted<half?half-emitted-1:emitted-half)/(half-1)),shape=F(F(F(F(ratio-1)*Math.min(rightFraction,leftFraction))*2)+1),sign=emitted<half?-1:1;
    sf(row+0x30,F(F(F(shape+.5)*strength)+2));sf(row+0x34,growth);
    let back=F(F(32-F(shape*16))-backwardShift),vertical=F(F(F(upBase*shape)+8)+misalign),along=alignment===adjustedAlignment?backward:F(backward+2),side=lateralSpeed;
    if(read(entry+0x1c54)!==0){side=F(lateralSpeed*F(1/32));vertical=F(vertical/6);along=F(along/3);}
    if(specialScene){sf(row+0x30,F(f(row+0x30)+14));back=F(back-4);sf(row+0x34,strength);}
    sf(row+0x18,F(F(F(shape*6)+6)*sign));sf(row+0x20,back);
    sf(row,F(F(F(f(row+0x18)*f(0x79ec))+position[0])+F(back*forward[0])));
    sf(row+8,F(F(F(f(row+0x18)*f(0x79f4))+position[2])+F(back*forward[2])));
    sf(row+4,F(F(position[1]+4)-strength));sf(row+0x24,F(side*sign));sf(row+0x2c,F(along*F(1.2)));
    sf(row+12,F(F(f(row+0x24)*f(0x79ec))+F(F(f(row+0x2c)*.5)*forward[0])));
    sf(row+20,F(F(f(row+0x24)*f(0x79f4))+F(F(f(row+0x2c)*.5)*forward[2])));
    sf(row+16,F(F(random(.5)+1)*vertical));emitted++;
    if(emitted>=emitCount)break;
    if(emitted===half){strength=rightStrength;unusedAngle=F(unusedAngle+90);}else unusedAngle=F(unusedAngle+F(90/(emitCount-2)));
   }
   control(0x6d64,0x801d0000+row-64);
  }
 }
 if(slot===primary&&players===1){
  const facing=angle(forward[2],forward[0]);
  for(let side=0;side<2;side++){
   strength=side===0?leftStrength:rightStrength;let heading=F(facing+(side===0?-90:90)),increment=F((side===0?45:-45)/7),spawn=strength>=3&&(absAlignment<F(.94)&&read(entry+0x1c50)!==0||entered);
   if(spawn&&read(entry+0x1c50)!==0&&!entered)put(entry+0x1c50,read(entry+0x1c50)-1);
   if(!spawn){put(entry+0x1c50,read(entry+0x1c50)+1);if((read(entry+0x1c50)|0)>=25)put(entry+0x1c50,24);continue;}
   control(0x6d6c,0x801d0000+pointer(0x6d70)+0x9d8);let emitted=0;
   for(let i=63;i>=0;i--){
    const row=pointer(0x6d6c);
    if(read(row+0x20)===0){
     put(row+0x20,1);put(row+0x24,0);
     const drift=F(32+strength),xBack=F(forwardXZ[0]*drift),zBack=F(forwardXZ[1]*drift),halfStrength=F(strength*.5),doubleStrength=F(strength+strength);
     sf(row+0x18,F(random(F(strength/3))+1));sf(row+0x1c,0);
     const ratio=F((emitted<4?3-emitted:emitted-4)/3),shape=F(F(F(F(ratio-1)*Math.min(leftFraction,rightFraction))*2)+1),radius=F(F(24+strength)-F(shape*8)),theta=Math.trunc(F(F(heading/360)*4096)),co=sin(theta+1024),si=sin(theta);
     sf(row,F(F(co*radius)+F(position[0]-xBack)));const ry=random(strength);sf(row+4,F(F(ry+F(position[1]+8))+doubleStrength));
     sf(row+8,F(F(si*radius)+F(position[2]-zBack)));const driftRandom=random(halfStrength),upRandom=random(halfStrength);
     sf(row+12,F(F(co*driftRandom)+velocity[0]*.8));sf(row+16,F(upRandom+strength/1.2));sf(row+20,F(F(si*driftRandom)+velocity[2]*.8));
     emitted++;heading=F(heading+increment);if(emitted>=8)break;
    }
    control(0x6d6c,0x801d0000+row-40);
   }
  }
 }
 if(read(entry+0x1c44)!==0&&strength>1&&read(entry+0x1c4c)!==0){
  put(entry+0x1c44,read(entry+0x1c44)-1);const selected=integer(read(entry+0x1c48)|0,'quad ring index',0,3);put(entry+0x1c48,selected+1);put(entry+0x1c48,(selected+1)%4);
  const row=pointer(0x6d78)+selected*40;
  if(read(row+0x20)===0&&!(read(entry+0x1c54)!==0&&read(0x7a10)!==0)){
   control(0x6d74,0x801d0000+row);put(row+0x20,1);put(row+0x24,0);const scale=Math.min(1,F(F(strength-1)*.25));sf(row+0x1c,scale);sf(row+0x18,F(random(F(8*scale))+F(48*scale)));
   let lateralOffset,back,height;
   if(read(entry+0x1c54)!==0){lateralOffset=F(F(random(16)-8)*scale);back=-36;height=4;}
   else{const r12=random(12),r4=random(4);lateralOffset=F(F(r4+F(12+F(F(8-r12)*scale)))-2);if(selected>=2)lateralOffset=F(-lateralOffset);
    const r16=random(16),rz=random(4);back=F(F(rz+F(-16-F(F(8+r16)*scale)))-2);height=F(F(scale*12)+4);}
   for(let j=0;j<3;j++){let v=F(F(F(lateralOffset*f(0x79ec+j*4))+position[j])+F(back*forward[j]));if(j===1)v=F(v+height);sf(row+j*4,v);}
   sf(row+12,F(velocity[0]*F(.85)));sf(row+16,scale);sf(row+20,F(velocity[2]*F(.85)));
  }
 }
 const target=Math.min(32,F(F(F(strength-1)/5)*32)),old=f(entry+0x1c6c);
 if(old<target&&read(entry+0x1c2c)!==0){sf(entry+0x1c6c,F(old+4));if(f(entry+0x1c6c)>target)sf(entry+0x1c6c,target);}
 else{sf(entry+0x1c6c,F(old-1));if(f(entry+0x1c6c)<0)sf(entry+0x1c6c,0);}
 control(0x6d7c,0x801d0000+pointer(0x6d80));
 for(let i=0;i<8;i++){
  const row=pointer(0x6d7c);for(const [to,drift]of [[0,0x79f8],[8,0x79fc],[12,0x79f8],[20,0x79fc]])sf(row+to,F(f(row+to)+f(drift)));
  control(0x6d7c,0x801d0000+row+48);
 }
 const width=f(entry+0x1c6c);let spread=width>0&&read(entry+0x1c54)===0?F(F(F(1-absAlignment)*32)+22.5):0;
 if(width<4)spread=F(spread*F(width*.25));let back=F(F(alignment*16)+16),height=f(0x7a00);
 if(read(0x7a08)!==0&&slot===count){spread=F(spread+spread);height=Math.min(position[1],height);}
 else if(read(0x7a10)!==0)height=Math.min(position[1],height);
 else if(position[1]<height)back=F(back+F(height-position[1]));
 const water=f(0x7a00);if(position[1]>F(water+16))spread=0;if(position[1]>water)spread=F(spread*F(F(16-F(position[1]-water))*.0625));spread=F(spread*.75);
 const selected=integer(read(entry+0x1c38)|0,'wake ring index',0,7),row=pointer(0x6d80)+selected*48;control(0x6d7c,0x801d0000+row);
 sf(row,F(F(position[0]-F(spread*lateral[0]))-F(back*forward[0])));sf(row+4,height);sf(row+8,F(F(position[2]-F(spread*lateral[2]))-F(back*forward[2])));
 sf(row+12,F(F(F(spread*lateral[0])+position[0])-F(back*forward[0])));sf(row+16,height);sf(row+20,F(F(F(spread*lateral[2])+position[2])-F(back*forward[2])));
 for(let j=0;j<3;j++)sf(row+24+j*4,F(velocity[j]*F(.6)));put(entry+0x1c38,selected+1);put(entry+0x1c38,(selected+1)%8);
 return freeze({effectWords0790,effectControlWords6d60,seed6f00,operations,diagnostic:{detail,graphicsExecuted:false}});
}
