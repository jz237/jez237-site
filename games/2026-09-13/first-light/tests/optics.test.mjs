import test from 'node:test';import assert from 'node:assert/strict';
import {fresnelWaterToAir,fresnelAirToWater,SNELL_WINDOW_DEG,underwaterFogDensity} from '../optics.js';
test("Snell's window is 48.6 degrees and reflectance is total beyond it",()=>{
 assert.ok(Math.abs(SNELL_WINDOW_DEG-48.6)<.1);
 const at=deg=>fresnelWaterToAir(Math.cos(deg*Math.PI/180));
 assert.ok(Math.abs(at(0)-.02)<.003,'2% at normal incidence: '+at(0));
 assert.ok(at(30)<.1&&at(45)<.6,'inside the window the surface is mostly transparent');
 assert.equal(at(50),1);assert.equal(at(80),1);
 assert.ok(at(46)>at(40)&&at(48)>at(46),'reflectance rises steeply toward the critical angle');
});
test('the two Fresnel splits agree at normal incidence',()=>{assert.ok(Math.abs(fresnelWaterToAir(1)-fresnelAirToWater(1))<1e-9);});
test('murkier water fogs sooner',()=>{assert.ok(underwaterFogDensity(.6)>underwaterFogDensity(1)&&underwaterFogDensity(1)>underwaterFogDensity(1.4));assert.ok(underwaterFogDensity(1)>.07&&underwaterFogDensity(1)<.2);});
