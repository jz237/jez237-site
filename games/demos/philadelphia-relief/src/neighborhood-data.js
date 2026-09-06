import { triangulate } from './vectors.js?v=philly-2026090612';

export function metres(value) {
  const number = parseFloat(value);
  if (!Number.isFinite(number) || number < 0) return null;
  return /ft|feet|'/.test(String(value)) ? number * 0.3048 : number;
}

export function neighborhoodBuildings(doc, projection) {
  return doc.elements.filter(e => e.tags?.building && e.geometry?.length >= 4).map(e => {
    const ring = e.geometry.slice();
    if (ring[0][0] === ring.at(-1)[0] && ring[0][1] === ring.at(-1)[1]) ring.pop();
    const tags = e.tags;
    const measured = metres(tags.height), levels = metres(tags['building:levels']);
    const minHeight = Math.min(300, metres(tags.min_height) || 0);
    const height = Math.max(2, Math.min(450, measured || (levels ? levels * 3.3 : 9)) - minHeight);
    const poly = new Float32Array(ring.flatMap(([lon,lat]) =>
      [projection.lonToX(lon), projection.latToZ(lat)]));
    return { poly, height, minHeight, source: measured ? 'measured' : levels ? 'levels' : 'default',
      name: tags.name || '', address: [tags['addr:housenumber'],
      tags['addr:street']].filter(Boolean).join(' '),
      named: !!tags.name, year: 0, roofShape: tags['roof:shape'] || 'unknown',
      roofHeight: Math.min(height * 0.7, metres(tags['roof:height'])
        || (metres(tags['roof:levels']) || 1) * 2.5),
      roofAcross: tags['roof:orientation'] === 'across',
      roofDirection: Number.isFinite(Number(tags['roof:direction'])) ? Number(tags['roof:direction']) : null,
    };
  }).filter(b => b.poly.length >= 6).sort((a,b) => b.height - a.height);
}

/** Roof profile follows mapped shape/orientation; dimensions use tagged values when supplied. */
export function roofProfile(building) {
  const poly = building.poly;
  let longest = 0, ax = 1, az = 0;
  for (let i = 0; i < poly.length; i += 2) {
    const j = (i + 2) % poly.length, dx = poly[j] - poly[i], dz = poly[j+1] - poly[i+1];
    const length = Math.hypot(dx,dz);
    if (length > longest) { longest = length; ax = dx/length; az = dz/length; }
  }
  if (building.roofAcross) [ax,az] = [-az,ax];
  if (building.roofDirection !== null && building.roofDirection !== undefined) {
    const angle = building.roofDirection * Math.PI / 180; ax = Math.cos(angle); az = Math.sin(angle);
  }
  const points = [];
  for (let i = 0; i < poly.length; i += 2) points.push([poly[i]*ax+poly[i+1]*az, -poly[i]*az+poly[i+1]*ax]);
  const us = points.map(p => p[0]), vs = points.map(p => p[1]);
  const u0 = Math.min(...us), u1 = Math.max(...us), v0 = Math.min(...vs), v1 = Math.max(...vs);
  const pitched = ['gabled','hipped','pyramidal','skillion'].includes(building.roofShape);
  const rise = pitched ? building.roofHeight : 0;
  return (x,z) => {
    const u = (x*ax+z*az-u0)/Math.max(0.1,u1-u0);
    const v = (-x*az+z*ax-v0)/Math.max(0.1,v1-v0);
    let shape = 1;
    if (building.roofShape === 'gabled') shape = 1-Math.abs(v*2-1);
    if (building.roofShape === 'hipped' || building.roofShape === 'pyramidal') {
      shape = Math.min(1-Math.abs(v*2-1), (1-Math.abs(u*2-1))
        * (building.roofShape === 'hipped' ? (u1-u0)/Math.max(0.1,v1-v0) : 1));
    }
    if (building.roofShape === 'skillion') shape = v;
    return building.height - rise + rise * Math.max(0,Math.min(1,shape));
  };
}

