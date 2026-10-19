import {NATIVE_PRESENTATION_ACTOR_WORDS} from './native-presentation-actor-pool.js';
import {selectNativePresentationAnimationRoot} from './native-presentation-animation-root.js';
import {nativePresentationVectorHeading} from './native-presentation-actor-visibility.js';
import {prepareNativeActorActionAnimation} from './native-actor-action-animation.js';
import {nativeDolphinPositionBlocked} from './native-dolphin-regions.js';
import {queryNativeWaterField} from './native-water-field.js';
import {queryNativeSupportBoxes,queryNativeSupportFloor} from './native-support-queries.js';
import {queryNativeShorePoint} from './native-shore-contacts.js';
import {prepareNativeCueAudio} from './native-cue-audio.js';
import {nativePresentationAnimationForResource,nativePresentationAnimationTransform} from './native-presentation-animation-resource.js';
const F=Math.fround,b=new DataView(new ArrayBuffer(4)),scratch=a=>a+0x10000-0xf060;
const word=v=>Number.isInteger(v)&&v>=0&&v<=0xffffffff;
function integer(v,lo,hi,name){if(!Number.isInteger(v)||v<lo||v>hi)throw new RangeError(`Invalid dolphin ${name}`);return v;}
function number(w){b.setUint32(0,w);const v=b.getFloat32(0);if(!Number.isFinite(v))throw new RangeError('Nonfinite dolphin input');return v;}
function wrap(v,lo,hi,inclusive){while(inclusive?v>=hi:v>hi){const n=F(v-360);if(n===v)throw new RangeError('Dolphin angle cannot advance');v=n;}while(v<lo){const n=F(v+360);if(n===v)throw new RangeError('Dolphin angle cannot advance');v=n;}return v;}
const difference=v=>wrap(v,-180,180,false),circular=v=>wrap(v,0,360,true);
/** A68A4: original dolphin motion, retained sound packet, animation offset,
 * pursuit, follower unlocks and sequential collision probes. Course records
 * are the actual contiguous65-word records starting801AEE20; source family
 * offsets and cross-row reads remain explicit. No rendered pose is an input. */
