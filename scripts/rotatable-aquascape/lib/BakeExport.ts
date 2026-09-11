import {WATER_LEVEL} from './WaterDepth';
import * as T from 'three';

/** Development-only geometry snapshot for the offline indirect-light study. */
export function installBakeExport(scene:T.Scene){
 const button=document.createElement('button');button.textContent='Export lighting geometry';
 Object.assign(button.style,{position:'fixed',top:'150px',left:'24px',zIndex:'100',padding:'12px'});document.body.appendChild(button);
 button.onclick=async()=>{
  button.disabled=true;button.textContent='Exporting geometry…';
  try{
   scene.updateMatrixWorld(true);
   const encode=(array:Float32Array|Uint32Array)=>{const bytes=new Uint8Array(array.buffer,array.byteOffset,array.byteLength);let text='';for(let i=0;i<bytes.length;i+=8192)text+=String.fromCharCode(...bytes.subarray(i,i+8192));return btoa(text);};
   const textures=new Map<T.Texture,ImageData>();
   const pixel=(texture:T.Texture,u:number,v:number)=>{
    let image=textures.get(texture);
    if(!image){const source=texture.image as HTMLImageElement|HTMLCanvasElement,canvas=document.createElement('canvas');canvas.width=source.width;canvas.height=source.height;const ctx=canvas.getContext('2d',{willReadFrequently:true})!;ctx.drawImage(source,0,0);image=ctx.getImageData(0,0,canvas.width,canvas.height);textures.set(texture,image);}
    const p=new T.Vector2(u,v);texture.updateMatrix();texture.transformUv(p);
    const x=Math.min(image.width-1,Math.max(0,Math.floor(p.x*image.width))),y=Math.min(image.height-1,Math.max(0,Math.floor(p.y*image.height))),offset=(y*image.width+x)*4;
    return new T.Color().setRGB(image.data[offset]/255,image.data[offset+1]/255,image.data[offset+2]/255,texture.colorSpace===T.SRGBColorSpace?T.SRGBColorSpace:T.LinearSRGBColorSpace);
   };
   const meshes:unknown[]=[];let triangles=0;
   for(const object of scene.children){
    if(!(object instanceof T.Mesh)||Array.isArray(object.material))continue;
    const material=object.material;
    if(!(material instanceof T.MeshStandardMaterial)||material.transparent||material.alphaTest>0||material.emissiveIntensity>0&&material.emissive.getHex()!==0)continue;
    if(material instanceof T.MeshPhysicalMaterial&&material.transmission>0)continue;
    const bounds=new T.Box3().setFromObject(object);if(bounds.max.y<.1||bounds.min.y>WATER_LEVEL||bounds.max.z< -2.35||bounds.min.z>2.35)continue;
    const g=object.geometry,p=g.getAttribute('position'),uv=g.getAttribute('uv'),vertexColor=g.getAttribute('color');
    const positions=new Float32Array(p.count*3),colors=new Float32Array(p.count*3);
    for(let i=0;i<p.count;i++){
     positions.set([p.getX(i),p.getY(i),p.getZ(i)],i*3);const color=material.color.clone();
     if(material.map&&uv)color.multiply(pixel(material.map,uv.getX(i),uv.getY(i)));
     if(material.vertexColors&&vertexColor)color.multiply(new T.Color(vertexColor.getX(i),vertexColor.getY(i),vertexColor.getZ(i)));
     const remap=material.userData.bakeDiffuse;
     if(remap){
      const l=color.r*.2126+color.g*.7152+color.b*.0722;
      color.lerp(new T.Color(l,l,l),1-remap.saturation).multiply(new T.Color(remap.tint[0],remap.tint[1],remap.tint[2]));
      // Match the runtime curve after the map and baked-in vertex color.
      if(remap.exponent!==undefined)color.setRGB(Math.pow(Math.max(0,color.r),remap.exponent),Math.pow(Math.max(0,color.g),remap.exponent),Math.pow(Math.max(0,color.b),remap.exponent));
      color.multiplyScalar(remap.gain??1);
     }
     colors.set(color.toArray(),i*3);
    }
    const index=g.index?new Uint32Array(g.index.array):Uint32Array.from({length:p.count},(_,i)=>i);
    const count=object instanceof T.InstancedMesh?object.count:1,matrices=new Float32Array(count*16),instanceColors=new Float32Array(count*3),matrix=new T.Matrix4(),color=new T.Color();
    for(let i=0;i<count;i++){
     if(object instanceof T.InstancedMesh){object.getMatrixAt(i,matrix);matrix.premultiply(object.matrixWorld);if(object.instanceColor)object.getColorAt(i,color);else color.set(0xffffff);}else{matrix.copy(object.matrixWorld);color.set(0xffffff);}
     matrices.set(matrix.elements,i*16);instanceColors.set(color.toArray(),i*3);
    }
    triangles+=index.length/3*count;
    meshes.push({positions:encode(positions),indices:encode(index),colors:encode(colors),matrices:encode(matrices),instanceColors:encode(instanceColors),doubleSided:material.side===T.DoubleSide});
   }
   const response=await fetch('/__bake_scene',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({version:1,triangles,meshes})});
   if(!response.ok)throw Error(await response.text());button.textContent=`Exported ${triangles.toLocaleString()} triangles`;
  }catch(error){button.textContent=String(error);button.disabled=false;}
 };
}
