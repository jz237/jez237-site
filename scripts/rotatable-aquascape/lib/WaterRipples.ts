export const rippleHeightShader=`
float rippleHeight(vec2 p){
 float inlet=length(p-vec2(4.25,-1.6));
 float agitation=.65+.35*exp(-inlet*.32);
 // Several crossing ripple scales break up the long, regular mirror stripes.
 // Shorter waves change reflection direction without making large water swells.
 vec2 q=p+vec2(sin(p.y*1.9+p.x*.7-time*.29),sin(p.x*1.3-p.y*.8+time*.23))*.09;
 float broad=sin(q.x*2.7+q.y*3.6-time*1.8)*.011;
 float cross=sin(q.x*8.3-q.y*6.8-time*3.2+sin(q.y*1.7)*.65)*.012;
 float secondary=sin(q.x*12.1+q.y*9.7-time*4.8+sin(q.x*.8-time*.23)*.7)*.007;
 // Small, differently directed ripples break the large repeating reflection lobes.
 float fine=sin(q.x*23.2-q.y*17.8-time*7.1)*.002;
 fine+=sin(q.x*31.7+q.y*11.9-time*8.6+sin(q.y*2.3)*.25)*.0014;
 fine+=sin(-q.x*15.3+q.y*37.4-time*10.3)*.0011;
 #ifdef WATER_FRAGMENT
 // Suppress unresolved capillary detail on distant/mobile pixels, rather than sparkle.
 float footprint=max(length(dFdx(p)),length(dFdy(p)));
 fine*=1.-smoothstep(.03,.07,footprint);
 #endif
 float rings=sin(inlet*18.-time*5.4)*exp(-inlet*.8)*.006;
 float edge=min(5.04-abs(p.x),2.30-abs(p.y));
 // A narrow raised meniscus meets the glass; the contact line retains a
 // small part of the passing wave instead of becoming a rigid straight bar.
 float wetEdge=.015*exp(-max(0.,edge)/.025);
 float wallMotion=.12+.88*smoothstep(0.,.18,edge);
 return ((broad+cross+secondary+fine)*agitation+rings)*wallMotion+wetEdge;
}
`;

/** Analytic derivatives of the same six crossing waves, inlet rings and wet
 * edge. Evaluate the phases once, rather than four complete height samples per
 * fragment. fineFilter is the existing screen-footprint capillary filter. */
export const rippleSlopeShader=`
vec3 rippleSlope(float x,float z,float fineFilter){
 float warpX=z*1.9+x*.7-time*.29,warpZ=x*1.3-z*.8+time*.23;
 float qx=x+sin(warpX)*.09,qz=z+sin(warpZ)*.09;
 float ax=cos(warpX)*.09,az=cos(warpZ)*.09;
 float broad=qx*2.7+qz*3.6-time*1.8;
 float crossWave=qx*8.3-qz*6.8-time*3.2+sin(qz*1.7)*.65;
 float secondary=qx*12.1+qz*9.7-time*4.8+sin(qx*.8-time*.23)*.7;
 float fineA=qx*23.2-qz*17.8-time*7.1;
 float fineB=qx*31.7+qz*11.9-time*8.6+sin(qz*2.3)*.25;
 float fineC=-qx*15.3+qz*37.4-time*10.3;
 float cb=cos(broad)*.011,cc=cos(crossWave)*.012,cs=cos(secondary)*.007;
 float ca=cos(fineA)*.002*fineFilter,cf=cos(fineB)*.0014*fineFilter,cg=cos(fineC)*.0011*fineFilter;
 float gradientX=cb*2.7+cc*8.3+cs*(12.1+.56*cos(qx*.8-time*.23))+ca*23.2+cf*31.7-cg*15.3;
 float gradientZ=cb*3.6+cc*(-6.8+1.105*cos(qz*1.7))+cs*9.7-ca*17.8+cf*(11.9+.575*cos(qz*2.3))+cg*37.4;
 float waves=sin(broad)*.011+sin(crossWave)*.012+sin(secondary)*.007+fineFilter*(sin(fineA)*.002+sin(fineB)*.0014+sin(fineC)*.0011);
 float ix=x-4.25,iz=z+1.6,inlet=sqrt(ix*ix+iz*iz);
 float decay=exp(-inlet*.32),agitation=.65+.35*decay;
 float ringDecay=exp(-inlet*.8)*.006,ringPhase=inlet*18.-time*5.4;
 float rings=sin(ringPhase)*ringDecay;
 float radial=-.112*decay*waves+ringDecay*(18.*cos(ringPhase)-.8*sin(ringPhase));
 float dx=(gradientX*(1.+.7*ax)+gradientZ*1.3*az)*agitation+radial*ix/max(inlet,.00001);
 float dz=(gradientX*1.9*ax+gradientZ*(1.-.8*az))*agitation+radial*iz/max(inlet,.00001);
 float edgeX=5.04-abs(x),edgeZ=2.30-abs(z),edge=min(edgeX,edgeZ);
 float u=clamp(edge/.18,0.,1.);
 float wallMotion=.12+.88*u*u*(3.-2.*u);
 float wallSlope=.88*6.*u*(1.-u)/.18;
 float wetSlope=edge>0.?-.015/.025*exp(-edge/.025):0.;
 float edgeSlope=(waves*agitation+rings)*wallSlope+wetSlope;
 dx=dx*wallMotion+(edgeX<=edgeZ?-sign(x)*edgeSlope:0.);
 dz=dz*wallMotion+(edgeZ<edgeX?-sign(z)*edgeSlope:0.);
 return vec3(-dx,1.,-dz);
}
`;
