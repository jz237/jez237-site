// Shared water shading for the filter showrooms (Lab, Nov 11 2026): travelling
// ripples, a soft-box studio seen in the surface, colour absorbed with depth,
// caustic light on what lies under the surface, and a bright contact line where
// the surface meets a wall. A look, not a fluid, optics or light-transport solution.
// Paste WATER_GLSL into a fragment shader ahead of main().
export const WATER_GLSL=`
// Slope (dh/dx, dh/dz) of a sum of travelling waves, in world units. energy 0..1.
vec2 hrSlope(vec2 p,float t,float energy){
  p+=.16*vec2(sin(p.y*1.3+t*.21),cos(p.x*1.1-t*.17));
  vec2 g=vec2(0.);
  g+=vec2(.8,.6)*(.010*5.0)*cos(dot(vec2(.8,.6),p)*5.0+t*1.1);
  g+=vec2(-.5,.866)*(.006*8.3)*cos(dot(vec2(-.5,.866),p)*8.3-t*1.4+1.7);
  g+=vec2(.2,-.98)*(.0035*13.1)*cos(dot(vec2(.2,-.98),p)*13.1+t*1.9+.6);
  g+=vec2(-.93,-.36)*(.0018*21.7)*cos(dot(vec2(-.93,-.36),p)*21.7-t*2.4+2.9);
  g+=vec2(.6,-.8)*(.0009*34.)*cos(dot(vec2(.6,-.8),p)*34.+t*3.1+4.2);
  g+=vec2(-.3,.954)*(.0005*55.)*cos(dot(vec2(-.3,.954),p)*55.-t*3.8+.9);
  return g*(.3+.7*energy);
}
// Bright moving filaments, 0..1, for light focused by the rippled surface.
float hrCaustic(vec2 p,float t){
  vec2 a=p*3.1+vec2(t*.31,-t*.23);a+=.55*vec2(sin(a.y*1.7+t*.9),cos(a.x*1.5-t*.8));
  vec2 b=p*4.7+vec2(-t*.27,t*.35);b+=.5*vec2(cos(b.y*1.3-t*.7),sin(b.x*1.9+t*.6));
  float c=min(abs(sin(a.x)+sin(a.y)),abs(sin(b.x*1.1)+cos(b.y*.9)));
  return pow(clamp(1.-c*.9,0.,1.),5.);
}
// What the surface mirrors: a dark studio with a warm key box, a cool strip and a top panel.
vec3 hrStudio(vec3 r){
  vec3 c=mix(vec3(.035,.07,.085),vec3(.10,.17,.19),clamp(r.y,0.,1.));
  c+=vec3(1.,.93,.82)*smoothstep(.93,.985,dot(r,normalize(vec3(-.45,.75,.5))))*1.4;
  c+=vec3(.75,.88,1.)*smoothstep(.95,.99,dot(r,normalize(vec3(.6,.55,-.55))));
  c+=vec3(.6)*smoothstep(.975,.995,r.y);
  return c;
}
// Bubble domes, 0..1, for the foam where falling water meets the surface.
float hrFoam(vec2 p,float t){
  vec2 q=p*14.+vec2(t*.6,-t*.4),i=floor(q),f=fract(q);float d=1.;
  for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){vec2 g=vec2(float(x),float(y));vec2 o=fract(sin(vec2(dot(i+g,vec2(127.1,311.7)),dot(i+g,vec2(269.5,183.3))))*43758.5453);o=.5+.4*sin(t*2.+6.2831*o);d=min(d,length(g+o-f));}
  return smoothstep(.45,.05,d);
}
// Light lost and scattered over a path of the given length through the water.
vec3 hrAbsorb(vec3 behind,float thick){
  vec3 a=exp(-thick*vec3(.42,.085,.06));
  return behind*a+vec3(.03,.15,.17)*(1.-a);
}
`;
