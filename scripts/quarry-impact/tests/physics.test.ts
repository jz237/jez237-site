import test from 'node:test';
import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';
import * as T from 'three';
import { templates } from '../src/assets.ts';
import { Vehicle } from '../src/vehicle.ts';
await R.init();
const model = new T.Group();
for (const name of ['FL', 'FR', 'RL', 'RR']) {
  const wheel = new T.Group();
  wheel.name = 'wheel_' + name;
  model.add(wheel);
}
templates.set('coupe', model);
const fx = { emit() {}, mark() {}, detach() {} } as any;
function run(fps: number) {
  const world = new R.World({ x: 0, y: -9.81, z: 0 });
  world.timestep = 1 / 60;
  world.createCollider(
    R.ColliderDesc.cuboid(100, 0.5, 100).setTranslation(0, -0.5, 0),
  );
  const car = new Vehicle(0, 'coupe', 0xffffff, new T.Scene(), world, fx);
  car.place(0, 0, 0);
  for (let i = 0; i < 120; i++) {
    car.preStep(1 / 60);
    world.step();
    car.postStep(1 / 60, 0);
  }
  let accumulator = 0,
    steps = 0,
    peak = 0;
  for (let frame = 0; frame < fps * 6; frame++) {
    accumulator += 1 / fps;
    while (accumulator + 1e-9 >= 1 / 60) {
      car.input = {
        throttle: steps < 180 ? 1 : 0,
        brake: steps >= 180 ? 1 : 0,
        steer: 0,
        handbrake: false,
      };
      car.preStep(1 / 60);
      world.step();
      car.postStep(1 / 60, steps / 60);
      peak = Math.max(peak, car.speed);
      steps++;
      accumulator -= 1 / 60;
    }
    car.render(Math.max(0, accumulator / (1 / 60)));
  }
  const result = {
    z: car.current.z,
    y: car.current.y,
    speed: car.speed,
    peak,
    steps,
  };
  car.dispose();
  world.free();
  return result;
}
test('actual vehicle simulation travels and brakes identically at 30, 60 and 144 render FPS', () => {
  const runs = [30, 60, 144].map(run);
  for (const r of runs) {
    assert.equal(r.steps, 360);
    assert.ok(r.peak > 12);
    assert.ok(Math.abs(r.speed) < 0.1);
    assert.ok(r.y > 0.6 && r.y < 1);
    assert.ok(Math.abs(r.z - runs[0].z) < 0.001);
  }
});
