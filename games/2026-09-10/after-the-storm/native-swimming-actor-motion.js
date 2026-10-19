import {NATIVE_PRESENTATION_ACTOR_WORDS} from './native-presentation-actor-pool.js';
import {nativePresentationVectorHeading} from './native-presentation-actor-visibility.js';
const F=Math.fround,b=new DataView(new ArrayBuffer(4)),scratch=a=>a+0x10000-0xf060;
const word=v=>Number.isInteger(v)&&v>=0&&v<=0xffffffff;
const number=w=>{b.setUint32(0,w);return b.getFloat32(0);};
const freeze=v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
function words(a,n,name){if(!Array.isArray(a)||a.length!==n||Array.from(a).some(w=>!word(w)))throw new RangeError(`Supply ${name}[${n}]`);return [...a];}
function integer(v,lo,hi,name){if(!Number.isInteger(v)||v<lo||v>hi)throw new RangeError(`Invalid ${name}`);return v;}
function circular(v){while(v>=360){const next=F(v-360);if(next===v)throw new RangeError('Actor angle cannot advance');v=next;}while(v<0){const next=F(v+360);if(next===v)throw new RangeError('Actor angle cannot advance');v=next;}return v;}
function difference(v){while(v>180){const next=F(v-360);if(next===v)throw new RangeError('Actor angle cannot advance');v=next;}while(v< -180){const next=F(v+360);if(next===v)throw new RangeError('Actor angle cannot advance');v=next;}return v;}

/** Complete A5D70 swimmer motion: orbit, approach/flee, linked actor targets,
 * original binary32 turning and binary64 speed/repositioning calculations.
 * Reads actual selected camera axes and water-range words. Uses the shared
 * 47E50 stream only when the source range check relocates an actor.
 */
