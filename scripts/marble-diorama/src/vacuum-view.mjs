import * as THREE from "three";

// Reconstruct the observed inhale, brief absence, scattered return and reform.
// These fragment paths are presentation only; collision remains disabled during
// the simulation's measured capture interval. Pure time makes seeking repeatable.
export function vacuumFragmentPose(capture, seconds, i) {
  const age = seconds - capture.tick / 120;
  const a = i * 2.399963,
    x = Math.cos(a),
    z = Math.sin(a);
  if (age < 0 || age >= 2.1 || (age >= 0.64 && age < 0.92))
    return { visible: false };
  let position, scale, spin;
  if (age < 0.64) {
    const u = age / 0.64,
      ease = u * u * (3 - 2 * u),
      spread = Math.sin(Math.PI * u);
    position = {
      x:
        capture.origin.x +
        (capture.intake.x - capture.origin.x) * ease +
        x * spread * 0.65,
      y:
        capture.origin.y +
        (capture.intake.y - capture.origin.y) * ease +
        spread * (0.5 + (i % 3) * 0.15),
      z:
        capture.origin.z +
        (capture.intake.z - capture.origin.z) * ease +
        z * spread * 0.65,
    };
    scale = 1 - ease * 0.9;
    spin = age * 8;
  } else {
    const u = (age - 0.92) / 1.18,
      ease = u * u * (3 - 2 * u);
    const arc = Math.sin(Math.PI * u);
    position = {
      x:
        capture.intake.x +
        (capture.destination.x - capture.intake.x) * ease +
        x * (arc * 1.2),
      y:
        capture.intake.y +
        (capture.destination.y - capture.intake.y) * ease +
        arc * (2.5 + (i % 3) * 0.4) +
        ((i % 3) - 1) * 0.12 * arc,
      z:
        capture.intake.z +
        (capture.destination.z - capture.intake.z) * ease +
        z * (arc * 1.2),
    };
    scale = Math.min(1, u * 8);
    spin = (1 - ease) * 8;
  }
  return { visible: true, position, scale, spin };
}

// Eight closed spherical sectors assemble into the same radius as the marble.
// Close the cut planes so fragments remain solid from every viewing angle.
export function vacuumFragmentGeometry(i) {
  const sphere = new THREE.SphereGeometry(
    0.55,
    16,
    12,
    ((i % 4) * Math.PI) / 2,
    Math.PI / 2,
    (Math.floor(i / 4) * Math.PI) / 2,
    Math.PI / 2,
  );
  const position = sphere.attributes.position,
    uv = sphere.attributes.uv;
  const vertices = [],
    coords = [],
    edges = new Map(),
    points = new Map();
  const key = (j) =>
    [position.getX(j), position.getY(j), position.getZ(j)]
      .map((n) => Math.round(n * 1e7))
      .join(",");
  const put = (j) => {
    vertices.push(position.getX(j), position.getY(j), position.getZ(j));
    // SphereGeometry normalizes each partial sphere to its own UV rectangle.
    // Map back to the whole marble so assembled sectors retain its stripe count.
    coords.push(
      ((i % 4) + uv.getX(j)) / 4,
      (1 - Math.floor(i / 4) + uv.getY(j)) / 2,
    );
  };
  for (let k = 0; k < sphere.index.count; k += 3) {
    const tri = [0, 1, 2].map((n) => sphere.index.getX(k + n));
    tri.forEach(put);
    for (let n = 0; n < 3; n++) {
      const a = tri[n],
        b = tri[(n + 1) % 3],
        ka = key(a),
        kb = key(b);
      if (ka === kb) continue;
      points.set(ka, a);
      points.set(kb, b);
      const id = [ka, kb].sort().join("|");
      if (edges.has(id)) edges.delete(id);
      else edges.set(id, [ka, kb]);
    }
  }
  for (const [a, b] of edges.values()) {
    put(points.get(b));
    put(points.get(a));
    vertices.push(0, 0, 0);
    coords.push(0.1, 0.5);
  }
  sphere.dispose();
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3),
  );
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(coords, 2));
  geometry.computeVertexNormals();
  return geometry;
}

export function vacuumFragments(material) {
  const group = new THREE.Group();
  for (let i = 0; i < 8; i++) {
    const mesh = new THREE.Mesh(vacuumFragmentGeometry(i), material);
    mesh.castShadow = true;
    group.add(mesh);
  }
  group.visible = false;
  return group;
}

export function updateVacuumFragments(group, player, seconds) {
  group.visible = player.status === "falling" && !!player.vacuumCapture;
  if (!group.visible) return;
  group.children.forEach((mesh, i) => {
    const pose = vacuumFragmentPose(player.vacuumCapture, seconds, i);
    mesh.visible = pose.visible;
    if (!pose.visible) return;
    mesh.position.set(pose.position.x, pose.position.y, pose.position.z);
    mesh.scale.setScalar(pose.scale);
    const returning = seconds - player.vacuumCapture.tick / 120 >= 0.92;
    const remaining = returning ? pose.spin / 8 : 1;
    mesh.rotation.set(
      pose.spin + i * remaining,
      pose.spin * 0.7 + i * 0.4 * remaining,
      pose.spin * 0.3,
    );
  });
}
