import test from 'node:test';import assert from 'node:assert/strict';import * as T from 'three';
import {LIGHTING_PRESETS,LIGHTING_CHOICES,readLighting,resolveLighting,applyLighting} from '../src/lighting-presets';
import {QUARRY_DAYLIGHT} from '../src/quarry-art-direction';
const target=()=>{const scene=new T.Scene();scene.fog=new T.FogExp2(0xb3bdc9,QUARRY_DAYLIGHT.fog);const sun=new T.DirectionalLight(QUARRY_DAYLIGHT.sunColor,QUARRY_DAYLIGHT.sun),hemisphere=new T.HemisphereLight(QUARRY_DAYLIGHT.skyColor,QUARRY_DAYLIGHT.groundColor,QUARRY_DAYLIGHT.ambient);scene.environmentIntensity=.54;return{scene,sun,hemisphere,renderer:{toneMappingExposure:QUARRY_DAYLIGHT.exposure}};};
test('midday reproduces the original daylight exactly',()=>{
 const before=target(),after=target();applyLighting(after,'midday');
 assert.equal(after.sun.intensity,before.sun.intensity);assert.equal(after.sun.color.getHex(),before.sun.color.getHex());assert.equal(after.sun.shadow.intensity,1);
 assert.equal(after.hemisphere.intensity,before.hemisphere.intensity);assert.equal(after.hemisphere.color.getHex(),before.hemisphere.color.getHex());assert.equal(after.hemisphere.groundColor.getHex(),before.hemisphere.groundColor.getHex());
 assert.equal(after.scene.environmentIntensity,.54);assert.equal(after.scene.backgroundIntensity,1);assert.equal(after.renderer.toneMappingExposure,before.renderer.toneMappingExposure);
 assert.equal((after.scene.fog as T.FogExp2).density,QUARRY_DAYLIGHT.fog);assert.equal((after.scene.fog as T.FogExp2).color.getHex(),0xb3bdc9);
});
test('afternoon and overcast regrade light, haze and sky; overcast swaps only the visible sky',()=>{
 const t=target(),clear=new T.Texture(),overcast=new T.Texture();t.scene.background=clear;
 applyLighting({...t,skies:{clear,overcast}},'afternoon');assert.equal(t.scene.background,clear);const warm=t.sun.color;assert.ok(warm.r>warm.b+.2,'warm sun');
 applyLighting({...t,skies:{clear,overcast}},'overcast');assert.equal(t.scene.background,overcast);assert.ok(t.sun.intensity<2&&t.sun.shadow.intensity<.6,'soft overcast light');assert.ok((t.scene.fog as T.FogExp2).density>QUARRY_DAYLIGHT.fog);
 applyLighting({...t,skies:{clear,overcast}},'midday');assert.equal(t.scene.background,clear);
 for(const p of Object.values(LIGHTING_PRESETS))for(const v of [p.sun,p.shadow,p.ambient,p.sky,p.background,p.fog,p.exposure])assert.ok(Number.isFinite(v)&&v>=0);
});
test('saved choices are validated and random never repeats the previous mood',()=>{
 assert.equal(readLighting(undefined),'midday');assert.equal(readLighting('bogus'),'midday');for(const k of Object.keys(LIGHTING_CHOICES))assert.equal(readLighting(k),k);
 for(let i=0;i<50;i++){const r=()=>((i*7919)%101)/101;for(const prev of ['midday','afternoon','overcast']as const)assert.notEqual(resolveLighting('random',prev,r),prev);}
 assert.equal(resolveLighting('overcast','overcast'),'overcast');assert.ok(['midday','afternoon','overcast'].includes(resolveLighting('random',null,()=>.999)));
});
