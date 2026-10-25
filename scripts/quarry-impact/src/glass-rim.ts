import * as T from 'three';
/** Glass left in the frame (offline): a side window that shatters crumbles out of its frame but leaves a ragged rim of
 * crazed crumbs stuck round the edge, GLASS_RIM.width m deep and up to GLASS_RIM.jag m more where it holds on, deeper
 * still along the bottom (GLASS_RIM.bottom) where the glass sat in the door. Drawn on the pane's own shape (dents and
 * all), cut away inside the rim; the pane itself stays gone. */
export const GLASS_RIM={width:.022,jag:.04,bottom:.035,scale:26,color:0xc4d3d4,opacity:.7} as const;
/** The pane's two in-plane axes (v the one nearest upright, so its low edge is the bottom) and its extent along them. */
export function rimAxes(box:T.Box3){
  const size=box.getSize(new T.Vector3()),dims=[0,1,2].sort((a,b)=>size.getComponent(a)-size.getComponent(b));
  const [, a, b]=dims,axis=(i:number)=>new T.Vector3(i===0?1:0,i===1?1:0,i===2?1:0);
  // Of the two broad axes, the vertical one (y) runs up the pane when it is one of them; otherwise the longer is u.
  const v=a===1||b===1?1:(size.getComponent(a)<size.getComponent(b)?a:b),u=v===a?b:a;
  return {u:axis(u),v:axis(v),bounds:new T.Vector4(box.min.getComponent(u),box.max.getComponent(u),box.min.getComponent(v),box.max.getComponent(v))};
}
/** A rim of glass for a shattered pane: the pane's geometry, drawn only within the ragged rim round its edge. */
export function glassRim(glass:T.Mesh){
  glass.geometry.computeBoundingBox();const {u,v,bounds}=rimAxes(glass.geometry.boundingBox!);
  const material=new T.MeshStandardMaterial({name:'Glass rim',color:GLASS_RIM.color,roughness:.35,metalness:0,transparent:true,opacity:GLASS_RIM.opacity,side:T.DoubleSide,depthWrite:false});
  material.onBeforeCompile=shader=>{
    Object.assign(shader.uniforms,{rimU:{value:u},rimV:{value:v},rimBounds:{value:bounds}});
    shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vRimPosition;').replace('#include <begin_vertex>','#include <begin_vertex>\nvRimPosition=position;');
    shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vRimPosition;uniform vec3 rimU;uniform vec3 rimV;uniform vec4 rimBounds;\nfloat rimHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}\nfloat rimNoise(vec2 p){vec2 i=floor(p),f=fract(p);return mix(mix(rimHash(i),rimHash(i+vec2(1.,0.)),f.x),mix(rimHash(i+vec2(0.,1.)),rimHash(i+vec2(1.,1.)),f.x),f.y);}')
      .replace('#include <color_fragment>',`#include <color_fragment>
float ru=dot(vRimPosition,rimU),rv=dot(vRimPosition,rimV);
float edge=min(min(ru-rimBounds.x,rimBounds.y-ru),min(rv-rimBounds.z,rimBounds.w-rv));
float ragged=${GLASS_RIM.width.toFixed(3)}+${GLASS_RIM.jag.toFixed(3)}*rimNoise(vec2(ru,rv)*${GLASS_RIM.scale.toFixed(1)})*rimNoise(vec2(ru,rv)*${(GLASS_RIM.scale*2.7).toFixed(1)}+7.3)+${GLASS_RIM.bottom.toFixed(3)}*(1.-smoothstep(0.,.08,rv-rimBounds.z));
if(edge>ragged)discard;
// Crazed through: pale, broken into crumbs.
float crumbs=rimNoise(vec2(ru,rv)*140.);diffuseColor.rgb*=.82+.3*crumbs;diffuseColor.a*=.75+.25*crumbs;`);
  };
  material.customProgramCacheKey=()=>'quarry-glass-rim-v1';
  const rim=new T.Mesh(glass.geometry,material);rim.name='glass_rim';rim.position.copy(glass.position);rim.quaternion.copy(glass.quaternion);rim.scale.copy(glass.scale);rim.renderOrder=glass.renderOrder;
  return rim;
}
