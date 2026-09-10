import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {fishPosition,fishCoordinates,clearHardscape,fitLeaf} from '../lib/TankSpace.ts';
test('tank conversion preserves body spacing in all three dimensions',()=>{
 const a=fishPosition(900,340,.25),b=fishPosition(950,370,.75);
 assert.ok(Math.abs(a.distanceTo(b)-Math.hypot(50,30,.5*180)*.014)<1e-10);
 const result=fishCoordinates(a);assert.ok(Math.abs(result.x-900)+Math.abs(result.y-340)+Math.abs(result.z-.25)<1e-10);
});
test('overlapping hardscape envelopes resolve finite positions outside solids',()=>{
 const obstacles=[{center:new T.Vector3(0,1,0),radius:.5},{center:new T.Vector3(.5,1,0),radius:.3}];
 for(let x=-.6;x<1;x+=.03){const p=clearHardscape(new T.Vector3(x,1,.1),obstacles);assert.ok(Number.isFinite(p.length()));for(const o of obstacles)assert.ok(p.distanceTo(o.center)>=o.radius+.23-1e-5);}
 const p=clearHardscape(new T.Vector3(0,1,0),obstacles);assert.ok(Number.isFinite(p.length()));
});
test('leaves at the tank edge stay inside the glass after sizing',()=>{
 const geo=new T.BufferAttribute(new Float32Array([0,0,0,0,2,0,.2,1,.5,-.2,1,-.5]),3),o=new T.Object3D();o.position.set(4.7,.6,1.9);o.rotation.z=-.8;o.updateMatrix();fitLeaf(o,geo);
 for(let i=0;i<geo.count;i++){const p=new T.Vector3().fromBufferAttribute(geo,i).applyMatrix4(o.matrix);assert.ok(Math.abs(p.x)<4.96&&Math.abs(p.z)<2.2&&p.y<5.25);}
});
