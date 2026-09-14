import test from 'node:test';import assert from 'node:assert/strict';
import {RIPPLE_TIERS,cflNumber,stepRippleCPU,rippleEnergy,splat,RIPPLE} from '../ripple-math.js';
test('the wave scheme is stable at every tier (CFL at or under 0.5)',()=>{for(const [name,t] of Object.entries(RIPPLE_TIERS))assert.ok(cflNumber(t.res)<=.5,name+' cfl '+cflNumber(t.res));});
test('a splash spreads, decays and never produces NaN',()=>{
 const res=96;let h=new Float32Array(res*res),hp=new Float32Array(res*res);splat(h,res,48,48,2.5,.05);hp.set(h);
 let early=0,late=0;const centreEarly=h[48*res+48];
 for(let n=0;n<600;n++){const next=stepRippleCPU(h,hp,res);hp=h;h=next;if(n===40)early=rippleEnergy(h,hp);if(n===599)late=rippleEnergy(h,hp);for(let i=0;i<h.length;i+=997)assert.ok(Number.isFinite(h[i]));}
 assert.ok(late<early*.5,'energy decays: '+early+' -> '+late);
 assert.ok(Math.abs(h[48*res+48])<centreEarly*.2,'the centre settles');
 let ring=0;for(let x=0;x<res;x++)ring=Math.max(ring,Math.abs(h[20*res+x]));assert.ok(ring>0,'the ring reached 28 cells out');
});
test('constants describe a 48 m atlas with capillary-gravity speed',()=>{assert.equal(RIPPLE.span,48);assert.ok(RIPPLE.c>.3&&RIPPLE.c<1);});
