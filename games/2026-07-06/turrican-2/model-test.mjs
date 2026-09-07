import assert from 'node:assert/strict';
import {soldier,enemy,ship,boss,crystal} from './src/models.mjs';
const p={vx:205,vy:0,onGround:true,facing:1,morph:false,crouch:false,weapon:'spread',cooldown:0};
const hero=soldier();hero.animate(p,.1,1);const a=hero.legs[0].hip.rotation.z;hero.animate(p,.1,1.1);assert.notEqual(hero.legs[0].hip.rotation.z,a,'Running must articulate the legs');
p.onGround=false;p.vy=-200;hero.animate(p,.1,2);for(let i=0;i<20;i++)hero.animate(p,.016,2+i*.016);assert.ok(Math.abs(hero.legs[0].knee.rotation.z-1.1)<.02,'Jump smoothly tucks the legs');
p.beamActive=true;p.beamAngle=-.6;hero.animate(p,.1,3);assert.ok(hero.arm.rotation.z>.4,'Gun tracks beam aim');
p.cooldown=.12;hero.animate(p,.016,3.1);assert.ok(hero.gun.position.x<11,'Gun recoils on firing');p.cooldown=0;
p.morph=true;for(let i=0;i<30;i++)hero.animate(p,1/60,4+i/60);assert.ok(hero.ball.visible);assert.equal(hero.body.visible,false,'Morph fully retracts the armored body');
p.morph=false;for(let i=0;i<30;i++)hero.animate(p,1/60,5+i/60);assert.ok(hero.body.visible);assert.equal(hero.ball.visible,false);
let meshes=0;
for(const object of [hero,...['walker','hopper','turret','flyer','drifter','eel','spinner','egg','spawner','hugger'].map(x=>enemy(x)),...['warden','maw','gunship','colossus','queen','machine'].map(x=>boss(x)),ship()]){
  object.root.updateMatrixWorld(true);object.root.traverse(n=>{assert.ok(n.matrixWorld.elements.every(Number.isFinite),'Valid transforms');if(n.isMesh){meshes++;assert.ok(n.geometry.attributes.position.count>0);assert.ok(n.material.isMeshStandardMaterial,'Lit materials');}});
}
assert.ok(crystal().children.length>=3);assert.ok(meshes>200);
for(const key of ['warden','maw','gunship','colossus','queen','machine']){const b=boss(key);b.animate({open:true},.016,2);assert.ok(b.core.scale.x<.2&&b.core.scale.y<.2,'Boss core must remain inside its armor');}
console.log(`Verified articulated poses, morph transitions, aiming, and ${meshes} lit meshes across all actors.`);
