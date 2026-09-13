import * as T from 'three';

/** Reuse each view's opaque color for physical glass instead of drawing the
 * complete opaque scene a second time. All geometry, textures, refraction
 * equations and capture dimensions are retained. */
export class SceneRefraction {
 private copies=new Map<T.Camera,T.WebGLRenderTarget>();
 private glass=new Set<T.MeshPhysicalMaterial>();
 private sampler={value:null as T.Texture|null};
 private size={value:new T.Vector2()};
 private originalRender:T.WebGLRenderer['render'];
 private originalShadows:T.WebGLRenderer['shadowMap']['render'];
 private opaqueMaterials:Map<T.Material,boolean>|null=null;
 private renderer:T.WebGLRenderer;private scene:T.Scene;
 constructor(renderer:T.WebGLRenderer,scene:T.Scene){
  this.renderer=renderer;this.scene=scene;
  this.originalRender=renderer.render.bind(renderer);
  this.originalShadows=renderer.shadowMap.render.bind(renderer.shadowMap);
  renderer.shadowMap.render=(lights,world,camera)=>{
   const materials=this.opaqueMaterials;
   if(!materials||!renderer.shadowMap.enabled||!renderer.shadowMap.autoUpdate&&!renderer.shadowMap.needsUpdate)return this.originalShadows(lights,world,camera);
   // Run inside Three's initialized render state, with all original casters.
   for(const [material,visible] of materials)material.visible=visible;
   try{this.originalShadows(lights,world,camera);}
   finally{for(const [material,visible] of materials)material.visible=visible&&!material.transparent;}
  };
  scene.traverse(object=>{
   if(!(object instanceof T.Mesh))return;
   for(const material of Array.isArray(object.material)?object.material:[object.material]){
    if(!(material instanceof T.MeshPhysicalMaterial)||material.transmission<=0||this.glass.has(material))continue;
    this.glass.add(material);
    const transmission=material.transmission,compile=material.onBeforeCompile,key=material.customProgramCacheKey();
    material.userData.aquariumTransmission=true;
    material.defines={...material.defines,USE_TRANSMISSION:''};
    material.transmission=0;material.transparent=true;
    material.onBeforeCompile=(shader,r)=>{
     compile.call(material,shader,r);
     Object.assign(shader.uniforms,{transmission:{value:transmission},thickness:{value:material.thickness},attenuationDistance:{value:material.attenuationDistance},attenuationColor:{value:material.attenuationColor},transmissionSamplerMap:this.sampler,transmissionSamplerSize:this.size});
    };
    material.customProgramCacheKey=()=>key+'-reused-opaque-refraction-v1';material.needsUpdate=true;
   }
  });
  // Preserve Three's transmissive-before-transparent order, including pane
  // material groups, without putting glass in its duplicate-render queue.
  renderer.setTransparentSort((a,b)=>{
   const glassOrder=Number(!!b.material.userData.aquariumTransmission)-Number(!!a.material.userData.aquariumTransmission);
   return glassOrder||a.groupOrder-b.groupOrder||a.renderOrder-b.renderOrder||b.z-a.z||a.id-b.id;
  });
  renderer.render=(world,camera)=>{
   if(world!==scene||scene.overrideMaterial||!renderer.getRenderTarget())return this.originalRender(world,camera);
   this.renderView(camera);
  };
 }
 private renderView(camera:T.Camera){
  const r=this.renderer,target=r.getRenderTarget()!;
  const materials=new Map<T.Material,boolean>();
  this.scene.traverseVisible(object=>{
   if(object instanceof T.Mesh||object instanceof T.Line||object instanceof T.Points)
    for(const material of Array.isArray(object.material)?object.material:[object.material])materials.set(material,material.visible);
  });
  // Shadow casters must keep their original visibility (including animal fins).
  // Reflection views reuse this same frame's maps.
  const clear=r.autoClear,background=this.scene.background,mipmaps=target.texture.generateMipmaps;
  const previousSampler=this.sampler.value,previousSize=this.size.value.clone();
  try{
   target.texture.generateMipmaps=false;
   for(const [material,visible] of materials)material.visible=visible&&!material.transparent;
   this.opaqueMaterials=materials;
   this.originalRender(this.scene,camera);
   this.opaqueMaterials=null;
   let copy=this.copies.get(camera);
   if(!copy){copy=new T.WebGLRenderTarget(target.width,target.height,{type:target.texture.type,depthBuffer:false,generateMipmaps:true,minFilter:T.LinearMipmapLinearFilter});this.copies.set(camera,copy);}
   copy.setSize(target.width,target.height);r.initRenderTarget(copy);
   // render() has resolved the opaque MSAA color. Copying it avoids redoing
   // millions of vertex transforms and shaded fragments for glass alone.
   r.copyTextureToTexture(target.texture,copy.texture);r.setRenderTarget(target);
   this.sampler.value=copy.texture;this.size.value.set(target.width,target.height);
   for(const [material,visible] of materials)material.visible=visible&&material.transparent;
   r.autoClear=false;this.scene.background=null;target.texture.generateMipmaps=mipmaps;
   this.originalRender(this.scene,camera);
  }finally{
   this.opaqueMaterials=null;
   for(const [material,visible] of materials)material.visible=visible;
   r.autoClear=clear;this.scene.background=background;target.texture.generateMipmaps=mipmaps;
   this.sampler.value=previousSampler;this.size.value.copy(previousSize);r.setRenderTarget(target);
  }
 }
 dispose(){for(const copy of this.copies.values())copy.dispose();this.copies.clear();this.renderer.render=this.originalRender;this.renderer.shadowMap.render=this.originalShadows;this.renderer.setTransparentSort(null);}
}
