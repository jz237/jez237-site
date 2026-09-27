import {WAVES,amp,bandFade,leanGLSL,stokesGLSL} from './wave-model.js';
import {SURF_BANDS,SURF_SKEW} from './surf-waves.js';
const n=x=>x.toFixed(10);
// Analytic curvature avoids screen-space second derivatives of interpolated
// normals: those change at triangle boundaries and produce white shards.
// Each term is the negated second derivative of the matching height profile.
export const crestFoamGLSL=`
float crestCurvature(vec2 q,vec2 p){float curve=0.;
${WAVES.map(([x,z,k,a,w,phase],i)=>`{float f=dot(q,vec2(${n(x)},${n(z)}))*${n(k)}-time*${n(w)}+${n(phase)},A=${amp(i)}*${bandFade(i)},s=sin(f),c=cos(f),kap=${stokesGLSL(i)};curve+=(s-4.*kap*(1.-2.*s*s)-8.*${leanGLSL(i)}*s*c)*A*${n(k*k)};}`).join('\n')}
float noiseValue=surfNoise(dot(p,vec2(.008,.013))-time*.045).x;
float u=clamp((noiseValue-.22)/.5,0.,1.),envelope=.08+1.12*u*u*(3.-2.*u);
${SURF_BANDS.map(([x,z,k,a,phase],i)=>`{float f=dot(p,vec2(${n(x)},${n(z)}))*${n(k)}-time*${n(Math.sqrt(9.81*k))}+${n(phase)}+surfSeed*.03;float size=.5+.6*surfNoise(dot(p,vec2(.015,-.009))-time*.035+${n(i*19)}).x,s=sin(f),c=cos(f),ka=${n(a*k)}*size*envelope*surfStrength,kap=min(.2,.5*ka),tau=min(.06,.375*ka*ka);curve+=(s-4.*kap*(1.-2.*s*s)-${n(8*SURF_SKEW)}*s*c-9.*tau*(3.*s-4.*s*s*s))*${n(a*k*k)}*size*envelope*surfStrength;}`).join('\n')}
return curve;}
`;
