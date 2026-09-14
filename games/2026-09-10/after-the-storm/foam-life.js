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
float foamBubbles(vec2 p,float age){
 vec2 cell=floor(p),uv=fract(p)-.5;
 vec2 center=vec2(hash(cell),hash(cell+17.))*.34-.17;
 float radius=.15+hash(cell+31.)*.20,d=length(uv-center);
 float aa=max(.025,fwidth(d)*1.2);
 float ring=1.-smoothstep(aa,aa*2.5,abs(d-radius));
 return ring*smoothstep(hash(cell+61.),hash(cell+61.)+.1,age*.4)*(1.-smoothstep(.3,.9,aa));
}
float foamStructure(vec2 p,vec2 flow,float age,float dist){
 vec2 q=p-flow;
 float streak=noise(q*vec2(.85,4.8)+vec2(noise(q*.45),0.));
 float lace=smoothstep(.24,.76,streak*.6+noise(q*9.3)*.4);
 float rings=max(foamBubbles(q*32.,age),foamBubbles(q*57.+.3,age)*.45);
 float nearDetail=mix(lace,lace*.18+rings*.82*(1.-smoothstep(5.,18.,dist)),smoothstep(.25,.9,age));
 return mix(nearDetail,mix(.57,.18,age),smoothstep(24.,95.,dist));
}`;