export function prepareNativeSwimmingActorMotion(input){
 const actorWordsF060=words(input?.actorWordsF060,NATIVE_PRESENTATION_ACTOR_WORDS,'actorWordsF060'),operations=[];
 const actorIndex=integer(input.actorIndex,0,29,'swimming actor index'),activity=integer(input.activity624,-32768,32767,'actor activity'),base=actorIndex*0xbc;
 let rngState4640=integer(input.rngState4640,0,0xffffffff,'shared actor RNG');
 const result=()=>freeze({actorWordsF060,rngState4640,operations});
 const get=o=>{const v=number(actorWordsF060[o/4]);if(!Number.isFinite(v))throw new RangeError('Nonfinite swimming actor input');return v;};
 const rg=o=>get(base+o),sg=a=>get(scratch(a)),ri=o=>actorWordsF060[(base+o)/4]|0;
 function put(o,v){actorWordsF060[o/4]=v>>>0;operations.push({kind:'presentationActorWrite',byteOffset:o,width:4,value:v>>>0});}
 function sf(o,v){v=F(v);if(!Number.isFinite(v))throw new RangeError('Nonfinite swimming actor result');b.setFloat32(0,v);put(o,b.getUint32(0));}
 const rf=(o,v)=>sf(base+o,v),ss=(a,v)=>sf(scratch(a),v),rw=(o,v)=>put(base+o,v);
 const square=(x,z)=>F(F(x*x)+F(z*z)),length=(x,z)=>F(Math.sqrt(square(x,z)));
 const heading=(x,z)=>nativePresentationVectorHeading(x,z,input.angleTableWords6f08);
 function sin(i){const a=input.sineTableWords4350;if(!Array.isArray(a)||a.length!==4096||!word(a[i&4095]))throw new RangeError('Supply original swimmer sine table');const v=number(a[i&4095]);if(!Number.isFinite(v))throw new RangeError('Nonfinite swimmer sine');return v;}
 const phaseDivFirst=v=>Math.trunc(F(F(v/360)*4096));
 const phaseMulFirst=v=>Math.trunc(F(F(v*4096)/360));
 function random(){rngState4640=(Math.imul(rngState4640,0x41c64e6d)+12345)>>>0;operations.push({kind:'sourceWordWrite',field:'rngState4640',value:rngState4640});return rngState4640;}
 if(activity!==-1)return result();
 const mode=ri(8);
 if(mode===11){
  const a=rg(0x8c),phase=phaseDivFirst(a),radius=rg(0x70);rf(0x18,circular(F(a+90)));
  rf(0xc,F(F(sin(phase+1024)*radius)+rg(0x80)));rf(0x14,F(F(sin(phase)*radius)+rg(0x88)));rf(0x8c,F(a+.5));return result();
 }
 if(mode!==5&&mode!==10)return result();
 const camera=integer(input.cameraIndex,0,1,'swimmer camera selector'),hud=words(input.hudWords7788,1442,'hudWords7788'),at=(0x7c80+camera*0x10c-0x7788)/4;
 rw(0x74,0);ss(0x760,circular(F(-heading(number(hud[at+0xf0/4]),number(hud[at+0xf4/4])))));
 const leader=ri(0x7c);
 if(leader===255){
  const phase=phaseDivFirst(sg(0x760)),radius=F(300+F(sg(0x6d4)*10));
  ss(0x754,F(F(sin(phase+1024)*radius)+sg(0x6bc)));ss(0x75c,F(F(sin(phase)*radius)+sg(0x6c4)));
 }else{
  integer(leader,0,29,'swimmer leader');ss(0x754,get(leader*0xbc+0xc));ss(0x75c,get(leader*0xbc+0x14));
 }
 if(mode===5)ss(0x760,difference(F(heading(F(sg(0x754)-rg(0xc)),F(-F(sg(0x75c)-rg(0x14))))-rg(0x18))));
 else ss(0x760,difference(F(F(heading(F(sg(0x6bc)-rg(0xc)),F(-F(sg(0x6c4)-rg(0x14))))-rg(0x18))+180)));
 const type=ri(0);if([7,8,9,10].includes(type))ss(0x764,type===7?.5:type===9?1:F(.7));
 const error=sg(0x760),turn=sg(0x764),factor=mode===5?1:3;
 if(error>0){rf(0x18,circular(F(rg(0x18)+F(turn*factor))));if(error>45)rf(0x18,circular(F(rg(0x18)+F(turn*(factor*2)))));}
 if(error<0){rf(0x18,circular(F(rg(0x18)-F(turn*factor))));if(error< -45)rf(0x18,circular(F(rg(0x18)-F(turn*(factor*2)))));}
 ss(0x764,F(F(F(180-Math.abs(error))/180)*(mode===5?10:25)));
 const oldSpeed=length(rg(0x24),rg(0x2c));ss(0x760,oldSpeed);
 const speed=F(oldSpeed+F(sg(0x764)-oldSpeed)*.1);ss(0x764,speed);
 const phase=phaseMulFirst(rg(0x18)),dx=F(sin(phase+1024)*speed),dz=F(sin(phase)*speed),x=F(rg(0xc)+dx),z=F(rg(0x14)+dz);
 rf(0x24,dx);rf(0xc,x);rf(0x2c,dz);rf(0x14,z);
 if(ri(8)===5){const distance=square(F(x-sg(0x6bc)),F(z-sg(0x6c4))),radius=F(sg(0x6d4)*500);if(distance<F(radius*radius))rw(8,10);}
 if(ri(8)===10&&square(F(sg(0x6bc)-x),F(sg(0x6c4)-z))>1000000)rw(8,5);
 const range=words(input.waterRangeWords2428,3,'waterRangeWords2428').map(number);if(range.some(v=>!Number.isFinite(v)))throw new RangeError('Nonfinite swimmer water range');
 ss(0x754,F(range[0]-x));ss(0x758,F(range[1]-z));
 if(range[2]*.9*.9<square(sg(0x754),sg(0x758))){
  const index=random()%4095,radius=integer(input.radius4720,-2147483648,2147483647,'swimmer relocation radius')*.8;
  rf(0xc,sin(index)*radius+range[0]);rf(0x14,sin(index+1024)*radius+range[1]);rf(0x18,random()&255);
 }
 return result();
}
