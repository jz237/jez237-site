/* Continuous world-space rock material. Three fixed projections avoid stretched
 * native UVs; broad mineral bands break repetition without new texture assets. */
#define AS_STRATA_GLSL \
"float districtLining(vec2 q){q=fract(q);float cover=1.-smoothstep(.43,.45,q.y);float rib=1.-smoothstep(.015,.03,min(q.x,1.-q.x));return max(cover,rib);}" \
"vec3 strataWeights(vec3 n){vec3 w=pow(abs(n),vec3(3.));return w/max(.001,w.x+w.y+w.z);}" \
"vec3 strataSample(sampler2D tex,vec3 p,vec3 n){vec3 w=strataWeights(n);p*=.065;return texture2D(tex,p.yz).rgb*w.x+texture2D(tex,p.zx).rgb*w.y+texture2D(tex,p.xy).rgb*w.z;}" \
"vec3 strataTint(vec3 p){float broad=.5+.5*sin(p.y*.045+p.x*.019+p.z*.024+sin(p.z*.031)*1.7);float band=.5+.5*sin(p.y*.22+p.x*.037+sin(p.z*.07)*.6);return mix(vec3(.78,.84,.88),vec3(1.04,.88,.72),broad)*mix(.88,1.08,band);}" \
"vec3 strataNormal(sampler2D tex,vec3 p,vec3 n){vec3 w=strataWeights(n);p*=.065;vec2 x=texture2D(tex,p.yz).xy*2.-1.,y=texture2D(tex,p.zx).xy*2.-1.,z=texture2D(tex,p.xy).xy*2.-1.;return normalize(n+.48*(vec3(0.,x.x,x.y)*w.x+vec3(y.y,0.,y.x)*w.y+vec3(z.x,z.y,0.)*w.z));}"
