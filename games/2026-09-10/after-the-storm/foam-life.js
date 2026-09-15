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
 // Irregular froth islands with opaque interiors and eroded edges. Tiny
 // bubbles belong inside these patches, never an all-over cellular lattice.
 vec2 warp=texture2D(foamDetailMap,q*.023).rg-.5;
 vec3 coarse=texture2D(foamDetailMap,q*.085+warp*.27).rgb;
 vec3 fine=texture2D(foamDetailMap,mat2(.8,-.6,.6,.8)*q*.43-warp*.11).rgb;
 float foamPatch=coarse.r*.67+fine.r*.33;
 float fresh=smoothstep(.40+age*.19,.57+age*.19,foamPatch);
 float grain=.60+.40*texture2D(foamDetailMap,q*.27).g;
 return mix(fresh*grain,mix(.39,.08,age),smoothstep(75.,240.,dist));
}`;
