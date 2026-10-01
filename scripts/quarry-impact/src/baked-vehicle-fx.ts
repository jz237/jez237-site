import * as T from 'three';

export type BakedVehicleFX={fire:T.Texture;smoke:T.Texture};
let ready:BakedVehicleFX|undefined;
let pending:Promise<void>|undefined;
/** One shared upload per atlas across all cars and event restarts. */
export function prepareBakedVehicleFX(){
  if(!pending)pending=(async()=>{
    const loader=new T.TextureLoader(),textures=await Promise.all(['fire','smoke'].map(k=>loader.loadAsync(import.meta.env.BASE_URL+'assets/fx/vehicle-'+k+'-baked.png')));
    for(const texture of textures){texture.colorSpace=T.SRGBColorSpace;texture.minFilter=texture.magFilter=T.LinearFilter;texture.generateMipmaps=false;texture.wrapS=texture.wrapT=T.ClampToEdgeWrapping;}
    ready={fire:textures[0],smoke:textures[1]};
  })().catch(error=>{console.warn('Baked vehicle effects unavailable; using volume fallback.',error);});
  return pending;
}
export function bakedVehicleFX(){return ready;}
