// Evaluate metre-scale waves on the dense near-field mesh once per vertex.
// The fragment stage only adds filtered capillary detail. This avoids running
// inverse Gerstner queries and 64 wake packets for every screen pixel.
export const waterVertex = `
varying vec3 worldP; varying vec4 mirrorP;
varying vec3 broadSurface; varying vec2 disturbanceSlope; varying float breakingCrest;
uniform mat4 mirrorMatrix;
void main(){
 vec2 q=position.xz+craft.xy;
 float h;vec2 shift,grad;mat2 J;swellAt(q,h,shift,grad,J);
 vec2 p=q+shift;
 float det=max(.12,J[0][0]*J[1][1]-J[1][0]*J[0][1]);
 vec2 slope=vec2(J[1][1]*grad.x-J[0][1]*grad.y,-J[1][0]*grad.x+J[0][0]*grad.y)/det;
 broadSurface=vec3(h,slope)+waveTrainSurface(p)+surfSurface(p);
 breakingCrest=smoothstep(.7,1.7,broadSurface.x)*smoothstep(.04,.17,crestCurvature(q,p))*(1.-smoothstep(.38,.80,length(broadSurface.yz)));
 vec3 wakeResponse=wakeSurface(p);
 float e=.14;
 disturbanceSlope=vec2(
   jetWake(p+vec2(e,0))+impactHeight(p+vec2(e,0))-jetWake(p-vec2(e,0))-impactHeight(p-vec2(e,0)),
   jetWake(p+vec2(0,e))+impactHeight(p+vec2(0,e))-jetWake(p-vec2(0,e))-impactHeight(p-vec2(0,e)))/(2.*e)+wakeResponse.yz;
 worldP=vec3(p.x,seaLevel+broadSurface.x+jetWake(p)+impactHeight(p)+wakeResponse.x,p.y);
 mirrorP=mirrorMatrix*vec4(worldP,1.);
 gl_Position=projectionMatrix*viewMatrix*vec4(worldP,1.);
}`;
