import { clippedShader } from './explore-math.js?v=philly-2026092121';

// No second scene, texture download or animation loop. Two small meshes form
// the display base; the existing surface and buildings retain their full detail.
export function createExhibit(THREE, { scene, sky, projection, sampleElevation, photographic }) {
  const originals = new Map(), inverse = { value: new THREE.Matrix4() };
  const boundsUniform = { value: new THREE.Vector4() };
  const group = new THREE.Group(); group.name = 'Neighborhood exhibit base'; scene.add(group);
  let bounds = null, scanAt = 0, photoViewer = null, photoBase = null;
  const exag = { value: 1 };

  function scan() {
    scene.traverse(node => {
      if (!node.material || node === sky || node.parent === group) return;
      for (const material of [node.material].flat()) {
        if (originals.has(material)) continue;
        const before = material.onBeforeCompile, cache = material.customProgramCacheKey;
        originals.set(material, { before, cache });
        material.onBeforeCompile = function(shader, renderer) {
          before.call(this, shader, renderer);
          shader.uniforms.exhibitInverseVP = inverse; shader.uniforms.exhibitBounds = boundsUniform;
          shader.vertexShader = clippedShader(shader.vertexShader, true);
          shader.fragmentShader = clippedShader(shader.fragmentShader, false);
        };
        material.customProgramCacheKey = function() { return cache.call(this) + ':neighborhood-exhibit'; };
        material.needsUpdate = true;
      }
    });
  }
  function clearBase() {
    for (const mesh of [...group.children]) {
      group.remove(mesh); mesh.geometry.dispose(); mesh.material.dispose();
    }
    if (photoBase && photoViewer && !photoViewer.isDestroyed()) {
      photoViewer.dataSources.remove(photoBase, true);
    }
    photoBase = null; photoViewer = null;
  }
  function edgePoints(b) {
    const corners = [[b.west, b.north], [b.east, b.north], [b.east, b.south], [b.west, b.south]];
    const points = [];
    for (let side = 0; side < 4; side++) {
      const a = corners[side], c = corners[(side + 1) % 4];
      for (let i = 0; i < 32; i++) {
        const lon = a[0] + (c[0] - a[0]) * i / 32, lat = a[1] + (c[1] - a[1]) * i / 32;
        points.push({ lon, lat, height: sampleElevation(lon, lat) - .3 });
      }
    }
    points.push(points[0]); return points;
  }
  function makeBase() {
    const points = edgePoints(bounds), vertices = [];
    const bottom = Math.min(...points.map(p => p.height)) - 65;
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1], b = points[i];
      const vertex = (p, y) => vertices.push(projection.lonToX(p.lon), y, projection.latToZ(p.lat));
      vertex(a, a.height); vertex(a, bottom); vertex(b, b.height);
      vertex(b, b.height); vertex(a, bottom); vertex(b, bottom);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const material = new THREE.ShaderMaterial({ side: THREE.DoubleSide,
      uniforms: { exhibitExag: exag },
      vertexShader: `uniform float exhibitExag; varying float strata;
        void main(){ strata=position.y; vec3 p=position; p.y*=exhibitExag;
          gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.); }`,
      fragmentShader: `varying float strata;
        void main(){ float band=.05*sin(strata*.7)+.025*sin(strata*2.1);
          gl_FragColor=vec4(vec3(.31,.24,.16)+band,1.); }`,
    });
    group.add(new THREE.Mesh(geometry, material));
    const w = projection.lonToX(bounds.east) - projection.lonToX(bounds.west);
    const d = projection.latToZ(bounds.south) - projection.latToZ(bounds.north);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(w, d),
      new THREE.MeshBasicMaterial({ color: 0x453522, side: THREE.DoubleSide }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(projection.lonToX((bounds.east + bounds.west) / 2), bottom,
      projection.latToZ((bounds.north + bounds.south) / 2));
    floor.userData.baseHeight = bottom; group.add(floor);
  }
  function syncPhoto() {
    const viewer = photographic.aircraftViewer;
    if (!viewer || viewer === photoViewer) return;
    photoViewer = viewer;
    const C = window.Cesium, points = edgePoints(bounds);
    const bottom = Math.min(...points.map(p => p.height)) - 65;
    photoBase = new C.CustomDataSource('Exhibit display base · illustrative');
    photoBase.entities.add({ wall: {
      positions: C.Cartesian3.fromDegreesArrayHeights(points.flatMap(p => [p.lon, p.lat, p.height])),
      minimumHeights: points.map(() => bottom), material: C.Color.fromCssColorString('#705538'),
    } });
    photoBase.entities.add({ polygon: {
      hierarchy: C.Cartesian3.fromDegreesArray([bounds.west, bounds.north, bounds.east, bounds.north,
        bounds.east, bounds.south, bounds.west, bounds.south]),
      height: bottom, material: C.Color.fromCssColorString('#453522'),
    } });
    void viewer.dataSources.add(photoBase);
  }
  function clear() {
    bounds = null; clearBase(); photographic.setExhibit(null);
    for (const [material, original] of originals) {
      material.onBeforeCompile = original.before;
      material.customProgramCacheKey = original.cache; material.needsUpdate = true;
    }
    originals.clear();
  }
  return {
    set(next) {
      clear(); bounds = next;
      boundsUniform.value.set(projection.lonToX(next.west), projection.lonToX(next.east),
        projection.latToZ(next.north), projection.latToZ(next.south));
      photographic.setExhibit(next); makeBase(); scan(); scanAt = performance.now();
    },
    clear,
    update(camera, exaggeration) {
      if (!bounds) return;
      camera.updateMatrixWorld();
      inverse.value.multiplyMatrices(camera.matrixWorld, camera.projectionMatrixInverse);
      exag.value = exaggeration;
      for (const mesh of group.children) {
        if (mesh.userData.baseHeight !== undefined) mesh.position.y = mesh.userData.baseHeight * exaggeration;
      }
      if (performance.now() - scanAt > 500) { scan(); scanAt = performance.now(); }
      syncPhoto(); if (photoBase) photoBase.show = photographic.active;
      group.visible = !photographic.active;
    },
    dispose() { clear(); scene.remove(group); },
  };
}
