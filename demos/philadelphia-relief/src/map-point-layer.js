import { controlBoxes, overlapsBox } from './label-policy.js?v=philly-2026092115';
import { shipGeometry } from './ship-model.js?v=philly-2026092115';
import { clusterPoints } from './map-clusters.js?v=philly-2026092115';
import { createUpdateGate } from './frame-work.js?v=philly-2026092115';

export function createMapPoints(THREE, { scene, stage, projection, sampleElevation,
  photographic, onSelect, onCluster }) {
  const host = document.createElement('div'); host.className = 'extra-map-pins'; stage.append(host);
  const group = new THREE.Group(); scene.add(group);
  const records = new Map(), pins = new Map(), point = new THREE.Vector3();
  const geometry = new THREE.BufferGeometry(), shape = shipGeometry();
  for (const [key, field] of [['position', 'positions'], ['normal', 'normals'], ['color', 'colors']]) {
    geometry.setAttribute(key, new THREE.Float32BufferAttribute(shape[field], 3));
  }
  const material = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide });
  let viewer, source;
  const gate = createUpdateGate();
  const invalidate = () => gate.invalidate();
  const layoutEvents = ['click', 'input', 'change', 'toggle', 'scroll'];
  for (const type of layoutEvents) document.addEventListener(type, invalidate, true);
  const enabled = new Set();
  function remove(record) {
    if (record.mesh) group.remove(record.mesh);
    if (record.entity && source) source.entities.remove(record.entity);
  }
  return {
    set(type, rows) {
      gate.invalidate();
      const ids = new Set(rows.map(r => `${type}:${r.id}`));
      for (const [id, record] of records) if (record.type === type && !ids.has(id)) {
        remove(record); records.delete(id);
      }
      for (const row of rows) {
        const id = `${type}:${row.id}`; let record = records.get(id);
        if (!record) {
          const mesh = type === 'ship' ? new THREE.Mesh(geometry, material) : null;
          if (mesh) { mesh.visible = false; group.add(mesh); }
          record = { mesh, type }; records.set(id, record);
        }
        record.data = row;
      }
    },
    enable(type, value) { if (value) enabled.add(type); else enabled.delete(type); gate.invalidate(); },
    update(camera, ctx) {
      const p = ctx.pose;
      const key = [p.lon, p.lat, p.dist, p.pitch, p.bearing, p.fov, p.targetAltitude,
        ctx.width, ctx.height, ctx.exaggeration, photographic.active].join(':');
      if (!gate.take(key, performance.now())) return;
      const next = photographic.aircraftViewer, C = window.Cesium;
      if (next !== viewer) {
        viewer = next; source = null;
        for (const r of records.values()) { r.entity = null; r.entityKey = ''; }
      }
      const candidates = [];
      for (const [key, record] of records) {
        const r = record.data, age = Date.now() - r.observedAt;
        const on = enabled.has(record.type) && !(record.type === 'ship' && age > 600000);
        if (record.mesh) record.mesh.visible = on && !photographic.active;
        if (!on) {
          if (record.entity?.show) { record.entity.show = false; viewer?.scene.requestRender(); }
          record.entityKey = ''; continue;
        }
        const ground = sampleElevation(r.lon, r.lat), y = ground * ctx.exaggeration + 12;
        let screen;
        if (photographic.active) screen = photographic.projectLocation({ ...r, elevation: ground + 15 });
        else {
          point.set(projection.lonToX(r.lon), y, projection.latToZ(r.lat)).project(camera);
          if (point.z >= -1 && point.z <= 1) screen = { x: (point.x * .5 + .5) * ctx.width,
            y: (-point.y * .5 + .5) * ctx.height };
        }
        if (screen && screen.x > 22 && screen.x < ctx.width - 22
          && screen.y > 22 && screen.y < ctx.height - 22) {
          candidates.push({ key, type: record.type, data: r, ...screen });
        }
        if (!record.mesh) continue;
        record.mesh.position.set(projection.lonToX(r.lon), y, projection.latToZ(r.lat));
        record.mesh.rotation.y = (90 - (r.course ?? 0)) * Math.PI / 180;
        record.mesh.scale.setScalar(Math.max(1, Math.min(14, ctx.pose.dist / 5000)));
        if (!viewer || !photographic.active) continue;
        if (!source) { source = new C.CustomDataSource('Ships and regional observations');
          void viewer.dataSources.add(source); }
        const entityKey = `${r.lon}:${r.lat}:${ground}:${r.course}`;
        if (entityKey === record.entityKey) continue;
        record.entityKey = entityKey;
        if (!record.entity) record.entity = source.entities.add({ id: `ship-${r.id}`,
          model: { uri: 'data/ship.glb?v=1', minimumPixelSize: 28, maximumScale: 14 } });
        record.entity.show = true;
        const location = C.Cartesian3.fromDegrees(r.lon, r.lat, ground + 4);
        record.entity.position = location;
        record.entity.orientation = C.Transforms.headingPitchRollQuaternion(location,
          new C.HeadingPitchRoll(C.Math.toRadians(r.course ?? 0), 0, 0));
        viewer.scene.requestRender();
      }
      if (source) source.show = photographic.active;
      const clusters = clusterPoints(candidates, ctx.width <= 1024 ? 56 : 46);
      const blocked = candidates.length ? controlBoxes() : [], used = new Set();
      for (const cluster of clusters) {
        const { key, type, members } = cluster; used.add(key);
        let entry = pins.get(key);
        if (!entry) {
          const pin = document.createElement('button'); pin.type = 'button';
          pin.className = `extra-map-pin ${type}${members.length > 1 ? ' cluster' : ''}`;
          entry = { pin, cluster }; pins.set(key, entry); host.append(pin);
          pin.onclick = e => { e.stopPropagation(); const g = entry.cluster;
            if (g.members.length > 1) onCluster(g.type, g.members.map(p => p.data));
            else onSelect(g.type, g.members[0].data); };
        }
        entry.cluster = cluster;
        const symbol = type === 'ship' ? '▲' : type === 'gauge' ? '≈' : '◆';
        const text = members.length > 1 ? `${symbol} ${members.length}` : symbol;
        if (entry.pin.textContent !== text) entry.pin.textContent = text;
        const label = members.length > 1 ? `${members.length} ${type}s · show list`
          : `${type}: ${members[0].data.name}`;
        entry.pin.setAttribute('aria-label', label); entry.pin.title = label;
        entry.pin.classList.toggle('stale', type === 'ship'
          && members.every(p => Date.now() - p.data.observedAt > 120000));
        const box = { l: cluster.x - 24, r: cluster.x + 24, t: cluster.y - 22, b: cluster.y + 22 };
        entry.pin.hidden = blocked.some(b => overlapsBox(b, box, 3));
        entry.pin.style.left = `${cluster.x}px`; entry.pin.style.top = `${cluster.y}px`;
      }
      for (const [key, entry] of pins) if (!used.has(key)) { entry.pin.remove(); pins.delete(key); }
    },
    dispose() {
      for (const type of layoutEvents) document.removeEventListener(type, invalidate, true);
      for (const r of records.values()) remove(r); records.clear(); pins.clear();
      if (source && viewer && !viewer.isDestroyed()) viewer.dataSources.remove(source, true);
      host.remove(); scene.remove(group); geometry.dispose(); material.dispose();
    },
  };
}
