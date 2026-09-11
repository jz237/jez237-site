// Seeded, smoothly varying wave sets shared by the renderer and every hull.
export const surfStrength={value:0},surfSeed={value:17};
export const SURF_BANDS=[[.6,.8,.24,1.25,1.1],[-.28,.96,.16,.85,2.4],[.92,.392,.38,.35,.3]];
const mod=(v,n)=>v-n*Math.floor(v/n);
function hash(n){const a=mod(n*73+surfSeed.value,251);return mod(a*a*13+17,1021)/1021;}
function noise(q){const i=Math.floor(q),f=q-i,u=f*f*(3-2*f);return hash(i)+(hash(i+1)-hash(i))*u;}
export function surfEnvelope(x,z,t){const n=noise(x*.008+z*.013-t*.045),u=Math.max(0,Math.min(1,(n-.22)/.5));return .08+1.12*u*u*(3-2*u);}
export function surfHeight(x,z,t){let h=0;const envelope=surfEnvelope(x,z,t);for(let i=0;i<SURF_BANDS.length;i++){const [dx,dz,k,a,phase]=SURF_BANDS[i],f=(x*dx+z*dz)*k-t*Math.sqrt(9.81*k)+phase+surfSeed.value*.03;const size=.5+.6*noise(x*.015-z*.009-t*.035+i*19);h+=a*size*(Math.sin(f)+.18*Math.sin(2*f));}return h*envelope*surfStrength.value;}
export const surfGLSL=`uniform float surfStrength,surfSeed;
float surfHash(float n){float a=mod(n*73.+surfSeed,251.);return mod(a*a*13.+17.,1021.)/1021.;}
vec2 surfNoise(float q){float i=floor(q),f=fract(q),a=surfHash(i),b=surfHash(i+1.);return vec2(mix(a,b,f*f*(3.-2.*f)),(b-a)*6.*f*(1.-f));}
vec3 surfSurface(vec2 p){vec3 s=vec3(0.);vec2 n=surfNoise(dot(p,vec2(.008,.013))-time*.045);float u=clamp((n.x-.22)/.5,0.,1.),envelope=.08+1.12*u*u*(3.-2.*u);vec2 eg=vec2(.008,.013)*(1.12*6.*u*(1.-u)/.5*n.y);
${SURF_BANDS.map(([x,z,k,a,phase],i)=>`{vec2 d=vec2(${x.toFixed(8)},${z.toFixed(8)}),n=surfNoise(dot(p,vec2(.015,-.009))-time*.035+${(i*19).toFixed(1)});float size=.5+.6*n.x,f=dot(p,d)*${k.toFixed(8)}-time*${Math.sqrt(9.81*k).toFixed(8)}+${phase.toFixed(8)}+surfSeed*.03,h=${a.toFixed(8)}*(sin(f)+.18*sin(2.*f));s.x+=h*size;s.yz+=d*${(a*k).toFixed(8)}*(cos(f)+.36*cos(2.*f))*size+h*.6*n.y*vec2(.015,-.009);}`).join('')}
return vec3(s.x*envelope,s.yz*envelope+s.x*eg)*surfStrength;}`;
