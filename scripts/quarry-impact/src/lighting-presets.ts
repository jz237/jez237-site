import * as T from 'three';
import {QUARRY_DAYLIGHT} from './quarry-art-direction';

/** Event lighting moods. Midday is the original daylight exactly; the others
 * regrade sun, sky, haze and exposure without moving the sun, so baked
 * backdrops and static shadow coverage stay valid. */
export type LightingPreset={label:string;overcastSky:boolean;sun:number;sunColor:number;shadow:number;ambient:number;skyColor:number;groundColor:number;sky:number;background:number;fog:number;fogColor:number;exposure:number};
export const LIGHTING_PRESETS={
 midday:{label:'Clear midday',overcastSky:false,sun:QUARRY_DAYLIGHT.sun,sunColor:QUARRY_DAYLIGHT.sunColor,shadow:1,ambient:QUARRY_DAYLIGHT.ambient,skyColor:QUARRY_DAYLIGHT.skyColor,groundColor:QUARRY_DAYLIGHT.groundColor,sky:.54,background:1,fog:QUARRY_DAYLIGHT.fog,fogColor:0xb3bdc9,exposure:QUARRY_DAYLIGHT.exposure},
 afternoon:{label:'Warm late afternoon',overcastSky:false,sun:3.0,sunColor:0xffad63,shadow:.95,ambient:.33,skyColor:0xf2c194,groundColor:0x6e5039,sky:.42,background:.8,fog:.0012,fogColor:0xdcb48f,exposure:.99},
 overcast:{label:'Overcast',overcastSky:true,sun:1.15,sunColor:0xdfe3e8,shadow:.42,ambient:.62,skyColor:0xc3ccd6,groundColor:0x6d6a63,sky:.78,background:.92,fog:.0017,fogColor:0xb2b7bc,exposure:1.08},
 dusk:{label:'Dusk · headlights on',overcastSky:false,sun:.75,sunColor:0xff7a3c,shadow:.65,ambient:.16,skyColor:0x6a6fa8,groundColor:0x2e2628,sky:.13,background:.16,fog:.0018,fogColor:0x4f4660,exposure:1.05},
} as const satisfies Record<string,LightingPreset>;
export type LightingMood=keyof typeof LIGHTING_PRESETS;
export type LightingChoice=LightingMood|'random';
export const LIGHTING_CHOICES:Record<LightingChoice,string>={midday:'Clear midday',afternoon:'Warm late afternoon',overcast:'Overcast',dusk:'Dusk · headlights on',random:'Vary every event'};
export const isLightingChoice=(value:unknown):value is LightingChoice=>typeof value==='string'&&Object.hasOwn(LIGHTING_CHOICES,value);
export const readLighting=(value:unknown):LightingChoice=>typeof value==='string'&&Object.hasOwn(LIGHTING_CHOICES,value)?value as LightingChoice:'midday';
const MOODS=Object.keys(LIGHTING_PRESETS) as LightingMood[];
/** Random picks a different mood from the previous event when it can. */
export function resolveLighting(choice:LightingChoice,previous:LightingMood|null,random:()=>number=Math.random):LightingMood{
 if(choice!=='random')return choice;
 const options=MOODS.filter(m=>m!==previous);return options[Math.min(options.length-1,Math.floor(random()*options.length))];
}
/** A soft grey cloud-deck dome for overcast events. The clear HDR stays the
 * reflection/environment source; only the visible background changes. */
export function createOvercastSky(){
 if(typeof document==='undefined')return null;
 const canvas=document.createElement('canvas');canvas.width=4;canvas.height=256;const ctx=canvas.getContext('2d');if(!ctx)return null;
 const g=ctx.createLinearGradient(0,0,0,256);
 for(const [t,c]of [[0,'#79828b'],[.3,'#9aa1a8'],[.47,'#bfc3c6'],[.5,'#c8cbcc'],[.53,'#a7a8a3'],[1,'#6f6e68']]as const)g.addColorStop(t,c);
 ctx.fillStyle=g;ctx.fillRect(0,0,4,256);
 const texture=new T.CanvasTexture(canvas);texture.mapping=T.EquirectangularReflectionMapping;texture.colorSpace=T.SRGBColorSpace;return texture;
}
export type LightingTarget={sun:T.DirectionalLight;hemisphere?:T.HemisphereLight;scene:T.Scene;renderer:{toneMappingExposure:number};skies?:{clear:T.Texture|null;overcast:T.Texture|null}};
export function applyLighting(target:LightingTarget,mood:LightingMood){
 const p:LightingPreset=LIGHTING_PRESETS[mood];
 target.sun.intensity=p.sun;target.sun.color.setHex(p.sunColor);target.sun.shadow.intensity=p.shadow;
 if(target.hemisphere){target.hemisphere.intensity=p.ambient;target.hemisphere.color.setHex(p.skyColor);target.hemisphere.groundColor.setHex(p.groundColor);}
 target.scene.environmentIntensity=p.sky;target.scene.backgroundIntensity=p.background;
 if(target.skies?.clear){const sky=p.overcastSky&&target.skies.overcast?target.skies.overcast:target.skies.clear;if(target.scene.background!==sky)target.scene.background=sky;}
 if(target.scene.fog instanceof T.FogExp2){target.scene.fog.density=p.fog;target.scene.fog.color.setHex(p.fogColor);}
 target.renderer.toneMappingExposure=p.exposure;
 return p;
}
