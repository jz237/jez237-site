import * as T from 'three';
/** World-scale projections keep pores round on steep walls and undercuts. The
 * normal perturbation is projected onto the actual curved surface, so blending
 * projection axes never replaces the rock's geometric shading normal. */
export const rubbleNodules=`
 vec3 reefHash3(vec3 p){p=fract(p*vec3(.1031,.1030,.0973));p+=dot(p,p.yxz+33.33);return fract((p.xxy+p.yxx)*p.zyx);}
 // Cellular (Worley) nodules: nearest and second-nearest centre distances, the
 // vector to the nearest centre and that nodule's random identity.
 void reefNodules(vec3 p,out float f1,out float f2,out vec3 toCenter,out vec3 id){
  vec3 i=floor(p),f=fract(p);f1=8.;f2=8.;toCenter=vec3(0.);id=vec3(0.);
  for(int z=-1;z<=1;z++)for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){
   vec3 g=vec3(float(x),float(y),float(z)),h=reefHash3(i+g),o=g+.12+.76*h-f;float d=dot(o,o);
   if(d<f1){f2=f1;f1=d;toCenter=o;id=h;}else if(d<f2)f2=d;
  }
  f1=sqrt(f1);f2=sqrt(f2);
 }
 // 1 while a cell of this cellular pattern spans several pixels, falling to 0
 // as it shrinks toward one: sub-pixel detail would only shimmer as noise.
 float reefDetailFade(vec3 p){vec3 w=fwidth(p);return 1.-smoothstep(.2,.55,max(w.x,max(w.y,w.z)));}
 float reefNodeField(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(mix(reefHash3(i).x,reefHash3(i+vec3(1,0,0)).x,f.x),mix(reefHash3(i+vec3(0,1,0)).x,reefHash3(i+vec3(1,1,0)).x,f.x),f.y),
   mix(mix(reefHash3(i+vec3(0,0,1)).x,reefHash3(i+vec3(1,0,1)).x,f.x),mix(reefHash3(i+vec3(0,1,1)).x,reefHash3(i+vec3(1,1,1)).x,f.x),f.y),f.z);}
 // Coralline purples and violets, olive and ochre crusts, moss green, rose.
 vec3 reefNodeColor(float k){
  // Fewer purples: the reference rock is a mix of olive, ochre, moss and rose
  // crusts with violet coralline, reading more neutral than blue.
  return k<.16?vec3(.24,.07,.33):k<.26?vec3(.34,.15,.48):k<.44?vec3(.30,.27,.08):k<.56?vec3(.42,.23,.06):k<.70?vec3(.15,.25,.08):k<.82?vec3(.46,.14,.25):k<.9?vec3(.12,.22,.21):vec3(.46,.38,.26);
 }
 // Small colonies on the rubble: orange, lime, pink, teal, gold and violet.
 vec3 reefFragColor(float k){
  return k<.2?vec3(.9,.32,.08):k<.38?vec3(.45,.82,.16):k<.54?vec3(.92,.32,.5):k<.68?vec3(.14,.62,.58):k<.84?vec3(.88,.66,.14):vec3(.55,.28,.9);
 }
`;
export function finishRockMaterial(material:T.MeshStandardMaterial){
 material.onBeforeCompile=shader=>{
  shader.vertexShader='varying vec3 reefRockP,reefRockN;\n'+shader.vertexShader;
  shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nreefRockP=position;reefRockN=normal;');
  shader.fragmentShader='varying vec3 reefRockP,reefRockN; uniform mat3 normalMatrix;\n'+rubbleNodules+shader.fragmentShader;
  // Living rubble: every face is crowded with small domed coralline nodules,
  // each its own color, with dark crevices between (two scales).
  shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
   vec3 nodeTo,nodeId,fineTo=vec3(0.),fineId=vec3(0.);float nodeF1,nodeF2,fineF1=0.,fineF2=0.;
   float nodeFade=reefDetailFade(reefRockP*18.),fineFade=reefDetailFade(reefRockP*46.);
   reefNodules(reefRockP*18.,nodeF1,nodeF2,nodeTo,nodeId);
   // Every fine-pore term is weighted by fineFade: at 0 its cells cannot show.
   if(fineFade>0.)reefNodules(reefRockP*46.+vec3(17.3,5.1,9.7),fineF1,fineF2,fineTo,fineId);
   float nodeCrevice=smoothstep(.0,.22,nodeF2-nodeF1),fineCrevice=smoothstep(.0,.16,fineF2-fineF1);
   // Spherical crowns: brightness falls off toward each nodule's rim, so the
   // surface reads as rounded popcorn rather than flat polygonal tiles.
   float nodeDome=sqrt(max(0.,1.-nodeF1*nodeF1*1.25)),fineDome=sqrt(max(0.,1.-fineF1*fineF1*1.2));
   // Colour comes in patches, as coralline and crusts grow: neighbouring nodules
   // share a hue, with a little individual variation, not a confetti mix.
   float nodePatch=fract(reefNodeField(reefRockP*2.4+7.)*2.7+reefNodeField(reefRockP*5.3+19.)*1.3+nodeId.x*.16);
   vec3 nodeColor=reefNodeColor(nodePatch)*(.55+.5*nodeId.y);
   float coverage=.82*smoothstep(.05,.45,reefNodeField(reefRockP*1.7));
   float fineShade=mix(.9,(.66+.42*fineDome)*mix(.75,1.,fineCrevice),fineFade);
   vec3 living=mix(diffuseColor.rgb,nodeColor*mix(.88,.6+.55*fineId.z,fineFade),.8);
   diffuseColor.rgb=mix(diffuseColor.rgb,living,coverage);
   // Rounded bumps: lit crowns, shaded flanks and dark gaps between them.
   diffuseColor.rgb*=mix(1.,mix(.6,(.12+1.*nodeDome)*mix(.1,1.,nodeCrevice),nodeFade)*fineShade,.45+.55*coverage);
   // A share of the nodules carry a small living frag in a bright fluorescent
   // color on their crown, crowded most densely low on the rock.
   float fragPick=step(.9,nodeId.z)*coverage*(.5+.5*(1.-smoothstep(1.,2.8,reefRockP.y)))*smoothstep(.62,.3,nodeF1);
   vec3 fragColor=reefFragColor(nodeId.y);
   diffuseColor.rgb=mix(diffuseColor.rgb,fragColor*(.3+.75*nodeDome)*fineShade,fragPick);`);
  shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>',`#include <emissivemap_fragment>
   totalEmissiveRadiance+=fragColor*fragPick*(.12+.3*nodeDome);`);
  shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`
   vec3 stoneN=normalize(reefRockN),stoneSign=sign(stoneN+vec3(.000001));
   vec3 stoneWeight=pow(abs(stoneN),vec3(4.));stoneWeight/=dot(stoneWeight,vec3(1.));
   vec2 stoneX=vec2(-stoneSign.x*reefRockP.z,reefRockP.y)*.78;
   vec2 stoneY=vec2(reefRockP.x,-stoneSign.y*reefRockP.z)*.78;
   vec2 stoneZ=vec2(stoneSign.z*reefRockP.x,reefRockP.y)*.78;
   vec3 stoneColor=texture2D(map,stoneX).rgb*stoneWeight.x+texture2D(map,stoneY).rgb*stoneWeight.y+texture2D(map,stoneZ).rgb*stoneWeight.z;
   float lowerDetail=1.-smoothstep(.7,1.65,reefRockP.y);
   vec2 fineX=stoneX*3.7+vec2(.31,.17),fineY=stoneY*3.7+vec2(.31,.17),fineZ=stoneZ*3.7+vec2(.31,.17);
   if(lowerDetail>0.){
    vec3 fineColor=texture2D(map,fineX).rgb*stoneWeight.x+texture2D(map,fineY).rgb*stoneWeight.y+texture2D(map,fineZ).rgb*stoneWeight.z;
    stoneColor*=mix(vec3(1.),clamp(fineColor*1.45,vec3(.44),vec3(1.16)),lowerDetail*.72);
   }
   diffuseColor.rgb*=stoneColor;`);
  shader.fragmentShader=shader.fragmentShader.replace('#include <roughnessmap_fragment>',`
   vec4 stoneSampleX=texture2D(normalMap,stoneX),stoneSampleY=texture2D(normalMap,stoneY),stoneSampleZ=texture2D(normalMap,stoneZ);
   float roughnessFactor=roughness*dot(vec3(stoneSampleX.a,stoneSampleY.a,stoneSampleZ.a),stoneWeight);`);
  shader.fragmentShader=shader.fragmentShader.replace('#include <normal_fragment_maps>',`
   vec3 stoneNX=stoneSampleX.xyz*2.-1.,stoneNY=stoneSampleY.xyz*2.-1.,stoneNZ=stoneSampleZ.xyz*2.-1.;
   vec2 dx=stoneNX.xy/max(.15,stoneNX.z)*normalScale,dy=stoneNY.xy/max(.15,stoneNY.z)*normalScale,dz=stoneNZ.xy/max(.15,stoneNZ.z)*normalScale;
   vec3 slope=vec3(0.,dx.y,-stoneSign.x*dx.x)*stoneWeight.x+vec3(dy.x,0.,-stoneSign.y*dy.y)*stoneWeight.y+vec3(stoneSign.z*dz.x,dz.y,0.)*stoneWeight.z;
   if(lowerDetail>0.){
    vec3 microX=texture2D(normalMap,fineX).xyz*2.-1.,microY=texture2D(normalMap,fineY).xyz*2.-1.,microZ=texture2D(normalMap,fineZ).xyz*2.-1.;
    vec2 mx=microX.xy/max(.25,microX.z),my=microY.xy/max(.25,microY.z),mz=microZ.xy/max(.25,microZ.z);
    slope+=(vec3(0.,mx.y,-stoneSign.x*mx.x)*stoneWeight.x+vec3(my.x,0.,-stoneSign.y*my.y)*stoneWeight.y+vec3(stoneSign.z*mz.x,mz.y,0.)*stoneWeight.z)*lowerDetail*.62;
   }
   // Domed nodules tilt away from their own centres, the finer crowd more gently.
   // A spherical profile: the tilt grows toward each nodule's rim.
   slope+=(-nodeTo*2.4*nodeF1*nodeFade-fineTo*1.1*fineF1*fineFade)*(.35+.65*coverage);
   normal=normalize(normalMatrix*normalize(stoneN+slope-stoneN*dot(slope,stoneN)));`);
 };
 material.customProgramCacheKey=()=> 'reef-porous-rock-triplanar-lower-micropores-rubble-frags-v8';
 return material;
}
