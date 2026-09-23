/** Coherent current plus a smaller phase-delayed eddy, with its exact derivative
 * along a tentacle. The rooted envelope is applied separately to both values. */
export const anemoneFlowGLSL=`
vec4 tissueFlow(float t,float phase){
 float gain=.82+.18*sin(reefTime*.19+phase*.04);
 float surge=reefTime*.83-t*.9-phase*.06;
 float eddy=reefTime*1.37+phase-t*2.1;
 float cross=reefTime*1.19+phase-t*1.6;
 return vec4((sin(surge)*.18+sin(eddy)*.04)*gain,
  (cos(reefTime*.79-phase*.07)*.10+sin(cross)*.027)*gain,
  (-.9*cos(surge)*.18-2.1*cos(eddy)*.04)*gain,
  -1.6*cos(cross)*.027*gain);
}
vec3 tissueAxis(vec2 packed){
 vec3 axis=vec3(packed,1.-abs(packed.x)-abs(packed.y));
 if(axis.z<0.)axis.xy=(1.-abs(axis.yx))*vec2(axis.x>=0.?1.:-1.,axis.y>=0.?1.:-1.);
 return normalize(axis);
}`;

export function tissueFlow(time:number,t:number,phase:number){
 const gain=.82+.18*Math.sin(time*.19+phase*.04),surge=time*.83-t*.9-phase*.06,eddy=time*1.37+phase-t*2.1,cross=time*1.19+phase-t*1.6;
 return [(Math.sin(surge)*.18+Math.sin(eddy)*.04)*gain,(Math.cos(time*.79-phase*.07)*.10+Math.sin(cross)*.027)*gain,(-.9*Math.cos(surge)*.18-2.1*Math.cos(eddy)*.04)*gain,-1.6*Math.cos(cross)*.027*gain];
}
