import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { L, columnSpots, COLUMN_BRACKET_Y } from './layout.js';
import { scanMaps, planarUVs, tileOf } from '../materials/scans.js';

// The Victorian glasshouse: cast-iron barrel vault, glazed walls on a stone
// plinth, columns with scroll brackets, and a great fan window at the far end.

function archPoint(x, house) {
  const xc = (house.x0 + house.x1) / 2;
  const hw = (house.x1 - house.x0) / 2;
  const rise = house.ridge - house.wall;
  const k = (x - xc) / hw;
  return house.wall + rise * Math.sqrt(Math.max(0, 1 - k * k));
}

export class Greenhouse {
  constructor(mat, quality, stoneTex) {
    const H = L.house;
    this.group = new THREE.Group();
    this.group.name = 'greenhouse';
    const g = this.group;
    const xc = (H.x0 + H.x1) / 2;
    const hw = (H.x1 - H.x0) / 2;
    const length = H.z0 - H.z1;

    const iron = mat.iron;
    // (with the scans: the path's photographed stone, at its true scale on
    // the plinths, whose UVs are taken from the world)
    const scan = scanMaps('path', { fallback: stoneTex });
    const stone = new THREE.MeshStandardMaterial({ color: '#8d8473', map: stoneTex, roughness: 0.85, metalness: 0, ...scan });
    if (scan.map) stone.setValues({ color: '#b9b09f', roughness: 1 });
    this.stone = stone;
    const tile = tileOf('path');
    const worldUV = (geo, x, y, z) => (scan.map ? planarUVs(geo, new THREE.Matrix4().makeTranslation(x, y, z), tile, [x * 0.007, 0.3]) : geo);

    // floor
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(H.x1 - H.x0 + 40, length + 40), new THREE.MeshStandardMaterial({ color: '#4a4338', map: stoneTex, roughness: 0.9 }));
    floor.material.map = stoneTex.clone();
    floor.material.map.repeat.set(12, 24);
    floor.material.map.needsUpdate = true;
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(xc, -2.5, (H.z0 + H.z1) / 2);
    floor.receiveShadow = true;
    g.add(floor);

    // stone plinths along both side walls
    for (const x of [H.x0, H.x1]) {
      const pl = new THREE.Mesh(worldUV(new THREE.BoxGeometry(18, 70, length), x, 33, (H.z0 + H.z1) / 2), stone);
      pl.position.set(x, 33, (H.z0 + H.z1) / 2);
      pl.receiveShadow = true;
      g.add(pl);
    }

