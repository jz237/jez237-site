import * as T from "three";

// A colour variety over the photographed fish (src/varieties.js, ../globes/src/fish/varieties.mjs):
// the same look the Betta Bowl's shader gives it (bettaWGSL.ts), here for the Atelier's own
// materials. Its colour map, painted divided by the photographs' local brightness, is multiplied
// by their luminance, so every scale, ray and fold stays as it was. A fin may carry an outer band
// (a butterfly's, a mustard gas's), the flank scales a tinted play of colour and a metallic coat
// (a dragon's, a copper's). uLook is varieties.mjs varietyLook's mat4; with its [0].x at 0
// (Classic) the photographs show unchanged. Every material is compiled once with this code in it,
// so a change of variety is only new uniforms and two small textures, never a new program.
const blank = new T.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1);
blank.needsUpdate = true;
export const lookUniforms = {
  // (Its columns as varietyLook writes them: Classic's, the band and coat off.)
  uLook: { value: new T.Matrix4().fromArray([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, -8]) },
  uLookProfile: { value: blank },
  uLookCaudal: { value: blank },
};

/** Adds the variety's colours to a material already given its map (and, for the body, the macro
 *  surface): fin (a membrane, with finUV: an outer band) or skin (the scales' sheen and coat); caudal
 *  reads the fin photograph's map, everything else the profile's. */
export function addVarietyLook(material, { fin = false, caudal = false } = {}) {
  const previous = material.onBeforeCompile;
  const key = material.customProgramCacheKey();
  material.onBeforeCompile = (shader, renderer) => {
    previous(shader, renderer);
    shader.uniforms.uLook = lookUniforms.uLook;
    shader.uniforms.uLookMap = caudal ? lookUniforms.uLookCaudal : lookUniforms.uLookProfile;
    if (fin) {
      shader.vertexShader = "varying vec2 vLookFin;\n" + shader.vertexShader.replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\nvLookFin=finUV;",
      );
    }
    shader.fragmentShader =
      `${fin ? "#define LOOK_FIN\nvarying vec2 vLookFin;\n" : "#define LOOK_SKIN\n"}uniform mat4 uLook;uniform sampler2D uLookMap;
// The rays as the band's edge follows them (one every 1/28 of the fin's width, as sculpted).
float lookRays(vec2 f){return smoothstep(.7,1.,sin(f.x*175.929));}
` + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <color_fragment>",
      `#include <color_fragment>
 float lookLum=dot(diffuseColor.rgb,vec3(.2126,.7152,.0722));
 float lookCoat=0.;
 if(uLook[0].x>0.){
  diffuseColor.rgb=mix(diffuseColor.rgb,texture2D(uLookMap,vMapUv).rgb*pow(max(lookLum,1e-6),uLook[0].z)*uLook[0].y,uLook[0].x);
  #ifdef LOOK_FIN
  // The outer band: a crisp edge, the inner colour running a little further out along the rays,
  // the edge wandering along the fin.
  float band=smoothstep(-.012,.012,vLookFin.y-uLook[2].w-.045*lookRays(vLookFin)+.018*sin(vLookFin.x*37.)+.01*sin(vLookFin.x*103.+1.7));
  // (No whiter than white membrane: a pale band lit through from behind would bloom into a halo.)
  diffuseColor.rgb=mix(diffuseColor.rgb,min(uLook[2].xyz*lookLum,vec3(.62)),band);
  #else
  // The metallic coat over each flank scale's bright face, the base colour left at the edges; on
  // the head (closer here than in the bowl) a lighter coat, fading out toward the snout.
  float lookX=vMapUv.x*1536.;
  lookCoat=smoothstep(1.2,3.,lookLum*uLook[0].w+uLook[3].w)*mix(.55*smoothstep(160.,360.,lookX),1.,smoothstep(400.,465.,lookX));
  diffuseColor.rgb=mix(diffuseColor.rgb,uLook[3].xyz*min(pow(max(lookLum*uLook[0].w,1e-6),uLook[0].z),1.6),lookCoat);
  #endif
  // (No paler than white tissue: a platinum or pineapple fish facing the key light would bloom.)
  diffuseColor.rgb=min(diffuseColor.rgb,vec3(.7));
 }`,
    );
    // (The coat glosses like metal: smoother, a little metallic.)
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <metalnessmap_fragment>",
      "#include <metalnessmap_fragment>\nroughnessFactor=mix(roughnessFactor,.34,lookCoat);metalnessFactor=mix(metalnessFactor,.3,lookCoat);",
    );
    // The scales' play of colour (surfaces.js skinLight) turned towards the variety's tint.
    shader.fragmentShader = shader.fragmentShader.replace(
      "vec3 irid=.5+.5*cos(6.2831853*(phase+vec3(0.,.33,.67)));",
      "vec3 irid=.5+.5*cos(6.2831853*(phase+vec3(0.,.33,.67)));\n  if(uLook[0].x>0.)irid=mix(irid,uLook[1].xyz*(.3+1.4*irid),uLook[1].w);",
    );
  };
  material.customProgramCacheKey = () => `${key}-look-${fin}-${caudal}`;
  return material;
}
