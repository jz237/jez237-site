import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {LITTER,CrashLitter} from '../src/crash-litter';
test('a big hit knocks off flakes of the car\'s own paint (some bare primer), a blowout leaves lumps of tyre',()=>{
 const litter=new CrashLitter(new T.Scene()),flat=()=>0,colour=new T.Color();
 assert.equal(litter.scatter(new T.Vector3(0,1,0),'paint',3,flat,undefined,0x2f6fd8,12),12,'as many flakes as the hit asks for');
 const colours=Array.from({length:12},(_,i)=>{litter.mesh.getColorAt(i,colour);return colour.clone();});
 assert.ok(colours.filter((c,i)=>i%3!==2).every(c=>c.b>c.r*1.6),'in the car\'s paint (blue)');assert.ok(colours.filter((c,i)=>i%3===2).every(c=>Math.abs(c.r-c.b)<.12),'every third bare primer');
 litter.reset();assert.equal(litter.scatter(new T.Vector3(0,1,0),'rubber',3,flat),LITTER.rubber.count);litter.mesh.getColorAt(0,colour);assert.ok(colour.r<.05&&colour.g<.05,'black rubber');
 const size=new T.Vector3(),m=new T.Matrix4();litter.mesh.getMatrixAt(0,m);m.decompose(new T.Vector3(),new T.Quaternion(),size);assert.ok(size.x>=LITTER.rubber.size[0]-1e-6,'chunky');
 assert.equal(litter.scatter(new T.Vector3(),'paint',1,flat,undefined,0xffffff,500),40,'a scatter never floods the floor');assert.equal(litter.scatter(new T.Vector3(),'paint',1,flat,undefined,0xffffff,-3),0);
 assert.deepEqual({paint:litter.breaks.paint,rubber:litter.breaks.rubber},{paint:2,rubber:1},'counted since the reset');
});
test('offline cars flake paint on hits of LITTER.paint.min or more and drop rubber on a blowout, keeping the blowout sound',()=>{
 const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8'),vehicle=readFileSync(new URL('../src/vehicle.ts',import.meta.url),'utf8');
 assert.ok(vehicle.includes("    this.impactSerial++;\n    if(this.extendedDamage&&!quiet)this.onPaintChips?.(point,damage);"),'every damaging, non-replay hit');
 assert.ok(main.includes("car.onPaintChips=(p,damage)=>{if(damage>=LITTER.paint.min)fx.scatterLitter(p,'paint',car.id*139+(++n),car.current,car.paintColor.getHex(),Math.min(LITTER.paint.most,damage*.8));};car.onBlowout=p=>{burst?.(p);fx.scatterLitter(p,'rubber',car.id*149+(++n),car.current);};"));
 assert.ok(main.indexOf("car.onBlowout=p=>sound.blowout(p);")<main.indexOf("const burst=car.onBlowout"),'the sound is set first, then chained');
});
