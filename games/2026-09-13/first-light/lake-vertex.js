// Metre-scale waves, wakes, impacts and the ripple field are evaluated once per vertex on the dense
// near-field mesh centred on the focus; the fragment stage adds only filtered capillary detail.
export const lakeVertex=`
varying vec3 worldP;varying vec4 mirrorP;varying vec3 broadSurface;varying vec2 disturbanceSlope;varying float fetchV;
uniform mat4 mirrorMatrix;
void main(){
 vec2 q=position.xz+focus.xy;
 float fetch=fetchAt(q);float amp=windAmp*fetch;fetchV=fetch;
 float h;vec2 shift,grad;mat2 J;swellAt(q,amp,h,shift,grad,J);
 vec2 p=q+shift;
 float det=max(.12,J[0][0]*J[1][1]-J[1][0]*J[0][1]);
 vec2 slope=vec2(J[1][1]*grad.x-J[0][1]*grad.y,-J[1][0]*grad.x+J[0][0]*grad.y)/det;
 broadSurface=vec3(h,slope);
 vec3 wakeResponse=wakeSurface(p);
 float e=.14;
 disturbanceSlope=vec2(impactHeight(p+vec2(e,0))-impactHeight(p-vec2(e,0)),impactHeight(p+vec2(0,e))-impactHeight(p-vec2(0,e)))/(2.*e)+wakeResponse.yz;
 worldP=vec3(p.x,seaLevel+h+impactHeight(p)+wakeResponse.x+rippleHeight(p),p.y);
 mirrorP=mirrorMatrix*vec4(worldP,1.);
 gl_Position=projectionMatrix*viewMatrix*vec4(worldP,1.);
}`;