/** Consolidated local geometry retains precise footprints and subdivides mapped pitched roofs. */
export function localBuildingSolids(buildings, groundAt) {
  const position = [], ground = [], info = [], year = [], index = [], buildingEnd = [], facadeOrigin = [];
  for (const b of buildings) {
    const ring = [];
    for (let i = 0; i < b.poly.length; i += 2) ring.push([b.poly[i],b.poly[i+1]]);
    const g = groundAt(ring.reduce((a,p) => a+p[0],0)/ring.length,
      ring.reduce((a,p) => a+p[1],0)/ring.length);
    const cx = ring.reduce((a,p) => a+p[0],0)/ring.length;
    const cz = ring.reduce((a,p) => a+p[1],0)/ring.length;
    const roof = roofProfile(b);
    const vertex = (p,h) => {
      index.push(position.length/3); position.push(p[0],h,p[1]);
      facadeOrigin.push(cx,cz);
      ground.push(g); info.push(b.height,b.minHeight); year.push(0);
    };
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], c = ring[(i+1)%ring.length];
      // Subdivision preserves gable peaks along walls as well as across the roof.
      const count = b.roofShape === 'unknown' || b.roofShape === 'flat' ? 1 : 8;
      for (let j = 0; j < count; j++) {
        const p = a.map((v,k) => v+(c[k]-v)*j/count);
        const q = a.map((v,k) => v+(c[k]-v)*(j+1)/count);
        vertex(p,0); vertex(q,0); vertex(q,roof(...q));
        vertex(p,0); vertex(q,roof(...q)); vertex(p,roof(...p));
      }
    }
    const triangle = (a,c,d,depth) => {
      if (!depth) { vertex(a,roof(...a)); vertex(c,roof(...c)); vertex(d,roof(...d)); return; }
      const ac = a.map((v,k) => (v+c[k])/2), cd = c.map((v,k) => (v+d[k])/2);
      const da = d.map((v,k) => (v+a[k])/2);
      triangle(a,ac,da,depth-1); triangle(ac,c,cd,depth-1);
      triangle(da,cd,d,depth-1); triangle(ac,cd,da,depth-1);
    };
    const tris = triangulate(ring);
    const depth = ['gabled','hipped','pyramidal','skillion'].includes(b.roofShape) ? 3 : 0;
    for (let i = 0; i < tris.length; i += 3) triangle(ring[tris[i]],ring[tris[i+1]],ring[tris[i+2]],depth);
    buildingEnd.push(index.length);
  }
  return { position: new Float32Array(position), ground: new Float32Array(ground),
    facadeOrigin: new Float32Array(facadeOrigin),
    info: new Float32Array(info), year: new Float32Array(year), index: new Uint32Array(index),
    buildingEnd: new Uint32Array(buildingEnd), vertexCount: position.length/3,
    indexCount: index.length, buildingCount: buildings.length };
}

export function neighborhoodLabels(doc) {
  const labels = [];
  for (const e of doc.elements) {
    const t = e.tags || {};
    if (t.highway && t.name && e.geometry?.length > 1) {
      const middle = e.geometry[Math.floor(e.geometry.length/2)];
      labels.push({ name: t.name, lon: middle[0], lat: middle[1], kind: 'street', rank: 1.8 });
    }
    if (t['addr:housenumber']) {
      const ring = e.geometry;
      const lon = e.lon ?? ring?.reduce((a,p) => a+p[0],0)/ring?.length;
      const lat = e.lat ?? ring?.reduce((a,p) => a+p[1],0)/ring?.length;
      if (Number.isFinite(lon) && Number.isFinite(lat)) labels.push({
        name: t['addr:housenumber'],
        note: [t['addr:housenumber'],t['addr:street']].filter(Boolean).join(' '),
        lon,lat,kind: 'address',rank: 2.1,
      });
    }
  }
  return labels;
}
