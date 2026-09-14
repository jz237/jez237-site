// The lake's sound bed, as numbers: how loud each layer should be for the light, the wind and the
// boat's speed. Pure and node-tested; ambience.js plays the clips.
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),smooth=(a,b,v)=>{const x=clamp((v-a)/(b-a),0,1);return x*x*(3-2*x);};
// a hump: rises from a to peak at p, falls to zero by b
function hump(v,a,p,b){return v<=a||v>=b?0:v<p?smooth(a,p,v):1-smooth(p,b,v);}
export const LAYERS=['chorus','peepers','wind','water'];
export function ambienceMix({elevation=30,wind=0,speed=0,hour=12,master=.7}={}){
 const night=1-smooth(-10,-2,elevation);
 const chorus=hump(elevation,-7,3,18)*(hour<13?1:.55); // the dawn chorus, a quieter evening one
 const peepers=night;
 const air=.22+.78*clamp(wind,0,1);
 const water=.3+.5*clamp(wind*1.1+Math.abs(speed)*.35,0,1);
 const m=clamp(master,0,1);
 return {chorus:chorus*m,peepers:peepers*m*.8,wind:air*m*.6,water:water*m*.55};
}
