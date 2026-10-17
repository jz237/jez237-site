import {prepareNativeMathRand} from './native-race-speed-display.js';

// Numeric reconstruction of B4750/B4788/B490C/B49C4. Positions and velocities
// stay in source units; the caller owns the shared ED304/ED338 halfword seed.
// Variant numbers identify eight pieces, not original display-list assets.
const F=Math.fround,COUNT=16;
const offsets=[[-18.01,-25.4,-17.09],[-22.05,24.17,-17.21],[13.67,32,-13.67],
 [19.99,-15.4,-22.43],[16.67,24.5,10.67],[11.39,-20.76,22.76],
 [-22.8,24.4,6.4],[-24.29,2.59,28.3]].map(v=>v.map(F));
function integer(n,min,max){if(!Number.isInteger(n)||n<min||n>max)throw new RangeError('Invalid native fragment integer');return n;}
function vector(v){if(!Array.isArray(v)||v.length!==3||v.some(x=>!Number.isFinite(x)||!Number.isFinite(F(x))))throw new TypeError('Expected finite native fragment vector');return v.map(F);}
function copy(state){
 if(!state||!Array.isArray(state.slots)||state.slots.length!==COUNT)throw new TypeError('Expected sixteen native fragment slots');
 return {cursor:integer(state.cursor,0,COUNT-1),slots:state.slots.map(s=>{
  if(typeof s.active!=='boolean')throw new TypeError('Expected fragment activity flag');
  return {active:s.active,age:integer(s.age,0,0xffffffff),position:vector(s.position),velocity:vector(s.velocity),variant:integer(s.variant,-1,7)};
 })};
}
export function createNativeIceFragments(){
 return {cursor:0,slots:Array.from({length:COUNT},()=>({active:false,age:0,position:[0,0,0],velocity:[0,0,0],variant:-1}))};
}
export function resetNativeIceFragments(input){
 const state=copy(input);state.cursor=0;for(const s of state.slots)s.active=false;return state;
}
export function spawnNativeIceFragments(input,{positionNative,velocityNative,seed6f00}={}){
 const state=copy(input),position=vector(positionNative),velocity=vector(velocityNative);
 let seed=integer(seed6f00,0,65535);
 for(let variant=0;variant<offsets.length;variant++){
  const offset=offsets[variant];
  // ED338(8) advances the same seed; its float return is discarded before
  // sqrt. Skipping this draw would change the later vertical launch speed.
  seed=(seed*5+1)&65535;
  const length=F(Math.sqrt(F(F(offset[0]*offset[0])+F(offset[2]*offset[2])))),factor=length>0?F(12/length):length;
  const draw=prepareNativeMathRand({seed6f00:seed,argumentU32:12});seed=draw.operations[0].value;
  state.slots[state.cursor]={active:true,age:0,position:offset.map((v,i)=>F(position[i]+v)),
   velocity:[F(F(offset[0]*factor)+velocity[0]),F(F(draw.value+8)+velocity[1]),F(F(offset[2]*factor)+velocity[2])],variant};
  state.cursor=(state.cursor+1)&15;
 }
 // B490C separately requests AF43C at centerY+24. Its two-slot sprite
 // lifecycle and rendering are outside this fragment owner.
 return {state,seed6f00:seed,randomDraws:16,splashPositionNative:[position[0],F(position[1]+24),position[2]]};
}
export function stepNativeIceFragments(input){
 const state=copy(input);
 for(const s of state.slots)if(s.active){
  s.position=s.position.map((v,i)=>F(v+s.velocity[i]));
  s.velocity[1]=F(s.velocity[1]-6);s.age=(s.age+1)>>>0;
  if(s.position[1]<-128)s.active=false;
 }
 return state;
}
