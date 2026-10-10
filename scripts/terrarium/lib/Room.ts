import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {woodTextures, dataTexture, tileFbm} from './Textures';

/** The dim study around the case: table, back wall, shelves and an Edison lamp. */
export class Room {
  readonly group = new THREE.Group();
  readonly lampLight: THREE.PointLight;
  readonly bulb: THREE.MeshStandardMaterial;
  readonly envScene = new THREE.Scene();
  private envBulb: THREE.MeshBasicMaterial;

  constructor() {
    const tableTop = -0.075;
    const wood = woodTextures(1024, 7, [52, 30, 18]);
    wood.color.repeat.set(1.2, 3.2);
    wood.rough.repeat.copy(wood.color.repeat);
    const tableMat = new THREE.MeshPhysicalMaterial({
      map: wood.color, roughnessMap: wood.rough, roughness: 0.55, clearcoat: 0.55, clearcoatRoughness: 0.22,
    });
    const table = new THREE.Mesh(new RoundedBoxGeometry(4.2, 0.06, 1.7, 2, 0.008), tableMat);
    table.position.set(0, tableTop - 0.03, 0.12);
    table.receiveShadow = true;
    this.group.add(table);

    // Back wall: dark plaster with soft variation.
    const plaster = dataTexture(512, 512, (x, y, o) => {
      const n = tileFbm(x / 512 * 6, y / 512 * 6, 6, 5, 21);
      const v = 30 + 26 * n;
      o[0] = v * 1.05; o[1] = v * 0.86; o[2] = v * 0.68;
    });
    plaster.repeat.set(3, 2);
    const wallMat = new THREE.MeshStandardMaterial({map: plaster, roughness: 0.95});
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(9, 4), wallMat);
    wall.position.set(0, 1.2, -1.6);
    wall.receiveShadow = true;
    this.group.add(wall);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(9, 6), new THREE.MeshStandardMaterial({color: 0x120c08, roughness: 0.8}));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.85;
    this.group.add(floor);

    // Shelf with books and jars on the right, blurred by depth of field.
    const shelfWood = new THREE.MeshStandardMaterial({map: wood.color, roughness: 0.6, color: 0x9a8a80});
    const shelfGroup = new THREE.Group();
    for (const y of [0.25, 0.75]) {
      const board = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.03, 0.32), shelfWood);
      board.position.set(0, y, 0);
      board.castShadow = board.receiveShadow = true;
      shelfGroup.add(board);
    }
    const rnd = (() => {let s = 99; return () => ((s = (s * 16807) % 2147483647) / 2147483647);})();
    const bookColors = [0x3b1e14, 0x5a3a1c, 0x24301f, 0x4a1714, 0x2b2a3a, 0x6b5132, 0x1f2a2c];
    for (const y of [0.265, 0.765]) {
      let x = -0.66;
      while (x < 0.6) {
        if (rnd() < 0.12) {x += 0.12; continue;}
        const w = 0.025 + rnd() * 0.035, h = 0.16 + rnd() * 0.12;
        const book = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.18 + rnd() * 0.05), new THREE.MeshStandardMaterial({color: bookColors[Math.floor(rnd() * bookColors.length)], roughness: 0.7}));
        book.position.set(x + w / 2, y + h / 2, 0.02);
        book.rotation.z = rnd() < 0.1 ? 0.2 : 0;
        shelfGroup.add(book);
        x += w + 0.004;
      }
    }
    const jarMat = new THREE.MeshPhysicalMaterial({color: 0x9db08a, roughness: 0.1, transmission: 0, transparent: true, opacity: 0.35});
    for (const [x, h] of [[-0.2, 0.18], [0.35, 0.13]]) {
      const jar = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, h, 24), jarMat);
      jar.position.set(x, 0.265 + h / 2, 0.06);
      shelfGroup.add(jar);
    }
    shelfGroup.position.set(1.75, 0.05, -1.35);
    this.group.add(shelfGroup);

    // Edison lamp at the left.
    const brass = new THREE.MeshStandardMaterial({color: 0xb08d57, metalness: 1, roughness: 0.32});
    const lamp = new THREE.Group();
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.09, 0.025, 40), brass);
    base.position.y = tableTop + 0.0125;
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.52, 16), brass);
    stem.position.y = tableTop + 0.27;
    const socket = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.05, 24), brass);
    socket.position.y = tableTop + 0.55;
    this.bulb = new THREE.MeshStandardMaterial({color: 0x000000, emissive: new THREE.Color(1.0, 0.55, 0.2), emissiveIntensity: 14, roughness: 0.2});
    const bulbGlass = new THREE.Mesh(new THREE.SphereGeometry(0.045, 32, 24), new THREE.MeshPhysicalMaterial({color: 0xffd9a0, roughness: 0.05, transparent: true, opacity: 0.25, emissive: new THREE.Color(1.0, 0.6, 0.25), emissiveIntensity: 0.6}));
    bulbGlass.scale.set(1, 1.35, 1);
    bulbGlass.position.y = tableTop + 0.625;
    const filament = new THREE.Mesh(new THREE.TorusKnotGeometry(0.012, 0.0012, 64, 6, 2, 5), this.bulb);
    filament.position.y = tableTop + 0.62;
    lamp.add(base, stem, socket, bulbGlass, filament);
    lamp.position.set(-1.12, 0, -0.32);
    lamp.traverse((o) => {if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).castShadow = true;});
    bulbGlass.castShadow = false; filament.castShadow = false;
    this.group.add(lamp);
    this.lampLight = new THREE.PointLight(0xffa860, 2.2, 6, 2);
    this.lampLight.position.set(-1.12, tableTop + 0.62, -0.32);
    this.group.add(this.lampLight);

    // Environment used for reflections (brass, glass, water, eyes).
    const env = this.envScene;
    const box = new THREE.Mesh(new THREE.BoxGeometry(8, 4, 8), new THREE.MeshBasicMaterial({color: new THREE.Color(0.035, 0.025, 0.018), side: THREE.BackSide}));
    box.position.y = 1.2;
    env.add(box);
    this.envBulb = new THREE.MeshBasicMaterial({color: new THREE.Color(9, 5, 2)});
    const eb = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 12), this.envBulb);
    eb.position.set(-1.6, 0.6, -0.4);
    env.add(eb);
    const panel = (c: THREE.Color, w: number, h: number, p: THREE.Vector3, ry: number) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({color: c, side: THREE.DoubleSide}));
      m.position.copy(p); m.rotation.y = ry; env.add(m);
    };
    panel(new THREE.Color(0.5, 0.36, 0.22), 2.2, 0.9, new THREE.Vector3(0, 2.4, 0.4), 0); // ceiling glow
    panel(new THREE.Color(0.25, 0.18, 0.12), 2.5, 1.4, new THREE.Vector3(0, 1.0, 3.5), Math.PI); // room behind camera
    panel(new THREE.Color(0.18, 0.2, 0.22), 1.0, 1.4, new THREE.Vector3(3.6, 1.2, 0.5), -Math.PI / 2); // cool window
    const tableEnv = new THREE.Mesh(new THREE.PlaneGeometry(6, 3), new THREE.MeshBasicMaterial({color: new THREE.Color(0.06, 0.035, 0.02)}));
    tableEnv.rotation.x = -Math.PI / 2; tableEnv.position.y = -0.1;
    env.add(tableEnv);
  }

  setLampLevel(level: number) {
    this.bulb.emissiveIntensity = 14 * level;
    this.lampLight.intensity = 2.2 * level;
    this.envBulb.color.setRGB(9 * level + 0.2, 5 * level + 0.1, 2 * level + 0.05);
  }
}
