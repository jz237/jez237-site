import {WAVES} from './wave-model.js';
import {SURF_BANDS} from './surf-waves.js';
const n=x=>x.toFixed(10);
// Analytic curvature avoids screen-space second derivatives of interpolated
// normals: those change at triangle boundaries and produce white shards.
export const crestFoamGLSL=`
float crestCurvature(vec2 q,vec2 p){float curve=0.;
${WAVES.map(([x,z,k,a,w,phase])=>`{float f=dot(q,vec2(${n(x)},${n(z)}))*${n(k)}-time*${n(w)}+${n(phase)};curve+=(sin(f)+.48*sin(2.*f))*${n(a*k*k)}*(1.+storm*2.3);}`).join('\n')}
float noiseValue=surfNoise(dot(p,vec2(.008,.013))-time*.045).x;
float u=clamp((noiseValue-.22)/.5,0.,1.),envelope=.08+1.12*u*u*(3.-2.*u);
${SURF_BANDS.map(([x,z,k,a,phase],i)=>`{float f=dot(p,vec2(${n(x)},${n(z)}))*${n(k)}-time*${n(Math.sqrt(9.81*k))}+${n(phase)}+surfSeed*.03;float size=.5+.6*surfNoise(dot(p,vec2(.015,-.009))-time*.035+${n(i*19)}).x;curve+=(sin(f)+.72*sin(2.*f))*${n(a*k*k)}*size*envelope*surfStrength;}`).join('\n')}
return curve;}
`;
