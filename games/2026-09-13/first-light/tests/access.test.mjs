import test from 'node:test';import assert from 'node:assert/strict';
import {TEXT_SIZES,accessClasses,simpleFightInput,simpleHookDue,SIMPLE} from '../access-model.js';
test('text sizes map to an interface zoom and the HUD palettes to body classes',()=>{
 assert.equal(accessClasses({}).zoom,1);assert.equal(accessClasses({textSize:'large'}).zoom,TEXT_SIZES.large);assert.ok(TEXT_SIZES.larger>TEXT_SIZES.large&&TEXT_SIZES.large>1);
 assert.deepEqual(accessClasses({hudMode:'contrast',simple:true,reduceMotion:true}).classes,['hud-contrast','simple-controls','reduce-motion']);
 assert.deepEqual(accessClasses({hudMode:'colorsafe'}).classes,['hud-colorsafe']);assert.deepEqual(accessClasses({hudMode:'standard'}).classes,[]);
});
test('simplified controls hand the fight to the controller only while the player is not pressing anything, and set the hook a beat after the take',()=>{
 const ai={reeling:.9,sidePressure:1,rodUp:.75},player={reeling:1,sidePressure:0,rodUp:.6};
 assert.deepEqual(simpleFightInput({reeling:false,sidePressure:false,rodUpHeld:false},ai,player),ai);
 assert.deepEqual(simpleFightInput({reeling:true,sidePressure:false,rodUpHeld:false},ai,player),player);
 assert.deepEqual(simpleFightInput(null,ai,player),ai);
 assert.equal(simpleHookDue('bite',10,10.2),false);assert.equal(simpleHookDue('bite',10,10+SIMPLE.hooksetDelay),true);assert.equal(simpleHookDue('retrieve',10,20),false);
});
