import { MAP_BOUNDS, tileBounds, archiveTiles } from './map-layer-data.js?v=philly-2026092116';

export function createMapSurfaces(THREE, { scene, projection, sampleElevation, status }) {
  const root = new THREE.Group(); scene.add(root);
  const archive = new Map(), radar = new Map();
  const archiveRequests = new Set();
  let generation = 0, year = 'off', disposed = false, exag = 1, lastPlan = '', active = 0;
  let queue = [], desired = new Set(), archiveOpacity = 1, radarOpacity = .55, radarKey = null;
  let radarController, radarTicket = 0;
  const swipe = { value: 1 };
  function drop(entry) {
    root.remove(entry.mesh); entry.mesh.geometry.dispose(); entry.mesh.material.dispose();
    entry.texture.dispose(); entry.image.close?.();
  }
  async function image(url, signal) {
    const response = await fetch(url, { signal });
    if (!response.ok) throw new Error('Image unavailable');
    return createImageBitmap(await response.blob(), { imageOrientation: 'flipY' });
  }
  function patch(bitmap, bounds, historic) {
    const b = { west: Math.max(bounds.west, MAP_BOUNDS.west), east: Math.min(bounds.east, MAP_BOUNDS.east),
      north: Math.min(bounds.north, MAP_BOUNDS.north), south: Math.max(bounds.south, MAP_BOUNDS.south) };
    const geometry = new THREE.PlaneGeometry(1, 1, 32, 32), heights = [];
    const p = geometry.attributes.position, uv = geometry.attributes.uv;
    for (let i = 0; i < p.count; i++) {
      const lon = b.west + uv.getX(i) * (b.east - b.west);
      const lat = b.south + uv.getY(i) * (b.north - b.south), h = sampleElevation(lon, lat);
      heights.push(h); p.setXYZ(i, projection.lonToX(lon), h * exag + 5, projection.latToZ(lat));
      uv.setXY(i, (lon - bounds.west) / (bounds.east - bounds.west),
        (lat - bounds.south) / (bounds.north - bounds.south));
    }
    geometry.computeBoundingSphere();
    const texture = new THREE.Texture(bitmap); texture.needsUpdate = true;
    texture.colorSpace = THREE.SRGBColorSpace; texture.flipY = false;
    const material = new THREE.ShaderMaterial({ transparent: true, depthWrite: false,
      depthTest: false, side: THREE.DoubleSide,
      uniforms: { uMap: { value: texture }, uAlpha: { value: historic ? archiveOpacity : radarOpacity },
        uHistoric: { value: historic ? 1 : 0 }, uSplit: swipe },
      vertexShader: 'varying vec2 vUv; varying vec4 vClip; void main(){vUv=uv;'
        + 'gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);vClip=gl_Position;}',
      fragmentShader: 'uniform sampler2D uMap; uniform float uAlpha; uniform float uHistoric;'
        + 'uniform float uSplit; varying vec4 vClip; varying vec2 vUv;'
        + 'void main(){if(uHistoric>0.5 && vClip.x/vClip.w*0.5+0.5>uSplit)discard;'
        + 'vec4 c=texture2D(uMap,vUv);'
        + 'if(uHistoric>0.5 && max(c.r,max(c.g,c.b))<0.01)discard;'
        + 'gl_FragColor=vec4(c.rgb,c.a*uAlpha);}' });
    const mesh = new THREE.Mesh(geometry, material); mesh.renderOrder = historic ? 20 : 21;
    root.add(mesh); return { mesh, texture, image: bitmap, heights };
  }
  function pump() {
    while (active < 3 && queue.length && !disposed) {
      const task = queue.shift(), ticket = generation; active++;
      const controller = new AbortController(); task.controller = controller;
      archiveRequests.add(controller);
      const timer = setTimeout(() => controller.abort(), 12000);
      image(`map-image?kind=archive&year=${year}&z=${task.z}&x=${task.x}&y=${task.y}`, controller.signal)
        .then(bitmap => {
          if (disposed || ticket !== generation || !desired.has(task.key)) { bitmap.close(); return; }
          archive.set(task.key, patch(bitmap, tileBounds(task.z, task.x, task.y), true));
          status('archive', `${year} aerials · ${archive.size} tiles loaded · City of Philadelphia`);
        }).catch(() => {
          if (ticket === generation) status('archive', `${year} · some tiles unavailable or outside survey`);
        }).finally(() => {
          clearTimeout(timer); archiveRequests.delete(controller); active--; pump();
        });
    }
  }
  return {
    setSwipe(value) { swipe.value = Math.max(0, Math.min(1, value)); },
    setArchive(value) {
      year = value; generation++; lastPlan = ''; queue = []; desired.clear();
      for (const controller of archiveRequests) controller.abort();
      for (const entry of archive.values()) drop(entry); archive.clear();
    },
    archiveOpacity(value) {
      archiveOpacity = value;
      for (const e of archive.values()) e.mesh.material.uniforms.uAlpha.value = value;
    },
    radarOpacity(value) {
      radarOpacity = value;
      for (const e of radar.values()) e.mesh.material.uniforms.uAlpha.value = value;
    },
    async radar(time) {
      const ticket = ++radarTicket; radarController?.abort(); radarKey = time;
      if (!time) { for (const e of radar.values()) e.mesh.visible = false; return; }
      let entry = radar.get(time);
      if (!entry) {
        const controller = new AbortController(); radarController = controller;
        const timer = setTimeout(() => controller.abort(), 12000);
        try {
          const bitmap = await image(`map-image?kind=radar&time=${encodeURIComponent(time)}`,
            controller.signal);
          if (disposed || ticket !== radarTicket) { bitmap.close(); return; }
          entry = patch(bitmap, MAP_BOUNDS, false); radar.set(time, entry);
          while (radar.size > 12) {
            const key = radar.keys().next().value; drop(radar.get(key)); radar.delete(key);
          }
        } catch { if (ticket === radarTicket) throw new Error('Radar image unavailable'); return; }
        finally { clearTimeout(timer); }
      }
      for (const [key, e] of radar) e.mesh.visible = key === radarKey;
    },
    update(pose, exaggeration, visible) {
      root.visible = visible;
      if (Math.abs(exag - exaggeration) > .001) {
        exag = exaggeration;
        for (const entry of [...archive.values(), ...radar.values()]) {
          const p = entry.mesh.geometry.attributes.position;
          entry.heights.forEach((h, i) => p.setY(i, h * exag + 5));
          p.needsUpdate = true; entry.mesh.geometry.computeBoundingSphere();
        }
      }
      if (year === 'off' || !visible) return;
      const tiles = archiveTiles(pose), key = tiles.map(t => `${t.z}/${t.x}/${t.y}`).join('|');
      if (lastPlan === key) return; lastPlan = key; generation++;
      for (const controller of archiveRequests) controller.abort();
      desired = new Set(tiles.map(t => `${t.z}/${t.x}/${t.y}`));
      for (const [id, entry] of archive) if (!desired.has(id)) { drop(entry); archive.delete(id); }
      queue = tiles.map(t => ({ ...t, key: `${t.z}/${t.x}/${t.y}` })).filter(t => !archive.has(t.key));
      pump();
    },
    dispose() {
      disposed = true; generation++; radarTicket++; radarController?.abort(); queue = [];
      for (const controller of archiveRequests) controller.abort();
      for (const e of [...archive.values(), ...radar.values()]) drop(e);
      archive.clear(); radar.clear(); scene.remove(root);
    },
  };
}
