import {NATIVE_PRESENTATION_ACTOR_WORDS} from './native-presentation-actor-pool.js';
import {nativePresentationVectorHeading} from './native-presentation-actor-visibility.js';
const F=Math.fround,b=new DataView(new ArrayBuffer(4)),scratch=a=>a+0x10000-0xf060;
const word=v=>Number.isInteger(v)&&v>=0&&v<=0xffffffff;
const number=w=>{b.setUint32(0,w);return b.getFloat32(0);};
const freeze=v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
function integer(v,lo,hi,name){if(!Number.isInteger(v)||v<lo||v>hi)throw new RangeError(`Invalid ${name}`);return v;}
function wrap(v,lo,hi,inclusive){
 while(inclusive?v>=hi:v>hi){const next=F(v-360);if(next===v)throw new RangeError('Bird angle cannot advance');v=next;}
 while(v<lo){const next=F(v+360);if(next===v)throw new RangeError('Bird angle cannot advance');v=next;}return v;
}
const circular=v=>wrap(v,0,360,true),difference=v=>wrap(v,-180,180,false);

/** Complete A9D48 perching, takeoff, burst and return motion. */
export function prepareNativePerchingBirdMotion(input){
 const source=input?.actorWordsF060;
 if(!Array.isArray(source)||source.length!==NATIVE_PRESENTATION_ACTOR_WORDS||Array.from(source).some(w=>!word(w)))
  throw new RangeError(`Supply actorWordsF060[${NATIVE_PRESENTATION_ACTOR_WORDS}]`);
 const actorWordsF060=[...source],operations=[],slot=integer(input.actorIndex,0,29,'bird actor index'),base=slot*0xbc;
 const activity=integer(input.activity624,-32768,32767,'actor activity');
 let rngState4640=integer(input.rngState4640,0,0xffffffff,'shared actor RNG');
 const result=()=>freeze({actorWordsF060,rngState4640,operations});
 const get=o=>{const v=number(actorWordsF060[o/4]);if(!Number.isFinite(v))throw new RangeError('Nonfinite bird input');return v;};
 const rg=o=>get(base+o),sg=a=>get(scratch(a)),ri=o=>actorWordsF060[(base+o)/4]|0;
 function put(o,v){actorWordsF060[o/4]=v>>>0;operations.push({kind:'presentationActorWrite',byteOffset:o,width:4,value:v>>>0});}
 function sf(o,v){v=F(v);if(!Number.isFinite(v))throw new RangeError('Nonfinite bird result');b.setFloat32(0,v);put(o,b.getUint32(0));}
 const rf=(o,v)=>sf(base+o,v),ss=(a,v)=>sf(scratch(a),v),rw=(o,v)=>put(base+o,v);
 const square=(x,z)=>F(F(x*x)+F(z*z)),length=(x,z)=>F(Math.sqrt(square(x,z)));
 function sin(i){const a=input.sineTableWords4350;if(!Array.isArray(a)||a.length!==4096||!word(a[i&4095]))throw new RangeError('Supply original bird sine table');const v=number(a[i&4095]);if(!Number.isFinite(v))throw new RangeError('Nonfinite bird sine');return v;}
 const phase=v=>Math.trunc(F(F(v*4096)/360));
 function random(){rngState4640=(Math.imul(rngState4640,0x41c64e6d)+12345)>>>0;operations.push({kind:'sourceWordWrite',field:'rngState4640',value:rngState4640});return rngState4640;}
 if(activity!==-1)return result();
 const mode=ri(8);if(![2,9,7,8].includes(mode))return result();
 const heading=(x,z)=>nativePresentationVectorHeading(x,z,input.angleTableWords6f08);
 const clearTimers=()=>{rw(0xac,0);rw(0xa8,0);rw(0xa4,0);};
 function perch(course){
  if(course===3)return [rg(0x80),rg(0x84),rg(0x88)];
  if(course!==1&&course!==4)return null;
  const gameMode=integer(input.mode620,-2147483648,2147483647,'perching bird game mode');
  if(![0,4,11].includes(gameMode))return null;
  const generic=gameMode===11,key=generic?'objectWordsC940':'buoyWordsEe20',count=generic?3136:4160,a=input[key];
  if(!Array.isArray(a)||a.length!==count)throw new RangeError(`Supply ${key}[${count}]`);
  const index=integer(ri(0x98),0,63,'perch record index'),at=index*(generic?49:65);
  const xyz=[0,1,2].map(i=>{if(!word(a[at+i]))throw new RangeError('Invalid perch position word');const v=number(a[at+i]);if(!Number.isFinite(v))throw new RangeError('Nonfinite perch position');return v;});
  if(generic)xyz[1]=F(xyz[1]+135);else if(course===1)xyz[1]=F(xyz[1]+50);
  return xyz;
 }
 if(mode===2){
  const course=integer(input.courseIndex,0,0xffffffff,'bird course'),p=perch(course);
  if(p){rf(0xc,p[0]);if(course===3){rf(0x10,p[1]);rf(0x14,p[2]);}else{rf(0x14,p[2]);rf(0x10,p[1]);}}
  rf(0x1c,0);
  ss(0x754,square(F(rg(0xc)-sg(0x6bc)),F(rg(0x14)-sg(0x6c4))));
  ss(0x758,square(F(rg(0xc)-sg(0x6f0)),F(rg(0x14)-sg(0x6f8))));
  const radiusSquared=F(rg(0x70)*rg(0x70));
  for(const [distance,x,z]of [[0x754,0x6bc,0x6c4],[0x758,0x6f0,0x6f8]])if(sg(distance)<radiusSquared){
   const angle=heading(F(rg(0xc)-sg(x)),F(-F(rg(0x14)-sg(z))));
   rf(0x18,course===3?difference(F((random()&255)-128+angle)):circular(angle));
  }
  if(sg(0x754)<radiusSquared||sg(0x758)<radiusSquared){
   rw(8,9);rw(0x74,0);rw(0x78,0);rf(0x2c,0);rf(0x24,0);rf(0x28,10);
   if(ri(0)===2)rw(0,1);if(ri(0)===4)rw(0,3);clearTimers();
  }
 }else if(mode===9){
  const y=F(rg(0x10)+rg(0x28)),animation=(ri(0x78)+3)|0,tick=(ri(0xa4)+1)|0;
  rw(0x74,1);rf(0x10,y);rw(0xa4,tick);rw(0x78,animation);if(animation>=21)rw(0x78,1);
  if(tick>=11){rw(8,7);clearTimers();}
 }else if(mode===7){
  if(square(rg(0x24),rg(0x2c))<400){const a=phase(rg(0x18));rf(0x24,F(sin(a+1024)+rg(0x24)));rf(0x2c,F(sin(a)+rg(0x2c)));}
  else{
   rf(0x24,F(F(rg(0x24)/length(rg(0x24),rg(0x2c)))*20));
   // The second normalization uses the already changed X velocity.
   rf(0x2c,F(F(rg(0x2c)/length(rg(0x24),rg(0x2c)))*20));
  }
  const x=F(rg(0xc)+rg(0x24)),y=F(rg(0x10)+rg(0x28)),z=F(rg(0x14)+rg(0x2c)),tick=(ri(0xa4)+1)|0;
  rf(0xc,x);rf(0x10,y);rw(0xa4,tick);rf(0x14,z);
  if(tick>=4){clearTimers();rw(8,8);}
 }else{
  rw(0x74,0);const p=perch(integer(input.courseIndex,0,0xffffffff,'bird course'));
  if(p){ss(0x754,p[0]);ss(0x758,p[1]);ss(0x75c,p[2]);}
  ss(0x760,difference(F(heading(F(sg(0x754)-rg(0xc)),F(-F(sg(0x75c)-rg(0x14))))-rg(0x18))));
  const error=sg(0x760);
  if(error>0){rf(0x18,F(rg(0x18)+2));if(error>45)rf(0x18,F(rg(0x18)+3));}
  if(error<0){rf(0x18,F(rg(0x18)-2));if(error< -45)rf(0x18,F(rg(0x18)-3));}
  rf(0x18,circular(rg(0x18)));rf(0x10,rg(0x10)+.05*F(sg(0x758)-rg(0x10)));
  ss(0x764,F(F(F(180-Math.abs(error))/180)*20));
  if(square(F(rg(0xc)-sg(0x754)),F(rg(0x14)-sg(0x75c)))<80000){
   ss(0x764,length(F(rg(0xc)-sg(0x754)),F(rg(0x14)-sg(0x75c)))*.005*sg(0x764));
   rf(0xc,rg(0xc)+.05*F(sg(0x754)-rg(0xc)));rf(0x14,rg(0x14)+.05*F(sg(0x75c)-rg(0x14)));
  }
  rf(0x1c,difference(F(difference(F(sg(0x760)-rg(0x1c)))*.1+rg(0x1c))));
  if(rg(0x1c)>45)rf(0x1c,45);if(rg(0x1c)< -45)rf(0x1c,-45);rf(0x1c,circular(rg(0x1c)));
  ss(0x760,length(rg(0x24),rg(0x2c)));ss(0x764,sg(0x760)+F(sg(0x764)-sg(0x760))*.1);
  if(square(rg(0x24),rg(0x2c))<900){
   const a=phase(rg(0x18)),speed=sg(0x764),dx=F(sin(a+1024)*speed),dz=F(sin(a)*speed);
   rf(0x24,dx);rf(0xc,F(rg(0xc)+dx));rf(0x2c,dz);rf(0x14,F(rg(0x14)+dz));
  }else{
   rf(0x24,F(F(rg(0x24)/length(rg(0x24),rg(0x2c)))*30));rf(0xc,F(rg(0xc)+rg(0x24)));
   rf(0x2c,F(F(rg(0x2c)/length(rg(0x24),rg(0x2c)))*30));rf(0x14,F(rg(0x14)+rg(0x2c)));
  }
  if(square(F(rg(0xc)-sg(0x754)),F(rg(0x14)-sg(0x75c)))<200){
   clearTimers();rw(8,2);if(ri(0)===1)rw(0,2);if(ri(0)===3)rw(0,4);
  }
  if(square(F(rg(0xc)-sg(0x6bc)),F(rg(0x14)-sg(0x6c4)))<4000000||square(F(rg(0xc)-sg(0x6f0)),F(rg(0x14)-sg(0x6f8)))<4000000){
   rw(8,7);clearTimers();rf(0x28,5);
  }
 }
 return result();
}

