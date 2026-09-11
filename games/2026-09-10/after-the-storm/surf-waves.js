// Additional launch-sized swell. Rendering and all hulls sample the same field.
export const surfStrength={value:0};
export const SURF_BANDS=[[.6,.8,.24,1.25,1.1],[-.28,.96,.16,.85,2.4],[.92,.392,.38,.35,.3]];
export function surfHeight(x,z,t){let h=0;for(const [dx,dz,k,a,phase] of SURF_BANDS){const f=(x*dx+z*dz)*k-t*Math.sqrt(9.81*k)+phase;h+=a*(Math.sin(f)+.18*Math.sin(2*f));}return h*surfStrength.value;}
export const surfGLSL=`uniform float surfStrength;vec3 surfSurface(vec2 p){vec3 s=vec3(0.);${SURF_BANDS.map(([x,z,k,a,p])=>`{vec2 d=vec2(${x.toFixed(8)},${z.toFixed(8)});float f=dot(p,d)*${k.toFixed(8)}-time*${Math.sqrt(9.81*k).toFixed(8)}+${p.toFixed(8)};s.x+=${a.toFixed(8)}*(sin(f)+.18*sin(2.*f));s.yz+=d*${(a*k).toFixed(8)}*(cos(f)+.36*cos(2.*f));}`).join('')}return s*surfStrength;}`;
