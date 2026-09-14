// Water optics shared by the shaders, the underwater fog and the tests. Water n = 1.333.
export const WATER_IOR=1.333;
export const SNELL_WINDOW_DEG=Math.asin(1/WATER_IOR)*180/Math.PI; // 48.6 degrees from the vertical
// Unpolarised Fresnel reflectance for light leaving water into air at incidence cosI (measured
// from the surface normal, below the surface). Total internal reflection beyond the critical angle.
export function fresnelWaterToAir(cosI){
 cosI=Math.max(0,Math.min(1,cosI));const n1=WATER_IOR,n2=1;const sinT2=(n1/n2)*(n1/n2)*(1-cosI*cosI);
 if(sinT2>=1)return 1;const cosT=Math.sqrt(1-sinT2);
 const rs=(n1*cosI-n2*cosT)/(n1*cosI+n2*cosT),rp=(n2*cosI-n1*cosT)/(n2*cosI+n1*cosT);return .5*(rs*rs+rp*rp);
}
// Air-to-water reflectance (the above-water shader's split), for symmetry checks.
export function fresnelAirToWater(cosI){cosI=Math.max(0,Math.min(1,cosI));const n=WATER_IOR;const sinT2=(1-cosI*cosI)/(n*n),cosT=Math.sqrt(Math.max(0,1-sinT2));const rs=(cosI-n*cosT)/(cosI+n*cosT),rp=(n*cosI-cosT)/(n*cosI+cosT);return .5*(rs*rs+rp*rp);}
// Exponential-squared fog density for an underwater view: visibility scales with clarity
// (Secchi-style multiplier) and the profile's scatter; roughly 5 m at clarity 1 in green water.
export function underwaterFogDensity(clarity=1,scatterG=.075){return Math.max(.04,Math.min(.4,(.055+scatterG*.4)/Math.max(.3,clarity)));}
export function underwaterFogColor(scatter,sunFactor=1,night=0){const k=(.5+.5*sunFactor)*(1-night*.85);return [scatter[0]*3.2*k,scatter[1]*3.2*k,scatter[2]*3.0*k];}
