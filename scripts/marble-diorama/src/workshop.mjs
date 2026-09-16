import { part, point } from "./course.mjs";

export function blankCourse() {
  return {
    schema: 1,
    id: `custom-${Date.now()}`,
    revision: 1,
    name: "My marble course",
    category: "custom",
    color: "#458b7a",
    time: 120,
    starts: [point(-0.7, 0.56, -3), point(0.7, 0.56, -3)],
    goal: { ...point(0, 0, 3), width: 5 },
    parts: [part("starting-floor", 0, 0, 8, 10)],
    zones: [],
    enemies: [],
    checkpoints: [],
    route: [],
  };
}

export function workshopObjects(course) {
  return [
    ...course.parts.map((p) => ({
      key: `part:${p.id}`,
      label: `${p.kind} · ${p.id}`,
      value: p,
    })),
    ...(course.zones ?? []).map((p, i) => ({
      key: `zone:${i}`,
      label: `${p.kind} ${i + 1}`,
      value: p,
    })),
    ...(course.enemies ?? []).map((p) => ({
      key: `enemy:${p.id}`,
      label: `${p.kind} · ${p.id}`,
      value: p,
    })),
    ...course.starts.map((p, i) => ({
      key: `start:${i}`,
      label: `Player ${i + 1} start`,
      value: p,
    })),
    ...(course.checkpoints ?? []).map((p, i) => ({
      key: `checkpoint:${i}`,
      label: `Checkpoint ${i + 1}`,
      value: p,
    })),
    { key: "goal:0", label: "Finish", value: course.goal },
  ];
}

export function moveWorkshopObject(course, key, position) {
  const p = workshopObjects(course).find((o) => o.key === key)?.value;
  if (!p) throw Error("Select an object to move.");
  const dx = position.x - p.x,
    dy = position.y - p.y,
    dz = position.z - p.z;
  // Ribbon/tube coordinates are local to the part; moving its origin moves all
  // of its vertices through the normal geometry compiler.
  Object.assign(p, position);
  for (const route of [
    course.route ?? [],
    ...(course.playerRoutes ?? []),
    ...(course.alternateRoutes ?? []).map((r) => r.route),
  ])
    for (const q of route ?? [])
      if (q.part === p.id) {
        q.x += dx;
        q.y += dy;
        q.z += dz;
      }
}

export function removeWorkshopObject(course, key) {
  const [type, id] = key.split(":");
  if (type === "part") {
    course.parts = course.parts.filter((p) => p.id !== id);
    for (const route of [
      course.route ?? [],
      ...(course.playerRoutes ?? []),
      ...(course.alternateRoutes ?? []).map((r) => r.route),
    ])
      for (const q of route ?? []) {
        if (q.part === id) delete q.part;
        if (q.waitFor?.part === id) delete q.waitFor;
      }
  } else if (type === "enemy")
    course.enemies = course.enemies.filter((p) => p.id !== id);
  else if (type === "zone") course.zones.splice(Number(id), 1);
  else if (type === "checkpoint") course.checkpoints.splice(Number(id), 1);
  else throw Error("Move starts and the finish instead of deleting them.");
}

export function rotateWorkshopObject(course, key, radians) {
  const p = workshopObjects(course).find((o) => o.key === key)?.value;
  if (!p) throw Error("Select an object to rotate.");
  if (p.path || p.outline) {
    const cs = Math.cos(radians),
      sn = Math.sin(radians);
    for (const v of p.path ?? p.outline) {
      const { x, z } = v;
      v.x = x * cs - z * sn;
      v.z = x * sn + z * cs;
    }
  } else p.angle = (p.angle ?? 0) + radians;
  if (p.direction) {
    const { x, z } = p.direction;
    p.direction.x = x * Math.cos(radians) - z * Math.sin(radians);
    p.direction.z = x * Math.sin(radians) + z * Math.cos(radians);
  }
}

export function makeWorkshopPart(kind, x, y, z, settings, id) {
  const {
    width = 6,
    depth = 6,
    rise = 0,
    angle = 0,
    material = "stone",
    bank = 1,
    amplitude = 0.6,
    period = 4,
    axis = "y",
    radius = 6,
  } = settings;
  const extra = { kind, material, angle: (angle * Math.PI) / 180, rise };
  if (kind === "channel") extra.bank = bank;
  if (kind === "wall") extra.h = Math.max(0.1, Math.abs(rise) || 2);
  if (["moving", "tilt", "piston"].includes(kind))
    extra.motion = {
      axis: kind === "tilt" ? "tilt" : axis,
      amplitude: kind === "tilt" ? (amplitude * Math.PI) / 180 : amplitude,
      period,
    };
  if (kind === "vanishing") {
    extra.kind = "moving";
    extra.motion = { axis: "y", amplitude: 0, period };
    extra.presence = { period, on: period * 0.75 };
  }
  if (kind === "spring")
    extra.launch = {
      forward: settings.forward ?? 7,
      lateral: 0,
      up: settings.up ?? 5,
      velocity: true,
    };
  if (["curve", "curved-channel", "tube"].includes(kind)) {
    if (radius <= width / 2)
      throw Error("Curve radius must exceed half its width.");
    extra.kind = kind === "tube" ? "tube" : "ribbon";
    const a = extra.angle,
      cs = Math.cos(a),
      sn = Math.sin(a);
    // A quarter-circle uses the same sampled ribbon / tube compiler as races.
    extra.path = Array.from({ length: 17 }, (_, i) => {
      const t = i / 16,
        theta = (t * Math.PI) / 2,
        lx = radius * (1 - Math.cos(theta)),
        lz = radius * Math.sin(theta);
      return {
        x: lx * cs - lz * sn,
        y: rise * t,
        z: lx * sn + lz * cs,
        width,
        bank: kind === "curved-channel" ? bank : 0,
      };
    });
    extra.angle = 0;
    if (kind === "tube") {
      extra.radius = width / 2;
      extra.thickness = 0.15;
    }
  }
  return part(id, x, z, width, depth, y, extra);
}
