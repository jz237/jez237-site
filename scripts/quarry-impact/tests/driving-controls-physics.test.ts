import test from 'node:test';
import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';
import * as T from 'three';
import {templates} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {defaultControls,drivingInput} from '../src/driving-controls';
await R.init();
const model=new T.Group();for(const name of ['FL','FR','RL','RR']){const wheel=new T.Group();wheel.name='wheel_'+name;model.add(wheel);}templates.set('coupe',model);
function run(key:string,assist=0){
 const world=new R.World({x:0,y:-9.81,z:0});world.timestep=1/60;world.createCollider(R.ColliderDesc.cuboid(500,.5,500).setTranslation(0,-.5,0));const car=new Vehicle(0,'coupe',0xffffff,new T.Scene(),world,{emit(){},mark(){},detach(){}} as any);car.place(0,0,0);const config=defaultControls();config.speedAssist=assist;
 for(let i=0;i<300;i++){car.input=drivingInput(config,new Set(i<120?[]:i<270?['KeyW']:['KeyW',key]),[],car.speed);car.preStep(1/60);world.step();car.postStep(1/60,i/60);}
 const result={x:car.current.x,steering:car.steering,speed:car.speed};car.dispose();world.free();return result;
}
test('real Rapier driving turns left/right consistently for arrows and letter bindings',()=>{const left=run('KeyA'),arrowLeft=run('ArrowLeft'),right=run('KeyD'),arrowRight=run('ArrowRight');assert.deepEqual(arrowLeft,left);assert.deepEqual(arrowRight,right);assert.ok(left.x<-.05,JSON.stringify(left));assert.ok(right.x>.05,JSON.stringify(right));});
test('optional assist lowers the real front wheel steering angle at speed',()=>{const stock=run('KeyD'),assisted=run('KeyD',1);assert.ok(stock.speed>5);assert.ok(assisted.steering>0);assert.ok(assisted.steering<stock.steering*.9,JSON.stringify({stock,assisted}));});
