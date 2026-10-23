import * as T from "three";

// Additional section studies are sampled directly, without modifying the source JPEGs.
export function addMacroSurface(
  material,
  textures,
  { fin = false, caudal = false, eye = false } = {},
) {
  const previous = material.onBeforeCompile;
  const motionKey = material.customProgramCacheKey();
  material.onBeforeCompile = (shader) => {
    previous(shader);
    Object.assign(shader.uniforms, {
      macroHead: { value: textures.head },
      macroScales: { value: textures.scales },
      macroFin: { value: textures.fin },
    });
    shader.fragmentShader =
      `uniform sampler2D macroHead, macroScales, macroFin;\n` +
      shader.fragmentShader;
    if (fin) {
      shader.vertexShader = "varying vec2 vMacroFinUV;\n" + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\nvMacroFinUV=finUV;",
      );
      shader.fragmentShader =
        "varying vec2 vMacroFinUV;\n" + shader.fragmentShader;
    }
    const common = `
float luminanceBetta(vec3 c){return dot(c,vec3(.2126,.7152,.0722));}
float patchMask(vec2 p,float margin){vec2 lo=smoothstep(vec2(0.),vec2(margin),p);vec2 hi=1.-smoothstep(vec2(1.-margin),vec2(1.),p);return lo.x*lo.y*hi.x*hi.y;}
vec3 basePigment(vec2 uv){return texture2D(map,uv).rgb;}
`;
    const skin = `
vec2 headCoord(vec2 uv){vec2 pixel=vec2(uv.x*1536.,(1.-uv.y)*1024.);return vec2((pixel.x-145.)/290.+.017,1.-(pixel.y-300.)/250.-.034);}
vec2 scaleCoord(vec2 uv){vec2 pixel=vec2(uv.x*1536.,(1.-uv.y)*1024.);return vec2((pixel.x-430.)/400.,1.-(pixel.y-278.)/250.);}
float flankMask(vec2 uv){return smoothstep(400.,465.,uv.x*1536.);}
vec3 scalePigment(vec2 uv){
 vec2 q=scaleCoord(uv);float x=fract(q.x);float w=smoothstep(0.,.08,x)*(1.-smoothstep(.92,1.,x));
 vec3 a=texture2D(macroScales,vec2(x,clamp(q.y,.015,.985))).rgb;
 vec3 b=texture2D(macroScales,vec2(fract(q.x+.5),clamp(q.y,.015,.985))).rgb;
 return mix(b,a,w);
}
vec3 sectionPigment(vec2 uv){
 vec3 base=basePigment(uv);vec2 h=headCoord(uv),s=scaleCoord(uv);
 vec3 head=texture2D(macroHead,clamp(h,0.,1.)).rgb;
 float headMask=patchMask(h,.13);base=mix(base,head,headMask*.97);
 vec3 scales=scalePigment(uv);
 base=mix(base,scales,flankMask(uv)*.98);
 ${eye ? "" : `// Conceal the painted eye beneath the moving globe so a glance cannot
 // reveal a second stationary pupil. The original source texture is unchanged.
 vec2 socket=(vec2(uv.x*1536.,(1.-uv.y)*1024.)-vec2(240.,400.))*.0032;
 base=mix(base,vec3(.018,.025,.027),1.-smoothstep(.062,.082,length(socket)));`}
 return base;
}
float microHeight(vec2 uv){
 vec2 h=headCoord(uv),s=scaleCoord(uv);
 float head=luminanceBetta(texture2D(macroHead,clamp(h,0.,1.)).rgb);
 float scales=luminanceBetta(scalePigment(uv));
 float original=luminanceBetta(basePigment(uv));
 float relief=mix(original,head,patchMask(h,.12));
 relief=mix(relief,scales,flankMask(uv));return relief;
}
`;
    const membrane = `
vec2 membraneCoord(vec2 uv){
 ${caudal ? "vec2 pixel=vec2(uv.x*1225.,(1.-uv.y)*1284.);return vec2((pixel.x-700.)/300.,1.-(pixel.y-360.)/340.);" : "return uv*vec2(7.,5.);"}
}
vec3 fineTissue(vec2 uv){vec2 q=membraneCoord(uv);q=vec2(1.)-abs(fract(q*.5)*2.-1.);return texture2D(macroFin,q).rgb-textureLod(macroFin,q,1.8).rgb;}
vec3 sectionPigment(vec2 uv){
 vec3 base=basePigment(uv);float edge=1.-smoothstep(.84,.99,vMacroFinUV.y);
 float grain=clamp(luminanceBetta(fineTissue(uv))*1.5,-.10,.10);return base*(1.+grain*edge);
}
float microHeight(vec2 uv){return luminanceBetta(basePigment(uv))+luminanceBetta(fineTissue(uv))*.20;}
`;
    // Insert after map sampler declarations, before the bump-gradient functions.
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <bumpmap_pars_fragment>",
      common +
        (fin ? membrane : skin) +
        T.ShaderChunk.bumpmap_pars_fragment
          .replaceAll(
            "texture2D( bumpMap, vBumpMapUv ).x",
            "microHeight(vBumpMapUv)",
          )
          .replaceAll(
            "texture2D( bumpMap, vBumpMapUv + dSTdx ).x",
            "microHeight(vBumpMapUv + dSTdx)",
          )
          .replaceAll(
            "texture2D( bumpMap, vBumpMapUv + dSTdy ).x",
            "microHeight(vBumpMapUv + dSTdy)",
          ),
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <map_fragment>",
      "diffuseColor *= vec4(sectionPigment(vMapUv),1.);",
    );
    if (!eye)
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <roughnessmap_fragment>",
        `#include <roughnessmap_fragment>\nroughnessFactor=clamp(roughnessFactor+(1.-microHeight(vMapUv))*.10-.045,.28,.88);`,
      );

  };
  material.customProgramCacheKey = () =>
    `betta-macro-1.6-${fin}-${caudal}-${eye}-${motionKey}`;
  return material;
}
