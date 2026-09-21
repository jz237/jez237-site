import { controlBoxes, overlapsBox } from './label-policy.js?v=philly-2026092109';
import { shipGeometry } from './ship-model.js?v=philly-2026092109';

export function createMapPoints(THREE, { scene, stage, projection, sampleElevation,
  photographic, onSelect }) {
  const host = document.createElement('div'); host.className = 'extra-map-pins'; stage.append(host);
  const group = new THREE.Group(); scene.add(group);
  const records = new Map(), point = new THREE.Vector3(), geometry = new THREE.BufferGeometry();
  const shape = shipGeometry();
  for (const [key, field] of [['position', 'positions'], ['normal', 'normals'], ['color', 'colors']]) {
    geometry.setAttribute(key, new THREE.Float32BufferAttribute(shape[field], 3));
  }
  const material = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide });
  let viewer, source, lastDraw = 0;
  const enabled = new Set();
  function remove(record) {
    record.pin.remove(); if (record.mesh) group.remove(record.mesh);
    if (record.entity && source) source.entities.remove(record.entity);
  }
  return {
    set(type, rows) {
      const ids = new Set(rows.map(r => `${type}:${r.id}`));
      for (const [id, record] of records) if (record.type === type && !ids.has(id)) {
        remove(record); records.delete(id);
      }
      for (const row of rows) {
        const id = `${type}:${row.id}`; let record = records.get(id);
        if (!record) {
          const pin = document.createElement('button'); pin.type = 'button';
          pin.className = `extra-map-pin ${type}`;
          pin.textContent = type === 'ship' ? '▲' : type === 'gauge' ? '≈' : '◆';
          pin.onclick = e => { e.stopPropagation(); onSelect(type, record.data); };
          host.append(pin);
          const mesh = type === 'ship' ? new THREE.Mesh(geometry, material) : null;
          if (mesh) group.add(mesh);
          record = { pin, mesh, type, data: row }; records.set(id, record);
        }
        record.data = row;
        record.pin.title = row.name; record.pin.setAttribute('aria-label', `${type}: ${row.name}`);
      }
    },
    enable(type, value) { if (value) enabled.add(type); else enabled.delete(type); },
    update(camera, ctx) {
      if (performance.now() - lastDraw < 100) return; lastDraw = performance.now();
      const next = photographic.aircraftViewer, C = window.Cesium;
      if (next !== viewer) {
        viewer = next; source = null;
        for (const r of records.values()) r.entity = null;
        if (viewer) { source = new C.CustomDataSource('Ships and regional observations');
          void viewer.dataSources.add(source); }
      }
      const blocked = controlBoxes(), occupied = [];
      for (const record of records.values()) {
        const r = record.data, age = Date.now() - r.observedAt;
        const on = enabled.has(record.type) && !(record.type === 'ship' && age > 600000);
        const ground = sampleElevation(r.lon, r.lat), y = ground * ctx.exaggeration + 12;
        let screen;
        if (on) {
          if (photographic.active) screen = photographic.projectLocation({ ...r, elevation: ground + 15 });
          else {
            point.set(projection.lonToX(r.lon), y, projection.latToZ(r.lat)).project(camera);
            if (point.z >= -1 && point.z <= 1) screen = { x: (point.x * .5 + .5) * ctx.width,
              y: (-point.y * .5 + .5) * ctx.height };
          }
        }
        const box = screen && { l: screen.x - 15, r: screen.x + 15, t: screen.y - 15, b: screen.y + 15 };
        record.pin.hidden = !on || !screen || screen.x < 20 || screen.x > ctx.width - 20
          || screen.y < 20 || screen.y > ctx.height - 20
          || [...blocked, ...occupied].some(b => box && overlapsBox(b, box, 3));
        if (!record.pin.hidden) {
          occupied.push(box); record.pin.style.left = `${screen.x}px`; record.pin.style.top = `${screen.y}px`;
        }
        if (!record.mesh) continue;
        record.pin.classList.toggle('stale', age > 120000);
        record.mesh.visible = on && !photographic.active;
        record.mesh.position.set(projection.lonToX(r.lon), y, projection.latToZ(r.lat));
        record.mesh.rotation.y = (90 - (r.course ?? 0)) * Math.PI / 180;
        record.mesh.scale.setScalar(Math.max(1, Math.min(14, ctx.pose.dist / 5000)));
        if (source) {
          if (!record.entity) record.entity = source.entities.add({ id: `ship-${r.id}`,
            model: { uri: 'data/ship.glb?v=1', minimumPixelSize: 28, maximumScale: 14 } });
          record.entity.show = on && photographic.active;
          const location = C.Cartesian3.fromDegrees(r.lon, r.lat, ground + 4);
          record.entity.position = location;
          record.entity.orientation = C.Transforms.headingPitchRollQuaternion(location,
            new C.HeadingPitchRoll(C.Math.toRadians(r.course ?? 0), 0, 0));
          viewer.scene.requestRender();
        }
      }
    },
    dispose() {
      for (const r of records.values()) remove(r); records.clear();
      if (source && viewer && !viewer.isDestroyed()) viewer.dataSources.remove(source, true);
      host.remove(); scene.remove(group); geometry.dispose(); material.dispose();
    },
  };
}
