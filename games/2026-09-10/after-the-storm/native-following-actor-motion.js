import {NATIVE_PRESENTATION_ACTOR_WORDS} from './native-presentation-actor-pool.js';
import {prepareNativeActorRouteMotion} from './native-actor-route-motion.js';
import {prepareNativeActorActionAnimation} from './native-actor-action-animation.js';
import {nativePresentationVectorHeading} from './native-presentation-actor-visibility.js';
const F=Math.fround,b=new DataView(new ArrayBuffer(4)),scratch=a=>a+0x10000-0xf060;
const word=v=>Number.isInteger(v)&&v>=0&&v<=0xffffffff;
function integer(v,lo,hi,name){if(!Number.isInteger(v)||v<lo||v>hi)throw new RangeError(`Invalid following actor ${name}`);return v;}
function number(w){b.setUint32(0,w);const v=b.getFloat32(0);if(!Number.isFinite(v))throw new RangeError('Nonfinite following actor input');return v;}
function wrap(v,lo,hi,inclusive){while(inclusive?v>=hi:v>hi){const n=F(v-360);if(n===v)throw new RangeError('Following actor angle cannot advance');v=n;}while(v<lo){const n=F(v+360);if(n===v)throw new RangeError('Following actor angle cannot advance');v=n;}return v;}
const difference=v=>wrap(v,-180,180,false),circular=v=>wrap(v,0,360,true);
/** Complete A9130 mirrored/synchronized followers and AB25C formation motion.
 * Selected route and action updates execute inline; the caller owns the live
 * course resources, water, camera and frame clock. */
