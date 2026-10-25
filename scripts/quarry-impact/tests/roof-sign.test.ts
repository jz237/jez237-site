import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ROOF_SIGN} from '../src/roof-sign';
test('derby rivals carry a number board on the roof, sized like a real one and freed with the car',()=>{
 assert.ok(ROOF_SIGN.width<=.8&&ROOF_SIGN.height<=.4,'a sign, not a billboard');
 const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8'),vehicle=readFileSync(new URL('../src/vehicle.ts',import.meta.url),'utf8'),sign=readFileSync(new URL('../src/roof-sign.ts',import.meta.url),'utf8');
 assert.ok(main.includes('const sign=roofSign(i+1);sign.position.set(0,top.y-.02,top.z*.5);car.root.add(sign);'),'stood on the model\'s own roof line');
 assert.ok(main.includes("car.root.updateMatrixWorld(true);const box=new T.Box3().setFromObject(car.model),top=car.root.worldToLocal("));
 assert.ok(vehicle.includes("{const sign=this.root.children.find(o=>o.name==='roof_sign');if(sign)disposeRoofSign(sign);}"),'no texture left behind between events');
 assert.ok(sign.includes("[face,face,edge,edge,edge,edge]"),'the number on both side faces');
});
