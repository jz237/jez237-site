import * as T from './vendor/three.module.js';
import {nativeIceSplashPose} from './native-ice-presentation.js';

// Authored 512px mist artwork. Original AF798 supplies the seven frame ages,
// 32-unit quad, scale and stationary position; no original texture is copied.
function mistTexture(frame){
 const canvas=document.createElement('canvas');canvas.width=canvas.height=512;
 const ctx=canvas.getContext('2d'),age=frame/6;
 function puff(x,y,r,alpha){
  const gradient=ctx.createRadialGradient(x,y,0,x,y,r);
  gradient.addColorStop(0,`rgba(235,250,255,${alpha})`);
  gradient.addColorStop(.45,`rgba(218,244,252,${alpha*.55})`);
  gradient.addColorStop(1,'rgba(218,244,252,0)');
  ctx.fillStyle=gradient;ctx.fillRect(x-r,y-r,r*2,r*2);
 }
 const fade=1-age*.88,spread=55+age*125;
 puff(256,290-age*55,60+age*70,.42*fade);
 for(let i=0;i<62;i++){
  const angle=i*2.399963229728653,radius=spread*Math.sqrt((i+.5)/62);
  const x=256+Math.cos(angle)*radius,y=280+Math.sin(angle)*radius*.72-age*55;
  puff(x,y,(7+(i*17%23))*(1+age*.65),(.28+(i*13%17)/38)*fade);
 }
 const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;
 return texture;
}
export function makeNativeIceSplashRenderer(root){
 const textures=Array.from({length:7},(_,i)=>mistTexture(i)),geometry=new T.PlaneGeometry(1,1),eye=new T.Vector3();
 const sprites=Array.from({length:8},()=>{
  const material=new T.MeshBasicMaterial({map:textures[0],transparent:true,depthWrite:false,depthTest:true,alphaTest:.005,fog:true});
  const sprite=new T.Mesh(geometry,material);sprite.visible=false;sprite.userData.dynamic=true;
  // AF798 faces each particle toward the active camera eye, including P2.
  sprite.onBeforeRender=(_renderer,_scene,camera)=>{
   camera.getWorldPosition(eye);sprite.up.set(0,eye.x===sprite.position.x&&eye.z===sprite.position.z?0:1,eye.x===sprite.position.x&&eye.z===sprite.position.z?1:0);
   sprite.lookAt(eye);sprite.updateMatrixWorld();
  };
  root.add(sprite);return sprite;
 });
 return {
  update(splashes=[]){
   for(let i=0;i<sprites.length;i++){
    const sprite=sprites[i],pose=splashes[i]?nativeIceSplashPose(splashes[i]):null;
    sprite.visible=!!pose;if(!pose)continue;
    sprite.position.set(pose.position.x,pose.position.y,pose.position.z);
    sprite.scale.set(pose.size,pose.size,1);sprite.material.map=textures[pose.frame];
   }
  },
  dispose(){for(const sprite of sprites){root.remove(sprite);sprite.material.dispose();}geometry.dispose();for(const texture of textures)texture.dispose();}
 };
}
