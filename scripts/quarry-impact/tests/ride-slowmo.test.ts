import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {RIDE_SLOWMO} from '../src/ride-up';
import {SMASH} from '../src/damage-rules';
test('the player\'s own ride-ups play out in slow motion with the steel grinding, like a big smash',()=>{
 assert.ok(RIDE_SLOWMO.seconds>SMASH.slowmo&&RIDE_SLOWMO.scale===SMASH.scale,'a touch longer than a smash, at the same speed');
 const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
 assert.ok(main.includes('if(!demo&&(a.id===0||b.id===0)){if(clock>=slowMoUntil){slowMoUntil=clock+RIDE_SLOWMO.seconds;slowMoScale=RIDE_SLOWMO.scale;}'),'only the player\'s, never over a slow motion already running');
 assert.ok(main.includes("sound.clip('metal-groan',nose,.8,1.2);recordRumbleImpact(.8);"));
});
