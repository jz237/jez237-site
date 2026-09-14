const clamp=x=>Math.max(0,Math.min(1,x));
// A pressure ridge at the bow and loaded outer chine, with a ventilated aft trough.
// Shared by the water mesh and hull queries; it vanishes when the ski leaves water.
export function contactProfile(along,across,power,turn=0,bow=1,stern=1){
 const load=clamp(power),outside=Math.max(0,-across*turn);
 const bowRidge=Math.exp(-((along-1.25)**2*3+across*across*1.8))*.12*bow;
 const chine=Math.exp(-((Math.abs(across)-.72)**2)*24-(along-.15)**2*.75)*outside*.19;
 const cavity=-Math.exp(-((along+2.15)**2)*1.8-across*across*4)*.12*stern;
 return (bowRidge+chine+cavity)*load;
}
export function hullContactHeight(x,z,crafts){let h=0;for(const c of crafts){if(c.power<=0)continue;const dx=x-c.x,dz=z-c.z,s=Math.sin(c.heading),co=Math.cos(c.heading);h+=contactProfile(dx*s+dz*co,dx*co-dz*s,c.power,c.turn||0,c.bowWet??1,c.sternWet??1);}return h;}
export const hullContactGLSL=`uniform vec4 craftContact[4];
float hullContactHeight(vec2 p){float h=0.;for(int i=0;i<4;i++){
 vec4 c=craftSources[i],load=craftContact[i];if(c.w<=0.)continue;
 vec2 d=p-c.xy;float a=dot(d,vec2(sin(c.z),cos(c.z))),b=dot(d,vec2(cos(c.z),-sin(c.z)));
 float bow=exp(-((a-1.25)*(a-1.25)*3.+b*b*1.8))*.12*load.y;
 float chine=exp(-(abs(b)-.72)*(abs(b)-.72)*24.-(a-.15)*(a-.15)*.75)*max(0.,-b*load.x)*.19;
 float cavity=-exp(-(a+2.15)*(a+2.15)*1.8-b*b*4.)*.12*load.z;
 h+=(bow+chine+cavity)*clamp(c.w,0.,1.);
}return h;}`;
