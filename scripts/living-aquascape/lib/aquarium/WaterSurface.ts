// Surface coordinates follow the shallow perspective plane in aquascape.png.
// Analytic wave slopes drive refraction and a broad overhead-light reflection.
export const waterSurface = `
float waterHeight(vec2 q, float t){
 float waves=sin(q.x*15.0+q.y*8.0-t*1.6)*.48;
 waves+=sin(q.x*24.0-q.y*13.0-t*1.13)*.25;
 waves+=sin(q.x*43.0+q.y*19.0-t*2.04)*.12;
 float radius=length((q-vec2(.91,.82))*vec2(1.0,.24));
 waves+=sin(radius*92.0-t*3.1)*exp(-radius*3.4)*.25;
 return waves;
}
vec3 surfaceWater(vec2 uv,vec3 original){
 float region=box(uv,vec2(.169,.752),vec2(.798,.818),.006);
 // Preserve the emergent driftwood and glass hardware in the original scene.
 float wood=1.0-smoothstep(.78,1.0,length((uv-vec2(.405,.798))/vec2(.078,.060)));
 float pipe=1.0-smoothstep(.7,1.0,length((uv-vec2(.775,.774))/vec2(.025,.037)));
 region*=1.0-max(wood,pipe);
 vec2 q=vec2((uv.x-.169)/.629,(.818-uv.y)/.066);
 float strength=clamp(agitation*.72+flow*.28,0.0,1.0);
 float h=waterHeight(q,time);
 float hx=(waterHeight(q+vec2(.003,0.0),time)-waterHeight(q-vec2(.003,0.0),time))/.006;
 float hy=(waterHeight(q+vec2(0.0,.003),time)-waterHeight(q-vec2(0.0,.003),time))/.006;
 vec3 normal=normalize(vec3(-hx*.022*strength,1.0,-hy*.022*strength));
 vec3 eye=normalize(vec3(0.0,.30,1.0));
 float fresnel=.02+.98*pow(1.0-max(dot(normal,eye),0.0),5.0);
 vec2 offset=vec2(hx*.00010,h*.0028)*strength;
 vec3 refracted=texture2D(photograph,uv+offset*region).rgb;
 vec3 reflected=texture2D(photograph,uv+vec2(offset.x*2.5,-offset.y*1.6)*region).rgb;
 // Extended LED reflection breaks into moving ribbons across the wave normals.
 vec3 halfVector=normalize(eye+normalize(vec3(.06,.55,-1.0)));
 float glint=pow(max(dot(normal,halfVector),0.0),70.0);
 float ribbons=smoothstep(.30,.88,sin(q.y*25.0+h*2.8+q.x*3.0));
 vec3 water=mix(refracted,reflected*.9+vec3(.025,.040,.044),fresnel*.5);
 water+=vec3(.64,.78,.82)*glint*(.10+strength*.30)*ribbons;
 // Gentle moving caustic contrast, bounded to the actual surface plane.
 water*=1.0+h*.035*strength;
 return mix(original,water,region);
}
`;
