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

/** Complete BF8C8 bird ambience producer. 8004562C is the existing audio
 * timing/random word, separate from the shared gameplay47E50 random stream.
 * C53D4 commands are queued effects; preparation never plays audio. */
export function prepareNativeCourseBirdAudio({random4562c}={}){
 integer(random4562c,0,0xffffffff,'bird audio timing word');
 const operations=[];
 if((random4562c&15)===0)for(const [port,value]of [[0,0xffffffff],[1,60],[2,(random4562c&0x7f0)>>>4],[3,(random4562c&0x7000)>>>12],[0,0]])
  operations.push({kind:'externalCall',consumer:'800c53d4',arguments:[0x06000700|port,value]});
 return freeze({operations});
}

/** Complete A9494 motion for course1/7 birds. Keeps original target selection,
 * odd/even turnaround choice, bank/speed smoothing, burst timing and shared
 * random-call order. Unknown courses retain the source target scratch. */
export function prepareNativeCourseBirdMotion(input){
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
 const mode=ri(8);if(mode!==1&&mode!==7)return result();
 const course=integer(input.courseIndex,0,0xffffffff,'bird course');
 if(mode===1)rw(0x74,0);
 if(course===1||course===7){
  const alternate=ri(0x9c)!==0,[x,z]=course===1?(alternate?[-3500,-1100]:[3000,1100]):(alternate?[-290,4800]:[4000,-2600]);
  ss(0x754,x);ss(0x758,rg(0x10));ss(0x75c,z);
 }
 if(mode===1){
  ss(0x760,difference(F(nativePresentationVectorHeading(F(sg(0x754)-rg(0xc)),F(-F(sg(0x75c)-rg(0x14))),input.angleTableWords6f08)-rg(0x18))));
  if(Math.abs(sg(0x760))>170)ss(0x760,slot%2?-170:170);
  const error=sg(0x760);
  if(error>0){rf(0x18,F(rg(0x18)+2));if(error>45)rf(0x18,F(rg(0x18)+3));}
  if(error<0){rf(0x18,F(rg(0x18)-2));if(error< -45)rf(0x18,F(rg(0x18)-3));}
  rf(0x18,circular(rg(0x18)));
  rf(0x10,rg(0x10)+.05*F(sg(0x758)-rg(0x10)));
  ss(0x764,F(F(F(180-Math.abs(error))/180)*30));
  rf(0x1c,difference(F(difference(F(error-rg(0x1c)))*.1+rg(0x1c))));
  if(rg(0x1c)>45)rf(0x1c,45);if(rg(0x1c)< -45)rf(0x1c,-45);rf(0x1c,circular(rg(0x1c)));
  ss(0x760,length(rg(0x24),rg(0x2c)));ss(0x764,sg(0x760)+F(sg(0x764)-sg(0x760))*.1);
  const angle=phase(rg(0x18)),speed=sg(0x764),dx=F(sin(angle+1024)*speed),dz=F(sin(angle)*speed);
  rf(0x24,dx);rf(0xc,F(rg(0xc)+dx));rf(0x2c,dz);rf(0x14,F(rg(0x14)+dz));
  if(length(F(sg(0x754)-rg(0xc)),F(sg(0x75c)-rg(0x14)))<rg(0x70)){
   rw(8,7);rw(0xa4,0);rw(0xa8,(random()&15)+10);rf(0x70,(random()&15)*10+200);
  }
  if(length(F(sg(0x6bc)-sg(0x754)),F(sg(0x6c4)-sg(0x75c)))<1000){
   rw(8,7);rw(0xa4,0);rw(0x9c,((ri(0x9c)+1)|0)%2);rw(0xa8,(random()&15)+10);
  }
  if(ri(0x78)===15)rw(0x78,0);
 }else{
  // Source deliberately supplies velocityZ twice to9D4DC here.
  if(square(rg(0x2c),rg(0x2c))<1600){const angle=phase(rg(0x18));rf(0x24,F(F(sin(angle+1024)*2)+rg(0x24)));rf(0x2c,F(F(sin(angle)*2)+rg(0x2c)));}
  rf(0xc,F(rg(0xc)+rg(0x24)));rf(0x10,F(rg(0x10)+rg(0x28)));rf(0x14,F(rg(0x14)+rg(0x2c)));
  const tick=(ri(0xa4)+1)|0;rw(0xa4,tick);
  if(tick>=ri(0xa8)){rw(0xac,0);rw(0xa8,0);rw(0xa4,0);rw(8,1);}
  if(square(F(sg(0x6bc)-sg(0x754)),F(sg(0x6c4)-sg(0x75c)))<1000000)rw(0x9c,((ri(0x9c)+1)|0)%2);
 }
 return result();
}
