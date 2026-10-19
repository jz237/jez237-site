import {NATIVE_PRESENTATION_ACTOR_WORDS} from './native-presentation-actor-pool.js';
import {nativePresentationVectorHeading} from './native-presentation-actor-visibility.js';
import {prepareNativeActorActionAnimation} from './native-actor-action-animation.js';
const F=Math.fround,b=new DataView(new ArrayBuffer(4)),scratch=a=>a+0x10000-0xf060;
const word=v=>Number.isInteger(v)&&v>=0&&v<=0xffffffff;
function integer(v,lo,hi,name){if(!Number.isInteger(v)||v<lo||v>hi)throw new RangeError(`Invalid actor route ${name}`);return v;}
function number(w){b.setUint32(0,w);const v=b.getFloat32(0);if(!Number.isFinite(v))throw new RangeError('Nonfinite actor route input');return v;}
function wrap(v,lo,hi,inclusive){while(inclusive?v>=hi:v>hi){const n=F(v-360);if(n===v)throw new RangeError('Actor route angle cannot advance');v=n;}while(v<lo){const n=F(v+360);if(n===v)throw new RangeError('Actor route angle cannot advance');v=n;}return v;}
const difference=v=>wrap(v,-180,180,false),circular=v=>wrap(v,0,360,true);
/** Complete A52D8 followed by its mandatory A2B24 action update. routeWords is
 * the actual selected E6C78 table: link words, X/Z, speed, action, rider radius.
 * The last five entries are float words; negative speed/action values encode
 * source behaviors and must not be coerced to integer selectors. */
export function prepareNativeActorRouteMotion(input){
 const source=input?.actorWordsF060;
 if(!Array.isArray(source)||source.length!==NATIVE_PRESENTATION_ACTOR_WORDS||Array.from(source).some(w=>!word(w)))throw new RangeError('Supply complete actor route pool');
 const pool=[...source],operations=[],base=integer(input.actorIndex,0,29,'actor index')*0xbc;
 const get=o=>number(pool[o/4]),rg=o=>get(base+o),sg=a=>get(scratch(a)),ri=o=>pool[(base+o)/4]|0;
 function put(o,v){pool[o/4]=v>>>0;operations.push(Object.freeze({kind:'presentationActorWrite',byteOffset:o,width:4,value:v>>>0}));}
 function sf(o,v){v=F(v);if(!Number.isFinite(v))throw new RangeError('Nonfinite actor route result');b.setFloat32(0,v);put(o,b.getUint32(0));}
 const rf=(o,v)=>sf(base+o,v),rw=(o,v)=>put(base+o,v),ss=(a,v)=>sf(scratch(a),v);
 const square=(x,z)=>F(F(x*x)+F(z*z)),length=(x,z)=>F(Math.sqrt(square(x,z)));
 function route(index){const a=input.routeWords;if(!Array.isArray(a)||!a.length||a.length%7)throw new RangeError('Supply selected actor routeWords');integer(index,0,a.length/7-1,'row index');const row=a.slice(index*7,index*7+7);if(row.some(w=>!word(w)))throw new RangeError('Invalid actor route word');return row;}
 function sin(i){const a=input.sineTableWords4350;if(!Array.isArray(a)||a.length!==4096||!word(a[i&4095]))throw new RangeError('Supply original actor route sine table');return number(a[i&4095]);}
 const heading=(x,z)=>nativePresentationVectorHeading(x,z,input.angleTableWords6f08),aim=()=>heading(F(sg(0x754)-rg(0xc)),F(-F(sg(0x75c)-rg(0x14))));
 if(ri(0x9c)>=0){const row=route(ri(0x9c));ss(0x754,number(row[2]));ss(0x75c,number(row[3]));}
 else{
  ss(0x758,difference(heading(F(rg(0xc)-rg(0x80)),F(-F(rg(0x14)-rg(0x88))))));
  // This orbit target divides first; actual travel below multiplies first.
  const phase=Math.trunc(F(F(sg(0x758)/360)*4096));
  ss(0x754,F(F(sin(phase+1024)*rg(0x70))+sg(0x6bc)));ss(0x75c,F(F(sin(phase)*rg(0x70))+sg(0x6c4)));
  rf(0x4c,F(length(F(sg(0x754)-rg(0xc)),F(sg(0x75c)-rg(0x14)))/10));if(rg(0x4c)>70)rf(0x4c,70);
 }
 ss(0x760,difference(F(aim()-rg(0x18))));const error=sg(0x760),special=ri(0)===12,step=special?.5:2,extra=special?2:5;
 if(error>=step){rf(0x18,circular(F(rg(0x18)+step)));if(error>45)rf(0x18,circular(F(rg(0x18)+extra)));}
 if(error<=-step){rf(0x18,circular(F(rg(0x18)-step)));if(error< -45)rf(0x18,circular(F(rg(0x18)-extra)));}
 if(Math.abs(error)<step)rf(0x18,circular(aim()));
 rf(0x1c,difference(F(difference(F(F(error/3)-rg(0x1c)))*.1+rg(0x1c))));
 if(rg(0x1c)>45)rf(0x1c,45);if(rg(0x1c)< -45)rf(0x1c,-45);rf(0x1c,circular(rg(0x1c)));
 ss(0x768,length(rg(0x24),rg(0x2c)));if(special)rf(0x20,F(sg(0x768)/7));
 const desired=F(rg(0x4c)*F(F(180-Math.abs(sg(0x760)))/180));ss(0x764,F(desired-sg(0x768))*.15+sg(0x768));
 const threshold=F(input.arrivalRadiusNative);if(typeof input.arrivalRadiusNative!=='number'||!Number.isFinite(threshold))throw new RangeError('Supply finite actor route arrival radius');
 function move(){const phase=Math.trunc(F(F(rg(0x18)*4096)/360)),speed=sg(0x764),dx=F(sin(phase+1024)*speed),dz=F(sin(phase)*speed);rf(0x24,dx);rf(0xc,F(rg(0xc)+dx));rf(0x2c,dz);rf(0x14,F(rg(0x14)+dz));}
 if(square(F(rg(0xc)-sg(0x754)),F(rg(0x14)-sg(0x75c)))<F(threshold*threshold)&&ri(0x9c)>=0){
  const row=route(ri(0x9c));
  if(length(F(rg(0xc)-sg(0x6bc)),F(rg(0x14)-sg(0x6c4)))<number(row[6])){
   move();const action=number(row[5]),speed=number(row[4]);
   if(action> -1){rw(0x54,0);rw(0x50,integer(Math.trunc(action),-2147483648,2147483647,'action conversion'));}
   if(speed!==-1)rf(0x4c,speed);
   if(speed===-2){rf(0x4c,sg(0x6d4));if(rg(0x4c)<30)rf(0x4c,30);}
   if(speed===-3){rf(0x4c,sg(0x6d4)+10);if(rg(0x4c)<40)rf(0x4c,40);}
   if(speed===-4){rf(0x4c,sg(0x6d4)+20);if(rg(0x4c)<50)rf(0x4c,50);}
   if(action===-2){const next=route(row[0]|0);rf(0xc,number(next[2]));rf(0x14,number(next[3]));}
   const reverse=integer(input.reverse,-32768,32767,'reverse halfword');rw(0x9c,reverse===1&&ri(0)===5?row[1]:row[0]);
  }
 }else move();
 const animation=prepareNativeActorActionAnimation({...input,actorWordsF060:pool});
 return Object.freeze({actorWordsF060:animation.actorWordsF060,operations:Object.freeze([...operations,...animation.operations])});
}
