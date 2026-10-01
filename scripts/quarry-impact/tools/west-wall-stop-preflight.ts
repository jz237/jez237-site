/** CPU-only, normal-chase benchmark positions. This audits the real vehicle
 * against the current shared world; it does not claim measured rendering time. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import { templates } from '../src/assets';
import { Vehicle } from '../src/vehicle';
import { createQuarryPhysics, quarryColliderLayout } from '../src/quarry-layout';
import { backdropGroundHeight } from '../src/scenery-backdrop';

const hash = (file: string) => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
export function prepareWestWallStops() {
  const trunks = quarryColliderLayout().filter(c => c.shape === 'cylinder' && c.id.startsWith('tree-'));
  const stops = [
    // Step back from the old pose so the upper face fits the grounded chase FOV.
    { id: 'west-wall-close', x: -100, z: 59, targetCenter: [-150, 17, 78] },
    { id: 'west-wall-oblique', x: -81, z: 78, targetCenter: [-135, 15, 109] },
  ].map(spec => {
    const ground = backdropGroundHeight(spec.x, spec.z);
    const yaw = Math.atan2(spec.targetCenter[0] - spec.x, spec.targetCenter[2] - spec.z);
    const slope = Math.hypot((backdropGroundHeight(spec.x + 2, spec.z) - backdropGroundHeight(spec.x - 2, spec.z)) / 4,
      (backdropGroundHeight(spec.x, spec.z + 2) - backdropGroundHeight(spec.x, spec.z - 2)) / 4);
    const trunkClearance = Math.min(...trunks.map(c => Math.hypot(spec.x - c.p.x, spec.z - c.p.z) - (c.shape === 'cylinder' ? c.radius : 0)));
    assert.ok(slope < .2 && trunkClearance > 4.2, spec.id + ' has a clear, gently sloped placement');
    return { ...spec, kind: 'west-wall', ground, yaw, slope, trunkClearance };
  });
  return { kind: 'west-wall-normal-chase-placement-preflight', stops,
    layoutSha256: hash('src/quarry-layout.ts'),
    collisionSha256: fs.existsSync('src/quarry-west-wall-collision.json') ? hash('src/quarry-west-wall-collision.json') : null,
    browserLaunched: false, measuredFrames: 0 };
}

export async function auditWestWallStops(plan = prepareWestWallStops()) {
  await R.init();
  const previous = templates.get('coupe'), model = new T.Group();
  for (const name of ['FL', 'FR', 'RL', 'RR']) { const wheel = new T.Group(); wheel.name = 'wheel_' + name; model.add(wheel); }
  templates.set('coupe', model);
  const results: any[] = [];
  try {
    for (const stop of plan.stops) {
      const world = new R.World({ x: 0, y: -9.81, z: 0 }); world.timestep = 1 / 60;
      const physics = createQuarryPhysics(R, world, true), ids = new Map([...physics.statics].map(([id, c]) => [c.handle, id]));
      const objects = [...physics.statics].filter(([id]) => !['terrain', 'quarry-cliffs', 'quarry-cut', 'quarry-extension', 'quarry-headwall', 'quarry-west-wall', 'quarry-roadside'].includes(id));
      const car = new Vehicle(0, 'coupe', 0xffffff, new T.Scene(), world, { emit() {}, mark() {}, detach() {} } as any);
      const contacts = new Set<string>(); let drift = 0, settledSpeed = 0, wheelContacts = 4;
      let nearest = { distance: Infinity, id: '', seconds: 0 };
      try {
        car.place(stop.x, stop.z, stop.yaw);
        const initial = { ...car.body.translation() };
        for (let step = 0; step < 960; step++) {
          car.input = { throttle: 0, steer: 0, brake: 1, handbrake: false };
          car.preStep(1 / 60); world.step(); car.postStep(1 / 60, step / 60);
          const p = car.body.translation(), v = car.body.linvel();
          drift = Math.max(drift, Math.hypot(p.x - stop.x, p.z - stop.z));
          if (step >= 300) {
            settledSpeed = Math.max(settledSpeed, Math.hypot(v.x, v.y, v.z));
            wheelContacts = Math.min(wheelContacts, [0, 1, 2, 3].filter(i => car.controller.wheelIsInContact(i)).length);
          }
          for (const body of [car.collider, car.roof]) {
            world.contactPairsWith(body, other => {
              const id = ids.get(other.handle);
              if (id && id !== 'terrain') world.contactPair(body, other, manifold => { if (manifold.numSolverContacts()) contacts.add(id); });
            });
            if (step === 0 || step === 959) for (const [id, object] of objects) {
              const contact = body.contactCollider(object, 10);
              if (contact && contact.distance < nearest.distance) nearest = { id, distance: contact.distance, seconds: (step + 1) / 60 };
            }
          }
        }
        const result = { id: stop.id, initial, final: { ...car.body.translation() }, maximumPlanarDrift: drift,
          maximumSettledSpeed: settledSpeed, minimumSettledWheelContacts: wheelContacts,
          objectContactIds: [...contacts], nearestObject: Number.isFinite(nearest.distance) ? nearest : { distanceAtLeast: 10, id: null },
          seconds: 16, simulationSteps: 960 };
        results.push(result);
        assert.equal(contacts.size, 0, stop.id + ' must not contact a wall, prop, root, or trunk');
        assert.ok(nearest.distance > .5 && drift < 1 && settledSpeed < .3 && wheelContacts >= 3,
          stop.id + ' must settle safely with braking and usable suspension');
      } finally { car.dispose(); world.free(); }
    }
  } finally { if (previous) templates.set('coupe', previous); else templates.delete('coupe'); }
  return { checkedAt: new Date().toISOString(), kind: 'actual-vehicle-west-wall-stop-contact-audit',
    plan, results, vehicleSha256: hash('src/vehicle.ts'), browserLaunched: false, measuredPerformanceFrames: 0 };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const output = process.argv[2]; assert.ok(output, 'Pass a unique output JSON path'); assert.equal(fs.existsSync(output), false);
  const report = await auditWestWallStops(); fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n'); console.log(JSON.stringify({ output, results: report.results }));
}
