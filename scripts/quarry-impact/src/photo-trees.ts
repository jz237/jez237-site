import * as T from 'three';
/** Photographic trees for venue backdrops: the licensed tree photographs shipped with the quarry, each a card that turns
 * to face the camera, lit as the rounded crown it shows (sunlit on the sun's side, shaded on the other and underneath)
 * rather than as one flat upward face; the evenly lit spring photographs are toned down to a sunlit summer canopy
 * (PHOTO_TREES.crown). One draw per kind. */
export const PHOTO_TREES={aspect:{pine:461/1024,spruce:402/1024,hemlock:486/1024,maple:712/1024},crown:{lit:.62,under:.55,saturation:.78,value:.86},alphaTest:.45} as const;
export type PhotoTreeKind=keyof typeof PHOTO_TREES.aspect;
/** A tree standing at (x, y, z), `height` m tall to its crown's top, with a brightness tint (1 = as photographed). */
export type PhotoTree={kind:PhotoTreeKind;x:number;y:number;z:number;height:number;tint?:number};
/** The card material for one kind (its photograph, when there is a page to load it into). */
export function photoTreeMaterial(kind:PhotoTreeKind,map?:T.Texture|null){
  const c=PHOTO_TREES.crown,half=(PHOTO_TREES.aspect[kind]/2).toFixed(4);
  const material=new T.MeshStandardMaterial({map:map??null,alphaTest:PHOTO_TREES.alphaTest,roughness:1,color:0xbac4b0,side:T.DoubleSide});
  material.name='photo-tree-'+kind;
  material.onBeforeCompile=shader=>{
    shader.vertexShader='varying vec2 vCrown;\n'+shader.vertexShader.replace('#include <project_vertex>',`
      vec3 center=(modelMatrix*instanceMatrix*vec4(0.0,0.0,0.0,1.0)).xyz;
      vec3 right=normalize(vec3(viewMatrix[0][0],0.0,viewMatrix[2][0]));
      vec3 billboard=center+right*position.x*length(instanceMatrix[0].xyz)+vec3(0.0,position.y*length(instanceMatrix[1].xyz),0.0);
      vec4 mvPosition=viewMatrix*vec4(billboard,1.0);gl_Position=projectionMatrix*mvPosition;
      vCrown=vec2(position.x/${half},(position.y-.58)/.42);`);
    shader.fragmentShader='varying vec2 vCrown;\n'+shader.fragmentShader
      .replace('#include <map_fragment>',`#include <map_fragment>
{float luma=dot(diffuseColor.rgb,vec3(.3,.59,.11));diffuseColor.rgb=mix(vec3(luma),diffuseColor.rgb,${c.saturation.toFixed(2)})*${c.value.toFixed(2)};}`)
      // The crown as a rounded mass: its normal leans out to the card's sides, up at the top and down underneath.
      .replace('#include <normal_fragment_begin>',`#include <normal_fragment_begin>
vec3 viewUp=transformDirection(vec3(0.0,1.0,0.0),viewMatrix);
normal=normalize(vec3(vCrown.x*.9,0.0,sqrt(max(.05,1.0-dot(vCrown,vCrown)*.75)))+viewUp*(.35+vCrown.y*.65));nonPerturbedNormal=normal;`)
      // Leaves pass on and scatter some of the sun; the underside of the crown sees less of the sky.
      .replace('#include <lights_fragment_end>',`#include <lights_fragment_end>
reflectedLight.directDiffuse*=${c.lit.toFixed(2)};reflectedLight.directSpecular*=.5;reflectedLight.indirectDiffuse*=mix(${c.under.toFixed(2)},1.0,smoothstep(-.9,.6,vCrown.y));`);
  };
  material.customProgramCacheKey=()=>'photo-tree-crown-v1-'+kind;
  return material;
}
/** One instanced card mesh per kind under a group named `name`; dispose() releases every geometry, material, texture
 * and instance buffer it made. */
export function createPhotoTrees(trees:readonly PhotoTree[],name:string){
  const root=new T.Group();root.name=name;const owned:{dispose():void}[]=[],matrix=new T.Matrix4(),colour=new T.Color();
  for(const kind of Object.keys(PHOTO_TREES.aspect) as PhotoTreeKind[]){
    const list=trees.filter(t=>t.kind===kind);if(!list.length)continue;
    let map:T.Texture|null=null;
    if(typeof document!=='undefined'){map=new T.TextureLoader().load((import.meta.env?.BASE_URL??'./')+'models/'+kind+'.webp');map.colorSpace=T.SRGBColorSpace;map.anisotropy=8;owned.push(map);}
    const material=photoTreeMaterial(kind,map),geometry=new T.PlaneGeometry(PHOTO_TREES.aspect[kind],1);geometry.translate(0,.5,0);owned.push(material,geometry);
    const mesh=new T.InstancedMesh(geometry,material,list.length);mesh.name=name+'_'+kind;
    list.forEach((t,i)=>{matrix.makeScale(t.height,t.height,t.height).setPosition(t.x,t.y,t.z);mesh.setMatrixAt(i,matrix);mesh.setColorAt(i,colour.setScalar(t.tint??1));});
    mesh.computeBoundingSphere();owned.push(mesh);root.add(mesh);
  }
  let disposed=false;
  return{root,dispose(){if(disposed)return;disposed=true;root.removeFromParent();for(const o of owned)o.dispose();}};
}
