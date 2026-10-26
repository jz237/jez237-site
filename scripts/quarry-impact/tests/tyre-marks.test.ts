import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {RUBBER,TYRE_MARK,atWheel,markColour} from '../src/tyre-marks';
/** A striking car with wheels at (±.8, .33, ±1.3). */
function car(extended=true){
  const root=new T.Group(),wheels=[[.8,1.3],[-.8,1.3],[.8,-1.3],[-.8,-1.3]].map(([x,z])=>{const w=new T.Object3D();w.position.set(x,.33,z);root.add(w);return w;});
  root.updateMatrixWorld(true);return{extendedDamage:extended,wheels,wreckParts:{wheelLost:[false,false,false,false]},paintColor:new T.Color(0x2f4f7a)};
}
test('a contact at one of the striking car’s tyres is a tyre strike; at its bumper or the wing over the wheel it is not',()=>{
  const c=car();assert.ok(atWheel(c.wheels,c.wreckParts.wheelLost,new T.Vector3(1.1,.4,1.35)),'beside the front tyre');
  assert.ok(!atWheel(c.wheels,c.wreckParts.wheelLost,new T.Vector3(0,.5,2.3)),'the middle of the bumper');
  assert.ok(!atWheel(c.wheels,c.wreckParts.wheelLost,new T.Vector3(1,.33+TYRE_MARK.rise+.05,1.3)),'up on the wing above it');
  assert.ok(!atWheel(c.wheels,[true,false,false,false],new T.Vector3(1.1,.4,1.35)),'not a wheel that has come off');
  assert.ok(!atWheel(c.wheels,c.wreckParts.wheelLost,new T.Vector3(NaN,0,0)));
});
test('a tyre strike leaves rubber, anything else the striker’s paint; online cars only ever paint',()=>{
  const c=car(),at=new T.Vector3(1.1,.4,1.35),bumper=new T.Vector3(0,.5,2.3);
  assert.equal(markColour(c,at),RUBBER);assert.equal(markColour(c,bumper),c.paintColor);
  assert.equal(markColour(car(false),at)?.getHex(),0x2f4f7a,'online: unchanged');assert.equal(markColour(undefined,at),undefined,'a wall leaves nothing');
  assert.equal(RUBBER.getHex(),TYRE_MARK.colour);assert.ok(RUBBER.r<.1&&RUBBER.g<.1&&RUBBER.b<.1,'black rubber');
});
test('main marks with rubber where wheels strike and where a car on top presses down, with QA hooks',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes('const onA=markColour(b,point1),onB=markColour(a,point2);')&&main.includes('a?.scar(point1,scarDirection,onA);')&&main.includes('b?.scar(point2,scarDirection.clone().negate(),onB);'),'each side by the other’s wheels');
  assert.ok(main.includes('o.hit(under,new T.Vector3(0,-1,0),ON_TOP.dentDamage,elapsed,true);'),'the weight still dents it');
  assert.ok(main.includes('w.getWorldPosition(markAt);markAt.y-=vehicleWheelRadius(s.kind);if(Math.hypot(markAt.x-o.current.x,markAt.z-o.current.z)<DEFINITIONS[o.kind].halfLength){o.scar(markAt,DOWN,RUBBER);'),'each wheel on it');
  assert.ok(main.includes('tyreMarks: () => tyreMarks,')&&main.includes('markCar: (id: number, local: number[], dir: number[], times = 1) =>'));
});
