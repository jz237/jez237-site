// Two-stage beach drying. Surface film drains quickly; absorbed moisture lasts
// longer. Linear moisture loss reaches truly dry rather than fading forever.
export const WET_SAND={dryRate:.034,filmDrain:.85,contactStart:.015,contactEnd:.12};
const smooth=(a,b,v)=>{const x=Math.max(0,Math.min(1,(v-a)/(b-a)));return x*x*(3-2*x);};
export function stepWetSand(moisture,film,depth,dt,drainage=1){
 if(dt<=0)return {moisture,film};
 const contact=smooth(WET_SAND.contactStart,WET_SAND.contactEnd,depth);
 const wet=Math.max(0,moisture-dt*WET_SAND.dryRate*drainage,contact);
 return {moisture:wet,film:Math.min(wet,Math.max(film*Math.exp(-dt*WET_SAND.filmDrain*drainage),contact))};
}
export const wetSandGLSL=`
vec2 wetSandStep(vec2 previous,float depth,float dt,float drainage){
 float contact=smoothstep(${WET_SAND.contactStart},${WET_SAND.contactEnd},depth);
 float moisture=max(max(0.,previous.x-dt*${WET_SAND.dryRate}*drainage),contact);
 float film=min(moisture,max(previous.y*exp(-dt*${WET_SAND.filmDrain}*drainage),contact));
 return vec2(moisture,film);
}`;
