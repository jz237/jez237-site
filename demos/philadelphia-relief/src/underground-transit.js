import { clipWaterSegment } from "./underground-water.js?v=philly-2026092303";
let cached;
export function transitMask(routes, selection) {
  return routes.reduce(
    (mask, r, i) =>
      mask | (selection === "all" || selection === r.mode || selection === r.id ? 2 ** i : 0),
    0,
  );
}
export function createUndergroundTransit(
  THREE,
  { group, controls, projection, sampleElevation, bounds, area, motion, invalidate, showNetwork },
) {
  const root = new THREE.Group();
  root.name = "SEPTA published rail network";
  group.add(root);
  const el = (tag, text) => {
    const node = document.createElement(tag);
    node.textContent = text;
    return node;
  };
  const section = el("section", "");
  section.className = "underground-transit";
  controls.append(section);
  section.append(el("h3", "SEPTA rail network"));
  const status = el("p", "Loading SEPTA routes and stations…");
  status.setAttribute("role", "status");
  section.append(status);
  const chooser = el("select", "");
  chooser.setAttribute("aria-label", "SEPTA rail line");
  chooser.disabled = true;
  section.append(chooser);
  const stationSelect = el("select", "");
  stationSelect.setAttribute("aria-label", "SEPTA station in this view");
  stationSelect.disabled = true;
  section.append(stationSelect);
  const stationToggle = el("label", ""),
    check = el("input", "");
  check.type = "checkbox";
  check.checked = true;
  stationToggle.append(check, el("span", "Show station markers"));
  section.append(stationToggle);
  const network = el("button", "Frame full SEPTA network");
  network.type = "button";
  network.onclick = showNetwork;
  section.append(network);
  section.append(
    el(
      "p",
      "Solid: mapped tunnels. Dashed: other rail alignments. " +
        "Raised crossings use mapped bridge tags. Tunnel depth and bridge height are illustrative.",
    ),
  );
  const info = el("p", "Select a line or click a route/station to inspect it.");
  info.className = "water-feature-info";
  section.append(info);
  const source = el("a", "SEPTA published route data ↗");
  source.href = "https://github.com/septadev/GTFS/releases/tag/v202609061";
  source.target = "_blank";
  source.rel = "noopener noreferrer";
  section.append(source);
  const attribution = el("a", "Tunnel / bridge mapping: © OpenStreetMap contributors");
  attribution.href = "https://www.openstreetmap.org/copyright";
  attribution.target = "_blank";
  attribution.rel = "noopener noreferrer";
  section.append(attribution);
  let doc,
    camera,
    disposed = false,
    resources = [],
    pickables = [],
    stations,
    rows = [];
  const abort = new AbortController(),
    timer = setTimeout(() => abort.abort(), 20000);
  const own = (r) => {
    resources.push(r);
    return r;
  };
  const inside = (lon, lat) =>
    lon >= bounds.west && lon <= bounds.east && lat >= bounds.south && lat <= bounds.north;
  const firstRoute = (mask) => doc.routes.find((r, i) => mask & (2 ** i));
  const served = (mask) =>
    doc.routes
      .filter((r, i) => mask & (2 ** i))
      .map((r) => r.id)
      .join(", ");
  const point = (lon, lat, kind, mask) => {
    const route = firstRoute(mask);
    const depth =
      route?.mode === "regional"
        ? -140
        : route?.id.startsWith("B")
          ? -105
          : route?.id.startsWith("T")
            ? -45
            : -65;
    return [
      projection.lonToX(lon),
      kind === 1 ? depth : sampleElevation(lon, lat) + (kind === 2 ? 18 : 4),
      projection.latToZ(lat),
    ];
  };
  function clear() {
    root.clear();
    resources.forEach((r) => r.dispose());
    resources = [];
    pickables = [];
  }
  function describe(row) {
    info.textContent =
      `${row[0]} · ${served(row[3])}. ` +
      (row[4] === 1 ? "Mapped tunnel vicinity. " : "Surface / bridge / unclassified station. ") +
      "SEPTA GTFS stop location; not live service information.";
  }
  function render() {
    if (!doc || disposed) return;
    clear();
    const mask = transitMask(doc.routes, chooser.value);
    let segmentCount = 0;
    const color = new THREE.Color();
    for (const kind of [0, 1, 2]) {
      const vertices = [],
        colors = [],
        records = [];
      for (const segment of doc.segments) {
        const [x, y, xx, yy, type, bits] = segment;
        if (type !== kind || !(bits & mask)) continue;
        const clipped = clipWaterSegment([x, y], [xx, yy], bounds);
        if (!clipped) continue;
        vertices.push(
          ...point(...clipped[0], kind, bits & mask),
          ...point(...clipped[1], kind, bits & mask),
        );
        color.set(firstRoute(bits & mask).color).lerp(new THREE.Color("#ffffff"), 0.22);
        colors.push(color.r, color.g, color.b, color.r, color.g, color.b);
        records.push(segment);
      }
      if (!records.length) continue;
      segmentCount += records.length;
      const geometry = own(new THREE.BufferGeometry());
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
      geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
      const material =
        kind === 1
          ? new THREE.LineBasicMaterial({ vertexColors: true })
          : new THREE.LineDashedMaterial({
              vertexColors: true,
              dashSize: kind === 2 ? 28 : 45,
              gapSize: kind === 2 ? 10 : 22,
            });
      const line = new THREE.LineSegments(geometry, own(material));
      if (kind !== 1) line.computeLineDistances();
      line.userData.records = records;
      root.add(line);
      pickables.push(line);
    }
    rows = doc.stops.filter((row) => row[3] & mask && inside(row[1], row[2]));
    const vertices = [],
      colors = [];
    for (const row of rows) {
      vertices.push(...point(row[1], row[2], row[4], row[3] & mask));
      color.set(firstRoute(row[3] & mask).color).lerp(new THREE.Color("#ffffff"), 0.4);
      colors.push(color.r, color.g, color.b);
    }
    const geo = own(new THREE.BufferGeometry());
    geo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    const mat = own(
      new THREE.PointsMaterial({
        vertexColors: true,
        size: area === "transit" ? 5 : 8,
        sizeAttenuation: false,
      }),
    );
    stations = new THREE.Points(geo, mat);
    stations.visible = check.checked;
    stations.userData.station = true;
    root.add(stations);
    pickables.unshift(stations);
    stationSelect.replaceChildren();
    const prompt = el("option", "Choose a station in this view");
    prompt.value = "";
    stationSelect.append(prompt);
    rows
      .map((row, i) => ({ row, i }))
      .sort((a, b) => a.row[0].localeCompare(b.row[0]))
      .forEach(({ row, i }) => {
        const option = el("option", `${row[0]} · ${served(row[3] & mask)}`);
        option.value = String(i);
        stationSelect.append(option);
      });
    stationSelect.disabled = !rows.length;
    status.textContent =
      `${doc.routes.length} published rail routes · ${rows.length} stop locations in this view. ` +
      (area === "transit"
        ? "Routes are clipped at the relief map boundary. "
        : "Use “Frame full SEPTA network” for the branches outside this cutaway. ") +
      (segmentCount ? "" : "No selected rail alignment crosses this view. ") +
      "GTFS snapshot: September 2026. Stops can include separate platforms.";
    invalidate();
  }
  chooser.onchange = render;
  check.onchange = () => {
    if (stations) stations.visible = check.checked;
    invalidate();
  };
  stationSelect.onchange = () => {
    if (stationSelect.value === "") return;
    const row = rows[Number(stationSelect.value)];
    if (!row) return;
    describe(row);
    motion.flyTo(
      { lon: row[1], lat: row[2], camDist: 1500, camPitch: 52, camBearing: 8 },
      { label: row[0] },
    );
  };
  async function load() {
    try {
      if (!cached) {
        const response = await fetch(
          new URL("../data/underground/septa-rail.json", import.meta.url),
          { signal: abort.signal },
        );
        if (!response.ok) throw new Error("unavailable");
        const value = await response.json();
        if (disposed) return;
        cached = value;
      }
      if (disposed) return;
      doc = cached;
      for (const [id, name] of [
        ["all", "All SEPTA rail"],
        ["metro", "Metro / trolleys"],
        ["regional", "Regional Rail"],
        ...doc.routes.map((r) => [r.id, `${r.id} · ${r.name}`]),
      ]) {
        const o = el("option", name);
        o.value = id;
        chooser.append(o);
      }
      chooser.value = "all";
      chooser.disabled = false;
      render();
    } catch {
      if (!disposed) status.textContent = "SEPTA map could not load. Reopen the cutaway to retry.";
    } finally {
      clearTimeout(timer);
    }
  }
  void load();
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
      !group.visible
    )
      return;
    down = null;
    const rect = canvas.getBoundingClientRect();
    pointer.set(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      (-(e.clientY - rect.top) / rect.height) * 2 + 1,
    );
    ray.setFromCamera(pointer, camera);
    const focus = new THREE.Vector3(
      projection.lonToX((bounds.west + bounds.east) / 2),
      0,
      projection.latToZ((bounds.south + bounds.north) / 2),
    );
    const tolerance = Math.max(
      5,
      Math.min(200, (camera.position.distanceTo(focus) / rect.height) * 4),
    );
    ray.params.Points.threshold = ray.params.Line.threshold = tolerance;
    const hits = ray.intersectObjects(
      pickables.filter((n) => n.visible),
      false,
    );
    const hit = hits.find((h) => h.object.userData.station) || hits[0];
    if (!hit) return;
    if (hit.object.userData.station) describe(rows[hit.index]);
    else {
      const row = hit.object.userData.records[Math.floor(hit.index / 2)];
      info.textContent = `${served(row[5])} · ` +
        ['Rail alignment; underground status unclassified', 'Mapped tunnel',
          'Mapped bridge / elevated crossing'][row[4]] +
        '. Geographic route from SEPTA; display heights are schematic.';
    }
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
      clear();
      root.removeFromParent();
      canvas.removeEventListener("pointerdown", press);
      canvas.removeEventListener("pointerup", pick);
    },
  };
}
