import test from 'node:test';
import assert from 'node:assert/strict';
import {warningLine,tankWarning,cableWarnings,HUD_WARNINGS} from '../src/hud-warnings';
test('the HUD warns of a dragging or lost fuel tank and parted throttle and handbrake cables',()=>{
 assert.equal(tankWarning(true,false),'FUEL TANK DOWN');assert.equal(tankWarning(true,true),'NO FUEL TANK');assert.equal(tankWarning(false,false),'');
 assert.deepEqual(cableWarnings(true,true),['THROTTLE LIMP','NO HANDBRAKE']);assert.deepEqual(cableWarnings(false,false),['','']);
});
test('a lost tank ranks near the top (the car is on fumes); the limp throttle and the handbrake take their places among the rest',()=>{
 const line=warningLine(['TYRE RUBBING','NO FUEL TANK','CLUTCH SLIPPING','THROTTLE LIMP','NO HANDBRAKE'],5);
 assert.ok(line.startsWith('NO FUEL TANK'),line);
 assert.ok(line.indexOf('NO HANDBRAKE')<line.indexOf('THROTTLE LIMP')&&line.indexOf('THROTTLE LIMP')<line.indexOf('CLUTCH SLIPPING'));
 assert.ok(HUD_WARNINGS.max>=3);
});
