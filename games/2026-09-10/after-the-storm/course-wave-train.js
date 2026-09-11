// Localized shoaling rollers: the uniform is shared by rendering and buoyancy.
// Three crests retain their order while slowly surging along the shallow bank.
export const courseWaveTrain={value:new Float32Array(4)};
export function setCourseWaveTrain(train){courseWaveTrain.value.set(train||[0,0,0,0]);}
export function waveTrainHeight(x,z,time){const [cx,first,spacing,amplitude]=courseWaveTrain.value;if(!amplitude)return 0;
 const across=(x-cx)/28;if(Math.abs(across)>=1)return 0;const envelope=(1-across*across)**2,surge=Math.sin(time*.7)*1.2;let h=0;
 for(let i=0;i<3;i++){const q=(z-first-i*spacing-surge)/3.2;h+=(1-2*q*q)*Math.exp(-q*q);}
 return h*amplitude*envelope;
}
export const waveTrainGLSL=`uniform vec4 courseWaveTrain;
vec3 waveTrainSurface(vec2 p){if(courseWaveTrain.w==0.)return vec3(0.);float across=(p.x-courseWaveTrain.x)/28.;if(abs(across)>=1.)return vec3(0.);float envelope=pow(1.-across*across,2.),surge=sin(time*.7)*1.2,h=0.,dz=0.;for(int i=0;i<3;i++){float q=(p.y-courseWaveTrain.y-float(i)*courseWaveTrain.z-surge)/3.2,e=exp(-q*q);h+=(1.-2.*q*q)*e;dz+=(4.*q*q*q-6.*q)*e/3.2;}return courseWaveTrain.w*vec3(h*envelope,h*(-4.*across*(1.-across*across)/28.),dz*envelope);}
float waveTrainHeight(vec2 p){return waveTrainSurface(p).x;}`;
