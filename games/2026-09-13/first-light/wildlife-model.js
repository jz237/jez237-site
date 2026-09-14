// The living lake, as small state machines: a heron on the bank that lifts off when the kayak comes
// close and comes back later, skeins of geese that cross the cove in the low light, swallows
// skimming the water at dawn and dusk, a haze of insects over the water, and fish rising at dusk.
// Pure and node-tested; wildlife.js gives them bodies.
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),smooth=(a,b,v)=>{const x=clamp((v-a)/(b-a),0,1);return x*x*(3-2*x);};
export const HERON={spookDist:22,takeoffSeconds:.9,flightSeconds:20,returnSeconds:240,speed:7,climb:.9};
export function createHeron(perch){return {state:'standing',t:0,x:perch.x,y:perch.y,z:perch.z,perch:{...perch},heading:perch.heading||0,headTurn:0,nextTurn:3,goneAt:0,wing:0};}
export function stepHeron(h,dt,{kayak,t,random=Math.random}){
 const events=[];h.t+=dt;const d=kayak?Math.hypot(kayak.x-h.x,kayak.z-h.z):1e9;
 switch(h.state){
  case 'standing':{h.nextTurn-=dt;if(h.nextTurn<=0){h.headTurn=(random()-.5)*1.4;h.nextTurn=2.5+random()*5;}
   if(d<HERON.spookDist){h.state='takeoff';h.t=0;h.heading=Math.atan2(h.x-(kayak?kayak.x:h.x-1),h.z-(kayak?kayak.z:h.z-1));events.push('takeoff');}break;}
  case 'takeoff':{h.wing=Math.sin(h.t*14)*.9;if(h.t>HERON.takeoffSeconds){h.state='flying';h.t=0;}break;}
  case 'flying':{const s=HERON.speed;h.x+=Math.sin(h.heading)*s*dt;h.z+=Math.cos(h.heading)*s*dt;h.y+=HERON.climb*dt*(h.t<8?1:.15);h.heading+=Math.sin(h.t*.4)*.25*dt;h.wing=Math.sin(h.t*7)*.8;
   if(h.t>HERON.flightSeconds){h.state='gone';h.goneAt=t;}break;}
  case 'gone':{if(t-h.goneAt>HERON.returnSeconds&&d>HERON.spookDist*1.5){h.state='standing';h.t=0;h.x=h.perch.x;h.y=h.perch.y;h.z=h.perch.z;h.heading=h.perch.heading||0;h.wing=0;events.push('returned');}break;}
 }
 return events;
}
export const GEESE={count:7,height:38,speed:11,every:[240,600],range:520};
export function createGeese(){return {active:false,nextAt:90,x:0,z:0,y:GEESE.height,heading:0,flown:0,flap:0};}
export function stepGeese(g,dt,{t,elevation,cove,random=Math.random}){
 const events=[];const lowLight=elevation>-8&&elevation<16;
 if(!g.active){if(lowLight&&t>=g.nextAt){const a=random()*6.283;g.x=cove.x+Math.cos(a)*GEESE.range/2;g.z=cove.z+Math.sin(a)*GEESE.range/2;g.heading=Math.atan2(cove.x-g.x,cove.z-g.z)+(random()-.5)*.6;g.y=GEESE.height*(.8+random()*.5);g.flown=0;g.active=true;events.push('geese');}else if(!lowLight&&t>=g.nextAt)g.nextAt=t+60;return events;}
 g.x+=Math.sin(g.heading)*GEESE.speed*dt;g.z+=Math.cos(g.heading)*GEESE.speed*dt;g.flown+=GEESE.speed*dt;g.flap+=dt*5.5;
 if(g.flown>GEESE.range){g.active=false;g.nextAt=t+GEESE.every[0]+random()*(GEESE.every[1]-GEESE.every[0]);}
 return events;
}
// the V: offsets behind and beside the lead bird
export function skeinOffsets(n=GEESE.count){const out=[];for(let i=0;i<n;i++){const k=Math.ceil(i/2),side=i===0?0:(i%2?1:-1);out.push({back:k*3.2,side:side*k*2.4,drop:k*.3});}return out;}
export function swallowDensity(elevation,wind){return hump(elevation,-6,2,18)*(1-clamp(wind,0,1)*.6);}
export function swallowPos(i,t,c){const p=i*1.37;return {x:c.x+18*Math.sin(t*.31+p)+6*Math.sin(t*1.7+p*2.3),z:c.z+18*Math.cos(t*.27+p*1.1)+6*Math.cos(t*1.9+p),y:.35+.4*Math.abs(Math.sin(t*2.3+p))};}
export function insectDensity(elevation,wind){return (1-smooth(2,14,elevation))*smooth(-9,-4,elevation)*(1-clamp(wind,0,1)*.8);}
export function riseDue(state,t,elevation,random=Math.random){const dusk=hump(elevation,-6,1,14);if(dusk<=0)return false;if(t<state.nextAt)return false;state.nextAt=t+(6+random()*10)/Math.max(.2,dusk);return true;}
function hump(v,a,p,b){return v<=a||v>=b?0:v<p?smooth(a,p,v):1-smooth(p,b,v);}
