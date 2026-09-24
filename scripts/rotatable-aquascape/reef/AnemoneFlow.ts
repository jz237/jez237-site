/** Coherent current plus a smaller phase-delayed eddy, with its exact derivative
 * along a tentacle. The rooted envelope is applied separately to both values. */
export const anemoneFlowGLSL=`
vec4 tissueFlow(float t,float phase){
 phase=mod(phase,8.);
 float gain=1.55*(.68+.22*sin(reefTime*.17)+.10*cos(reefTime*.31+1.2));
 float surge=reefTime*.72-t*.9, second=reefTime*1.15-t*1.35+1.3;
 float eddy=reefTime*1.95+phase-t*2.1, cross=reefTime*1.43+phase-t*1.6;
 return vec4((.045+sin(surge)*.12+sin(second)*.06+sin(eddy)*.024)*gain,
  (cos(reefTime*.61)*.075+sin(cross)*.026)*gain,
  (-.9*cos(surge)*.12-1.35*cos(second)*.06-2.1*cos(eddy)*.024)*gain,
  -1.6*cos(cross)*.026*gain);
}
vec3 tissueAxis(vec2 packed){
 vec3 axis=vec3(packed,1.-abs(packed.x)-abs(packed.y));
 if(axis.z<0.)axis.xy=(1.-abs(axis.yx))*vec2(axis.x>=0.?1.:-1.,axis.y>=0.?1.:-1.);
 return normalize(axis);
}`;

export function tissueFlow(time:number,t:number,phase:number){
 phase%=8;
 const gain=1.55*(.68+.22*Math.sin(time*.17)+.10*Math.cos(time*.31+1.2)),surge=time*.72-t*.9,second=time*1.15-t*1.35+1.3,eddy=time*1.95+phase-t*2.1,cross=time*1.43+phase-t*1.6;
 return [(.045+Math.sin(surge)*.12+Math.sin(second)*.06+Math.sin(eddy)*.024)*gain,(Math.cos(time*.61)*.075+Math.sin(cross)*.026)*gain,(-.9*Math.cos(surge)*.12-1.35*Math.cos(second)*.06-2.1*Math.cos(eddy)*.024)*gain,-1.6*Math.cos(cross)*.026*gain];
}
