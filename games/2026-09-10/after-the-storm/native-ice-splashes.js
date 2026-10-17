// AF43C queues two four-update ice emitters; AF51C shares eight particles
// with its separate global emitter. ED338 uses the canonical halfword seed.
const F=Math.fround;
function integer(v,min,max){if(!Number.isInteger(v)||v<min||v>max)throw new RangeError('Invalid splash integer');return v;}
function vector(v){if(!Array.isArray(v)||v.length!==3||v.some(x=>!Number.isFinite(x)||!Number.isFinite(F(x))))throw new TypeError('Expected finite splash vector');return v.map(F);}
function emitter(e){return {remaining:integer(e.remaining,0,0x7fffffff),position:vector(e.position)};}
function copy(input){
 if(!input||!Array.isArray(input.emitters)||input.emitters.length!==2||!Array.isArray(input.slots)||input.slots.length!==8)throw new TypeError('Expected shared splash pools');
 return {cursor:integer(input.cursor,0,7),emitterCursor:integer(input.emitterCursor,0,1),globalEmitter:emitter(input.globalEmitter),emitters:input.emitters.map(emitter),
  slots:input.slots.map(p=>{if(typeof p.active!=='boolean'||!Number.isFinite(p.scale)||!Number.isFinite(F(p.scale)))throw new TypeError('Invalid splash particle');
   return {active:p.active,age:integer(p.age,0,0xffffffff),position:vector(p.position),scale:F(p.scale)};})};
}
export function createNativeIceSplashes(){
 return {cursor:0,emitterCursor:0,globalEmitter:{remaining:0,position:[0,0,0]},emitters:Array.from({length:2},()=>({remaining:0,position:[0,0,0]})),
  slots:Array.from({length:8},()=>({active:false,age:0,position:[0,0,0],scale:0}))};
}
export function queueNativeIceSplash(input,positionNative){
 const state=copy(input);state.emitters[state.emitterCursor]={remaining:4,position:vector(positionNative)};state.emitterCursor=(state.emitterCursor+1)&1;return state;
}
export function stepNativeIceSplashes(input,seed6f00){
 const state=copy(input),emitted=[];let seed=integer(seed6f00,0,65535),randomDraws=0;
 const draw=range=>{seed=(seed*5+1)&65535;randomDraws++;return F(F(seed*range)/65536);};
 function spawn(e,isGlobal){
  if(e.remaining===0)return;e.remaining--;
  const x=draw(32),y=draw(4),z=draw(32),scale=isGlobal?F(F(e.remaining*F(.2))+F(1.2)):F(draw(2)+2);
  state.slots[state.cursor]={active:true,age:0,position:[F(x+F(e.position[0]-16)),F(y+F(e.position[1]-2)),F(z+F(e.position[2]-16))],scale};
  emitted.push(state.cursor);state.cursor=(state.cursor+1)&7;
 }
 // Source order is global first, then the two physical emitter slots.
 spawn(state.globalEmitter,true);for(const e of state.emitters)spawn(e,false);
 // Newly emitted particles age in this same call and first display at age1.
 for(const p of state.slots)if(p.active){p.age=(p.age+1)>>>0;if((p.age|0)>=8)p.active=false;}
 return {state,seed6f00:seed,randomDraws,emitted};
}
