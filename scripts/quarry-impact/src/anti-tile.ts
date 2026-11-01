import * as T from 'three';
/** Breaking up a tiled floor: a photograph repeated every few metres shows its grid at a low camera. The map, normal and
 * roughness are each read three times from cells of a skewed grid (ANTI_TILE.cell repeats across), every cell shifted by
 * its own random offset and the three blended by a sharpened barycentric weight, so the repeat never lines up; offsets
 * only (no rotation), so the normals stay true. Broad patches of ANTI_TILE.patch m darken and lighten the floor a little
 * (ANTI_TILE.shade). Three samples a map instead of one, on the floor only. */
export const ANTI_TILE={cell:1.7,sharpen:6,patch:.045,shade:[.84,1.1]} as const;
const READ=`
vec2 antiTileOffset(vec2 c){return fract(sin(vec2(dot(c,vec2(127.1,311.7)),dot(c,vec2(269.5,183.3))))*43758.5453);}
vec4 antiTile(sampler2D map,vec2 uv){
 vec2 grid=mat2(1.,0.,-.57735027,1.15470054)*uv/${ANTI_TILE.cell.toFixed(2)},c=floor(grid),f=fract(grid),a,b,d;vec3 w;
 if(f.x+f.y<1.){w=vec3(1.-f.x-f.y,f.x,f.y);a=c;b=c+vec2(1,0);d=c+vec2(0,1);}else{w=vec3(f.x+f.y-1.,1.-f.x,1.-f.y);a=c+vec2(1,1);b=c+vec2(0,1);d=c+vec2(1,0);}
 w=pow(w,vec3(${ANTI_TILE.sharpen.toFixed(1)}));w/=dot(w,vec3(1.));vec2 dx=dFdx(uv),dy=dFdy(uv);
 return textureGrad(map,uv+antiTileOffset(a),dx,dy)*w.x+textureGrad(map,uv+antiTileOffset(b),dx,dy)*w.y+textureGrad(map,uv+antiTileOffset(d),dx,dy)*w.z;
}
float antiTileNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);vec2 o=vec2(0.,1.);
 return mix(mix(antiTileOffset(i).x,antiTileOffset(i+o.yx).x,f.x),mix(antiTileOffset(i+o).x,antiTileOffset(i+o.yy).x,f.x),f.y);}`;
/** Read a floor material's tiled photographs without their grid (it keeps its own shader edits and a program key of its own). */
export function antiTile(material:T.MeshStandardMaterial){
  const compile=material.onBeforeCompile,key=material.customProgramCacheKey===T.Material.prototype.customProgramCacheKey?()=>compile.toString():material.customProgramCacheKey.bind(material);
  material.onBeforeCompile=function(shader,renderer){compile.call(this,shader,renderer);
    shader.vertexShader='varying vec3 vAntiTile;\n'+shader.vertexShader.replace('#include <worldpos_vertex>','#include <worldpos_vertex>\nvAntiTile=(modelMatrix*vec4(transformed,1.)).xyz;');
    // The stock chunks, read through antiTile (they are still #include lines at this point).
    const chunk=(name:string,from:string,to:string)=>shader.fragmentShader=shader.fragmentShader.replace(`#include <${name}>`,(T.ShaderChunk as Record<string,string>)[name].replace(from,to));
    shader.fragmentShader='varying vec3 vAntiTile;\n'+READ+'\n'+shader.fragmentShader;
    chunk('map_fragment','vec4 sampledDiffuseColor = texture2D( map, vMapUv );',`vec4 sampledDiffuseColor = antiTile( map, vMapUv );
	sampledDiffuseColor.rgb *= mix(${ANTI_TILE.shade[0].toFixed(2)},${ANTI_TILE.shade[1].toFixed(2)},antiTileNoise(vAntiTile.xz*${ANTI_TILE.patch.toFixed(3)})*.65+antiTileNoise(vAntiTile.xz*${(ANTI_TILE.patch*3.1).toFixed(3)})*.35);`);
    chunk('normal_fragment_maps','vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;','vec3 mapN = antiTile( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;');
    chunk('roughnessmap_fragment','vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );','vec4 texelRoughness = antiTile( roughnessMap, vRoughnessMapUv );');};
  material.customProgramCacheKey=()=>key()+'|anti-tile';material.needsUpdate=true;return material;
}