export function prepareNativeDolphinActorMotion(input){
 const source=input?.actorWordsF060;
 if(!Array.isArray(source)||source.length!==NATIVE_PRESENTATION_ACTOR_WORDS||Array.from(source).some(w=>!word(w)))throw new RangeError('Supply complete dolphin actor pool');
 let pool=[...source],aux=input.actorControlWords62d0===undefined?undefined:[...input.actorControlWords62d0];
 const operations=[],index=integer(input.actorIndex,0,29,'actor index'),base=index*0xbc,camera=integer(input.cameraIndex,0,1,'camera');
 const get=o=>number(pool[o/4]),rg=o=>get(base+o),ri=o=>pool[(base+o)/4]|0,sg=a=>get(scratch(a));
 function put(o,v){pool[o/4]=v>>>0;operations.push(Object.freeze({kind:'presentationActorWrite',byteOffset:o,width:4,value:v>>>0}));}
 function sf(o,v){v=F(v);if(!Number.isFinite(v))throw new RangeError('Nonfinite dolphin result');b.setFloat32(0,v);put(o,b.getUint32(0));}
 const rw=(o,v)=>put(base+o,v),rf=(o,v)=>sf(base+o,v),ss=(a,v)=>sf(scratch(a),v);
 function byte(a,v){const o=scratch(a),i=o>>>2,shift=(3-(o&3))*8;v&=255;pool[i]=((pool[i]&~(255<<shift))|(v<<shift))>>>0;operations.push(Object.freeze({kind:'presentationActorWrite',byteOffset:o,width:1,value:v}));}
 function auxRead(i){if(!Array.isArray(aux)||aux.length!==2||aux.some(w=>!word(w)))throw new RangeError('Supply dolphin actorControlWords62d0');return aux[i]|0;}
 function auxWrite(i,v){auxRead(i);aux[i]=v>>>0;operations.push(Object.freeze({kind:'presentationActorAuxControlWrite',byteOffset:i*4,width:4,value:v>>>0}));}
 function sin(i){const a=input.sineTableWords4350;if(!Array.isArray(a)||a.length!==4096||!word(a[i&4095]))throw new RangeError('Supply original dolphin sine table');return number(a[i&4095]);}
 const square=(x,z)=>F(F(x*x)+F(z*z)),length=(x,z)=>F(Math.sqrt(square(x,z)));
 const heading=(x,z)=>nativePresentationVectorHeading(x,z,input.angleTableWords6f08);
 const water=(x=rg(0xc),z=rg(0x14))=>queryNativeWaterField(input.waterField,x,z).sourcePlaneQueryNative;
 const phase=(angle,divideFirst=false)=>Math.trunc(divideFirst?F(F(angle/360)*4096):F(F(angle*4096)/360));
 function cameraField(o){const a=input.hudWords7788,at=(0x7c80+camera*0x10c-0x7788+o)/4;if(!Array.isArray(a)||a.length!==1442||!word(a[at]))throw new RangeError('Supply actual dolphin camera words');return number(a[at]);}
 function courseWord(row,o,family=64){const a=input.courseWordsEe20,i=(family+row)*65+o/4;if(!Array.isArray(a)||!Number.isInteger(i)||i<0||i>=a.length||!word(a[i]))throw new RangeError('Supply reached dolphin courseWordsEe20');return a[i];}
 const node=(o,family=64,row=ri(0x9c))=>number(courseWord(row,o,family));
 const nodeInt=(o,family=64,row=ri(0x9c))=>courseWord(row,o,family)|0;
 function animate(){const q=prepareNativeActorActionAnimation({...input,actorWordsF060:pool});pool=[...q.actorWordsF060];operations.push(...q.operations);}
 const aim=()=>heading(F(sg(0x754)-rg(0xc)),F(-F(sg(0x75c)-rg(0x14))));
 function steer(){const error=sg(0x760);if(error>=2){rf(0x18,circular(F(rg(0x18)+2)));if(error>45)rf(0x18,circular(F(rg(0x18)+5)));}
  if(error<=-2){rf(0x18,circular(F(rg(0x18)-2)));if(error< -45)rf(0x18,circular(F(rg(0x18)-5)));}if(Math.abs(error)<2)rf(0x18,circular(aim()));}
 function bank(){rf(0x1c,difference(F(difference(F(F(sg(0x760)/3)-rg(0x1c)))*.1+rg(0x1c))));if(rg(0x1c)>45)rf(0x1c,45);if(rg(0x1c)< -45)rf(0x1c,-45);rf(0x1c,circular(rg(0x1c)));}
 function move(speed){const p=phase(rg(0x18)),x=F(sin(p+1024)*speed),z=F(sin(p)*speed);rf(0x24,x);rf(0xc,F(rg(0xc)+x));rf(0x2c,z);rf(0x14,F(rg(0x14)+z));}
 function coast(){const x=F(rg(0xc)+rg(0x24)),z=F(rg(0x14)+rg(0x2c));rf(0xc,x);rf(0x14,z);}
 function smoothSpeed(maxSpeed,multiplier=1){ss(0x768,length(rg(0x24),rg(0x2c)));const wanted=F(F(F(F(180-Math.abs(sg(0x760)))/180)*maxSpeed)*multiplier);ss(0x764,F(F(wanted-sg(0x768))*.15+sg(0x768)));}
 // Both original searches read801BB124, even the one scanning family0.
 // Practice has60 primary rows and64 secondary rows; these counts differ.
 function nearest(family){ss(0x754,2000000000);let selected=-1;const count=integer(input.secondaryCount,0,64,'secondary count');for(let r=0;r<count;r++){ss(0x758,square(F(sg(0x6bc)-node(0,family,r)),F(sg(0x6c4)-node(8,family,r))));if(sg(0x758)<sg(0x754)&&nodeInt(0xc0,family,r)<2){selected=r;ss(0x754,sg(0x758));}}rw(0x9c,selected);}
 function rescue(){
  ss(0x754,F(cameraField(0x4c)-rg(0xc)));ss(0x758,F(cameraField(0x54)-rg(0x14)));
  ss(0x75c,circular(-heading(cameraField(0xf0),cameraField(0xf4))));ss(0x760,circular(heading(F(rg(0xc)-cameraField(0x4c)),F(-F(rg(0x14)-cameraField(0x54))))));
  if(square(sg(0x754),sg(0x758))>16000000||(Math.abs(difference(F(sg(0x760)-sg(0x75c))))>100&&square(sg(0x754),sg(0x758))>250000)){
   ss(0x754,rg(0xc));ss(0x758,rg(0x14));ss(0x764,circular(F(180-heading(cameraField(0xf0),cameraField(0xf4)))));const p=phase(sg(0x764),true);
   rf(0xc,F(F(sin(p+1024)*200)+cameraField(0x4c)));rf(0x14,F(F(sin(p)*200)+cameraField(0x54)));
   if(nativeDolphinPositionBlocked({x:rg(0xc),z:rg(0x14)})){rf(0xc,sg(0x754));rf(0x14,sg(0x758));}
  }
 }
 function regionTargets(xAt,zAt,height){
  const x=sg(0x6bc),z=sg(0x6c4);
  const set=(tx,tz)=>{ss(xAt,tx);ss(zAt,tz);if(height)ss(0x758,F(water(sg(xAt),sg(zAt))-20));};
  if(x>0&&z< -4000)set(7000,-2650);if(x<=0&&z< -4000)set(-7000,-2650);
  if(x>0&&z> -4000&&z< -1300)set(5600,0);if(x<=0&&z> -4000&&z< -1300)set(-5600,2000);
  if(x>3300&&z> -1300&&z<1000)set(5000,1000);if(x<=-3700&&z> -1300&&z<2000)set(-5000,2500);
 }
 function probe(){
  const p={x:sg(0x76c),y:sg(0x770),z:sg(0x774)},g=input.collisionGeometry;
  const boxes=queryNativeSupportBoxes(p,g?.boxes);if(boxes.normalNative)for(const [i,k]of ['x','y','z'].entries())ss(0x760+i*4,boxes.normalNative[k]);
  const floor=queryNativeSupportFloor(p,g?.floor);if(floor.normalNative)for(const [i,k]of ['x','y','z'].entries())ss(0x760+i*4,floor.normalNative[k]);
  const shore=queryNativeShorePoint(p,g?.shore);if(shore.normalNative){ss(0x760,shore.normalNative.x);ss(0x768,shore.normalNative.z);}
  return F(shore.penetrationNative+F(floor.penetrationNative+boxes.penetrationNative))>0;
 }
 function collisionSteps(turning){
  for(let i=0;i<(turning?4:8);i++){
   if(turning){
    ss(0x770,F(rg(0x10)-20));ss(0x76c,F(F(F(F(rg(0x14)-sg(0x75c))*.25)*i)+sg(0x75c)));
    // Source13 intentionally probes interpolated Z as X and retains0774.
   }else{
    ss(0x76c,F(F(F(F(F(F(rg(0x30)*500)+rg(0xc))-sg(0x754))*.125)*i)+sg(0x754)));
    ss(0x770,F(rg(0x10)-10));ss(0x774,F(F(F(F(F(F(rg(0x38)*500)+rg(0x14))-sg(0x75c))*.125)*i)+sg(0x75c)));
   }
   if(probe()){
    rf(0xc,sg(0x754));rf(0x10,sg(0x758));
    if(turning){const vx=F(rg(0x24)*.5),vy=F(rg(0x28)*.5),vz=F(rg(0x2c)*.5);rf(0x14,sg(0x75c));rf(0x24,vx);rf(0x28,vy);rf(0x2c,vz);}
    else{rf(0x24,0);rf(0x14,sg(0x75c));rf(0x28,0);rf(0x2c,0);}
   }
  }
 }
 const root=selectNativePresentationAnimationRoot({...input,actorType:ri(0),animationIndex:ri(0x74),frame:ri(0x78)});
 const row=nativePresentationAnimationTransform(nativePresentationAnimationForResource(input,root.resourceIndex,root.animationIndex),root.trackOffset,root.frame).transform;
 const rootY=integer(row?.positionNative?.y,-32768,32767,'root Y'),y=rg(0x10),height=y+rootY*.1;
 rf(0x64,rg(0xc));rf(0x28,F(height-rg(0x68)));rf(0x6c,rg(0x14));rf(0x68,F(height));byte(0x66d,water()<rg(0x68)?0:1);
 ss(0x668,F(length(F(rg(0x64)-sg(0x6bc)),F(rg(0x6c)-sg(0x6c4)))/100));byte(0x66e,Math.trunc(F(F(length(rg(0x24),rg(0x2c))/90)*120)));
 const p=phase(rg(0x18),true);rf(0x34,0);rf(0x30,sin(p+1024));rf(0x38,sin(p));
 if(integer(input.state650,-2147483648,2147483647,'main phase')!==3||integer(input.activity624,-32768,32767,'activity')!==-1)return result();
 if(ri(0x74)===0&&square(rg(0x24),rg(0x2c))>2500)rw(0x78,(ri(0x78)+1)|0);
 if(ri(0x7c)!==255){
  const l=integer(ri(0x7c),0,29,'leader')*0xbc;ss(0x758,F(get(l+0x18)-180));
  if(index>=1&&index<=3){const angle=F(sg(0x758)+(index===1?-30:index===2?30:0)),p=phase(angle,true),radius=[0,150,200,220][index];ss(0x754,F(F(sin(p+1024)*radius)+get(l+0xc)));ss(0x75c,F(F(sin(p)*radius)+get(l+0x14)));}
  rf(0x4c,F(length(F(sg(0x754)-rg(0xc)),F(sg(0x75c)-rg(0x14)))/10));if(rg(0x4c)>80)rf(0x4c,80);
  ss(0x760,difference(F(aim()-rg(0x18))));steer();bank();smoothSpeed(rg(0x4c));move(sg(0x764));animate();return result();
 }
 const mode=ri(8);
 if(mode===1){
  ss(0x754,node(0));const h=water(rg(0x64),rg(0x6c));ss(0x75c,node(8));ss(0x758,F(h+F(node(4)-20)));regionTargets(0x754,0x75c,true);
  ss(0x760,difference(F(aim()-rg(0x18))));steer();bank();rf(0x10,F(rg(0x10)+.03*F(sg(0x758)-rg(0x10))));
  ss(0x76c,F(.2));ss(0x770,length(F(rg(0xc)-sg(0x6bc)),F(rg(0x14)-sg(0x6c4))));
  if(sg(0x770)<1000){const clock=input.actorControlWords62c4;if(!Array.isArray(clock)||clock.length!==3||!word(clock[0]))throw new RangeError('Supply dolphin frame clock');ss(0x76c,F(F(F(F(sin((clock[0]<<1)&4095)*200)+F(1000-sg(0x770)))/1000)*1.5+.2));}
  if(nodeInt(-0x6c)===9)ss(0x76c,1);if(sg(0x76c)>1.2)ss(0x76c,F(1.2));smoothSpeed(sg(0x724),sg(0x76c));if(rg(0x68)<water())move(sg(0x764));else coast();
  if(square(F(rg(0xc)-sg(0x754)),F(rg(0x14)-sg(0x75c)))<160000){
   const tick=ri(0x54);rw(0x9c,nodeInt(0xa0));if(tick>=101){rw(0x50,0);rw(0x54,0);}
   if(ri(0x9c)===3){
    if(ri(0xa4)===1){rw(0x50,3);rw(0x54,0);for(const command of prepareNativeCueAudio(2,input.audioContext?.cueBase7e05))operations.push(Object.freeze({kind:'externalCall',consumer:'800'+command.consumer,arguments:Object.freeze([...command.arguments])}));
     const count=(auxRead(0)+1)|0;auxWrite(0,count);for(const [threshold,actor]of [[3,1],[5,2],[7,3]])if(count===threshold){put(actor*0xbc,6);if(auxRead(1)<actor)auxWrite(1,actor);}
    }rw(0xa4,1);
   }
   if(nodeInt(-0x6c)===9){rw(0x74,0);rw(0x78,0);const v=integer(input.championshipCountAa00,-32768,32767,'championship count')%9;if(v>=0&&v<3)rw(0x50,17);if(v>=3&&v<6)rw(0x50,3);if(v>=6&&v<9)rw(0x50,4);rw(0x54,0);}
  }
  animate();const primaryHeading=heading(sg(0x6c8),sg(0x6d0));ss(0x75c,difference(F(-primaryHeading-heading(F(rg(0xc)-sg(0x6bc)),F(-F(rg(0x14)-sg(0x6c4)))))));
  if(Math.abs(sg(0x75c))>120||sg(0x6d4)<10||square(F(rg(0xc)-sg(0x6bc)),F(rg(0x14)-sg(0x6c4)))>4000000){rw(8,5);rw(0x50,0);nearest(0);}
  rescue();if(ri(0x74)===5)rw(0x78,(ri(0x78)+1)|0);
 }else if(mode===5){
  rw(0xa4,0);auxWrite(0,0);ss(0x764,circular(-heading(cameraField(0xf0),cameraField(0xf4))));const p=phase(sg(0x764),true);
  ss(0x754,F(F(sin(p+1024)*600)+sg(0x6bc)));ss(0x760,node(8));ss(0x75c,node(0));ss(0x758,F(F(sin(p)*600)+sg(0x6c4)));regionTargets(0x75c,0x760,false);
  ss(0x768,length(F(sg(0x754)-sg(0x75c)),F(sg(0x758)-sg(0x760))));if(sg(0x768)>500)ss(0x768,500);
  ss(0x760,circular(heading(F(sg(0x75c)-sg(0x754)),F(-F(sg(0x760)-sg(0x758))))));
  if(difference(F(sg(0x760)-sg(0x764)))>90)ss(0x760,circular(F(sg(0x764)+90)));if(difference(F(sg(0x760)-sg(0x764)))< -90)ss(0x760,circular(F(sg(0x764)-90)));
  const targetPhase=phase(sg(0x760),true),radius=sg(0x768);ss(0x754,F(F(sin(targetPhase+1024)*radius)+sg(0x754)));ss(0x75c,F(F(sin(targetPhase)*radius)+sg(0x758)));ss(0x758,F(water(sg(0x754),sg(0x75c))-20));
  ss(0x760,difference(F(aim()-rg(0x18))));if(ri(0x74)!==5)steer();rf(0x10,F(rg(0x10)+.03*F(sg(0x758)-rg(0x10))));
  ss(0x76c,F(sg(0x6d4)/sg(0x724)));ss(0x770,length(F(rg(0xc)-sg(0x754)),F(rg(0x14)-sg(0x75c))));if(sg(0x770)<2000)ss(0x76c,F(F(sg(0x770)/2000)*1.2+sg(0x76c)));
  if(ri(0x74)===5&&[35,45].includes(ri(0x78))&&integer(input.mode620,-2147483648,2147483647,'race mode')===4)byte(0x670,10);
  if(square(F(rg(0xc)-sg(0x754)),F(rg(0x14)-sg(0x75c)))<2500){ss(0x76c,0);if(!nativeDolphinPositionBlocked({x:rg(0xc),z:rg(0x14)})&&ri(0x74)!==5){rw(0x74,5);rw(0x78,0);}
   rf(0x18,circular(F(difference(F(heading(F(rg(0xc)-sg(0x6bc)),F(-F(rg(0x14)-sg(0x6c4))))-rg(0x18)))*.1+rg(0x18))));
  }else rw(0x50,0);
  if(ri(0x74)!==5)bank();else{rf(0x1c,0);rf(0x20,0);}if(sg(0x76c)>1.5)ss(0x76c,1.5);smoothSpeed(sg(0x724),sg(0x76c));
  ss(0x754,rg(0xc));ss(0x758,rg(0x10));ss(0x75c,rg(0x14));if(rg(0x68)<water())move(sg(0x764));else coast();collisionSteps(false);animate();
  ss(0x754,length(F(rg(0xc)-node(0)),F(rg(0x14)-node(8))));const dist=sg(0x754);
  if(dist<1000&&sg(0x6d4)>11){rw(8,1);rw(0x50,0);rw(0x9c,nodeInt(0xa0));}if(dist>3000)nearest(64);rescue();
 }else if(mode===13){
  ss(0x754,difference(F(rg(0x8c)-rg(0x18))));if(sg(0x754)>=10)rf(0x18,circular(F(rg(0x18)+10)));if(sg(0x754)<=-10)rf(0x18,circular(F(rg(0x18)-10)));
  bank();ss(0x76c,length(rg(0x24),rg(0x2c)));if(sg(0x76c)>100)ss(0x76c,100);animate();if(Math.abs(sg(0x754))<10)rw(8,5);
  ss(0x754,rg(0xc));ss(0x758,rg(0x10));ss(0x75c,rg(0x14));move(sg(0x76c));collisionSteps(true);
 }
 return result();
 function result(){return Object.freeze({actorWordsF060:Object.freeze(pool),actorControlWords62d0:aux===undefined?undefined:Object.freeze(aux),operations:Object.freeze(operations)});}
}
