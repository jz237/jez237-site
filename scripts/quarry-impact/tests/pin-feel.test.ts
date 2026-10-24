import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
test('every crush tick of a pin is heard, felt by the player in it, and tells a pinned player how to get out',()=>{
 const src=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8'),body=src.slice(src.indexOf('function pinCars('),src.indexOf('/** The results line naming the rivals'));
 assert.ok(body.includes("sound.shot('impact-heavy',at,"),'a crunch each tick');
 assert.ok(body.includes('recordRumbleImpact(PIN_FEEL.pinned);toast(PIN_FEEL.hint,PIN.gap+.25,1);'),'pinned: rumble and the hint, kept up tick to tick');
 assert.ok(body.includes('recordRumbleImpact(PIN_FEEL.pinning)'),'pinning: a lighter rumble');
 assert.ok(/hint:'PINNED · ROCK IT · REVERSE \/ FORWARD'/.test(src));
 const pinnedRumble=+(src.match(/pinned:([.\d]+),pinning:([.\d]+)/)?.[1]??0),pinningRumble=+(src.match(/pinned:([.\d]+),pinning:([.\d]+)/)?.[2]??0);
 assert.ok(pinnedRumble>pinningRumble&&pinningRumble>0,'being crushed shakes harder than doing the crushing');
});
