// A cove of Lake Nockamixon (Three Mile Run arm) as an analytic surface: metres, +x east, +z south,
// water at y=0. This is a hand-built approximation for play, not surveyed bathymetry: the open lake
// lies to the south-west, the creek mouth to the north-east, a steep wooded north shore with a
// riprap point, a gentle south shore with a gravel flat, dock and weed bed, a mid-cove hump and
// the old creek channel meandering along the bottom.
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),smooth=(a,b,v)=>{const x=clamp((v-a)/(b-a),0,1);return x*x*(3-2*x);},lerp=(a,b,t)=>a+(b-a)*t;
function hash(x,z){const s=Math.sin(x*127.1+z*311.7)*43758.5453;return s-Math.floor(s);}
export function noise(x,z){const ix=Math.floor(x),iz=Math.floor(z),fx=x-ix,fz=z-iz,ux=fx*fx*(3-2*fx),uz=fz*fz*(3-2*fz);return lerp(lerp(hash(ix,iz),hash(ix+1,iz),ux),lerp(hash(ix,iz+1),hash(ix+1,iz+1),ux),uz);}
export const AXIS_START={x:-210,z:150},AXIS_END={x:190,z:-150};
export const AXIS_LENGTH=Math.hypot(AXIS_END.x-AXIS_START.x,AXIS_END.z-AXIS_START.z);
const ux=(AXIS_END.x-AXIS_START.x)/AXIS_LENGTH,uz=(AXIS_END.z-AXIS_START.z)/AXIS_LENGTH,vx=-uz,vz=ux;
// u runs along the cove from the open lake (0) to the creek mouth (AXIS_LENGTH); v>0 is the south-east shore.
export function coveFrame(x,z){const dx=x-AXIS_START.x,dz=z-AXIS_START.z;return {u:dx*ux+dz*uz,v:dx*vx+dz*vz};}
export function worldFromFrame(u,v){return {x:AXIS_START.x+u*ux+v*vx,z:AXIS_START.z+u*uz+v*vz};}
export function halfWidth(u,side=1){
 const t=clamp(u/AXIS_LENGTH,0,1);let w=150-110*t*t+18*Math.sin(u*.021+1.3)+9*Math.sin(u*.053);
 if(u<0)w+=-u*.9;
 if(side<0)w-=28*Math.exp(-((u-120)*(u-120))/1800); // the riprap point pushes the north shore out
 return Math.max(30,w);
}
export function depthProfile(u){const t=clamp(u/AXIS_LENGTH,0,1);return u<0?11+Math.min(4,-u*.02):lerp(11,1.0,t*t*(3-2*t));}
export function channelOffset(u){return .22*Math.sin(u/85+.4);}
export function coveHeight(x,z){
 const {u,v}=coveFrame(x,z),side=v<0?-1:1,w=halfWidth(u,side),s=Math.abs(v)/w;
 const t=clamp(u/AXIS_LENGTH,0,1);
 // bowl: the north wall is steep with a flat floor, the south side shelves gently
 const bowl=side<0?Math.pow(clamp(1-Math.pow(s,3.2),0,1),.6):Math.pow(clamp(1-Math.pow(s,1.6),0,1),1);
 let depth=depthProfile(u)*bowl;
 const vc=channelOffset(u)*w,channel=2.6*Math.exp(-((v-vc)*(v-vc))/242)*(1-t*.85)*smooth(1,.8,s);
 depth+=channel;
 depth-=5.5*Math.exp(-((u-210)*(u-210)+(v+22)*(v+22))/2048); // mid-cove hump
 const flat=smooth(60,90,u)*(1-smooth(215,245,u))*smooth(.3,.45,v/w)*(1-smooth(.82,.95,v/w));
 depth=lerp(depth,3+.6*noise(x*.03,z*.03),flat*.85); // the south weed flat
 depth+=.35*noise(x*.05,z*.05)+.12*noise(x*.2,z*.2)-.2;
 if(u>AXIS_LENGTH)depth=lerp(depth,.6,smooth(0,60,u-AXIS_LENGTH)); // the creek runs on, shallow
 depth=Math.max(depth,.15);
 const dist=Math.abs(v)-w;
 let land=side<0?.35+dist*.42+14*smooth(40,110,dist):.25+dist*.11+6*smooth(60,140,dist);
 land+=3.5*noise(x*.011+3,z*.011)*clamp(dist/30,0,1)+.6*noise(x*.07,z*.07);
 if(u>AXIS_LENGTH+40)land=Math.max(land,.3+(u-AXIS_LENGTH-40)*.04);
 return lerp(-depth,Math.min(land,40),smooth(-3,3,dist));
}
export function isWater(x,z){return coveHeight(x,z)<0;}
// Points the cover generator anchors to. u along the cove, side -1 north / +1 south.
export const COVE_FEATURES={
 dock:{u:150,side:1},laydowns:[{u:62,side:-1,yaw:.5},{u:236,side:1,yaw:-.4}],riprap:{u:120,side:-1,length:70},
 weedFlat:{u0:70,u1:230,side:1},lilyPads:{u0:330,u1:AXIS_LENGTH+30},hump:{u:210,v:-22},launch:{u:20,side:1},
 stumps:[{u:300,v:6},{u:318,v:-9},{u:340,v:14}]
};
export function shorePoint(u,side,inset=0){const w=halfWidth(u,side);return worldFromFrame(u,side*(w-inset));}
