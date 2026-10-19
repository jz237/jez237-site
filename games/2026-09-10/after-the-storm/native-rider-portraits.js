import * as T from './vendor/three.module.js';

/** Render existing detailed models at their actual display pixel size. This
 * owns only temporary targets/clones; shared model geometry and materials,
 * the main canvas size and its resolution policy remain untouched. */
export function createNativeRiderPortraits({renderer,vesselForAvatar,environment,document=globalThis.document}={}){
 const cache=new Map();
 // Gameplay userData contains live rig graphs. Object3D.clone serializes that
 // graph; copy the visible render tree only, retaining its shared geometry.
 function renderTree(source){
  const node=source.isMesh?new T.Mesh(source.userData.detailGeometry??source.geometry,source.material):source.isPoints?new T.Points(source.geometry,source.material):
   source.isLineSegments?new T.LineSegments(source.geometry,source.material):source.isLine?new T.Line(source.geometry,source.material):new T.Group();
  node.position.copy(source.position);node.quaternion.copy(source.quaternion);node.scale.copy(source.scale);
  node.renderOrder=source.renderOrder;node.frustumCulled=source.frustumCulled;
  if(source.morphTargetInfluences)node.morphTargetInfluences=[...source.morphTargetInfluences];
  for(const child of source.children)if(child.visible)node.add(renderTree(child));return node;
 }
 function portrait(avatar,width,height){
  width=Math.max(256,Math.ceil(width));height=Math.max(128,Math.ceil(height));
  const key=`${avatar}:${width}:${height}`;if(cache.has(key))return cache.get(key);
  const original=vesselForAvatar(avatar);if(!original?.isObject3D)throw new TypeError('Supply the actual rider model');
  const model=renderTree(original);model.position.set(0,0,0);model.rotation.set(0,0,0);model.visible=true;
  model.updateMatrixWorld(true);
  const box=new T.Box3().setFromObject(model),center=box.getCenter(new T.Vector3()),size=box.getSize(new T.Vector3());
  if(!Number.isFinite(size.length())||size.length()===0)throw new RangeError('Empty rider portrait model');
  model.position.sub(center);
  const scene=new T.Scene();scene.environment=typeof environment==='function'?environment():environment;
  scene.add(model,new T.HemisphereLight(0xc9e9ff,0x34434d,2.2));
  const sun=new T.DirectionalLight(0xffe7c2,3.5);sun.position.set(5,7,4);scene.add(sun);
  const radius=size.length()*.5,aspect=width/height,half=Math.max(size.y*.65,radius/aspect)*1.16;
  const camera=new T.OrthographicCamera(-half*aspect,half*aspect,half,-half,.01,radius*12);
  camera.position.set(radius*2.5,radius*.95,radius*2.6);camera.lookAt(0,0,0);
  camera.updateMatrixWorld(true);model.updateMatrixWorld(true);
  const projected=new T.Box3(),bounds=new T.Box3().setFromObject(model);
  for(const x of [bounds.min.x,bounds.max.x])for(const y of [bounds.min.y,bounds.max.y])for(const z of [bounds.min.z,bounds.max.z])
   projected.expandByPoint(new T.Vector3(x,y,z).applyMatrix4(camera.matrixWorldInverse));
  const fit=Math.max((projected.max.y-projected.min.y)/2,(projected.max.x-projected.min.x)/(2*aspect))*1.08;
  const cx=(projected.min.x+projected.max.x)/2,cy=(projected.min.y+projected.max.y)/2;
  Object.assign(camera,{left:cx-fit*aspect,right:cx+fit*aspect,top:cy+fit,bottom:cy-fit});camera.updateProjectionMatrix();
  const target=new T.WebGLRenderTarget(width,height,{depthBuffer:true});
  target.texture.colorSpace=T.SRGBColorSpace;
  const prior={target:renderer.getRenderTarget(),viewport:renderer.getViewport(new T.Vector4()),
   scissor:renderer.getScissor(new T.Vector4()),scissorTest:renderer.getScissorTest(),clear:renderer.getClearColor(new T.Color()),
   alpha:renderer.getClearAlpha(),autoClear:renderer.autoClear,xr:renderer.xr.enabled};
  const pixels=new Uint8Array(width*height*4);
  try{
   renderer.xr.enabled=false;renderer.autoClear=true;renderer.setRenderTarget(target);renderer.setViewport(0,0,width,height);
   renderer.setScissorTest(false);renderer.setClearColor(0x071e2e,1);renderer.clear();renderer.render(scene,camera);
   renderer.readRenderTargetPixels(target,0,0,width,height,pixels);
  }finally{
   renderer.setRenderTarget(prior.target);renderer.setViewport(prior.viewport);renderer.setScissor(prior.scissor);
   renderer.setScissorTest(prior.scissorTest);renderer.setClearColor(prior.clear,prior.alpha);
   renderer.autoClear=prior.autoClear;renderer.xr.enabled=prior.xr;target.dispose();
  }
  const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
  const context=canvas.getContext('2d'),image=context.createImageData(width,height),stride=width*4;
  for(let y=0;y<height;y++)image.data.set(pixels.subarray((height-y-1)*stride,(height-y)*stride),y*stride);
  context.putImageData(image,0,0);const url=canvas.toDataURL('image/png');cache.set(key,url);return url;
 }
 return {portrait,clear(){cache.clear();}};
}