export function prepareNativeFollowingActorMotion(input){
 const source=input?.actorWordsF060;
 if(!Array.isArray(source)||source.length!==NATIVE_PRESENTATION_ACTOR_WORDS||Array.from(source).some(w=>!word(w)))throw new RangeError('Supply complete following actor pool');
 let pool=[...source];const operations=[],index=integer(input.actorIndex,0,29,'index'),base=index*0xbc;
 const get=o=>number(pool[o/4]),rg=o=>get(base+o),ri=o=>pool[(base+o)/4]|0,sg=a=>get(scratch(a));
 function put(o,v){pool[o/4]=v>>>0;operations.push(Object.freeze({kind:'presentationActorWrite',byteOffset:o,width:4,value:v>>>0}));}
 function sf(o,v){v=F(v);if(!Number.isFinite(v))throw new RangeError('Nonfinite following actor result');b.setFloat32(0,v);put(o,b.getUint32(0));}
 const rw=(o,v)=>put(base+o,v),rf=(o,v)=>sf(base+o,v),ss=(a,v)=>sf(scratch(a),v);
 function expand(q){pool=[...q.actorWordsF060];operations.push(...q.operations);}
 function route(arrivalRadiusNative){expand(prepareNativeActorRouteMotion({...input,actorWordsF060:pool,arrivalRadiusNative}));}
 const animate=()=>expand(prepareNativeActorActionAnimation({...input,actorWordsF060:pool}));
 const leader=()=>integer(ri(0x7c),0,29,'leader index')*0xbc;
 function sin(i){const a=input.sineTableWords4350;if(!Array.isArray(a)||a.length!==4096||!word(a[i&4095]))throw new RangeError('Supply original following actor sine table');return number(a[i&4095]);}
 if(!['800a9130','800ab25c'].includes(input.entry))throw new RangeError('Unknown following actor entry');
 if(integer(input.state650,-2147483648,2147483647,'main phase')!==3)return result();
 if(integer(input.activity624,-32768,32767,'activity')!==-1)return result();
 if(input.entry==='800a9130'){
  const mode=ri(8);
  if(mode===1){
   route(200);
   const nextLap=((pool[scratch(0x738)/4]|0)+1)|0;
   if(nextLap===integer(input.configuredLaps728,-2147483648,2147483647,'configured laps')){
    if(index===0){rw(0x9c,0);rw(8,11);rw(0,6);rf(0x14,4000);rf(0xc,6000);rf(0x18,90);rf(0x4c,25);}
    if(index===1){rw(8,12);rw(0,6);rw(0x7c,0);}
    if(index===2){rw(0x7c,0);rf(0x14,4000);rw(8,2);rw(0,6);rf(0xc,4800);rf(0x18,180);}
   }
  }else if(mode===11)route(100);
  else if(mode===12){
   const l=leader();rf(0xc,F(get(l+0xc)+50));put(base+0x10,pool[(l+0x10)/4]);rf(0x14,F(4000-F(get(l+0x14)-4000)));
   rf(0x18,-get(l+0x18));put(base+0x1c,pool[(l+0x1c)/4]);put(base+0x20,pool[(l+0x20)/4]);
  }else if(mode===2){
   const l=leader();let waypoint=pool[(l+0x9c)/4]|0;
   if((waypoint===0||waypoint===5)&&(pool[(l+0x54)/4]|0)===1){rw(0x50,14);rw(0x54,0);rw(0x78,0);rw(0x74,0);waypoint=pool[(l+0x9c)/4]|0;}
   if(waypoint===1||waypoint===6){rw(0x50,0);rw(0x54,0);rw(0x74,6);rw(0x78,10);}
   animate();
  }else if(mode===5)route(200);
 }else if(ri(0x7c)===255){if(ri(8)===1)route(200);}
 else{
  const l=leader();ss(0x758,F(get(l+0x18)-180));
  if(index===1||index===2){
   const phase=Math.trunc(F(F(F(sg(0x758)+(index===1?-20:20))/360)*4096));
   const clock=input.actorControlWords62c4;
   if(!Array.isArray(clock)||clock.length!==3||!word(clock[0]))throw new RangeError('Supply following actor control clock');
   const radius=F(400+F(200*sin((clock[0]<<1)&4095)));
   ss(0x754,F(F(sin(phase+1024)*radius)+get(l+0xc)));ss(0x75c,F(F(sin(phase)*radius)+get(l+0x14)));
   const tick=index===1?50:55;
   for(const action of [15,16])if((pool[(l+0x50)/4]|0)===action&&(pool[(l+0x54)/4]|0)===tick){rw(0x50,action);rw(0x54,0);}
  }
  const length=(x,z)=>F(Math.sqrt(F(F(x*x)+F(z*z))));
  const aim=()=>nativePresentationVectorHeading(F(sg(0x754)-rg(0xc)),F(-F(sg(0x75c)-rg(0x14))),input.angleTableWords6f08);
  rf(0x4c,F(length(F(sg(0x754)-rg(0xc)),F(sg(0x75c)-rg(0x14)))/10));if(rg(0x4c)>80)rf(0x4c,80);
  ss(0x760,difference(F(aim()-rg(0x18))));const error=sg(0x760);
  if(error>=2){rf(0x18,circular(F(rg(0x18)+2)));if(error>45)rf(0x18,circular(F(rg(0x18)+5)));}
  if(error<=-2){rf(0x18,circular(F(rg(0x18)-2)));if(error< -45)rf(0x18,circular(F(rg(0x18)-5)));}
  if(Math.abs(error)<2)rf(0x18,circular(aim()));
  rf(0x1c,0);ss(0x768,length(rg(0x24),rg(0x2c)));
  const desired=F(rg(0x4c)*F(F(180-Math.abs(error))/180));ss(0x764,F(F(desired-sg(0x768))*.15+sg(0x768)));
  const phase=Math.trunc(F(F(rg(0x18)*4096)/360)),x=F(sin(phase+1024)*sg(0x764)),z=F(sin(phase)*sg(0x764));
  rf(0x24,x);rf(0xc,F(rg(0xc)+x));rf(0x2c,z);rf(0x14,F(rg(0x14)+z));animate();
 }
 return result();
 function result(){return Object.freeze({actorWordsF060:Object.freeze(pool),operations:Object.freeze(operations)});}
}