    // ribs every bay: arch + wall posts, instanced as one merged geometry
    const bay = 95;
    const ribPts = [];
    ribPts.push(new THREE.Vector3(H.x0, 68, 0));
    ribPts.push(new THREE.Vector3(H.x0, H.wall, 0));
    for (let i = 1; i < 40; i++) {
      const x = H.x0 + (i / 40) * (H.x1 - H.x0);
      ribPts.push(new THREE.Vector3(x, archPoint(x, H), 0));
    }
    ribPts.push(new THREE.Vector3(H.x1, H.wall, 0));
    ribPts.push(new THREE.Vector3(H.x1, 68, 0));
    const ribCurve = new THREE.CatmullRomCurve3(ribPts, false, 'centripetal', 0.1);
    const ribGeo = new THREE.TubeGeometry(ribCurve, 240, 3.2, 8, false);
    // decorative inner scroll braces at the eaves
    const braces = [];
    for (const side of [-1, 1]) {
      const bx = side < 0 ? H.x0 : H.x1;
      const pts = [];
      for (let k = 0; k <= 16; k++) {
        const a = (k / 16) * Math.PI * 0.5;
        pts.push(new THREE.Vector3(bx - side * (1 - Math.cos(a)) * 60, H.wall - 70 + Math.sin(a) * 70, 0));
      }
      braces.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, 1.6, 6, false));
      // little scroll curl
      const curl = [];
      for (let k = 0; k <= 30; k++) {
        const a = (k / 30) * Math.PI * 3;
        const r = 14 * (1 - k / 34);
        curl.push(new THREE.Vector3(bx - side * (34 + Math.cos(a) * r), H.wall - 30 + Math.sin(a) * r, 0));
      }
      braces.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(curl), 40, 1.1, 6, false));
    }
    const ribAll = mergeGeometries([ribGeo, ...braces].map((x) => x.toNonIndexed()));
    const nBays = Math.floor(length / bay) + 1;
    const ribs = new THREE.InstancedMesh(ribAll, iron, nBays);
    const m4 = new THREE.Matrix4();
    for (let i = 0; i < nBays; i++) {
      m4.makeTranslation(0, 0, H.z0 - i * bay);
      ribs.setMatrixAt(i, m4);
    }
    ribs.castShadow = true;
    g.add(ribs);

    // purlins running the length of the house (along the arch)
    const purlinGeo = new THREE.CylinderGeometry(1.1, 1.1, length, 6);
    purlinGeo.rotateX(Math.PI / 2);
    const nP = 22;
    const purlins = new THREE.InstancedMesh(purlinGeo, iron, nP + 6);
    let pi = 0;
    for (let i = 1; i < nP; i++) {
      const x = H.x0 + (i / nP) * (H.x1 - H.x0);
      m4.makeTranslation(x, archPoint(x, H) - 1, (H.z0 + H.z1) / 2);
      purlins.setMatrixAt(pi++, m4);
    }
    for (const x of [H.x0, H.x1]) {
      for (const y of [68, 160, 250, H.wall]) {
        m4.makeTranslation(x, y, (H.z0 + H.z1) / 2);
        purlins.setMatrixAt(pi++, m4);
      }
    }
    purlins.count = pi;
    purlins.castShadow = true;
    g.add(purlins);

    // glazing: roof vault and walls
    const roofGeo = new THREE.BufferGeometry();
    const pos = [];
    const idx = [];
    const SX = 48;
    for (let i = 0; i <= SX; i++) {
      const x = H.x0 + (i / SX) * (H.x1 - H.x0);
      const y = archPoint(x, H);
      pos.push(x, y, H.z0, x, y, H.z1);
    }
    for (let i = 0; i < SX; i++) {
      const a = i * 2;
      idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
    roofGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    roofGeo.setIndex(idx);
    roofGeo.computeVertexNormals();
    const roof = new THREE.Mesh(roofGeo, mat.paneGlass);
    roof.renderOrder = 2;
    g.add(roof);
    for (const x of [H.x0, H.x1]) {
      const wall = new THREE.Mesh(new THREE.PlaneGeometry(length, H.wall - 68), mat.paneGlass);
      wall.rotation.y = Math.PI / 2;
      wall.position.set(x, (H.wall + 68) / 2, (H.z0 + H.z1) / 2);
      wall.renderOrder = 2;
      g.add(wall);
    }
    // mullions on the walls (vertical) every ~32 units
    const mullGeo = new THREE.BoxGeometry(1.4, H.wall - 68, 1.4);
    const nM = Math.floor(length / 32);
    const mulls = new THREE.InstancedMesh(mullGeo, iron, nM * 2);
    let mi = 0;
    for (const x of [H.x0, H.x1]) {
      for (let i = 0; i < nM; i++) {
        m4.makeTranslation(x, (H.wall + 68) / 2, H.z0 - i * 32);
        mulls.setMatrixAt(mi++, m4);
      }
    }
    g.add(mulls);

    // far end wall: glass with a great fan window of iron tracery
    const endZ = H.z1;
    const endGlass = new THREE.Mesh(new THREE.PlaneGeometry(H.x1 - H.x0, H.ridge), mat.paneGlass);
    endGlass.position.set(xc, H.ridge / 2, endZ);
    g.add(endGlass);
    const tracery = [];
    const fanC = new THREE.Vector3(xc, H.wall - 40, endZ + 1);
    const fanR = 230;
    for (let r = 1; r <= 3; r++) {
      const pts = [];
      for (let k = 0; k <= 40; k++) {
        const a = (k / 40) * Math.PI;
        pts.push(new THREE.Vector3(fanC.x + Math.cos(a) * fanR * (r / 3), fanC.y + Math.sin(a) * fanR * (r / 3), fanC.z));
      }
      tracery.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, 2.2, 6, false));
    }
    for (let s = 0; s <= 12; s++) {
      const a = (s / 12) * Math.PI;
      const pts = [fanC.clone().add(new THREE.Vector3(Math.cos(a) * fanR * 0.33, Math.sin(a) * fanR * 0.33, 0)), fanC.clone().add(new THREE.Vector3(Math.cos(a) * fanR, Math.sin(a) * fanR, 0))];
      tracery.push(new THREE.TubeGeometry(new THREE.LineCurve3(pts[0], pts[1]), 2, 1.8, 6, false));
    }
    // rosette at the hub
    for (let p = 0; p < 8; p++) {
      const a = (p / 8) * Math.PI * 2;
      const c = new THREE.Vector3(fanC.x + Math.cos(a) * 40, fanC.y + Math.sin(a) * 40 + 0, fanC.z);
      const pts = [];
      for (let k = 0; k <= 20; k++) {
        const b = (k / 20) * Math.PI * 2;
        pts.push(new THREE.Vector3(c.x + Math.cos(b) * 22, c.y + Math.sin(b) * 22, c.z));
      }
      tracery.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 30, 1.4, 5, true));
    }
    // vertical mullions on the end wall below and beside the fan
    for (let i = -6; i <= 6; i++) {
      const x = xc + i * 50;
      const a = new THREE.Vector3(x, 0, endZ + 1);
      const b = new THREE.Vector3(x, archPoint(x, H), endZ + 1);
      tracery.push(new THREE.TubeGeometry(new THREE.LineCurve3(a, b), 2, 1.6, 6, false));
    }
    const tr = new THREE.Mesh(mergeGeometries(tracery.map((x) => x.toNonIndexed())), iron);
    g.add(tr);

    // cast-iron columns along the beds with gilded capitals
    const colGeo = (() => {
      const shaft = new THREE.CylinderGeometry(3.2, 4, H.wall + 40, 12);
      shaft.translate(0, (H.wall + 40) / 2, 0);
      const base = new THREE.CylinderGeometry(7, 8, 10, 12);
      base.translate(0, 5, 0);
      return mergeGeometries([shaft.toNonIndexed(), base.toNonIndexed()]);
    })();
    const capGeo = new THREE.CylinderGeometry(7, 3.4, 9, 12);
    capGeo.translate(0, H.wall + 40, 0);
    const colsX = [-118, 168];
    const nCols = 8;
    const cols = new THREE.InstancedMesh(colGeo, iron, colsX.length * nCols);
    const caps = new THREE.InstancedMesh(capGeo, mat.gold, colsX.length * nCols);
    let ci = 0;
    for (const x of colsX) {
      for (let i = 0; i < nCols; i++) {
        m4.makeTranslation(x, 0, 150 - i * 150);
        cols.setMatrixAt(ci, m4);
        caps.setMatrixAt(ci, m4);
        ci++;
      }
    }
    cols.castShadow = true;
    g.add(cols, caps);
    // gilded bands up each column, and a scroll bracket that carries a lantern toward the path
    {
      const bands = [], arms = [];
      for (const y of [12, 64, 118, 190]) {
        const b = new THREE.TorusGeometry(y < 20 ? 7.4 : 3.9, y < 20 ? 0.9 : 0.75, 6, 20);
        b.rotateX(Math.PI / 2);
        b.translate(0, y, 0);
        bands.push(b);
      }
      const armPts = [];
      for (let k = 0; k <= 8; k++) armPts.push(new THREE.Vector3(3.5 + k * 1.9, COLUMN_BRACKET_Y + Math.sin((k / 8) * Math.PI) * 1.2, 0));
      arms.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(armPts), 12, 0.75, 6, false));
      const scroll = [];
      for (let k = 0; k <= 24; k++) {
        const a = (k / 24) * Math.PI * 1.7, r = 8 * (1 - k / 34);
        scroll.push(new THREE.Vector3(3.6 + r * (1 - Math.cos(a)) * 0.75 + k * 0.08, COLUMN_BRACKET_Y - Math.sin(a) * r - k * 0.2, 0));
      }
      arms.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(scroll), 30, 0.5, 6, false));
      const bandG = mergeGeometries(bands.map((x) => x.toNonIndexed()));
      const armG = mergeGeometries(arms.map((x) => x.toNonIndexed()));
      const spots = columnSpots();
      const bm = new THREE.InstancedMesh(bandG, mat.gold, spots.length);
      const am = new THREE.InstancedMesh(armG, iron, spots.length);
      const xc = (L.pathX[0] + L.pathX[1]) / 2;
      spots.forEach(([x, z], i) => {
        m4.makeTranslation(x, 0, z);
        bm.setMatrixAt(i, m4);
        // (the arm is built toward +x: turned to face the path)
        m4.makeRotationY(x < xc ? 0 : Math.PI).setPosition(x, 0, z);
        am.setMatrixAt(i, m4);
      });
      am.castShadow = true;
      g.add(bm, am);
    }

    g.traverse((o) => {
      if (o.isMesh && o.material !== mat.paneGlass) o.receiveShadow = true;
    });
  }
}

export { archPoint };
