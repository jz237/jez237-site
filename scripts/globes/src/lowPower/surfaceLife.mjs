import * as T from 'three';
import { BowlLife, LIFE_PROBE_AT } from '../interaction/BowlLife';
import { LEAF, NEST } from '../render/bowlScape';
import { GLASS_INNER } from '../render/scape/mesh.mjs';
import { SURFACE_RADIUS, WATER_LEVEL } from './slosh.mjs';

function almondLeaf() {
  const positions = [], colors = [], index = [];
  for (let i = 0; i <= 18; i++) {
    const t = i / 18, width = LEAF.width * Math.sin(t * Math.PI) ** 0.76 * (0.75 + 0.35 * t);
    for (let j = 0; j < 5; j++) {
      const s = (j - 2) / 2;
      positions.push((t - 0.5) * LEAF.length, 0.007 + LEAF.cup * s * s + LEAF.arch * Math.sin(t * Math.PI), s * width);
      const shade = (j === 2 ? 1.25 : 0.85) * (0.8 + 0.2 * Math.cos(i * 2.8 + j));
      colors.push(0.34 * shade, 0.14 * shade, 0.045 * shade);
      if (i && j) {
        const k = i * 5 + j;
        index.push(k - 6, k - 1, k, k - 6, k, k - 5);
      }
    }
  }
  const geo = new T.BufferGeometry();
  geo.setAttribute('position', new T.Float32BufferAttribute(positions, 3));
  geo.setAttribute('color', new T.Float32BufferAttribute(colors, 3));
  geo.setIndex(index);
  geo.computeVertexNormals();
  const leaf = new T.Mesh(geo, new T.MeshLambertMaterial({ vertexColors: true, side: T.DoubleSide }));
  leaf.userData.topic = 'leaf';
  return leaf;
}

export function addSurfaceLife(liquid) {
  const life = new BowlLife(GLASS_INNER);
  const leaf = almondLeaf();
  const nest = new T.InstancedMesh(new T.SphereGeometry(1, 8, 5),
    new T.MeshPhongMaterial({ color: 0xb0d2d5, specular: 0xffffff, shininess: 90, transparent: true, opacity: 0.79 }), NEST.length);
  const bubble = new T.Object3D();
  NEST.forEach(([along, inward, height, radius], i) => {
    bubble.position.set(Math.sqrt(SURFACE_RADIUS ** 2 - along ** 2) - SURFACE_RADIUS - inward, height + 0.002, along);
    bubble.scale.set(radius, radius * 0.70, radius);
    bubble.updateMatrix();
    nest.setMatrixAt(i, bubble.matrix);
  });
  nest.userData.topic = 'nest';
  nest.renderOrder = 4;
  liquid.add(leaf, nest);
  const sense = { probes: new Float32Array((LIFE_PROBE_AT + 32) * 4) };
  const point = new T.Vector3(), filmFlow = new T.Vector3(), flow = [0, 0, 0];
  function update(dt, rotation, spin, swim, surface, bedAt) {
    // Sample the shared leaf controller's four short columns in the sloshing film's frame.
    const points = life.probePoints();
    point.set(points[0], WATER_LEVEL, points[2]).applyQuaternion(surface.rotation);
    surface.currentAt(point.x, point.y, point.z, bedAt(point.x, point.z), flow);
    filmFlow.fromArray(flow).applyQuaternion(surface.inverse);
    for (let i = 0; i < points.length; i += 4) {
      const k = 4 * LIFE_PROBE_AT + i;
      sense.probes[k] = filmFlow.x;
      sense.probes[k + 2] = filmFlow.z;
      sense.probes[k + 3] = T.MathUtils.clamp(0.5 + (WATER_LEVEL - points[i + 1]) * 24, 0, 1);
    }
    life.update(dt, sense, WATER_LEVEL, 0.5, rotation, spin, swim.mode);
    const e = life.matrix.elements;
    const r2 = (e[0] ** 2 + e[2] ** 2) / SURFACE_RADIUS ** 2;
    leaf.position.set(e[0], WATER_LEVEL + surface.bend.value * (1 - r2) * (1 - 3 * r2), e[2]);
    leaf.rotation.y = -e[3];
    nest.count = life.bubbles;
    nest.visible = nest.count > 0;
    nest.position.set(e[8], WATER_LEVEL + 0.003, e[10]);
    nest.rotation.y = -e[11];
  }
  return { life, update };
}
