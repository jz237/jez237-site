import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {RIDE,ON_TOP,rammer,ridesUp,alongCar,crushedFace} from '../src/ride-up';
const car=(z:number,vz:number)=>({c:{x:0,z},f:{x:0,z:1},v:{x:0,z:vz},half:2.2});
test('a fast ram nose-first into the end of another car is a ride-up candidate; side hits and slow taps are not',()=>{
 const back=car(0,0),ram=car(-4.4,14),point={x:0,z:-2.1};
 assert.equal(rammer(RIDE.closing,ram,back,point),0,'the rammer is the car driving in');
 assert.equal(rammer(RIDE.closing,back,ram,point),1,'either order');
 assert.equal(rammer(RIDE.closing-.1,ram,back,point),-1,'too slow');
 assert.equal(rammer(RIDE.closing,{...ram,v:{x:0,z:RIDE.toward-1}},back,point),-1,'not driving into it');
 assert.equal(rammer(RIDE.closing,ram,back,{x:1.9,z:0}),-1,'a side hit');
 assert.ok(Math.abs(alongCar({x:0,z:2.2},{x:0,z:0},{x:0,z:1},2.2)-1)<1e-9);
 let n=0;for(let s=0;s<400;s++)if(ridesUp(s))n++;assert.ok(Math.abs(n/400-RIDE.chance)<.08);
 assert.equal(crushedFace(.8),0);assert.equal(crushedFace(-.8),1);assert.equal(crushedFace(0),4);
 assert.ok(ON_TOP.credit<1&&ON_TOP.crush>0);
});
test('the ride-up kicks the rammer\'s nose up, and a car on top crushes the one underneath, offline only',()=>{
 const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
 assert.ok(main.includes('if(!online?.active&&a&&b&&a.extendedDamage&&b.extendedDamage&&a.health>0&&b.health>0){'));
 assert.ok(main.includes('s.body.applyImpulseAtPoint({x:0,y:s.body.mass()*RIDE.lift,z:0},{x:nose.x,y:nose.y,z:nose.z},true);'),'at the nose');
 assert.ok(main.includes('if(s&&elapsed-(rideAt.get(s.id)??-1e9)>=RIDE.gap&&ridesUp('),'rate-limited per car');
 assert.ok(main.includes('if(o.structuralDamage)o.structuralDamage[face]=Math.min(1,o.structuralDamage[face]+ON_TOP.crush*dt);'));
 assert.ok(main.includes('o.hit(under,new T.Vector3(0,-1,0),ON_TOP.dentDamage,elapsed,true);'),'real dents from above');
 assert.ok(main.includes('toast(`ON TOP · #${o.id+1} ${DEFINITIONS[o.kind].name}`+pointsTag(DESTRUCTION_POINTS.ontop),2,2);'));
 assert.ok(main.includes('rideAt.clear();rideUps=0;onTop.clear();mounts=0;'),'reset each event');
});
