// Surface whitewater transfers into longer-lived aeration, then disappears.
// Rates are in seconds and the coupled decay is integrated analytically.
export function foamLifeStep(fresh,bubbles,source,dt){
 if(dt<=0)return [fresh,bubbles];
 const a=Math.exp(-dt*1.15),b=Math.exp(-dt*.28);
 return [Math.min(1,fresh*a+source*(1-a)/1.15),Math.min(1,bubbles*b+fresh*.72*1.15*(b-a)/.87)];
}
export const foamLifeGLSL=`vec2 foamLifeStep(vec2 old,float source,float dt){
 float a=exp(-dt*1.15),b=exp(-dt*.28);
 return min(vec2(1.),vec2(old.r*a+source*(1.-a)/1.15,old.g*b+old.r*.72*1.15*(b-a)/.87));
}`;
export const foamDetailGLSL=`
uniform sampler2D foamDetailMap;
float foamStructure(vec2 p,vec2 flow,float age,float dist){
 vec2 q=p-flow;
 vec2 warp=texture2D(foamDetailMap,q*.067).gb-.5;
 vec3 cellular=texture2D(foamDetailMap,q*.64+warp*.16).rgb;
 vec3 fine=texture2D(foamDetailMap,mat2(.8,-.6,.6,.8)*q*1.87-warp*.1).rgb;
 float lace=clamp(cellular.r*.8+fine.r*.55,0.,1.);
 float fresh=mix(.30,1.,smoothstep(.15,.8,cellular.b+fine.b*.35));
 return mix(mix(fresh,lace,age*.82),mix(.55,.22,age),smoothstep(60.,200.,dist));
}`;
