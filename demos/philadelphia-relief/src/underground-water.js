// Public PWD snapshots are loaded only while this optional cutaway is open.
export const WATER_AREAS = {
  transit: { name: "Full SEPTA rail network", bounds: [-75.8, 39.7, -74.7, 40.55] },
  center: { name: "Center City", bounds: [-75.191, 39.94, -75.14, 39.967] },
  mill: { name: "West Philadelphia / Mill Creek", bounds: [-75.255, 39.948, -75.196, 39.99] },
  wingohocking: { name: "Germantown / Wingohocking", bounds: [-75.188, 40.014, -75.128, 40.056] },
  cohocksink: {
    name: "Northern Liberties / Cohocksink",
    bounds: [-75.165, 39.962, -75.108, 39.998],
  },
  city: { name: "Citywide waterways & outfalls", bounds: [-75.285, 39.865, -74.95, 40.15] },
};
const cache = new Map();
export function waterBounds(area) {
  const [west, south, east, north] = WATER_AREAS[area].bounds;
  return { west, south, east, north };
}
// Clip surveyed paths at the exhibit edge without bending or inventing connections.
export function clipWaterSegment(a, b, box) {
  let lo = 0,
    hi = 1;
  const dx = b[0] - a[0],
    dy = b[1] - a[1];
  for (const [p, q] of [
    [-dx, a[0] - box.west],
    [dx, box.east - a[0]],
    [-dy, a[1] - box.south],
    [dy, box.north - a[1]],
  ]) {
    if (p === 0) {
      if (q < 0) return null;
      continue;
    }
    const r = q / p;
    if (p < 0) lo = Math.max(lo, r);
    else hi = Math.min(hi, r);
    if (lo > hi) return null;
  }
  return [
    [a[0] + dx * lo, a[1] + dy * lo],
    [a[0] + dx * hi, a[1] + dy * hi],
  ];
}
export function createUndergroundWater(THREE, { group, controls, projection, area, invalidate }) {
  const root = new THREE.Group();
  root.name = "Public water infrastructure";
  group.add(root);
  const resources = [],
    pickables = [];
  let disposed = false,
    camera;
  const abort = new AbortController(),
    timer = setTimeout(() => abort.abort(), 20000);
  const el = (tag, text) => {
    const n = document.createElement(tag);
    n.textContent = text;
    return n;
  };
  const own = (a) => {
    resources.push(a);
    return a;
  };
  const heading = el("h3", "Water beneath the city");
  controls.append(heading);
  const status = el("p", "Loading public water maps…");
  status.setAttribute("role", "status");
  controls.append(status);
  const legend = el("div", "");
  legend.className = "water-layer-options";
  controls.append(legend);
  const info = el("p", "Click a colored inlet, outfall or waterway to inspect its public record.");
  info.className = "water-feature-info";
  controls.append(info);
  const b = waterBounds(area);
  const inside = ([x, y]) => x >= b.west && x <= b.east && y >= b.south && y <= b.north;
  const position = ([x, y], level) => [projection.lonToX(x), level, projection.latToZ(y)];
  function toggle(node, name, color, count) {
    const label = el("label", ""),
      check = el("input", "");
    check.type = "checkbox";
    check.checked = true;
    check.onchange = () => {
      node.visible = check.checked;
      invalidate();
    };
    label.style.setProperty("--route-color", color);
    label.append(check, el("span", `${name} · ${count.toLocaleString()}`));
    legend.append(label);
  }
  function dots(rows, key, level, color, size) {
    const points = rows.filter(inside);
    if (!points.length) return;
    const geo = own(new THREE.BufferGeometry());
    geo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(
        points.flatMap((p) => position(p, level)),
        3,
      ),
    );
    const mat = own(new THREE.PointsMaterial({ color, size, sizeAttenuation: false }));
    mat.onBeforeCompile = shader => {
      shader.fragmentShader = shader.fragmentShader.replace('void main() {',
        'void main() { if (distance(gl_PointCoord, vec2(0.5)) > 0.5) discard;');
    };
    mat.customProgramCacheKey = () => 'water-map-dots';
    const node = new THREE.Points(geo, mat);
    node.userData.rows = points;
    node.userData.kind = key;
    root.add(node);
    pickables.push(node);
    toggle(node, key, color, points.length);
  }
  function lines(features, key, level, color) {
    const positions = [],
      names = [];
    for (const feature of features)
      for (const path of feature.paths)
        for (let i = 1; i < path.length; i++) {
          const clipped = clipWaterSegment(path[i - 1], path[i], b);
          if (!clipped) continue;
          positions.push(...position(clipped[0], level), ...position(clipped[1], level));
          names.push(feature.name);
        }
    if (!names.length) return;
    const geo = own(new THREE.BufferGeometry());
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    let node = new THREE.LineSegments(geo, own(new THREE.LineBasicMaterial({ color })));
    if (key === 'Mapped culverted waterways' && area !== 'city') {
      const tube = own(new THREE.CylinderGeometry(4, 4, 1, 8));
      node = own(new THREE.InstancedMesh(tube, own(new THREE.MeshBasicMaterial({color})), names.length));
      const pose = new THREE.Object3D(), a = new THREE.Vector3(), end = new THREE.Vector3();
      const axis = new THREE.Vector3(0, 1, 0), direction = new THREE.Vector3();
      names.forEach((name, i) => {
        a.fromArray(positions, i * 6); end.fromArray(positions, i * 6 + 3);
        direction.subVectors(end, a);
        pose.position.copy(a).add(end).multiplyScalar(0.5);
        pose.scale.set(1, direction.length(), 1);
        pose.quaternion.setFromUnitVectors(axis, direction.normalize());
        pose.updateMatrix(); node.setMatrixAt(i, pose.matrix);
      });
      node.instanceMatrix.needsUpdate = true;
    }
    node.userData.names = names;
    node.userData.kind = key;
    root.add(node);
    pickables.push(node);
    toggle(node, key, color, new Set(names).size);
  }
  async function load() {
    try {
      let data = cache.get(area);
      if (!data) {
        const response = await fetch(new URL(`../data/underground/${area}.json`, import.meta.url), {
          signal: abort.signal,
        });
        if (!response.ok) throw new Error("unavailable");
        data = await response.json();
        if (disposed) return;
        cache.set(area, data);
      }
      if (disposed) return;
      dots(
        data.inlets.filter((p) => p[2] === "COMBINED"),
        "Combined-sewer inlets",
        -16,
        "#f6bd63",
        4,
      );
      dots(
        data.inlets.filter((p) => p[2] !== "COMBINED"),
        "Storm / green infrastructure inlets",
        -16,
        "#72ceec",
        3,
      );
      dots(data.outfalls, "Mapped outfalls", -20, "#ff8273", 8);
      lines(data.culverts, "Mapped culverted waterways", -38, "#df93ff");
      lines(data.historic, "Historic stream courses", -28, "#63dcb2");
      status.textContent =
        `PWD public data · ${data.retrieved}. ` +
        (area === "city" ? "Choose a neighborhood for individual inlets. " : "") +
        "Horizontal locations follow source maps; vertical positions are display layers. " +
        "Inlet connections are not supplied and are not drawn.";
      invalidate();
    } catch {
      if (!disposed)
        status.textContent =
          "Water maps could not load. Close and reopen to retry; source maps remain available below.";
    } finally {
      clearTimeout(timer);
    }
  }
  void load();
  const sources = el("details", "");
  sources.className = "water-map-library";
  sources.append(el("summary", "Sewer maps & source records"));
  sources.append(
    el(
      "p",
      "The 1927 and 1929 city maps include existing and proposed main sewers. " +
        "They are historic records, not a current pipe survey. " +
        "Open the full-size maps to examine tunnel routes and their legends.",
    ),
  );
  for (const year of [1927, 1929]) {
    const link = el("a", `${year} sewer-system map · full size ↗`);
    link.href = `https://waterhistoryphl.org/wp-content/uploads/Sewers-Philadelphia-${year}-half-GS.jpg`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    const img = el("img", "");
    img.alt = `Philadelphia ${year} sewer-system map`;
    img.loading = "lazy";
    img.width = 240;
    img.height = 300;
    // Assign only when the library opens, so maps cost nothing during exploration.
    sources.addEventListener("toggle", () => {
      if (sources.open && !img.getAttribute("src"))
        img.src = new URL(`../data/underground/sewers-${year}-preview.jpg`, import.meta.url).href;
    });
    link.append(img);
    sources.append(link);
  }
  for (const [name, url] of [
    [
      "Map provenance · Water History PHL",
      "https://waterhistoryphl.org/2024/01/sewer-systems-philadelphia-1927-1929/",
    ],
    [
      "PWD sewer-system evaluation & interceptor maps (2014 PDF)",
      "https://water.phila.gov/pool/files/SSES-Report_July2014.pdf",
    ],
    [
      "Current PWD public GIS records",
      "https://maps.pasda.psu.edu/ArcGIS/rest/services/pasda/CityPhillyWater/MapServer",
    ],
    [
      "Historic stream GIS source",
      "https://www.arcgis.com/home/item.html?id=40816e75554f4d74991aaeca81b5bd26",
    ],
  ]) {
    const a = el("a", name + " ↗");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    sources.append(a);
  }
  controls.append(sources);
  const section = el("details", "");
  section.className = "water-map-library";
  section.append(el("summary", "Inside a combined sewer · illustrative section"));
  const diagram = el("img", "");
  diagram.alt = "Illustrative combined sewer cross-section; not measured dimensions";
  diagram.src = new URL("../data/underground/sewer-section.svg", import.meta.url).href;

  section.append(
    diagram,
    el(
      "p",
      "Many combined sewers carry both sewage and rain runoff. " +
        "This educational cross-section is not a model of any particular pipe.",
    ),
  );
  controls.append(section);
  const canvas = document.getElementById("canvas"),
    ray = new THREE.Raycaster(),
    pointer = new THREE.Vector2();
  let down;
  const press = (e) => {
    down = { x: e.clientX, y: e.clientY };
  };
  const pick = (e) => {
    if (
      !camera ||
      !down ||
      Math.hypot(e.clientX - down.x, e.clientY - down.y) > 5 ||
      !root.parent?.visible
    )
      return;
    down = null;
    const rect = canvas.getBoundingClientRect();
    pointer.set(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      (-(e.clientY - rect.top) / rect.height) * 2 + 1,
    );
    ray.setFromCamera(pointer, camera);
    const focus = new THREE.Vector3(projection.lonToX((b.west + b.east) / 2), -20,
      projection.latToZ((b.north + b.south) / 2));
    const tolerance = (camera.position.distanceTo(focus) / rect.height) * 3;
    ray.params.Points.threshold = ray.params.Line.threshold = Math.max(5, Math.min(80, tolerance));
    const hit = ray.intersectObjects(
      pickables.filter((n) => n.visible),
      false,
    )[0];
    if (!hit) return;
    const d = hit.object.userData;
    if (d.rows) {
      const p = d.rows[hit.index];
      info.textContent =
        `${d.kind} · ${p[2]} · type ${p[3]} · ` +
        `${p[1].toFixed(5)}, ${p[0].toFixed(5)}. ` +
        "Public PWD location; pipe depth and connections unavailable.";
    } else
      info.textContent =
        `${d.kind} · ${d.names[hit.instanceId ?? Math.floor(hit.index / 2)]}. ` +
        (d.kind.startsWith("Historic")
          ? "Historical stream alignment; not a present-day sewer route."
          : "Mapped culvert alignment; displayed depth is illustrative.");
  };
  canvas.addEventListener("pointerdown", press);
  canvas.addEventListener("pointerup", pick);
  return {
    update(c) {
      camera = c;
    },
    dispose() {
      disposed = true;
      abort.abort();
      clearTimeout(timer);
      canvas.removeEventListener("pointerdown", press);
      canvas.removeEventListener("pointerup", pick);
      resources.forEach((r) => r.dispose());
      root.removeFromParent();
    },
  };
}
